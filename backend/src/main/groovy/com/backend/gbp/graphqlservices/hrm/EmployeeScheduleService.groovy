package com.backend.gbp.graphqlservices.hrm

import com.backend.gbp.domain.Authority
import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.User
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.hrm.EmployeeSchedule
import com.backend.gbp.domain.hrm.Schedule
import com.backend.gbp.domain.hrm.ScheduleLock
import com.backend.gbp.domain.projects.Projects
import com.backend.gbp.graphqlservices.CompanySettingsService
import com.backend.gbp.graphqlservices.projects.ProjectService
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.*
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.repository.hrm.EmployeeScheduleRepository
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
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter
import java.util.function.Consumer
import java.util.function.Predicate

class EmployeeScheduleDto {
    UUID id
    String fullName
    String position
    UUID employeeId
    Map<String, List<Map<String, Object>>> schedule
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

@TypeChecked
@Component
@GraphQLApi
class EmployeeScheduleService {

    @Autowired
    private UserRepository userRepository

    @Autowired
    private EmployeeRepository employeeRepository

    @Autowired
    EmployeeScheduleRepository employeeScheduleRepository

    @Autowired
    PositionRepository positionRepository

    @Autowired
    JdbcTemplate jdbcTemplate

    @Autowired
    GeneratorService generatorService

    @Autowired
    ProjectService projectService

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    PasswordEncoder passwordEncoder

    @Autowired
    PermissionRepository permissionRepository

    @Autowired
    AuthorityRepository authorityRepository

    @Autowired
    CompanySettingsService companySettingsService

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

        Map<String, Map<String, List<Map<String, Object>>>> employeeMap = new HashMap<>() // Initialize employeeMap

        String formattedStringIds = "(${employeeIds.collect { "'${it.toString()}'" }.join(', ')})"

        List<Map<String, Object>> results = jdbcTemplate.queryForList("""
    Select e.id, concat(e.first_name, ' ', e.last_name) as full_name, s.id as schedule_id, s.*  from hrm.employee_schedule s
    left join hrm.employees e on e.id = s.employee
    where s.employee in ${formattedStringIds}
    AND s.date_time_start >= '${startDate.toString()}'
    AND s.date_time_start <= '${endDate.toString()}'

    """)

        results.each {
            String empId = it['id'].toString()
            Timestamp timestamp = (Timestamp) it['date_time_start'];
            LocalDateTime dateTimeStart = timestamp.toLocalDateTime();


            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM_dd_yyyy")
            String date = formatter.format(dateTimeStart)

            if (!employeeMap.containsKey(empId)) {
                Map<String, List<Map<String, Object>>> dateMap = new HashMap<>();  // Initialize dateMap
                dateMap.put(date, [it]);  // Initialize the list with the current map
                employeeMap.put(empId, dateMap);
            } else {
                Map<String, List<Map<String, Object>>> dateMap = employeeMap.get(empId) as Map<String, List<Map<String, Object>>>;
                List<Map<String, Object>> dateArr = dateMap.getOrDefault(date, []);
                dateArr.add(it);
                dateMap.put(date, dateArr);
            }
        }


        List<EmployeeScheduleDto> employeeSchedules = []
        employeeList.each {
            EmployeeScheduleDto employee = new EmployeeScheduleDto()
            Map<String, List<Map<String, Object>>> dateMap = employeeMap.get(it.id.toString()) as Map<String, List<Map<String, Object>>>;

            employee.id = it.id
            employee.schedule = dateMap
            employee.fullName = it.fullName
            employee.position = it.position.description

            employeeSchedules.push(employee)

        }

        employeeSchedules
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
            @GraphQLArgument(name = "dates") List<String> dates = [],
            @GraphQLArgument(name = "isOverTime") Boolean isOverTime = false

    ) {
        if (dates?.size() > 0) {
            CompanySettings company = SecurityUtils.currentCompany()

            List<EmployeeSchedule> scheduleList = []
            List<Employee> employeeList = employeeRepository.findAllById(employeeIdList)

            def dateFormatter = new SimpleDateFormat('yyyy-MM-dd')

            List<String> trimmedDates = []
            dates.each {
                trimmedDates.push(it.substring(0, 10))
            }

            employeeList.each { Employee employee ->
                List<EmployeeSchedule> all = employeeScheduleRepository.findAll()

                List<EmployeeSchedule> employeeSchedules = employeeScheduleRepository.getRegularSchedules(trimmedDates, employee.id)

                trimmedDates.each { String date ->

                    EmployeeSchedule employeeSchedule = null
                    Predicate<EmployeeSchedule> filterPredicate = { EmployeeSchedule it -> it.dateString == date }
                    Consumer<EmployeeSchedule> consumer = { EmployeeSchedule it -> employeeSchedule = it }

                    employeeSchedules.stream()
                            .filter(filterPredicate)
                            .findFirst()
                            .ifPresent(consumer)

                    if (employeeSchedule == null)
                        employeeSchedule = objectMapper.convertValue(fields, EmployeeSchedule)
                    else
                        employeeSchedule = objectMapper.updateValue(employeeSchedule, fields)

                    employeeSchedule.dateTimeStart = Instant.parse(date + (fields.get('dateTimeStart') as String).substring(10))
                    employeeSchedule.dateTimeEnd = Instant.parse(date + (fields.get('dateTimeEnd') as String).substring(10))
                    employeeSchedule.mealBreakStart = Instant.parse(date + (fields.get('mealBreakStart') as String).substring(10))
                    employeeSchedule.mealBreakEnd = Instant.parse(date + (fields.get('mealBreakEnd') as String).substring(10))
                    employeeSchedule.employee = employee
                    employeeSchedule.company = company
                    employeeSchedule.dateString = date
                    employeeSchedule.project = projectService.findOne(UUID.fromString(fields.get('project_id') as String))
                    scheduleList.push(employeeSchedule)

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
            employeeSchedule.dateString = (fields.get('dateTimeStart') as String).substring(0, 10)
            employeeSchedule.employee = employeeRepository.findById(employeeId).get()
            employeeSchedule.company = SecurityUtils.currentCompany()
            employeeSchedule.project = projectService.findOne(UUID.fromString(fields.get('project_id') as String))
            employeeScheduleRepository.save(employeeSchedule)

        }


        return new GraphQLResVal<String>('Success', true, "Successfully created department schedule")
    }


    //Utility methods
}
