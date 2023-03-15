package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.inventory.PaymentTerm
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
class PaymentTermService extends AbstractDaoService<PaymentTerm> {

    PaymentTermService() {
        super(PaymentTerm.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService


    @GraphQLQuery(name = "paymentTermList")
    List<PaymentTerm> paymentTermList(
            @GraphQLArgument(name = "filter") String filter
    ) {
        String query = '''Select e from PaymentTerm e where lower(concat(e.paymentCode,e.paymentDesc)) like lower(concat('%',:filter,'%'))'''
        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        createQuery(query, params).resultList.sort { it.paymentCode }
    }

    @GraphQLQuery(name = "paymentTermActive")
    List<PaymentTerm> paymentTermActive() {
        String query = '''Select e from PaymentTerm e where e.isActive = :status'''
        Map<String, Object> params = new HashMap<>()
        params.put('status', true)
        createQuery(query, params).resultList.sort { it.paymentCode }
    }

    // ============== Mutation =======================//
    @GraphQLMutation(name = "upsertPaymentTerms")
    @Transactional
    PaymentTerm upsertPaymentTerms(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ) {
        upsertFromMap(id, fields, { PaymentTerm entity, boolean forInsert ->
            if(forInsert){
                entity.paymentCode = generatorService.getNextValue(GeneratorType.PTCODE, {
                    return "PT-" + StringUtils.leftPad(it.toString(), 6, "0")
                })
            }
        })
    }

}
