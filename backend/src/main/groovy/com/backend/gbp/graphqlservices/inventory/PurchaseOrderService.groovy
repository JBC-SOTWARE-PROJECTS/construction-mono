package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.domain.inventory.PurchaseOrder
import com.backend.gbp.domain.inventory.PurchaseOrderItems
import com.backend.gbp.domain.inventory.PurchaseRequest
import com.backend.gbp.domain.inventory.PurchaseRequestItem
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.rest.dto.PurchaseDto
import com.backend.gbp.rest.dto.PurchasePODto
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.GeneratorType
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.stereotype.Component

import javax.transaction.Transactional
import java.time.Instant

@Component
@GraphQLApi
@TypeChecked
class PurchaseOrderService extends AbstractDaoService<PurchaseOrder> {

    PurchaseOrderService() {
        super(PurchaseOrder.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService

    @Autowired
    PurchaseOrderItemService purchaseOrderItemService

    @Autowired
    PurchaseRequestItemService purchaseRequestItemService

    @Autowired
    PurchaseOrderItemMonitoringService purchaseOrderItemMonitoringService


    @GraphQLQuery(name = "poById")
    PurchaseOrder poById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            findOne(id)
        }else{
            null
        }
    }

    @GraphQLQuery(name = "poNotYetCompleted")
    List<PurchaseOrder> poNotYetCompleted() {
        String query = '''Select e from PurchaseOrder e where e.isCompleted = :status or e.isCompleted is null'''
        Map<String, Object> params = new HashMap<>()
        params.put('status', false)
        createQuery(query, params).resultList.sort { it.poNumber }
    }

    @GraphQLQuery(name = "poList")
    List<PurchaseOrder> poList() {
        findAll().sort{it.poNumber}
    }

    @GraphQLQuery(name = "poByFiltersPage")
	Page<PurchaseOrder> poByFiltersPage(
			@GraphQLArgument(name = "filter") String filter,
			@GraphQLArgument(name = "office") UUID office,
			@GraphQLArgument(name = "page") Integer page,
			@GraphQLArgument(name = "size") Integer size
	) {


		String query = '''Select po from PurchaseOrder po where
						(lower(po.prNos) like lower(concat('%',:filter,'%')) or
						lower(po.poNumber) like lower(concat('%',:filter,'%')))
						and po.office.id = :office'''

		String countQuery = '''Select count(po) from PurchaseOrder po where
						(lower(po.prNos) like lower(concat('%',:filter,'%')) or
						lower(po.poNumber) like lower(concat('%',:filter,'%')))
						and po.office.id = :office'''

		Map<String, Object> params = new HashMap<>()
		params.put('filter', filter)
        params.put('office', office)


		query += ''' ORDER BY po.poNumber DESC'''

		Page<PurchaseOrder> result = getPageable(query, countQuery, page, size, params)
		return result
	}

    // ============== Mutation =======================//
    @Transactional
    @GraphQLMutation(name = "upsertPO")
    PurchaseOrder upsertPO(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "items") ArrayList<Map<String, Object>> items,
            @GraphQLArgument(name = "forRemove") ArrayList<Map<String, Object>> forRemove,
            @GraphQLArgument(name = "id") UUID id
    ) {
        def po = upsertFromMap(id, fields, { PurchaseOrder entity , boolean forInsert ->
            if(forInsert){
                entity.poNumber = generatorService.getNextValue(GeneratorType.PO_NO, {
                    return "PO-" + StringUtils.leftPad(it.toString(), 6, "0")
                })
                entity.status = "FOR APPROVAL"
                entity.isApprove = false
                entity.isVoided = false
                entity.isCompleted = false
            }
        })
        //remove items if there is
        def poItemsRemove = forRemove as ArrayList<PurchasePODto>
        poItemsRemove.each {
            def con = objectMapper.convertValue(it, PurchasePODto.class)
            purchaseOrderItemService.removePoItem(con.id)
        }
        //items to be inserted
        def poItems = items as ArrayList<PurchasePODto>
        poItems.each {
            def item = objectMapper.convertValue(it.item, Item.class)
            def con = objectMapper.convertValue(it, PurchasePODto.class)
            purchaseOrderItemService.upsertPOItem(con, item, po)
        }
        return po
    }

    @Transactional
    @GraphQLMutation(name = "updatePOStatus")
    PurchaseOrder updatePOStatus(
            @GraphQLArgument(name = "status") Boolean status,
            @GraphQLArgument(name = "id") UUID id
    ) {
        def upsert = findOne(id)
        def poItems = purchaseOrderItemService.poItemByParent(id).sort { it.item.descLong }
        upsert.isApprove = status
        upsert.isVoided = !status
        upsert.status = status ? "FOR DELIVERY" : "VOIDED"

        //link po to pr
        if(status){
            def pr = upsert.prNos.split(',') as List<String>
            def items = purchaseRequestItemService.getPrItemInPO(pr, false, null)
            poItems.each {
                it ->
                    items.each {
                        tt ->
                            if (it.item.id == tt.item.id) {
                                def prItem = tt
                                purchaseRequestItemService.updatePRItemPO(prItem, id)
                            }
                    }
            }
        }else{ // unlink to PR
            List<PurchaseRequestItem> items = purchaseRequestItemService.getPrItemByPoId(id)
            items.eachWithIndex { PurchaseRequestItem entry, int i ->
                purchaseRequestItemService.updatePRItemPO(entry, null)
            }
        }
        save(upsert)
    }

    @Transactional
    @GraphQLMutation(name = "setToCompleted")
    PurchaseOrder setToCompleted(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            def upsert = findOne(id)
            Boolean checkpoint = false
            def check = purchaseOrderItemMonitoringService.checkBalancesByPO(id).sort{it.deliveryBalance }
            //loop checking
            check.each {
                checkpoint = it.deliveryBalance <= 0
            }

            if(checkpoint){
                upsert.isCompleted = true
                upsert.status = "DELIVERED"
                save(upsert)
            }
            return upsert
        }else{
            return null
        }

    }
}
