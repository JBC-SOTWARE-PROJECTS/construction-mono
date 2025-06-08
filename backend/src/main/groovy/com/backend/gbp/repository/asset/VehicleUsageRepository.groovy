package com.backend.gbp.repository.asset

import com.backend.gbp.domain.assets.VehicleUsageEmployee
import com.backend.gbp.domain.assets.VehicleUsageMonitoring
import com.backend.gbp.domain.payroll.AccumulatedLogs
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface VehicleUsageRepository extends JpaRepository<VehicleUsageMonitoring, UUID> {

    @Query(
            value = """Select p from VehicleUsageMonitoring p where p.asset.id = :asset ORDER BY p.startDatetime DESC"""
    )
    List<VehicleUsageMonitoring> findByAsset(@Param("asset") UUID asset)

    @Query(
            value = """Select p from VehicleUsageMonitoring p where p.project.id = :project ORDER BY p.startDatetime DESC"""
    )
    List<VehicleUsageMonitoring> findByProject(@Param("project") UUID project)

}
