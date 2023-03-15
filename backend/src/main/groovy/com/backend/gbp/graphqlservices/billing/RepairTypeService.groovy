package com.backend.gbp.graphqlservices.billing

import com.backend.gbp.domain.billing.RepairType
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
class RepairTypeService extends AbstractDaoService<RepairType> {

    RepairTypeService() {
        super(RepairType.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService


    @GraphQLQuery(name = "repairTypeList")
    List<RepairType> repairTypeList(
            @GraphQLArgument(name = "filter") String filter
    ) {
        String query = '''Select e from RepairType e where 
                          lower(concat(e.code,e.description)) like lower(concat('%',:filter,'%'))'''
        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        createQuery(query, params).resultList.sort {it.code }
    }

    @GraphQLQuery(name = "repairTypeActive")
    List<RepairType> repairTypeActive() {
        String query = '''Select e from RepairType e where e.is_active = :status'''
        Map<String, Object> params = new HashMap<>()
        params.put('status', true)
        createQuery(query, params).resultList.sort {it.code }
    }

    @GraphQLQuery(name = "repairTypeAll")
    List<RepairType> repairTypeAll() {
        findAll().sort{it.code}
    }


    // ============== Mutation =======================//
    @GraphQLMutation(name = "upsertRepairType")
    @Transactional
    RepairType upsertRepairType(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ) {
        upsertFromMap(id, fields, { RepairType entity, boolean forInsert ->
            if(forInsert){
                entity.code = generatorService.getNextValue(GeneratorType.REPAIR_TYPE, {
                    return "RT-" + StringUtils.leftPad(it.toString(), 6, "0")
                })
            }
        })
    }

}
