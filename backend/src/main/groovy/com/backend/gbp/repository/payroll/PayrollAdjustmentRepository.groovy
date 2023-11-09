package com.backend.gbp.repository.payroll

import com.backend.gbp.domain.payroll.PayrollAdjustment
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface PayrollAdjustmentRepository extends JpaRepository<PayrollAdjustment, UUID> {
    @Query(value = "select pc from PayrollAdjustment pc where pc.payroll.id = :payrollId")
    Optional <PayrollAdjustment> findByPayrollId(@Param("payrollId") UUID payrollId)
}