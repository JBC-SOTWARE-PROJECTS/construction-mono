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
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.hibernate.sql.Insert
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

import java.time.Duration

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


    //================================Query================================\\
    @GraphQLQuery(name = "getEmployeeLeaveByEmp")
    List<EmployeeLeave> getEmployeeLeaveByEmp(
            @GraphQLArgument(name = "employeeId") UUID employeeId
    ) {
        return employeeLeaveRepository.findByEmployeeId(employeeId).sort({ it.createdDate }).reverse()
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
