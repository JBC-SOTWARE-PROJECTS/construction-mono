package com.backend.gbp.graphqlservices.payroll

import com.backend.gbp.domain.CompanySettings

import com.backend.gbp.domain.payroll.*
import com.backend.gbp.domain.payroll.enums.EmployeeLoanCategory
import com.backend.gbp.domain.payroll.enums.PayrollEmployeeStatus
import com.backend.gbp.graphqlservices.payroll.common.AbstractPayrollEmployeeStatusService
import com.backend.gbp.graphqlservices.payroll.enums.PayrollModule
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.repository.payroll.PayrollEmployeeLoanRepository
import com.backend.gbp.repository.payroll.PayrollLoanItemRepository
import com.backend.gbp.repository.payroll.PayrollRepository
import com.backend.gbp.security.SecurityUtils
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
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


    @Override
    List<PayrollEmployeeLoan> addEmployees(List<PayrollEmployee> payrollEmployees, Payroll payroll) {
        CompanySettings company = SecurityUtils.currentCompany()
        PayrollLoan loan = payroll.loan
        List<PayrollEmployeeLoan> employeeList = []
        List<PayrollLoanItem> payrollLoanItems = []
        if (payrollEmployees.size() > 0) {
            List<LoanItemsDto> loanItems = generateLoanItems(payrollEmployees)


            payrollEmployees.each { PayrollEmployee payrollEmployee ->

                PayrollEmployeeLoan employee = new PayrollEmployeeLoan()
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
                    payrollLoanItem.amount = it.amount
                    payrollLoanItem.status = true
                    payrollLoanItem.company = company
                    payrollLoanItems.push(payrollLoanItem)
                }
                employeeList.push(employee)
            }
        }
        loan.employees = employeeList
        payrollLoanItemRepository.saveAll(payrollLoanItems)
        payroll.loan = loan
        return employeeList
    }

    @Override
    void recalculateAllEmployee(Payroll payroll) {
        payroll.loan.employees
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
        PayrollEmployeeLoan employee = payrollEmployee.payrollEmployeeLoan
        return null
    }


//============================================================UTILITY METHODS====================================================================

    List<LoanItemsDto> generateLoanItems(List<PayrollEmployee> payrollEmployeeList) {
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


//=================================QUERY=================================\\

//    @GraphQLQuery(name = "getTimekeepingEmployees", description = "Gets the loan employees by payroll id")
//    List<TimekeepingEmployeeDto> getTimekeepingEmployees(@GraphQLArgument(name = "id") UUID id) {
//        Payroll payroll = payrollRepository.getOne(id)
//        return payrollEmployeeLoanRepository.findByTimekeeping(payroll)
//    }
//
//    @GraphQLQuery(name = "getTimekeepingEmployeesV2", description = "Gets all the ids of the employees of the loan")
//    List<PayrollEmployeeLoan> getTimekeepingEmployeesV2(@GraphQLArgument(name = "id") UUID id) {
//        return payrollEmployeeLoanRepository.findByTimekeepingId(id)
//    }
//
//    @GraphQLQuery(name = "getTimekeepingEmployeeLogs", description = "Gets all the ids of the employees of the loan")
//    List<AccumulatedLogs> getTimekeepingEmployeeLogs(@GraphQLArgument(name = "id") UUID id) {
//        return accumulatedLogRepository.findByTimekeepingEmployee(id)?.sort({ it.date })
//    }
//
//    List<PayrollEmployeeLoan> getByIds(@GraphQLArgument(name="getByIds") UUID id) {
//        return payrollEmployeeLoanRepository.findByTimekeepingId(id)
//    }

    //=================================MUTATIONS=================================\\
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

            def a
        }
        return new GraphQLResVal<PayrollEmployeeLoan>(employee, true, "Successfully updated employee loan status!")
    }
}




