package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.domain.inventory.ReturnSupplier
import com.backend.gbp.domain.inventory.ReturnSupplierItem
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.rest.dto.PurchaseRtsDto
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
class ReturnSupplierItemsService extends AbstractDaoService<ReturnSupplierItem> {

    ReturnSupplierItemsService() {
        super(ReturnSupplierItem.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService


    @GraphQLQuery(name = "rtsItemById")
    ReturnSupplierItem prItemById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            findOne(id)
        }else{
            null
        }
    }

    @GraphQLQuery(name = "rtsItemByParent")
    List<ReturnSupplierItem> rtsItemByParent(
            @GraphQLArgument(name = "id") UUID id
    ) {
        String query = '''Select e from ReturnSupplierItem e where e.returnSupplier.id = :id'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        createQuery(query, params).resultList.sort { it.item.descLong }
    }



    // ============== Mutation =======================//
    @Transactional
    @GraphQLMutation(name = "upsertRtsItem")
    ReturnSupplierItem upsertRtsItem(
            @GraphQLArgument(name = "dto") PurchaseRtsDto dto,
            @GraphQLArgument(name = "item") Item item,
            @GraphQLArgument(name = "pr") ReturnSupplier pr
    ) {
        def upsert = new ReturnSupplierItem()
        if(!dto.isNew){
            upsert = findOne(dto.id)
        }
        upsert.returnSupplier = pr
        upsert.item = item
        upsert.returnQty = dto.returnQty
        upsert.returnUnitCost = dto.returnUnitCost
        upsert.return_remarks = dto.return_remarks
        upsert.isPosted = dto.isPosted
        save(upsert)
    }


    @Transactional
    @GraphQLMutation(name = "removeRtsItem")
    ReturnSupplierItem removeRtsItem(
            @GraphQLArgument(name = "id") UUID id
    ) {
        def del = findOne(id)
        delete(del)
        return del
    }

    @Transactional
    @GraphQLMutation(name = "updateRtsItemStatus")
    ReturnSupplierItem updateRtsItemStatus(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "status") Boolean status
    ) {
        def upsert = findOne(id)
        upsert.isPosted = status
        save(upsert)
    }
}
