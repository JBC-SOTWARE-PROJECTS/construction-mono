package com.backend.gbp.graphqlservices.payroll

import com.backend.gbp.domain.payroll.HDMFContribution
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.payroll.HDMFContributionRepository
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
class HDMFContributionService {

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    JdbcTemplate jdbcTemplate

    @Autowired
    HDMFContributionRepository hdmfContributionRepository

    @GraphQLQuery(name = "getHDMFContributions", description = "Get allowance by ID")
    List<HDMFContribution> getHDMFContributions(@GraphQLArgument(name = "id") UUID id) {

        return hdmfContributionRepository.findAll().sort({ it.maxAmount })
    }

    @GraphQLMutation(name = "upsertHDMFContribution")
    GraphQLRetVal<HDMFContribution> upsertHDMFContribution(
            @GraphQLArgument(name = "id", description = "ID of the hdmf contribution entry") UUID id,
            @GraphQLArgument(name = "fields") Map<String, Object> fields
    ) {
        HDMFContribution contribution = new HDMFContribution()
        if (id) {
            contribution = hdmfContributionRepository.findById(id).get()
            objectMapper.updateValue(contribution, fields)
        } else {
            contribution = objectMapper.convertValue(fields, HDMFContribution)
        }

        String idString = id ? id.toString() : ''
        Long count = jdbcTemplate.queryForObject(
                """
                    SELECT count(*)
                    FROM payroll.hdmf_contribution
                    WHERE ${contribution.minAmount} <= max_amount
                      AND ${contribution.maxAmount} >= min_amount
                      AND ('${idString}' = '' OR CAST(id as text) != '${idString}');
                    """, Long
        )

        if (count > 0) {
            return new GraphQLRetVal<HDMFContribution>(
                    null,
                    false,
                    "The provided min amount and max amount overlaps with one or more of the existing rows.")
        } else {
            contribution = hdmfContributionRepository.save(contribution)
            return new GraphQLRetVal<HDMFContribution>(contribution, true, "New row ${id ? "updated" : "added"} successfully.")
        }
    }
}
