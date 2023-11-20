package com.backend.gbp.domain.hrm.dto

import java.beans.Transient
import java.time.Instant


class HoursLog {

    UUID project
    String projectName

    BigDecimal late = 0
    BigDecimal underTime = 0
    BigDecimal absent = 0

    BigDecimal regular = 0
    BigDecimal overtime = 0

    BigDecimal regularHoliday = 0
    BigDecimal overtimeHoliday = 0

    BigDecimal regularDoubleHoliday = 0
    BigDecimal overtimeDoubleHoliday = 0

    BigDecimal regularSpecialHoliday = 0
    BigDecimal overtimeSpecialHoliday = 0

    @Transient
    BigDecimal getTotalRegularHours() {
        regular +
                regularHoliday +
                regularDoubleHoliday +
                regularSpecialHoliday
    }

}


class AccumulatedLogsDto {

    Instant date
    Instant scheduleStart
    Instant scheduleEnd
    String scheduleTitle
    Instant inTime
    Instant outTime
    String message
    Boolean isError
    Boolean isRestDay = false
    Boolean isLeave = false

    HoursLog hours
    List<HoursLog> projectBreakdown

}

class ScheduleDto {
    UUID id
    UUID emp_id
    String label
    String title

    Instant date_time_start
    Instant date_time_end
    Instant meal_break_start
    Instant meal_break_end
    UUID project
    Boolean is_multi_project
    String schedule_date
    Boolean is_custom
    Boolean is_overtime
    Boolean is_rest_day

}