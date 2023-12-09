package com.backend.gbp.graphqlservices.payroll

import com.backend.gbp.domain.payroll.Payroll
import com.backend.gbp.domain.payroll.PayrollOtherDeduction
import com.backend.gbp.domain.payroll.enums.AccountingEntryType
import com.backend.gbp.domain.payroll.enums.AdjustmentOperation
import com.backend.gbp.domain.payroll.enums.PayrollStatus
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.repository.payroll.PayrollOtherDeductionRepository
import com.backend.gbp.repository.payroll.PayrollEmployeeOtherDeductionRepository
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
class PayrollOtherDeductionService implements IPayrollModuleBaseOperations<PayrollOtherDeduction> {

    @Autowired
    PayrollOtherDeductionRepository payrollOtherDeductionRepository

    @Autowired
    PayrollRepository payrollRepository

    @Autowired
    PayrollEmployeeOtherDeductionService payrollEmployeeOtherDeductionService

    @Autowired
    PayrollEmployeeOtherDeductionRepository payrollEmployeeOtherDeductionRepository


    @Autowired
    ObjectMapper objectMapper

    @PersistenceContext
    EntityManager entityManager

    private PayrollOtherDeduction otherDeduction;


    //=================================QUERY=================================\\

    @GraphQLQuery(name = "getPayrollOtherDeductionById")
    PayrollOtherDeduction getPayrollOtherDeductionById(@GraphQLArgument(name = "id") UUID id) {
        if (id) {
            return payrollOtherDeductionRepository.findByPayrollId(id).get()
        } else {
            return null
        }

    }

    @GraphQLQuery(name = "getPayrollOtherDeductionByPayrollId", description = "Get otherDeduction by ID")
    PayrollOtherDeduction getPayrollOtherDeductionByPayrollId(@GraphQLArgument(name = "id") UUID id) {
//        if (id) {
//            return payrollOtherDeductionRepository.findByPayrollId(id).get()
//        } else {
//            return null
//        }

    }


    //=================================QUERY=================================\\


    //================================MUTATION================================\\

    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation
    GraphQLResVal<String> updatePayrollOtherDeductionStatus(
            @GraphQLArgument(name = "payrollId") UUID payrollId,
            @GraphQLArgument(name = "status") PayrollStatus status

    ) {
        PayrollOtherDeduction payrollOtherDeduction = payrollOtherDeductionRepository.findByPayrollId(payrollId).get()

        if (status == PayrollStatus.FINALIZED) {
            Map<String, SubAccountBreakdownDto> breakdownMap = new HashMap<>()
            payrollOtherDeduction.employees.each { employee ->
                employee.deductionItems.each {
                    SubAccountBreakdownDto deduction = breakdownMap.get(it.type.subaccountCode)
                    if (!deduction) deduction = new SubAccountBreakdownDto()


                    deduction.amount = it.amount
                    deduction.entryType = AccountingEntryType.CREDIT
                    deduction.subaccountCode = it.type.subaccountCode

                    breakdownMap.put(it.type.subaccountCode, deduction)
                }
            }
            payrollOtherDeduction.totalsBreakdown = []
            breakdownMap.keySet().each {
                SubAccountBreakdownDto deduction = breakdownMap.get(it.toString())
                payrollOtherDeduction.totalsBreakdown.push(deduction)
            }

        }


        payrollOtherDeduction.status = status
        payrollOtherDeductionRepository.save(payrollOtherDeduction)
////        TODO: Additional operations when finalizing otherDeduction module
        return new GraphQLResVal<String>(null, true, "Successfully updated Payroll OtherDeduction status.")
    }


//===================================================================

    @Override
    PayrollOtherDeduction startPayroll(Payroll payroll) {
        PayrollOtherDeduction otherDeduction = new PayrollOtherDeduction();
        otherDeduction.payroll = payroll
        otherDeduction.status = PayrollStatus.DRAFT
        otherDeduction.company = SecurityUtils.currentCompany()
        otherDeduction = payrollOtherDeductionRepository.save(otherDeduction)
//        payrollEmployeeOtherDeductionRepository.fetchEmployeeOtherDeduction(payroll.id)
        payroll.otherDeduction = otherDeduction
        payrollEmployeeOtherDeductionService.addEmployees(payroll.payrollEmployees, payroll)
        return otherDeduction

    }

    @Override
    void finalizePayroll(Payroll payroll) {

    }

//===================================================================


}






