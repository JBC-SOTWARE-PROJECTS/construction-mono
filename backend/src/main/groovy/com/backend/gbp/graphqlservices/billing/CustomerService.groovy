package com.backend.gbp.graphqlservices.billing

import com.backend.gbp.domain.billing.Customer
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


@Component
@GraphQLApi
@TypeChecked
class CustomerService extends AbstractDaoService<Customer> {

    CustomerService() {
        super(Customer.class)
    }

    @Autowired
    ObjectMapper objectMapper


    @GraphQLQuery(name = "customerList")
    List<Customer> customerList(
            @GraphQLArgument(name = "filter") String filter
    ) {
        String query = '''Select e from Customer e where 
                          lower(concat(e.fullName)) like lower(concat('%',:filter,'%')) and (e.isAssetsCustomer = false or e.isAssetsCustomer is null)'''
        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        createQuery(query, params).resultList.sort { it.fullName }
    }

    @GraphQLQuery(name = "customerListAssets")
    List<Customer> customerListAssets(
            @GraphQLArgument(name = "filter") String filter
    ) {
        String query = '''Select e from Customer e where 
                          lower(concat(e.fullName)) like lower(concat('%',:filter,'%')) and e.isAssetsCustomer = true'''
        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        createQuery(query, params).resultList.sort { it.fullName }
    }

    @GraphQLQuery(name = "customerAll")
    List<Customer> customerAll() {
        findAll().sort{it.fullName}
    }


    // ============== Mutation =======================//
    @GraphQLMutation(name = "upsertCustomer")
    @Transactional
    Customer upsertCustomer(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ) {
        upsertFromMap(id, fields, { Customer entity, boolean forInsert ->

        })
    }

}
