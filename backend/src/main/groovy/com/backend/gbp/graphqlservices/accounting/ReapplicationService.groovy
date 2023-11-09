package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.JournalType
import com.backend.gbp.domain.accounting.Ledger
import com.backend.gbp.domain.accounting.LedgerDocType
import com.backend.gbp.domain.accounting.Reapplication
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.rest.dto.journal.JournalEntryViewDto
import com.backend.gbp.rest.dto.payables.DisbursementApDto
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
import java.time.Duration
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter

@Service
@GraphQLApi
class ReapplicationService extends AbstractDaoService<Reapplication> {

	@Autowired
	GeneratorService generatorService

	@Autowired
	ObjectMapper objectMapper

	@Autowired
	DisbursementServices disbursementServices

	@Autowired
	DisbursementApServices disbursementApServices

	@Autowired
	IntegrationServices integrationServices

	@Autowired
	LedgerServices ledgerServices

	@Autowired
	Wtx2307Service wtx2307Service

	@Autowired
	AccountsPayableServices accountsPayableServices

    ReapplicationService() {
		super(Reapplication.class)
	}
	
	@GraphQLQuery(name = "reapplicationById")
	Reapplication reapplicationById(
			@GraphQLArgument(name = "id") UUID id
	) {
		findOne(id)
	}

	@GraphQLQuery(name = "getReapplicationStatus", description = "Find Ap posted")
	List<Reapplication> getReapplicationStatus(
			@GraphQLArgument(name = "id") UUID id,
			@GraphQLArgument(name = "status") String status
	) {
		def company = SecurityUtils.currentCompanyId()
		
		String query = '''Select d from Reapplication d where d.disbursement.id = :id and d.status = :status and d.company = :company'''

		Map<String, Object> params = new HashMap<>()
		params.put('id', id)
		params.put('status', status)
		params.put('company', company)

		createQuery(query, params).resultList
	}

	@GraphQLQuery(name = "reapplicationPage")
	Page<Reapplication> reapplicationPage(
			@GraphQLArgument(name = "filter") String filter,
			@GraphQLArgument(name = "page") Integer page,
			@GraphQLArgument(name = "size") Integer size
	) {
		def company = SecurityUtils.currentCompanyId()
		
		String query = '''Select d from Reapplication d where
						( lower(d.disbursement.payeeName) like lower(concat('%',:filter,'%'))
						or lower(d.disbursement.disNo) like lower(concat('%',:filter,'%')) )'''

		String countQuery = '''Select count(d) from Reapplication d where
							( lower(d.disbursement.payeeName) like lower(concat('%',:filter,'%'))
						or lower(d.disbursement.disNo) like lower(concat('%',:filter,'%')) )'''

		Map<String, Object> params = new HashMap<>()
		params.put('filter', filter)
		
		if (company) {
			query += ''' and (d.company = :company) '''
			countQuery += ''' and (d.company = :company) '''
			params.put("company", company)
		}

		query += ''' ORDER BY d.disbursement.disNo DESC'''

		getPageable(query, countQuery, page, size, params)
	}

	@GraphQLQuery(name = "reapplicationPageFilter")
	Page<Reapplication> reapplicationPageFilter(
			@GraphQLArgument(name = "filter") String filter,
			@GraphQLArgument(name = "supplier") UUID supplier,
	 		@GraphQLArgument(name = "status") Boolean status,
	 		@GraphQLArgument(name = "start") String start,
	 		@GraphQLArgument(name = "end") String end,
			@GraphQLArgument(name = "page") Integer page,
			@GraphQLArgument(name = "size") Integer size
	) {
		def company = SecurityUtils.currentCompanyId()
		
		String query = '''Select d from Reapplication d where
						(lower(d.disbursement.payeeName) like lower(concat('%',:filter,'%'))
						or lower(d.disbursement.disNo) like lower(concat('%',:filter,'%'))) 
						and to_date(to_char(d.createdDate, 'YYYY-MM-DD'),'YYYY-MM-DD')
             			between to_date(:start,'YYYY-MM-DD') and to_date(:end,'YYYY-MM-DD')'''

		String countQuery = '''Select count(d) from Reapplication d where
							(lower(d.disbursement.payeeName) like lower(concat('%',:filter,'%'))
						or lower(d.disbursement.disNo) like lower(concat('%',:filter,'%'))) 
						and to_date(to_char(d.createdDate, 'YYYY-MM-DD'),'YYYY-MM-DD')
             			between to_date(:start,'YYYY-MM-DD') and to_date(:end,'YYYY-MM-DD')'''

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

		query += ''' ORDER BY d.disbursement.disNo DESC'''

		getPageable(query, countQuery, page, size, params)
	}

	//mutations
	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "upsertReapplication")
	Reapplication upsertReapplication(
			@GraphQLArgument(name = "id") UUID id
	) {
		def company = SecurityUtils.currentCompanyId()
		
		def dis = disbursementServices.disbursementById(id)
		def upsert = new Reapplication()
		upsert.transType = null
		upsert.disbursement = dis
		upsert.company = company
		upsert.supplier = dis.supplier
		upsert.discountAmount = 0
		upsert.ewtAmount = 0
		upsert.appliedAmount = 0
		upsert.prevApplied = dis.appliedAmount
		upsert.status = "DRAFT"
		upsert.posted = false
		upsert.postedLedger = null
		upsert.remarks = null
		save(upsert)
		return upsert

	}

	//update reapplication
	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "reapplicationUpsert")
	GraphQLRetVal<Boolean> reapplicationUpsert(
			@GraphQLArgument(name = "id") UUID id
	) {
		def company = SecurityUtils.currentCompanyId()
		
		def dis = disbursementServices.disbursementById(id)
		def checkpoint = this.getReapplicationStatus(id, "DRAFT")
		def hasValue = checkpoint.size()

		def result = new GraphQLRetVal(true, true, "Reapplication successfully created")

		if(hasValue){
			result = new GraphQLRetVal(false, false, "Reapplication already drafted. Please post drafted reapplication to create another one.")
		}else{
			def upsert = new Reapplication()
			upsert.transType = null
			upsert.rpNo = generatorService.getNextValue(GeneratorType.RPNO, {
				return "RP-" + StringUtils.leftPad(it.toString(), 6, "0")
			})
			upsert.company = company
			upsert.disbursement = dis
			upsert.supplier = dis.supplier
			upsert.discountAmount = 0
			upsert.ewtAmount = 0
			upsert.appliedAmount = 0
			upsert.prevApplied = dis.appliedAmount
			upsert.status = "DRAFT"
			upsert.posted = false
			upsert.postedLedger = null
			upsert.remarks = null
			save(upsert)
		}
		return result
	}

	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "updateReapply")
	Reapplication updateReapply(
			@GraphQLArgument(name = "id") UUID id,
			@GraphQLArgument(name = "fields")  Map<String,Object>  fields,
			@GraphQLArgument(name = "items")  ArrayList<Map<String, Object>>  items
	) {
		def company = SecurityUtils.currentCompanyId()
		def reapp = upsertFromMap(id, fields, { Reapplication entity, boolean forInsert ->
			if (!forInsert) {
				entity.discountAmount = entity.discountAmount.setScale(2, RoundingMode.HALF_EVEN)
				entity.ewtAmount = entity.ewtAmount.setScale(2, RoundingMode.HALF_EVEN)
				entity.appliedAmount = entity.appliedAmount.setScale(2, RoundingMode.HALF_EVEN)
				entity.company = company
				
				if(entity.rpNo == null){
					entity.rpNo = generatorService.getNextValue(GeneratorType.RPNO, {
						return "RP-" + StringUtils.leftPad(it.toString(), 6, "0")
					})
				}
			}
		})
		//insert to disbursement ap
		def disAp = items as ArrayList<DisbursementApDto>
		disAp.each {
			def dto = objectMapper.convertValue(it, DisbursementApDto.class)
			disbursementApServices.upsertDisReap(dto, reapp)
		}

		return reapp
	}

	@Transactional(rollbackFor = Exception.class)
	Reapplication updateReappForRemove(
			@GraphQLArgument(name = "id") UUID id,
			@GraphQLArgument(name = "discountAmount") BigDecimal discountAmount,
			@GraphQLArgument(name = "ewtAmount") BigDecimal ewtAmount,
			@GraphQLArgument(name = "appliedAmount") BigDecimal appliedAmount
	) {
		def reapp = findOne(id)
		if(reapp.discountAmount > BigDecimal.ZERO){
			BigDecimal discount = reapp.discountAmount - discountAmount
			reapp.discountAmount = discount.setScale(2, RoundingMode.HALF_EVEN)
		}
		if(reapp.ewtAmount > BigDecimal.ZERO){
			BigDecimal ewt = reapp.ewtAmount - ewtAmount
			reapp.ewtAmount = ewt.setScale(2, RoundingMode.HALF_EVEN)
		}
		if(reapp.appliedAmount > BigDecimal.ZERO){
			BigDecimal applied = reapp.appliedAmount - appliedAmount
			reapp.appliedAmount = applied.setScale(2, RoundingMode.HALF_EVEN)
		}
		return reapp
	}

	//post/void trigger
	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "postReapplication")
	Reapplication postReapplication(
			@GraphQLArgument(name = "id") UUID id,
			@GraphQLArgument(name = "status") Boolean status
	) {
		def parent = findOne(id)
		if(status){ // reverse
			def header = ledgerServices.findOne(parent.postedLedger)
			ledgerServices.reverseEntriesCustom(header, Instant.now())
			//update AP
			parent.postedLedger = null
			parent.status = "VOIDED"
			parent.posted = false
			save(parent)

			//update disbursement
			disbursementServices.updateForReapplicationPost(
					parent.disbursement.id,
					parent.discountAmount,
					parent.ewtAmount,
					parent.appliedAmount,
					true
			)

			def ap = disbursementApServices.apReapplication(id)
			ap.each {
				if(it.ewtAmount > BigDecimal.ZERO){
					wtx2307Service.remove2307(it.payable.id)
				}
				//update ap inag void
				accountsPayableServices.updateApForRemove(it.payable.id, parent.rpNo, it.appliedAmount, it.posted)
				//update disAp posted = false
				disbursementApServices.updateDisApPostedReapplication(it, null, false)
			}

		}else{
			postToLedgerAccounting(parent)
			//update disbursement
			disbursementServices.updateForReapplicationPost(
					parent.disbursement.id,
					parent.discountAmount,
					parent.ewtAmount,
					parent.appliedAmount,
					false
			)

			//post to ewt if naa
			def ap = disbursementApServices.apReapplication(id)
			ap.each {
				if(it.ewtAmount > BigDecimal.ZERO){
					def netVat =  (it.grossAmount - it.vatAmount)
					Map<String, Object> ewt = new HashMap<>()
					ewt.put('refId',it.payable.id)
					ewt.put('sourceDoc', parent.disbursement?.disNo)
					ewt.put('refNo',it.payable.apNo)
					ewt.put('wtxDate',Instant.now().plus(Duration.ofHours(8)))
					ewt.put('type','AP') //AP, AROTHERS
					ewt.put('gross',it.appliedAmount) //net of discount
					ewt.put('vatAmount',it.vatAmount) // 0
					ewt.put('netVat',netVat.setScale(2, RoundingMode.HALF_EVEN)) // same by gross
					ewt.put('ewtAmount',it.ewtAmount) //ewt amount
					wtx2307Service.upsert2307(ewt, null, parent.supplier.id)
				}
			}
			//end

			//update ap balance
			ap.each {
				if(!it.posted){
					accountsPayableServices.updateAp(it.payable.id, parent.rpNo, it.appliedAmount)
				}
				//update disbursement Ap posted
				disbursementApServices.updateDisApPostedReapplication(it, parent.disbursement, true)
			}
			//end

		}

		return parent
	}

	//accounting view
	@GraphQLQuery(name = "reapplyAccountView")
	List<JournalEntryViewDto> reapplyAccountView(
			@GraphQLArgument(name = "id") UUID id,
			@GraphQLArgument(name = "status") Boolean status
	) {
		def result = new ArrayList<JournalEntryViewDto>()
		//ewt rate
		if(id) { //post
			def parent = findOne(id)
			def ewt1 = BigDecimal.ZERO; def ewt2 = BigDecimal.ZERO; def ewt3 = BigDecimal.ZERO;
			def ewt4 = BigDecimal.ZERO; def ewt5 = BigDecimal.ZERO; def ewt7 = BigDecimal.ZERO;
			def ewt10 = BigDecimal.ZERO; def ewt15 = BigDecimal.ZERO; def ewt18 = BigDecimal.ZERO;
			def ewt30 = BigDecimal.ZERO;

			def disburseDetials = disbursementApServices.apReapplication(parent.id)
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
			//ewt rate
			if(parent.transType?.flagValue){
				def headerLedger = integrationServices.generateAutoEntries(parent) {it, mul ->
					it.flagValue = parent.transType?.flagValue

					def applied = parent.appliedAmount - (parent.discountAmount + parent.ewtAmount)

					//debit // make negative
					it.advanceAmount = status ? applied * -1 : applied

					//credit //make negative
					it.disbursementAmount = status ? parent.appliedAmount * -1 :parent.appliedAmount

					//ewt amount //normal credits
					it.discAmount = status ? parent.discountAmount : parent.discountAmount * -1
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
					//end ewt amount

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
			}else{ //reverse
				if(parent.postedLedger){
					def header = ledgerServices.findOne(parent.postedLedger)
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
		return result.sort{it.debit}.reverse(true)
	}

	//accounting post

	@Transactional(rollbackFor = Exception.class)
	Reapplication postToLedgerAccounting(Reapplication domain){
		def yearFormat = DateTimeFormatter.ofPattern("yyyy")
		def parent = super.save(domain) as Reapplication
		//ewt rate
		def ewt1 = BigDecimal.ZERO; def ewt2 = BigDecimal.ZERO; def ewt3 = BigDecimal.ZERO;
		def ewt4 = BigDecimal.ZERO; def ewt5 = BigDecimal.ZERO; def ewt7 = BigDecimal.ZERO;
		def ewt10 = BigDecimal.ZERO; def ewt15 = BigDecimal.ZERO; def ewt18 = BigDecimal.ZERO;
		def ewt30 = BigDecimal.ZERO;

		def parentDetials = disbursementApServices.apReapplication(parent.id)
		parentDetials.each {
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

		def headerLedger = integrationServices.generateAutoEntries(parent) {it, mul ->
			it.flagValue = parent.transType?.flagValue

			def applied = parent.appliedAmount - (parent.discountAmount + parent.ewtAmount)

			//debit // make negative
			it.advanceAmount = applied * -1

			//credit //make negative
			it.disbursementAmount = parent.appliedAmount * -1

			//ewt amount //normal credits
			it.discAmount = parent.discountAmount
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
			//

			//sum ewt
			def ewt = [ewt1, ewt2, ewt3, ewt4, ewt5, ewt7, ewt10, ewt15, ewt18, ewt30]
			def sumEwt = ewt.sum() as BigDecimal
			it.cwt = sumEwt.setScale(2, RoundingMode.HALF_EVEN)

		}

		Map<String,String> details = [:]

		parent.details.each { k,v ->
			details[k] = v
		}

		details["REAPPLICATION_ID"] = parent.id.toString()
		details["DISBURSEMENT_ID"] = parent.disbursement.id.toString()
		details["SUPPLIER_ID"] = parent.supplier.id.toString()

		headerLedger.transactionNo = parent.rpNo
		headerLedger.transactionType = "DISBURSEMENT REAPPLICATION"
		headerLedger.referenceType = "ACCOUNTS PAYABLE"
		headerLedger.referenceNo = parent.referenceNo

		def pHeader =	ledgerServices.persistHeaderLedger(headerLedger,
				"${Instant.now().atZone(ZoneId.systemDefault()).format(yearFormat)}-${parent.disbursement.disNo}",
				"${parent.supplier.supplierFullname}",
				"${parent.remarks}",
				parent.disbursement.disType.equalsIgnoreCase("CASH") ? LedgerDocType.CS : LedgerDocType.CK, // CS = CASH , CK = CHECK
				JournalType.DISBURSEMENT,
				Instant.now(),
				details)
		parent.postedLedger = pHeader.id
		parent.status = "POSTED"
		parent.posted = true

		save(parent)
	}

	//accounting manual
	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "postReappManual")
	GraphQLRetVal<Boolean> postReappManual(
			@GraphQLArgument(name = "id") UUID id,
			@GraphQLArgument(name = "header")  Map<String,Object>  header,
			@GraphQLArgument(name = "entries")  List<Map<String,Object>>  entries
	) {
		def parent = findOne(id)

		Map<String,String> details = [:]

		parent.details.each { k,v ->
			details[k] = v
		}

		details["REAPPLICATION_ID"] = parent.id.toString()
		details["DISBURSEMENT_ID"] = parent.disbursement.id.toString()
		details["SUPPLIER_ID"] = parent.supplier.id.toString()

		Map<String, Object> headerLedger = header
		headerLedger.put('transactionNo', parent.rpNo)
		headerLedger.put('transactionType', "DISBURSEMENT REAPPLICATION")
		headerLedger.put('referenceType', "ACCOUNTS PAYABLE")
		headerLedger.put('referenceNo', parent.referenceNo)

		def result = ledgerServices.addManualJVDynamic(
				headerLedger,
				entries,
				parent.disbursement.disType.equalsIgnoreCase("CASH") ? LedgerDocType.CS : LedgerDocType.CK,
				JournalType.DISBURSEMENT,
				Instant.now(),
				details
		)

		//update parent
		parent.postedLedger = result.returnId
		parent.status = "POSTED"
		parent.posted = true
		save(parent)

		//update disbursement
		disbursementServices.updateForReapplicationPost(
				parent.disbursement.id,
				parent.discountAmount,
				parent.ewtAmount,
				parent.appliedAmount,
				false
		)

		//post to ewt if naa
		def ap = disbursementApServices.apReapplication(id)
		ap.each {
			if(it.ewtAmount > BigDecimal.ZERO){
				Map<String, Object> ewt = new HashMap<>()
				ewt.put('refId',it.payable.id)
				ewt.put('refNo',it.payable.apNo)
				ewt.put('wtxDate',Instant.now().plus(Duration.ofHours(8)))
				ewt.put('type','AP') //AP, AROTHERS
				ewt.put('gross',it.appliedAmount) //net of discount
				ewt.put('vatAmount',it.vatAmount) // 0
				ewt.put('netVat',(it.appliedAmount - it.vatAmount)) // same by gross
				ewt.put('ewtAmount',it.ewtAmount) //ewt amounnt
				wtx2307Service.upsert2307(ewt, null, parent.supplier.id)
			}
		}
		//end

		//update ap balance
		def p = disbursementApServices.apReapplication(id)
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

	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "updateRPStatus")
	Reapplication reapplicationUpdateStatus(
			@GraphQLArgument(name = "id") UUID id,
			@GraphQLArgument(name = "status") String status
	){
		def up = findOne(id)
		up.status = status
		save(up)
	}

}
