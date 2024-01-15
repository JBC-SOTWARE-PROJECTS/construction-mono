package com.backend.gbp.graphqlservices.payroll

import com.backend.gbp.domain.CompanySettings

import com.backend.gbp.domain.payroll.*
import com.backend.gbp.domain.payroll.enums.EmployeeLoanCategory
import com.backend.gbp.domain.payroll.enums.PayrollEmployeeStatus
import com.backend.gbp.graphqlservices.payroll.common.AbstractPayrollEmployeeStatusService
import com.backend.gbp.graphqlservices.payroll.enums.PayrollModule
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.repository.payroll.PayrollEmployeeLoanDto
import com.backend.gbp.repository.payroll.PayrollEmployeeLoanRepository
import com.backend.gbp.repository.payroll.PayrollLoanItemRepository
import com.backend.gbp.repository.payroll.PayrollRepository
import com.backend.gbp.security.SecurityUtils
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.jdbc.core.BeanPropertyRowMapper
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Component

import javax.persistence.EntityManager
import javax.persistence.PersistenceContext


class LoanItemsDto {
    UUID employee
    EmployeeLoanCategory category
    BigDecimal amount
}

@TypeChecked
@Component
@GraphQLApi
class PayrollEmployeeLoanService extends AbstractPayrollEmployeeStatusService<PayrollEmployeeLoan> implements IPayrollEmployeeBaseOperation<PayrollEmployeeLoan> {

    final PayrollModule payrollModule = PayrollModule.LOANS

    @Autowired
    PayrollEmployeeLoanRepository payrollEmployeeLoanRepository

    @Autowired
    PayrollRepository payrollRepository

    @Autowired
    PayrollLoanItemRepository payrollLoanItemRepository

    @PersistenceContext
    EntityManager entityManager

    @Autowired
    JdbcTemplate jdbcTemplate

    private final EmployeeRepository employeeRepository

    @Autowired
    PayrollEmployeeLoanService(EmployeeRepository employeeRepository) {
        super(PayrollEmployeeLoan.class, employeeRepository)
        this.employeeRepository = employeeRepository
    }


    //=================================QUERY=================================\\

    @GraphQLQuery(name = "getPayrollEmployeeLoan", description = "Gets the loan employees by payroll id")
    Page<PayrollEmployeeLoanDto> getPayrollEmployeeLoan(
            @GraphQLArgument(name = "payroll") UUID id,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size,
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "status") List<PayrollEmployeeStatus> status
    ) {
        Payroll payroll = payrollRepository.getOne(id)
        return payrollEmployeeLoanRepository.getEmployeesPageable(
                id,
                filter,
                status.size() > 0 ? status : PayrollEmployeeStatus.values().toList(),
//                SecurityUtils.currentCompanyId(),
                PageRequest.of(page, size))
    }


    @GraphQLQuery(name = "testGetPayrollEmployeeLoan", description = "Gets the loan employees by payroll id")
    List<PayrollEmployeeLoanDto> testGetPayrollEmployeeLoan(
            @GraphQLArgument(name = "payroll") UUID id,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size,
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "status") List<PayrollEmployeeStatus> status
    ) {
        Payroll payroll = payrollRepository.getOne(id)
        return payrollEmployeeLoanRepository.test(
                id,
                filter,
                status.size() > 0 ? status : PayrollEmployeeStatus.values().toList())
    }

    //=================================MUTATIONS=================================\\


    @GraphQLMutation(name = "updatePayrollLoanItemAmount")
    GraphQLResVal<PayrollLoanItem> updatePayrollLoanItemAmount(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "amount") BigDecimal amount
    ) {
        PayrollLoanItem loanItem = payrollLoanItemRepository.findById(id).get()
        if (!loanItem) return new GraphQLResVal<PayrollLoanItem>(null, false, "Failed to update employee loan status. Please try again later!")
        else {
            loanItem.amount = amount
            payrollLoanItemRepository.save(loanItem)
            return new GraphQLResVal<PayrollLoanItem>(loanItem, true, "Successfully updated employee loan status!")

        }
    }


    @Override
    @GraphQLMutation(name = "updatePayrollEmployeeLoanStatus")
    GraphQLResVal<PayrollEmployeeLoan> updateEmployeeStatus(
            @GraphQLArgument(name = "id", description = "ID of the module employee.") UUID id,
            @GraphQLArgument(name = "status", description = "Status of the module employee you want to set.") PayrollEmployeeStatus status
    ) {
        PayrollEmployeeLoan employee = null
        payrollEmployeeLoanRepository.findById(id).ifPresent { employee = it }
        if (!employee) return new GraphQLResVal<PayrollEmployeeLoan>(null, false, "Failed to update employee loan status. Please try again later!")
        else {
            employee.status = status
            payrollEmployeeLoanRepository.save(employee)
        }
        return new GraphQLResVal<PayrollEmployeeLoan>(employee, true, "Successfully updated employee loan status!")
    }

    @GraphQLMutation(name = "deleteLoanItem")
    GraphQLResVal<String> deleteLoanItem(
            @GraphQLArgument(name = "id") UUID id
    ) {
        payrollLoanItemRepository.deleteById(id)
        return new GraphQLResVal<String>('Success', true, "Successfully updated employee loan status!")
    }


    //=========================== Interface Methods ============================

    @Override
    List<PayrollEmployeeLoan> addEmployees(List<PayrollEmployee> payrollEmployees, Payroll payroll) {
        PayrollLoan loan = payroll.loan
        List<PayrollEmployeeLoan> employeeList = []
        if (payrollEmployees.size() > 0) {
            employeeList = generateLoanItems(payrollEmployees, loan)
        }
        payroll.loan = loan
        return employeeList
    }

    private List<PayrollEmployeeLoan> generateLoanItems(List<PayrollEmployee> payrollEmployees, PayrollLoan loan) {
        List<PayrollEmployeeLoan> employeeList = []
        List<PayrollLoanItem> payrollLoanItems = []

        CompanySettings company = SecurityUtils.currentCompany()
        List<LoanItemsDto> loanItems = getLoanItems(payrollEmployees)

        payrollEmployees.each { PayrollEmployee payrollEmployee ->

            PayrollEmployeeLoan employee = new PayrollEmployeeLoan()
            if (payrollEmployee.payrollEmployeeLoan) {
                employee = payrollEmployee.payrollEmployeeLoan
                employee.loanItems.clear()
            }

            employee.status = PayrollEmployeeStatus.DRAFT
            employee.payrollEmployee = payrollEmployee
            employee.payrollLoan = loan
            employee.company = company
            employee = payrollEmployeeLoanRepository.save(employee)

            List<LoanItemsDto> foundLoanItems = []
            loanItems = loanItems.findAll { item ->
                if (item.employee == payrollEmployee.employee.id) {
                    foundLoanItems << item
                    return false
                } else {
                    return true
                }
            }
            foundLoanItems.each {
                PayrollLoanItem payrollLoanItem = new PayrollLoanItem()
                payrollLoanItem.employeeLoan = employee
                payrollLoanItem.category = it.category
                switch (it.category) {
                    case EmployeeLoanCategory.CASH_ADVANCE:
                        if (!payrollEmployee?.employee?.employeeLoanConfig?.cashAdvanceAmount) return
                        payrollLoanItem.amount = payrollEmployee?.employee?.employeeLoanConfig?.cashAdvanceAmount ?: 0
                        break;
                    case EmployeeLoanCategory.EQUIPMENT_LOAN:
                        if (!payrollEmployee?.employee?.employeeLoanConfig?.equipmentLoanAmount) return
                        payrollLoanItem.amount = payrollEmployee?.employee?.employeeLoanConfig?.equipmentLoanAmount ?: 0
                        break;
                }

                payrollLoanItem.status = true
                payrollLoanItem.company = company
                payrollLoanItems.push(payrollLoanItem)
            }
            employeeList.push(employee)
        }
        loan.employees = employeeList
        payrollLoanItemRepository.saveAll(payrollLoanItems)
        employeeList
    }

    @Override
    void recalculateAllEmployee(Payroll payroll) {
        generateLoanItems(payroll.payrollEmployees, payroll.loan)

    }

    @Override
    PayrollEmployeeLoan addEmployee(PayrollEmployee payrollEmployee, Payroll payrollModule) {
        return null
    }

    @Override
    void removeEmployee(PayrollEmployee payrollEmployee, Payroll payrollModule) {
    }


    @Override
    void removeEmployees(List<PayrollEmployee> payrollEmployees, Payroll payrollModule) {

    }

    @Override
    PayrollEmployeeLoan recalculateEmployee(PayrollEmployee payrollEmployee, Payroll payroll) {
        generateLoanItems([payrollEmployee], payroll.loan)
        return null
    }


//============================================================UTILITY METHODS====================================================================

    List<LoanItemsDto> getLoanItems(List<PayrollEmployee> payrollEmployeeList) {
        List<UUID> ids = []
        payrollEmployeeList.each {
            ids.push(it.employee.id)
        }

        String formattedStringIds = "(${ids.collect { "'${it.toString()}'" }.join(', ')})"
        jdbcTemplate.query("""

select 
    l.employee as employee,
    l.category as category,
    sum(l.debit - l.credit) as amount
FROM payroll.employee_loan_ledger_item l
where l.employee in ${formattedStringIds}
GROUP by l.employee, l.category;

""", new BeanPropertyRowMapper(LoanItemsDto.class))

    }


}




