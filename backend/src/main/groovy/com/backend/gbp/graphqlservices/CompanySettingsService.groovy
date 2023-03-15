package com.backend.gbp.graphqlservices

import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

import javax.transaction.Transactional
import java.time.Instant


@Component
@GraphQLApi
@TypeChecked
class CompanySettingsService extends AbstractDaoService<CompanySettings> {

    CompanySettingsService() {
        super(CompanySettings.class)
    }

    @Autowired
    ObjectMapper objectMapper


    @GraphQLQuery(name = "comById")
    CompanySettings comById() {
        def id = UUID.fromString("ee58932e-ab09-4cce-b46d-ef3477db84a6");
        if(id){
            findOne(id)
        }else{
            null
        }
    }

    //mutation
    // ============== Mutation =======================//
    @Transactional
    @GraphQLMutation(name = "upsertCompany")
    CompanySettings upsertCompany(
            @GraphQLArgument(name = "fields") Map<String, Object> fields
    ) {
        def id = UUID.fromString("ee58932e-ab09-4cce-b46d-ef3477db84a6")
        upsertFromMap(id, fields, { CompanySettings entity , boolean forInsert ->

        })
    }


}
