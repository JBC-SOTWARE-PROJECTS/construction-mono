package com.backend.gbp.graphqlservices.payroll

import com.backend.gbp.domain.hrm.dto.HoursLog
import com.backend.gbp.domain.payroll.AccumulatedLogs
import com.backend.gbp.domain.payroll.Payroll
import com.backend.gbp.domain.payroll.PayrollEmployee
import com.backend.gbp.domain.payroll.Timekeeping
import com.backend.gbp.domain.payroll.TimekeepingEmployee
import com.backend.gbp.domain.payroll.enums.PayrollEmployeeStatus
import com.backend.gbp.domain.payroll.enums.PayrollStatus
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.repository.TimekeepingEmployeeRepository
import com.backend.gbp.repository.TimekeepingRepository
import com.backend.gbp.repository.payroll.PayrollEmployeeRepository
import com.backend.gbp.repository.payroll.PayrollRepository
import com.backend.gbp.security.SecurityUtils
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.jfree.data.time.Hour
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

import javax.persistence.EntityManager
import javax.persistence.PersistenceContext

@TypeChecked
@Component
@GraphQLApi
@Transactional(rollbackFor = Exception.class)
class TimekeepingService implements IPayrollModuleBaseOperations<Timekeeping> {

    @Autowired
    TimekeepingRepository timekeepingRepository

    @Autowired
    PayrollRepository payrollRepository

    @Autowired
    TimekeepingEmployeeRepository timekeepingEmployeeRepository

    @Autowired
    TimekeepingEmployeeService timekeepingEmployeeService

    @Autowired
    PayrollEmployeeRepository payrollEmployeeRepository


    @Autowired
    ObjectMapper objectMapper

    @PersistenceContext
    EntityManager entityManager

    private Timekeeping timekeeping;


    //=================================QUERY=================================\\
    @GraphQLQuery(name = "timekeepings", description = "Get All timekeepings")
    List<Timekeeping> findAll() {
        timekeepingRepository.findAll().sort { it.createdDate }
    }

    @GraphQLQuery(name = "getTimekeepingById", description = "Get timekeeping by ID")
    Timekeeping findById(@GraphQLArgument(name = "id") UUID id) {
        if (id) {
            return timekeepingRepository.findById(id).get()
        } else {
            return null
        }

    }

    @GraphQLQuery(name = "getTimekeepingByPayrollId", description = "Get timekeeping by ID")
    Timekeeping findByPayrollId(@GraphQLArgument(name = "id") UUID id) {
        if (id) {
            return timekeepingRepository.findByPayrollId(id).get()
        } else {
            return null
        }

    }


    @GraphQLQuery(name = "getTimekeepingAndEmployees", description = "Get All timekeepings")
    Timekeeping getTimekeepingAndEmployees(@GraphQLArgument(name = "timekeepingId") UUID timekeepingId) {

        Timekeeping timekeeping = timekeepingRepository.findById(timekeepingId).get()
        // List<TimekeepingEmployee> timekeepingEmployeeList = timekeepingEmployeeRepository.findByTimekeeping(timekeepingId)

        return timekeeping
        //List <Employee> employees =timekeepingEmployeeRepository.getTimekeepingEmployees(timekeepingId)
    }


    //=================================QUERY=================================\\


    //================================MUTATION================================\\


    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation
    GraphQLResVal<Timekeeping> calculateAllAccumulatedLogs(
            @GraphQLArgument(name = "id") UUID id
    ) {
        Payroll payroll = payrollRepository.findById(id).get()
        timekeepingEmployeeService.recalculateAllEmployee(payroll)
        return new GraphQLResVal<Timekeeping>(payroll.timekeeping, true, "Successfully updated timekeeping")

    }


    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation
    GraphQLResVal<String> calculateOneTimekeepingEmployee(
            @GraphQLArgument(name = "id") UUID id
    ) {
        PayrollEmployee payrollEmployee = payrollEmployeeRepository.findById(id).get()
        timekeepingEmployeeService.recalculateEmployee(payrollEmployee, payrollEmployee.payroll)
        return new GraphQLResVal<String>(null, true, "Successfully recalculated timekeeping employee.")
    }

    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation
    GraphQLResVal<String> updateTimekeepingStatus(
            @GraphQLArgument(name = "payrollId") UUID payrollId,
            @GraphQLArgument(name = "status") PayrollStatus status

    ) {
        Timekeeping timekeeping = timekeepingRepository.findByPayrollId(payrollId).get()
        timekeeping.status = status

        if (status == PayrollStatus.FINALIZED) {
//            TODO: generate salary amount based on accumulated logs and hourly rate
            Map<String, HoursLog> timekeepingBreakdownMap = new HashMap<>()
            timekeeping.timekeepingEmployees.each { TimekeepingEmployee timekeepingEmployee ->
                timekeepingEmployee.status = PayrollEmployeeStatus.FINALIZED
                Map<String, HoursLog> employeeBreakdownMap = new HashMap<>()
                timekeepingEmployee.accumulatedLogs.each {
                    AccumulatedLogs accumulatedLogs ->
                        accumulatedLogs.projectBreakdown.each {
                            consolidateProjectBreakdown(timekeepingBreakdownMap, it)
                        }
                }
                timekeepingEmployee.projectBreakdown = []
                employeeBreakdownMap.keySet().each {
                    timekeepingEmployee.projectBreakdown.push(employeeBreakdownMap.get(it.toString()))
                }
            }
            timekeeping.projectBreakdown = []
            timekeepingBreakdownMap.keySet().each {
                timekeeping.projectBreakdown.push(timekeepingBreakdownMap.get(it.toString()))
            }

        }
        timekeepingEmployeeRepository.saveAll(timekeeping.timekeepingEmployees)
        timekeepingRepository.save(timekeeping)

        return new GraphQLResVal<String>(null, true, "Successfully updated Timekeeping status.")
    }

    static void consolidateProjectBreakdown(HashMap<String, HoursLog> breakdownMap, HoursLog it) {
        HoursLog breakdown = breakdownMap.get(it.project as String)
        if (!breakdown) breakdown = new HoursLog()
        breakdown.project = it.project
        breakdown.projectName = it.projectName
        breakdown.late += it.late
        breakdown.underTime += it.underTime
        breakdown.absent += it.absent
        breakdown.regular += it.regular
        breakdown.overtime += it.overtime
        breakdown.regularHoliday += it.regularHoliday
        breakdown.overtimeHoliday += it.overtimeHoliday
        breakdown.regularDoubleHoliday += it.regularDoubleHoliday
        breakdown.overtimeDoubleHoliday += it.overtimeDoubleHoliday
        breakdown.regularSpecialHoliday += it.regularSpecialHoliday
        breakdown.overtimeSpecialHoliday += it.overtimeSpecialHoliday
//                            if (breakdown) {
        breakdownMap.put(it.project as String, breakdown)
//                            }
    }


//===================================================================

    @Override
    Timekeeping startPayroll(Payroll payroll) {
        Timekeeping timekeeping = new Timekeeping();
        timekeeping.payroll = payroll
        timekeeping.status = PayrollStatus.DRAFT
        timekeeping.company = SecurityUtils.currentCompany()
        timekeeping = timekeepingRepository.save(timekeeping)

        payroll.timekeeping = timekeeping
        timekeepingEmployeeService.addEmployees(payroll.payrollEmployees, payroll)
        return timekeeping

    }

    @Override
    void finalizePayroll(Payroll payroll) {

    }

//===================================================================


}






