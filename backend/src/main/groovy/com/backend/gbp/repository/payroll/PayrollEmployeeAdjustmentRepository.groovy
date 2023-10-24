package com.backend.gbp.repository.payroll


import com.backend.gbp.domain.payroll.PayrollAdjustment
import com.backend.gbp.domain.payroll.PayrollEmployeeAdjustment
import org.springframework.data.jpa.repository.JpaRepository

interface PayrollEmployeeAdjustmentRepository extends JpaRepository<PayrollEmployeeAdjustment, UUID> {

}