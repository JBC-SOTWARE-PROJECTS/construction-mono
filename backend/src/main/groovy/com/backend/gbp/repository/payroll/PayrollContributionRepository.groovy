package com.backend.gbp.repository.payroll

import com.backend.gbp.domain.payroll.PayrollContribution
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface PayrollContributionRepository extends JpaRepository<PayrollContribution, UUID> {
    @Query(value = "select pc from PayrollContribution pc where pc.payroll.id = :payrollId")
    Optional <PayrollContribution> findByPayrollId(@Param("payrollId") UUID payrollId)

}
