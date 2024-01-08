package com.backend.gbp.repository.payroll

import com.backend.gbp.domain.payroll.PayrollEmployeeOtherDeduction
import com.backend.gbp.domain.payroll.enums.PayrollEmployeeStatus
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface PayrollEmployeeOtherDeductionDto {
    String getId()

    String getEmployeeName()

    PayrollEmployeeOtherDeduction getEmployee()

    String getStatus()

    BigDecimal getTotal()

}

interface PayrollEmployeeOtherDeductionRepository extends JpaRepository<PayrollEmployeeOtherDeduction, UUID> {
    @Query(value = """
    SELECT 
        ea.id as id, 
        ea.status as status, 
        ea as employee,
        e.fullName as employeeName
    FROM PayrollEmployeeOtherDeduction ea
    LEFT JOIN ea.payrollOtherDeduction pa  
    LEFT JOIN pa.payroll p  
    LEFT JOIN ea.payrollEmployee pe  
    LEFT JOIN pe.employee e  
    WHERE 
        p.id = :payroll 
        and upper(e.fullName) like upper(concat('%',:filter,'%'))
        and ea.status in :status
    GROUP BY 
        ea.id,
        ea.status,
        e.fullName
""", countQuery = """
    SELECT COUNT(DISTINCT ea.id) 
    FROM PayrollEmployeeOtherDeduction ea
    LEFT JOIN ea.payrollOtherDeduction pa  
    LEFT JOIN pa.payroll p  
    LEFT JOIN ea.payrollEmployee pe  
    LEFT JOIN pe.employee e  
    WHERE 
        p.id = :payroll 
        and upper(e.fullName) like upper(concat('%',:filter,'%'))
        and ea.status in :status
    GROUP BY ea.id
""")
    Page<PayrollEmployeeOtherDeductionDto> getEmployeesPageable(
            @Param("payroll") UUID payroll,
            @Param("filter") String filter,
            @Param("status") List<PayrollEmployeeStatus> status,
            Pageable pageable)

    @Query(value = """
    SELECT
        ea.id as id,
        e.fullName as employeeName
    FROM PayrollEmployeeOtherDeduction ea
    LEFT JOIN ea.payrollOtherDeduction pa
    LEFT JOIN pa.payroll p
    LEFT JOIN ea.payrollEmployee pe
    LEFT JOIN pe.employee e
    WHERE
        p.id = :payroll
    GROUP BY
        ea.id,
        e.fullName
""")
    List<PayrollEmployeeOtherDeductionDto> getEmployeesList(
            @Param("payroll") UUID payroll
    )
}