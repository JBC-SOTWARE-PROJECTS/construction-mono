package com.backend.gbp.repository

import com.backend.gbp.domain.payroll.AccumulatedLogs
import com.backend.gbp.domain.payroll.TimekeepingEmployee
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface AccumulatedLogRepository extends JpaRepository<AccumulatedLogs, UUID> {

    @Query(
            value = """Select al from AccumulatedLogs al 
                       where al.timekeepingEmployee.id = :id"""
    )
    List<AccumulatedLogs> findByTimekeepingEmployee(@Param("id") UUID id)


}
