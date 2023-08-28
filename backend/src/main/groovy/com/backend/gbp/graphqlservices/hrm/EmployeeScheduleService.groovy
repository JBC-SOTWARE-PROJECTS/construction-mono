package com.backend.gbp.graphqlservices.hrm

import com.backend.gbp.domain.Authority
import com.backend.gbp.domain.User
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.hrm.EmployeeSchedule
import com.backend.gbp.domain.hrm.Schedule
import com.backend.gbp.domain.hrm.ScheduleLock
import com.backend.gbp.graphqlservices.CompanySettingsService
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
import java.time.Instant

class EmployeeScheduleDto {
    String fullName
    String position
    Map<String, Object> scheduleMap
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
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "startDate") Instant startDate,
            @GraphQLArgument(name = "endDate") Instant endDate,
            @GraphQLArgument(name = "positionId") UUID positionId

    ) {
        List<EmployeeScheduleDto> employeeScheduleList = []


        employeeScheduleList
    }

    //============== All Mutation ====================

    @GraphQLMutation(name = "upsertEmployeeSchedule", description = "create or update schedule config.")
    GraphQLRetVal<EmployeeSchedule> upsertEmployeeSchedule(
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

        return new GraphQLRetVal<EmployeeSchedule>(employeeSchedule, true, "Successfully created department schedule")
    }
}
