package com.backend.gbp.graphqlservices.payroll

import com.backend.gbp.domain.hrm.dto.HoursLog
import com.backend.gbp.domain.payroll.*
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
    PayrollLoan findByPayrollId(@GraphQLArgument(name = "id") UUID id) {
        if (id) {
            return payrollLoanRepository.findByPayrollId(id).get()
        } else {
            return null
        }

    }



    //=================================QUERY=================================\\


    //================================MUTATION================================\\






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






