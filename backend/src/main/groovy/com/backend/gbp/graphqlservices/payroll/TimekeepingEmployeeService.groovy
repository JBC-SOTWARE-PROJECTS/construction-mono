package com.backend.gbp.graphqlservices.payroll

import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.hrm.SalaryRateMultiplier
import com.backend.gbp.domain.hrm.dto.EmployeeSalaryDto
import com.backend.gbp.domain.hrm.dto.HoursLog
import com.backend.gbp.domain.payroll.AccumulatedLogs
import com.backend.gbp.domain.payroll.Payroll
import com.backend.gbp.domain.payroll.PayrollEmployee
import com.backend.gbp.domain.payroll.Timekeeping
import com.backend.gbp.domain.payroll.TimekeepingEmployee
import com.backend.gbp.domain.payroll.enums.PayrollEmployeeStatus
import com.backend.gbp.graphqlservices.hrm.AccumulatedLogsCalculator
import com.backend.gbp.graphqlservices.hrm.SalaryRateMultiplierService
import com.backend.gbp.graphqlservices.payroll.common.AbstractPayrollEmployeeStatusService
import com.backend.gbp.graphqlservices.payroll.enums.PayrollModule
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.repository.AccumulatedLogRepository
import com.backend.gbp.repository.TimekeepingEmployeeDto
import com.backend.gbp.repository.TimekeepingEmployeeRepository
import com.backend.gbp.repository.TimekeepingRepository
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.repository.payroll.PayrollEmployeeRepository
import com.backend.gbp.repository.payroll.PayrollRepository
import com.backend.gbp.security.SecurityUtils
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

import javax.persistence.EntityManager
import javax.persistence.PersistenceContext
import java.math.RoundingMode
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

    @Autowired
    SalaryRateMultiplierService salaryRateMultiplierService

    @Autowired
    PayrollEmployeeRepository payrollEmployeeRepository

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
        CompanySettings company = SecurityUtils.currentCompany()
        Timekeeping timekeeping = payroll.timekeeping
        List<TimekeepingEmployee> timekeepingEmployeeList = []
        if (payrollEmployees.size() > 0) {
            payrollEmployees.each {
                if (!it.isOld) {
                    TimekeepingEmployee timekeepingEmployee = new TimekeepingEmployee()
                    timekeepingEmployee.status = PayrollEmployeeStatus.DRAFT
                    timekeepingEmployee.payrollEmployee = it
                    timekeepingEmployee.timekeeping = timekeeping
                    timekeepingEmployee.company = company
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
        List<PayrollEmployee> payrollEmployees = payrollEmployeeRepository.findByPayrollId(payroll.id)
        payrollEmployees.each {
            it.status = PayrollEmployeeStatus.DRAFT
        }
        payrollEmployeeRepository.saveAll(payrollEmployees)
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
        payrollEmployee.status = PayrollEmployeeStatus.DRAFT
        payrollEmployeeRepository.save(payrollEmployee)
        generateAccumulatedLogs([timekeepingEmployee], payroll)
        return null
    }


//============================================================UTILITY METHODS====================================================================

    List<TimekeepingEmployee> generateAccumulatedLogs(List<TimekeepingEmployee> timekeepingEmployees, Payroll payroll) {
        CompanySettings company = SecurityUtils.currentCompany()
        timekeepingEmployees.each { TimekeepingEmployee timekeepingEmployee ->
            timekeepingEmployee.status = PayrollEmployeeStatus.DRAFT
            timekeepingEmployee.accumulatedLogs.clear()
            List<AccumulatedLogs> accumulatedLogs = accumulatedLogsCalculator.getAccumulatedLogs(payroll.dateStart,
                    payroll.dateEnd,
                    timekeepingEmployee.payrollEmployee.employee.id,
                    true,
                    timekeepingEmployee.payrollEmployee.employee)
            accumulatedLogs.each {
                it.company = company
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
    GraphQLResVal<TimekeepingEmployee> updateEmployeeStatus(@GraphQLArgument(name = "id", description = "ID of the module employee.") UUID id,
                                                            @GraphQLArgument(name = "status", description = "Status of the module employee you want to set.") PayrollEmployeeStatus status) {
        TimekeepingEmployee timekeepingEmployee = null
        timekeepingEmployeeRepository.findById(id).ifPresent { timekeepingEmployee = it }
        if (!timekeepingEmployee) return new GraphQLResVal<TimekeepingEmployee>(null, false, "Failed to update employee timekeeping status. Please try again later!") else {

            timekeepingEmployee = this.updateStatus(id, status)
            Map<String, HoursLog> employeeBreakdownMap = new HashMap<>()
            SalaryRateMultiplier multiplier = salaryRateMultiplierService.getSalaryRateMultiplier()

            if (status == PayrollEmployeeStatus.FINALIZED) {
                timekeepingEmployee.projectBreakdown = []
                timekeepingEmployee.salaryBreakdown = []
                if (timekeepingEmployee.payrollEmployee.employee.isExcludedFromAttendance) {
                    EmployeeSalaryDto salaryDto = calculateSalaryBreakdown(multiplier, null, timekeepingEmployee.payrollEmployee.employee)
                    timekeepingEmployee.salaryBreakdown.push(salaryDto)
                    timekeepingEmployee.totalSalary = salaryDto
                } else {
                    timekeepingEmployee.accumulatedLogs.each { AccumulatedLogs accumulatedLogs ->
                        accumulatedLogs.projectBreakdown.each {
                            TimekeepingService.consolidateProjectBreakdown(employeeBreakdownMap, it)
                        }
                    }
                    HoursLog totalHours = new HoursLog()
                    totalHours.late = 0
                    totalHours.underTime = 0
                    totalHours.absent = 0
                    totalHours.regular = 0
                    totalHours.overtime = 0
                    totalHours.regularHoliday = 0
                    totalHours.overtimeHoliday = 0
                    totalHours.regularDoubleHoliday = 0
                    totalHours.overtimeDoubleHoliday = 0
                    totalHours.regularSpecialHoliday = 0
                    totalHours.overtimeSpecialHoliday = 0

                    EmployeeSalaryDto totalSalary = new EmployeeSalaryDto()
                    totalSalary.late = 0
                    totalSalary.underTime = 0
                    totalSalary.absent = 0
                    totalSalary.regular = 0
                    totalSalary.overtime = 0
                    totalSalary.regularHoliday = 0
                    totalSalary.overtimeHoliday = 0
                    totalSalary.regularDoubleHoliday = 0
                    totalSalary.overtimeDoubleHoliday = 0
                    totalSalary.regularSpecialHoliday = 0
                    totalSalary.overtimeSpecialHoliday = 0

                    employeeBreakdownMap.keySet().each {
                        HoursLog hoursLog = employeeBreakdownMap.get(it.toString())

                        totalHours.late += hoursLog.late
                        totalHours.underTime += hoursLog.underTime
                        totalHours.absent += hoursLog.absent
                        totalHours.regular += hoursLog.regular
                        totalHours.overtime += hoursLog.overtime
                        totalHours.regularHoliday += hoursLog.regularHoliday
                        totalHours.overtimeHoliday += hoursLog.overtimeHoliday
                        totalHours.regularDoubleHoliday += hoursLog.regularDoubleHoliday
                        totalHours.overtimeDoubleHoliday += hoursLog.overtimeDoubleHoliday
                        totalHours.regularSpecialHoliday += hoursLog.regularSpecialHoliday
                        totalHours.overtimeSpecialHoliday += hoursLog.overtimeSpecialHoliday

                        timekeepingEmployee.projectBreakdown.push(hoursLog)
                        timekeepingEmployee.salaryBreakdown.push(calculateSalaryBreakdown(multiplier, hoursLog, timekeepingEmployee.payrollEmployee.employee))
                        timekeepingEmployee.salaryBreakdown.each {
                            totalSalary.late += it.late
                            totalSalary.underTime += it.underTime
                            totalSalary.absent += it.absent
                            totalSalary.regular += it.regular
                            totalSalary.overtime += it.overtime
                            totalSalary.regularHoliday += it.regularHoliday
                            totalSalary.overtimeHoliday += it.overtimeHoliday
                            totalSalary.regularDoubleHoliday += it.regularDoubleHoliday
                            totalSalary.overtimeDoubleHoliday += it.overtimeDoubleHoliday
                            totalSalary.regularSpecialHoliday += it.regularSpecialHoliday
                            totalSalary.overtimeSpecialHoliday += it.overtimeSpecialHoliday
                        }
                    }
                    timekeepingEmployee.totalHours = totalHours
                    timekeepingEmployee.totalSalary = totalSalary
                }
            } else {
                PayrollEmployee payrollEmployee = payrollEmployeeRepository.findById(timekeepingEmployee.payrollEmployee.id).get()
                payrollEmployee.status = PayrollEmployeeStatus.DRAFT
                payrollEmployeeRepository.save(payrollEmployee)


            }
            timekeepingEmployeeRepository.save(timekeepingEmployee)
            return new GraphQLResVal<TimekeepingEmployee>(timekeepingEmployee, true, "Successfully updated employee timekeeping status!")
        }
    }


    static EmployeeSalaryDto calculateSalaryBreakdown(SalaryRateMultiplier multiplier, HoursLog hoursLog, Employee employee) {
        EmployeeSalaryDto salaryBreakDown = new EmployeeSalaryDto()
        Integer daysInCutoff = 12

        BigDecimal hourlyRate
        if (employee?.isExcludedFromAttendance) {
            salaryBreakDown.company = employee.currentCompany.id
            salaryBreakDown.companyName = employee.currentCompany.companyName
            salaryBreakDown.regular = employee.monthlyRate
            return salaryBreakDown
        }
        if (employee?.isFixedRate) {
            BigDecimal dailyRate = (employee.monthlyRate / 2) / daysInCutoff
            hourlyRate = dailyRate / 8
        } else {
            hourlyRate = employee.hourlyRate
        }

        if (hoursLog.project) {
            salaryBreakDown.project = hoursLog.project
            salaryBreakDown.projectName = hoursLog.projectName
        } else {
            salaryBreakDown.company = hoursLog.company
            salaryBreakDown.companyName = hoursLog.companyName
        }

        BigDecimal additionalRegular = 0
        BigDecimal additionalOvertime = 0
        BigDecimal totalOvertimeHours = hoursLog.overtimeHoliday +
                hoursLog.overtimeSpecialHoliday +
                hoursLog.overtimeDoubleHoliday +
                hoursLog.overtime

        BigDecimal lateUnderTime = hoursLog.late + hoursLog.underTime

        if (hoursLog.regularHoliday > 0) {
            salaryBreakDown.regularHoliday = calculateHoliday(hourlyRate, hoursLog.regularHoliday, lateUnderTime, multiplier.regularHoliday, multiplier.regular).setScale(2, RoundingMode.HALF_EVEN)
            additionalRegular += (hourlyRate * hoursLog.regularHoliday) * multiplier.regular as BigDecimal
        }


//        salaryBreakDown.overtimeHoliday = calculateHoliday(hourlyRate, hoursLog.overtimeHoliday, 0.00, multiplier.regularHoliday, multiplier.regular).setScale(2, RoundingMode.HALF_EVEN)
//        additionalOvertime += (hourlyRate * hoursLog.overtimeHoliday) * multiplier.regularOvertime as BigDecimal
//
//        salaryBreakDown.regularSpecialHoliday = calculateHoliday(hourlyRate, hoursLog.regularSpecialHoliday, lateUnderTime, multiplier.specialHoliday, multiplier.regular).setScale(2, RoundingMode.HALF_EVEN)
//        additionalRegular += (hourlyRate * hoursLog.regularSpecialHoliday) * multiplier.regular as BigDecimal
//
//        salaryBreakDown.overtimeSpecialHoliday = calculateHoliday(hourlyRate, hoursLog.overtimeSpecialHoliday, 0.00, multiplier.specialHolidayOvertime, multiplier.regular).setScale(2, RoundingMode.HALF_EVEN)
//        additionalOvertime += (hourlyRate * hoursLog.overtimeSpecialHoliday) * multiplier.regularOvertime as BigDecimal
//
//        salaryBreakDown.regularDoubleHoliday = calculateHoliday(hourlyRate, hoursLog.regularDoubleHoliday, lateUnderTime, multiplier.doubleHoliday, multiplier.regular).setScale(2, RoundingMode.HALF_EVEN)
//        additionalRegular += (hourlyRate * hoursLog.regularDoubleHoliday) * multiplier.regular as BigDecimal
//
//        salaryBreakDown.overtimeDoubleHoliday = calculateHoliday(hourlyRate, hoursLog.overtimeDoubleHoliday, 0.00, multiplier.doubleHolidayOvertime, multiplier.regular).setScale(2, RoundingMode.HALF_EVEN)
//        additionalOvertime += (hourlyRate * hoursLog.overtimeDoubleHoliday) * multiplier.regularOvertime as BigDecimal

        salaryBreakDown.late = ((hourlyRate * hoursLog.late * multiplier.regular) as BigDecimal).setScale(2, RoundingMode.HALF_EVEN)
        salaryBreakDown.regular = (((hourlyRate * hoursLog.regular * multiplier.regular) as BigDecimal) + additionalRegular).setScale(2, RoundingMode.HALF_EVEN)
        salaryBreakDown.overtime = ((hourlyRate * totalOvertimeHours) * multiplier.regularOvertime as BigDecimal).setScale(2, RoundingMode.HALF_EVEN)

        return salaryBreakDown

    }

    static BigDecimal calculateHoliday(
            BigDecimal hourlyRate,
            BigDecimal noOfHours,
            BigDecimal lateUnderTime,
            Float multiplier,
            Float regularMultiplier
    ) {
        if (noOfHours > 0) {
            BigDecimal regularSalary = (hourlyRate * (noOfHours + lateUnderTime)) * regularMultiplier as BigDecimal
            return ((hourlyRate * (noOfHours + lateUnderTime)) * multiplier as BigDecimal).setScale(2, RoundingMode.HALF_EVEN) - regularSalary
        } else return 0

    }

    @GraphQLMutation(name = "recalculateOneDay")
    GraphQLResVal<String> recalculateOneDay(@GraphQLArgument(name = "id") UUID id,
                                            @GraphQLArgument(name = "startDate") Instant startDate,
                                            @GraphQLArgument(name = "endDate") Instant endDate,
                                            @GraphQLArgument(name = "employeeId") UUID employeeId) {
        AccumulatedLogs accumulatedLogs = accumulatedLogRepository.findById(id).get()
        List<AccumulatedLogs> list = accumulatedLogsCalculator.getAccumulatedLogs(startDate, endDate, employeeId, true,
                accumulatedLogs.timekeepingEmployee.payrollEmployee.employee)
        list[0].timekeepingEmployee = accumulatedLogs.timekeepingEmployee
        accumulatedLogRepository.delete(accumulatedLogs)
        list[0].company = SecurityUtils.currentCompany()
        accumulatedLogRepository.save(list[0])
        return new GraphQLResVal<String>('Success', true, "Successfully recalculated selected date!")

    }


}
