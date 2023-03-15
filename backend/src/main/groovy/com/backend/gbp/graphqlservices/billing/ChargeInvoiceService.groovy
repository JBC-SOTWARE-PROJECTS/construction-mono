package com.backend.gbp.graphqlservices.billing

import com.backend.gbp.domain.billing.ChargeInvoice
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
class ChargeInvoiceService extends AbstractDaoService<ChargeInvoice> {

    ChargeInvoiceService() {
        super(ChargeInvoice.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService


    @GraphQLQuery(name = "chargeInvoiceList")
    List<ChargeInvoice> chargeInvoiceList(
            @GraphQLArgument(name = "filter") String filter
    ) {
        String query = '''Select e from ChargeInvoice e where 
                          lower(concat(e.description)) like lower(concat('%',:filter,'%'))'''
        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        createQuery(query, params).resultList.sort {it.description }
    }


    @GraphQLQuery(name = "chargeInvoiceAll")
    List<ChargeInvoice> chargeInvoiceAll() {
        findAll().sort{it.description}
    }


    // ============== Mutation =======================//
    @GraphQLMutation(name = "upsertChargeInvoice")
    @Transactional
    ChargeInvoice upsertChargeInvoice(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ) {
        upsertFromMap(id, fields, { ChargeInvoice entity, boolean forInsert ->

        })
    }

}
