package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.inventory.QuantityAdjustment
import com.backend.gbp.rest.dto.BeginningBalanceDto
import com.backend.gbp.rest.dto.ItemDto
import com.backend.gbp.rest.dto.OfficeDto
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
	
	@GraphQLQuery(name = "beginningListByItem", description = "List of Beginning Balance by Item")
	List<BeginningBalance> getBeginningById(@GraphQLArgument(name = "item") UUID id) {
		def company = SecurityUtils.currentCompanyId()
		return beginningBalanceRepository.getBeginningById(id, company).sort { it.createdDate }.reverse(true)
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
			def checkIfExist = beginningBalanceRepository.getBeginningByIdPosted(beg.item.id, company)
			if (!checkIfExist) {
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
			@GraphQLArgument(name = "qty") Integer qty,
			@GraphQLArgument(name = "id") UUID id
	) {
		BeginningBalance upsert = beginningBalanceRepository.findById(id).get()
		upsert.quantity = qty
		return upsert
	}


	@Transactional
	@GraphQLMutation(name = "updateBegBalStatus")
	BeginningBalance updateBegBalStatus(
			@GraphQLArgument(name = "status") Boolean status,
			@GraphQLArgument(name = "id") UUID id
	) {
		def upsert = beginningBalanceRepository.findById(id).get()
		upsert.isPosted = status
		upsert.isCancel = !status

		//do some magic here ...
		//update ledger
		if(status){
			//ledger post
			inventoryLedgerService.postInventoryLedgerBegBalance(upsert)
		}else{
			//ledger void
			inventoryLedgerService.voidLedgerByRef(upsert.refNum)
		}

		beginningBalanceRepository.save(upsert)
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
					id: it.get("id", null) as UUID,
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
					id: it.get("id", null) as UUID,
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
