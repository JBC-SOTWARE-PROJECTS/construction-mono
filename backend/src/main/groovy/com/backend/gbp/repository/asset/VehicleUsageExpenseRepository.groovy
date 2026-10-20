package com.backend.gbp.repository.asset

import com.backend.gbp.domain.assets.VehicleUsageExpense
import com.backend.gbp.domain.assets.enums.VehicleUsageExpenseType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface VehicleUsageExpenseRepository extends JpaRepository<VehicleUsageExpense, UUID> {

    List<VehicleUsageExpense> findAllByVehicleUsageIdAndCompanyOrderByCreatedDateAsc(UUID vehicleUsageId, UUID company)

    Optional<VehicleUsageExpense> findByIdAndVehicleUsageIdAndCompany(UUID id, UUID vehicleUsageId, UUID company)

    @Query('''
        SELECT expense
        FROM VehicleUsageExpense expense
        JOIN FETCH expense.vehicleUsage usage
        LEFT JOIN FETCH usage.asset
        LEFT JOIN FETCH expense.item
        WHERE usage.project.id = :projectId
          AND expense.expenseType = :expenseType
          AND expense.company = :company
          AND usage.company = :company
        ORDER BY usage.startDatetime DESC, expense.createdDate ASC
    ''')
    List<VehicleUsageExpense> findProjectExpenses(
            @Param("projectId") UUID projectId,
            @Param("expenseType") VehicleUsageExpenseType expenseType,
            @Param("company") UUID company
    )
}
