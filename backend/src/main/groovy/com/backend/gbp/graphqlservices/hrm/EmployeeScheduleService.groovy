package com.backend.gbp.graphqlservices.hrm

import com.backend.gbp.domain.Authority
import com.backend.gbp.domain.User
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.hrm.EmployeeSchedule
import com.backend.gbp.domain.hrm.Schedule
import com.backend.gbp.domain.hrm.ScheduleLock
import com.backend.gbp.graphqlservices.CompanySettingsService
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
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter

class EmployeeScheduleDto {
    UUID id
    String fullName
    String position
    UUID employeeId
    Map<String, List<Map<String, Object>>> schedule
}
//class Test {
//    String fullName
//    String position
//    UUID employeeId
//    List<Map<String, Object>>
//}

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
@GraphQLArgument(name = "employeeIds") List<UUID> employeeIds

    ) {
        Map<String, Map<String, List<Map<String, Object>>>> employeeMap = new HashMap<>() // Initialize employeeMap
        List<EmployeeScheduleDto> employeeScheduleList = []
        String formattedStringIds = "(${employeeIds.collect { "'${it.toString()}'" }.join(', ')})"
        List<Map<String, Object>> results = jdbcTemplate.queryForList("""
    Select e.id, concat(e.first_name, ' ', e.last_name) as full_name, s.*  from hrm.employee_schedule s
    left join hrm.employees e on e.id = s.employee
    where s.employee = ${formattedStringIds}
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

        List<Employee> employeeList = employeeRepository.getEmployees(employeeIds)
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

    //============== All Mutation ====================

    @GraphQLMutation(name = "upsertEmployeeSchedule", description = "create or update schedule config.")
    GraphQLResVal<EmployeeSchedule> upsertEmployeeSchedule(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "employeeId") UUID employeeId,
            @GraphQLArgument(name = "fields") Map<String, Object> fields
    ) {

        EmployeeSchedule employeeSchedule
        if (id) {
            employeeSchedule = employeeScheduleRepository.findById(id).get()
            employeeSchedule = objectMapper.updateValue(employeeSchedule, fields)
        } else {
            employeeSchedule = objectMapper.convertValue(fields, EmployeeSchedule)
        }
        employeeSchedule.employee = employeeRepository.findById(employeeId).get()
        employeeSchedule.company = SecurityUtils.currentCompany()

        employeeScheduleRepository.save(employeeSchedule)
        return new GraphQLResVal<EmployeeSchedule>(employeeSchedule, true, "Successfully created department schedule")
    }
}
