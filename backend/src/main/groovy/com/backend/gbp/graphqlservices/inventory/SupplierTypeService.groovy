package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.inventory.Generic
import com.backend.gbp.domain.inventory.SupplierType
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
class SupplierTypeService extends AbstractDaoService<SupplierType> {

    SupplierTypeService() {
        super(SupplierType.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService


    @GraphQLQuery(name = "supplierTypeList")
    List<SupplierType> supplierTypeList(
            @GraphQLArgument(name = "filter") String filter
    ) {
        def company = SecurityUtils.currentCompanyId()

        String query = '''Select e from SupplierType e where lower(concat(e.supplierTypeCode,e.supplierTypeDesc)) like lower(concat('%',:filter,'%'))'''
        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)

        if (company) {
            query += ''' and (e.company = :company)'''
            params.put("company", company)
        }

        createQuery(query, params).resultList.sort {it.supplierTypeCode}
    }

    @GraphQLQuery(name = "supplierTypeActive")
    List<SupplierType> supplierTypeActive() {
        def company = SecurityUtils.currentCompanyId()
        String query = '''Select e from SupplierType e where e.isActive = :status'''
        Map<String, Object> params = new HashMap<>()
        params.put('status', true)
        if (company) {
            query += ''' and (e.company = :company)'''
            params.put("company", company)
        }
        createQuery(query, params).resultList.sort { it.supplierTypeCode }
    }

    // ============== Mutation =======================//
    @GraphQLMutation(name = "upsertSupplierType")
    @Transactional
    SupplierType upsertSupplierType(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ) {
        def company = SecurityUtils.currentCompanyId()
        upsertFromMap(id, fields, { SupplierType entity, boolean forInsert ->
            if(forInsert){
                entity.supplierTypeCode = generatorService.getNextValue(GeneratorType.SUPTYPE, {
                    return "ST-" + StringUtils.leftPad(it.toString(), 6, "0")
                })
                entity.company = company
            }
        })
    }

}
