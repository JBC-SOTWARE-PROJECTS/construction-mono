package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.ArCustomers
import com.backend.gbp.domain.accounting.CustomerType
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.inventory.SupplierService
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.GeneratorType
import groovy.transform.Canonical
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.stereotype.Service

import javax.transaction.Transactional

@Canonical
class OptionsDto {
    String value
    String label
}

@Service
@GraphQLApi
@Transactional(rollbackOn = Exception.class)
class ArCustomerServices extends  AbstractDaoService<ArCustomers> {
    ArCustomerServices (){
        super(ArCustomers.class)
    }

    @Autowired
    GeneratorService generatorService

    @Autowired
    SupplierService supplierService


    // LOCAL FUNCTIONS --------------------------------------
    static List<OptionsDto> convertPageableToOptions(def data, String label, String value){
        List<OptionsDto> options = []
        data.each { it ->
            OptionsDto opt = [:]
            opt['label'] = it[label]
            opt['value'] = it[value]
            options.push(opt)
        }
        return options
    }


    // END OF LOCAL FUNCTIONS

    @GraphQLMutation(name = "createARCustomer")
    GraphQLResVal<ArCustomers> createARCustomer(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "fields") Map<String,Object> fields
    ){
        try{
           def customer = upsertFromMap(id, fields, { ArCustomers entity, boolean forInsert ->
                if (forInsert) {
                    if(!entity.accountNo)
                    entity.accountNo = generatorService.getNextValue(GeneratorType.AR_CUSTOMER, {
                        return StringUtils.leftPad(it.toString(), 6, "0")
                    })
                    return entity
                }
                else
                    return entity
            })

            return new GraphQLResVal<ArCustomers>(customer, true, 'Customer data has been successfully saved. ')
        }
        catch (ignore){
            return new GraphQLResVal<ArCustomers>(null, false, 'Unable to save customer data. Please contact support for assistance.')
        }
    }

    @GraphQLQuery(name="findOneCustomer")
    ArCustomers findOneCustomer(
            @GraphQLArgument(name = "id") UUID id
    ){
        if(id)
            return findOne(id)
        return null
    }

    @GraphQLQuery(name="findAllCustomers")
    Page<ArCustomers> findAllCustomers(
            @GraphQLArgument(name = "type") List<String> type,
            @GraphQLArgument(name = "search") String search,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ){
        String queryStr = """ from ArCustomers c where (
						lower(c.accountNo) like lower(concat('%',:search,'%')) or 
						lower(c.customerName) like lower(concat('%',:search,'%'))
              		) """
        Map<String,Object> params = [:]
        params['search'] = search

        if(type) {
            queryStr += """ and c.customerType in :type"""
            params['type'] = type.collect { CustomerType.valueOf(it) }

        }

        getPageable(
                """ Select c ${queryStr} order by c.customerName""",
                """ Select count(c) ${queryStr} """,
                page,
                size,
                params
        )
    }


}
