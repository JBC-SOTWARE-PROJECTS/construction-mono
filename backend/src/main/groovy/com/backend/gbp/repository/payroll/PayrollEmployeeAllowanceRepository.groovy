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

    String getEmployeeName()

    String getDepartment()

    String getGender()

    String getCivilStatus()

    String getEmploymentStatus()

    String getPosition()

    BigDecimal getTotal()

    PayrollEmployeeAllowance getEmployee()
}

interface PayrollAllowancePositionsDto {
    UUID getId()

    String getName()
}

interface PayrollEmployeeAllowanceRepository extends JpaRepository<PayrollEmployeeAllowance, UUID> {

//    @Query(value = """
//SELECT ae.id as id,
//e.fullName as employeeName,
//d.departmentName as department,
//ae as employee,
//e.firstName,
//e.lastName,
//e.middleName,
//e.nameSuffix ,
//COALESCE(sum(ai.amount),0) as total
//FROM PayrollEmployeeAllowance ae
//LEFT JOIN ae.allowanceItems ai
//LEFT JOIN ae.allowance a
//LEFT JOIN a.payroll p
//LEFT JOIN ae.payrollEmployee pe
//LEFT JOIN pe.employee e
//LEFT JOIN e.department d
//WHERE
//p.id = :payroll
//and upper(e.fullName) like upper(concat('%',:filter,'%'))
//and ae.status in :status
//AND (CASE WHEN :department = '' THEN CAST(d.id as text) ELSE :department END)  = CAST(d.id as text)
//GROUP BY ae.id, e.fullName, d.departmentName, e.firstName, e.lastName, e.middleName, e.nameSuffix
//HAVING (:withItems = false OR COALESCE(sum(ai.amount), 0) != 0)
//""",
//            countQuery = """
//SELECT COUNT(DISTINCT ae.id)
//FROM PayrollEmployeeAllowance ae
//LEFT JOIN ae.allowanceItems ai
//LEFT JOIN ae.allowance a
//LEFT JOIN a.payroll p
//LEFT JOIN ae.payrollEmployee pe
//LEFT JOIN pe.employee e
//LEFT JOIN e.department d
//WHERE p.id = :payroll
//and upper(e.fullName) like upper(concat('%',:filter,'%'))
//and ae.status in :status
//AND (CASE WHEN :department = '' THEN CAST(d.id as text) ELSE :department END)  = CAST(d.id as text)
//GROUP BY ae.id
//HAVING (:withItems = false OR COALESCE(sum(ai.amount), 0) != 0)
//               """)
//    Page<PayrollEmployeeAllowanceDto> findAllByPayrollWithItemsWithTotal(
//            @Param("payroll") UUID payroll,
//            @Param("filter") String filter,
//            @Param("department") String department,
//            @Param("status") List<PayrollEmployeeStatus> status,
//            @Param("withItems") Boolean withItems,
//            Pageable pageable)
//
//
//


}
