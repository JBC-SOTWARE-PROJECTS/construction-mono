package com.backend.gbp.repository.asset

import com.backend.gbp.domain.assets.AssetRepairMaintenanceItems
import com.backend.gbp.domain.assets.enums.RepairMaintenanceStatus
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface AssetRepairMaintenanceItemRepository extends JpaRepository<AssetRepairMaintenanceItems, UUID> {

    @Query('''
        SELECT COALESCE(SUM(item.basePrice), 0)
        FROM AssetRepairMaintenanceItems item
        JOIN item.assetRepairMaintenance maintenance
        WHERE maintenance.asset.id = :asset
          AND item.company = :company
          AND maintenance.company = :company
          AND maintenance.status = :status
    ''')
    BigDecimal sumBasePriceByAssetCompanyAndStatus(
            @Param("asset") UUID asset,
            @Param("company") UUID company,
            @Param("status") RepairMaintenanceStatus status
    )
}
