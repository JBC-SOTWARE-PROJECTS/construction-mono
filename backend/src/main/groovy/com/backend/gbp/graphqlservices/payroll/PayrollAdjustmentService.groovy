package com.backend.gbp.graphqlservices.payroll


import com.backend.gbp.domain.payroll.Payroll
import com.backend.gbp.domain.payroll.PayrollAdjustment
import com.backend.gbp.domain.payroll.enums.AccountingEntryType
import com.backend.gbp.domain.payroll.enums.AdjustmentOperation
import com.backend.gbp.domain.payroll.enums.PayrollStatus
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.repository.payroll.PayrollEmployeeAdjustmentRepository
import com.backend.gbp.repository.payroll.PayrollAdjustmentRepository
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
class ePayrollAdjustmentService implements IPayrollModuleBaseOperations<PayrollAdjustment> {

    @Autowired
    PayrollAdjustmentRepository payrollAdjustmentRepository

    @Autowired
    PayrollRepository payrollRepository

    @Autowired
    PayrollEmployeeAdjustmentService payrollEmployeeAdjustmentService

    @Autowired
    PayrollEmployeeAdjustmentRepository payrollEmployeeAdjustmentRepository


    @Autowired
    ObjectMapper objectMapper

    @PersistenceContext
    EntityManager entityManager

    private PayrollAdjustment adjustment;


    //=================================QUERY=================================\\

    @GraphQLQuery(name = "getPayrollAdjustmentById")
    PayrollAdjustment getPayrollAdjustmentById(@GraphQLArgument(name = "id") UUID id) {
        if (id) {
            return payrollAdjustmentRepository.findByPayrollId(id).get()
        } else {
            return null
        }

    }

    @GraphQLQuery(name = "getPayrollAdjustmentByPayrollId", description = "Get adjustment by ID")
    PayrollAdjustment getPayrollAdjustmentByPayrollId(@GraphQLArgument(name = "id") UUID id) {
//        if (id) {
//            return payrollAdjustmentRepository.findByPayrollId(id).get()
//        } else {
//            return null
//        }

    }


    //=================================QUERY=================================\\


    //================================MUTATION================================\\

    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation
    GraphQLResVal<String> updatePayrollAdjustmentStatus(
            @GraphQLArgument(name = "payrollId") UUID payrollId,
            @GraphQLArgument(name = "status") PayrollStatus status

    ) {
        PayrollAdjustment payrollAdjustment = payrollAdjustmentRepository.findByPayrollId(payrollId).get()

        if (status == PayrollStatus.FINALIZED) {
            Map<String, SubAccountBreakdownDto> breakdownMap = new HashMap<>()
            payrollAdjustment.employees.each { employee ->
                employee.adjustmentItems.each {
                    SubAccountBreakdownDto adjustment = breakdownMap.get(it.category.subaccountCode + "_" + it.operation)
                    if (!adjustment) adjustment = new SubAccountBreakdownDto()

                    adjustment.subaccountCode = it.category.subaccountCode

                    if (it.operation == AdjustmentOperation.ADDITION) {
                        adjustment.amount += it.amount
                        adjustment.entryType = AccountingEntryType.DEBIT
//                        payrollAdjustment.total += it.amount

                    } else if (it.operation == AdjustmentOperation.SUBTRACTION) {
                        adjustment.amount += it.amount
                        adjustment.entryType = AccountingEntryType.CREDIT
//                        payrollAdjustment.total -= it.amount
                    }

                    breakdownMap.put(it.category.subaccountCode + "_" + it.operation, adjustment)
                }
            }
            payrollAdjustment.totalsBreakdown = []
            breakdownMap.keySet().each {
                SubAccountBreakdownDto adjustment = breakdownMap.get(it.toString())
                payrollAdjustment.totalsBreakdown.push(adjustment)
            }

        }


        payrollAdjustment.status = status
        payrollAdjustmentRepository.save(payrollAdjustment)
        return new GraphQLResVal<String>(null, true, "Successfully updated Payroll Adjustment status.")
    }


//===================================================================

    @Override
    PayrollAdjustment startPayroll(Payroll payroll) {
        PayrollAdjustment adjustment = new PayrollAdjustment();
        adjustment.payroll = payroll
        adjustment.status = PayrollStatus.DRAFT
        adjustment.company = SecurityUtils.currentCompany()
        adjustment = payrollAdjustmentRepository.save(adjustment)
//        payrollEmployeeAdjustmentRepository.fetchEmployeeAdjustment(payroll.id)
        payroll.adjustment = adjustment
        payrollEmployeeAdjustmentService.addEmployees(payroll.payrollEmployees, payroll)
        return adjustment

    }

    @Override
    void finalizePayroll(Payroll payroll) {

    }

//===================================================================


}






