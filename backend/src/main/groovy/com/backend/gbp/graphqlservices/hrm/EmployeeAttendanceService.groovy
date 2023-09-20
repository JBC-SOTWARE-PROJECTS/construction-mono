package com.backend.gbp.graphqlservices.hrm

import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.hrm.EmployeeAttendance
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

//    @GraphQLQuery(name = "getAccumulatedLogsOld", description = "Get saved employee logs with computed in and out")
//    List<EmployeeAccumulatedAttendanceDto> getAccumulatedLogsOld(
//            @GraphQLArgument(name = "startDate") Instant startDate,
//            @GraphQLArgument(name = "endDate") Instant endDate,
//            @GraphQLArgument(name = "id") UUID id
//    ) {
//        if (!id || !startDate || !endDate) {
//            throw new RuntimeException("Failed to get accumulated logs.")
//        }
//
//        List<EmployeeAccumulatedAttendanceDto> accumulatedLogs = payrollTimeKeepingCalculatorService.getAccumulatedLogs(id, startDate, endDate)
//
//        return accumulatedLogs
//
//    }

//    @GraphQLQuery(name = "getAccumulatedLogs", description = "Get saved employee logs with computed in and out")
//    List<AccumulatedLogSummary> getAccumulatedLogs(
//            @GraphQLArgument(name = "startDate") Instant startDate,
//            @GraphQLArgument(name = "endDate") Instant endDate,
//            @GraphQLArgument(name = "id") UUID id
//    ) {
//        if (!id || !startDate || !endDate) {
//            throw new RuntimeException("Failed to get accumulated logs.")
//        }
//
//        List<AccumulatedLogSummary> accumulatedLogs = timeKeepingCalculatorService.getAccumulatedLogs(id, startDate, endDate)
//
//        return accumulatedLogs
//
//    }

//    @GraphQLQuery(name = "getEmployeePerformanceSummaryOld", description = "Compute the employee's performance summary")
//    EmployeeAccumulatedAttendanceDto getEmployeePerformanceSummaryOld(
//            @GraphQLArgument(name = "startDate") Instant startDate,
//            @GraphQLArgument(name = "endDate") Instant endDate,
//            @GraphQLArgument(name = "id") UUID id
//    ) {
//        if (!id || !startDate || !endDate) throw new RuntimeException("Failed to get accumulated logs.")
//        EmployeeAccumulatedAttendanceDto employeePerfSummary = payrollTimeKeepingCalculatorService.getEmployeePerformanceSummary(id, startDate, endDate)
//
//        return employeePerfSummary
//    }
//
//    @GraphQLQuery(name = "getEmployeePerformanceSummary", description = "Compute the employee's performance summary")
//    EmployeeAccumulatedAttendanceDto getEmployeePerformanceSummary(
//            @GraphQLArgument(name = "startDate") Instant startDate,
//            @GraphQLArgument(name = "endDate") Instant endDate,
//            @GraphQLArgument(name = "id") UUID id
//    ) {
//        if (!id || !startDate || !endDate) throw new RuntimeException("Failed to get accumulated logs.")
//        EmployeeAccumulatedAttendanceDto employeePerfSummary = timeKeepingCalculatorService.getEmployeePerformanceSummary(id, startDate, endDate)
//
//        return employeePerfSummary
//    }

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
            @GraphQLArgument(name = "fields") Map<String, Object> fields
    ) {
        if (!employee) return new GraphQLResVal<EmployeeAttendance>(null, false, "Failed to ${id ? 'update' : 'create'} employee attendance.")
        if (id) {
            EmployeeAttendance selectedAttendance = employeeAttendanceRepository.findById(id).get()
            EmployeeAttendance attendance = objectMapper.updateValue(selectedAttendance, fields)
            Employee selectedEmployee = employeeRepository.findById(employee).get()
            attendance.employee = selectedEmployee
            attendance = employeeAttendanceRepository.save(attendance)
            return new GraphQLResVal<EmployeeAttendance>(attendance, true, "Successfully updated employee attendance.")
        } else {
            EmployeeAttendance attendance = objectMapper.convertValue(fields, EmployeeAttendance)
            Employee selectedEmployee = employeeRepository.findById(employee).get()
            attendance.employee = selectedEmployee
            attendance.original_attendance_time = attendance.attendance_time
            attendance.originalType = attendance.type
            attendance = employeeAttendanceRepository.save(attendance)
            return new GraphQLResVal<EmployeeAttendance>(attendance, true, "Successfully created employee attendance.")
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

    //===========================MUTATION=============================\\
}
