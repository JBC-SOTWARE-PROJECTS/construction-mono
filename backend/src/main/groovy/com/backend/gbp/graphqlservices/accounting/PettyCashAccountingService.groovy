package com.backend.gbp.graphqlservices.accounting


import com.backend.gbp.domain.accounting.PettyCashAccounting
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.rest.dto.journal.JournalEntryViewDto
import com.backend.gbp.rest.dto.payables.ApReferenceDto
import com.backend.gbp.rest.dto.payables.PCVItemsDto
import com.backend.gbp.rest.dto.payables.PCVOthersDto
import com.backend.gbp.rest.dto.payables.PettyCashName
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
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

import java.math.RoundingMode
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter

@Service
@GraphQLApi
class PettyCashAccountingService extends AbstractDaoService<PettyCashAccounting> {

	@Autowired
	GeneratorService generatorService

	@Autowired
	ObjectMapper objectMapper

	@Autowired
	PettyCashItemServices pettyCashItemServices

	@Autowired
	PettyCashOtherServices pettyCashOtherServices

	@Autowired
	IntegrationServices integrationServices

	@Autowired
	LedgerServices ledgerServices

	@Autowired
	NamedParameterJdbcTemplate namedParameterJdbcTemplate

	PettyCashAccountingService() {
		super(PettyCashAccounting.class)
	}
	
	@GraphQLQuery(name = "pettyCashAccountingById")
	PettyCashAccounting pettyCashAccountingById(
			@GraphQLArgument(name = "id") UUID id
	) {
		findOne(id)
	}


	@GraphQLQuery(name = "pettyCashName", description = "Find Distinct Payee Name")
	List<PettyCashName> pettyCashName() {

		List<PettyCashName> records = []
		def company = SecurityUtils.currentCompanyId()

		String query = '''select distinct pc.payee_name as payee from accounting.petty_cash pc where pc.payee_name is not null '''


		Map<String, Object> params = new HashMap<>()
		if (company) {
			query += ''' and (p.company = :company) '''
			params.put("company", company)
		}

		def recordsRaw= namedParameterJdbcTemplate.queryForList(query, params)

		recordsRaw.each {
			records << new PettyCashName(
					name: StringUtils.upperCase( it.get("payee","") as String)
			)
		}

		return records

	}

	@GraphQLQuery(name = "pcReferenceType", description = "Find Ap reference Type")
	List<ApReferenceDto> pcReferenceType() {

		List<ApReferenceDto> records = []

		String query = '''select distinct p.reference_type as reference_type from accounting.petty_cash p where p.reference_type is not null '''


		Map<String, Object> params = new HashMap<>()


		def recordsRaw = namedParameterJdbcTemplate.queryForList(query, params)

		recordsRaw.each {
			records << new ApReferenceDto(
					referenceType: StringUtils.upperCase(it.get("reference_type", "") as String)
			)
		}

		return records

	}


	@GraphQLQuery(name = "pettyCashPage")
	Page<PettyCashAccounting> pettyCashPage(
			@GraphQLArgument(name = "filter") String filter,
			@GraphQLArgument(name = "payee") String payee,
			@GraphQLArgument(name = "status") Boolean status,
			@GraphQLArgument(name = "start") String start,
			@GraphQLArgument(name = "end") String end,
			@GraphQLArgument(name = "page") Integer page,
			@GraphQLArgument(name = "size") Integer size
	) {
		def company = SecurityUtils.currentCompanyId()
		String query = '''Select d from PettyCashAccounting d where
						( lower(d.remarks) like lower(concat('%',:filter,'%'))
						or lower(d.pcvNo) like lower(concat('%',:filter,'%')) )
						and to_date(to_char(d.pcvDate, 'YYYY-MM-DD'),'YYYY-MM-DD')
             			between to_date(:start,'YYYY-MM-DD') and  to_date(:end,'YYYY-MM-DD') '''

		String countQuery = '''Select count(d) from PettyCashAccounting d where
							( lower(d.remarks) like lower(concat('%',:filter,'%'))
						or lower(d.pcvNo) like lower(concat('%',:filter,'%')) )
						and to_date(to_char(d.pcvDate, 'YYYY-MM-DD'),'YYYY-MM-DD')
             			between to_date(:start,'YYYY-MM-DD') and  to_date(:end,'YYYY-MM-DD') '''

		Map<String, Object> params = new HashMap<>()
		params.put('filter', filter)
		params.put('start', start)
		params.put('end', end)

		if (payee) {
			query += ''' and (lower(d.payeeName) = lower(:payee)) '''
			countQuery += ''' and (lower(d.payeeName) = lower(:payee)) '''
			params.put("payee", payee)
		}

		if (status) {
			query += ''' and (d.posted = :status or d.posted is null) '''
			countQuery += ''' and (d.posted = :status or d.posted is null) '''
			params.put("status", !status)
		}

		if (company) {
			query += ''' and (d.company = :company) '''
			countQuery += ''' and (d.company = :company) '''
			params.put("company", company)
		}


		query += ''' ORDER BY d.pcvNo DESC'''

		getPageable(query, countQuery, page, size, params)
	}


	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "upsertPettyCashAccounting")
	PettyCashAccounting upsertPettyCashAccounting(
			@GraphQLArgument(name = "id") UUID id,
			@GraphQLArgument(name = "fields")  Map<String,Object>  fields,
			@GraphQLArgument(name = "items")  ArrayList<Map<String, Object>>  items,
			@GraphQLArgument(name = "others")  ArrayList<Map<String, Object>>  others
	) {
		def company = SecurityUtils.currentCompanyId()
		def parent = upsertFromMap(id, fields, {  PettyCashAccounting entity, boolean forInsert ->
			if(forInsert){
				entity.pcvNo = generatorService.getNextValue(GeneratorType.PCVNO, {
					return "PCV-" + StringUtils.leftPad(it.toString(), 6, "0")
				})
				entity.company = company
				entity.posted = false
				entity.postedLedger = null
				entity.status = "DRAFT"
			}
			entity.amountIssued = entity.amountIssued.setScale(2, RoundingMode.HALF_EVEN)
			entity.amountUsed = entity.amountUsed.setScale(2, RoundingMode.HALF_EVEN)
			entity.amountUnused = entity.amountUnused.setScale(2, RoundingMode.HALF_EVEN)
		})
		//items insert
		if(parent.pcvCategory.equalsIgnoreCase("PURCHASE")){
			//delete others transaction
			if(id){
				pettyCashOtherServices.removeOthersByParent(parent.id)
			}
			//end
			def purItems = items as ArrayList<PCVItemsDto>
			purItems.each {
				def dto = objectMapper.convertValue(it, PCVItemsDto.class)
				pettyCashItemServices.upsertPurchaseItems(dto, parent)
			}
		}else if(parent.pcvCategory.equalsIgnoreCase("OTHERS")){
			//delete purchase transaction
			if(id){
				pettyCashItemServices.removePurchaseItemsByParent(parent.id)
			}
			//end
			//others insert
			def otherItems = others as ArrayList<PCVOthersDto>
			otherItems.each {
				def dto = objectMapper.convertValue(it, PCVOthersDto.class)
				pettyCashOtherServices.upsertOthers(dto, parent)
			}
		}

		return parent
	}

	//update petty cash status to draft
	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "updatePettyCashStatus")
	PettyCashAccounting updatePettyCashStatus(
			@GraphQLArgument(name = "id") UUID id,
			@GraphQLArgument(name = "status") String status
	) {
		def ap = findOne(id)
		ap.status = status
		save(ap)
	}


	//post/void trigger
	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "postPettyCash")
	PettyCashAccounting postPettyCash(
			@GraphQLArgument(name = "id") UUID id,
			@GraphQLArgument(name = "status") Boolean status
	) {
		def parent = findOne(id)
		if(status){ // reverse
			def header = ledgerServices.findOne(parent.postedLedger)
			ledgerServices.reverseEntriesCustom(header, Instant.now())
			//update Parent
			parent.postedLedger = null
			parent.status = "VOIDED"
			parent.posted = false
			save(parent)

		}else{
			postToLedgerAccounting(parent)
		}

		return parent
	}

	//accounting view
	@GraphQLQuery(name = "pettyCashAccountView")
	List<JournalEntryViewDto> pettyCashAccountView(
			@GraphQLArgument(name = "id") UUID id,
			@GraphQLArgument(name = "status") Boolean status
	) {
		def result = new ArrayList<JournalEntryViewDto>()
		//ewt rate
		if(id) { //post
			def parent = findOne(id)
			//ewt rate
			if(parent.transType?.flagValue){
				def headerLedger = integrationServices.generateAutoEntries(parent) {it, mul ->
					it.flagValue = parent.transType?.flagValue

				}

				headerLedger.ledger.each {
					def list = new JournalEntryViewDto(
							code: it.journalAccount.code,
							desc: it.journalAccount.description,
							debit: it.debit,
							credit: it.credit
					)
					result.add(list)
				}
			}else{ //reverse
				if(parent.postedLedger){
					def header = ledgerServices.findOne(parent.postedLedger)
					header.ledger.each {
						def list = new JournalEntryViewDto(
								code: it.journalAccount.code,
								desc: it.journalAccount.description,
								debit: it.credit,
								credit: it.debit
						)
						result.add(list)
					}
				}
			}
		}
		return result
	}

	//accounting post

	@Transactional(rollbackFor = Exception.class)
	PettyCashAccounting postToLedgerAccounting(PettyCashAccounting domain){
		def yearFormat = DateTimeFormatter.ofPattern("yyyy")
		def parent = super.save(domain) as PettyCashAccounting
		//ewt rate

		def headerLedger = integrationServices.generateAutoEntries(parent) {it, mul ->
			it.flagValue = parent.transType?.flagValue

		}

		Map<String,String> details = [:]

		parent.details.each { k,v ->
			details[k] = v
		}

		details["PETTY_CASH_ID"] = parent.id.toString()
		details["PETTY_CASH_CATEGORY"] = parent.pcvCategory.toUpperCase()
		details["PAYEE_NAME"] =  parent.payeeName.toUpperCase()

		headerLedger.transactionNo = parent.pcvNo
		headerLedger.transactionType = "PETTY CASH"
		headerLedger.referenceType = null
		headerLedger.referenceNo = null

		def pHeader =	ledgerServices.persistHeaderLedger(headerLedger,
				"${Instant.now().atZone(ZoneId.systemDefault()).format(yearFormat)}-${parent.pcvNo}",
				"${parent.pcvNo}-${parent.payeeName}",
				"${parent.pcvNo}-${parent.payeeName}",
				LedgerDocType.PC, // Petty Cash
				JournalType.GENERAL,
				parent.pcvDate,
				details)
		parent.postedLedger = pHeader.id
		parent.status = "POSTED"
		parent.posted = true

		save(parent)
	}

	//accounting manual
	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "postPettyCashManual")
	GraphQLRetVal<Boolean> postPettyCashManual(
			@GraphQLArgument(name = "id") UUID id,
			@GraphQLArgument(name = "header")  Map<String,Object>  header,
			@GraphQLArgument(name = "entries")  List<Map<String,Object>>  entries
	) {
		def parent = findOne(id)

		Map<String,String> details = [:]

		parent.details.each { k,v ->
			details[k] = v
		}

		details["PETTY_CASH_ID"] = parent.id.toString()
		details["PETTY_CASH_CATEGORY"] = parent.pcvCategory.toUpperCase()
		details["PAYEE_NAME"] =  parent.payeeName.toUpperCase()

		Map<String, Object> headerLedger = header
		headerLedger.put('transactionNo', parent.pcvNo)
		headerLedger.put('transactionType', "PETTY CASH")
		headerLedger.put('referenceType', null)
		headerLedger.put('referenceNo', null)

		def result = ledgerServices.addManualJVDynamic(
				headerLedger,
				entries,
				parent.disbursement.disType.equalsIgnoreCase("CASH") ? LedgerDocType.CS : LedgerDocType.CK,
				JournalType.GENERAL,
				parent.pcvDate,
				details
		)

		//update parent
		parent.postedLedger = result.returnId
		parent.status = "POSTED"
		parent.posted = true
		save(parent)

		return result
	}

}
