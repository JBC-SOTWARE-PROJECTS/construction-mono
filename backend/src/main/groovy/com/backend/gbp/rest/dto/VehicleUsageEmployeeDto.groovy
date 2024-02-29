package com.backend.gbp.rest.dto

import com.backend.gbp.domain.assets.enums.RepairMaintenanceItemType
import groovy.transform.TupleConstructor

import java.time.Instant

@TupleConstructor
class VehicleUsageEmployeeDto {
    UUID id
    String designation
    String remarks
    Instant timeRenderedStart
    Instant timeRenderedEnd
    UUID item
    UUID asset
    UUID vehicleUsage
    UUID company
    UUID employee
}

