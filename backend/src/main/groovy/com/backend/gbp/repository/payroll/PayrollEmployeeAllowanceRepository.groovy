package com.backend.gbp.repository.payroll

import com.backend.gbp.domain.payroll.PayrollEmployeeAllowance
import com.backend.gbp.domain.payroll.enums.PayrollEmployeeStatus
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

import java.time.Instant

interface PayrollEmployeeAllowanceDto {
    String getId()

    String getPayrollEmployeeId()

    String getEmployeeName()

    String getDepartment()

    String getStatus()

    String getPosition()

    BigDecimal getTotal()

    PayrollEmployeeAllowance getEmployee()
}


interface PayrollEmployeeAllowanceRepository extends JpaRepository<PayrollEmployeeAllowance, UUID> {

    @Query(value = """
SELECT ae.id as id,
pe.id as payrollEmployeeId,
e.fullName as employeeName,
ae as employee,
e.firstName,
e.lastName,
e.middleName,
e.nameSuffix ,
pos.description as position,
ae.status as status,
COALESCE(sum(ai.amount),0) as total
FROM PayrollEmployeeAllowance ae
LEFT JOIN ae.allowanceItems ai
LEFT JOIN ae.allowance a
LEFT JOIN a.payroll p
LEFT JOIN ae.payrollEmployee pe
LEFT JOIN pe.employee e
Left JOIN e.position pos
WHERE
p.id = :payroll
and upper(e.fullName) like upper(concat('%',:filter,'%'))
and ae.status in :status
GROUP BY ae.id, pe.id, e.fullName, e.firstName, e.lastName, e.middleName, e.nameSuffix, pos.description ,ae.status 
HAVING (:withItems = false OR COALESCE(sum(ai.amount), 0) != 0)
ORDER BY e.fullName
""",
            countQuery = """
SELECT COUNT(DISTINCT ae.id)
FROM PayrollEmployeeAllowance ae
LEFT JOIN ae.allowanceItems ai
LEFT JOIN ae.allowance a
LEFT JOIN a.payroll p
LEFT JOIN ae.payrollEmployee pe
LEFT JOIN pe.employee e
WHERE p.id = :payroll
and upper(e.fullName) like upper(concat('%',:filter,'%'))
and ae.status in :status
GROUP BY ae.id
HAVING (:withItems = false OR COALESCE(sum(ai.amount), 0) != 0)
               """)
    Page<PayrollEmployeeAllowanceDto> findAllByPayrollWithItemsWithTotal(
            @Param("payroll") UUID payroll,
            @Param("filter") String filter,
            @Param("status") List<PayrollEmployeeStatus> status,
            @Param("withItems") Boolean withItems,
            Pageable pageable)


    @Query(value = """
SELECT ae.id as id,
pe.id as payrollEmployeeId,
e.fullName as employeeName,
e.firstName,
e.lastName,
e.middleName,
e.nameSuffix 
FROM PayrollEmployeeAllowance ae
LEFT JOIN ae.allowance a
LEFT JOIN a.payroll p
LEFT JOIN ae.payrollEmployee pe
LEFT JOIN pe.employee e
WHERE
p.id = :payroll
GROUP BY ae.id, pe.id, e.fullName, e.firstName, e.lastName, e.middleName, e.nameSuffix
ORDER BY e.fullName
""")
    List<PayrollEmployeeAllowanceDto> getAllByPayroll(
            @Param("payroll") UUID payroll)


}
