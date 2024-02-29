package com.backend.gbp.repository.asset

import com.backend.gbp.domain.assets.VehicleUsageEmployee
import com.backend.gbp.domain.inventory.Signature
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface VehicleUsageEmployeeRepository extends JpaRepository<VehicleUsageEmployee, UUID> {


}
