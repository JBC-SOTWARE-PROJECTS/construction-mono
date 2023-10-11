package com.backend.gbp.repository.payroll

import com.backend.gbp.domain.payroll.PayrollEmployee
import com.backend.gbp.domain.payroll.PayrollEmployeeLoan
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface PayrollEmployeeLoanRepository extends JpaRepository<PayrollEmployeeLoan, UUID> {


    @Query("""Select e from PayrollEmployee e
left join fetch e.payrollEmployeeLoan el
join fetch e.employee
where e.payroll.id = :payroll""")
    List<PayrollEmployee> fetchEmployeeLoan(@Param("payroll") UUID payroll)



}
