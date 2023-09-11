package com.backend.gbp.graphqlservices.payroll

import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.payroll.Payroll
import com.backend.gbp.domain.payroll.PayrollEmployee
import com.backend.gbp.domain.payroll.common.PayrollEmployeeAuditingEntity
import com.backend.gbp.domain.payroll.enums.PayrollEmployeeStatus
import com.backend.gbp.graphqlservices.payroll.enums.PayrollModule
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.repository.payroll.PayrollEmployeeRepository
import com.backend.gbp.repository.payroll.PayrollRepository
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
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

    @GraphQLQuery(name = "getPayrollEmployees", description = "Gets all the employees by payroll id")
    List<Employee> getPayrollEmployees(@GraphQLArgument(name = "id") UUID id) {
        return payrollEmployeeRepository.findEmployeeByPayrollId(id)
    }

    //=================================MUTATIONS=================================\\

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

    @GraphQLMutation(description = "A mutation to recalculate all payroll module employee .")
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
}
