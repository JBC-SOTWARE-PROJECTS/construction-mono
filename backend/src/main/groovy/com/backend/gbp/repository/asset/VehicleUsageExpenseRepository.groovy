package com.backend.gbp.repository.asset

import com.backend.gbp.domain.assets.VehicleUsageExpense
import org.springframework.data.jpa.repository.JpaRepository

interface VehicleUsageExpenseRepository extends JpaRepository<VehicleUsageExpense, UUID> {

    List<VehicleUsageExpense> findAllByVehicleUsageIdAndCompanyOrderByCreatedDateAsc(UUID vehicleUsageId, UUID company)

    Optional<VehicleUsageExpense> findByIdAndVehicleUsageIdAndCompany(UUID id, UUID vehicleUsageId, UUID company)
}
