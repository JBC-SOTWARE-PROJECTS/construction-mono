package com.backend.gbp.graphqlservices.payroll

import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.payroll.AccumulatedLogs
import com.backend.gbp.domain.payroll.Payroll
import com.backend.gbp.domain.payroll.PayrollEmployee
import com.backend.gbp.domain.payroll.Timekeeping
import com.backend.gbp.domain.payroll.TimekeepingEmployee
import com.backend.gbp.domain.payroll.enums.PayrollEmployeeStatus
import com.backend.gbp.graphqlservices.hrm.AccumulatedLogsCalculator
import com.backend.gbp.graphqlservices.payroll.common.AbstractPayrollEmployeeStatusService
import com.backend.gbp.graphqlservices.payroll.enums.PayrollModule
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.repository.AccumulatedLogRepository
import com.backend.gbp.repository.TimekeepingEmployeeDto
import com.backend.gbp.repository.TimekeepingEmployeeRepository
import com.backend.gbp.repository.TimekeepingRepository
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.repository.payroll.PayrollRepository
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

import javax.persistence.EntityManager
import javax.persistence.PersistenceContext
import java.time.Instant

@TypeChecked
@Component
@GraphQLApi
class TimekeepingEmployeeService extends AbstractPayrollEmployeeStatusService<TimekeepingEmployee> implements IPayrollEmployeeBaseOperation<TimekeepingEmployee> {

    final PayrollModule payrollModule = PayrollModule.TIMEKEEPING

    @Autowired
    TimekeepingEmployeeRepository timekeepingEmployeeRepository

    @Autowired
    PayrollRepository payrollRepository

    @Autowired
    AccumulatedLogsCalculator accumulatedLogsCalculator

    @Autowired
    AccumulatedLogRepository accumulatedLogRepository

    @PersistenceContext
    EntityManager entityManager

    private final EmployeeRepository employeeRepository

    @Autowired
    TimekeepingEmployeeService(EmployeeRepository employeeRepository) {
        super(TimekeepingEmployee.class, employeeRepository)
        this.employeeRepository = employeeRepository
    }


    @Override
    List<TimekeepingEmployee> addEmployees(List<PayrollEmployee> payrollEmployees, Payroll payroll) {

        Timekeeping timekeeping = payroll.timekeeping
        List<TimekeepingEmployee> timekeepingEmployeeList = []
        if (payrollEmployees.size() > 0) {
            payrollEmployees.each {
                if (!it.isOld) {
                    TimekeepingEmployee timekeepingEmployee = new TimekeepingEmployee()
                    timekeepingEmployee.status = PayrollEmployeeStatus.DRAFT
                    timekeepingEmployee.payrollEmployee = it
                    timekeepingEmployee.timekeeping = timekeeping
                    timekeepingEmployeeList.push(timekeepingEmployee)
                }
            }
        }
        timekeeping.timekeepingEmployees = timekeepingEmployeeRepository.saveAll(timekeepingEmployeeList)
        generateAccumulatedLogs(timekeeping.timekeepingEmployees, payroll)
        payroll.timekeeping = timekeeping
        return timekeepingEmployeeList
    }

    @Override
    void recalculateAllEmployee(Payroll payroll) {
        payroll.timekeeping.timekeepingEmployees
        generateAccumulatedLogs(payroll.timekeeping.timekeepingEmployees, payroll)
    }

    @Override
    TimekeepingEmployee addEmployee(PayrollEmployee payrollEmployee, Payroll payrollModule) {
        return null
    }

    @Override
    void removeEmployee(PayrollEmployee payrollEmployee, Payroll payrollModule) {

    }


    @Override
    void removeEmployees(List<PayrollEmployee> payrollEmployees, Payroll payrollModule) {

    }

    @Override
    TimekeepingEmployee recalculateEmployee(PayrollEmployee payrollEmployee, Payroll payroll) {
        TimekeepingEmployee timekeepingEmployee = payrollEmployee.timekeepingEmployee
        generateAccumulatedLogs([timekeepingEmployee], payroll)
        return null
    }


//============================================================UTILITY METHODS====================================================================

    List<TimekeepingEmployee> generateAccumulatedLogs(List<TimekeepingEmployee> timekeepingEmployees, Payroll payroll) {
        timekeepingEmployees.each { TimekeepingEmployee timekeepingEmployee ->
            timekeepingEmployee.status = PayrollEmployeeStatus.DRAFT
            timekeepingEmployee.accumulatedLogs.clear()
            List<AccumulatedLogs> accumulatedLogs = accumulatedLogsCalculator.getAccumulatedLogs(
                    payroll.dateStart,
                    payroll.dateEnd,
                    timekeepingEmployee.payrollEmployee.employee.id,
                    true)
            accumulatedLogs.each {
                it.timekeepingEmployee = timekeepingEmployee
            }
            accumulatedLogRepository.saveAll(accumulatedLogs)
        }
        timekeepingEmployeeRepository.saveAll(timekeepingEmployees)

    }
//=================================QUERY=================================\\

    @GraphQLQuery(name = "getTimekeepingEmployees", description = "Gets the timekeeping employees by payroll id")
    List<TimekeepingEmployeeDto> getTimekeepingEmployees(@GraphQLArgument(name = "id") UUID id) {
        Payroll payroll = payrollRepository.getOne(id)
        return timekeepingEmployeeRepository.findByTimekeeping(payroll)
    }

    @GraphQLQuery(name = "getTimekeepingEmployeesV2", description = "Gets all the ids of the employees of the timekeeping")
    List<TimekeepingEmployee> getTimekeepingEmployeesV2(@GraphQLArgument(name = "id") UUID id) {
        return timekeepingEmployeeRepository.findByTimekeepingId(id)
    }

    @GraphQLQuery(name = "getTimekeepingEmployeeLogs", description = "Gets all the ids of the employees of the timekeeping")
    List<AccumulatedLogs> getTimekeepingEmployeeLogs(@GraphQLArgument(name = "id") UUID id) {
        return accumulatedLogRepository.findByTimekeepingEmployee(id)?.sort({ it.date })
    }
//
//    List<TimekeepingEmployee> getByIds(@GraphQLArgument(name="getByIds") UUID id) {
//        return timekeepingEmployeeRepository.findByTimekeepingId(id)
//    }

    //=================================MUTATIONS=================================\\
    @Override
    @GraphQLMutation(name = "updateTimekeepingEmployeeStatus")
    GraphQLResVal<TimekeepingEmployee> updateEmployeeStatus(
            @GraphQLArgument(name = "id", description = "ID of the module employee.") UUID id,
            @GraphQLArgument(name = "status", description = "Status of the module employee you want to set.") PayrollEmployeeStatus status
    ) {
        TimekeepingEmployee employee = null
        timekeepingEmployeeRepository.findById(id).ifPresent { employee = it }
        if (!employee) return new GraphQLResVal<TimekeepingEmployee>(null, false, "Failed to update employee timekeeping status. Please try again later!")
        else {
            employee = this.updateStatus(id, status)
            return new GraphQLResVal<TimekeepingEmployee>(employee, true, "Successfully updated employee timekeeping status!")
        }
    }

    @GraphQLMutation(name = "recalculateOneDay")
    GraphQLResVal<String> recalculateOneDay(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "startDate") Instant startDate,
            @GraphQLArgument(name = "endDate") Instant endDate,
            @GraphQLArgument(name = "employeeId") UUID employeeId
    ) {
        AccumulatedLogs accumulatedLogs = accumulatedLogRepository.findById(id).get()
        List<AccumulatedLogs> list = accumulatedLogsCalculator.getAccumulatedLogs(startDate, endDate, employeeId, true)
        list[0].timekeepingEmployee = accumulatedLogs.timekeepingEmployee
        accumulatedLogRepository.delete(accumulatedLogs)
        accumulatedLogRepository.save(list[0])
        return new GraphQLResVal<String>('Success', true, "Successfully recalculated selected date!")

    }


}
