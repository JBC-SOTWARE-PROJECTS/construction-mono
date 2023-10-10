package com.backend.gbp.repository.payroll

import com.backend.gbp.domain.payroll.EmployeeLoan
import com.backend.gbp.domain.payroll.enums.EmployeeLoanCategory
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface EmployeeLoanRepository extends JpaRepository<EmployeeLoan, UUID> {

    @Query(value = "select l from EmployeeLoan l where l.employee.id = :employeeId and l.category = :category",
            countQuery = "select count(l) from EmployeeLoan l where l.employee.id = :employeeId and l.category = :category")
    Page<EmployeeLoan> getByEmployeePageable(
            @Param("employeeId") UUID employeeId,
            @Param("category") EmployeeLoanCategory category,
            Pageable pageable)

}