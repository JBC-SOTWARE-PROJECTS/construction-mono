package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.inventory.InventoryLedger
import com.backend.gbp.domain.inventory.OfficeItem
import com.backend.gbp.rest.InventoryResource
import com.backend.gbp.rest.dto.InventoryInfoDto
import com.backend.gbp.rest.dto.InventoryInfoRawDto
import com.fasterxml.jackson.databind.ObjectMapper
import com.backend.gbp.domain.User
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.inventory.Inventory
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.repository.UserRepository
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.security.SecurityUtils
import com.backend.gbp.services.GeneratorService
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLContext
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Component

import java.math.RoundingMode
import java.time.Instant

@Component
@GraphQLApi
@TypeChecked
class InventoryService extends AbstractDaoService<Inventory> {

	InventoryService() {
		super(Inventory.class)
	}

	@Autowired
	ObjectMapper objectMapper

	@Autowired
	GeneratorService generatorService

	@Autowired
	UserRepository userRepository

	@Autowired
	EmployeeRepository employeeRepository

	@Autowired
	InventoryResource inventoryResource

	@Autowired
	NamedParameterJdbcTemplate namedParameterJdbcTemplate

	@Autowired
	ItemService itemService


	//context last_wcost
	@GraphQLQuery(name = "last_wcost")
	BigDecimal last_wcost(@GraphQLContext Inventory inventory) {
		def id = inventory.item.id.toString()
		return inventoryResource.getLastWcost(id)
	}

	@GraphQLQuery(name = "getOnHandByItem")
	Inventory getOnHandByItem(
			@GraphQLArgument(name = "office") UUID office,
			@GraphQLArgument(name = "itemId") UUID itemId
	) {
		def company = SecurityUtils.currentCompanyId()
		String query = '''Select inv from Inventory inv where inv.officeId = :office and inv.itemId = :itemId and inv.company = :company'''
		Map<String, Object> params = new HashMap<>()
		params.put('office', office)
		params.put('itemId', itemId)
		params.put('company', company)
		createQuery(query, params).resultList.find()
	}

	@GraphQLQuery(name = "inventoryListPageable")
	Page<Inventory> inventoryListPageable(
			@GraphQLArgument(name = "filter") String filter,
			@GraphQLArgument(name = "group") UUID group,
			@GraphQLArgument(name = "category") List<UUID> category,
			@GraphQLArgument(name = "brand") String brand,
			@GraphQLArgument(name = "page") Integer page,
			@GraphQLArgument(name = "size") Integer size
	) {

		def company = SecurityUtils.currentCompanyId()
		User user = userRepository.findOneByLogin(SecurityUtils.currentLogin())
		Employee employee = employeeRepository.findOneByUser(user)

		String query = '''Select inv from Inventory inv where
						lower(concat(inv.descLong,inv.sku)) like lower(concat('%',:filter,'%'))
						and inv.officeId=:officeid and
						inv.active = true'''

		String countQuery = '''Select count(inv) from Inventory inv where
							lower(concat(inv.descLong,inv.sku)) like lower(concat('%',:filter,'%'))
							and inv.officeId=:officeid and
							inv.active = true'''

		Map<String, Object> params = new HashMap<>()
		params.put('officeid', employee.office.id)
		params.put('filter', filter)

		if (group) {
			query += ''' and (inv.item_group = :group)'''
			countQuery += ''' and (inv.item_group = :group)'''
			params.put("group", group)
		}

		if (category) {
			query += ''' and (inv.item_category IN (:category))'''
			countQuery += ''' and (inv.item_category IN (:category))'''
			params.put("category", category)
		}

		if (company) {
			query += ''' and (inv.company = :company)'''
			countQuery += ''' and (inv.company = :company)'''
			params.put("company", company)
		}

		if (brand) {
			query += ''' and (inv.brand = :brand)'''
			countQuery += ''' and (inv.brand = :brand)'''
			params.put("brand", brand)
		}


		query += ''' ORDER BY inv.descLong ASC'''

		Page<Inventory> result = getPageable(query, countQuery, page, size, params)
		return result
	}

	@GraphQLQuery(name = "inventoryListPageableByDep")
	Page<Inventory> inventoryListPageableByDep(
			@GraphQLArgument(name = "filter") String filter,
			@GraphQLArgument(name = "office") UUID office,
			@GraphQLArgument(name = "group") UUID group,
			@GraphQLArgument(name = "category") List<UUID> category,
			@GraphQLArgument(name = "brand") String brand,
			@GraphQLArgument(name = "page") Integer page,
			@GraphQLArgument(name = "size") Integer size
	) {
		def company = SecurityUtils.currentCompanyId()
		String query = '''Select inv from Inventory inv where
						lower(concat(inv.descLong,inv.sku)) like lower(concat('%',:filter,'%'))
						and inv.officeId=:officeid and
						inv.active = true'''

		String countQuery = '''Select count(inv) from Inventory inv where
							lower(concat(inv.descLong,inv.sku)) like lower(concat('%',:filter,'%'))
							and inv.officeId=:officeid and
							inv.active = true'''

		Map<String, Object> params = new HashMap<>()
		params.put('officeid', office)
		params.put('filter', filter)

		if (group) {
			query += ''' and (inv.item_group = :group)'''
			countQuery += ''' and (inv.item_group = :group)'''
			params.put("group", group)
		}

		if (category) {
			query += ''' and (inv.item_category IN (:category))'''
			countQuery += ''' and (inv.item_category IN (:category))'''
			params.put("category", category)
		}

		if (company) {
			query += ''' and (inv.company = :company)'''
			countQuery += ''' and (inv.company = :company)'''
			params.put("company", company)
		}

		if (brand) {
			query += ''' and (inv.brand = :brand)'''
			countQuery += ''' and (inv.brand = :brand)'''
			params.put("brand", brand)
		}

		query += ''' ORDER BY inv.descLong ASC'''

		Page<Inventory> result = getPageable(query, countQuery, page, size, params)
		return result
	}

	@GraphQLQuery(name = "inventoryOutputPageable")
	Page<Inventory> inventoryOutputPageable(
			@GraphQLArgument(name = "filter") String filter,
			@GraphQLArgument(name = "office") UUID office,
			@GraphQLArgument(name = "page") Integer page,
			@GraphQLArgument(name = "size") Integer size
	) {
		def company = SecurityUtils.currentCompanyId()
		String query = '''Select inv from Inventory inv where
						lower(concat(inv.descLong,inv.sku)) like lower(concat('%',:filter,'%'))
						and inv.officeId=:officeid and
						inv.active = true and inv.production = true'''

		String countQuery = '''Select count(inv) from Inventory inv where
							lower(concat(inv.descLong,inv.sku)) like lower(concat('%',:filter,'%'))
							and inv.officeId=:officeid and
							inv.active = true and inv.production = true'''

		Map<String, Object> params = new HashMap<>()
		params.put('officeid', office)
		params.put('filter', filter)

		if (company) {
			query += ''' and (inv.company = :company)'''
			countQuery += ''' and (inv.company = :company)'''
			params.put("company", company)
		}

		query += ''' ORDER BY inv.descLong ASC'''

		Page<Inventory> result = getPageable(query, countQuery, page, size, params)
		return result
	}

	@GraphQLQuery(name = "inventorySourcePageable")
	Page<Inventory> inventorySourcePageable(
			@GraphQLArgument(name = "filter") String filter,
			@GraphQLArgument(name = "office") UUID office,
			@GraphQLArgument(name = "page") Integer page,
			@GraphQLArgument(name = "size") Integer size
	) {
		def company = SecurityUtils.currentCompanyId()
		String query = '''Select inv from Inventory inv where
						lower(concat(inv.descLong,inv.sku)) like lower(concat('%',:filter,'%'))
						and inv.officeId=:officeid and
						inv.active = true and (inv.production = false or inv.production is null )'''

		String countQuery = '''Select count(inv) from Inventory inv where
							lower(concat(inv.descLong,inv.sku)) like lower(concat('%',:filter,'%'))
							and inv.officeId=:officeid and
							inv.active = true and (inv.production = false or inv.production is null )'''

		Map<String, Object> params = new HashMap<>()
		params.put('officeid', office)
		params.put('filter', filter)

		if (company) {
			query += ''' and (inv.company = :company)'''
			countQuery += ''' and (inv.company = :company)'''
			params.put("company", company)
		}

		query += ''' ORDER BY inv.descLong ASC'''

		Page<Inventory> result = getPageable(query, countQuery, page, size, params)
//		Instant end = Instant.now();
//		Duration timeElapsed = Duration.between(start, end);
//		println('time => '+timeElapsed)
		return result
	}

	@GraphQLQuery(name = "itemListByOffice")
	List<Inventory> itemListByOffice(
			@GraphQLArgument(name = "id") UUID id
	) {
		String query = '''Select s from Inventory s where s.officeId=:id'''
		Map<String, Object> params = new HashMap<>()
		params.put('id', id)
		createQuery(query, params).resultList.sort { it.item.descLong }
	}

	@GraphQLQuery(name = "getInventoryInfo")
	InventoryInfoDto getInventoryInfo(
			@GraphQLArgument(name = "office") UUID office,
			@GraphQLArgument(name = "itemId") UUID itemId
	) {
		def company = SecurityUtils.currentCompanyId()
		String query = '''
		WITH onhandref AS (
            SELECT a.source_office,
                   a.item,
                   SUM(a.ledger_qty_in - a.ledger_qty_out) AS onhand
            FROM inventory.inventory_ledger a
            WHERE a.is_include = true AND a.source_office = :office AND a.item = :itemId
            GROUP BY a.source_office, a.item
        )
		SELECT di.id,di.item,
               COALESCE(a.onhand, 0::bigint) AS onhand
        FROM inventory.office_item di
        LEFT JOIN onhandref a ON a.item = :itemId AND a.source_office = :office
        WHERE di.office = :office
          AND di.is_assign = true
          AND di.item = :itemId
          AND di.company = :company'''

		Map<String, Object> params = new HashMap<>()
		params.put("office", office)
		params.put("itemId", itemId)
		params.put("company", company)

		def recordsRaw = namedParameterJdbcTemplate.queryForList(query, params)
		def obj = recordsRaw.findAll().first()
		def item = itemService.itemById(itemId)
		BigDecimal wCost = inventoryResource.getLastWcost(itemId.toString())
		def record = new InventoryInfoDto(
				id: obj.get("id", "") as String,
				item: item,
				onHand: obj.get("onhand", "") as Integer ?: 0,
				cost: wCost ?: BigDecimal.ZERO
		)

		return record
	}

}
