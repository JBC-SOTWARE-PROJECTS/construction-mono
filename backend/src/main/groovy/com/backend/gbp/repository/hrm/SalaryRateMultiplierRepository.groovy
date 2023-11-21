package com.backend.gbp.repository.hrm

import com.backend.gbp.domain.hrm.EventCalendar
import com.backend.gbp.domain.hrm.SalaryRateMultiplier
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param


interface SalaryRateMultiplierRepository extends JpaRepository<SalaryRateMultiplier, UUID> {
    @Query(value = """
        Select e from SalaryRateMultiplier e
        where
            e.company.id = :id
    """)
    SalaryRateMultiplier getByCompany(@Param("id") UUID id)

}