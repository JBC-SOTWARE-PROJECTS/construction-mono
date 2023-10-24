package com.backend.gbp.graphqlservices.payroll

import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.payroll.AdjustmentCategory
import com.backend.gbp.domain.payroll.PHICContribution
import com.backend.gbp.graphqlservices.types.GraphQLResVal
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
class AdjustmentCategoryService {

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    JdbcTemplate jdbcTemplate



    @GraphQLQuery(name = "getAdjustmentCategories")
    List<AdjustmentCategory> getPHICContributions(@GraphQLArgument(name = "id") UUID id) {

        return []
    }

    @GraphQLMutation(name = "upsertAdjustmentCategory")
    GraphQLResVal<AdjustmentCategory> upsertAdjustmentCategory(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "fields") Map<String, Object> fields
    ) {
        return new GraphQLResVal<AdjustmentCategory>(null, true, "New row ${id ? "updated" : "added"} successfully.")

    }
}
