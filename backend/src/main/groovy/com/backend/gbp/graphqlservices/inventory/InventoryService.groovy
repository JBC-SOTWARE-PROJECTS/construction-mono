package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.inventory.InventoryLedger
import com.backend.gbp.domain.inventory.OfficeItem
import com.backend.gbp.rest.InventoryResource
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
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.stereotype.Component

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
		String query = '''Select inv from Inventory inv where inv.officeId = :office and inv.itemId = :itemId'''
		Map<String, Object> params = new HashMap<>()
		params.put('office', office)
		params.put('itemId', itemId)
		createQuery(query, params).resultList.find()
	}

	@GraphQLQuery(name = "inventoryListPageable")
	Page<Inventory> inventoryListPageable(
			@GraphQLArgument(name = "filter") String filter,
			@GraphQLArgument(name = "group") UUID group,
			@GraphQLArgument(name = "category") List<UUID> category,
			@GraphQLArgument(name = "page") Integer page,
			@GraphQLArgument(name = "size") Integer size
	) {

		Instant start = Instant.now();
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
			@GraphQLArgument(name = "page") Integer page,
			@GraphQLArgument(name = "size") Integer size
	) {

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
		Instant start = Instant.now();
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
		Instant start = Instant.now();
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

}
