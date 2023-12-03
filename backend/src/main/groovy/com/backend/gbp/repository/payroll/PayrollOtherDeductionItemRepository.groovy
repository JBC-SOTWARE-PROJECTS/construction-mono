package com.backend.gbp.repository.payroll

import com.backend.gbp.domain.payroll.PayrollOtherDeductionItem
import org.springframework.data.jpa.repository.JpaRepository

interface PayrollOtherDeductionItemRepository extends JpaRepository<PayrollOtherDeductionItem, UUID> {

}