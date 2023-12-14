package com.backend.gbp.repository.payroll

import com.backend.gbp.domain.payroll.PayrollAllowance
import com.backend.gbp.domain.payroll.PayrollEmployeeAllowance
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface PayrollAllowanceRepository extends JpaRepository<PayrollAllowance, UUID> {
    @Query(value = "select pa from PayrollAllowance pa where pa.payroll.id = :payrollId")
    Optional <PayrollAllowance> findByPayrollId(@Param("payrollId") UUID payrollId)

    @Query(value = """select pe from PayrollEmployeeAllowance pe  
left join fetch pe.allowanceItems
where pe.allowance.id = :id""")
    List <PayrollEmployeeAllowance> joinFetchAllowanceItems(@Param("id") UUID id)

}
