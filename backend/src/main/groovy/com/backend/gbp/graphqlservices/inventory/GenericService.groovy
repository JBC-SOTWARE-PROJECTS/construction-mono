package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.inventory.Generic
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.security.SecurityUtils
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
class GenericService extends AbstractDaoService<Generic> {

    GenericService() {
        super(Generic.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService


    @GraphQLQuery(name = "genericList")
    List<Generic> genericList(
            @GraphQLArgument(name = "filter") String filter
    ) {
        def company = SecurityUtils.currentCompanyId()

        String query = '''Select e from Generic e where lower(concat(e.genericCode,e.genericDescription)) like lower(concat('%',:filter,'%'))'''
        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)

        if (company) {
            query += ''' and (e.company = :company)'''
            params.put("company", company)
        }

        createQuery(query, params).resultList.sort { it.genericCode }.reverse(true)
    }

    @GraphQLQuery(name = "genericActive")
    List<Generic> genericActive() {
        def company = SecurityUtils.currentCompanyId()

        String query = '''Select e from Generic e where e.isActive = :status'''
        Map<String, Object> params = new HashMap<>()
        params.put('status', true)

        if (company) {
            query += ''' and (e.company = :company)'''
            params.put("company", company)
        }

        createQuery(query, params).resultList.sort { it.genericCode }
    }

    // ============== Mutation =======================//
    @GraphQLMutation(name = "upsertGenerics")
    @Transactional
    Generic upsertGenerics(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ) {
        def company = SecurityUtils.currentCompanyId()

        upsertFromMap(id, fields, { Generic entity, boolean forInsert ->
            if(forInsert){
                entity.genericCode = generatorService.getNextValue(GeneratorType.GENERIC, {
                    return "GEN-" + StringUtils.leftPad(it.toString(), 6, "0")
                })
                entity.company = company
            }
        })
    }

}
