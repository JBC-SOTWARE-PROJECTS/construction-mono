package com.backend.gbp.repository.hrm

import com.backend.gbp.domain.hrm.Employee
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

    @Query(
            value = """Select e from EmployeeAllowance e where e.employee.id in :employeeId 
                    and lower(e.name) like lower(concat('%',:filter,'%'))"""
    )
    List<EmployeeAllowance> findByEmployeeInIds(
            @Param("employeeId") List<UUID> employeeIds,
            @Param("filter") String filter)

    @Query(
            value = """Select e from Employee e  
left join fetch e.allowanceItems
where e.id in :employeeId 
"""
    )
    List<Employee> joinFetchEmployeeAllowance(
            @Param("employeeId") List<UUID> employeeIds)

}