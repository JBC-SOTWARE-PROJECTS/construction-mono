package com.backend.gbp.repository.payroll

import com.backend.gbp.domain.payroll.PayrollLoan
import com.backend.gbp.domain.payroll.PayrollLoanItem
import org.springframework.data.jpa.repository.JpaRepository


interface PayrollLoanItemRepository extends JpaRepository<PayrollLoanItem, UUID> {






}
