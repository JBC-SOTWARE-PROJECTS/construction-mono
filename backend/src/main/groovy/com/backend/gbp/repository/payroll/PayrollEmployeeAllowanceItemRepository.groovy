package com.backend.gbp.repository.payroll

import com.backend.gbp.domain.payroll.PayrollAllowanceItem
import com.backend.gbp.domain.payroll.PayrollEmployee
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface PayrollAllowanceItemRepository extends JpaRepository<PayrollAllowanceItem, UUID> {
    @Query(
            value = """Select i from PayrollAllowanceItem i
                       left join fetch i.payrollEmployeeAllowance pe
                       left join fetch i.allowance ai
                       left join fetch pe.allowance al
                       where al.id = :id
                       and ai.isAttendanceBased is true
                       """
    )
    List<PayrollAllowanceItem> findAttendanceBasedByAllowanceId(@Param("id") UUID id)

    @Query(
            value = """Select i from PayrollAllowanceItem i
                       left join fetch i.payrollEmployeeAllowance pe
                       left join fetch i.allowance ai
                       where pe.id = :id
                       and ai.isAttendanceBased is true
                       """
    )
    List<PayrollAllowanceItem> findAttendanceBasedByPayrollEmployeeId(@Param("id") UUID id)

    @Query(
            value = """Select pe from PayrollEmployee pe
                       left join fetch pe.payroll p
                       left join fetch pe.timekeepingEmployee te
                       left join fetch te.accumulatedLogs
                       where pe.payroll.id = :id
                       """
    )
    List<PayrollEmployee> joinFetchTimekeepingEmployees(@Param("id") UUID id)

    @Query(
            value = """Select pe from PayrollEmployee pe
                       left join fetch pe.payroll p
                       left join fetch pe.employee e
                       left join fetch e.allowanceItems ai
                       where pe.payroll.id = :id
                       """
    )
    List<PayrollEmployee> joinFetchAllowanceItems(@Param("id") UUID id)
}
