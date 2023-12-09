package com.backend.gbp.graphqlservices.payroll


import com.backend.gbp.domain.payroll.Payroll
import com.backend.gbp.domain.payroll.PayrollAllowance
import com.backend.gbp.domain.payroll.PayrollEmployee
import com.backend.gbp.domain.payroll.PayrollEmployeeAllowance
import com.backend.gbp.domain.payroll.enums.AccountingEntryType
import com.backend.gbp.domain.payroll.enums.PayrollStatus
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.repository.payroll.PayrollAllowanceRepository
import com.backend.gbp.repository.payroll.PayrollEmployeeAllowanceRepository
import com.backend.gbp.repository.payroll.PayrollRepository
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


class SubAccountBreakdownDto {
    String subaccountCode
    String description
    BigDecimal amount = 0
    AccountingEntryType entryType
}

@TypeChecked
@Component
@GraphQLApi
@Transactional(rollbackFor = Exception.class)
class PayrollAllowanceService implements IPayrollModuleBaseOperations<PayrollAllowance> {


    @Autowired
    PayrollRepository payrollRepository

    @Autowired
    PayrollAllowanceRepository payrollAllowanceRepository

    @Autowired
    PayrollEmployeeAllowanceRepository payrollEmployeeAllowanceRepository

    @Autowired
    PayrollEmployeeAllowanceService payrollEmployeeAllowanceService


    @Autowired
    ObjectMapper objectMapper

    @PersistenceContext
    EntityManager entityManager

    private PayrollAllowance allowance;


    //=================================QUERY=================================\\

    @GraphQLQuery(name = "getAllowanceByPayrollId", description = "Get allowance by ID")
    PayrollAllowance getAllowanceByPayrollId(@GraphQLArgument(name = "id") UUID id) {
        if (id) {
            return payrollAllowanceRepository.findByPayrollId(id).get()
        } else {
            return null
        }

    }


    //=================================QUERY=================================\\


    //================================MUTATION================================\\


    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation
    GraphQLResVal<PayrollAllowance> calculateAllAllowances(
            @GraphQLArgument(name = "id") UUID id
    ) {
        Payroll payroll = payrollRepository.findById(id).get()
        payrollEmployeeAllowanceService.recalculateAllEmployee(payroll)
        return new GraphQLResVal<PayrollAllowance>(payroll.allowance, true, "Successfully updated allowance")

    }


    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation
    GraphQLResVal<String> calculateOneAllowanceEmployee(
            @GraphQLArgument(name = "id") UUID id
    ) {
        PayrollEmployeeAllowance payrollEmployeeAllowance = payrollEmployeeAllowanceRepository.findById(id).get()
        Payroll payroll = payrollEmployeeAllowance.payrollEmployee.payroll
        PayrollEmployee payrollEmployee = payrollEmployeeAllowance.payrollEmployee
        payrollEmployeeAllowanceService.recalculateEmployee(payrollEmployee, payroll)
        return new GraphQLResVal<String>(null, true, "Successfully recalculated allowance employee.")
    }

    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation(name = 'updatePayrollAllowanceStatus')
    GraphQLResVal<String> updatePayrollAllowanceStatus(
            @GraphQLArgument(name = "payrollId") UUID payrollId,
            @GraphQLArgument(name = "status") PayrollStatus status

    ) {

        PayrollAllowance payrollAllowance = payrollAllowanceRepository.findByPayrollId(payrollId).get()

        if (status == PayrollStatus.FINALIZED) {
            payrollAllowance.total = 0

            payrollAllowanceRepository.joinFetchAllowanceItems(payrollAllowance.id)
            Map<String, SubAccountBreakdownDto> allowanceMap = new HashMap<>()

            payrollAllowance.allowanceEmployees.each { employee ->
                employee.allowanceItems.each {
                    SubAccountBreakdownDto allowance = allowanceMap.get(it.allowance.subaccountCode)
                    if (!allowance) allowance = new SubAccountBreakdownDto()
                    allowance.subaccountCode = it.allowance.subaccountCode
                    allowance.amount += it.amount
                    allowance.entryType = AccountingEntryType.DEBIT
                    payrollAllowance.total += it.amount
                    allowanceMap.put(allowance.subaccountCode, allowance)
                }
            }
            payrollAllowance.totalsBreakdown = []
            allowanceMap.keySet().each {
                SubAccountBreakdownDto allowance = allowanceMap.get(it.toString())
                payrollAllowance.totalsBreakdown.push(allowance)
            }

        }

        payrollAllowance.status = status
        payrollAllowanceRepository.save(payrollAllowance)

        return new GraphQLResVal<String>(null, true, "Successfully updated Payroll Allowance status.")
    }


//===================================================== INTERFACE METHODS ==============================================

    @Override
    PayrollAllowance startPayroll(Payroll payroll) {
        PayrollAllowance allowance = new PayrollAllowance();
        allowance.payroll = payroll
        allowance.status = PayrollStatus.DRAFT
        allowance = payrollAllowanceRepository.save(allowance)
        payroll.allowance = allowance
        payrollEmployeeAllowanceService.addEmployees(payroll.payrollEmployees, payroll)
        return allowance

    }

    @Override
    void finalizePayroll(Payroll payroll) {

    }


}






