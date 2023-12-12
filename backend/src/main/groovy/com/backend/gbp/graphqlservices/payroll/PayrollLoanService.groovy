package com.backend.gbp.graphqlservices.payroll

import com.backend.gbp.domain.hrm.dto.HoursLog
import com.backend.gbp.domain.payroll.*
import com.backend.gbp.domain.payroll.enums.AccountingEntryType
import com.backend.gbp.domain.payroll.enums.EmployeeLoanCategory
import com.backend.gbp.domain.payroll.enums.PayrollEmployeeStatus
import com.backend.gbp.domain.payroll.enums.PayrollStatus
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.repository.payroll.PayrollEmployeeLoanRepository
import com.backend.gbp.repository.payroll.PayrollEmployeeRepository
import com.backend.gbp.repository.payroll.PayrollLoanRepository
import com.backend.gbp.repository.payroll.PayrollRepository
import com.backend.gbp.security.SecurityUtils
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

import javax.persistence.EntityManager
import javax.persistence.PersistenceContext

@TypeChecked
@Component
@GraphQLApi
@Transactional(rollbackFor = Exception.class)
class PayrollLoanService implements IPayrollModuleBaseOperations<PayrollLoan> {

    @Autowired
    PayrollLoanRepository payrollLoanRepository

    @Autowired
    PayrollRepository payrollRepository

    @Autowired
    PayrollEmployeeLoanService payrollEmployeeLoanService

    @Autowired
    PayrollEmployeeLoanRepository payrollEmployeeLoanRepository


    @Autowired
    ObjectMapper objectMapper

    @PersistenceContext
    EntityManager entityManager

    private PayrollLoan loan;


    //=================================QUERY=================================\\

    @GraphQLQuery(name = "getPayrollLoanById", description = "Get loan by ID")
    PayrollLoan findById(@GraphQLArgument(name = "id") UUID id) {
        if (id) {
            return payrollLoanRepository.findById(id).get()
        } else {
            return null
        }

    }

    @GraphQLQuery(name = "getPayrollLoanByPayrollId", description = "Get loan by ID")
    PayrollLoan getPayrollLoanByPayrollId(@GraphQLArgument(name = "id") UUID id) {
        if (id) {
            return payrollLoanRepository.findByPayrollId(id).get()
        } else {
            return null
        }

    }


    //=================================QUERY=================================\\


    //================================MUTATION================================\\

    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation
    GraphQLResVal<String> updatePayrollLoanStatus(
            @GraphQLArgument(name = "payrollId") UUID payrollId,
            @GraphQLArgument(name = "status") PayrollStatus status

    ) {
        PayrollLoan module = payrollLoanRepository.findByPayrollId(payrollId).get()
        if (status == PayrollStatus.FINALIZED) {
            Map<String, SubAccountBreakdownDto> breakdownMap = new HashMap<>()
            module.employees.each { employee ->
                employee.loanItems.each {
                    String subAccountCode = it.category == EmployeeLoanCategory.CASH_ADVANCE ? '116-04-0000' : '211-02-0000'
                    SubAccountBreakdownDto breakdown = breakdownMap.get(subAccountCode)
                    if (!breakdown) breakdown = new SubAccountBreakdownDto()

                    breakdown.amount += it.amount
                    breakdown.entryType = AccountingEntryType.CREDIT
                    breakdown.description = it.category
                    breakdown.subaccountCode = EmployeeLoanCategory.CASH_ADVANCE ? '116-04-0000' : '211-02-0000'

                    breakdownMap.put(subAccountCode, breakdown)
                }
            }
            module.totalsBreakdown = []
            breakdownMap.keySet().each {
                SubAccountBreakdownDto deduction = breakdownMap.get(it.toString())
                module.totalsBreakdown.push(deduction)
            }
        }
        module.status = status
        payrollLoanRepository.save(module)

        return new GraphQLResVal<String>(null, true, "Successfully updated Payroll Loan status.")
    }


//===================================================================

    @Override
    PayrollLoan startPayroll(Payroll payroll) {
        PayrollLoan loan = new PayrollLoan();
        loan.payroll = payroll
        loan.status = PayrollStatus.DRAFT
        loan.company = SecurityUtils.currentCompany()
        loan = payrollLoanRepository.save(loan)
        payrollEmployeeLoanRepository.fetchEmployeeLoan(payroll.id)
        payroll.loan = loan
        payrollEmployeeLoanService.addEmployees(payroll.payrollEmployees, payroll)
        return loan

    }

    @Override
    void finalizePayroll(Payroll payroll) {

    }

//===================================================================


}






