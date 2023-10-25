package com.backend.gbp.repository.payroll

import com.backend.gbp.domain.payroll.PayrollContribution
import com.backend.gbp.domain.payroll.PayrollLoan
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param


interface PayrollLoanRepository extends JpaRepository<PayrollLoan, UUID> {
    @Query(value = "select pc from PayrollLoan pc where pc.payroll.id = :payrollId")
    Optional <PayrollLoan> findByPayrollId(@Param("payrollId") UUID payrollId)


}
