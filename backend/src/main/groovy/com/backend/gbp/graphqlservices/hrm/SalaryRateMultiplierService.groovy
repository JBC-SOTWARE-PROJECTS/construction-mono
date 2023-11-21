package com.backend.gbp.graphqlservices.hrm

import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.hrm.SalaryRateMultiplier
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.hrm.SalaryRateMultiplierRepository
import com.backend.gbp.security.SecurityUtils
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component


@TypeChecked
@Component
@GraphQLApi
class SalaryRateMultiplierService {

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    SalaryRateMultiplierRepository salaryRateMultiplierRepository

    //============================Query============================\\

    @GraphQLQuery(name = "getSalaryRateMultiplier", description = "Get the values of salary rate multiplier.")
    SalaryRateMultiplier getSalaryRateMultiplier(){
        SalaryRateMultiplier salaryRateMultiplier = salaryRateMultiplierRepository.getByCompany(SecurityUtils.currentCompanyId())
        return salaryRateMultiplier
    }

    //============================Query============================\\

    //===========================Mutation==========================\\

    @GraphQLMutation(name = "updateSalaryRateMultiplier", description = "Update the salary rate multiplier")
    GraphQLRetVal<SalaryRateMultiplier> updateSalaryRateMultiplier(
            @GraphQLArgument(name = "fields")Map<String, Object> fields
    ){
        SalaryRateMultiplier salaryRateMultiplier = salaryRateMultiplierRepository.findAll().first()
        CompanySettings company = SecurityUtils.currentCompany()
        if(!salaryRateMultiplier) return new GraphQLRetVal<SalaryRateMultiplier>(null, false, "Failed to update salary rate multiplier.", null)
        salaryRateMultiplier.company = company
        salaryRateMultiplier = objectMapper.updateValue(salaryRateMultiplier, fields)
        salaryRateMultiplier.company = company
        salaryRateMultiplierRepository.save(salaryRateMultiplier)
        return new GraphQLRetVal<SalaryRateMultiplier>(salaryRateMultiplier, true, "Successfully updated salary rate multiplier.", null)

    }
}