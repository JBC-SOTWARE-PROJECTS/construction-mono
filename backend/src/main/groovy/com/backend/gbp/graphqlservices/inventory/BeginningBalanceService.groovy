package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.accounting.JournalType
import com.backend.gbp.domain.accounting.Ledger
import com.backend.gbp.domain.accounting.LedgerDocType
import com.backend.gbp.domain.inventory.QuantityAdjustment
import com.backend.gbp.graphqlservices.accounting.IntegrationServices
import com.backend.gbp.graphqlservices.accounting.LedgerServices
import com.backend.gbp.rest.dto.BeginningBalanceDto
import com.backend.gbp.rest.dto.ItemDto
import com.backend.gbp.rest.dto.OfficeDto
import com.backend.gbp.rest.dto.journal.JournalEntryViewDto
import com.backend.gbp.security.SecurityUtils
import com.fasterxml.jackson.databind.ObjectMapper
import com.backend.gbp.domain.inventory.BeginningBalance
import com.backend.gbp.repository.inventory.BeginningBalanceRepository
import com.backend.gbp.rest.InventoryResource
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.GeneratorType
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Component

import javax.transaction.Transactional
import java.math.RoundingMode
import java.time.ZoneId
import java.time.format.DateTimeFormatter

@Component
@GraphQLApi
@TypeChecked
class BeginningBalanceService {
	
	@Autowired
	BeginningBalanceRepository beginningBalanceRepository
	
	@Autowired
	InventoryResource inventoryResource
	
	@Autowired
	ObjectMapper objectMapper
	
	@Autowired
	GeneratorService generatorService

	@Autowired
	InventoryLedgerService inventoryLedgerService

	@Autowired
	NamedParameterJdbcTemplate namedParameterJdbcTemplate

	@Autowired
	IntegrationServices integrationServices

	@Autowired
	LedgerServices ledgerServices
	
	@GraphQLQuery(name = "beginningListByItem", description = "List of Beginning Balance by Item")
	List<BeginningBalance> beginningListByItem(@GraphQLArgument(name = "item") UUID id, @GraphQLArgument(name = "office") UUID office) {
		def company = SecurityUtils.currentCompanyId()
		return beginningBalanceRepository.getBeginningByIdLocation(id, office, company).sort { it.createdDate }.reverse(true)
	}
	
	//
	//MUTATION
	
	@Transactional
	@GraphQLMutation(name = "beginningBalanceInsert", description = "insert BEG")
	BeginningBalance beginningBalanceInsert(
			@GraphQLArgument(name = "fields") Map<String, Object> fields
	) {
		def company = SecurityUtils.currentCompanyId()
		BeginningBalance insert = new BeginningBalance()
		def data = new BeginningBalance()
		def beg = objectMapper.convertValue(fields, BeginningBalance)
		try {
			//def check = inventoryResource.getLedger(beg.item.id as String, beg.office.id as String)
			def checkIfExist = beginningBalanceRepository.getBeginningByItemLocationPosted(beg.item.id, beg.office.id, company)
			if (!checkIfExist.size()) {
				insert.refNum = generatorService.getNextValue(GeneratorType.BEGINNING) { Long no ->
					'BEG-' + StringUtils.leftPad(no.toString(), 6, "0")
				}
				insert.dateTrans = beg.dateTrans
				insert.item = beg.item
				insert.office = beg.office
				insert.quantity = beg.quantity
				insert.unitCost = beg.unitCost
				insert.isPosted = false
				insert.isCancel = false
				insert.company = company
				data = beginningBalanceRepository.save(insert)
			}
		} catch (Exception e) {
			throw new Exception("Something was Wrong : " + e)
		}
		return data
	}

	@Transactional
	@GraphQLMutation(name = "upsertBegQty")
	BeginningBalance upsertBegQty(
			@GraphQLArgument(name = "qty") BigDecimal qty,
			@GraphQLArgument(name = "id") UUID id
	) {
		BeginningBalance upsert = beginningBalanceRepository.findById(id).get()
		upsert.quantity = qty
		return upsert
	}

	@GraphQLQuery(name = "begBalanceAccountView")
	List<JournalEntryViewDto> begBalanceAccountView(
			@GraphQLArgument(name = "id") UUID id,
			@GraphQLArgument(name = "status") Boolean status
	) {
		def result = new ArrayList<JournalEntryViewDto>()
		def begItem = beginningBalanceRepository.findById(id).get()

		def flagValue = "BEGINNING_BALANCE"

		if (begItem.postedLedger) {
			def header = ledgerServices.findOne(begItem.postedLedger)
			Set<Ledger> ledger = new HashSet<Ledger>(header.ledger);
			ledger.each {
				if(!status) {
					//reverse entry if status is false for void
					def list = new JournalEntryViewDto(
							code: it.journalAccount.code,
							desc: it.journalAccount.accountName,
							debit: it.credit,
							credit: it.debit
					)
					result.add(list)
				}else{
					def list = new JournalEntryViewDto(
							code: it.journalAccount.code,
							desc: it.journalAccount.accountName,
							debit: it.debit,
							credit: it.credit
					)
					result.add(list)
				}
			}
		} else {
			if (flagValue) {
				def headerLedger = integrationServices.generateAutoEntries(begItem) {
					it, mul ->
						//NOTE: always round cost to Bankers Note HALF EVEN
						BigDecimal inventoryCost = begItem.unitCost * begItem.quantity
						BigDecimal cost = inventoryCost.setScale(2, RoundingMode.HALF_EVEN)
						def cat = begItem.item.assetSubAccount
						it.flagValue = flagValue

						//not multiple
						it.inventorySubAccount = cat
						it.inventoryCost = cost
						it.inventoryCostNegative = cost * -1
						it.beginningCost = cost
						it.beginningCostNegative = cost * -1

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
			}

		}
		return result.sort { it.credit }
	}


	@Transactional
	@GraphQLMutation(name = "updateBegBalStatus")
	BeginningBalance updateBegBalStatus(
			@GraphQLArgument(name = "status") Boolean status,
			@GraphQLArgument(name = "id") UUID id
	) {
		def upsert = beginningBalanceRepository.findById(id).get()
		def company = SecurityUtils.currentCompanyId()
		//do some magic here ...
		//update ledger
		if(status){
			def checkIfExist = beginningBalanceRepository.getBeginningByItemLocationPosted(upsert.item.id, upsert.office.id, company)
			if(!checkIfExist.size()) {
				//ledger post
				inventoryLedgerService.postInventoryLedgerBegBalance(upsert)
				//accounting post
				return postToLedgerAccounting(upsert)
			}
			return null
		}else{
			//check if has accounting entries
			upsert.isPosted = status
			upsert.isCancel = !status
			upsert.postedLedger = null
			upsert.postedBy = null
			if(upsert.postedLedger){
				def header = ledgerServices.findOne(upsert.postedLedger)
				ledgerServices.reverseEntriesCustom(header, upsert.dateTrans)
			}
			//ledger void
			inventoryLedgerService.voidLedgerByRef(upsert.refNum)
			return beginningBalanceRepository.save(upsert)
		}
	}

	//accounting entries save
	BeginningBalance postToLedgerAccounting(BeginningBalance beginningBalance) {
		def yearFormat = DateTimeFormatter.ofPattern("yyyy")
		def begItem = beginningBalance

		def flagValue = "BEGINNING_BALANCE"


		if (flagValue) {
			def headerLedger = integrationServices.generateAutoEntries(begItem) {
				it, mul ->
					//NOTE: always round cost to Bankers Note HALF EVEN
					BigDecimal inventoryCost = begItem.unitCost * begItem.quantity
					BigDecimal cost = inventoryCost.setScale(2, RoundingMode.HALF_EVEN)
					def cat = begItem.item.assetSubAccount
					it.flagValue = flagValue

					//not multiple
					it.inventorySubAccount = cat
					it.inventoryCost = cost
					it.inventoryCostNegative = cost * -1
					it.beginningCost = cost
					it.beginningCostNegative = cost * -1
			}

			Map<String, String> details = [:]

			begItem.details.each { k, v ->
				details[k] = v
			}

			details["TRANSACTION_ID"] = begItem.id.toString()
			details["LOCATION_ID"] = begItem.office.id.toString()
			details["LOCATION_DESCRIPTION"] = begItem.office.officeDescription

			headerLedger.transactionNo = begItem.refNum
			headerLedger.transactionType = "BEGINNING BALANCE"
			headerLedger.referenceType ="BEGINNING BALANCE"
			headerLedger.referenceNo =  begItem.refNum

			def pHeader = ledgerServices.persistHeaderLedger(headerLedger,
					"${begItem.dateTrans.atZone(ZoneId.systemDefault()).format(yearFormat)}-${begItem.refNum}",
					"${begItem.office.officeDescription}-BEGINNING BALANCE",
					"${begItem.office.officeDescription}-BEGINNING BALANCE",
					LedgerDocType.BB,
					JournalType.GENERAL,
					begItem.dateTrans,
					details)

			begItem.postedLedger = pHeader.id
			begItem.isPosted = true
			begItem.isCancel = false
			begItem.postedBy = SecurityUtils.currentLogin()

			return beginningBalanceRepository.save(begItem)
		}
		return begItem
	}

	@GraphQLQuery(name = "beginningBalancePage")
	Page<BeginningBalanceDto> beginningBalancePage(
			@GraphQLArgument(name = "filter") String filter,
			@GraphQLArgument(name = "office") UUID office,
			@GraphQLArgument(name = "groupId") UUID groupId,
			@GraphQLArgument(name = "category") List<UUID> category,
			@GraphQLArgument(name = "brand") String brand,
			@GraphQLArgument(name = "page") Integer page,
			@GraphQLArgument(name = "size") Integer size
	) {
		def company = SecurityUtils.currentCompanyId()
		List<BeginningBalanceDto> records = []

		String query = '''SELECT a.id,
    						a.item,
    						a.office,
    						o.office_description,
    						COALESCE(c.onhand, 0::bigint::numeric) AS beginning_balance,
    						COALESCE(round(c.unitcost, 4), 0::numeric) AS beginning_cost,
    						b.desc_long,
    						b.sku,
    						b.item_code,
    						b.item_group,
    						b.item_category,
    						ic.category_description,
    						um.unit_description as uou,
    						b.brand,
    						b.production,
    						b.is_medicine,
    						b.vatable,
    						b.brand,
    						b.fix_asset,
    						b.consignment,
    						b.for_sale
   						FROM inventory.office_item a
     						LEFT JOIN inventory.onhandbegref c ON c.item = a.item AND c.office = a.office
   						    LEFT JOIN inventory.item b ON b.id = a.item
     						LEFT JOIN inventory.item_categories ic ON ic.id = b.item_category
   						    LEFT JOIN inventory.unit_measurements um ON um.id = b.unit_of_usage 
     						LEFT JOIN office o ON o.id = a.office
  						WHERE a.is_assign = true AND b.active = true
  							and (b.desc_long ilike concat('%',:filter,'%')
  							or b.sku ilike concat('%',:filter,'%')
  							or b.item_code ilike concat('%',:filter,'%')) '''

		String countQuery = '''SELECT count(*)
   						FROM inventory.office_item a
     						LEFT JOIN inventory.onhandbegref c ON c.item = a.item AND c.office = a.office
     						LEFT JOIN inventory.item b ON b.id = a.item
   						    LEFT JOIN inventory.item_categories ic ON ic.id = b.item_category
   						    LEFT JOIN inventory.unit_measurements um ON um.id = b.unit_of_usage 
     						LEFT JOIN office o ON o.id = a.office
  						WHERE a.is_assign = true AND b.active = true
  							and (b.desc_long ilike concat('%',:filter,'%')
  							or b.sku ilike concat('%',:filter,'%')
  							or b.item_code ilike concat('%',:filter,'%')) '''

		Map<String, Object> params = new HashMap<>()
		params.put('filter', filter)
		params.put('size', size)
		params.put('offset', size * page)

		if (office) {
			query += ''' and (a.office = :office) '''
			countQuery += ''' and (a.office = :office) '''
			params.put("office", office)
		}

		if (groupId) {
			query += ''' and (b.item_group = :groupId) '''
			countQuery += ''' and (b.item_group = :groupId) '''
			params.put("groupId", groupId)
		}

		if (category) {
			query += ''' and (b.item_category IN (:category)) '''
			countQuery += ''' and (b.item_category IN (:category)) '''
			params.put("category", category)
		}

		if (brand) {
			query += ''' and (b.brand = :brand)'''
			countQuery += ''' and (b.brand = :brand)'''
			params.put("brand", brand)
		}

		if (company) {
			query += ''' and (a.company = :company) '''
			countQuery += ''' and (a.company = :company) '''
			params.put("company", company)

		}

		query += ''' order by b.desc_long ASC LIMIT :size OFFSET :offset '''

		def recordsRaw= namedParameterJdbcTemplate.queryForList(query, params)

		recordsRaw.each {

			def item = new ItemDto(
					id: it.get("item", null) as UUID,
					descLong:  it.get("desc_long","") as String,
					sku:  it.get("sku","") as String,
					itemCode:  it.get("item_code","") as String,
					brand:  it.get("brand","") as String,
					itemGroupId:  it.get("item_group",null) as UUID,
					itemCategory:  it.get("item_category",null) as UUID,
					categoryDescription: it.get("category_description",null) as String,
					production:  it.get("production",false) as Boolean,
					isMedicine:  it.get("is_medicine",false) as Boolean,
					vatable:  it.get("vatable",false) as Boolean,
					fixAsset:  it.get("fix_asset",false) as Boolean,
					consignment:  it.get("consignment",false) as Boolean,
					forSale:  it.get("for_sale",false) as Boolean
			)

			def officeObj = new OfficeDto(
					id: it.get("office", null) as UUID,
					officeDescription: it.get("office_description", "") as String,
			)
			//maps
			records << new BeginningBalanceDto(
					id: it.get("id", null) as UUID,
					item: item,
					office: officeObj,
					uou: it.get("uou","") as String,
					beginningBalance: it.get("beginning_balance", BigDecimal.ZERO) as BigDecimal,
					beginningCost: it.get("beginning_cost", BigDecimal.ZERO) as BigDecimal
			)
		}

		def count =  namedParameterJdbcTemplate.queryForObject(countQuery, params, Long.class)


		new PageImpl<BeginningBalanceDto>(records, PageRequest.of(page, size), count)
	}
	
}
