package com.backend.gbp.graphqlservices.inventory


import com.backend.gbp.domain.inventory.UnitMeasurement
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
class UnitMeasurementService extends AbstractDaoService<UnitMeasurement> {

    UnitMeasurementService() {
        super(UnitMeasurement.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService


    @GraphQLQuery(name = "unitMeasurementList")
    List<UnitMeasurement> unitMeasurementList(
            @GraphQLArgument(name = "filter") String filter
    ) {
        String query = '''Select e from UnitMeasurement e where lower(concat(e.unitCode,e.unitDescription)) like lower(concat('%',:filter,'%'))'''
        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        createQuery(query, params).resultList.sort { it.unitCode }
    }

    @GraphQLQuery(name = "uopList")
    List<UnitMeasurement> uopList() {
        String query = '''Select e from UnitMeasurement e where e.isBig = :status and e.isActive = true'''
        Map<String, Object> params = new HashMap<>()
        params.put('status', true)
        createQuery(query, params).resultList.sort { it.unitCode }
    }

    @GraphQLQuery(name = "uouList")
    List<UnitMeasurement> uouList() {
        String query = '''Select e from UnitMeasurement e where e.isSmall = :status and e.isActive = true'''
        Map<String, Object> params = new HashMap<>()
        params.put('status', true)
        createQuery(query, params).resultList.sort { it.unitCode }
    }

    @GraphQLQuery(name = "unitMeasurementActive")
    List<UnitMeasurement> unitMeasurementActive() {
        String query = '''Select e from UnitMeasurement e where e.isActive = :status'''
        Map<String, Object> params = new HashMap<>()
        params.put('status', true)
        createQuery(query, params).resultList.sort { it.unitCode }
    }

    // ============== Mutation =======================//
    @GraphQLMutation(name = "upsertUnitMeasurement")
    @Transactional
    UnitMeasurement upsertUnitMeasurement(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ) {
        upsertFromMap(id, fields, { UnitMeasurement entity, boolean forInsert ->
            if(forInsert){
                entity.unitCode = generatorService.getNextValue(GeneratorType.UNITCODE, {
                    return "UNIT-" + StringUtils.leftPad(it.toString(), 6, "0")
                })
            }
        })
    }

}
