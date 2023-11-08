package com.backend.gbp.graphqlservices.payroll

import com.backend.gbp.domain.hrm.Allowance
import com.backend.gbp.domain.payroll.Payroll
import com.backend.gbp.domain.payroll.PayrollAllowance
import com.backend.gbp.domain.payroll.PayrollAllowanceItem
import com.backend.gbp.domain.payroll.PayrollEmployee
import com.backend.gbp.domain.payroll.PayrollEmployeeAllowance
import com.backend.gbp.domain.payroll.enums.PayrollEmployeeStatus
import com.backend.gbp.graphqlservices.hrm.AllowanceService
import com.backend.gbp.graphqlservices.payroll.common.AbstractPayrollEmployeeStatusService
import com.backend.gbp.graphqlservices.payroll.enums.PayrollModule
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.repository.hrm.AllowanceRepository
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.repository.payroll.PayrollEmployeeAllowanceDto
import com.backend.gbp.repository.payroll.PayrollEmployeeAllowanceItemRepository
import com.backend.gbp.repository.payroll.PayrollEmployeeAllowanceRepository
import com.backend.gbp.repository.payroll.PayrollRepository
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.stereotype.Service

import javax.validation.constraints.NotNull
import java.time.Instant
import java.util.stream.Collectors

@GraphQLApi
@Service
class PayrollEmployeeAllowanceService extends AbstractPayrollEmployeeStatusService<PayrollEmployeeAllowance> implements IPayrollEmployeeBaseOperation<PayrollEmployeeAllowance> {

    final PayrollModule payrollModule = PayrollModule.ALLOWANCE
    private final EmployeeRepository employeeRepository
    private final PayrollEmployeeAllowanceRepository payrollEmployeeAllowanceRepository

    @Autowired
    PayrollEmployeeAllowanceService(EmployeeRepository employeeRepository, PayrollEmployeeAllowanceRepository payrollEmployeeAllowanceRepository) {
        super(PayrollEmployeeAllowance.class, employeeRepository)
        this.employeeRepository = employeeRepository
        this.payrollEmployeeAllowanceRepository = payrollEmployeeAllowanceRepository
    }

    @Autowired
    PayrollEmployeeAllowanceItemRepository payrollEmployeeAllowanceItemRepository

    @Autowired
    PayrollRepository payrollRepository

    @Autowired
    AllowanceRepository allowanceRepository

    @Autowired
    AllowanceService allowanceService

//==============================================Queries==========================================
    @GraphQLQuery(name = "getEmployeesByProfile", description = "Search employees based on allowance criteria")
    List<PayrollEmployeeAllowanceDto> getEmployeesByProfile(
            @GraphQLArgument(name = "department") String department,
            @GraphQLArgument(name = "position") String position,
            @GraphQLArgument(name = "employmentStatus") String employmentStatus,
            @GraphQLArgument(name = "gender") String gender,
            @GraphQLArgument(name = "civilStatus") String civilStatus,
            @GraphQLArgument(name = "startDateBasis") String startDateBasis,
            @GraphQLArgument(name = "duration") Integer duration,
            @GraphQLArgument(name = "date") Instant date,
            @GraphQLArgument(name = "payrollId") UUID payrollId

    ) {
        Instant now = Instant.now()
        println('asd')
        payrollEmployeeAllowanceRepository.getByEmployeeProfile(
                department ? department : '',
                position ? position : '',
                employmentStatus,
                gender,
                civilStatus,
                startDateBasis,
                duration,
                date,
                payrollId
        )
    }

    @GraphQLQuery
    GraphQLResVal<Page<PayrollEmployeeAllowanceDto>> payrollAllowanceEmployees(
            @GraphQLArgument(name = "payroll") UUID payroll,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size,
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "department") UUID department,
            @GraphQLArgument(name = "status") List<PayrollEmployeeStatus> status,
            @GraphQLArgument(name = "withItems") Boolean withItems


    ) {
        Payroll foundPayroll = null
        payrollRepository.findById(payroll).ifPresent { foundPayroll = it }
        if (!foundPayroll) return new GraphQLResVal<Page<PayrollEmployeeAllowanceDto>>(
                null,
                false,
                "Failed to get Payroll Other Deduction Employee List"
        )

        Page<PayrollEmployeeAllowanceDto> employees = payrollEmployeeAllowanceRepository.findAllByPayrollWithItemsWithTotal(
                foundPayroll.id,
                filter,
                department ? department.toString() : "",
                status.size() > 0 ? status : PayrollEmployeeStatus.values().toList(),
                withItems,
                PageRequest.of(page, size))

        return new GraphQLResVal<Page<PayrollEmployeeAllowanceDto>>(
                employees,
                true,
                "Successfully retrieved Payroll Other Deduction Employee List"
        )
    }



//==============================================Mutations========================================
    @Override
    @GraphQLMutation(name = "updatePayrollEmployeeAllowanceStatus")
    GraphQLResVal<PayrollEmployeeAllowance> updateEmployeeStatus(
            @GraphQLArgument(name = "id", description = "ID of the module employee.") UUID id,
            @GraphQLArgument(name = "status", description = "Status of the module employee you want to set.") PayrollEmployeeStatus status
    ) {
        PayrollEmployeeAllowance employee = null
        employee = this.updateStatus(id, status)

        if (!employee) return new GraphQLResVal<PayrollEmployeeAllowance>(null, false, "Failed to update employee allowance status. Please try again later!")
        return new GraphQLResVal<PayrollEmployeeAllowance>(employee, true, "Successfully updated employee allowance status!")
    }

    @GraphQLMutation(name = "updateAllowanceItemAmount")
    GraphQLResVal<PayrollAllowanceItem> updateAllowanceItemAmount(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "amount") BigDecimal amount
    ) {
        try {
            PayrollAllowanceItem allowanceItem = payrollEmployeeAllowanceItemRepository.findById(id).get()
            allowanceItem.amount = amount
            payrollEmployeeAllowanceItemRepository.save(allowanceItem)
            return new GraphQLResVal<PayrollAllowanceItem>(allowanceItem, true, "Successfully updated employee allowance amount!")
        } catch (ignored) {
            return new GraphQLResVal<PayrollAllowanceItem>(null, false, "Failed to update employee allowance amount!")
        }

    }


    @GraphQLMutation(name = "deletePayrollAllowanceItem")
    GraphQLResVal<Boolean> deletePayrollAllowanceItem(
            @GraphQLArgument(name = "id") UUID id
    ) {
        try {
            payrollEmployeeAllowanceItemRepository.deleteById(id)
            return new GraphQLResVal<Boolean>(true, true, "Successfully deleted employee allowance item!")
        } catch (ignored) {
            return new GraphQLResVal<Boolean>(false, false, "Failed to delete employee allowance item!")
        }
    }

    @GraphQLMutation(name = "manualCreateAllowanceItem")
    GraphQLResVal<Boolean> manualCreateAllowanceItem(
            @GraphQLArgument(name = "employeeIds") List<UUID> employeeIds,
            @GraphQLArgument(name = "allowanceId") UUID allowanceId,
            @GraphQLArgument(name = "amount") BigDecimal amount

    ) {
        try {
            Allowance allowance = allowanceRepository.findById(allowanceId).get()
            List<PayrollEmployeeAllowance> employeeList = payrollEmployeeAllowanceRepository.findAllById(employeeIds)
            List<PayrollAllowanceItem> allowanceItemList = []

            employeeList.each {
                PayrollAllowanceItem allowanceItem = new PayrollAllowanceItem()
                allowanceItem.allowance = allowance.id as UUID
                allowanceItem.name = allowance.name
                allowanceItem.amount = amount
                allowanceItem.originalAmount = amount
                allowanceItem.payrollEmployeeAllowance = it
                allowanceItemList.push(allowanceItem)
            }
            payrollEmployeeAllowanceItemRepository.saveAll(allowanceItemList)

            return new GraphQLResVal<Boolean>(true, true, "Successfully created employee allowance items")
        } catch (ignored) {
            return new GraphQLResVal<Boolean>(false, false, "Failed to create employee allowance items")
        }
    }


    @Override
    List<PayrollEmployeeAllowance> addEmployees(List<PayrollEmployee> payrollEmployees, Payroll payroll) {

        PayrollAllowance allowance = payroll.allowance

        List<PayrollEmployeeAllowance> payrollEmployeeAllowanceList = []
        if (payrollEmployees.size() > 0) {
            payrollEmployees.each {
                PayrollEmployeeAllowance payrollEmployeeAllowance = new PayrollEmployeeAllowance()
                payrollEmployeeAllowance.status = PayrollEmployeeStatus.DRAFT
                payrollEmployeeAllowance.payrollEmployee = it
                payrollEmployeeAllowance.allowance = allowance
                payrollEmployeeAllowanceList.push(payrollEmployeeAllowance)
            }
        }
        allowance.allowanceEmployees = payrollEmployeeAllowanceRepository.saveAll(payrollEmployeeAllowanceList)

        payrollEmployeeAllowanceItemRepository.saveAll(generateAllowanceItems(allowance.allowanceEmployees, payroll.dateEnd))
        payroll.allowance = allowance
        return payrollEmployeeAllowanceList
    }


    @Override
    void recalculateAllEmployee(Payroll payroll) {

        payroll.allowance.allowanceEmployees.each {
            it.status = PayrollEmployeeStatus.DRAFT
            it.allowanceItems.clear()
        }
        payrollEmployeeAllowanceItemRepository.saveAll(generateAllowanceItems(payroll.allowance.allowanceEmployees, payroll.dateEnd))

    }

    @Override
    PayrollEmployeeAllowance addEmployee(PayrollEmployee payrollEmployee, Payroll payrollModule) {
        return null
    }

    @Override
    void removeEmployee(PayrollEmployee payrollEmployee, Payroll payrollModule) {

    }


    @Override
    void removeEmployees(List<PayrollEmployee> payrollEmployees, Payroll payrollModule) {

    }

    @Override
    PayrollEmployeeAllowance recalculateEmployee(PayrollEmployee payrollEmployee, Payroll payroll) {
        payrollEmployee.allowanceEmployee.allowanceItems.clear()
        payrollEmployee.allowanceEmployee.status = PayrollEmployeeStatus.DRAFT
        payrollEmployeeAllowanceItemRepository.saveAll(generateAllowanceItems([payrollEmployee.allowanceEmployee], payroll.dateEnd))

        return null
    }


//============================================================UTILITY METHODS====================================================================
    private List<PayrollAllowanceItem> generateAllowanceItems(List<PayrollEmployeeAllowance> allowanceEmployees, Instant payrollEndDate) {

        List<PayrollAllowanceItem> allowanceItemList = []

        List<UUID> uuidList = allowanceEmployees.stream().map({ PayrollEmployeeAllowance e -> e.payrollEmployee.employee.id }).collect(Collectors.toList())

        LinkedList<Map<String, Object>> employeeAllowances = allowanceService.getEmployeeAllowanceInId(uuidList, payrollEndDate)
        while (!employeeAllowances.isEmpty()) {
            Map<String, Object> element = employeeAllowances.poll()
            PayrollAllowanceItem allowanceItem = new PayrollAllowanceItem()
            allowanceItem.allowance = element['allowance_id'] as UUID
            allowanceItem.name = element['allowance']
            allowanceItem.amount = element['amount'] as BigDecimal
            allowanceItem.originalAmount = element['amount'] as BigDecimal
            allowanceItem.taxable = element['taxable']
            allowanceItem.payrollEmployeeAllowance = allowanceEmployees.stream().filter({ PayrollEmployeeAllowance e -> ((element['id'] as UUID) == e.payrollEmployee.employee.id) }).findFirst().get()
            allowanceItemList.push(allowanceItem)
        }

        allowanceItemList

    }


}
