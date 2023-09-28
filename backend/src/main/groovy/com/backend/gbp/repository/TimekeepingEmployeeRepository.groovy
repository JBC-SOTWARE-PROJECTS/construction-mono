package com.backend.gbp.repository

import com.backend.gbp.domain.Position
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.payroll.Payroll
import com.backend.gbp.domain.payroll.TimekeepingEmployee
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface TimekeepingEmployeeDto{
    UUID getId()
    UUID getEmployeeId()
    String getFullName()
    String getGender()
    Position getPosition()
}


interface TimekeepingEmployeeRepository extends JpaRepository<TimekeepingEmployee, UUID> {


    @Query(
            value = """Select te.payrollEmployee.employee from TimekeepingEmployee te where te.timekeeping.id = :id"""
    )
    List<Employee> findByTimekeepingEmployee(@Param("id") UUID id)

    @Query(
            value = """
Select 
te.id as id,
e.id as employeeId,
e.fullName as fullName, 
e.position as position,
e.gender as gender,
pe,
te
from TimekeepingEmployee te 
left join  te.payrollEmployee pe
left join  pe.employee e
where pe.payroll = :payroll"""
    )
    List<TimekeepingEmployeeDto> findByTimekeeping(@Param("payroll") Payroll payroll)

    @Query(
value = """Select te from TimekeepingEmployee te 
left join fetch te.accumulatedLogs
where te.timekeeping.id in :id"""
    )
    List<TimekeepingEmployee> findByTimekeepingId(@Param("id") UUID id)


    @Query(
            value = """Select te from TimekeepingEmployee te 
left join fetch te.accumulatedLogs
where te.timekeeping.id in :id"""
    )
    List<TimekeepingEmployee> findByPayrollEmployeeId(@Param("id") UUID id)
//
//    @Query(
//            value = """Select te from TimekeepingEmployee te where te.employee.id in :ids"""
//    )
//    List<TimekeepingEmployee> findByEmployeeIds(@Param("ids") UUID ids)

}
