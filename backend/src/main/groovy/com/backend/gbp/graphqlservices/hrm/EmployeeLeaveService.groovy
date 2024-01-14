package com.backend.gbp.graphqlservices.hrm

import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.hrm.EmployeeLeave
import com.backend.gbp.domain.hrm.EmployeeSchedule
import com.backend.gbp.domain.hrm.Schedule
import com.backend.gbp.domain.hrm.SelectedDate
import com.backend.gbp.domain.hrm.enums.LeaveStatus
import com.backend.gbp.domain.hrm.enums.LeaveType
import com.backend.gbp.graphqlservices.projects.ProjectService
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.repository.hrm.EmployeeScheduleRepository
import com.backend.gbp.repository.hrm.ScheduleTypeRepository
import com.backend.gbp.repository.payroll.EmployeeLeaveDto
import com.backend.gbp.repository.payroll.EmployeeLeaveRepository
import com.backend.gbp.security.SecurityUtils
import com.fasterxml.jackson.core.type.TypeReference
import com.fasterxml.jackson.databind.JavaType
import com.fasterxml.jackson.databind.ObjectMapper
import com.fasterxml.jackson.databind.type.CollectionType
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.hibernate.sql.Insert
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

import java.time.Duration
import java.time.Instant


class EmployeeLeaveDtoBasic {
    UUID id
    String reason;
    LeaveType type
    LeaveStatus status;
    List<SelectedDate> dates
    Boolean withPay
}

class EmployeeLeaveWithCount {
    Page<EmployeeLeaveDtoBasic> data
    Integer dateCount
}

@TypeChecked
@Component
@GraphQLApi
class EmployeeLeaveService {

    @Autowired
    EmployeeLeaveRepository employeeLeaveRepository

    @Autowired
    EmployeeRepository employeeRepository

    @Autowired
    EmployeeScheduleRepository employeeScheduleRepository

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    JdbcTemplate jdbcTemplate

    //================================Query================================\\
    @GraphQLQuery(name = "getEmployeeLeaveByEmp")
    EmployeeLeaveWithCount getEmployeeLeaveByEmp(
            @GraphQLArgument(name = "employeeId") UUID employeeId,
            @GraphQLArgument(name = "size") Integer size,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "startDate") Instant startDate,
            @GraphQLArgument(name = "endDate") Instant endDate
    ) {

        String startDateTime = (startDate.toEpochMilli() / 1000.0).toString()
        String endDateTime = (endDate.toEpochMilli() / 1000.0).toString()

        def leavesRaw = jdbcTemplate.queryForList("""
SELECT DISTINCT e.*
FROM hrm.employee_leave e,
     LATERAL JSONB_ARRAY_ELEMENTS(e.dates) AS d
WHERE CAST(d->>'startDatetime' AS double precision) BETWEEN ${startDateTime} AND ${endDateTime}
AND e.employee =  '${employeeId}'
limit ${size} offset ${size * page}  
    ;
""")
        def count = jdbcTemplate.queryForObject("""
SELECT  count(DISTINCT e.id)
FROM hrm.employee_leave e,
     LATERAL JSONB_ARRAY_ELEMENTS(e.dates) AS d
WHERE CAST(d->>'startDatetime' AS double precision) BETWEEN ${startDateTime} AND ${endDateTime}
AND e.employee =  '${employeeId}'
limit ${size} offset ${size * page}  
""", Long.class)

        def countDates = jdbcTemplate.queryForObject("""
SELECT 
count (d)
FROM hrm.employee_leave e,
     LATERAL JSONB_ARRAY_ELEMENTS(e.dates) AS d
WHERE CAST(d->>'startDatetime' AS double precision) BETWEEN ${startDateTime} AND ${endDateTime}
AND e.employee =  '${employeeId}'
""", Long.class)

        List<EmployeeLeaveDtoBasic> employeeLeaves = []
        leavesRaw.each {
            EmployeeLeaveDtoBasic item = new EmployeeLeaveDtoBasic()
            item.id = it.get('id') as UUID
            item.reason = it.get('reason') as String
            item.type = it.get('leave_type') as LeaveType
            item.withPay = it.get('with_pay') as Boolean
            item.status = it.get('status') as LeaveStatus

            String jsonString = it.get('dates') as String
            CollectionType listType = objectMapper.getTypeFactory().constructCollectionType(List, SelectedDate)
            List<SelectedDate> selectedDates = objectMapper.readValue(jsonString, listType) as List<SelectedDate>
            item.dates = selectedDates
            employeeLeaves.push(item)
        }

        Page pageRes = (new PageImpl<EmployeeLeaveDtoBasic>(employeeLeaves.reverse(), PageRequest.of(page, size),
                count))
        EmployeeLeaveWithCount returnVal = new EmployeeLeaveWithCount()
        returnVal.data = pageRes
        returnVal.dateCount = countDates.toInteger()
        return returnVal
    }

    @GraphQLQuery(name = "getEmployeeLeavePageable")
    Page<EmployeeLeaveDto> getEmployeeLeavePageable(
            @GraphQLArgument(name = "size") Integer size,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "leaveTypes") List<LeaveType> leaveTypes,
            @GraphQLArgument(name = "position") UUID position,
            @GraphQLArgument(name = "office") UUID office,
            @GraphQLArgument(name = "status") List<LeaveStatus> status
    ) {

        employeeLeaveRepository.findByFilterPageable(filter,
                SecurityUtils.currentCompanyId(),
                leaveTypes.size() > 0 ? leaveTypes : LeaveType.values().toList(),
                status.size() > 0 ? status : LeaveStatus.values().toList(),
                office ? office.toString() : '',
                position ? position.toString() : '',
                PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, 'createdDate')))
    }

    //===============================Mutation==============================\\

    @GraphQLMutation(name = "upsertEmployeeLeave")
    GraphQLResVal<EmployeeLeave> upsertEmployeeLeave(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "employeeId") UUID employeeId,
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "dates") List<SelectedDate> dates
    ) {
        EmployeeLeave leave = new EmployeeLeave()
        CompanySettings company = SecurityUtils.currentCompany()
        if (id) {
            leave = employeeLeaveRepository.findById(id).get()
            leave = objectMapper.updateValue(leave, fields)
        } else {
            leave = objectMapper.convertValue(fields, EmployeeLeave)
            leave.company = company
            leave.employee = employeeRepository.findById(employeeId).get()
        }
        leave.status = LeaveStatus.valueOf(fields.get('status') as String)
        leave.type = LeaveType.valueOf(fields.get('type') as String)

        leave.dates = dates.sort({ it.startDatetime })
        leave = employeeLeaveRepository.save(leave)
        if (leave.status == LeaveStatus.FINALIZED) {
            List<EmployeeSchedule> scheduleList = []
            List<String> dateStringList = []
            dates.each {
                dateStringList.push(((it.startDatetime + Duration.ofHours(8)).toString() as String).substring(0, 10))
            }
            List<EmployeeSchedule> toDeleteSchedules = employeeScheduleRepository.findByDateString(dateStringList, employeeId)
            employeeScheduleRepository.deleteAll(toDeleteSchedules)

            dates.each {
                EmployeeSchedule employeeSchedule = new EmployeeSchedule()

                employeeSchedule.dateTimeStart = it.startDatetime
                employeeSchedule.dateTimeEnd = it.endDatetime
                employeeSchedule.dateString = ((it.startDatetime + Duration.ofHours(8)).toString() as String).substring(0, 10)
                employeeSchedule.isLeave = true
                employeeSchedule.request = leave.id
                employeeSchedule.label = "Leave"
                employeeSchedule.title = "Leave"
                employeeSchedule.withPay = leave.withPay
                employeeSchedule.employee = leave.employee
                employeeSchedule.company = company
                scheduleList.push(employeeSchedule)
            }
            employeeScheduleRepository.saveAll(scheduleList)
        }


        return new GraphQLResVal<EmployeeLeave>(leave, true, "Successfully ${id ? "updated" : "created"} employee leave.")


    }

}
