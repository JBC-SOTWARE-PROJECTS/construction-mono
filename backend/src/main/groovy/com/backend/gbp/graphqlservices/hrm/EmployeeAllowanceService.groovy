package com.backend.gbp.graphqlservices.hrm

import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.hrm.Allowance
import com.backend.gbp.domain.hrm.AllowancePackage
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.hrm.EmployeeAllowance
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.repository.hrm.AllowancePackageRepository
import com.backend.gbp.repository.hrm.AllowanceRepository
import com.backend.gbp.repository.hrm.EmployeeAllowanceRepository
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.security.SecurityUtils
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Component

@TypeChecked
@Component
@GraphQLApi


class EmployeeAllowanceService {

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    EmployeeRepository employeeRepository

    @Autowired
    AllowanceRepository allowanceRepository

    @Autowired
    AllowancePackageRepository allowancePackageRepository

    @Autowired
    EmployeeAllowanceRepository employeeAllowanceRepository

    //---------------------- Queries   ------------------------------------\\

    @GraphQLQuery(name = "getEmployeeAllowance")
    List<EmployeeAllowance> getEmployeeAllowance(
            @GraphQLArgument(name = "employeeId") UUID employeeId,
            @GraphQLArgument(name = "filter") String filter
    ) {
        return employeeAllowanceRepository.findByEmployeeId(employeeId, filter)
    }

    @GraphQLQuery(name = "getEmployeeAllowanceItemsInIds")
    List<Employee> getEmployeeAllowanceItemsInIds(
            @GraphQLArgument(name = "idList") List<UUID> idList) {
        List<Employee> employees = employeeRepository.getEmployees(idList)
        employeeAllowanceRepository.joinFetchEmployeeAllowance(idList)
        return employees
    }


    //---------------------- Mutations   ------------------------------------\\


    @GraphQLMutation(name = "upsertEmployeeAllowances")
    GraphQLResVal<String> upsertEmployeeAllowances(
            @GraphQLArgument(name = "employeeId") UUID employeeId,
            @GraphQLArgument(name = "allowancePackageId") UUID allowancePackageId
    ) {
        Employee employee = employeeRepository.findById(employeeId).get()
        AllowancePackage allowancePackage = allowancePackageRepository.findById(allowancePackageId).get()

        CompanySettings company = SecurityUtils.currentCompany()

        List<EmployeeAllowance> employeeAllowanceList = []
        allowancePackage.allowanceItems.each {
            EmployeeAllowance allowance = new EmployeeAllowance()
            allowance.employee = employee
            allowance.name = it.name
            allowance.allowanceType = it.allowanceType
            allowance.amount = it.amount
            allowance.company = company
            allowance.allowanceId = it.allowance.id
            employeeAllowanceList.push(allowance)
        }
        List<EmployeeAllowance> toDelete = getEmployeeAllowance(employeeId, "")
        employeeAllowanceList.each {
            EmployeeAllowance employeeAllowance = toDelete.find({ EmployeeAllowance current -> it.allowanceId == current.allowanceId })
            if (employeeAllowance) {
                it.amount = employeeAllowance.amount
            }
        }
        employeeAllowanceRepository.saveAll(employeeAllowanceList)
        employee.allowancePackageId = allowancePackageId
        employeeRepository.save(employee)

        employeeAllowanceRepository.deleteAll(toDelete)
        return new GraphQLResVal<String>('Success', true, 'Successfully Saved Employee Allowance')
    }

    @GraphQLMutation(name = "editEmployeeAllowance")
    GraphQLResVal<EmployeeAllowance> editEmployeeAllowance(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "amount") BigDecimal amount
    ) {
        EmployeeAllowance allowance = employeeAllowanceRepository.findById(id).get()
        allowance.amount = amount
        employeeAllowanceRepository.save(allowance)
        return new GraphQLResVal<EmployeeAllowance>(allowance, true, 'Successfully Saved')
    }


}

