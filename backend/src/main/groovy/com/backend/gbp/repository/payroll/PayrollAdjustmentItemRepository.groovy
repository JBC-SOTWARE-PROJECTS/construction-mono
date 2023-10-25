package com.backend.gbp.repository.payroll

import com.backend.gbp.domain.payroll.PayrollAdjustmentItem
import com.backend.gbp.domain.payroll.PayrollEmployeeAdjustment
import org.springframework.data.jpa.repository.JpaRepository

interface PayrollAdjustmentItemRepository extends JpaRepository<PayrollAdjustmentItem, UUID> {

}