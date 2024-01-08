package com.backend.gbp.repository.payroll

import com.backend.gbp.domain.payroll.PayrollAllowanceItem
import org.springframework.data.jpa.repository.JpaRepository

interface PayrollAllowanceItemRepository extends JpaRepository<PayrollAllowanceItem, UUID> {

}
