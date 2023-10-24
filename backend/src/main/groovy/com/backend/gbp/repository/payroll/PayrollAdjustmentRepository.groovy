package com.backend.gbp.repository.payroll

import com.backend.gbp.domain.payroll.PHICContribution
import com.backend.gbp.domain.payroll.PayrollAdjustment
import org.springframework.data.jpa.repository.JpaRepository

interface PayrollAdjustmentRepository extends JpaRepository<PayrollAdjustment, UUID> {

}