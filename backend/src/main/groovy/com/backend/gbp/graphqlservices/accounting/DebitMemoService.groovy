package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.DebitMemo
import com.backend.gbp.domain.accounting.JournalType
import com.backend.gbp.domain.accounting.Ledger
import com.backend.gbp.domain.accounting.LedgerDocType
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.OfficeRepository
import com.backend.gbp.rest.dto.journal.JournalEntryViewDto
import com.backend.gbp.rest.dto.payables.DisbursementApDto
import com.backend.gbp.rest.dto.payables.DmDetailsDto
import com.backend.gbp.security.SecurityUtils
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.GeneratorType
import com.fasterxml.jackson.databind.ObjectMapper
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

import java.math.RoundingMode
import java.time.ZoneId
import java.time.format.DateTimeFormatter

@Service
@GraphQLApi
class DebitMemoService extends AbstractDaoService<DebitMemo> {

	@Autowired
	GeneratorService generatorService

	@Autowired
	ObjectMapper objectMapper

	@Autowired
	AccountsPayableServices accountsPayableServices

	@Autowired
	OfficeRepository officeRepository

	@Autowired
	ReapplicationService reapplicationService

	@Autowired
	DisbursementApServices disbursementApServices

	@Autowired
	IntegrationServices integrationServices

	@Autowired
	LedgerServices ledgerServices

	@Autowired
	ApLedgerServices apLedgerServices

	@Autowired
	Wtx2307Service wtx2307Service

	@Autowired
	DebitMemoDetailsServices debitMemoDetailsServices


    DebitMemoService() {
		super(DebitMemo.class)
	}
	
	@GraphQLQuery(name = "debitMemoById")
	DebitMemo debitMemoById(
			@GraphQLArgument(name = "id") UUID id
	) {
		if(id){
			findOne(id)
		}else{
			return null
		}

	}

	@GraphQLQuery(name = "debitMemoFilter", description = "List of DM Pageable")
	Page<DebitMemo> debitMemoFilter(
			@GraphQLArgument(name = "filter") String filter,
			@GraphQLArgument(name = "supplier") UUID supplier,
			@GraphQLArgument(name = "type") String type,
			@GraphQLArgument(name = "status") Boolean status,
			@GraphQLArgument(name = "start") String start,
			@GraphQLArgument(name = "end") String end,
			@GraphQLArgument(name = "page") Integer page,
			@GraphQLArgument(name = "size") Integer size
	) {
		def company = SecurityUtils.currentCompanyId()

		String query = '''Select dm from DebitMemo dm where
						(lower(dm.debitNo) like lower(concat('%',:filter,'%')))
						and to_date(to_char(dm.debitDate, 'YYYY-MM-DD'),'YYYY-MM-DD')
						between to_date(:start,'YYYY-MM-DD') and to_date(:end,'YYYY-MM-DD')
             			and dm.debitType = :type'''


		String countQuery = '''Select count(dm) from DebitMemo dm where
							(lower(dm.debitNo) like lower(concat('%',:filter,'%')))
							and to_date(to_char(dm.debitDate, 'YYYY-MM-DD'),'YYYY-MM-DD')
							between to_date(:start,'YYYY-MM-DD') and to_date(:end,'YYYY-MM-DD')
							and dm.debitType = :type'''

		Map<String, Object> params = new HashMap<>()
		params.put('filter', filter)
		params.put('type', type)
		params.put('start', start)
		params.put('end', end)

		if (company) {
			query += ''' and (dm.company = :company) '''
			countQuery += ''' and (dm.company = :company) '''
			params.put("company", company)
		}

		if (supplier) {
			query += ''' and (dm.supplier.id = :supplier) '''
			countQuery += ''' and (dm.supplier.id = :supplier) '''
			params.put("supplier", supplier)
		}

		if (status) {
			query += ''' and (dm.posted = :status or dm.posted is null) '''
			countQuery += ''' and (dm.posted = :status or dm.posted is null) '''
			params.put("status", !status)
		}

		query += ''' ORDER BY dm.debitNo DESC'''

		getPageable(query, countQuery, page, size, params)
	}


	//mutations
	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "upsertDM") //Debit Advice
	DebitMemo upsertDM(
			@GraphQLArgument(name = "fields") Map<String, Object> fields,
			@GraphQLArgument(name = "items") ArrayList<Map<String, Object>> items,
			@GraphQLArgument(name = "id") UUID id
	) {
		def company = SecurityUtils.currentCompanyId()

		def dm = upsertFromMap(id, fields, { DebitMemo entity, boolean forInsert ->
			if (forInsert) {
				entity.debitNo = generatorService.getNextValue(GeneratorType.DM_NO, {
					return "DM-" + StringUtils.leftPad(it.toString(), 6, "0")
				})
				entity.company = company
				entity.status = "DRAFT"
				entity.posted = false
			}
		})

		def disAp = items as ArrayList<DisbursementApDto>
		disAp.each {
			def dto = objectMapper.convertValue(it, DisbursementApDto.class)
			disbursementApServices.upsertDisDM(dto, dm)
		}

		return dm
	}

	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "upsertDebitMemo") //Debit Memo
	DebitMemo upsertDebitMemo(
			@GraphQLArgument(name = "fields") Map<String, Object> fields,
			@GraphQLArgument(name = "items") ArrayList<Map<String, Object>> items,
			@GraphQLArgument(name = "details") ArrayList<Map<String, Object>> details,
			@GraphQLArgument(name = "id") UUID id
	) {
		def company = SecurityUtils.currentCompanyId()

		def dm = upsertFromMap(id, fields, { DebitMemo entity, boolean forInsert ->
			if (forInsert) {
				if(entity.debitType.equalsIgnoreCase("DEBIT_MEMO")){
					entity.debitNo = generatorService.getNextValue(GeneratorType.DM_NO, {
						return "DM-" + StringUtils.leftPad(it.toString(), 6, "0")
					})
				}else{
					entity.debitNo = generatorService.getNextValue(GeneratorType.DA_NO, {
						return "DA-" + StringUtils.leftPad(it.toString(), 6, "0")
					})
				}
				entity.company = company
				entity.status = "DRAFT"
				entity.posted = false
			}
		})

		if(dm.debitCategory.equalsIgnoreCase("PAYABLE")){
			def disAp = items as ArrayList<DisbursementApDto>
			disAp.each {
				def dto = objectMapper.convertValue(it, DisbursementApDto.class)
				disbursementApServices.upsertDisDM(dto, dm)
			}
			if(dm.debitType.equalsIgnoreCase("DEBIT_ADVICE")){
				//remove expenses
				if(id){
					debitMemoDetailsServices.removeDetailsDebitMemo(id)
				}
			}else{
				def trans = details as ArrayList<DmDetailsDto>
				trans.each {
					def dto = objectMapper.convertValue(it, DmDetailsDto.class)
					debitMemoDetailsServices.upsertDmDetials(dto, dm)
				}
			}

		}else if(dm.debitCategory.equalsIgnoreCase("EXPENSE")){
			//remove ap
			if(id){
				if(dm.debitType.equalsIgnoreCase("DEBIT_ADVICE")){
					disbursementApServices.removeApDebitMemo(id, "DA")
				}else{
					disbursementApServices.removeApDebitMemo(id, "DM")
				}
			}

			def trans = details as ArrayList<DmDetailsDto>
			trans.each {
				def dto = objectMapper.convertValue(it, DmDetailsDto.class)
				debitMemoDetailsServices.upsertDmDetials(dto, dm)
			}
		}



		return dm
	}

	@Transactional(rollbackFor = Exception.class)
	DebitMemo updateDMforRemove(
			UUID id,
			BigDecimal discountAmount,
			BigDecimal ewtAmount,
			BigDecimal appliedAmount
	){
		def up = findOne(id)

		BigDecimal discount = up.discount - discountAmount
		BigDecimal ewt = up.ewtAmount - ewtAmount
		BigDecimal applied = up.appliedAmount - appliedAmount
		BigDecimal memo = up.memoAmount - (appliedAmount - ewtAmount - discountAmount)

		if(up.discount > BigDecimal.ZERO){
			up.discount = discount.setScale(2, RoundingMode.HALF_DOWN)
		}
		if(up.ewtAmount > BigDecimal.ZERO){
			up.ewtAmount = ewt.setScale(2, RoundingMode.HALF_DOWN)
		}
		if(up.memoAmount > BigDecimal.ZERO){
			up.memoAmount = memo.setScale(2, RoundingMode.HALF_DOWN)
		}
		if(up.appliedAmount > BigDecimal.ZERO){
			up.appliedAmount = applied.setScale(2, RoundingMode.HALF_DOWN)
		}
		save(up)
	}

	//ACCOUNTS TO VIEW
	@GraphQLQuery(name = "dmAccountView")
	List<JournalEntryViewDto> dmAccountView(
			@GraphQLArgument(name = "id") UUID id,
			@GraphQLArgument(name = "status") Boolean status
	) {
		def result = new ArrayList<JournalEntryViewDto>()
		//ewt rate
		if(id) {
			def dm = findOne(id)
			def ewt1 = BigDecimal.ZERO; def ewt2 = BigDecimal.ZERO; def ewt3 = BigDecimal.ZERO;
			def ewt4 = BigDecimal.ZERO; def ewt5 = BigDecimal.ZERO; def ewt7 = BigDecimal.ZERO;
			def ewt10 = BigDecimal.ZERO; def ewt15 = BigDecimal.ZERO; def ewt18 = BigDecimal.ZERO;
			def ewt30 = BigDecimal.ZERO;

			def dmDetails = disbursementApServices.apDebitMemo(dm.id)
			def trans = debitMemoDetailsServices.dmDetials(dm.id)

			//ewt rate start here
			dmDetails.each {
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

			if(dm.transType?.flagValue){
				def headerLedger = integrationServices.generateAutoEntries(dm) {it, mul ->
					it.flagValue = dm.transType?.flagValue

					List<DebitMemo> exp  = []


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
				if(dm.postedLedger){
					def header = ledgerServices.findOne(dm.postedLedger)
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
				}
			}
		}
		return result.sort{it.credit}
	}


	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "postDM")
	DebitMemo postDM(
			@GraphQLArgument(name = "id") UUID id,
			@GraphQLArgument(name = "status") Boolean status
	) {
		def dm = findOne(id)
		if(status){
			def header = ledgerServices.findOne(dm.postedLedger)
			ledgerServices.reverseEntriesCustom(header, dm.debitDate)
			//update AP
			dm.postedLedger = null
			dm.status = "VOIDED"
			dm.posted = false
			dm.postedBy = null
			save(dm)
			//remove ap ledger
			apLedgerServices.removeApLedger(dm.debitNo)

			def ap = disbursementApServices.apDebitMemo(id)
			ap.each {
				if(it.ewtAmount > BigDecimal.ZERO){
					wtx2307Service.remove2307(it.payable.id)
				}
				//update ap inag void
				if(dm.debitType.equalsIgnoreCase("DEBIT_ADVICE")){
					accountsPayableServices.updateApForRemoveDM(it.payable.id, dm.debitNo, it.appliedAmount, it.posted, "DA")
				}else{
					accountsPayableServices.updateApForRemoveDM(it.payable.id, dm.debitNo, dm.memoAmount, it.posted, "DM")
				}
				//update disAp posted = false
				disbursementApServices.updateDisApPosted(it, false)
			}

			//end remover ap ledger
		}else{
			postToLedgerAccounting(dm)

			if(dm.debitCategory.equalsIgnoreCase("PAYABLE")) {
				//add to ap ledger
				Map<String, Object> ledger = new HashMap<>()
				ledger.put('ledgerType', 'DM')
				ledger.put('refNo', dm?.debitNo)
				ledger.put('refId', dm?.id)
				if(dm.debitType.equalsIgnoreCase("DEBIT_MEMO")){
					ledger.put('debit', dm?.memoAmount)
				}else{
					ledger.put('debit', dm?.appliedAmount)
				}
				ledger.put('credit', 0.00)
				apLedgerServices.upsertApLedger(ledger, dm?.supplier?.id, null);
				//end to ap ledger
			}

			//post to ewt if naa
			def ap = disbursementApServices.apDebitMemo(id)
			ap.each {
				if(it.ewtAmount > BigDecimal.ZERO){
					Map<String, Object> ewt = new HashMap<>()
					ewt.put('refId',it.payable.id)
					ewt.put('refNo',it.payable.apNo)
					ewt.put('wtxDate',dm.debitDate)
					ewt.put('type','AP') //AP, AROTHERS
					ewt.put('gross',it.appliedAmount) //net of discount
					ewt.put('vatAmount',it.vatAmount) // 0
					ewt.put('netVat',(it.appliedAmount - it.vatAmount)) // same by gross
					ewt.put('ewtAmount',it.ewtAmount) //ewt amounnt
					wtx2307Service.upsert2307(ewt, null, dm.supplier.id)
				}
			}
			//end

			//update ap balance
			def p = disbursementApServices.apDebitMemo(id)
			p.each {
				if(!it.posted){
					if(dm.debitType.equalsIgnoreCase("DEBIT_ADVICE")){
						accountsPayableServices.updateApFromDM(it.payable.id, dm.debitNo, it.appliedAmount, "DA")
					}else{
						accountsPayableServices.updateApFromDM(it.payable.id, dm.debitNo, dm.memoAmount, "DM")
					}
				}
				//update disbursement Ap posted
				disbursementApServices.updateDisApPosted(it, true)
			}
			//end
		}
		return dm
	}

	@Transactional(rollbackFor = Exception.class)
	DebitMemo postToLedgerAccounting(DebitMemo dm){
		def yearFormat = DateTimeFormatter.ofPattern("yyyy")
		def debitMemo = super.save(dm) as DebitMemo
		//ewt rate
		def ewt1 = BigDecimal.ZERO; def ewt2 = BigDecimal.ZERO; def ewt3 = BigDecimal.ZERO;
		def ewt4 = BigDecimal.ZERO; def ewt5 = BigDecimal.ZERO; def ewt7 = BigDecimal.ZERO;
		def ewt10 = BigDecimal.ZERO; def ewt15 = BigDecimal.ZERO; def ewt18 = BigDecimal.ZERO;
		def ewt30 = BigDecimal.ZERO;

		def dmDetails = disbursementApServices.apDebitMemo(dm.id)
		def trans = debitMemoDetailsServices.dmDetials(dm.id)
		//ewt rate start here
		dmDetails.each {
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

		def headerLedger = integrationServices.generateAutoEntries(debitMemo) { it, mul ->
			it.flagValue = dm.transType?.flagValue

			List<DebitMemo> exp  = []


			//
		}


		Map<String,String> details = [:]

		dm.details.each { k,v ->
			details[k] = v
		}

		details["DEBITMEMO_ID"] = dm.id.toString()
		details["SUPPLIER_ID"] = dm.supplier.id.toString()

		def pHeader =	ledgerServices.persistHeaderLedger(headerLedger,
				"${dm.debitDate.atZone(ZoneId.systemDefault()).format(yearFormat)}-${dm.debitNo}",
				"${dm.debitNo}-${dm.supplier.supplierFullname}",
				"${dm.debitNo}-${dm.remarksNotes}",
				LedgerDocType.DM,
				JournalType.GENERAL,
				dm.debitDate,
				details)
		dm.postedLedger = pHeader.id
		dm.status = "POSTED"
		dm.posted = true
		dm.postedBy = SecurityUtils.currentLogin()

		save(dm)
	}

	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "postDManual")
	GraphQLRetVal<Boolean> postDManual(
			@GraphQLArgument(name = "id") UUID id,
			@GraphQLArgument(name = "header")  Map<String,Object>  header,
			@GraphQLArgument(name = "entries")  List<Map<String,Object>>  entries
	) {
		def dm = findOne(id)

		Map<String,String> details = [:]

		dm.details.each { k,v ->
			details[k] = v
		}

		details["DEBITMEMO_ID"] = dm.id.toString()
		details["SUPPLIER_ID"] = dm.supplier.id.toString()

		def result = ledgerServices.addManualJVDynamic(header, entries, LedgerDocType.DM,
				JournalType.GENERAL, dm.debitDate, details)

		//update parent
		dm.postedLedger = result.returnId
		dm.status = "POSTED"
		dm.posted = true
		dm.postedBy = SecurityUtils.currentLogin()
		save(dm)

		//update after post

		if(dm.debitCategory.equalsIgnoreCase("PAYABLE")){
			//add to ap ledger
			Map<String, Object> ledger = new HashMap<>()
			ledger.put('ledgerType', 'DM')
			ledger.put('refNo', dm?.debitNo)
			ledger.put('refId', dm?.id)
			if(dm.debitType.equalsIgnoreCase("DEBIT_MEMO")){
				ledger.put('debit', dm?.memoAmount)
			}else{
				ledger.put('debit', dm?.appliedAmount)
			}
			ledger.put('credit', 0.00)
			apLedgerServices.upsertApLedger(ledger, dm?.supplier?.id, null);
			//end to ap ledger
		}


		//post to ewt if naa
		def ap = disbursementApServices.apDebitMemo(id)
		ap.each {
			if(it.ewtAmount > BigDecimal.ZERO){
				Map<String, Object> ewt = new HashMap<>()
				ewt.put('refId',it.payable.id)
				ewt.put('refNo',it.payable.apNo)
				ewt.put('wtxDate',dm.debitDate)
				ewt.put('type','AP') //AP, AROTHERS
				ewt.put('gross',it.appliedAmount) //net of discount
				ewt.put('vatAmount',it.vatAmount) // 0
				ewt.put('netVat',(it.appliedAmount - it.vatAmount)) // same by gross
				ewt.put('ewtAmount',it.ewtAmount) //ewt amount
				wtx2307Service.upsert2307(ewt, null, dm.supplier.id)
			}
		}
		//end

		//update ap balance
		def p = disbursementApServices.apDebitMemo(id)
		p.each {
			if(!it.posted){
				if(dm.debitType.equalsIgnoreCase("DEBIT_ADVICE")){
					accountsPayableServices.updateApFromDM(it.payable.id, it.debitMemo.debitNo, it.appliedAmount, "DA")
				}else{
					accountsPayableServices.updateApFromDM(it.payable.id, it.debitMemo.debitNo, dm.memoAmount, "DM")
				}
			}
			//update disbursement Ap posted
			disbursementApServices.updateDisApPosted(it, true)
		}
		//end

		return result
	}

	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "updateMemoAmount")
	DebitMemo updateMemoAmount(
			@GraphQLArgument(name = "id") UUID id,
			@GraphQLArgument(name = "amount") BigDecimal amount,
			@GraphQLArgument(name = "type") String type
	) {
		def dm = findOne(id)
		if(type.equalsIgnoreCase("memo")){
			if(dm.memoAmount > BigDecimal.ZERO){
				def sumAmount = dm.memoAmount - amount
				dm.memoAmount = sumAmount.setScale(2, RoundingMode.HALF_EVEN)
			}
		}else{
			if(dm.appliedAmount > BigDecimal.ZERO){
				def sumAmount = dm.appliedAmount - amount
				dm.appliedAmount = sumAmount.setScale(2, RoundingMode.HALF_EVEN)
			}
		}
		return dm
	}

	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "updateDmStatus")
	DebitMemo updateDmStatus(
			@GraphQLArgument(name = "id") UUID id,
			@GraphQLArgument(name = "status") String status
	){
		def up = findOne(id)
		up.status = status
		save(up)
	}


}
