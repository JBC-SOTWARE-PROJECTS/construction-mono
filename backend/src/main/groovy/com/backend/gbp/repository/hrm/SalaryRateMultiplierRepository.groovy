package com.backend.gbp.repository.hrm

import com.backend.gbp.domain.hrm.SalaryRateMultiplier
import org.springframework.data.jpa.repository.JpaRepository

interface SalaryRateMultiplierRepository extends JpaRepository<SalaryRateMultiplier, UUID> {

}