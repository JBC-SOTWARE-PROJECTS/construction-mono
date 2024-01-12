package com.backend.gbp.repository.cashier

import com.backend.gbp.domain.cashier.Shift
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface ShiftRepository extends JpaRepository<Shift, UUID> {

    @Query(value = "select q from Shift q where q.employee.id = :id and q.company = :company")
    List<Shift> getShiftEmp(@Param('id') UUID id, @Param('company') UUID company)

    @Query(value = "select q from Shift q where q.company = :company")
    List<Shift> getAllShift(@Param('company') UUID company)

    @Query(value = "select q from Shift q where (lower(q.shiftNo) like lower(concat('%',:filter,'%')) or lower(q.remarks) like lower(concat('%',:filter,'%'))) and q.active = :status and q.company = :company")
    List<Shift> getActiveShiftList(@Param('company') UUID company, @Param('filter') String filter, @Param('status') Boolean status)

    @Query(value = "select q from Shift q where q.active = true and q.company = :company")
    List<Shift> getActiveShift(@Param('company') UUID company)

}
