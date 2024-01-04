package com.backend.gbp.graphqlservices.payroll

import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.payroll.*
import com.backend.gbp.domain.payroll.enums.PayrollEmployeeStatus
import com.backend.gbp.graphqlservices.payroll.common.AbstractPayrollEmployeeStatusService
import com.backend.gbp.graphqlservices.payroll.enums.PayrollModule
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.repository.payroll.OtherDeductionTypesRepository
import com.backend.gbp.repository.payroll.PayrollOtherDeductionItemRepository
import com.backend.gbp.repository.payroll.PayrollEmployeeOtherDeductionDto
import com.backend.gbp.repository.payroll.PayrollEmployeeOtherDeductionRepository
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
class PayrollEmployeeOtherDeductionService extends AbstractPayrollEmployeeStatusService<PayrollEmployeeOtherDeduction> implements IPayrollEmployeeBaseOperation<PayrollEmployeeOtherDeduction> {
    final PayrollModule payrollModule = PayrollModule.OTHER_DEDUCTION
    private final EmployeeRepository employeeRepository
    private final PayrollEmployeeOtherDeductionRepository payrollEmployeeOtherDeductionRepository

    @Autowired
    PayrollEmployeeOtherDeductionService(EmployeeRepository employeeRepository, PayrollEmployeeOtherDeductionRepository payrollEmployeeOtherDeductionRepository) {
        super(PayrollEmployeeOtherDeduction.class, employeeRepository)
        this.employeeRepository = employeeRepository
        this.payrollEmployeeOtherDeductionRepository = payrollEmployeeOtherDeductionRepository
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    PayrollOtherDeductionItemRepository payrollOtherDeductionItemRepository

    @Autowired
    OtherDeductionTypesRepository otherDeductionTypesRepository
    //=========================== QUERIES ============================


    @GraphQLQuery(name = "getOtherDeductionEmployees")
    Page<PayrollEmployeeOtherDeductionDto> getOtherDeductionEmployees(
            @GraphQLArgument(name = "payroll") UUID payroll,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size,
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "status") List<PayrollEmployeeStatus> status
    ) {
        if (payroll) {
            Page<PayrollEmployeeOtherDeductionDto> pageRes = payrollEmployeeOtherDeductionRepository.getEmployeesPageable(
                    payroll,
                    filter,
                    status.size() > 0 ? status : PayrollEmployeeStatus.values().toList(),
                    PageRequest.of(page, size))

            return pageRes
        } else return null
    }


    @GraphQLQuery(name = "getOtherDeductionEmployeesList")
    List<PayrollEmployeeOtherDeductionDto> getOtherDeductionEmployeesList(
            @GraphQLArgument(name = "payroll") UUID payroll
    ) {
        if (payroll) {
            payrollEmployeeOtherDeductionRepository.getEmployeesList(
                    payroll)
        } else return null
    }

    //=========================== MUTATIONS ============================

    @GraphQLMutation(name = "upsertOtherDeductionItem")
    GraphQLResVal<PayrollOtherDeductionItem> upsertOtherDeductionItem(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "employee") UUID employee,
            @GraphQLArgument(name = "amount") BigDecimal amount,
            @GraphQLArgument(name = "description") String description,
            @GraphQLArgument(name = "deductionType") UUID deductionType,
            @GraphQLArgument(name = "subaccountCode") String subaccountCode


    ) {
        PayrollOtherDeductionItem item = new PayrollOtherDeductionItem()
        if (id) {
            item = payrollOtherDeductionItemRepository.findById(id).get()
        }
        if (employee)
            item.employeeOtherDeduction = payrollEmployeeOtherDeductionRepository.findById(employee).get()

        if (amount)
            item.amount = amount

        if (deductionType) {
            OtherDeductionTypes type = otherDeductionTypesRepository.findById(deductionType).get()
            item.type = type
            item.name = type.name
        }

        if (subaccountCode)
            item.subaccountCode = subaccountCode

        item.description = description ? description : item.description
        item.company = SecurityUtils.currentCompany()
        payrollOtherDeductionItemRepository.save(item)

        return new GraphQLResVal<PayrollOtherDeductionItem>(item, true, "Successfully updated employee otherDeduction status!")
    }


    @GraphQLMutation(name = "updatePayrollEmployeeOtherDeductionStatus")
    GraphQLResVal<PayrollEmployeeOtherDeduction> updateEmployeeStatus(
            @GraphQLArgument(name = "id", description = "ID of the module employee.") UUID id,
            @GraphQLArgument(name = "status", description = "Status of the module employee you want to set.") PayrollEmployeeStatus status
    ) {
        PayrollEmployeeOtherDeduction employee = null
        employee = this.updateStatus(id, status)

        if (!employee) return new GraphQLResVal<PayrollEmployeeOtherDeduction>(null, false, "Failed to update employee otherDeduction status. Please try again later!")
        return new GraphQLResVal<PayrollEmployeeOtherDeduction>(employee, true, "Successfully updated employee otherDeduction status!")
    }


    @GraphQLMutation(name = "deletePayrollOtherDeductionItem")
    GraphQLResVal<String> deletePayrollOtherDeductionItem(
            @GraphQLArgument(name = "id") UUID id
    ) {
        payrollOtherDeductionItemRepository.deleteById(id)
        return new GraphQLResVal<String>('Deleted', true, "Successfully deleted otherDeduction item!")

    }
    //=========================== Interface Methods ============================
    @Override
    PayrollEmployeeOtherDeduction addEmployee(PayrollEmployee payrollEmployee, Payroll payroll) {
        return null
    }

    @Override
    void removeEmployee(PayrollEmployee payrollEmployee, Payroll payroll) {

    }

    @Override
    List<PayrollEmployeeOtherDeduction> addEmployees(List<PayrollEmployee> payrollEmployees, Payroll payroll) {
        CompanySettings company = SecurityUtils.currentCompany()
        PayrollOtherDeduction otherDeduction = payroll.otherDeduction

        List<PayrollEmployeeOtherDeduction> employeeList = []
        if (payrollEmployees.size() > 0) {
            payrollEmployees.each {
                PayrollEmployeeOtherDeduction employee = new PayrollEmployeeOtherDeduction()
                employee.status = PayrollEmployeeStatus.DRAFT
                employee.payrollEmployee = it
                employee.payrollOtherDeduction = otherDeduction
                employee.company = company

                employeeList.push(employee)
            }
        }
        otherDeduction.employees = payrollEmployeeOtherDeductionRepository.saveAll(employeeList)

        payroll.otherDeduction = otherDeduction
        return employeeList
    }

    @Override
    void removeEmployees(List<PayrollEmployee> payrollEmployees, Payroll payroll) {

    }

    @Override
    PayrollEmployeeOtherDeduction recalculateEmployee(PayrollEmployee payrollEmployee, Payroll payroll) {
        PayrollEmployeeOtherDeduction employee = payrollEmployee.employeeOtherDeduction
        employee.deductionItems.clear()
        payrollEmployeeOtherDeductionRepository.save(employee)
        return null
    }

    @Override
    void recalculateAllEmployee(Payroll payroll) {
        List<PayrollEmployeeOtherDeduction> employeeList = []
        payroll.otherDeduction.employees.each {
            PayrollEmployeeOtherDeduction employee = it
            employee.deductionItems.clear()
            employeeList.push(employee)
        }
        employeeList = payrollEmployeeOtherDeductionRepository.saveAll(employeeList)
        payroll.otherDeduction.employees = employeeList
    }


    //================================= UTILITY METHODS ====================================================================


}
