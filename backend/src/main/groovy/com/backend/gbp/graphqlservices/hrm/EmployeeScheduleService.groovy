package com.backend.gbp.graphqlservices.hrm

import com.backend.gbp.domain.Authority
import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.Office
import com.backend.gbp.domain.User
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.hrm.EmployeeSchedule
import com.backend.gbp.domain.hrm.Schedule
import com.backend.gbp.domain.hrm.ScheduleLock
import com.backend.gbp.domain.hrm.dto.ScheduleDto
import com.backend.gbp.domain.projects.Projects
import com.backend.gbp.graphqlservices.CompanySettingsService
import com.backend.gbp.graphqlservices.projects.ProjectService
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.*
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.repository.hrm.EmployeeScheduleRepository
import com.backend.gbp.repository.projects.ProjectsRepository
import com.backend.gbp.security.SecurityUtils
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.GeneratorType
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component

import javax.transaction.Transactional
import java.sql.Timestamp
import java.sql.Types
import java.text.SimpleDateFormat
import java.time.Duration
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit
import java.util.function.Consumer
import java.util.function.Predicate

class EmployeeScheduleDto {
    UUID id
    String fullName
    String position
    UUID employeeId
    Map<String, List<ScheduleDto>> schedule
}

class EmployeeScheduleDetailsDto {
    UUID id
    String fullName
    String position
    UUID employeeId
    String dateString
    EmployeeSchedule regularSchedule
    EmployeeSchedule overtimeSchedule
    Projects project
}

enum OvertimeType {
    FLEXIBLE, FIXED
}

class DateWithSchedule {
    Instant dateTimeStart;
    Instant dateTimeEnd;
    Instant mealBreakStart;
    Instant mealBreakEnd;
    Instant overtimeStart;
    Instant overtimeEnd;
    String dateString;
    OvertimeType overtimeType;
}

@TypeChecked
@Component
@GraphQLApi
class EmployeeScheduleService {

    @Autowired
    private EmployeeRepository employeeRepository

    @Autowired
    EmployeeScheduleRepository employeeScheduleRepository

    @Autowired
    ProjectsRepository projectsRepository

    @Autowired
    JdbcTemplate jdbcTemplate

    @Autowired
    ProjectService projectService

    @Autowired
    ObjectMapper objectMapper

    //============== All Queries =====================

    @GraphQLQuery(name = "getEmployeeScheduleByFilter", description = "Search employees")
    List<EmployeeScheduleDto> getEmployeeScheduleByFilter(
//            @GraphQLArgument(name = "filter") String filter,
@GraphQLArgument(name = "startDate") Instant startDate,
@GraphQLArgument(name = "endDate") Instant endDate,
@GraphQLArgument(name = "filter") String filter = '',
@GraphQLArgument(name = "position") UUID position,
@GraphQLArgument(name = "office") UUID office


    ) {
        List<Employee> employeeList = employeeRepository.findByFilterPositionOffice(
                filter,
                position ? position.toString() : '',
                office ? office.toString() : '')
        List<UUID> employeeIds = []

        employeeList.each {
            employeeIds.push((it.id))
        }


        String formattedStringIds = "(${employeeIds.collect { "'${it.toString()}'" }.join(', ')})"

        List<Map<String, Object>> results = jdbcTemplate.queryForList("""
    Select e.id as emp_id, concat(e.first_name, ' ', e.last_name) as full_name, s.id , s.*  from hrm.employee_schedule s
    left join hrm.employees e on e.id = s.employee
    where s.employee in ${formattedStringIds}
    AND s.date_time_start >= '${startDate.toString()}'
    AND s.date_time_start <= '${endDate.toString()}'

    """)
        return transformEmployeeSchedule(results, employeeList)

    }

    List<EmployeeScheduleDto> transformEmployeeSchedule(List<Map<String, Object>> results, List<Employee> employeeList) {

        Map<String, Map<String, List<ScheduleDto>>> employeeMap = new HashMap<>() // Initialize employeeMap
        results.each {
            String empId = it['emp_id'].toString()
//            Timestamp timestamp = (Timestamp) it['date_time_start'];
            Timestamp timestamp = new Timestamp(((Timestamp) it['date_time_start']).getTime() + Duration.ofHours(8).toMillis());
            LocalDateTime dateTimeStart = timestamp.toLocalDateTime();


            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM_dd_yyyy")
            String date = formatter.format(dateTimeStart)

            if (!employeeMap.containsKey(empId)) {
                Map<String, List<ScheduleDto>> dateMap = new HashMap<>();  // Initialize dateMap
                ScheduleDto scheduleDto = objectMapper.convertValue(it, ScheduleDto)
                dateMap.put(date, [scheduleDto] as List<ScheduleDto>);
                // Initialize the list with the current map
                employeeMap.put(empId, dateMap);
            } else {
                Map<String, List<ScheduleDto>> dateMap = employeeMap.get(empId) as Map<String, List<ScheduleDto>>;
                List<ScheduleDto> dateArr = dateMap.getOrDefault(date, []);
                dateArr.add(objectMapper.convertValue(it, ScheduleDto));
                dateMap.put(date, dateArr);
            }
        }


        List<EmployeeScheduleDto> employeeSchedules = []
        employeeList.each {
            EmployeeScheduleDto employee = new EmployeeScheduleDto()
            Map<String, List<ScheduleDto>> dateMap = employeeMap.get(it.id.toString()) as Map<String, List<ScheduleDto>>;

            employee.id = it.id
            employee.schedule = dateMap
            employee.fullName = it.fullName
            employee.position = it.position.description

            employeeSchedules.push(employee)

        }

        return employeeSchedules.sort({ it.fullName })
    }


    @GraphQLQuery(name = "getEmployeeScheduleDetails", description = "Search employees")
    EmployeeScheduleDetailsDto getEmployeeScheduleDetails(
            @GraphQLArgument(name = "employeeId") UUID employeeId,
            @GraphQLArgument(name = "date") String date
    ) {

        List<EmployeeSchedule> employeeSchedules = employeeScheduleRepository.findByDateAndEmployeeId(date, employeeId)
        EmployeeScheduleDetailsDto scheduleDetails = new EmployeeScheduleDetailsDto()

        scheduleDetails.id = employeeSchedules[0].employee.id
        scheduleDetails.dateString = employeeSchedules[0].dateString
        scheduleDetails.fullName = employeeSchedules[0].employee.fullName
        scheduleDetails.position = employeeSchedules[0].employee.position.description
        scheduleDetails.project = employeeSchedules[0].project

        employeeSchedules.each {
            if (it.isOvertime) scheduleDetails.overtimeSchedule = it
            else scheduleDetails.regularSchedule = it
        }

        return scheduleDetails
    }

    //============== All Mutation ====================

    @GraphQLMutation(name = "upsertEmployeeSchedule", description = "create or update schedule config.")
    GraphQLResVal<String> upsertEmployeeSchedule(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "employeeId") UUID employeeId,
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "employeeIdList") List<UUID> employeeIdList,
            @GraphQLArgument(name = "datesWithSchedule") List<DateWithSchedule> datesWithSchedule = [],
            @GraphQLArgument(name = "overtimeProject") String overtimeProject,
            @GraphQLArgument(name = "mode") String mode // 'REGULAR', 'REGULAR_WITH_OVERTIME', 'OVERTIME'
    ) {
        if (datesWithSchedule?.size() > 0) {
            CompanySettings company = SecurityUtils.currentCompany()

            List<EmployeeSchedule> scheduleList = []
            List<Employee> employeeList = employeeRepository.findAllById(employeeIdList)

            Map<String, Projects> projectMap = new HashMap<>()
            projectsRepository.findAll().each {
                projectMap.put(it.id.toString(), it)
            }

            List<String> trimmedDates = []
            datesWithSchedule.each {
                trimmedDates.push(it.dateString)
            }

            employeeList.each { Employee employee ->
                List<EmployeeSchedule> employeeSchedules = employeeScheduleRepository.getRegularSchedules(trimmedDates, employee.id)
                List<EmployeeSchedule> overtimeSchedules = employeeScheduleRepository.getOvertimeSchedules(trimmedDates, employee.id)

                datesWithSchedule.each { DateWithSchedule date ->
                    if (['REGULAR', 'REGULAR_WITH_OVERTIME'].contains(mode)) {
                        scheduleList.push(generateEmployeeSchedule(
                                false,
                                date,
                                employeeSchedules,
                                fields,
                                employee,
                                company,
                                fields.get('project_id') ? projectMap.get(fields.get('project_id') as String) : null))
                    }
                    if (["OVERTIME", "REGULAR_WITH_OVERTIME"].contains(mode)) {
                        if (mode == 'OVERTIME' && date.overtimeType == OvertimeType.FIXED) {
                            EmployeeSchedule employeeSchedule = findExistingSchedule(date, employeeSchedules)
                            if (date.overtimeStart.isBefore(employeeSchedule.dateTimeEnd)) {
                                date.overtimeStart = employeeSchedule.dateTimeEnd
                            }
                        }
                        scheduleList.push(generateEmployeeSchedule(
                                true,
                                date,
                                overtimeSchedules,
                                fields,
                                employee,
                                company,
                                overtimeProject ? projectMap.get(overtimeProject) : null))
                    }
                }


            }
            employeeScheduleRepository.saveAll(scheduleList)

        } else {
            EmployeeSchedule employeeSchedule

            if (id) {
                employeeSchedule = employeeScheduleRepository.findById(id).get()
                employeeSchedule = objectMapper.updateValue(employeeSchedule, fields)
            } else {
                employeeSchedule = objectMapper.convertValue(fields, EmployeeSchedule)
            }
            employeeSchedule.dateString = (Instant.parse((fields.get('dateTimeStart') as String)).plus(8, ChronoUnit.HOURS)).toString().substring(0, 10)

            if (employeeSchedule.isOvertime && employeeSchedule.overtimeType == OvertimeType.FIXED) {
                EmployeeSchedule regularSchedule = employeeScheduleRepository.getRegularSchedules([employeeSchedule.dateString], employeeId)[0]
                if (regularSchedule && employeeSchedule.dateTimeStart.isBefore(regularSchedule.dateTimeEnd)) {
                    employeeSchedule.dateTimeStart = regularSchedule.dateTimeEnd
                }
            }
            employeeSchedule.employee = employeeRepository.findById(employeeId).get()
            employeeSchedule.company = SecurityUtils.currentCompany()
            employeeSchedule.project = fields.get('project_id') ? projectService.findOne(UUID.fromString(fields.get('project_id') as String)) : null
            employeeScheduleRepository.save(employeeSchedule)

        }


        return new GraphQLResVal<String>('Success', true, "Successfully created department schedule")
    }


    //Utility methods

    EmployeeSchedule generateEmployeeSchedule(
            Boolean isOvertime,
            DateWithSchedule date,
            List<EmployeeSchedule> employeeSchedules,
            Map<String, Object> fields, Employee employee,
            CompanySettings company,
            Projects project) {
        EmployeeSchedule employeeSchedule = findExistingSchedule(date, employeeSchedules)

        if (employeeSchedule == null)
            employeeSchedule = objectMapper.convertValue(fields, EmployeeSchedule)
        else
            employeeSchedule = objectMapper.updateValue(employeeSchedule, fields)

        if (isOvertime) {
            employeeSchedule.label = 'Overtime Schedule'
            employeeSchedule.title = 'Overtime Schedule'
        }

        if (isOvertime) employeeSchedule.overtimeType = date.overtimeType
        employeeSchedule.dateTimeStart = isOvertime ? date?.overtimeStart : date?.dateTimeStart
        employeeSchedule.dateTimeEnd = isOvertime ? date?.overtimeEnd : date?.dateTimeEnd
        employeeSchedule.mealBreakStart = isOvertime ? null : date?.mealBreakStart
        employeeSchedule.mealBreakEnd = isOvertime ? null : date?.mealBreakEnd
        employeeSchedule.employee = employee
        employeeSchedule.company = company
        employeeSchedule.dateString = date.dateString
        employeeSchedule.isOvertime = isOvertime
        employeeSchedule.project = project

        return employeeSchedule
    }

    static EmployeeSchedule findExistingSchedule(DateWithSchedule date, List<EmployeeSchedule> employeeSchedules) {
        EmployeeSchedule employeeSchedule = null
        Predicate<EmployeeSchedule> predicate = { EmployeeSchedule it -> it.dateString == date.dateString }
        Consumer<EmployeeSchedule> consumer = { EmployeeSchedule it ->
            employeeSchedule = it
        }
        employeeSchedules.stream()
                .filter(predicate)
                .findFirst()
                .ifPresent(consumer)
        return employeeSchedule
    }
}
