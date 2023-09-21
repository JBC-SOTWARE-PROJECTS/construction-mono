package com.backend.gbp.repository.hrm

import com.backend.gbp.domain.hrm.EmployeeAttendance
import com.backend.gbp.domain.hrm.EmployeeSchedule
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

import java.time.Instant


interface EmployeeScheduleRepository extends JpaRepository<EmployeeSchedule, UUID> {


    @Query(value = "Select es from EmployeeSchedule es where es.dateString in :dates and es.employee.id = :employeeId ")
    List<EmployeeSchedule> getRegularSchedules(@Param("dates") List<String> dates, @Param("employeeId") UUID employeeId)

    @Query(value = "Select es from EmployeeSchedule es where es.dateString = :date and es.employee.id = :employeeId ")
    List<EmployeeSchedule> findByDateAndEmployeeId(@Param("date") String date, @Param("employeeId") UUID employeeId)

    @Query(
            value = """Select e from EmployeeSchedule e 
				where e.employee.id = :id
				and (e.dateTimeStart >= :startDate and e.dateTimeStart <= :endDate)"""
    )
    List<EmployeeSchedule> findByDateRangeEmployeeId(
            @Param("id") UUID id,
            @Param("startDate") Instant startDate,
            @Param("endDate") Instant endDate)

}