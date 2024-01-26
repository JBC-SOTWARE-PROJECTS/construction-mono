package com.backend.gbp.repository.payroll

import com.backend.gbp.domain.payroll.PayrollEmployee
import com.backend.gbp.domain.payroll.PayrollEmployeeLoan
import com.backend.gbp.domain.payroll.PayrollLoanItem
import com.backend.gbp.domain.payroll.enums.PayrollEmployeeStatus
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface PayrollEmployeeLoanDto {
    String getId()
    String getEmployeeName()
    List<PayrollLoanItem> getLoanItems()
    String getStatus()
    PayrollEmployeeLoan getEmployee()
}

interface PayrollEmployeeLoanRepository extends JpaRepository<PayrollEmployeeLoan, UUID> {


    @Query("""Select e from PayrollEmployee e
left join fetch e.payrollEmployeeLoan el
join fetch e.employee
where e.payroll.id = :payroll""")
    List<PayrollEmployee> fetchEmployeeLoan(@Param("payroll") UUID payroll)

    @Query(value = """
    SELECT 
        el.id as id, 
        el.status as status, 
        el as employee,
        e.fullName as employeeName
    FROM PayrollEmployeeLoan el
    LEFT JOIN el.loanItems li
    LEFT JOIN el.payrollLoan pl  
    LEFT JOIN pl.payroll p  
    LEFT JOIN el.payrollEmployee pe  
    LEFT JOIN pe.employee e  
    WHERE 
        p.id = :payroll 
        and upper(e.fullName) like upper(concat('%',:filter,'%'))
        and el.status in :status
    GROUP BY 
        el.id,
        el.status,
        e.fullName
    HAVING (:withItems = false OR COALESCE(count(li.amount), 0) != 0)
    ORDER BY e.fullName
""", countQuery = """
    SELECT COUNT(DISTINCT el.id) 
    FROM PayrollEmployeeLoan el
    LEFT JOIN el.loanItems li
    LEFT JOIN el.payrollLoan pl  
    LEFT JOIN pl.payroll p  
    LEFT JOIN el.payrollEmployee pe  
    LEFT JOIN pe.employee e  
    WHERE 
        p.id = :payroll 
        and upper(e.fullName) like upper(concat('%',:filter,'%'))
        and el.status in :status
    GROUP BY el.id
    HAVING (:withItems = false OR COALESCE(count(li.amount), 0) != 0)
""")
    Page<PayrollEmployeeLoanDto> getEmployeesPageable(
            @Param("payroll") UUID payroll,
            @Param("filter") String filter,
            @Param("status") List<PayrollEmployeeStatus> status,
            @Param("withItems") Boolean withItems,
            Pageable pageable)


//    @Query("""
//SELECT
//        el.id as id
//    FROM PayrollEmployeeLoan el
//    LEFT JOIN el.payrollLoan pl
//    LEFT JOIN pl.payroll p
//    LEFT JOIN el.payrollEmployee pe
//    LEFT JOIN pe.employee e
//    WHERE
//        p.id = :payroll
//        and el.status in :status
//    GROUP BY
//el.id,
// el.status,
//e.fullName
//""")
//    List<PayrollEmployeeLoanDto> test (
//            @Param("payroll") UUID payroll,
//            @Param("status") List<PayrollEmployeeStatus> status)

    @Query("""
  SELECT 
        el.id as id, 
        el.status as status, 
        el as employee,
        e.fullName as employeeName
    FROM PayrollEmployeeLoan el
    LEFT JOIN el.payrollLoan pl  
    LEFT JOIN pl.payroll p  
    LEFT JOIN el.payrollEmployee pe  
    LEFT JOIN pe.employee e  
    WHERE 
        p.id = :payroll 
        and upper(e.fullName) like upper(concat('%',:filter,'%'))
        and el.status in :status
    GROUP BY 
        el.id,
        el.status,
        e.fullName
""")
    List<PayrollEmployeeLoanDto> test (
            @Param("payroll") UUID payroll,
            @Param("filter") String filter,
            @Param("status") List<PayrollEmployeeStatus> status)

}
