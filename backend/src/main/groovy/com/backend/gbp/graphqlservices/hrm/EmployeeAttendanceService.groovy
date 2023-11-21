package com.backend.gbp.graphqlservices.hrm

import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.hrm.EmployeeAttendance
import com.backend.gbp.graphqlservices.projects.ProjectService
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.hrm.EmployeeAttendanceRepository
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.fasterxml.jackson.databind.ObjectMapper

import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Component

import javax.persistence.EntityManager
import javax.persistence.PersistenceContext
import javax.validation.constraints.NotNull
import java.time.Instant

@Component
@GraphQLApi
class EmployeeAttendanceService {

    @Autowired
    EmployeeAttendanceRepository employeeAttendanceRepository

    @Autowired
    EmployeeRepository employeeRepository

    @Autowired
    ProjectService projectService
//    @Autowired
//    PayrollTimeKeepingCalculatorService payrollTimeKeepingCalculatorService

//    @Autowired
//    TimeKeepingCalculatorService timeKeepingCalculatorService

    @PersistenceContext
    EntityManager entityManager

    @Autowired
    ObjectMapper objectMapper

    //============================METHODS=============================\\


    //============================METHODS=============================\\

    //=============================QUERY=============================\\

    @GraphQLQuery(name = "getSavedEmployeeAttendance", description = "Get employee Attendance saved from database.")
    Page<EmployeeAttendance> getEmployeeAttendance(
            @GraphQLArgument(name = "startDate") Instant startDate,
            @GraphQLArgument(name = "endDate") Instant endDate,
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ) {
        if (!startDate || !endDate || !id) throw new RuntimeException("Failed to get employee attendance.")
        return employeeAttendanceRepository.getEmployeeAttendance(id, startDate, endDate, new PageRequest(page, size, Sort.Direction.ASC, "attendance_time"))
    }


    @GraphQLQuery(name = "getOneRawLog")
    EmployeeAttendance getOneRawLog(
            @GraphQLArgument(name = "id") @NotNull(message = "Failed to get log") UUID id
    ) {
        EmployeeAttendance employeeAttendance = employeeAttendanceRepository.findById(id).get()
        return employeeAttendance
    }

    //=============================QUERY=============================\\

    //===========================MUTATION=============================\\

    @GraphQLMutation(name = "upsertEmployeeAttendance")
    GraphQLResVal<EmployeeAttendance> upsertEmployeeAttendance(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "employee") UUID employee,
            @GraphQLArgument(name = "project_id") UUID project_id,
            @GraphQLArgument(name = "fields") Map<String, Object> fields
    ) {
        if (!employee) return new GraphQLResVal<EmployeeAttendance>(null, false, "Failed to ${id ? 'update' : 'create'} employee attendance.")
        if (id) {
            EmployeeAttendance selectedAttendance = employeeAttendanceRepository.findById(id).get()
            EmployeeAttendance attendance = objectMapper.updateValue(selectedAttendance, fields)
            Employee selectedEmployee = employeeRepository.findById(employee).get()
            attendance.employee = selectedEmployee
            attendance.project = project_id ? projectService.findOne(project_id) : null
            attendance = employeeAttendanceRepository.save(attendance)
            return new GraphQLResVal<EmployeeAttendance>(attendance, true, "Successfully updated employee attendance.")
        } else {
            EmployeeAttendance attendance = objectMapper.convertValue(fields, EmployeeAttendance)
            Employee selectedEmployee = employeeRepository.findById(employee).get()
            attendance.employee = selectedEmployee
            attendance.original_attendance_time = attendance.attendance_time
            attendance.originalType = attendance.type
            attendance.project = project_id ? projectService.findOne(project_id) : null
            attendance = employeeAttendanceRepository.save(attendance)
            return new GraphQLResVal<EmployeeAttendance>(attendance, true, "Successfully created employee attendance.", attendance.id)
        }
    }

    @GraphQLMutation(name = "deleteEmployeeAttendance")
    GraphQLRetVal<String> deleteEmployeeAttendance(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if (!id) return new GraphQLRetVal<String>(null, false, "Failed to delete employee attendance.")

        EmployeeAttendance employeeAttendance = employeeAttendanceRepository.findById(id).get()
        employeeAttendanceRepository.delete(employeeAttendance)

        return new GraphQLRetVal<String>(null, true, "Successfully deleted employee attendance.")
    }

    @GraphQLMutation(name = "ignoreAttendance")
    GraphQLRetVal<String> ignoreAttendance(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if (!id) return new GraphQLRetVal<String>(null, false, "Failed to update employee attendance.")

        EmployeeAttendance employeeAttendance = employeeAttendanceRepository.findById(id).get()
        employeeAttendance.isIgnored = !employeeAttendance.isIgnored
        employeeAttendanceRepository.save(employeeAttendance)

        return new GraphQLRetVal<String>(null, true, """Successfully  ${employeeAttendance?.isIgnored ? 'ignored' : 'undo ignored'} attendance.""")
    }

    @GraphQLMutation(name = "syncAttendance")
    List<EmployeeAttendance> syncAttendance(
            @GraphQLArgument(name = "employeeAttendanceList") List<EmployeeAttendance> employeeAttendanceList
    ) {

        List<EmployeeAttendance> savedAttendance = employeeAttendanceRepository.saveAll(employeeAttendanceList);
        return savedAttendance;

    }

    //===========================MUTATION=============================\\
}
