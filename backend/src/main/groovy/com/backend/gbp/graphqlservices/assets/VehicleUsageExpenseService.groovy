package com.backend.gbp.graphqlservices.assets

import com.backend.gbp.domain.assets.VehicleUsageExpense
import com.backend.gbp.domain.assets.VehicleUsageMonitoring
import com.backend.gbp.domain.assets.enums.VehicleUsageExpenseType
import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.inventory.ItemService
import com.backend.gbp.repository.asset.VehicleUsageExpenseRepository
import com.backend.gbp.repository.asset.VehicleUsageRepository
import com.backend.gbp.repository.projects.ProjectsRepository
import com.backend.gbp.security.SecurityUtils
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
class VehicleUsageExpenseService extends AbstractDaoService<VehicleUsageExpense> {

    VehicleUsageExpenseService() {
        super(VehicleUsageExpense.class)
    }

    @Autowired
    VehicleUsageExpenseRepository vehicleUsageExpenseRepository

    @Autowired
    VehicleUsageRepository vehicleUsageRepository

    @Autowired
    ItemService itemService

    @Autowired
    ProjectsRepository projectsRepository

    @GraphQLQuery(name = "vehicleUsageExpenses")
    List<VehicleUsageExpense> vehicleUsageExpenses(
            @GraphQLArgument(name = "usageID") UUID usageID
    ) {
        UUID company = SecurityUtils.currentCompanyId()
        requireVehicleUsage(usageID, company)
        vehicleUsageExpenseRepository.findAllByVehicleUsageIdAndCompanyOrderByCreatedDateAsc(usageID, company)
    }

    @GraphQLQuery(name = "projectVehicleUsageExpenses")
    List<VehicleUsageExpense> projectVehicleUsageExpenses(
            @GraphQLArgument(name = "projectId") UUID projectId,
            @GraphQLArgument(name = "expenseType") VehicleUsageExpenseType expenseType
    ) {
        UUID company = SecurityUtils.currentCompanyId()
        if (projectId == null || expenseType == null || company == null) {
            return []
        }

        def project = projectsRepository.findById(projectId).orElse(null)
        if (project == null || project.company != company) {
            return []
        }

        vehicleUsageExpenseRepository.findProjectExpenses(projectId, expenseType, company)
    }

    @GraphQLMutation(name = "upsertVehicleUsageExpenses")
    @Transactional
    List<VehicleUsageExpense> upsertVehicleUsageExpenses(
            @GraphQLArgument(name = "usageID") UUID usageID,
            @GraphQLArgument(name = "expenses") List<Map<String, Object>> expenses,
            @GraphQLArgument(name = "toDelete") List<UUID> toDelete
    ) {
        UUID company = SecurityUtils.currentCompanyId()
        VehicleUsageMonitoring usage = requireVehicleUsage(usageID, company)

        (toDelete ?: Collections.<UUID>emptyList()).each { UUID expenseId ->
            VehicleUsageExpense expense = vehicleUsageExpenseRepository
                    .findByIdAndVehicleUsageIdAndCompany(expenseId, usageID, company)
                    .orElseThrow { new IllegalArgumentException("Vehicle usage expense was not found.") }
            vehicleUsageExpenseRepository.delete(expense)
        }

        (expenses ?: Collections.<Map<String, Object>>emptyList()).each { Map<String, Object> fields ->
            VehicleUsageExpenseType expenseType = parseExpenseType(fields.get("expenseType"))
            String particulars = fields.get("particulars")?.toString()?.trim()
            Object amountValue = fields.get("amount")

            if (!particulars) {
                throw new IllegalArgumentException("Expense particulars are required.")
            }
            if (amountValue == null || amountValue.toString().trim().isEmpty()) {
                throw new IllegalArgumentException("Expense amount is required.")
            }

            VehicleUsageExpense expense = new VehicleUsageExpense()
            if (fields.get("id")) {
                UUID expenseId = UUID.fromString(fields.get("id").toString())
                expense = vehicleUsageExpenseRepository
                        .findByIdAndVehicleUsageIdAndCompany(expenseId, usageID, company)
                        .orElseThrow { new IllegalArgumentException("Vehicle usage expense was not found.") }
            }

            expense.expenseType = expenseType
            expense.quantity = toBigDecimal(fields.get("quantity"))
            expense.amount = new BigDecimal(amountValue.toString())
            expense.vehicleUsage = usage
            expense.company = company

            if (expenseType == VehicleUsageExpenseType.ITEM) {
                UUID itemId = parseItemId(fields.get("item"))
                Item item = itemId ? itemService.itemById(itemId) : null
                if (item == null || item.company != company) {
                    throw new IllegalArgumentException("The selected inventory item was not found.")
                }
                expense.item = item
                expense.particulars = item.descLong
            } else {
                expense.item = null
                expense.particulars = particulars
            }

            vehicleUsageExpenseRepository.save(expense)
        }

        vehicleUsageExpenseRepository.findAllByVehicleUsageIdAndCompanyOrderByCreatedDateAsc(usageID, company)
    }

    private VehicleUsageMonitoring requireVehicleUsage(UUID usageID, UUID company) {
        if (usageID == null) {
            throw new IllegalArgumentException("Vehicle usage is required.")
        }
        vehicleUsageRepository.findByIdAndCompany(usageID, company)
                .orElseThrow { new IllegalArgumentException("Vehicle usage was not found.") }
    }

    private static VehicleUsageExpenseType parseExpenseType(Object value) {
        if (value == null) {
            throw new IllegalArgumentException("Expense type is required.")
        }
        try {
            VehicleUsageExpenseType.valueOf(value.toString().toUpperCase())
        } catch (IllegalArgumentException ignored) {
            throw new IllegalArgumentException("Expense type must be ITEM, SERVICE, or CUSTOM.")
        }
    }

    private static UUID parseItemId(Object value) {
        if (value instanceof Map) {
            Object nestedValue = ((Map) value).get("value")
            return nestedValue ? UUID.fromString(nestedValue.toString()) : null
        }
        value ? UUID.fromString(value.toString()) : null
    }

    private static BigDecimal toBigDecimal(Object value) {
        if (value == null || value.toString().trim().isEmpty()) {
            return null
        }
        new BigDecimal(value.toString())
    }
}
