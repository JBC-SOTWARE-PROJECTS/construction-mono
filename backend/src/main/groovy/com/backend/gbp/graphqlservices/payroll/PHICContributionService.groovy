package com.backend.gbp.graphqlservices.payroll

import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.payroll.PHICContribution
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.payroll.PHICContributionRepository
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
class PHICContributionService {

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    JdbcTemplate jdbcTemplate

    @Autowired
    PHICContributionRepository phicContributionRepository

    @GraphQLQuery(name = "getPHICContributions", description = "Get allowance by ID")
    List<PHICContribution> getPHICContributions(@GraphQLArgument(name = "id") UUID id) {

        return phicContributionRepository.findAll().sort({ it.maxAmount })

    }

    @GraphQLMutation(name = "upsertPHICContribution")
    GraphQLRetVal<PHICContribution> upsertPHICContribution(
            @GraphQLArgument(name = "id", description = "ID of the phic contribution entry") UUID id,
            @GraphQLArgument(name = "fields") Map<String, Object> fields
    ) {
        PHICContribution contribution = new PHICContribution()
        CompanySettings company = SecurityUtils.currentCompany()
        if (id) {
            contribution = phicContributionRepository.findById(id).get()
            contribution.company = company
            objectMapper.updateValue(contribution, fields)
        } else {
            contribution.company = company
            contribution = objectMapper.convertValue(fields, PHICContribution)
        }

        contribution.premiumRate = contribution.eeRate + contribution.erRate

        String idString = id ? id.toString() : ''
        Long count = jdbcTemplate.queryForObject(
                """
                    SELECT count(*)
                    FROM payroll.phic_contribution
                    WHERE ${contribution.minAmount} <= max_amount
                      AND ${contribution.maxAmount} >= min_amount
                      AND ('${idString}' = '' OR CAST(id as text) != '${idString}');
                    """, Long
        )

        if (count > 0) {
            return new GraphQLRetVal<PHICContribution>(
                    null,
                    false,
                    "The provided min amount and max amount overlaps with one or more of the existing rows.")
        } else {
            contribution = phicContributionRepository.save(contribution)
            return new GraphQLRetVal<PHICContribution>(contribution, true, "New row ${id ? "updated" : "added"} successfully.")
        }
    }
}
