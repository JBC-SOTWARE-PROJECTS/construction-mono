package com.backend.gbp.graphqlservices.payroll

import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.payroll.Payroll
import com.backend.gbp.domain.payroll.PayrollEmployee
import com.backend.gbp.domain.payroll.WithholdingTaxMatrix
import com.backend.gbp.domain.payroll.common.PayrollEmployeeAuditingEntity
import com.backend.gbp.domain.payroll.enums.PayrollEmployeeStatus
import com.backend.gbp.domain.payroll.enums.PayrollStatus
import com.backend.gbp.domain.payroll.enums.PayrollType
import com.backend.gbp.graphqlservices.payroll.enums.PayrollModule
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.repository.payroll.PayrollEmployeeListDto
import com.backend.gbp.repository.payroll.PayrollEmployeeRepository
import com.backend.gbp.repository.payroll.PayrollRepository
import com.backend.gbp.repository.payroll.WithholdingTaxMatrixRepository
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

import javax.persistence.EntityManager
import javax.persistence.PersistenceContext

@TypeChecked
@Component
@GraphQLApi
class PayrollEmployeeService {

    private final PayrollRepository payrollRepository

    private final PayrollEmployeeRepository payrollEmployeeRepository

    private final Map<PayrollModule, IPayrollEmployeeBaseOperation> payrollEmployeeStatusServiceMap

    @Autowired
    WithholdingTaxMatrixRepository withholdingTaxMatrixRepository

    @PersistenceContext
    EntityManager entityManager

    PayrollEmployeeService(
            PayrollRepository payrollRepository,
            PayrollEmployeeRepository payrollEmployeeRepository,
            Map<PayrollModule, IPayrollEmployeeBaseOperation> payrollEmployeeStatusServiceMap
    ) {
        this.payrollRepository = payrollRepository
        this.payrollEmployeeRepository = payrollEmployeeRepository
        this.payrollEmployeeStatusServiceMap = payrollEmployeeStatusServiceMap
    }
    //=================================QUERY=================================\\

    @GraphQLQuery(name = "getPayrollEmployeeIds", description = "Gets all the ids of the employees of the Payroll")
    List<UUID> getPayrollEmployeeIds(@GraphQLArgument(name = "PayrollId") UUID payrollId) {
        List<UUID> ids = entityManager.createQuery("""
                Select e.employee.id from PayrollEmployee e where e.Payroll.id = :payrollId
            """, UUID.class).setParameter("payrollId", payrollId)
                .getResultList()
        return ids
    }

//    @GraphQLQuery(name = "getPayrollEmployee", description = "Gets all the employees by payroll id")
//    GraphQLResVal<List<PayrollEmployeeListDto>> getPayrollEmployee(@GraphQLArgument(name = "id") UUID id) {
//        try {
//            return new GraphQLResVal<List<PayrollEmployeeListDto>>(payrollEmployeeRepository.findPayrollEmployee(id), true, "Successfully retrieved payroll employees")
//        } catch (Exception exception) {
//            return new GraphQLResVal<List<PayrollEmployeeListDto>>(null, false, exception.message)
//        }
//    }

    @GraphQLQuery(name = "getPayrollHRMEmployees", description = "Gets all the employees by payroll id")
    List<Employee> getPayrollHRMEmployees(@GraphQLArgument(name = "id") UUID id) {
        return payrollEmployeeRepository.findEmployeeByPayrollId(id)
    }

    @GraphQLQuery(name = "getPayrollEmployees", description = "Gets all the employees by payroll id")
    List<PayrollEmployeeListDto> getPayrollEmployees(@GraphQLArgument(name = "id") UUID id) {
        return payrollEmployeeRepository.findPayrollEmployee(id)
    }

        @GraphQLQuery(name = "getAllPayrollEmployee", description = "get all employee")
    List<PayrollEmployee> getAllPayrollEmployee(@GraphQLArgument(name = "id") UUID id){
        return payrollEmployeeRepository.findByPayrollId(id)
    }

    //=================================MUTATIONS=================================\\


    @GraphQLMutation()
    GraphQLResVal<String> updatePayrollEmployeeStatus(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "status") PayrollEmployeeStatus status
    ) {
        PayrollEmployee payrollEmployee = payrollEmployeeRepository.findById(id).get()
        payrollEmployee.status = status
        payrollEmployeeRepository.save(payrollEmployee)

        return new GraphQLResVal<String>(null, true, "Status updated successfully.")
    }

    @GraphQLMutation(description = "A mutation for updating the status of module employee status.")
    GraphQLResVal<String> updatePayrollModuleEmployeeStatus(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "status") PayrollEmployeeStatus status,
            @GraphQLArgument(name = "module") PayrollModule module
    ) {
        IPayrollEmployeeBaseOperation service = payrollEmployeeStatusServiceMap.get(module)

        if (service) {
            def response = service.updateEmployeeStatus(id, status) as GraphQLResVal<PayrollEmployeeAuditingEntity>
            return new GraphQLResVal<String>(response.response.payrollEmployee.employee.fullName, response.success, response.message)
        }

        return new GraphQLResVal<String>(null, false, "Failed to update employee status. Please try again later.")
    }

    @GraphQLMutation(description = "A mutation to recalculate payroll module employee .")
    GraphQLResVal<String> recalculatePayrollModuleEmployee(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "module") PayrollModule module
    ) {
        IPayrollEmployeeBaseOperation service = payrollEmployeeStatusServiceMap.get(module)

        PayrollEmployee employee = null
        payrollEmployeeRepository.findByIdWithPayroll(id).ifPresent { employee = it }
        if (service) {
            service.recalculateEmployee(employee, employee.payroll)

            return new GraphQLResVal<String>(null, true, "Successfully recalculated employee")
        }

        return new GraphQLResVal<String>(null, false, "Failed to update employee status. Please try again later.")
    }

    @GraphQLMutation()
    GraphQLResVal<String> recalculateAllPayrollModuleEmployee(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "module") PayrollModule module
    ) {
        IPayrollEmployeeBaseOperation service = payrollEmployeeStatusServiceMap.get(module)

        Payroll payroll = null
        payrollRepository.findById(id).ifPresent { payroll = it }

        if (service && payroll) {
            service.recalculateAllEmployee(payroll) as GraphQLResVal<PayrollEmployeeAuditingEntity>
            return new GraphQLResVal<String>(null, true, "Successfully recalculated all employees.")
        }

        return new GraphQLResVal<String>(null, false, "Failed to update employee status. Please try again later.")
    }

    @GraphQLMutation()
    GraphQLResVal<String> recalculateOneWithholdingTax(
            @GraphQLArgument(name = "id") UUID id
    ) {

        PayrollEmployee payrollEmployee = payrollEmployeeRepository.findById(id).get()
        if (payrollEmployee.timekeepingEmployee.status == PayrollEmployeeStatus.DRAFT &&
                payrollEmployee.payrollEmployeeContribution.status == PayrollEmployeeStatus.DRAFT) {
            return new GraphQLResVal<String>(null, false, "Timekeeping and Contributions for this employee must be finalized first")
        }

        payrollEmployeeRepository.save(getWithholdingTax(payrollEmployee))

        return new GraphQLResVal<String>(null, true, "Withholding tax calculated successfully")
    }


    @GraphQLMutation()
    GraphQLResVal<String> recalculateAllWithholdingTax(
            @GraphQLArgument(name = "id") UUID id
    ) {


        List<PayrollEmployee> payrollEmployees = payrollEmployeeRepository.findByPayrollId(id)

        List<PayrollEmployee> save = []
        payrollEmployees.each {
            if (it.timekeepingEmployee.status == PayrollEmployeeStatus.FINALIZED &&
                    it.payrollEmployeeContribution.status == PayrollEmployeeStatus.FINALIZED) {
                save.push(getWithholdingTax(it))
            }
        }
        payrollEmployeeRepository.saveAll(save)

        return new GraphQLResVal<String>(null, true, "Withholding tax calculated successfully")
    }

    private PayrollEmployee getWithholdingTax(PayrollEmployee payrollEmployee) {
        BigDecimal taxableAmount = 0

        payrollEmployee.timekeepingEmployee.salaryBreakdown.each {
            taxableAmount += it.regular
            taxableAmount += it.overtime
        }

        WithholdingTaxMatrix tax = withholdingTaxMatrixRepository.findByAmountRangeAndType(taxableAmount,
                payrollEmployee.payroll.type,
                payrollEmployee.employee.currentCompany.id
        )[0]


        if (tax) {
            BigDecimal percent = tax.percentage / 100
            payrollEmployee.withholdingTax = tax.baseAmount + ((taxableAmount - tax.thresholdAmount) * percent)
        } else payrollEmployee.withholdingTax = 0
        return payrollEmployee

    }
}
