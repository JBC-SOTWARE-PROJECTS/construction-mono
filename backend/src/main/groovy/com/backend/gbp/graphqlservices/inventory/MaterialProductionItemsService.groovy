package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.domain.inventory.MaterialProduction
import com.backend.gbp.domain.inventory.MaterialProductionItem
import com.backend.gbp.domain.inventory.StockIssue
import com.backend.gbp.domain.inventory.StockIssueItems
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.rest.dto.PurchaseIssuanceDto
import com.backend.gbp.rest.dto.PurchaseMPDto
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
class MaterialProductionItemsService extends AbstractDaoService<MaterialProductionItem> {

    MaterialProductionItemsService() {
        super(MaterialProductionItem.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService


    @GraphQLQuery(name = "mpItemById")
    MaterialProductionItem mpItemById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            findOne(id)
        }else{
            null
        }
    }

    @GraphQLQuery(name = "mpItemByParent")
    List<MaterialProductionItem> mpItemByParent(
            @GraphQLArgument(name = "id") UUID id
    ) {
        String query = '''Select e from MaterialProductionItem e where e.materialProduction.id = :id'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        createQuery(query, params).resultList.sort { it.item.descLong }
    }



    // ============== Mutation =======================//
    @Transactional
    @GraphQLMutation(name = "upsertMpItem")
    MaterialProductionItem upsertMpItem(
            @GraphQLArgument(name = "dto") PurchaseMPDto dto,
            @GraphQLArgument(name = "item") Item item,
            @GraphQLArgument(name = "mp") MaterialProduction mp
    ) {
        def upsert = new MaterialProductionItem()
        if(!dto.isNew){
            upsert = findOne(dto.id)
        }
        upsert.materialProduction = mp
        upsert.item = item
        upsert.qty = dto.qty
        upsert.unitCost = dto.unitCost
        upsert.type = dto.type
        upsert.isPosted = dto.isPosted

        save(upsert)
    }


    @Transactional
    @GraphQLMutation(name = "removeMpItem")
    MaterialProductionItem removeMpItem(
            @GraphQLArgument(name = "id") UUID id
    ) {
        def del = findOne(id)
        delete(del)
        return del
    }

    @Transactional
    @GraphQLMutation(name = "updateMpItemStatus")
    MaterialProductionItem updateMpItemStatus(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "status") Boolean status
    ) {
        def upsert = findOne(id)
        upsert.isPosted = status
        save(upsert)
    }
}
