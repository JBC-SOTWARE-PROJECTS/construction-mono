package com.backend.gbp.repository.payroll

import com.backend.gbp.domain.hrm.EmployeeLeave
import com.backend.gbp.domain.hrm.SelectedDate
import com.backend.gbp.domain.hrm.enums.LeaveStatus
import com.backend.gbp.domain.hrm.enums.LeaveType
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

import java.time.Instant

interface EmployeeLeaveDto {
    UUID getId()

    String getReason()

    LeaveType getType()

    LeaveStatus getStatus()

    List<SelectedDate> getDates()

    Boolean getWithPay()

    Instant getCreatedDate()

    String getFullName()

    String getEmployeeId()
}

interface EmployeeLeaveRepository extends JpaRepository<EmployeeLeave, UUID> {
    @Query(value = """
select 
l.id as id,
l.reason as reason,
l.type as type,
l.status as status,
l.dates as dates,
l.withPay as withPay,
l.createdDate as createdDate,
e.id as employeeId,
e.fullName as fullName,
e.firstName as firstName,  
e.lastName as lastName,  
e.middleName as middleName,  
e.nameSuffix as nameSuffix
from EmployeeLeave l 
left join  l.employee e
where lower(e.fullName) like lower(concat('%',:filter,'%'))
AND (CASE WHEN :office = '' THEN CAST(e.office.id as text) ELSE :office END)  = CAST(e.office.id as text)
AND (CASE WHEN :position = '' THEN CAST(e.position.id as text) ELSE :position END)  = CAST(e.position.id as text)
and l.status in :leaveStatus
and l.type in :leaveTypes
and l.company.id = :company
GROUP BY l.id, e.fullName, e.firstName, e.lastName, e.middleName, e.nameSuffix,l.reason,
l.type,
l.status,
l.dates,
l.withPay,
l.createdDate,
e.id,
e.fullName
""",
            countQuery = """
select count(l.id) from EmployeeLeave l 
left join  l.employee e
where lower(e.fullName) like lower(concat('%',:filter,'%'))
AND (CASE WHEN :office = '' THEN CAST(e.office.id as text) ELSE :office END)  = CAST(e.office.id as text)
AND (CASE WHEN :position = '' THEN CAST(e.position.id as text) ELSE :position END)  = CAST(e.position.id as text)
and l.status in :leaveStatus
and l.type in :leaveTypes
and l.company.id = :company
GROUP BY l.id
""")
    Page<EmployeeLeaveDto> findByFilterPageable(
            @Param("filter") String filter,
            @Param("company") UUID company,
            @Param("leaveTypes") List<LeaveType> leaveTypes,
            @Param("leaveStatus") List<LeaveStatus> leaveStatus,
            @Param("office") String office,
            @Param("position") String position,
            Pageable pageable)

    @Query(value = "select l from EmployeeLeave l where l.employee.id = :employeeId"
    )
    List<EmployeeLeave> findByEmployeeId(@Param("employeeId") UUID employeeId)

}
