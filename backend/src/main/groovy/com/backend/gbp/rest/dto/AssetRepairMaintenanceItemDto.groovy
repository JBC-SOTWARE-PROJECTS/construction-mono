package com.backend.gbp.rest.dto

import com.backend.gbp.domain.assets.enums.RepairMaintenanceItemType
import groovy.transform.TupleConstructor

@TupleConstructor
class AssetRepairMaintenanceItemDto {
    UUID id
    Integer quantity
    BigDecimal basePrice
    RepairMaintenanceItemType itemType
    String description
    UUID assetRepairMaintenance
    UUID item
}

