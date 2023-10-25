package com.backend.gbp.repository.payroll


import com.backend.gbp.domain.payroll.PayrollAdjustment
import com.backend.gbp.domain.payroll.PayrollEmployeeAdjustment
import com.backend.gbp.domain.payroll.PayrollEmployeeLoan
import com.backend.gbp.domain.payroll.PayrollLoanItem
import com.backend.gbp.domain.payroll.enums.PayrollEmployeeStatus
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param


interface PayrollEmployeeAdjustmentDto {
    String getId()
    String getEmployeeName()
    List<PayrollLoanItem> getAdjustmentItems()
    String getStatus()

    PayrollEmployeeLoan getEmployee()
}

interface PayrollEmployeeAdjustmentRepository extends JpaRepository<PayrollEmployeeAdjustment, UUID> {
    @Query(value = """
    SELECT 
        ea.id as id, 
        ea.status as status, 
        ea.adjustmentItems as adjustmentItems,
        e.fullName as employeeName
    FROM PayrollEmployeeAdjustment ea
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
""", countQuery = """
    SELECT COUNT(DISTINCT ea.id) 
    FROM PayrollEmployeeAdjustment ea
    LEFT JOIN ea.payrollAdjustment pa  
    LEFT JOIN pa.payroll p  
    LEFT JOIN ea.payrollEmployee pe  
    LEFT JOIN pe.employee e  
    WHERE 
        p.id = :payroll 
        and upper(e.fullName) like upper(concat('%',:filter,'%'))
        and ea.status in :status
    GROUP BY ea.id
""")
    Page<PayrollEmployeeAdjustmentDto> getEmployeesPageable(
            @Param("payroll") UUID payroll,
            @Param("filter") String filter,
            @Param("status") List<PayrollEmployeeStatus> status,
            Pageable pageable)
}