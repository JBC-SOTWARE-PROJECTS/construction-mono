package com.backend.gbp.repository.payroll


import com.backend.gbp.domain.payroll.PayrollAdjustmentItem
import com.backend.gbp.domain.payroll.PayrollEmployeeAdjustment
import com.backend.gbp.domain.payroll.enums.PayrollEmployeeStatus
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param


interface PayrollEmployeeAdjustmentDto {
    String getId()

    String getEmployeeName()

    PayrollEmployeeAdjustment getEmployee()

    String getStatus()

    BigDecimal getTotal()

}

interface PayrollEmployeeAdjustmentRepository extends JpaRepository<PayrollEmployeeAdjustment, UUID> {
    @Query(value = """
    SELECT 
        ea.id as id, 
        ea.status as status, 
        ea as employee,
        e.fullName as employeeName
    FROM PayrollEmployeeAdjustment ea
    LEFT JOIN ea.adjustmentItems ai
    LEFT JOIN ea.payrollAdjustment pa  
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
    HAVING (:withItems = false OR COALESCE(count(ai.amount), 0) != 0)
    ORDER BY e.fullName
""", countQuery = """
    SELECT COUNT(DISTINCT ea.id) 
    FROM PayrollEmployeeAdjustment ea
    LEFT JOIN ea.adjustmentItems ai
    LEFT JOIN ea.payrollAdjustment pa  
    LEFT JOIN pa.payroll p  
    LEFT JOIN ea.payrollEmployee pe  
    LEFT JOIN pe.employee e  
    WHERE 
        p.id = :payroll 
        and upper(e.fullName) like upper(concat('%',:filter,'%'))
        and ea.status in :status
    GROUP BY ea.id
    HAVING (:withItems = false OR COALESCE(count(ai.amount), 0) != 0)
""")
    Page<PayrollEmployeeAdjustmentDto> getEmployeesPageable(
            @Param("payroll") UUID payroll,
            @Param("filter") String filter,
            @Param("status") List<PayrollEmployeeStatus> status,
            @Param("withItems") Boolean withItems,
            Pageable pageable)

    @Query(value = """
    SELECT 
        ea.id as id, 
        e.fullName as employeeName
    FROM PayrollEmployeeAdjustment ea
    LEFT JOIN ea.payrollAdjustment pa  
    LEFT JOIN pa.payroll p  
    LEFT JOIN ea.payrollEmployee pe  
    LEFT JOIN pe.employee e  
    WHERE 
        p.id = :payroll 
    GROUP BY 
        ea.id,
        e.fullName
    ORDER BY e.fullName
""")
    List<PayrollEmployeeAdjustmentDto> getEmployeesList(
            @Param("payroll") UUID payroll
    )
}