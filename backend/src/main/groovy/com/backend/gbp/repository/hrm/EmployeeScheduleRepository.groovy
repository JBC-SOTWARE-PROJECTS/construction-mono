package com.backend.gbp.repository.hrm

import com.backend.gbp.domain.hrm.EmployeeSchedule
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param


interface EmployeeScheduleRepository extends JpaRepository<EmployeeSchedule, UUID> {


//    @Query(value = "Select es from EmployeeSc")
//    List<EmployeeSchedule> getAllSchedules(@Param("companyId")UUID companyId)

}