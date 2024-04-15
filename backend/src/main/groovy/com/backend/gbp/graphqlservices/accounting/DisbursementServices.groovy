package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.Bank
import com.backend.gbp.domain.accounting.Disbursement
import com.backend.gbp.domain.accounting.Integration
import com.backend.gbp.domain.accounting.IntegrationDomainEnum
import com.backend.gbp.domain.accounting.IntegrationItem
import com.backend.gbp.domain.accounting.JournalType
import com.backend.gbp.domain.accounting.Ledger
import com.backend.gbp.domain.accounting.LedgerDocType
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.OfficeRepository
import com.backend.gbp.repository.inventory.ReceivingRepository
import com.backend.gbp.rest.dto.journal.JournalEntryViewDto
import com.backend.gbp.rest.dto.payables.ApReferenceDto
import com.backend.gbp.rest.dto.payables.DisbursementApDto
import com.backend.gbp.rest.dto.payables.DisbursementDto
import com.backend.gbp.rest.dto.payables.DisbursementExpDto
import com.backend.gbp.rest.dto.payables.DisbursementWtxDto
import com.backend.gbp.security.SecurityUtils
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.GeneratorType
import com.fasterxml.jackson.databind.ObjectMapper
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.BooleanUtils
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

import java.math.RoundingMode
import java.time.ZoneId
import java.time.format.DateTimeFormatter

@Service
@GraphQLApi
class DisbursementServices extends AbstractDaoService<Disbursement> {

	@Autowired
	GeneratorService generatorService

	@Autowired
	ObjectMapper objectMapper

	@Autowired
	AccountsPayableDetialServices accountsPayableDetialServices

	@Autowired
	ApLedgerServices apLedgerServices

	@Autowired
	JdbcTemplate jdbcTemplate

	@Autowired
	ReceivingRepository receivingReportRepository

	@Autowired
	IntegrationServices integrationServices

	@Autowired
	LedgerServices ledgerServices

	@Autowired
	DisbursementCheckServices disbursementCheckServices

	@Autowired
	DisbursementApServices disbursementApServices

	@Autowired
	DisbursementExpenseServices disbursementExpenseServices

	@Autowired
	DisbursementWtxServices disbursementWtxServices

	@Autowired
	Wtx2307Service wtx2307Service

	@Autowired
	AccountsPayableServices accountsPayableServices

	@Autowired
	OfficeRepository officeRepository

	@Autowired
	NamedParameterJdbcTemplate namedParameterJdbcTemplate

    DisbursementServices() {
		super(Disbursement.class)
	}
	
	@GraphQLQuery(name = "disbursementById")
	Disbursement disbursementById(
			@GraphQLArgument(name = "id") UUID id
	) {
		findOne(id)
	}

	@GraphQLQuery(name = "disReferenceType", description = "Find Ap reference Type")
	List<ApReferenceDto> disReferenceType() {

		List<ApReferenceDto> records = []

		String query = '''select distinct p.reference_type as reference_type from accounting.disbursement p where p.reference_type is not null '''


		Map<String, Object> params = new HashMap<>()


		def recordsRaw= namedParameterJdbcTemplate.queryForList(query, params)

		recordsRaw.each {
			records << new ApReferenceDto(
					referenceType: StringUtils.upperCase( it.get("reference_type","") as String)
			)
		}

		return records

	}

	@GraphQLQuery(name = "disbursementFilterPosted", description = "List of AP Pageable By Supplier")
	Page<Disbursement> apListBySupplierFilter(
			@GraphQLArgument(name = "filter") String filter,
			@GraphQLArgument(name = "supplier") UUID supplier,
			@GraphQLArgument(name = "page") Integer page,
			@GraphQLArgument(name = "size") Integer size
	) {
		cc

		String query = '''Select d from Disbursement d where
							d.posted = true and
						( lower(d.disNo) like lower(concat('%',:filter,'%')) )'''

		String countQuery = '''Select count(d) from Disbursement d where
							d.posted = true and
							( lower(d.disNo) like lower(concat('%',:filter,'%')) ) '''

		Map<String, Object> params = new HashMap<>()
		params.put('filter', filter)

		if (company) {
			query += ''' and (d.company = :company) '''
			countQuery += ''' and (d.company = :company) '''
			params.put("company", company)
		}

		if (supplier) {
			query += ''' and (d.supplier.id = :supplier) '''
			countQuery += ''' and (d.supplier.id = :supplier) '''
			params.put("supplier", supplier)
		}

		query += ''' ORDER BY d.disNo DESC'''

		getPageable(query, countQuery, page, size, params)
	}

	@GraphQLQuery(name = "disbursementFilter", description = "List of Disbursement Pageable")
	Page<Disbursement> disbursementFilter(
			@GraphQLArgument(name = "filter") String filter,
			@GraphQLArgument(name = "supplier") UUID supplier,
			@GraphQLArgument(name = "status") Boolean status,
			@GraphQLArgument(name = "start") String start,
			@GraphQLArgument(name = "end") String end,
			@GraphQLArgument(name = "page") Integer page,
			@GraphQLArgument(name = "size") Integer size
	) {
		def company = SecurityUtils.currentCompanyId()

		String query = '''Select d from Disbursement d where
						( lower(d.disNo) like lower(concat('%',:filter,'%')) )
						and to_date(to_char(d.disDate, 'YYYY-MM-DD'),'YYYY-MM-DD')
             			between to_date(:start,'YYYY-MM-DD') and  to_date(:end,'YYYY-MM-DD')'''

		String countQuery = '''Select count(d) from Disbursement d where
							( lower(d.disNo) like lower(concat('%',:filter,'%')) )
							and to_date(to_char(d.disDate, 'YYYY-MM-DD'),'YYYY-MM-DD')
             			between to_date(:start,'YYYY-MM-DD') and  to_date(:end,'YYYY-MM-DD')'''

		Map<String, Object> params = new HashMap<>()
		params.put('filter', filter)
		params.put('start', start)
		params.put('end', end)

		if (company) {
			query += ''' and (d.company = :company) '''
			countQuery += ''' and (d.company = :company) '''
			params.put("company", company)
		}

		if (supplier) {
			query += ''' and (d.supplier.id = :supplier) '''
			countQuery += ''' and (d.supplier.id = :supplier) '''
			params.put("supplier", supplier)
		}

		if (status) {
			query += ''' and (d.posted = :status or d.posted is null) '''
			countQuery += ''' and (d.posted = :status or d.posted is null) '''
			params.put("status", !status)
		}

		query += ''' ORDER BY d.disNo DESC'''

		getPageable(query, countQuery, page, size, params)
	}

	//mutations

	//updated API for disbursement
	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "disbursementUpsert")
	Disbursement disbursementUpsert(
			@GraphQLArgument(name = "fields") Map<String, Object> fields,
			@GraphQLArgument(name = "checks") ArrayList<Map<String, Object>> checks,
			@GraphQLArgument(name = "ap") ArrayList<Map<String, Object>> ap,
			@GraphQLArgument(name = "expense") ArrayList<Map<String, Object>> expense,
			@GraphQLArgument(name = "wtx") ArrayList<Map<String, Object>> wtx,
			@GraphQLArgument(name = "id") UUID id
	) {
		def disCat = 'CK';
		def company = SecurityUtils.currentCompanyId()

		def dis = upsertFromMap(id, fields, { Disbursement entity, boolean forInsert ->
			if (forInsert) {
				def type = fields['disType'] as String
				if(type.equalsIgnoreCase("CASH")){
					disCat = 'CS'
				}
				entity.disNo = generatorService.getNextValue(GeneratorType.DISNO, {
					return "${disCat}-" + StringUtils.leftPad(it.toString(), 6, "0")
				})
				//round numbers to 2 decimal
				entity.cash = entity.cash.setScale(2, RoundingMode.HALF_EVEN)
				entity.checks = entity.checks.setScale(2, RoundingMode.HALF_EVEN)
				entity.discountAmount = entity.discountAmount.setScale(2, RoundingMode.HALF_EVEN)
				entity.ewtAmount = entity.ewtAmount.setScale(2, RoundingMode.HALF_EVEN)
				entity.voucherAmount = entity.voucherAmount.setScale(2, RoundingMode.HALF_EVEN)
				entity.appliedAmount = entity.appliedAmount.setScale(2, RoundingMode.HALF_EVEN)

				entity.company = company
				entity.status = "DRAFT"
				entity.posted = false

			}else{
				//round numbers to 2 decimal
				entity.cash = entity.cash.setScale(2, RoundingMode.HALF_EVEN)
				entity.checks = entity.checks.setScale(2, RoundingMode.HALF_EVEN)
				entity.discountAmount = entity.discountAmount.setScale(2, RoundingMode.HALF_EVEN)
				entity.ewtAmount = entity.ewtAmount.setScale(2, RoundingMode.HALF_EVEN)
				entity.voucherAmount = entity.voucherAmount.setScale(2, RoundingMode.HALF_EVEN)
				entity.appliedAmount = entity.appliedAmount.setScale(2, RoundingMode.HALF_EVEN)
			}
		})


		def parentId = dis.id

		if(dis.paymentCategory.equalsIgnoreCase("PAYABLE")){
			//================ delete start here =======================
			disbursementExpenseServices.removeExpenseByList(parentId)
			disbursementWtxServices.removeWtxList(parentId)
			if(dis.disType.equalsIgnoreCase("CASH")){
				disbursementCheckServices.removeCheckList(parentId)
			}
			//================ delete end here =======================

			//===================== SAVE DISBURSEMENT APPLICATION HERE ============================
			def disAp = ap as ArrayList<DisbursementApDto>
			disAp.each {
				def dto = objectMapper.convertValue(it, DisbursementApDto.class)
				disbursementApServices.upsertDisAp(dto, dis)
			}
			//===================== SAVE DISBURSEMENT APPLICATION END HERE ============================

		}else if(dis.paymentCategory.equalsIgnoreCase("EXPENSE")){
			//================ delete start here =======================
			// ==== remove only if already save ==========
			if(id){
				disbursementApServices.removeApAppList(id)
			}
			if(dis.disType.equalsIgnoreCase("CASH")){
				disbursementCheckServices.removeCheckList(parentId)
			}
			//================ delete end here =======================

			//===================== SAVE DISBURSEMENT EXPENSE HERE ============================
			def disEx = expense as ArrayList<DisbursementExpDto>
			disEx.each {
				def dto = objectMapper.convertValue(it, DisbursementExpDto.class)
				disbursementExpenseServices.upsertExp(dto, dis)
			}
			//===================== SAVE DISBURSEMENT EXPENSE END HERE ============================

			//===================== SAVE DISBURSEMENT WTX HERE ============================
			def disWtx = wtx as ArrayList<DisbursementWtxDto>
			disWtx.each {
				def dto = objectMapper.convertValue(it, DisbursementWtxDto.class)
				disbursementWtxServices.upsertWtx(dto, dis)
			}
			//===================== SAVE DISBURSEMENT WTX END HERE ============================
		}

		//===================== SAVE DISBURSEMENT CHECKS HERE ============================
		def disChecks = checks as ArrayList<DisbursementDto>
		disChecks.each{
			def disDto = objectMapper.convertValue(it, DisbursementDto.class)
			disbursementCheckServices.upsertCheck(disDto, dis)
		}
		//===================== SAVE DISBURSEMENT CHECKS END HERE ============================

		return dis
	}


	@GraphQLQuery(name = "disAccountView")
	List<JournalEntryViewDto> disAccountView(
			@GraphQLArgument(name = "id") UUID id,
			@GraphQLArgument(name = "status") Boolean status
	) {
		def result = new ArrayList<JournalEntryViewDto>()
		//ewt rate
		if(id) {
			def disburse = findOne(id)
			def ewt1 = BigDecimal.ZERO; def ewt2 = BigDecimal.ZERO; def ewt3 = BigDecimal.ZERO;
			def ewt4 = BigDecimal.ZERO; def ewt5 = BigDecimal.ZERO; def ewt7 = BigDecimal.ZERO;
			def ewt10 = BigDecimal.ZERO; def ewt15 = BigDecimal.ZERO; def ewt18 = BigDecimal.ZERO;
			def ewt30 = BigDecimal.ZERO;

			def disburseDetials = disbursementApServices.apAppByDis(disburse.id)
			def expenseEwt = disbursementWtxServices.disWtxByParent(disburse.id)
			def expense = disbursementExpenseServices.disExpByParent(disburse.id)
			def checks = disbursementCheckServices.disCheckByParent(disburse.id)
			//ewt rate start here
			disburseDetials.each {
				switch (it.ewtRate) {
					case 1:
						ewt1+=it.ewtAmount
						break;
					case 2:
						ewt2+=it.ewtAmount
						break;
					case 3:
						ewt3+=it.ewtAmount
						break;
					case 4:
						ewt4+=it.ewtAmount
						break;
					case 5:
						ewt5+=it.ewtAmount
						break;
					case 7:
						ewt7+=it.ewtAmount
						break;
					case 10:
						ewt10+=it.ewtAmount
						break;
					case 15:
						ewt15+=it.ewtAmount
						break;
					case 18:
						ewt18+=it.ewtAmount
						break;
					case 30:
						ewt30+=it.ewtAmount
						break;
				}
			}
			//expense ewt
			expenseEwt.each {
				switch (it.ewtRate) {
					case 1:
						ewt1+=it.ewtAmount
						break;
					case 2:
						ewt2+=it.ewtAmount
						break;
					case 3:
						ewt3+=it.ewtAmount
						break;
					case 4:
						ewt4+=it.ewtAmount
						break;
					case 5:
						ewt5+=it.ewtAmount
						break;
					case 7:
						ewt7+=it.ewtAmount
						break;
					case 10:
						ewt10+=it.ewtAmount
						break;
					case 15:
						ewt15+=it.ewtAmount
						break;
					case 18:
						ewt18+=it.ewtAmount
						break;
					case 30:
						ewt30+=it.ewtAmount
						break;
				}
			}
			//ewt rate end here
			if(disburse.transType?.flagValue){
				Integration match = integrationServices.getIntegrationByDomainAndTagValue(IntegrationDomainEnum.DISBURSEMENT, disburse.transType.flagValue)

				def headerLedger = integrationServices.generateAutoEntries(disburse) {it, mul ->
					it.flagValue = disburse.transType?.flagValue

					//initialize
					Map<String, List<Disbursement>> finalAcc  = [:]
					match.integrationItems.findAll { BooleanUtils.isTrue(it.multiple) }.eachWithIndex { IntegrationItem entry, int i ->
						if(!finalAcc.containsKey(entry.sourceColumn)){
							finalAcc[entry.sourceColumn] = []
						}
					}
					//loop checks
					Map<Bank, BigDecimal> listChecks  = [:]
					checks.each { a ->
						if(!listChecks.containsKey(a.bank)) {
							listChecks[a.bank] = 0.0
						}
						listChecks[a.bank] =  listChecks[a.bank] + a.amount
					}

					listChecks.each {k, v ->
						if(v > 0){
							finalAcc['cashOnBank'] << new Disbursement().tap {
								it.bank = k
								it.cashOnBank = status ? v.setScale(2, RoundingMode.HALF_EVEN) * -1 : v.setScale(2, RoundingMode.HALF_EVEN)
							}
						}
					}

					// ======================= expenses ==============================
					if(disburse.paymentCategory.equalsIgnoreCase("EXPENSE")){
						expense.each {a ->
							//=== for normal ===//
							if (a.office?.id) {
								it.office = a.office
							}
							if (a.office?.id) {
								it.project = a.project
							}
							if (a.transType.isReverse) {
								it[a.transType.source] += status ? a.amount.setScale(2, RoundingMode.HALF_EVEN) * -1 : a.amount.setScale(2, RoundingMode.HALF_EVEN)
							} else {
								it[a.transType.source] += status ? a.amount.setScale(2, RoundingMode.HALF_EVEN) : a.amount.setScale(2, RoundingMode.HALF_EVEN) * -1
							}

						}
					}else{
						if(disburse.isAdvance){
							// debit normal side no need to negative
							it.advancesSupplier = status ? disburse.voucherAmount.setScale(2, RoundingMode.HALF_EVEN) : disburse.voucherAmount.setScale(2, RoundingMode.HALF_EVEN)  * -1
						}else{
							// credit normal side make it negative to debit
							it.supplierAmount = status ? (disburse.voucherAmount.setScale(2, RoundingMode.HALF_EVEN) * -1) : disburse.voucherAmount.setScale(2, RoundingMode.HALF_EVEN)
						}
					}
					// ====================== loop multiples ========================
					finalAcc.each { key, items ->
						mul << items
					}
					// ====================== not multiple here =====================
					it.cashOnHand = status ? disburse.cash.setScale(2, RoundingMode.HALF_EVEN) * -1 : disburse.cash.setScale(2, RoundingMode.HALF_EVEN)
					it.discAmount = status ? disburse.discountAmount.setScale(2, RoundingMode.HALF_EVEN) : disburse.discountAmount.setScale(2, RoundingMode.HALF_EVEN) * -1

					it.ewt1Percent = status ? ewt1.setScale(2, RoundingMode.HALF_EVEN) : ewt1.setScale(2, RoundingMode.HALF_EVEN) * -1
					it.ewt2Percent = status ? ewt2.setScale(2, RoundingMode.HALF_EVEN) : ewt2.setScale(2, RoundingMode.HALF_EVEN) * -1
					it.ewt3Percent = status ? ewt3.setScale(2, RoundingMode.HALF_EVEN) : ewt3.setScale(2, RoundingMode.HALF_EVEN) * -1
					it.ewt4Percent = status ? ewt4.setScale(2, RoundingMode.HALF_EVEN) : ewt4.setScale(2, RoundingMode.HALF_EVEN) * -1
					it.ewt5Percent = status ? ewt5.setScale(2, RoundingMode.HALF_EVEN) : ewt5.setScale(2, RoundingMode.HALF_EVEN) * -1
					it.ewt7Percent = status ? ewt7.setScale(2, RoundingMode.HALF_EVEN) : ewt7.setScale(2, RoundingMode.HALF_EVEN) * -1
					it.ewt10Percent = status ? ewt10.setScale(2, RoundingMode.HALF_EVEN) : ewt10.setScale(2, RoundingMode.HALF_EVEN) * -1
					it.ewt15Percent = status ? ewt15.setScale(2, RoundingMode.HALF_EVEN) : ewt15.setScale(2, RoundingMode.HALF_EVEN) * -1
					it.ewt18Percent = status ? ewt18.setScale(2, RoundingMode.HALF_EVEN) : ewt18.setScale(2, RoundingMode.HALF_EVEN) * -1
					it.ewt30Percent = status ? ewt30.setScale(2, RoundingMode.HALF_EVEN) : ewt30.setScale(2, RoundingMode.HALF_EVEN) * -1

					//sum ewt
					def ewt = [ewt1, ewt2, ewt3, ewt4, ewt5, ewt7, ewt10, ewt15, ewt18, ewt30]
					def sumEwt = ewt.sum() as BigDecimal
					it.cwt = status ? sumEwt.setScale(2, RoundingMode.HALF_EVEN) : sumEwt.setScale(2, RoundingMode.HALF_EVEN) * -1

				}

				Set<Ledger> ledger = new HashSet<Ledger>(headerLedger.ledger);
				ledger.each {
					def list = new JournalEntryViewDto(
							code: it.journalAccount.code,
							desc: it.journalAccount.accountName,
							debit: it.debit,
							credit: it.credit
					)
					result.add(list)
				}
			}else{
				if(disburse.postedLedger){
					def header = ledgerServices.findOne(disburse.postedLedger)
					Set<Ledger> ledger = new HashSet<Ledger>(header.ledger);
					ledger.each {
						def list = new JournalEntryViewDto(
								code: it.journalAccount.code,
								desc: it.journalAccount.accountName,
								debit: it.credit,
								credit: it.debit
						)
						result.add(list)
					}
				}else{
					return []
				}
			}
		}
		return result.sort{it.debit}.reverse(true)
	}


	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "postDisbursement")
	Disbursement postDisbursement(
			@GraphQLArgument(name = "id") UUID id,
			@GraphQLArgument(name = "status") Boolean status
	) {
		def disCat = 'CK';
		def dis = findOne(id)
		if(dis.disType.equalsIgnoreCase("CASH")){
			disCat = 'CS'
		}
		if(status){
			def header = ledgerServices.findOne(dis.postedLedger)
			ledgerServices.reverseEntriesCustom(header, dis.disDate)
			//update AP
			dis.postedLedger = null
			dis.status = "VOIDED"
			dis.posted = false
			dis.postedBy = null
			save(dis)
			//remove ap ledger
			if(dis.paymentCategory.equalsIgnoreCase("PAYABLE")){
				apLedgerServices.removeApLedger(dis.disNo)
			}

			def ap = disbursementApServices.apByDis(id)
			ap.each {
				if(it.ewtAmount > BigDecimal.ZERO){
					wtx2307Service.remove2307(it.payable.id)
				}
				//update ap inag void
				accountsPayableServices.updateApForRemove(it.payable.id, it.disbursement.disNo, it.appliedAmount, it.posted)
				//update disAp posted = false
				disbursementApServices.updateDisApPosted(it, false)
			}

			def expenseEwt = disbursementWtxServices.disWtxByParent(id)
			expenseEwt.each {
				if(it.ewtAmount > BigDecimal.ZERO){
					wtx2307Service.remove2307(dis.id)
				}
			}

			//end remover ap ledger
		}else{
			postToLedgerAccounting(dis)

			if(dis.paymentCategory.equalsIgnoreCase("PAYABLE")){
				//add to ap ledger
				Map<String, Object> ledger = new HashMap<>()
				ledger.put('ledgerType', disCat)
				ledger.put('refNo', dis?.disNo)
				ledger.put('refId', dis?.id)
				ledger.put('debit', dis?.voucherAmount)
				ledger.put('credit', 0.00)
				apLedgerServices.upsertApLedger(ledger, dis?.supplier?.id, null);
				//end to ap ledger
			}

			//post to ewt if naa
			def ap = disbursementApServices.apAppByDis(id)
			ap.each {
				if(it.ewtAmount > BigDecimal.ZERO){
					def netVat =  (it.grossAmount - it.vatAmount)
					Map<String, Object> ewt = new HashMap<>()
					ewt.put('refId',it.payable.id)
					ewt.put('sourceDoc', dis.disNo)
					ewt.put('refNo',it.payable.apNo)
					ewt.put('wtxDate',dis.disDate)
					ewt.put('type','AP') //AP, AROTHERS
					ewt.put('gross',it.appliedAmount) //net of discount
					ewt.put('vatAmount',it.vatAmount) // 0
					ewt.put('netVat', netVat.setScale(2, RoundingMode.HALF_EVEN)) // same by gross
					ewt.put('ewtAmount',it.ewtAmount) //ewt amount
					wtx2307Service.upsert2307(ewt, null, dis.supplier.id)
				}
			}
			//end
			//expense ewt
			def expenseEwt = disbursementWtxServices.disWtxByParent(id)
			expenseEwt.each {
				if(it.ewtAmount > BigDecimal.ZERO){
					def netVat =  (it.grossAmount - it.vatAmount)
					Map<String, Object> ewt = new HashMap<>()
					ewt.put('refId',dis.id)
					ewt.put('sourceDoc', dis.disNo)
					ewt.put('refNo',dis.disNo)
					ewt.put('wtxDate',dis.disDate)
					ewt.put('type',disCat) //AP, AROTHERS, CK, CS
					ewt.put('gross',it.grossAmount) //net of discount
					ewt.put('vatAmount',0) // 0
					ewt.put('netVat',netVat.setScale(2, RoundingMode.HALF_EVEN)) // same by gross
					ewt.put('ewtAmount',it.ewtAmount) //ewt amount
					wtx2307Service.upsert2307(ewt, null, dis.supplier.id)
				}
			}
			//end expense

			//update ap balance
			def p = disbursementApServices.apByDis(id)
			p.each {
				if(!it.posted){
					accountsPayableServices.updateAp(it.payable.id, it.disbursement.disNo, it.appliedAmount)
				}
				//update disbursement Ap posted
				disbursementApServices.updateDisApPosted(it, true)
			}
			//end
		}
		return dis
	}

	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "postDsManual")
	GraphQLRetVal<Boolean> postDsManual(
			@GraphQLArgument(name = "id") UUID id,
			@GraphQLArgument(name = "header")  Map<String,Object>  header,
			@GraphQLArgument(name = "entries")  List<Map<String,Object>>  entries
	) {
		def dis = findOne(id)

		def disCat = 'CK';
		if(dis.disType.equalsIgnoreCase("CASH")){
			disCat = 'CS'
		}

		Map<String,String> details = [:]

		dis.details.each { k,v ->
			details[k] = v
		}

		details["DISBURSEMENT_ID"] = dis.id.toString()
		details["SUPPLIER_ID"] = dis.supplier.id.toString()


		Map<String, Object> headerLedger = header
		headerLedger.put('transactionNo', dis.disNo)
		headerLedger.put('transactionType', "DISBURSEMENT-${dis.paymentCategory}")
		headerLedger.put('referenceType', dis.referenceType)
		headerLedger.put('referenceNo', dis.referenceNo)

		def result = ledgerServices.addManualJVDynamic(headerLedger, entries, dis.disType.equalsIgnoreCase("CASH") ? LedgerDocType.CS : LedgerDocType.CK,
				JournalType.DISBURSEMENT, dis.disDate, details)

		//update parent
		dis.postedLedger = result.returnId
		dis.status = "POSTED"
		dis.posted = true
		dis.postedBy = SecurityUtils.currentLogin()
		save(dis)

		//update
		if(dis.paymentCategory.equalsIgnoreCase("PAYABLE")){
			//add to ap ledger
			Map<String, Object> ledger = new HashMap<>()
			ledger.put('ledgerType', disCat)
			ledger.put('refNo', dis?.disNo)
			ledger.put('refId', dis?.id)
			ledger.put('debit', dis?.voucherAmount)
			ledger.put('credit', 0.00)
			apLedgerServices.upsertApLedger(ledger, dis?.supplier?.id, null);
			//end to ap ledger
		}

		//post to ewt if naa
		def ap = disbursementApServices.apAppByDis(id)
		ap.each {
			if(it.ewtAmount > BigDecimal.ZERO){
				Map<String, Object> ewt = new HashMap<>()
				ewt.put('refId',it.payable.id)
				ewt.put('refNo',it.payable.apNo)
				ewt.put('wtxDate',dis.disDate)
				ewt.put('type','AP') //AP, AROTHERS
				ewt.put('gross',it.appliedAmount) //net of discount
				ewt.put('vatAmount',it.vatAmount) // 0
				ewt.put('netVat', (it.appliedAmount - it.vatAmount)) // same by gross
				ewt.put('ewtAmount',it.ewtAmount) //ewt amounnt
				wtx2307Service.upsert2307(ewt, null, dis.supplier.id)
			}
		}
		//end
		//expense ewt
		def expenseEwt = disbursementWtxServices.disWtxByParent(id)
		expenseEwt.each {
			if(it.ewtAmount > BigDecimal.ZERO){
				Map<String, Object> ewt = new HashMap<>()
				ewt.put('refId',dis.id)
				ewt.put('refNo',dis.disNo)
				ewt.put('wtxDate',dis.disDate)
				ewt.put('type',disCat) //AP, AROTHERS, CK, CS
				ewt.put('gross',dis.voucherAmount) //net of discount
				ewt.put('vatAmount',0) // 0
				ewt.put('netVat',dis.voucherAmount) // same by gross
				ewt.put('ewtAmount',it.ewtAmount) //ewt amounnt
				wtx2307Service.upsert2307(ewt, null, dis.supplier.id)
			}
		}
		//end expense

		//update ap balance
		def p = disbursementApServices.apByDis(id)
		p.each {
			if(!it.posted){
				accountsPayableServices.updateAp(it.payable.id, it.disbursement.disNo, it.appliedAmount)
			}
			//update disbursement Ap posted
			disbursementApServices.updateDisApPosted(it, true)
		}
		//end

		return result
	}


	//save to accounting in post
	@Transactional(rollbackFor = Exception.class)
	Disbursement postToLedgerAccounting(Disbursement disbursement){
		def yearFormat = DateTimeFormatter.ofPattern("yyyy")
		def disburse = super.save(disbursement) as Disbursement
		//ewt rate
		def ewt1 = BigDecimal.ZERO; def ewt2 = BigDecimal.ZERO; def ewt3 = BigDecimal.ZERO;
		def ewt4 = BigDecimal.ZERO; def ewt5 = BigDecimal.ZERO; def ewt7 = BigDecimal.ZERO;
		def ewt10 = BigDecimal.ZERO; def ewt15 = BigDecimal.ZERO; def ewt18 = BigDecimal.ZERO;
		def ewt30 = BigDecimal.ZERO;

		def disburseDetials = disbursementApServices.apAppByDis(disburse.id)
		def expenseEwt = disbursementWtxServices.disWtxByParent(disburse.id)
		def expense = disbursementExpenseServices.disExpByParent(disburse.id)
		def checks = disbursementCheckServices.disCheckByParent(disburse.id)
		disburseDetials.each {
			switch (it.ewtRate) {
				case 1:
					ewt1+=it.ewtAmount
					break;
				case 2:
					ewt2+=it.ewtAmount
					break;
				case 3:
					ewt3+=it.ewtAmount
					break;
				case 4:
					ewt4+=it.ewtAmount
					break;
				case 5:
					ewt5+=it.ewtAmount
					break;
				case 7:
					ewt7+=it.ewtAmount
					break;
				case 10:
					ewt10+=it.ewtAmount
					break;
				case 15:
					ewt15+=it.ewtAmount
					break;
				case 18:
					ewt18+=it.ewtAmount
					break;
				case 30:
					ewt30+=it.ewtAmount
					break;
			}
		}
		//expense ewt
		expenseEwt.each {
			switch (it.ewtRate) {
				case 1:
					ewt1+=it.ewtAmount
					break;
				case 2:
					ewt2+=it.ewtAmount
					break;
				case 3:
					ewt3+=it.ewtAmount
					break;
				case 4:
					ewt4+=it.ewtAmount
					break;
				case 5:
					ewt5+=it.ewtAmount
					break;
				case 7:
					ewt7+=it.ewtAmount
					break;
				case 10:
					ewt10+=it.ewtAmount
					break;
				case 15:
					ewt15+=it.ewtAmount
					break;
				case 18:
					ewt18+=it.ewtAmount
					break;
				case 30:
					ewt30+=it.ewtAmount
					break;
			}
		}
		//ewt rate

		Integration match = integrationServices.getIntegrationByDomainAndTagValue(IntegrationDomainEnum.DISBURSEMENT, disburse.transType.flagValue)
		def headerLedger = integrationServices.generateAutoEntries(disburse) {it, mul ->
			it.flagValue = disburse.transType?.flagValue

			//initialize
			Map<String, List<Disbursement>> finalAcc  = [:]
			match.integrationItems.findAll { BooleanUtils.isTrue(it.multiple) }.eachWithIndex { IntegrationItem entry, int i ->
				if(!finalAcc.containsKey(entry.sourceColumn)){
					finalAcc[entry.sourceColumn] = []
				}
			}
			//loop checks
			Map<Bank, BigDecimal> listChecks  = [:]
			checks.each { a ->
				if(!listChecks.containsKey(a.bank)) {
					listChecks[a.bank] = 0.0
				}
				listChecks[a.bank] =  listChecks[a.bank] + a.amount
			}

			listChecks.each {k, v ->
				if(v > 0){
					finalAcc['cashOnBank'] << new Disbursement().tap {
						it.bank = k
						it.cashOnBank = v.setScale(2, RoundingMode.HALF_EVEN) * -1
					}
				}
			}

			// ======================= expenses ==============================
			if(disburse.paymentCategory.equalsIgnoreCase("EXPENSE")){
				expense.each {a ->
					//=== for normal ===//
					if (a.office?.id) {
						it.office = a.office
					}
					if (a.office?.id) {
						it.project = a.project
					}
					if (a.transType.isReverse) {
						it[a.transType.source] += a.amount.setScale(2, RoundingMode.HALF_EVEN) * -1
					} else {
						it[a.transType.source] += a.amount.setScale(2, RoundingMode.HALF_EVEN)
					}

				}
			}else{
				if(disburse.isAdvance){
					// debit normal side no need to negative
					it.advancesSupplier = disburse.voucherAmount.setScale(2, RoundingMode.HALF_EVEN)
				}else{
					// credit normal side make it negative to debit
					it.supplierAmount = disburse.voucherAmount.setScale(2, RoundingMode.HALF_EVEN) * -1
				}
			}
			// ====================== loop multiples ========================
			finalAcc.each { key, items ->
				mul << items
			}
			// ====================== not multiple here =====================
			it.cashOnHand = disburse.cash.setScale(2, RoundingMode.HALF_EVEN) * -1
			it.discAmount = disburse.discountAmount.setScale(2, RoundingMode.HALF_EVEN)

			it.ewt1Percent = ewt1.setScale(2, RoundingMode.HALF_EVEN)
			it.ewt2Percent = ewt2.setScale(2, RoundingMode.HALF_EVEN)
			it.ewt3Percent = ewt3.setScale(2, RoundingMode.HALF_EVEN)
			it.ewt4Percent = ewt4.setScale(2, RoundingMode.HALF_EVEN)
			it.ewt5Percent = ewt5.setScale(2, RoundingMode.HALF_EVEN)
			it.ewt7Percent = ewt7.setScale(2, RoundingMode.HALF_EVEN)
			it.ewt10Percent = ewt10.setScale(2, RoundingMode.HALF_EVEN)
			it.ewt15Percent = ewt15.setScale(2, RoundingMode.HALF_EVEN)
			it.ewt18Percent = ewt18.setScale(2, RoundingMode.HALF_EVEN)
			it.ewt30Percent = ewt30.setScale(2, RoundingMode.HALF_EVEN)

			//sum ewt
			def ewt = [ewt1, ewt2, ewt3, ewt4, ewt5, ewt7, ewt10, ewt15, ewt18, ewt30]
			def sumEwt = ewt.sum() as BigDecimal
			it.cwt = sumEwt.setScale(2, RoundingMode.HALF_EVEN)

		}

		Map<String,String> details = [:]

		disburse.details.each { k,v ->
			details[k] = v
		}

		details["DISBURSEMENT_ID"] = disburse.id.toString()
		details["SUPPLIER_ID"] = disburse.supplier.id.toString()

		headerLedger.transactionNo = disburse.disNo
		headerLedger.transactionType = "DISBURSEMENT-${disburse.paymentCategory}"
		headerLedger.referenceType = disburse.referenceType
		headerLedger.referenceNo = disburse.referenceNo

		def pHeader =	ledgerServices.persistHeaderLedger(headerLedger,
				"${disburse.disDate.atZone(ZoneId.systemDefault()).format(yearFormat)}-${disburse.disNo}",
				"${disburse.supplier.supplierFullname}",
				"${disburse.remarksNotes}",
				disburse.disType.equalsIgnoreCase("CASH") ? LedgerDocType.CS : LedgerDocType.CK, // CS = CASH , CK = CHECK
				JournalType.DISBURSEMENT,
				disburse.disDate,
				details)
		disburse.postedLedger = pHeader.id
		disburse.status = "POSTED"
		disburse.posted = true
		disburse.postedBy = SecurityUtils.currentLogin()

		save(disburse)
	}

	@Transactional(rollbackFor = Exception.class)
	Disbursement updateForReapplicationPost(UUID id,
	BigDecimal disc, BigDecimal ewt, BigDecimal amount, Boolean isVoid){

		def up = findOne(id)
		if(isVoid){
			up.discountAmount = up.discountAmount - disc
			up.ewtAmount = up.ewtAmount - ewt
			up.appliedAmount = up.appliedAmount - amount
			up.voucherAmount = up.voucherAmount - (disc + ewt)
			save(up)
		}else{
			up.discountAmount = up.discountAmount + disc
			up.ewtAmount = up.ewtAmount + ewt
			up.appliedAmount = up.appliedAmount + amount
			up.voucherAmount = up.voucherAmount + (disc + ewt)
			save(up)
		}

	}

	@Transactional(rollbackFor = Exception.class)
	Disbursement updateRemove(UUID id, String type, BigDecimal value){
		def up = findOne(id)
		if(type.equalsIgnoreCase("EX")){
			up.appliedAmount = up.appliedAmount - value
		}else if(type.equalsIgnoreCase("CK")){
			up.checks = up.checks - value
			up.voucherAmount = up.voucherAmount - value
		}else if(type.equalsIgnoreCase("WTX")){
			up.ewtAmount = up.ewtAmount - value
			up.voucherAmount = up.voucherAmount - value
		}else if(type.equalsIgnoreCase("PCV")){
			up.appliedAmount = up.appliedAmount - value
		}
		save(up)
	}

	@Transactional(rollbackFor = Exception.class)
	Disbursement updateRemoveAp(
			UUID id,
			BigDecimal discountAmount,
			BigDecimal ewtAmount,
			BigDecimal appliedAmount
	){
		def up = findOne(id)
		up.discountAmount = up.discountAmount - discountAmount
		up.ewtAmount = up.ewtAmount - ewtAmount
		up.voucherAmount = up.voucherAmount - (ewtAmount + discountAmount)
		up.appliedAmount = up.appliedAmount - appliedAmount
		save(up)
	}

	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "updateCKStatus")
	Disbursement disbursementUpdateStatus(
			@GraphQLArgument(name = "id") UUID id,
			@GraphQLArgument(name = "status") String status
	){
		def up = findOne(id)
		up.status = status
		save(up)
	}


}
