package com.backend.gbp.repository.payroll

import com.backend.gbp.domain.hrm.EmployeeLeave
import com.backend.gbp.domain.hrm.enums.LeaveStatus
import com.backend.gbp.domain.hrm.enums.LeaveType
import com.backend.gbp.domain.payroll.enums.EmployeeLoanCategory
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface EmployeeLeaveRepository extends JpaRepository<EmployeeLeave, UUID> {
    @Query(value = """
select l from EmployeeLeave l 
where lower(l.employee.fullName) like lower(concat('%',:filter,'%'))
and l.status in :leaveStatus
and l.type in :leaveTypes
""",
            countQuery = """
select count(l) from EmployeeLoan l 
where lower(l.employee.fullName) like lower(concat('%',:filter,'%'))
and l.status in :leaveStatus
and l.type in :leaveTypes
""")
    Page<EmployeeLeave> findByFilterPageable(
            @Param("filter") String filter,
            @Param("company") UUID company,
            @Param("leaveTypes") List<LeaveType> leaveTypes,
            @Param("leaveStatus") List<LeaveStatus> leaveStatus,
            Pageable pageable)

    @Query(value = "select l from EmployeeLeave l where l.employee.id = :employeeId"
    )
    List<EmployeeLeave> findByEmployeeId(@Param("id") UUID employeeId)

}
