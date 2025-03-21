package com.backend.gbp.graphqlservices.payroll

import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.payroll.Payroll
import com.backend.gbp.domain.payroll.PayrollContribution
import com.backend.gbp.domain.payroll.PayrollEmployee
import com.backend.gbp.domain.payroll.PayrollEmployeeContribution
import com.backend.gbp.domain.payroll.PayrollEmployeeContributionsView
import com.backend.gbp.domain.payroll.enums.PayrollEmployeeStatus
import com.backend.gbp.graphqlservices.payroll.common.AbstractPayrollEmployeeStatusService
import com.backend.gbp.graphqlservices.payroll.enums.PayrollModule
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.repository.payroll.PayrollEmployeeContributionDto
import com.backend.gbp.repository.payroll.PayrollEmployeeContributionRepository
import com.backend.gbp.repository.payroll.PayrollEmployeeContributionsViewRepository
import com.backend.gbp.repository.payroll.PayrollEmployeeRepository
import com.backend.gbp.security.SecurityUtils
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service

import javax.validation.constraints.NotNull

@GraphQLApi
@Service
class PayrollEmployeeContributionService extends AbstractPayrollEmployeeStatusService<PayrollEmployeeContribution> implements IPayrollEmployeeBaseOperation<PayrollEmployeeContribution> {
    final PayrollModule payrollModule = PayrollModule.CONTRIBUTION
    private final EmployeeRepository employeeRepository
    private final PayrollEmployeeContributionRepository payrollEmployeeContributionRepository

    @Autowired
    PayrollEmployeeContributionService(EmployeeRepository employeeRepository, PayrollEmployeeContributionRepository payrollEmployeeContributionRepository) {
        super(PayrollEmployeeContribution.class, employeeRepository)
        this.employeeRepository = employeeRepository
        this.payrollEmployeeContributionRepository = payrollEmployeeContributionRepository
    }
    @Autowired
    PayrollEmployeeContributionsViewRepository payrollEmployeeContributionsViewRepository

    @Autowired
    PayrollEmployeeRepository payrollEmployeeRepository

    //=========================== QUERIES ============================


    @GraphQLMutation(name = "updateEmployeeContributionStatus")
    GraphQLResVal<PayrollEmployeeContribution> updateEmployeeContributionStatus(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "contributionType") String contributionType
    ) {
        PayrollEmployeeContribution employee = payrollEmployeeContributionRepository.findById(id).get()

        if (!employee) return new GraphQLResVal<PayrollEmployeeContribution>(
                null,
                false,
                "Failed to update employee contribution status. Please try again later!")

        if (contributionType == 'SSS')
            employee.isActiveSSS = !employee.isActiveSSS
        else if (contributionType == 'PHIC')
            employee.isActivePHIC = !employee.isActivePHIC
        else if (contributionType == 'HDMF')
            employee.isActiveHDMF = !employee.isActiveHDMF

        generateTotal(employee)
        recalculateEmployee(employee.payrollEmployee, employee.contribution.payroll)
        payrollEmployeeContributionRepository.save(employee)
        return new GraphQLResVal<PayrollEmployeeContribution>(
                employee,
                true,
                "Successfully updated employee contribution status!")
    }


    @GraphQLMutation(name = "updatePayrollEmployeeContributionStatus")
    GraphQLResVal<PayrollEmployeeContribution> updateEmployeeStatus(
            @GraphQLArgument(name = "id", description = "ID of the module employee.") UUID id,
            @GraphQLArgument(name = "status", description = "Status of the module employee you want to set.") PayrollEmployeeStatus status
    ) {
        PayrollEmployeeContribution employee = null
        employee = this.updateStatus(id, status)
        if (status == PayrollEmployeeStatus.DRAFT) {
            PayrollEmployee payrollEmployee = payrollEmployeeRepository.findById(employee.payrollEmployee.id).get()
            payrollEmployee.status = PayrollEmployeeStatus.DRAFT
            payrollEmployeeRepository.save(payrollEmployee)
        }

        if (!employee) return new GraphQLResVal<PayrollEmployeeContribution>(null, false, "Failed to update employee contribution status. Please try again later!")
        return new GraphQLResVal<PayrollEmployeeContribution>(employee, true, "Successfully updated employee contribution status!")
    }

    @GraphQLQuery(name = "getContributionEmployeesByPayrollId", description = "Get contribution by ID, this query is pagable")
    GraphQLResVal<Page<PayrollEmployeeContributionDto>> getContributionEmployeesByPayrollId(
            @GraphQLArgument(name = "payroll") UUID payroll,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size,
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "status") List<PayrollEmployeeStatus> status
    ) {
        if (payroll) {
            Page<PayrollEmployeeContributionDto> employees = payrollEmployeeContributionRepository.findAllByPayroll(
                    payroll,
                    filter,
                    status.size() > 0 ? status : PayrollEmployeeStatus.values().toList(),
                    PageRequest.of(page, size))

            return new GraphQLResVal<Page<PayrollEmployeeContributionDto>>(
                    employees,
                    true,
                    "Successfully retrieved Payroll Other Deduction Employee List")
        } else {
            return null
        }

    }

//    @GraphQLQuery
//    List<Department> getContributionDepartments(
//            @GraphQLArgument(name = "payroll") @NotNull UUID payroll
//    ) {
//        return payrollEmployeeContributionRepository.getDepartment(payroll)
//    }


    @Override
    PayrollEmployeeContribution addEmployee(PayrollEmployee payrollEmployee, Payroll payroll) {
        return null
    }

    @Override
    void removeEmployee(PayrollEmployee payrollEmployee, Payroll payroll) {

    }

    @Override
    List<PayrollEmployeeContribution> addEmployees(List<PayrollEmployee> payrollEmployees, Payroll payroll) {
        CompanySettings company = SecurityUtils.currentCompany()
        PayrollContribution contribution = payroll.contribution

        List<PayrollEmployeeContribution> employeeList = []
        if (payrollEmployees.size() > 0) {
            payrollEmployees.each {
                PayrollEmployeeContribution employee = new PayrollEmployeeContribution()

                employee.status = PayrollEmployeeStatus.DRAFT
                employee.payrollEmployee = it
                employee.contribution = contribution
                employee.company = company
                employee.basicSalary = it.employee.basicSalary
                resetEmployeeContribution(employee, contribution)
                employeeList.push(employee)
            }
        }
        contribution.contributionEmployees = payrollEmployeeContributionRepository.saveAll(employeeList)

        payroll.contribution = contribution
        return employeeList
    }

    @Override
    void removeEmployees(List<PayrollEmployee> payrollEmployees, Payroll payroll) {

    }

    @Override
    PayrollEmployeeContribution recalculateEmployee(PayrollEmployee payrollEmployee, Payroll payroll) {
        PayrollEmployeeContribution employee = payrollEmployee.payrollEmployeeContribution
        employee.status = PayrollEmployeeStatus.DRAFT
        resetEmployeeContribution(employee, payroll.contribution)
        payrollEmployee.status = PayrollEmployeeStatus.DRAFT
        payrollEmployeeRepository.save(payrollEmployee)
        payrollEmployeeContributionRepository.save(employee)
        return null
    }

    @Override
    void recalculateAllEmployee(Payroll payroll) {
        List<PayrollEmployeeContribution> employeeList = []
        payroll.contribution.contributionEmployees.each {
            PayrollEmployeeContribution employee = it
            employee.status = PayrollEmployeeStatus.DRAFT
            resetEmployeeContribution(employee, payroll.contribution)
            employeeList.push(employee)
        }
        List<PayrollEmployee> payrollEmployees = payrollEmployeeRepository.findByPayrollId(payroll.id)
        payrollEmployees.each {
            it.status = PayrollEmployeeStatus.DRAFT
        }
        payrollEmployeeRepository.saveAll(payrollEmployees)
        employeeList = payrollEmployeeContributionRepository.saveAll(employeeList)
        payroll.contribution.contributionEmployees = employeeList
    }


    //================================= UTILITY METHODS ====================================================================
    private void resetEmployeeContribution(PayrollEmployeeContribution employee, PayrollContribution contribution) {
        Employee emp = employee.payrollEmployee.employee

        employee.isActiveSSS = emp.isActiveSSS
        employee.isActivePHIC = emp.isActivePHIC
        employee.isActiveHDMF = emp.isActiveHDMF
        assignContributionAmounts(employee, contribution)
    }


    private void assignContributionAmounts(PayrollEmployeeContribution employee, PayrollContribution contribution) {
        PayrollEmployeeContributionsView employeeView = payrollEmployeeContributionsViewRepository.findById(employee.payrollEmployee.employee.id).get()

        Boolean isActiveSSS = contribution.isActiveSSS && employee.payrollEmployee.employee.isActiveSSS
        Boolean isActivePHIC = contribution.isActivePHIC && employee.payrollEmployee.employee.isActivePHIC
        Boolean isActiveHDMF = contribution.isActiveHDMF && employee.payrollEmployee.employee.isActiveHDMF

        if (isActiveSSS) {
            employee.sssEE = employeeView?.sssEE ? employeeView?.sssEE : 0.00
            employee.sssER = (employeeView?.sssER ?: 0.00) + (employeeView?.sssER_EC ?: 0.00)
            employee.sssWispEE = employeeView?.sssWispEE ?: 0.00
            employee.sssWispER = employeeView?.sssWispER ?: 0.00
        } else {
            employee.sssEE = 0.00
            employee.sssER = 0.00
            employee.sssWispEE = 0.00
            employee.sssWispER = 0.00
        }

        if (isActivePHIC) {
            employee.phicEE = employeeView?.phicEE ?: 0.00
            employee.phicER = employeeView?.phicER ?: 0.00
        } else {
            employee.phicEE = 0.00
            employee.phicER = 0.00
        }

        if (isActiveHDMF) {
            employee.hdmfEE = employeeView?.hdmfEE ?: 0.00
            employee.hdmfER = employeeView?.hdmfER ?: 0.00
        } else {
            employee.hdmfEE = 0.00
            employee.hdmfER = 0.00

            employee.basicSalary = employeeView?.basicSalary ?: 0.00
        }
    }


}
