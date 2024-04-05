package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.domain.inventory.PurchaseRequest
import com.backend.gbp.domain.inventory.PurchaseRequestItem
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.rest.dto.PRChildrenDto
import com.backend.gbp.rest.dto.PurchaseDto
import com.backend.gbp.services.GeneratorService
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

import javax.transaction.Transactional

@Component
@GraphQLApi
@TypeChecked
class PurchaseRequestItemService extends AbstractDaoService<PurchaseRequestItem> {

    PurchaseRequestItemService() {
        super(PurchaseRequestItem.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService

    @Autowired
    PurchaseRequestService purchaseRequestService


    @GraphQLQuery(name = "prItemById")
    PurchaseRequestItem prItemById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            findOne(id)
        }else{
            null
        }
    }

    @GraphQLQuery(name = "prItemByParent")
    List<PurchaseRequestItem> prItemByParent(
            @GraphQLArgument(name = "id") UUID id
    ) {
        String query = '''Select e from PurchaseRequestItem e where e.purchaseRequest.id = :id'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        createQuery(query, params).resultList.sort { it.item.descLong }
    }

    @GraphQLQuery(name = "getPrItemByPoId")
    List<PurchaseRequestItem> getPrItemByPoId(
            @GraphQLArgument(name = "id") UUID id
    ) {
        String query = '''select e from PurchaseRequestItem e where e.refPo = :id'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        createQuery(query, params).resultList.sort { it.item.descLong }
    }

    @GraphQLQuery(name = "getPrItemInPO")
    List<PurchaseRequestItem> getPrItemInPO(
            @GraphQLArgument(name = "prNos") List<String> prNos,
            @GraphQLArgument(name = "status") Boolean status,
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(prNos){
            String query = '''Select e from PurchaseRequestItem e where e.purchaseRequest.prNo IN :prNos'''
            Map<String, Object> params = new HashMap<>()
            params.put('prNos', prNos)

            if(status){
                query += ''' and e.refPo = :id '''
                params.put("id", id)
            }else{
                query += ''' and e.refPo is null '''
            }
            createQuery(query, params).resultList.sort { it.item.descLong }
        }else{
            return null
        }

    }

    @GraphQLQuery(name = "getPrItemInOnePO")
    PRChildrenDto getPrItemInOnePO(
            @GraphQLArgument(name = "prNos") String prNos,
            @GraphQLArgument(name = "status") Boolean status,
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(prNos){

            String query = '''Select e from PurchaseRequestItem e where e.purchaseRequest.prNo = :prNos'''
            Map<String, Object> params = new HashMap<>()
            params.put('prNos', prNos)

            if(status){
                query += ''' and e.refPo = :id '''
                params.put("id", id)
            }else{
                query += ''' and e.refPo is null '''
            }
            def children = createQuery(query, params).resultList.sort { it.item.descLong }
            def parent = purchaseRequestService.prByPrNo(prNos)

            return new PRChildrenDto(parent: parent, items: children)
        }else{
            return new PRChildrenDto(parent: new PurchaseRequest(), items: [])
        }

    }

    // ============== Mutation =======================//
    @Transactional
    @GraphQLMutation(name = "upsertPRItem")
    PurchaseRequestItem upsertPRItem(
            @GraphQLArgument(name = "dto") PurchaseDto dto,
            @GraphQLArgument(name = "item") Item item,
            @GraphQLArgument(name = "pr") PurchaseRequest pr
    ) {
        def upsert = new PurchaseRequestItem()
        if(!dto.isNew){
            upsert = findOne(dto.id)
        }
        upsert.purchaseRequest = pr
        upsert.item = item
        upsert.requestedQty = dto.requestedQty
        upsert.onHandQty = dto.onHandQty
        upsert.unitCost = dto.unitCost
        upsert.remarks = dto.remarks
        save(upsert)
    }

    @Transactional
    @GraphQLMutation(name = "removePrItem")
    PurchaseRequestItem removePrItem(
            @GraphQLArgument(name = "id") UUID id
    ) {
        def del = findOne(id)
        delete(del)
        return del
    }

    @Transactional
    @GraphQLMutation(name = "updatePRItemPO")
    PurchaseRequestItem updatePRItemPO(
            @GraphQLArgument(name = "prItem") PurchaseRequestItem prItem,
            @GraphQLArgument(name = "refPo") UUID refPo
    ) {
        def upsert = prItem
        upsert.refPo = refPo
        save(upsert)
    }
}
