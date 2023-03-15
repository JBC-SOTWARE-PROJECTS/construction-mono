package com.backend.gbp.graphqlservices.services

import com.backend.gbp.domain.inventory.ReceivingReport
import com.backend.gbp.domain.inventory.Supplier
import com.backend.gbp.domain.services.ServiceManagement
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
import org.springframework.data.domain.Page
import org.springframework.stereotype.Component

import javax.transaction.Transactional


@Component
@GraphQLApi
@TypeChecked
class ServiceManagementService extends AbstractDaoService<ServiceManagement> {

    ServiceManagementService() {
        super(ServiceManagement.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService


    @GraphQLQuery(name = "serviceById")
    ServiceManagement serviceById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            findOne(id)
        }else{
            null
        }
    }

    @GraphQLQuery(name = "serviceList")
    List<ServiceManagement> serviceList(
            @GraphQLArgument(name = "filter") String filter
    ) {
        String query = '''Select e from ServiceManagement e where lower(concat(e.code,e.description)) like lower(concat('%',:filter,'%'))'''
        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        createQuery(query, params).resultList.sort { it.description }
    }

    @GraphQLQuery(name = "servicePageByOffice")
    Page<ServiceManagement> servicePageByOffice(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "office") UUID office,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ) {


        String query = '''Select r from ServiceManagement r where
						(lower(r.code) like lower(concat('%',:filter,'%')) or
						lower(r.description) like lower(concat('%',:filter,'%')))
						and r.office.id = :office and r.available = true'''

        String countQuery = '''Select count(r) from ServiceManagement r where
						(lower(r.code) like lower(concat('%',:filter,'%')) or
						lower(r.description) like lower(concat('%',:filter,'%')))
						and r.office.id = :office and r.available = true'''

        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        params.put('office', office)


        query += ''' ORDER BY r.description DESC'''

        Page<ServiceManagement> result = getPageable(query, countQuery, page, size, params)
        return result
    }

    @GraphQLQuery(name = "servicePageAll")
    Page<ServiceManagement> servicePageAll(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ) {


        String query = '''Select r from ServiceManagement r where
						(lower(r.code) like lower(concat('%',:filter,'%')) or
						lower(r.description) like lower(concat('%',:filter,'%')))
						'''

        String countQuery = '''Select count(r) from ServiceManagement r where
						(lower(r.code) like lower(concat('%',:filter,'%')) or
						lower(r.description) like lower(concat('%',:filter,'%')))
						'''

        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)


        query += ''' ORDER BY r.description DESC'''

        Page<ServiceManagement> result = getPageable(query, countQuery, page, size, params)
        return result
    }


    // ============== Mutation =======================//
    @GraphQLMutation(name = "upsertService")
    @Transactional
    ServiceManagement upsertSupplier(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ) {
        upsertFromMap(id, fields, { ServiceManagement entity, boolean forInsert ->
            if(forInsert){
                entity.code = generatorService.getNextValue(GeneratorType.SERVICE_CODE, {
                    return "SERVICE-" + StringUtils.leftPad(it.toString(), 6, "0")
                })
            }
        })
    }

}
