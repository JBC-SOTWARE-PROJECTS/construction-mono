package com.backend.gbp.repository.asset

import com.backend.gbp.domain.assets.VehicleUsageEmployee
import com.backend.gbp.domain.assets.VehicleUsageMonitoring
import com.backend.gbp.domain.payroll.AccumulatedLogs
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface VehicleUsageRepository extends JpaRepository<VehicleUsageMonitoring, UUID> {

    Optional<VehicleUsageMonitoring> findByIdAndCompany(UUID id, UUID company)

    @Query('''
        SELECT COALESCE(SUM(usage.calculatedRentalFee), 0)
        FROM VehicleUsageMonitoring usage
        WHERE usage.asset.id = :asset
          AND usage.company = :company
    ''')
    BigDecimal sumCalculatedRentalFeeByAssetAndCompany(
            @Param("asset") UUID asset,
            @Param("company") UUID company
    )

    @Query(
            value = """Select p from VehicleUsageMonitoring p where p.asset.id = :asset ORDER BY p.startDatetime DESC"""
    )
    List<VehicleUsageMonitoring> findByAsset(@Param("asset") UUID asset)

    @Query(
            value = """Select p from VehicleUsageMonitoring p where p.project.id = :project ORDER BY p.startDatetime DESC"""
    )
    List<VehicleUsageMonitoring> findByProject(@Param("project") UUID project)

}
