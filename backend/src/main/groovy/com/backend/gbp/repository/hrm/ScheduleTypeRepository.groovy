package com.backend.gbp.repository.hrm

import com.backend.gbp.domain.hrm.Schedule
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface ScheduleTypeRepository extends JpaRepository<Schedule, UUID> {

    @Query(value = "Select s from Schedule s order by s.dateTimeStartRaw")
    List<Schedule> getOneSchedule(@Param("id")UUID id)

    @Query(value = "Select s from Schedule s where s.company.id = :companyId order by s.dateTimeStartRaw")
    List<Schedule> getAllSchedules(@Param("companyId")UUID companyId)

}
