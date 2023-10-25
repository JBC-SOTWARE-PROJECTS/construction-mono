package com.backend.gbp.graphqlservices.payroll

import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.payroll.*
import com.backend.gbp.domain.payroll.enums.PayrollEmployeeStatus
import com.backend.gbp.graphqlservices.payroll.common.AbstractPayrollEmployeeStatusService
import com.backend.gbp.graphqlservices.payroll.enums.PayrollModule
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.repository.payroll.PayrollEmployeeAdjustmentRepository
import com.backend.gbp.security.SecurityUtils
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



    //=========================== QUERIES ============================


   


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

//    @GraphQLQuery(name = "getAdjustmentEmployeesByPayrollId", description = "Get adjustment by ID, this query is pagable")
//    GraphQLResVal<Page<PayrollEmployeeAdjustmentDto>> getAdjustmentEmployeesByPayrollId(
//            @GraphQLArgument(name = "payroll") UUID payroll,
//            @GraphQLArgument(name = "page") Integer page,
//            @GraphQLArgument(name = "size") Integer size,
//            @GraphQLArgument(name = "filter") String filter,
//            @GraphQLArgument(name = "status") List<PayrollEmployeeStatus> status
//    ) {
//        if (payroll) {
//            Page<PayrollEmployeeAdjustmentDto> employees = payrollEmployeeAdjustmentRepository.findAllByPayroll(
//                    payroll,
//                    filter,
//                    status.size() > 0 ? status : PayrollEmployeeStatus.values().toList(),
//                    PageRequest.of(page, size))
//
//            return new GraphQLResVal<Page<PayrollEmployeeAdjustmentDto>>(
//                    employees,
//                    true,
//                    "Successfully retrieved Payroll Other Deduction Employee List")
//        } else {
//            return null
//        }
//
//    }

//    @GraphQLQuery
//    List<Department> getAdjustmentDepartments(
//            @GraphQLArgument(name = "payroll") @NotNull UUID payroll
//    ) {
//        return payrollEmployeeAdjustmentRepository.getDepartment(payroll)
//    }


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
//
//                employee.status = PayrollEmployeeStatus.DRAFT
//                employee.payrollEmployee = it
//                employee.adjustment = adjustment
//                employee.company = company
//                employee.basicSalary = it.employee.basicSalary
//                resetEmployeeAdjustment(employee)

                employeeList.push(employee)
            }
        }
//        adjustment.employees = payrollEmployeeAdjustmentRepository.saveAll(employeeList)

        payroll.adjustment = adjustment
        return employeeList
    }

    @Override
    void removeEmployees(List<PayrollEmployee> payrollEmployees, Payroll payroll) {

    }

    @Override
    PayrollEmployeeAdjustment recalculateEmployee(PayrollEmployee payrollEmployee, Payroll payroll) {
        PayrollEmployeeAdjustment employee = payrollEmployee.employeeAdjustment
        payrollEmployeeAdjustmentRepository.save(employee)
        return null
    }

    @Override
    void recalculateAllEmployee(Payroll payroll) {
        List<PayrollEmployeeAdjustment> employeeList = []
        payroll.adjustment.employees.each {
            PayrollEmployeeAdjustment employee = it
            employeeList.push(employee)
        }
        employeeList = payrollEmployeeAdjustmentRepository.saveAll(employeeList)
        payroll.adjustment.employees = employeeList
    }


    //================================= UTILITY METHODS ====================================================================
  

}
