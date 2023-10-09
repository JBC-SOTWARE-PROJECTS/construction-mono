package com.backend.gbp.graphqlservices.payroll

import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.payroll.EmployeeLoan
import com.backend.gbp.domain.payroll.PHICContribution
import com.backend.gbp.domain.payroll.enums.EmployeeLoanCategory
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.repository.payroll.EmployeeLoanRepository
import com.backend.gbp.repository.payroll.PHICContributionRepository
import com.backend.gbp.security.SecurityUtils
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import org.springframework.data.domain.Page


@TypeChecked
@Component
@GraphQLApi
@Transactional(rollbackFor = Exception.class)
class EmployeeLoanService {

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    JdbcTemplate jdbcTemplate

    @Autowired
    EmployeeLoanRepository employeeLoanRepository

    @Autowired
    EmployeeRepository employeeRepository

    @GraphQLQuery(name = "getEmployeeLoansByEmployee")
    Page<EmployeeLoan> getEmployeeLoansByEmployee(
            @GraphQLArgument(name = "employeeId") UUID employeeId,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ) {
        return employeeLoanRepository.getByEmployeePageable(employeeId, new PageRequest(page, size, Sort.Direction.ASC, "createdDate"))
    }

    @GraphQLMutation(name = "upsertEmployeeLoan")
    GraphQLResVal<EmployeeLoan> upsertEmployeeLoan(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "employeeId") UUID employeeId,
            @GraphQLArgument(name = "category") EmployeeLoanCategory category,
            @GraphQLArgument(name = "amount") BigDecimal amount,
            @GraphQLArgument(name = "description") String description

    ) {
        EmployeeLoan employeeLoan = new EmployeeLoan()
        if (id)
            employeeLoan = employeeLoanRepository.findById(id).get()
        employeeLoan.employee = employeeRepository.findById(employeeId).get()
        employeeLoan.category = category
        employeeLoan.amount = amount
        employeeLoan.description = description
        employeeLoan.company = SecurityUtils.currentCompany()
        employeeLoanRepository.save(employeeLoan)
        return new GraphQLResVal<EmployeeLoan>(employeeLoan, true, "Successfully deleted employee attendance.")

    }
}
