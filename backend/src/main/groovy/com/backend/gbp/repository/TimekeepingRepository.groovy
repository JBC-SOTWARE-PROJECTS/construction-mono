package com.backend.gbp.repository

import com.backend.gbp.domain.payroll.Timekeeping
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface TimekeepingRepository extends JpaRepository<Timekeeping, UUID> {
    @Query(value = "select t from Timekeeping t where t.payroll.id = :payrollId")
   Optional <Timekeeping> findByPayrollId(@Param("payrollId") UUID payrollId)

}
