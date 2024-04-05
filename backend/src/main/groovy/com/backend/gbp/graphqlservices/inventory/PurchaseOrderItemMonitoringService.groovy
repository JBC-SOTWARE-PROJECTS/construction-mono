package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.domain.inventory.PurchaseOrder
import com.backend.gbp.domain.inventory.PurchaseOrderItems
import com.backend.gbp.domain.inventory.PurchaseOrderItemsMonitoring
import com.backend.gbp.domain.inventory.ReceivingReport
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.rest.dto.PurchasePODto
import com.backend.gbp.services.GeneratorService
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.stereotype.Component

import javax.transaction.Transactional

@Component
@GraphQLApi
@TypeChecked
class PurchaseOrderItemMonitoringService extends AbstractDaoService<PurchaseOrderItemsMonitoring> {

    PurchaseOrderItemMonitoringService() {
        super(PurchaseOrderItemsMonitoring.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService

    @GraphQLQuery(name = "monById")
    PurchaseOrderItemsMonitoring monById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            findOne(id)
        }else{
            return null
        }
    }

    @GraphQLQuery(name = "poItemNotReceiveMonitoring")
    List<PurchaseOrderItemsMonitoring> poItemNotReceiveMonitoring(
            @GraphQLArgument(name = "id") UUID id
    ) {
        String query = '''Select e from PurchaseOrderItemsMonitoring e where e.purchaseOrder.id = :id and (e.receivingReport is null or e.deliveryBalance > 0)'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        createQuery(query, params).resultList.sort { it.item.descLong }
    }

    @GraphQLQuery(name = "checkBalancesByPO")
    List<PurchaseOrderItemsMonitoring> checkBalancesByPO(
            @GraphQLArgument(name = "id") UUID id
    ) {
        String query = '''Select e from PurchaseOrderItemsMonitoring e where e.purchaseOrder.id = :id'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        createQuery(query, params).resultList.sort { it.item.descLong }
    }

    @GraphQLQuery(name = "poItemMonitoringByParentFilter")
    List<PurchaseOrderItemsMonitoring> poItemMonitoringByParentFilter(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "filter") String filter
    ) {
        String query = '''Select e from PurchaseOrderItemsMonitoring e where e.purchaseOrder.id = :id and lower(e.item.descLong) like lower(concat('%',:filter,'%'))'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        params.put('filter', filter)
        createQuery(query, params).resultList.sort { it.item.descLong }
    }

    @GraphQLQuery(name = "poItemMonitoringPage")
    Page<PurchaseOrderItemsMonitoring> poItemMonitoringPage(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "poId") UUID poId,
            @GraphQLArgument(name = "supplier") UUID supplier,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ) {
        String query = '''Select poim from PurchaseOrderItemsMonitoring poim where 
		 	(lower(poim.item.descLong) like lower(concat('%',:filter,'%'))) and poim.purchaseOrder.status != :status'''

        String countQuery = '''Select count(poim) from PurchaseOrderItemsMonitoring poim where 
		 	(lower(poim.item.descLong) like lower(concat('%',:filter,'%'))) and poim.purchaseOrder.status != :status'''

        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        params.put('status', 'VOIDED')

        if (poId) {
            query += ''' and poim.purchaseOrder.id = :id '''
            countQuery += ''' and poim.purchaseOrder.id = :id '''
            params.put('id', poId)
        }

        if(supplier){
            query += ''' and poim.purchaseOrder.supplier.id = :supplier '''
            countQuery += ''' and poim.purchaseOrder.supplier.id = :supplier '''
            params.put('supplier', supplier)
        }


        query += ''' ORDER BY poim.purchaseOrder.preparedDate DESC'''

        getPageable(query, countQuery, page, size, params)
    }


}
