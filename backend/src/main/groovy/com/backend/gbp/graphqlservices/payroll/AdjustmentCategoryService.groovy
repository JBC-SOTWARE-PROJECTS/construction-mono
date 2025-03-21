package com.backend.gbp.graphqlservices.payroll

import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.payroll.AdjustmentCategory
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.repository.payroll.AdjustmentCategoryRepository
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
    AdjustmentCategoryRepository adjustmentCategoryRepository

    List<UUID> defaults = [
            UUID.fromString("84da0ca7-0376-426d-92d9-7ad11659edd1"),
            UUID.fromString("19e7669b-6b19-4d32-9e75-e425fe75ccd7"),
            UUID.fromString("e3e5123b-c096-4587-88ef-05664342b37a"),
            UUID.fromString("f6dfa272-292b-4fdd-b423-60df576935bf")
    ]

    @GraphQLQuery(name = "getAdjustmentCategories")
    List<AdjustmentCategory> getAdjustmentCategories(
            @GraphQLArgument(name = "filter") String filter
    ) {
        UUID companyId = SecurityUtils.currentCompanyId()
        List<AdjustmentCategory> defaults = adjustmentCategoryRepository.getDefaults(filter)
        List<AdjustmentCategory> categories = adjustmentCategoryRepository.getByCompanyId(companyId, filter)
        List<AdjustmentCategory> merge = []
        merge.addAll(defaults)
        merge.addAll(categories)
        return merge
    }

    @GraphQLMutation(name = "upsertAdjustmentCategory")
    GraphQLResVal<AdjustmentCategory> upsertAdjustmentCategory(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "fields") Map<String, Object> fields
    ) {

        AdjustmentCategory category = new AdjustmentCategory()
        if (id) {
            category = adjustmentCategoryRepository.findById(id).get()
            objectMapper.updateValue(category, fields)
        } else {
            category = objectMapper.convertValue(fields, AdjustmentCategory)
        }
        if (!defaults.contains(category.id))
            category.isDefault = false
        category.company = SecurityUtils.currentCompany()
        adjustmentCategoryRepository.save(category)

        return new GraphQLResVal<AdjustmentCategory>(null, true, "Adjustment Category ${id ? "updated" : "added"} successfully.")

    }
}
