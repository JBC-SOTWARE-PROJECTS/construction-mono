package com.backend.gbp.graphqlservices.payroll

import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.payroll.*
import com.backend.gbp.domain.payroll.enums.PayrollEmployeeStatus
import com.backend.gbp.graphqlservices.payroll.common.AbstractPayrollEmployeeStatusService
import com.backend.gbp.graphqlservices.payroll.enums.PayrollModule
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.repository.payroll.AdjustmentCategoryRepository
import com.backend.gbp.repository.payroll.PayrollAdjustmentItemRepository
import com.backend.gbp.repository.payroll.PayrollEmployeeAdjustmentDto
import com.backend.gbp.repository.payroll.PayrollEmployeeAdjustmentRepository
import com.backend.gbp.security.SecurityUtils
import com.fasterxml.jackson.databind.ObjectMapper
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service

@GraphQLApi
@Service
class PayrollEmployeeAdjustmentService extends AbstractPayrollEmployeeStatusService<PayrollEmployeeAdjustment> implements IPayrollEmployeeBaseOperation<PayrollEmployeeAdjustment> {
    final PayrollModule payrollModule = PayrollModule.ADJUSTMENT
    private final EmployeeRepository employeeRepository
    private final PayrollEmployeeAdjustmentRepository payrollEmployeeAdjustmentRepository

    @Autowired
    PayrollEmployeeAdjustmentService(EmployeeRepository employeeRepository, PayrollEmployeeAdjustmentRepository payrollEmployeeAdjustmentRepository) {
        super(PayrollEmployeeAdjustment.class, employeeRepository)
        this.employeeRepository = employeeRepository
        this.payrollEmployeeAdjustmentRepository = payrollEmployeeAdjustmentRepository
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    PayrollAdjustmentItemRepository payrollAdjustmentItemRepository

    @Autowired
    AdjustmentCategoryRepository adjustmentCategoryRepository

    //=========================== QUERIES ============================


    @GraphQLQuery(name = "getAdjustmentEmployees")
    Page<PayrollEmployeeAdjustmentDto> getAdjustmentEmployees(
            @GraphQLArgument(name = "payroll") UUID payroll,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size,
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "status") List<PayrollEmployeeStatus> status
    ) {
        if (payroll) {
            Page<PayrollEmployeeAdjustmentDto> pageRes = payrollEmployeeAdjustmentRepository.getEmployeesPageable(
                    payroll,
                    filter,
                    status.size() > 0 ? status : PayrollEmployeeStatus.values().toList(),
                    PageRequest.of(page, size))

            return pageRes
        } else return null
    }


    @GraphQLQuery(name = "getAdjustmentEmployeesList")
    List<PayrollEmployeeAdjustmentDto> getAdjustmentEmployeesList(
            @GraphQLArgument(name = "payroll") UUID payroll
    ) {
        if (payroll) {
            payrollEmployeeAdjustmentRepository.getEmployeesList(
                    payroll)
        } else return null
    }

    //=========================== MUTATIONS ============================

    @GraphQLMutation(name = "upsertAdjustmentItem")
    GraphQLResVal<PayrollAdjustmentItem> upsertAdjustmentItem(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "employee") UUID employee,
            @GraphQLArgument(name = "category") UUID category,
            @GraphQLArgument(name = "amount") BigDecimal amount,
            @GraphQLArgument(name = "description") String description
    ) {
        PayrollAdjustmentItem item = new PayrollAdjustmentItem()
        if (id) {
            item = payrollAdjustmentItemRepository.findById(id).get()
        }
        if (employee)
            item.employeeAdjustment = payrollEmployeeAdjustmentRepository.findById(employee).get()

        if (category) {
            item.category = adjustmentCategoryRepository.findById(category).get()
            item.operation = item.category.operation
        }

        if (amount)
            item.amount = amount

        item.description = description ? description : item.category.description
        item.company = SecurityUtils.currentCompany()
        payrollAdjustmentItemRepository.save(item)

        return new GraphQLResVal<PayrollAdjustmentItem>(item, true, "Successfully updated employee adjustment status!")
    }


    @GraphQLMutation(name = "updatePayrollEmployeeAdjustmentStatus")
    GraphQLResVal<PayrollEmployeeAdjustment> updateEmployeeStatus(
            @GraphQLArgument(name = "id", description = "ID of the module employee.") UUID id,
            @GraphQLArgument(name = "status", description = "Status of the module employee you want to set.") PayrollEmployeeStatus status
    ) {
        PayrollEmployeeAdjustment employee = null
        employee = this.updateStatus(id, status)

        if (!employee) return new GraphQLResVal<PayrollEmployeeAdjustment>(null, false, "Failed to update employee adjustment status. Please try again later!")
        return new GraphQLResVal<PayrollEmployeeAdjustment>(employee, true, "Successfully updated employee adjustment status!")
    }


    @Override
    PayrollEmployeeAdjustment addEmployee(PayrollEmployee payrollEmployee, Payroll payroll) {
        return null
    }

    @Override
    void removeEmployee(PayrollEmployee payrollEmployee, Payroll payroll) {

    }

    @Override
    List<PayrollEmployeeAdjustment> addEmployees(List<PayrollEmployee> payrollEmployees, Payroll payroll) {
        CompanySettings company = SecurityUtils.currentCompany()
        PayrollAdjustment adjustment = payroll.adjustment

        List<PayrollEmployeeAdjustment> employeeList = []
        if (payrollEmployees.size() > 0) {
            payrollEmployees.each {
                PayrollEmployeeAdjustment employee = new PayrollEmployeeAdjustment()
                employee.status = PayrollEmployeeStatus.DRAFT
                employee.payrollEmployee = it
                employee.payrollAdjustment = adjustment
                employee.company = company

                employeeList.push(employee)
            }
        }
        adjustment.employees = payrollEmployeeAdjustmentRepository.saveAll(employeeList)

        payroll.adjustment = adjustment
        return employeeList
    }

    @Override
    void removeEmployees(List<PayrollEmployee> payrollEmployees, Payroll payroll) {

    }

    @Override
    PayrollEmployeeAdjustment recalculateEmployee(PayrollEmployee payrollEmployee, Payroll payroll) {
        PayrollEmployeeAdjustment employee = payrollEmployee.employeeAdjustment
        employee.adjustmentItems.clear()
        payrollEmployeeAdjustmentRepository.save(employee)
        return null
    }

    @Override
    void recalculateAllEmployee(Payroll payroll) {
        List<PayrollEmployeeAdjustment> employeeList = []
        payroll.adjustment.employees.each {
            PayrollEmployeeAdjustment employee = it
            employee.adjustmentItems.clear()
            employeeList.push(employee)
        }
        employeeList = payrollEmployeeAdjustmentRepository.saveAll(employeeList)
        payroll.adjustment.employees = employeeList
    }


    //================================= UTILITY METHODS ====================================================================


}
