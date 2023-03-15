package com.backend.gbp.graphqlservices.cashier

import com.backend.gbp.domain.cashier.PettyType
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
class PettyTypeService extends AbstractDaoService<PettyType> {

    PettyTypeService() {
        super(PettyType.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService


    @GraphQLQuery(name = "pettyTypeList")
    List<PettyType> pettyTypeList(
            @GraphQLArgument(name = "filter") String filter
    ) {
        String query = '''Select e from PettyType e where 
                          lower(concat(e.code,e.description)) like lower(concat('%',:filter,'%'))'''
        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        createQuery(query, params).resultList.sort { it.code }
    }

    @GraphQLQuery(name = "pettyTypeActive")
    List<PettyType> pettyTypeActive() {
        String query = '''Select e from PettyType e where e.is_active = :status'''
        Map<String, Object> params = new HashMap<>()
        params.put('status', true)
        createQuery(query, params).resultList.sort { it.code }
    }

    @GraphQLQuery(name = "pettyTypeAll")
    List<PettyType> pettyTypeAll() {
        findAll().sort{it.code}
    }


    // ============== Mutation =======================//
    @GraphQLMutation(name = "upsertPettyType")
    @Transactional
    PettyType upsertPettyType(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ) {
        upsertFromMap(id, fields, { PettyType entity, boolean forInsert ->
            if(forInsert){
                entity.code = generatorService.getNextValue(GeneratorType.PETTY_TYPE, {
                    return "CT-" + StringUtils.leftPad(it.toString(), 6, "0")
                })
            }
        })
    }

}
