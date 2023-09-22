package com.backend.gbp.graphqlservices.hrm

import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.hrm.EmployeeAttendance
import com.backend.gbp.domain.hrm.EmployeeSchedule
import com.backend.gbp.domain.hrm.EventCalendar
import com.backend.gbp.domain.hrm.dto.AccumulatedLogsDto
import com.backend.gbp.domain.hrm.dto.HoursLog
import com.backend.gbp.domain.hrm.dto.ScheduleDto
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.hrm.EmployeeAttendanceRepository
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.repository.hrm.EmployeeScheduleRepository
import com.fasterxml.jackson.databind.ObjectMapper
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Component

import javax.persistence.EntityManager
import javax.persistence.PersistenceContext
import javax.validation.constraints.NotNull
import java.time.Duration
import java.time.Instant
import java.time.temporal.ChronoField
import java.time.temporal.ChronoUnit

@Component
@GraphQLApi



class AccumulatedLogsCalculator {

    @Autowired
    EmployeeAttendanceRepository employeeAttendanceRepository

    @Autowired
    EmployeeScheduleRepository employeeScheduleRepository

    @Autowired
    EmployeeRepository employeeRepository

    @Autowired
    EventCalendarService eventCalendarService

    @Autowired
    JdbcTemplate jdbcTemplate

    @Autowired
    EmployeeScheduleService employeeScheduleService

    @PersistenceContext
    EntityManager entityManager

    @Autowired
    ObjectMapper objectMapper

    @GraphQLQuery(name = "getAccumulatedLogs")
    List<AccumulatedLogsDto> getAccumulatedLogs(
            @GraphQLArgument(name = "startDate") Instant startDate,
            @GraphQLArgument(name = "endDate") Instant endDate,
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "generateBreakdown") Boolean generateBreakdown

    ) {
        if (!startDate || !endDate || !id) throw new RuntimeException("Failed to get employee attendance.")

        List<AccumulatedLogsDto> accumulatedLogsList = []
        Map<String, List<EmployeeAttendance>> attendanceMap = getAttendanceLogs(startDate, endDate, id)
        Map<String, List<EmployeeSchedule>> scheduleMap = getSchedules(startDate, endDate, id)
        Map<String, List<EventCalendar>> holidayMap = eventCalendarService.mapEventsToDates(startDate, endDate)

        Instant date = startDate.plus(8, ChronoUnit.HOURS);
        while (date.isBefore(endDate)) {
            String dateString = date.toString().substring(0, 10)
            if (scheduleMap.get(dateString)) {
                AccumulatedLogsDto accumulatedLogs = new AccumulatedLogsDto()

                List<EmployeeAttendance> attendanceList = attendanceMap.get(dateString).sort({ it.attendance_time })
                List<EmployeeSchedule> scheduleList = scheduleMap.get(dateString).sort({ it.dateTimeStart })
                List<EventCalendar> holidays = holidayMap.get(dateString)

                Instant firstIn = attendanceList.find({ it.type == 'IN' && !it.isTransfer }).attendance_time
                Instant out = attendanceList.find({ it.type == 'OUT' && !it.isTransfer }).attendance_time

                EmployeeSchedule regularSchedule = scheduleList.find({ !it.isOvertime })
                EmployeeSchedule overtimeSchedule = scheduleList.find({ it.isOvertime })
                HoursLog hoursLog = new HoursLog()

                if (generateBreakdown) {
                    accumulatedLogs.projectBreakdown = computeProjectBreakdown(regularSchedule, overtimeSchedule, attendanceList, holidays)
                    accumulatedLogs.projectBreakdown.each {
                        hoursLog.regular += it.regular
                        hoursLog.overtime += it.overtime

                        hoursLog.regularHoliday += it.regularHoliday
                        hoursLog.overtimeHoliday += it.overtimeHoliday

                        hoursLog.regularDoubleHoliday += it.regularDoubleHoliday
                        hoursLog.overtimeDoubleHoliday += it.overtimeDoubleHoliday

                        hoursLog.regularSpecialHoliday += it.regularSpecialHoliday
                        hoursLog.overtimeSpecialHoliday += it.overtimeSpecialHoliday

                    }
                } else {
                    BigDecimal regularHours = computeHours(regularSchedule, firstIn, out)
                    BigDecimal overtimeHours = overtimeSchedule ? computeHours(overtimeSchedule, firstIn, out) : 0
                    if (holidays?.size() > 0) {
                        calculateHolidayHours(holidays, regularHours, hoursLog, overtimeHours)
                    } else {
                        hoursLog.regular = regularHours
                        hoursLog.overtime = overtimeHours
                    }


                }

                hoursLog.late = getLateHours(regularSchedule.dateTimeStart, firstIn)
                hoursLog.underTime = regularSchedule.scheduleDuration - hoursLog.late - hoursLog.regular
                hoursLog.absent
                accumulatedLogs.hours = hoursLog
                accumulatedLogs.scheduleStart = regularSchedule.dateTimeStart
                accumulatedLogs.scheduleEnd = overtimeSchedule ? overtimeSchedule.dateTimeEnd : regularSchedule.dateTimeEnd


                accumulatedLogs.date = date
                accumulatedLogs.scheduleTitle = regularSchedule.title
                accumulatedLogs.inTime = firstIn
                accumulatedLogs.outTime = out
                accumulatedLogs.message = "Fuck You"
                accumulatedLogsList.push(accumulatedLogs)
            } else {
                AccumulatedLogsDto accumulatedLogs = new AccumulatedLogsDto()
                accumulatedLogs.date = date
                accumulatedLogs.message = "No Schedule"
                accumulatedLogsList.push(accumulatedLogs)
            }

            date = date.plus(1, ChronoUnit.DAYS)
        }

        return accumulatedLogsList.sort({ it.date })
    }

    private static void calculateHolidayHours(List<EventCalendar> holidays, BigDecimal regularHours, HoursLog hoursLog, BigDecimal overtimeHours) {
        Integer regularCount = 0
        Integer nonHolidayCount = 0
        Integer specialNonWorkingCount = 0

        holidays.each {
            if (it.holidayType == 'REGULAR') regularCount++
            if (it.holidayType == 'SPECIAL_NON_WORKING') specialNonWorkingCount++
            if (it.holidayType == 'NON_HOLIDAY') nonHolidayCount++
        }
        Integer totalHolidayCount = regularCount + specialNonWorkingCount
        switch (totalHolidayCount) {
            case 1:
                if (regularCount == 1) {
                    hoursLog.regularHoliday = regularHours
                    hoursLog.overtimeHoliday = overtimeHours
                } else if (specialNonWorkingCount == 1) {
                    hoursLog.regularSpecialHoliday = regularHours
                    hoursLog.overtimeSpecialHoliday = overtimeHours
                }
                break;
            default:
                if (totalHolidayCount >= 2) {
                    hoursLog.regularDoubleHoliday = regularHours
                    hoursLog.overtimeDoubleHoliday = overtimeHours
                }
                break;
        }
    }

    static List<HoursLog> computeProjectBreakdown(
            EmployeeSchedule regularSchedule,
            EmployeeSchedule overtimeSchedule,
            List<EmployeeAttendance> attendanceList,
            List<EventCalendar> holidays) {
        List<HoursLog> hoursLogList = []
        for (int i = 1; i < attendanceList.size(); i++) {
            HoursLog hoursLog = new HoursLog()
            hoursLog.project = attendanceList[i - 1].project.id
            hoursLog.projectName = attendanceList[i - 1].project.description
            Instant timeIn = attendanceList[i - 1].attendance_time
            Instant timeOut = attendanceList[i].attendance_time
            BigDecimal overtimeHours = 0
            BigDecimal regularHours = computeHours(regularSchedule, timeIn, timeOut)
            if (overtimeSchedule && !timeOut.isBefore(overtimeSchedule.dateTimeStart)) {
                overtimeHours = computeHours(overtimeSchedule, attendanceList[i - 1].attendance_time, attendanceList[i].attendance_time)
            }

            if (holidays?.size() > 0) {
                calculateHolidayHours(holidays, regularHours, hoursLog, overtimeHours)
            } else {
                hoursLog.regular = regularHours
                hoursLog.overtime = overtimeHours
            }
            hoursLogList.push(hoursLog)

        }
        return hoursLogList.reverse()
    }

    static BigDecimal getLateHours(Instant scheduleStart, Instant firstIn) {
        BigDecimal lateHours = Duration.between(scheduleStart, firstIn).toMillis() / 3600000.0
        if (lateHours >= 0) {
            return lateHours
        } else {
            return 0
        }

    }

    static BigDecimal computeHours(EmployeeSchedule schedule, Instant logStart, Instant logEnd) {
        logStart = logStart.with(ChronoField.MILLI_OF_SECOND, 0)
        logEnd = logEnd.with(ChronoField.MILLI_OF_SECOND, 0)
        BigDecimal HOUR_COMPUTATION = 60 * 60
        Instant scheduleStart = schedule.dateTimeStart
        Instant scheduleEnd = schedule.dateTimeEnd
        Instant mealBreakStart = schedule.mealBreakStart
        Instant mealBreakEnd = schedule.mealBreakEnd
        Instant consideredIn
        Instant consideredOut
        BigDecimal workedHours
        Long ALLOWANCE = 60
        Long scheduleStartLogStartDiff = Duration.between(scheduleStart, logStart).getSeconds()

        if (scheduleStartLogStartDiff < ALLOWANCE)
            consideredIn = scheduleStart
        else if (scheduleStart.isBefore(logStart))
            consideredIn = logStart
        else
            consideredIn = scheduleStart

        if (scheduleEnd.isAfter(logEnd))
            consideredOut = logEnd
        else
            consideredOut = scheduleEnd

        if (mealBreakStart && mealBreakEnd) {
            BigDecimal mealBreakDuration = Duration.between(mealBreakStart, mealBreakEnd).getSeconds() / HOUR_COMPUTATION
            if ((consideredOut.isAfter(mealBreakStart) || consideredOut == mealBreakStart)
                    && (consideredOut.isBefore(mealBreakEnd) || consideredOut == mealBreakEnd)
            ) {
                // this means the employee timed-out at lunch time, which means we will use the meal break start as
                // the considered time out
                workedHours = Duration.between(consideredIn, mealBreakStart).getSeconds() / HOUR_COMPUTATION
            } else if ((consideredIn.isAfter(mealBreakStart) || consideredIn == mealBreakStart)
                    && (consideredIn.isBefore(mealBreakEnd) || consideredIn == mealBreakEnd)
            ) {
                // this is when employee timed in between meal break, we will start counting at the end of meal break
                // until the considered time out
                workedHours = Duration.between(mealBreakEnd, consideredOut).getSeconds() / HOUR_COMPUTATION
            } else if (consideredOut.isBefore(mealBreakStart)) {
                workedHours = Duration.between(consideredIn, consideredOut).getSeconds() / HOUR_COMPUTATION
            } else if (
                    consideredIn.isAfter(mealBreakStart) && consideredIn.isAfter(mealBreakEnd) && consideredOut.isAfter(mealBreakStart) && consideredOut.isAfter(mealBreakEnd)
            ) {
                workedHours = Duration.between(consideredIn, consideredOut).getSeconds() / HOUR_COMPUTATION

            } else {
                workedHours = Duration.between(consideredIn, consideredOut).getSeconds() / HOUR_COMPUTATION
                workedHours -= mealBreakDuration
            }
        } else {
            // we will go with the normal computation
            workedHours = Duration.between(consideredIn, consideredOut).getSeconds() / HOUR_COMPUTATION
        }
        return workedHours
    }

    private Map<String, List<EmployeeAttendance>> getAttendanceLogs(Instant startDate, Instant endDate, UUID id) {
        Map<String, List<EmployeeAttendance>> sortedAttendance = new HashMap<>()
        List<EmployeeAttendance> attendanceList = employeeAttendanceRepository.getEmployeeAttendanceList(id, startDate, endDate)

        attendanceList.each {
            if (sortedAttendance.containsKey(it.dateString)) {
                List<EmployeeAttendance> attendances = sortedAttendance.get(it.dateString)
                attendances.push(it)
                sortedAttendance.put(it.dateString, attendances)
            } else {
                sortedAttendance.put(it.dateString, [it])
            }
            attendanceList
        }

        return sortedAttendance
    }

    private Map<String, List<EmployeeSchedule>> getSchedules(Instant startDate, Instant endDate, UUID id) {
        Map<String, List<EmployeeSchedule>> sortedSchedule = new HashMap<>()
        List<EmployeeSchedule> scheduleList = employeeScheduleRepository.findByDateRangeEmployeeId(id, startDate, endDate)

        scheduleList.each {
            if (sortedSchedule.containsKey(it.dateString)) {
                List<EmployeeSchedule> schedules = sortedSchedule.get(it.dateString)
                schedules.push(it)
                sortedSchedule.put(it.dateString, schedules)
            } else {
                sortedSchedule.put(it.dateString, [it])
            }
        }
        return sortedSchedule
    }

}
