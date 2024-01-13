package com.backend.gbp.graphqlservices.payroll

import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.payroll.WithholdingTaxMatrix
import com.backend.gbp.domain.payroll.enums.PayrollType
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.payroll.WithholdingTaxMatrixRepository
import com.backend.gbp.security.SecurityUtils
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@TypeChecked
@Component
@GraphQLApi
@Transactional(rollbackFor = Exception.class)
class WithholdingTaxMatrixService {

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    WithholdingTaxMatrixRepository withholdingTaxMatrixRepository

    @Autowired
    JdbcTemplate jdbcTemplate


    @GraphQLQuery(name = "getWithholdingTaxMatrix")
    List<WithholdingTaxMatrix> getWithholdingTaxMatrix() {
        return withholdingTaxMatrixRepository.findByType(
                SecurityUtils.currentCompanyId()
        ).sort({ it.maxAmount })

    }

    @GraphQLMutation(name = "upsertWithholdingTaxMatrix")
    GraphQLRetVal<WithholdingTaxMatrix> upsertWithholdingTaxMatrix(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "fields") Map<String, Object> fields
    ) {
        WithholdingTaxMatrix taxMatrix = new WithholdingTaxMatrix()
        CompanySettings company = SecurityUtils.currentCompany()
        if (id) {
            taxMatrix = withholdingTaxMatrixRepository.findById(id).get()
            objectMapper.updateValue(taxMatrix, fields)
        } else {
            taxMatrix = objectMapper.convertValue(fields, WithholdingTaxMatrix)
        }
        taxMatrix.company = company

        String idString = id ? id.toString() : ''
        Long count = jdbcTemplate.queryForObject(
                """
                    SELECT count(*)
                    FROM payroll.withholding_tax_matrix
                    WHERE ${taxMatrix.minAmount} <= max_amount
                      AND ${taxMatrix.maxAmount} >= min_amount
                      AND ('${idString}' = '' OR CAST(id as text) != '${idString}')
                      AND type = '${taxMatrix.type}';
                    """, Long
        )

        if (count > 0) {
            return new GraphQLRetVal<WithholdingTaxMatrix>(
                    null,
                    false,
                    "The provided min amount and max amount overlaps with one or more of the existing rows.")
        } else {
            taxMatrix = withholdingTaxMatrixRepository.save(taxMatrix)
            return new GraphQLRetVal<WithholdingTaxMatrix>(taxMatrix, true, "New row ${id ? "updated" : "added"} successfully.")
        }
    }

}
