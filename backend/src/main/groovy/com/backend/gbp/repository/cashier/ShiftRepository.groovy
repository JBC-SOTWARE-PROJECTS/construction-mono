package com.backend.gbp.repository.cashier

import com.backend.gbp.domain.cashier.Shift
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface ShiftRepository extends JpaRepository<Shift, UUID> {

    @Query(value = "select q from Shift q where q.employee.id = :id")
    List<Shift> getShiftEmp(@Param('id') UUID id)

    @Query(value = "select q from Shift q where q.employee.id = :id and q.active = true")
    Shift getActiveShift(@Param('id') UUID id)

}
