package com.backend.gbp.graphqlservices

import com.backend.gbp.domain.CompanySettings
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
import org.springframework.data.domain.Page

import javax.transaction.Transactional


@Component
@GraphQLApi
@TypeChecked
class CompanySettingsService extends AbstractDaoService<CompanySettings> {

    CompanySettingsService() {
        super(CompanySettings.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService


    @GraphQLQuery(name = "comById")
    CompanySettings comById(@GraphQLArgument(name = "id") UUID id) {

        if(id){
            findOne(id)
        }else{
            null
        }
    }

    @GraphQLQuery(name = "comById")
    CompanySettings comById() {
        def id = UUID.fromString("ee58932e-ab09-4cce-b46d-ef3477db84a6")
        if(id){
            findOne(id)
        }else{
            null
        }
    }

    @GraphQLQuery(name = "companyList")
    List<CompanySettings> companyList(
            @GraphQLArgument(name = "filter") String filter
    ) {
        String query = '''Select e from CompanySettings e where lower(e.companyName) like lower(concat('%',:filter,'%'))'''
        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        createQuery(query, params).resultList.sort { it.companyName }
    }

    @GraphQLQuery(name = "companyPage")
    Page<CompanySettings> companyPage(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ) {

        String query = '''Select e from CompanySettings e where lower(e.companyName) like lower(concat('%',:filter,'%'))'''
        String countQuery = '''Select count(e) from CompanySettings e where lower(e.companyName) like lower(concat('%',:filter,'%'))'''
        query += ''' ORDER BY e.companyName ASC'''

        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)

        Page<CompanySettings> result = getPageable(query, countQuery, page, size, params)
        return result
    }

    //mutation
    // ============== Mutation =======================//
    @Transactional
    @GraphQLMutation(name = "upsertCompany")
    CompanySettings upsertCompany(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "fields") Map<String, Object> fields
    ) {

        upsertFromMap(id, fields, { CompanySettings entity , boolean forInsert ->
            if(forInsert){
                entity.companyCode = generatorService.getNextValue(GeneratorType.COMPANY_CODE, {
                    return "COMPANY-" + StringUtils.leftPad(it.toString(), 6, "0")
                })
            }
        })
    }


}
