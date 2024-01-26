package com.backend.gbp.repository.payroll

import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.payroll.PayrollEmployee
import com.backend.gbp.domain.payroll.enums.PayrollEmployeeStatus
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface PayrollEmployeeListDto {
    UUID getId()

    String getFullName()

    String getPosition()

    BigDecimal getWithholdingTax()

    Boolean getIsDisabledWithholdingTax()

    PayrollEmployeeStatus getStatus()

    PayrollEmployeeStatus getTimekeepingStatus()

    PayrollEmployeeStatus getContributionStatus()

}

interface PayrollEmployeeRepository extends JpaRepository<PayrollEmployee, UUID> {


    @Query(
            value = """Select te.employee from PayrollEmployee te where te.payroll.id = :id order by te.employee.fullName asc"""
    )
    List<Employee> findEmployeeByPayrollId(@Param("id") UUID id)

    @Query(
            value = """Select 
e.fullName as fullName, 
e.position.description as position,
pe.withholdingTax as withholdingTax,
pe.status as status,
te.status as timekeepingStatus,
ce.status as contributionStatus,
pe.id as id from 
PayrollEmployee pe 
left join pe.timekeepingEmployee te
left join pe.payrollEmployeeContribution ce
left join pe.employee e
where pe.payroll.id = :id 
order by pe.employee.fullName asc"""
    )
    List<PayrollEmployeeListDto> findPayrollEmployee(@Param("id") UUID id)

    @Query(
            value = """Select te from PayrollEmployee te where te.employee.id = :id and te.payroll.id = :payrollId"""
    )
    List<PayrollEmployee> findByPayroll(@Param("id") UUID id, @Param("payrollId") UUID payrollId)

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

    @Query(
            value = """Select pe from PayrollEmployee pe
left join fetch pe.employee e
where pe.payroll.id = :id"""
    )
    List<PayrollEmployee> findByPayrollJoinHrmEmpId(@Param("id") UUID id)

    @Query(
            value = "SELECT te FROM PayrollEmployee te LEFT JOIN FETCH te.payroll WHERE te.id IN :idList"
    )
    List<PayrollEmployee> getAllPayrollEmpById(@Param("idList") List<UUID> idList);

    @Query(
            value = """
Select 
e.fullName as fullName, 
e.position.description as position,
e.isDisabledWithholdingTax as isDisabledWithholdingTax,
pe.withholdingTax as withholdingTax,
pe.status as status,
te.status as timekeepingStatus,
ce.status as contributionStatus,
pe.id as id from 
PayrollEmployee pe 
left join pe.timekeepingEmployee te
left join pe.payrollEmployeeContribution ce
left join pe.employee e
where pe.payroll.id = :payroll 
and upper(e.fullName) like upper(concat('%',:filter,'%'))
and pe.status in :status
order by e.fullName 
""",
            countQuery = """
Select count(pe.id) from 
PayrollEmployee pe 
left join pe.employee e
where pe.payroll.id = :payroll 
and upper(e.fullName) like upper(concat('%',:filter,'%'))
and pe.status in :status

"""
    )
    Page<PayrollEmployeeListDto> findByPayrollPageable(
            @Param("payroll") UUID payroll,
            @Param("filter") String filter,
            @Param("status") List<PayrollEmployeeStatus> status,
            Pageable pageable
    )


//
//    @Query("""Select te from PayrollEmployee te left join te.payroll p left join p.otherDeduction od where od = otherDeduction""")
//    List<PayrollEmployee> findByPayrollOtherDeduction(@Param("otherDeduction") PayrollOtherDeduction otherDeduction)


}
