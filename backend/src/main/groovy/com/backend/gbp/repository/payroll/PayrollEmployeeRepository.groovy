package com.backend.gbp.repository.payroll

import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.payroll.PayrollEmployee
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface PayrollEmployeeRepository extends JpaRepository<PayrollEmployee, UUID> {

    interface PayrollEmployeeListDto {
        UUID getId()
        String getFullName()
    }

    @Query(
            value = """Select te.employee from PayrollEmployee te where te.payroll.id = :id order by te.employee.fullName asc"""
    )
    List<Employee> findEmployeeByPayrollId(@Param("id") UUID id)

    @Query(
            value = """Select te.employee.fullName as fullName, te.id as id from PayrollEmployee te where te.payroll.id = :id order by te.employee.fullName asc"""
    )
    List<PayrollEmployeeListDto> findPayrollEmployee(@Param("id") UUID id)

    @Query(
            value = """Select te from PayrollEmployee te where te.employee.id = :id and te.payroll.id = :payrollId"""
    )
    Optional<PayrollEmployee> findByPayroll(@Param("id") UUID id, @Param("payrollId") UUID payrollId)

    @Query(
            value = """Select te from PayrollEmployee te left join fetch te.employee where te.payroll.id = :id"""
    )
    List<PayrollEmployee> getPayrollEmployees(@Param("id") UUID id)

    @Query(
            value = """Select te from PayrollEmployee te left join fetch te.payroll where te.id = :id"""
    )
    Optional<PayrollEmployee> findByIdWithPayroll(@Param("id") UUID id)

    @Query(
            value = """Select te from PayrollEmployee te left join fetch te.payroll where te.id in :id"""
    )
    List<PayrollEmployee> findByIdWithPayroll(@Param("id") List<UUID> id)

    @Query(
            value = """Select te from PayrollEmployee te where te.payroll.id = :id"""
    )
    List<PayrollEmployee> findByPayrollId(@Param("id") UUID id)
//
//    @Query("""Select te from PayrollEmployee te left join te.payroll p left join p.otherDeduction od where od = otherDeduction""")
//    List<PayrollEmployee> findByPayrollOtherDeduction(@Param("otherDeduction") PayrollOtherDeduction otherDeduction)





}
