package com.backend.gbp.repository.asset

import com.backend.gbp.domain.assets.VehicleUsageEmployee
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface VehicleUsageEmployeeRepository extends JpaRepository<VehicleUsageEmployee, UUID> {

    @Query(value = '''
        SELECT COALESCE(SUM(
            CASE
                WHEN BTRIM(employee.labor_cost) ~ '^-?[0-9]+([.][0-9]+)?$'
                    THEN CAST(BTRIM(employee.labor_cost) AS numeric)
                ELSE 0
            END
        ), 0)
        FROM asset.vehicle_usage_employee employee
        JOIN asset.vehicle_usage_monitoring usage
          ON usage.id = employee.vehicle_usage
        WHERE usage.asset = :asset
          AND employee.company = :company
          AND usage.company = :company
          AND COALESCE(employee.deleted, false) = false
          AND COALESCE(usage.deleted, false) = false
    ''', nativeQuery = true)
    BigDecimal sumLaborCostByAssetAndCompany(
            @Param("asset") UUID asset,
            @Param("company") UUID company
    )
}
