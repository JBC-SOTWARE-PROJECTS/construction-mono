package com.backend.gbp.rest.dto

import groovy.transform.TupleConstructor

@TupleConstructor
class AssetRepairMaintenanceItemDto {
    UUID id
    Integer quantity
    BigDecimal basePrice
    UUID assetRepairMaintenance
    UUID item
}

