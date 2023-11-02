package com.backend.gbp.repository.hrm

import com.backend.gbp.domain.hrm.EmployeeAllowance
import org.springframework.data.jpa.repository.JpaRepository


interface EmployeeAllowanceRepository extends JpaRepository<EmployeeAllowance, UUID> {

}