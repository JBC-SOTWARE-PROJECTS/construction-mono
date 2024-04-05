package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.inventory.Inventory
import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.domain.inventory.PurchaseOrder
import com.backend.gbp.domain.inventory.PurchaseOrderItems
import com.backend.gbp.domain.inventory.PurchaseOrderItemsMonitoring
import com.backend.gbp.domain.inventory.PurchaseRequest
import com.backend.gbp.domain.inventory.PurchaseRequestItem
import com.backend.gbp.domain.inventory.ReceivingReport
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.rest.dto.PurchaseDto
import com.backend.gbp.rest.dto.PurchasePODto
import com.backend.gbp.services.GeneratorService
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLContext
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

import javax.transaction.Transactional

@Component
@GraphQLApi
@TypeChecked
class PurchaseOrderItemService extends AbstractDaoService<PurchaseOrderItems> {

    PurchaseOrderItemService() {
        super(PurchaseOrderItems.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService

    @Autowired
    PurchaseOrderItemMonitoringService purchaseOrderItemMonitoringService


    //========context ==============//
    @GraphQLQuery(name = "deliveredQty")
    BigDecimal deliveredQty(@GraphQLContext PurchaseOrderItems poItem) {
        return purchaseOrderItemMonitoringService.monById(poItem.id).deliveredQty
    }

    @GraphQLQuery(name = "deliveryBalance")
    BigDecimal deliveryBalance(@GraphQLContext PurchaseOrderItems poItem) {
        return purchaseOrderItemMonitoringService.monById(poItem.id).deliveryBalance
    }

    @GraphQLQuery(name = "poItemById")
    PurchaseOrderItems poItemById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            findOne(id)
        }else{
            null
        }
    }

    @GraphQLQuery(name = "poItemByParent")
    List<PurchaseOrderItems> poItemByParent(
            @GraphQLArgument(name = "id") UUID id
    ) {
        String query = '''Select e from PurchaseOrderItems e where e.purchaseOrder.id = :id'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        createQuery(query, params).resultList.sort { it.item.descLong }
    }

    @GraphQLQuery(name = "poItemNotReceive")
    List<PurchaseOrderItems> poItemNotReceive(
            @GraphQLArgument(name = "id") UUID id
    ) {
        String query = '''Select e from PurchaseOrderItems e where e.purchaseOrder.id = :id and (e.receivingReport is null)'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        createQuery(query, params).resultList.sort { it.item.descLong }
    }

    // ============== Mutation =======================//
    @Transactional
    @GraphQLMutation(name = "upsertPOItem")
    PurchaseOrderItems upsertPOItem(
            @GraphQLArgument(name = "dto") PurchasePODto dto,
            @GraphQLArgument(name = "item") Item item,
            @GraphQLArgument(name = "pr") PurchaseOrder pr
    ) {
        def upsert = new PurchaseOrderItems()
        if(!dto.isNew){
            upsert = findOne(dto.id)
        }
        upsert.purchaseOrder = pr
        upsert.item = item
        upsert.quantity = dto.quantity
        upsert.unitCost = dto.unitCost
        upsert.prNos = dto.prNos
        upsert.qtyInSmall =  dto.quantity * item.item_conversion
        upsert.type = dto.type
        upsert.type_text = dto.type_text
        save(upsert)
    }

    @Transactional
    @GraphQLMutation(name = "removePoItem")
    PurchaseOrderItems removePoItem(
            @GraphQLArgument(name = "id") UUID id
    ) {
        def del = findOne(id)
        delete(del)
        return del
    }

    @Transactional
    @GraphQLMutation(name = "linkPOItemRec")
    PurchaseOrderItems linkPOItemRec(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "rec") ReceivingReport rec
    ) {
        def upsert = findOne(id)
        upsert.receivingReport = rec
        save(upsert)
    }
}
