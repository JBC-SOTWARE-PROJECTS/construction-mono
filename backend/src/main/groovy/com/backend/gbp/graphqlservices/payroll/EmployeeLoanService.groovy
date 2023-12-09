package com.backend.gbp.graphqlservices.payroll

import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.accounting.HeaderLedger
import com.backend.gbp.domain.accounting.JournalType
import com.backend.gbp.domain.accounting.LedgerDocType
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.hrm.dto.EmployeeLoanConfig
import com.backend.gbp.domain.payroll.EmployeeLoan
import com.backend.gbp.domain.payroll.EmployeeLoanLedgerItem
import com.backend.gbp.domain.payroll.PHICContribution
import com.backend.gbp.domain.payroll.Payroll
import com.backend.gbp.domain.payroll.enums.AccountingEntryType
import com.backend.gbp.domain.payroll.enums.EmployeeLoanCategory
import com.backend.gbp.domain.payroll.enums.PayrollStatus
import com.backend.gbp.graphqlservices.accounting.ArInvoiceServices
import com.backend.gbp.graphqlservices.accounting.IntegrationServices
import com.backend.gbp.graphqlservices.accounting.LedgerServices
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
import java.time.ZoneId
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter

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

    @Autowired
    IntegrationServices integrationServices

    @Autowired
    LedgerServices ledgerServices

    @Autowired
    ArInvoiceServices arInvoiceServices


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

    @GraphQLQuery(name = "getEmployeeLoanConfig")
    EmployeeLoanConfig getEmployeeLoanConfig(
            @GraphQLArgument(name = "id") UUID id
    ) {
        employeeRepository.findById(id).get().employeeLoanConfig
    }

    @GraphQLQuery(name = "useGetLoanBalance")
    BigDecimal getLoanBalance(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "category") EmployeeLoanCategory category

    ) {
        employeeLoanLedgerItemRepository.getBalanceByCategory(id, category)
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

        postToLedgerAccounting(employeeLoan)
        return new GraphQLResVal<EmployeeLoan>(employeeLoan, true, "Successfully created employee loan.")
    }

    @GraphQLMutation(name = "upsertEmployeeLoanConfig")
    GraphQLResVal<String> upsertEmployeeLoanConfig(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "config") EmployeeLoanConfig config

    ) {
        Employee employee = employeeRepository.findById(id).get()
        employee.employeeLoanConfig = config
        employeeRepository.save(employee)
        return new GraphQLResVal<String>('success', true, "Successfully updated employee loan configuration.")

    }

    @Transactional(rollbackFor = Exception.class)
    EmployeeLoan postToLedgerAccounting(EmployeeLoan employeeLoan) {
        def yearFormat = DateTimeFormatter.ofPattern("yyyy")
//        def actPay = super.save(employeeLoan) as EmployeeLoan
        List<Map<String, Object>> entries = []


        Map<String, Object> debit = [:]
        debit['code'] = '116-04-0000'
        debit['debit'] = employeeLoan.amount
        debit['credit'] = 0.00
        entries.push(debit)

        Map<String, Object> credit = [:]
        credit['code'] = employeeLoan.category == EmployeeLoanCategory.CASH_ADVANCE ? '111-01-0000' : '211-02-0000'
        credit['debit'] = 0.00
        credit['credit'] = employeeLoan.amount
        entries.push(credit)


        HeaderLedger headerLedger = new HeaderLedger()
        headerLedger.transactionDate = Instant.now()
        headerLedger.transactionDateOnly = headerLedger.transactionDate.atOffset(ZoneOffset.UTC).plusHours(8).toLocalDate()
        headerLedger = arInvoiceServices.addHeaderManualEntries(headerLedger, entries)

//
//        def headerLedger = integrationServices.generateAutoEntries(employeeLoan) { it, mul ->
//            it.flagValue = "EMPLOYEE_LOAN_SETUP"
//            it.apClearingAccount = 0 //initialize
//            it.advanceToEmployees = 0 //initialize
//        }


        Map<String, String> details = [:]

        employeeLoan.details.each { k, v ->
            details[k] = v
        }

        details["LOAN_ID"] = employeeLoan.id.toString()

        headerLedger.transactionNo = ''
        headerLedger.transactionType = ''
        headerLedger.referenceType = ''
        headerLedger.referenceNo = ''

        def pHeader = ledgerServices.persistHeaderLedger(headerLedger,
                "${Instant.now().atZone(ZoneId.systemDefault()).format(yearFormat)}-${'PAYROLL_CODE'}",
                employeeLoan.description,
                "${employeeLoan.description ?: ""}",
                LedgerDocType.EL,
                JournalType.GENERAL,
                Instant.now(),
                details)

        employeeLoan.postedLedger = pHeader.id
        employeeLoan.status = PayrollStatus.FINALIZED
        employeeLoan.posted = true
        employeeLoan.postedBy = SecurityUtils.currentLogin()

        employeeLoanRepository.save(employeeLoan)

    }
}
