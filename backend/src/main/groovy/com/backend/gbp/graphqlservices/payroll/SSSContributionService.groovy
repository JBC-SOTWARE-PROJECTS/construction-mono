package com.backend.gbp.graphqlservices.payroll

import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.payroll.SSSContribution
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.payroll.SSSContributionRepository
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
class SSSContributionService {

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    SSSContributionRepository sssContributionRepository

    @Autowired
    JdbcTemplate jdbcTemplate


    @GraphQLQuery(name = "getSSSContributions", description = "get sss contributions")
    List<SSSContribution> getSSSContributions(@GraphQLArgument(name = "id") UUID id) {
        return sssContributionRepository.findAll().sort({ it.maxAmount })

    }

    @GraphQLMutation(name = "upsertSSSContribution")
    GraphQLRetVal<SSSContribution> upsertSSSContribution(
            @GraphQLArgument(name = "id", description = "ID of the sss contribution entry") UUID id,
            @GraphQLArgument(name = "fields") Map<String, Object> fields
    ) {
        SSSContribution contribution = new SSSContribution()
        CompanySettings company = SecurityUtils.currentCompany()
        if (id) {
            contribution = sssContributionRepository.findById(id).get()
            contribution.company = company
            objectMapper.updateValue(contribution, fields)
        } else {
            contribution.company = company
            contribution = objectMapper.convertValue(fields, SSSContribution)
        }

        String idString = id ? id.toString() : ''
        Long count = jdbcTemplate.queryForObject(
                """
                    SELECT count(*)
                    FROM payroll.sss_contribution
                    WHERE ${contribution.minAmount} <= max_amount
                      AND ${contribution.maxAmount} >= min_amount
                      AND ('${idString}' = '' OR CAST(id as text) != '${idString}');
                    """, Long
        )

        if (count > 0) {
            return new GraphQLRetVal<SSSContribution>(
                    null,
                    false,
                    "The provided min amount and max amount overlaps with one or more of the existing rows.")
        } else {
            contribution = sssContributionRepository.save(contribution)
            return new GraphQLRetVal<SSSContribution>(contribution, true, "New row ${id ? "updated" : "added"} successfully.")
        }
    }

}
