package com.backend.gbp.graphqlservices.payroll

import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.payroll.EmployeeLoan
import com.backend.gbp.domain.payroll.EmployeeLoanLedgerItem
import com.backend.gbp.domain.payroll.PHICContribution
import com.backend.gbp.domain.payroll.enums.EmployeeLoanCategory
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.repository.payroll.EmployeeLoanLedgerItemRepository
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
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional
import org.springframework.data.domain.Page

import java.sql.Timestamp
import java.time.Instant

class EmployeeLoanLedgerDto {
    UUID id
    BigDecimal debit
    BigDecimal credit
    BigDecimal runningBalance
    String description
    String category
    Instant createdDate

}


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
    EmployeeLoanLedgerItemRepository employeeLoanLedgerItemRepository

    @Autowired
    EmployeeRepository employeeRepository


    // -------------------------------- Query --------------------------------
    @GraphQLQuery(name = "getEmployeeLoansByEmployee")
    Page<EmployeeLoan> getEmployeeLoansByEmployee(
            @GraphQLArgument(name = "employeeId") UUID employeeId,
            @GraphQLArgument(name = "category") EmployeeLoanCategory category,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ) {
        return employeeLoanRepository.getByEmployeePageable(employeeId, category, new PageRequest(page, size, Sort.Direction.ASC, "createdDate"))
    }

    @GraphQLQuery(name = "getEmployeeLoanLedger")
    Page<EmployeeLoanLedgerDto> getEmployeeLoanLedger(
            @GraphQLArgument(name = "employeeId") UUID employeeId,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ) {

        def ledgerRaw = jdbcTemplate.queryForList("""
SELECT
    id,
    debit,
    credit,
    SUM(debit - credit) OVER (ORDER BY created_date) AS running_balance,
    description,
    category,
    created_date + interval '8 hours' as created_date
FROM
    payroll.employee_loan_ledger_item
WHERE employee = '${employeeId}'
ORDER BY
    created_date ASC
limit ${size} offset ${size * page}    
    ;
""")
        def count = jdbcTemplate.queryForObject("""
SELECT
count(*)
FROM
    payroll.employee_loan_ledger_item
WHERE employee = '${employeeId}'
limit ${size} offset ${size * page}   
""", Long.class)
        List<EmployeeLoanLedgerDto> ledgerItems = []
        ledgerRaw.each {
            EmployeeLoanLedgerDto item = new EmployeeLoanLedgerDto()
            item.id = it.get('id') as UUID
            item.debit = it.get('debit') as BigDecimal
            item.credit = it.get('credit') as BigDecimal
            item.runningBalance = it.get('running_balance') as BigDecimal
            item.description = it.get('description') as String
            item.category = it.get('category') as String
            item.createdDate = (it.get('created_date') as Timestamp).toInstant()

            ledgerItems.push(item)
        }

        return new PageImpl<EmployeeLoanLedgerDto>(ledgerItems.reverse(), PageRequest.of(page, size),
                count)

    }


    // -------------------------------- Mutation --------------------------------
    @GraphQLMutation(name = "upsertEmployeeLoan")
    GraphQLResVal<EmployeeLoan> upsertEmployeeLoan(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "employeeId") UUID employeeId,
            @GraphQLArgument(name = "category") EmployeeLoanCategory category,
            @GraphQLArgument(name = "amount") BigDecimal amount,
            @GraphQLArgument(name = "description") String description

    ) {
        EmployeeLoan employeeLoan = new EmployeeLoan()
        if (id) {
            employeeLoan = employeeLoanRepository.findById(id).get()
        }
        employeeLoan.employee = employeeRepository.findById(employeeId).get()
        employeeLoan.category = category
        employeeLoan.amount = amount
        employeeLoan.description = description
        employeeLoan.company = SecurityUtils.currentCompany()
        employeeLoan.status = true
        employeeLoanRepository.save(employeeLoan)


        EmployeeLoanLedgerItem ledgerItem = new EmployeeLoanLedgerItem()
        ledgerItem.employeeLoan = employeeLoan
        ledgerItem.employee = employeeLoan.employee
        ledgerItem.debit = amount
        ledgerItem.credit = 0
        ledgerItem.category = category
        ledgerItem.company = employeeLoan.company
        ledgerItem.description = description
        ledgerItem.status = true
        employeeLoanLedgerItemRepository.save(ledgerItem)
        return new GraphQLResVal<EmployeeLoan>(employeeLoan, true, "Successfully deleted employee attendance.")

    }
}
