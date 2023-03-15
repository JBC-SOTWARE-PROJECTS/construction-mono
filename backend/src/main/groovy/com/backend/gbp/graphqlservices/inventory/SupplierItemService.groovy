package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.inventory.OfficeItem
import com.backend.gbp.domain.inventory.SupplierItem
import com.backend.gbp.graphqlservices.base.AbstractDaoService
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
import org.springframework.stereotype.Component

import javax.transaction.Transactional


@Component
@GraphQLApi
@TypeChecked
class SupplierItemService extends AbstractDaoService<SupplierItem> {

    SupplierItemService() {
        super(SupplierItem.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService


    @GraphQLQuery(name = "supItemById")
    SupplierItem supItemById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            findOne(id)
        }else{
            null
        }
    }

    @GraphQLQuery(name = "findDuplicate")
    SupplierItem findDuplicate(
            @GraphQLArgument(name = "itemId") UUID itemId,
            @GraphQLArgument(name = "supId") UUID supId
    ) {
        String query = '''Select s from SupplierItem s where s.item.id=:itemId AND s.supplier.id=:supId'''
        Map<String, Object> params = new HashMap<>()
        params.put('itemId', itemId)
        params.put('supId', supId)
        createQuery(query, params).resultList.find()
    }

    @GraphQLQuery(name = "allItemBySupplier")
    List<SupplierItem> allItemBySupplier(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "id") UUID id
    ) {
        String query = '''Select e from SupplierItem e where lower(concat(e.item.descLong)) like lower(concat('%',:filter,'%'))
        and e.supplier.id = :id'''
        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        params.put('id', id)
        createQuery(query, params).resultList.sort { it.item.descLong }
    }

    @GraphQLQuery(name = "allSupplierByItem")
    List<SupplierItem> allSupplierByItem(
            @GraphQLArgument(name = "id") UUID id
    ) {
        String query = '''Select e from SupplierItem e where e.item.id = :id'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        createQuery(query, params).resultList.sort { it.supplier.supplierFullname }
    }

    // ============== Mutation =======================//
    @GraphQLMutation(name = "upsertSupplierItem")
    @Transactional
    SupplierItem upsertSupplierItem(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "itemId") UUID itemId,
            @GraphQLArgument(name = "supId") UUID supId,
            @GraphQLArgument(name = "id") UUID id
    ) {
        SupplierItem supItem = this.findDuplicate(itemId, supId)
        if(id) {
            upsertFromMap(id, fields, { SupplierItem entity, boolean forInsert ->
            })
        }else{
            if(!supItem){
                upsertFromMap(id, fields, { SupplierItem entity, boolean forInsert ->
                })
            }else{
                return null
            }
        }
    }

    @Transactional
    @GraphQLMutation(name = "removeItemSupplier", description = "Remove")
    SupplierItem removeItemSupplier(
            @GraphQLArgument(name = "id") UUID id
    ) {
        SupplierItem rm = findOne(id)
        delete(rm)
        return rm
    }

}
