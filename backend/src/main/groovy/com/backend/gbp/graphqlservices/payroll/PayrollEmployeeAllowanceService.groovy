package com.backend.gbp.graphqlservices.payroll

import com.backend.gbp.domain.hrm.Allowance
import com.backend.gbp.domain.hrm.EmployeeAllowance
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
import com.backend.gbp.repository.hrm.EmployeeAllowanceRepository
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.repository.payroll.PayrollAllowanceItemRepository
import com.backend.gbp.repository.payroll.PayrollEmployeeAllowanceDto
import com.backend.gbp.repository.payroll.PayrollEmployeeAllowanceRepository
import com.backend.gbp.repository.payroll.PayrollEmployeeRepository
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
    PayrollAllowanceItemRepository payrollAllowanceItemRepository

    @Autowired
    PayrollRepository payrollRepository

    @Autowired
    AllowanceRepository allowanceRepository

    @Autowired
    PayrollEmployeeRepository payrollEmployeeRepository

    @Autowired
    EmployeeAllowanceRepository employeeAllowanceRepository
//==============================================Queries==========================================

    @GraphQLQuery(name = 'getPayrollEmployeeAllowance')
    Page<PayrollEmployeeAllowanceDto> getPayrollEmployeeAllowance(
            @GraphQLArgument(name = "payroll") UUID payroll,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size,
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "status") List<PayrollEmployeeStatus> status,
            @GraphQLArgument(name = "withItems") Boolean withItems
    ) {
        Payroll foundPayroll = null
        payrollRepository.findById(payroll).ifPresent { foundPayroll = it }
//        if (!foundPayroll) return new GraphQLResVal<Page<PayrollEmployeeAllowanceDto>>(
//                null,
//                false,
//                "Failed to get Payroll Other Deduction Employee List"
//        )

        Page<PayrollEmployeeAllowanceDto> employees = payrollEmployeeAllowanceRepository.findAllByPayrollWithItemsWithTotal(
                foundPayroll.id,
                filter,
                status.size() > 0 ? status : PayrollEmployeeStatus.values().toList(),
                withItems,
                PageRequest.of(page, size))

        return employees
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
            PayrollAllowanceItem allowanceItem = payrollAllowanceItemRepository.findById(id).get()
            allowanceItem.amount = amount
            payrollAllowanceItemRepository.save(allowanceItem)
            return new GraphQLResVal<PayrollAllowanceItem>(allowanceItem, true, "Successfully updated employee allowance amount!")
        } catch (ignored) {
            return new GraphQLResVal<PayrollAllowanceItem>(null, false, "Failed to update employee allowance amount!")
        }

    }

//
    @GraphQLMutation(name = "deletePayrollAllowanceItem")
    GraphQLResVal<Boolean> deletePayrollAllowanceItem(
            @GraphQLArgument(name = "id") UUID id
    ) {
        try {
            payrollAllowanceItemRepository.deleteById(id)
            return new GraphQLResVal<Boolean>(true, true, "Successfully deleted employee allowance item!")
        } catch (ignored) {
            return new GraphQLResVal<Boolean>(false, false, "Failed to delete employee allowance item!")
        }
    }

    @GraphQLMutation(name = "upsertPayrollAllowanceItem")
    GraphQLResVal<Boolean> upsertPayrollAllowanceItem(
            @GraphQLArgument(name = "employeeId") UUID employeeId,
            @GraphQLArgument(name = "allowanceId") UUID allowanceId,
            @GraphQLArgument(name = "amount") BigDecimal amount

    ) {
        Allowance allowance = allowanceRepository.findById(allowanceId).get()
        PayrollEmployeeAllowance employee = payrollEmployeeAllowanceRepository.findById(employeeId).get()

        PayrollAllowanceItem allowanceItem = new PayrollAllowanceItem()
        allowanceItem.allowance = allowance
        allowanceItem.name = allowance.name
        allowanceItem.amount = amount
        allowanceItem.originalAmount = allowance.amount
        allowanceItem.payrollEmployeeAllowance = employee
        payrollAllowanceItemRepository.save(allowanceItem)
        return new GraphQLResVal<Boolean>(true, true, "Successfully created employee allowance items")

    }

    @GraphQLMutation(name = "generateDailyAllowances")
    GraphQLResVal<Boolean> generateDailyAllowances(
            @GraphQLArgument(name = "payrollId") UUID payrollId,
            @GraphQLArgument(name = "payrollEmployeeId") UUID payrollEmployeeId
    ) {
        List<PayrollAllowanceItem> allowanceItemList = []

        if (payrollId) {
            Payroll payroll = payrollRepository.findById(payrollId).get()
            payrollAllowanceItemRepository.deleteAll(payrollAllowanceItemRepository.findAttendanceBasedByAllowanceId(payroll.allowance.id))
            payroll.payrollEmployees.each { payrollEmployee ->
                generateDailyAllowance(payrollEmployee, allowanceItemList)
            }
        }
        if (payrollEmployeeId) {
            payrollAllowanceItemRepository.deleteAll(payrollAllowanceItemRepository.findAttendanceBasedByPayrollEmployeeId(payrollEmployeeId))
            PayrollEmployee payrollEmployee = payrollEmployeeRepository.findById(payrollEmployeeId).get()
            generateDailyAllowance(payrollEmployee, allowanceItemList)
        }
        payrollAllowanceItemRepository.saveAll(allowanceItemList)
        return new GraphQLResVal<Boolean>(true, true, "Successfully regenerated daily allowance")

    }

    private static generateDailyAllowance(PayrollEmployee payrollEmployee, allowanceItemList) {
        List<EmployeeAllowance> allowanceItems = []
        payrollEmployee.employee.allowanceItems.each {
            if (it.allowance.isAttendanceBased) allowanceItems.push(it)
        }
        allowanceItems.each {
            PayrollAllowanceItem allowanceItem = new PayrollAllowanceItem()
            allowanceItem.allowance = it.allowance
            allowanceItem.amount = 0
            allowanceItem.originalAmount = 0
            allowanceItem.payrollEmployeeAllowance = payrollEmployee.allowanceEmployee
            Integer count = 0
            payrollEmployee.timekeepingEmployee.accumulatedLogs.each { accumulatedLogs ->
                if (accumulatedLogs.inTime && accumulatedLogs.outTime) {
                    allowanceItem.amount += it.amount
                    allowanceItem.originalAmount += it.amount
                    count++
                }
            }
            allowanceItem.name = """${it.name} (${count} day(s) x PHP ${it.amount})"""
            allowanceItemList.push(allowanceItem)


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

        payrollAllowanceItemRepository.saveAll(generateAllowanceItems(allowance.allowanceEmployees))
        payroll.allowance = allowance
        return payrollEmployeeAllowanceList
    }


    @Override
    void recalculateAllEmployee(Payroll payroll) {

        payroll.allowance.allowanceEmployees.each {
            it.status = PayrollEmployeeStatus.DRAFT
            it.allowanceItems.clear()
        }
        payrollAllowanceItemRepository.saveAll(generateAllowanceItems(payroll.allowance.allowanceEmployees))

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
        payrollAllowanceItemRepository.saveAll(generateAllowanceItems([payrollEmployee.allowanceEmployee]))

        return null
    }


//============================================================UTILITY METHODS====================================================================
    private List<PayrollAllowanceItem> generateAllowanceItems(List<PayrollEmployeeAllowance> allowanceEmployees) {

        List<PayrollAllowanceItem> allowanceItemList = []

        List<UUID> uuidList = allowanceEmployees.stream().map({ PayrollEmployeeAllowance e -> e.payrollEmployee.employee.id }).collect(Collectors.toList())

        employeeAllowanceRepository.joinFetchEmployeeAllowance(uuidList)
        allowanceEmployees.each { PayrollEmployeeAllowance employeeAllowance ->
            employeeAllowance.payrollEmployee.employee.allowanceItems.each {
                PayrollAllowanceItem allowanceItem = new PayrollAllowanceItem()
                if (!it.allowance.isAttendanceBased) {
                    allowanceItem.allowance = it.allowance
                    allowanceItem.name = it.name
                    allowanceItem.amount = it.amount
                    allowanceItem.originalAmount = it.amount
//                allowanceItem.taxable = null
                    allowanceItem.payrollEmployeeAllowance = employeeAllowance
                    allowanceItemList.push(allowanceItem)
                }
            }
        }
        allowanceItemList

    }


}
