package com.backend.gbp.graphqlservices.hrm

import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.assets.VehicleUsageMonitoring
import com.backend.gbp.graphqlservices.CompanySettingsService
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.repository.AuthorityRepository
import com.backend.gbp.repository.OfficeRepository
import com.backend.gbp.repository.PermissionRepository
import com.backend.gbp.repository.PositionRepository
import com.backend.gbp.repository.UserRepository
import com.backend.gbp.repository.hrm.EmployeeBasicDetails
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.security.HISUser
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.GeneratorType
import com.fasterxml.jackson.databind.ObjectMapper
import com.backend.gbp.domain.Authority
import com.backend.gbp.domain.User

import com.backend.gbp.domain.hrm.Employee
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.security.core.GrantedAuthority
import org.springframework.security.core.authority.SimpleGrantedAuthority
import org.springframework.security.crypto.password.PasswordEncoder
import org.springframework.stereotype.Component

import javax.transaction.Transactional

@TypeChecked
@Component
@GraphQLApi
class EmployeeService  {



    @Autowired
    private UserRepository userRepository

    @Autowired
    private EmployeeRepository employeeRepository

    @Autowired
    OfficeRepository officeRepository


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

    //============== All Queries ====================

    @GraphQLQuery(name = "employees", description = "Get All Employees")
    List<Employee> findAll() {
        employeeRepository.findAll().sort { it.lastName }
    }

    @GraphQLQuery(name = "getAllEmployeesBasic", description = "Get All Employees")
    List<EmployeeBasicDetails> getAllEmployeesBasic(@GraphQLArgument(name = "filter") String filter,
                                                    @GraphQLArgument(name = "position") UUID position,
                                                    @GraphQLArgument(name = "office") UUID office
    ) {
        employeeRepository.getAllEmployeesBasic(
                filter,
                position ? position.toString() : '',
                office ? office.toString() : ''
        ).sort { it.fullName }
    }

    @GraphQLQuery(name = "searchEmployees", description = "Search employees")
    List<Employee> searchEmployees(@GraphQLArgument(name = "filter") String filter) {
        employeeRepository.searchEmployees(filter).sort { it.lastName }
    }

    @GraphQLQuery(name = "employeeById", description = "get employee by id")
    Employee employeeById(@GraphQLArgument(name = "id") UUID id) {
        return id ? employeeRepository.findById(id).get() : null
    }


    @GraphQLQuery(name = "searchEmployeesByRole", description = "Search employees by role")
    List<Employee> searchEmployeesByRole(
            @GraphQLArgument(name = "role") String role,
            @GraphQLArgument(name = "filter") String filter) {
        List<Employee> empList = employeeRepository.searchEmployees(filter).sort { it.lastName }
        List<Employee> finalList = []
        empList.each { it ->

            if (it.user) {
                List<Authority> empRoles = it.user.authorities

                if (role.contains("NON_ATTENDING_PHYSICIAN")) {
                    empRoles.each { er ->
                        if (!role.contains(er["name"] as String) && !finalList.contains(it)) {
                            finalList.add(it as Employee)
                        }
                    }
                } else {
                    empRoles.each { er ->
                        if (role.contains(er["name"] as String) && !finalList.contains(it)) {
                            finalList.add(it as Employee)
                        }
                    }
                }
            }
        }

        return finalList
    }


    @GraphQLQuery(name = "employee", description = "Get Employee By Id")
    Employee findById(@GraphQLArgument(name = "id") UUID id) {

        return id ? employeeRepository.findById(id).get() : null
    }

    //============== All Mutations ====================

    @GraphQLMutation
    @Transactional
    Employee upsertEmployee(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "authorities") Set<String> authorities,
            @GraphQLArgument(name = "permissions") Set<String> permissions,
            @GraphQLArgument(name = "officeId") UUID officeId,
            @GraphQLArgument(name = "position") UUID position,
            @GraphQLArgument(name = "company") UUID company
    ) {
        if (id) {
            Employee employee = employeeRepository.findById(id).get()
            objectMapper.updateValue(employee, fields)
            User user = new User()

            if (!employee.user) {
                if (fields.get("login") && fields.get("password")) {
                    user.login = fields["login"].toString().toLowerCase()
                    user.password = passwordEncoder?.encode(fields["password"] as String)
                    user.firstName = fields["firstName"]
                    user.lastName = fields["lastName"]
                    user.email = fields["login"].toString().toLowerCase() + "@hismkii.com"
                    user.activated = true
                    user.langKey = "en"
                    user = userRepository.save(user)
                }

                if (user.id) {
                    employee.user = user
                }
            }

            if (employee.user && employee.user.id) {
                // make sure that user is created above and monitored by hibernate

                employee.user.authorities.clear()
                if (authorities) {
                    authorities.each { auth ->
                        def a = authorityRepository.findOneByName(auth)
                        if (a)
                            employee.user.authorities.add(a)
                    }

                }

                employee.user.permissions.clear()
                if (permissions) {
                    permissions.each { p ->
                        def pm = permissionRepository.findAll().find { it.name == p }

                        if (pm)
                            employee.user.permissions.add(pm)
                    }
                }
                employee.user.login = fields["login"].toString().toLowerCase()
                userRepository.save(employee.user)

            }

            employee.office = officeRepository.findById(officeId).get()
            employee.position = positionRepository.findById(position).get()
            employee.currentCompany = companySettingsService.comById(company)
            employee.dob = employee.dob ? employee.dob.plusDays(1) : null;

            return employeeRepository.save(employee)
        } else {
            Employee employee = objectMapper.convertValue(fields, Employee)

            employee.isActive = true
            employee.office = officeRepository.findById(officeId).get()
            employee.position = positionRepository.findById(position).get()
            employee.dob = employee.dob.plusDays(1)
            employee.currentCompany = companySettingsService.comById(company)
            employee.employeeNo = "EMP" + generatorService.getNextValue(GeneratorType.EMPLOYEE_NO) { Long no ->
                StringUtils.leftPad(no.toString(), 6, "0")
            }

            return employeeRepository.save(employee)
        }
    }

    @GraphQLMutation
    @Transactional
    Employee upsertMobileData(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "fields") Map<String, Object> fields
    ) {
        if (id) {
            Employee employee = employeeRepository.findById(id).get()
            objectMapper.updateValue(employee, fields)

            return employeeRepository.save(employee)
        } else {

            return new Employee();
        }
    }

    @GraphQLMutation(name = "employeeUpdateStatus")
    @Transactional
    Employee employeeUpdateStatus(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "status") Boolean status
    ) {
        Employee employee = employeeRepository.findById(id).get()
        employee.isActive = status
        employeeRepository.save(employee)
    }

    @GraphQLMutation(name = "changeCompany")
    @Transactional
    Employee changeCompany(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "company") UUID company
    ) {
        Employee employee = employeeRepository.findById(id).get()
        CompanySettings newCompany = companySettingsService.comById(company)
        employee.currentCompany = newCompany
        return employeeRepository.save(employee)

    }

    @GraphQLQuery(name = "isPinCodeUnique", description = "Check if pincode exists")
    Boolean isPinCodeUnique(@GraphQLArgument(name = "pinCode") String pinCode) {
        return !employeeRepository.findOneByPinCode(pinCode.toLowerCase())
    }

    @GraphQLQuery(name = "employeeByPinCode", description = "Get Employee By Pin Code")
    Employee findByPinCode(@GraphQLArgument(name = "pinCode") String pinCode) {
        return employeeRepository.findOneByPinCode(pinCode.toLowerCase())
    }
}
