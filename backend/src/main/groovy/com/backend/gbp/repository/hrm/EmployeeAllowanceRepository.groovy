package com.backend.gbp.repository.hrm

import com.backend.gbp.domain.hrm.EmployeeAllowance
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param


interface EmployeeAllowanceRepository extends JpaRepository<EmployeeAllowance, UUID> {

    @Query(
            value = """Select e from EmployeeAllowance e where e.employee.id = :employeeId 
                    and lower(e.name) like lower(concat('%',:filter,'%'))"""
    )
    List<EmployeeAllowance> findByEmployeeId(
            @Param("employeeId") UUID employeeId,
            @Param("filter") String filter)


}