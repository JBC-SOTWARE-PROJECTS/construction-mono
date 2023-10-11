package com.backend.gbp.repository.payroll

import com.backend.gbp.domain.payroll.PayrollEmployeeLoan
import com.backend.gbp.domain.payroll.PayrollLoanItem
import org.springframework.data.jpa.repository.JpaRepository

interface PayrollEmployeeLoanRepository extends JpaRepository<PayrollEmployeeLoan, UUID> {






}
