package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.inventory.ReturnSupplier
import com.backend.gbp.domain.inventory.Supplier
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
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Component

import javax.transaction.Transactional


@Component
@GraphQLApi
@TypeChecked
class SupplierService extends AbstractDaoService<Supplier> {

    SupplierService() {
        super(Supplier.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService


    @GraphQLQuery(name = "supById")
    Supplier supById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            findOne(id)
        }else{
            null
        }
    }

    @GraphQLQuery(name = "supplierList")
    List<Supplier> supplierList(
            @GraphQLArgument(name = "filter") String filter
    ) {
        String query = '''Select e from Supplier e where lower(concat(e.supplierCode,e.supplierFullname)) like lower(concat('%',:filter,'%'))'''
        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        createQuery(query, params).resultList.sort { it.supplierCode }
    }

    @GraphQLQuery(name = "supplierActive")
    List<Supplier> supplierActive() {
        String query = '''Select e from Supplier e where e.isActive = :status'''
        Map<String, Object> params = new HashMap<>()
        params.put('status', true)
        createQuery(query, params).resultList.sort { it.supplierCode }
    }

    @GraphQLQuery(name = "supplier_list_pageable_active", description = "List of Suppliers")
    Page<Supplier> allSupplierPageableActive(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "size") Integer size,
            @GraphQLArgument(name = "page") Integer page
    ) {
        def company = SecurityUtils.currentCompanyId()

        String query = '''Select s from Supplier s where
            (lower(s.supplierFullname) like lower (concat('%',:filter,'%')) or 
            lower(s.supplierCode) like lower (concat('%',:filter,'%'))) and s.isActive = true
            and s.company = :company '''

        String countQuery = '''Select count(s) from Supplier s where
            (lower(s.supplierFullname) like lower (concat('%',:filter,'%')) or 
            lower(s.supplierCode) like lower (concat('%',:filter,'%'))) and s.isActive = true
            and s.company = :company '''

        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        params.put('company', company)

        query += ''' ORDER BY s.supplierFullname ASC'''

        Page<Supplier> result = getPageable(query, countQuery, page, size, params)
        return result
    }

    // ============== Mutation =======================//
    @GraphQLMutation(name = "upsertSupplier")
    @Transactional
    Supplier upsertSupplier(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ) {
        upsertFromMap(id, fields, { Supplier entity, boolean forInsert ->
            if(forInsert){
                entity.supplierCode = generatorService.getNextValue(GeneratorType.SUPPLIER_CODE, {
                    return "SUP-" + StringUtils.leftPad(it.toString(), 6, "0")
                })
            }
        })
    }

}
