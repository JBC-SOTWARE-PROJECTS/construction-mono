package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.User
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.inventory.Inventory
import com.backend.gbp.domain.inventory.SupplierInventory
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.repository.UserRepository
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.rest.InventoryResource
import com.backend.gbp.security.SecurityUtils
import com.backend.gbp.services.GeneratorService
import com.fasterxml.jackson.databind.ObjectMapper
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
class SupplierInventoryService extends AbstractDaoService<SupplierInventory> {

	SupplierInventoryService() {
		super(SupplierInventory.class)
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
	BigDecimal last_wcost(@GraphQLContext SupplierInventory inventory) {
		def id = inventory.item.id.toString()
		return inventoryResource.getLastWcost(id)
	}

	@GraphQLQuery(name = "inventorySupplierListPageable")
	Page<SupplierInventory> inventorySupplierListPageable(
			@GraphQLArgument(name = "filter") String filter,
			@GraphQLArgument(name = "supplier") UUID supplier,
			@GraphQLArgument(name = "page") Integer page,
			@GraphQLArgument(name = "size") Integer size
	) {
		User user = userRepository.findOneByLogin(SecurityUtils.currentLogin())
		Employee employee = employeeRepository.findOneByUser(user)

		String query = '''Select inv from SupplierInventory inv where
						lower(concat(inv.descLong,inv.sku)) like lower(concat('%',:filter,'%'))
						and inv.supplier.id = :supplier and (inv.office.id = :office or inv.office is null)'''

		String countQuery = '''Select count(inv) from SupplierInventory inv where
							lower(concat(inv.descLong,inv.sku)) like lower(concat('%',:filter,'%'))
							and inv.supplier.id = :supplier and (inv.office.id = :office or inv.office is null)'''

		Map<String, Object> params = new HashMap<>()
		params.put('filter', filter)
		params.put('supplier', supplier)
		params.put('office', employee.office.id)

		query += ''' ORDER BY inv.descLong ASC'''

		Page<SupplierInventory> result = getPageable(query, countQuery, page, size, params)

		return result
	}

}
