package com.backend.gbp.repository.payroll

import com.backend.gbp.domain.payroll.PayrollOtherDeduction
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface PayrollOtherDeductionRepository extends JpaRepository<PayrollOtherDeduction, UUID> {
    @Query(value = "select pc from PayrollOtherDeduction pc where pc.payroll.id = :payrollId")
    Optional <PayrollOtherDeduction> findByPayrollId(@Param("payrollId") UUID payrollId)
}