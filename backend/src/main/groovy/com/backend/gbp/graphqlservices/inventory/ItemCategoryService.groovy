package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.inventory.ItemCategory
import com.backend.gbp.domain.inventory.ItemGroup
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
class ItemCategoryService extends AbstractDaoService<ItemCategory> {

    ItemCategoryService() {
        super(ItemCategory.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService


    @GraphQLQuery(name = "itemCategoryList")
    List<ItemCategory> itemCategoryList(
            @GraphQLArgument(name = "filter") String filter
    ) {
        String query = '''Select e from ItemCategory e where lower(concat(e.categoryDescription,e.categoryCode)) like lower(concat('%',:filter,'%'))'''
        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        createQuery(query, params).resultList.sort{it.categoryCode}
    }

    @GraphQLQuery(name = "itemCategoryActive")
    List<ItemCategory> itemCategoryActive(
            @GraphQLArgument(name = "id") UUID id
    ) {
        String query = '''Select e from ItemCategory e where e.itemGroup.id = :id and e.isActive = :status'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        params.put('status', true)
        createQuery(query, params).resultList.sort { it.categoryCode }
    }

    // ============== Mutation =======================//
    @GraphQLMutation(name = "upsertItemCategory")
    @Transactional
    ItemCategory upsertItemCategory(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ) {
        upsertFromMap(id, fields, { ItemCategory entity, boolean forInsert ->
            if(forInsert){
                entity.categoryCode = generatorService.getNextValue(GeneratorType.CATCODE, {
                    return "CAT-" + StringUtils.leftPad(it.toString(), 6, "0")
                })
            }
        })
    }

}
