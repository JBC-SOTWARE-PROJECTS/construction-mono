package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.inventory.InventoryLedger
import com.fasterxml.jackson.databind.ObjectMapper
import com.backend.gbp.domain.inventory.PODeliveryMonitoring
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.repository.UserRepository
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.rest.dto.POMonitoringDto
import com.backend.gbp.services.GeneratorService
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
@GraphQLApi
@TypeChecked
class PODeliveryMonitoringService extends AbstractDaoService<PODeliveryMonitoring> {

	PODeliveryMonitoringService() {
		super(PODeliveryMonitoring.class)
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
	PurchaseOrderItemService purchaseOrderItemService

	@Autowired
	ReceivingReportService receivingReportService

	@Autowired
	ReceivingReportItemService receivingReportItemService

//	@GraphQLQuery(name = "inventoryListPageable")
//	Page<Inventory> findByFilters(
//			@GraphQLArgument(name = "filter") String filter,
//			@GraphQLArgument(name = "group") UUID group,
//			@GraphQLArgument(name = "category") List<UUID> category,
//			@GraphQLArgument(name = "page") Integer page,
//			@GraphQLArgument(name = "size") Integer size
//	) {
//
//		Instant start = Instant.now();
//		User user = userRepository.findOneByLogin(SecurityUtils.currentLogin())
//		Employee employee = employeeRepository.findOneByUser(user)
//
//		String query = '''Select inv from Inventory inv where
//						lower(concat(inv.descLong,inv.sku)) like lower(concat('%',:filter,'%'))
//						and inv.depId=:departmentid and
//						inv.active = true'''
//
//		String countQuery = '''Select count(inv) from Inventory inv where
//							lower(concat(inv.descLong,inv.sku)) like lower(concat('%',:filter,'%'))
//							and inv.depId=:departmentid and
//							inv.active = true'''
//
//		Map<String, Object> params = new HashMap<>()
//		params.put('departmentid', employee.departmentOfDuty.id)
//		params.put('filter', filter)
//
//		if (group) {
//			query += ''' and (inv.item_group = :group)'''
//			countQuery += ''' and (inv.item_group = :group)'''
//			params.put("group", group)
//		}
//
//		if (category) {
//			query += ''' and (inv.item_category IN (:category))'''
//			countQuery += ''' and (inv.item_category IN (:category))'''
//			params.put("category", category)
//		}
//
//		query += ''' ORDER BY inv.descLong ASC'''
//
//		Page<Inventory> result = getPageable(query, countQuery, page, size, params)
////		Instant end = Instant.now();
////		Duration timeElapsed = Duration.between(start, end);
////		println('time => '+timeElapsed)
//		return result
//	}

	@GraphQLQuery(name = "getPOMonitoringByRec")
	List<PODeliveryMonitoring> getPOMonitoringByRec(
			@GraphQLArgument(name = "id") UUID id
	) {
		String query = '''Select e from PODeliveryMonitoring e where e.receivingReport.id = :id'''
		Map<String, Object> params = new HashMap<>()
		params.put('id', id)
		createQuery(query, params).resultList
	}

	@GraphQLQuery(name = "getPOMonitoringByPoItemFilter")
	List<PODeliveryMonitoring> getPOMonitoringByPoItemFilter(
			@GraphQLArgument(name = "id") UUID id,
			@GraphQLArgument(name = "filter") String filter
	) {
		String query = '''Select e from PODeliveryMonitoring e where e.purchaseOrderItem.id = :id and 
		lower(concat(e.receivingReport.rrNo, e.receivingReport.receivedRefNo)) like lower(concat('%',:filter,'%'))'''
		Map<String, Object> params = new HashMap<>()
		params.put('id', id)
		params.put('filter', filter)
		createQuery(query, params).resultList
	}


	// ========= Mutation =====/
	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "upsertPOMonitoring")
	PODeliveryMonitoring upsertPOMonitoring(
            @GraphQLArgument(name = "fields") POMonitoringDto fields,
            @GraphQLArgument(name = "id") UUID id
	) {
		PODeliveryMonitoring upsert = new PODeliveryMonitoring();
		if(id){
			upsert = findOne(id)
		}else{
			upsert.purchaseOrderItem = purchaseOrderItemService.poItemById(fields.purchaseOrderItem)
			upsert.receivingReport = receivingReportService.recById(fields.receivingReport)
			upsert.receivingReportItem = receivingReportItemService.recItemById(fields.receivingReportItem)
			upsert.quantity = fields.quantity
			upsert.status = fields.status
			save(upsert)
		}
		return upsert
	}

	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "delPOMonitoring")
	PODeliveryMonitoring delPOMonitoring(
			@GraphQLArgument(name = "id") UUID id
	) {
		def del = findOne(id)
		delete(del)
		return del
	}



}
