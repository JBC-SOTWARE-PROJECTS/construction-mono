package com.backend.gbp.domain.hrm.dto

import java.time.Instant


class HoursLog {

    UUID project

    BigDecimal late = 0
    BigDecimal underTime = 0
    BigDecimal absent = 0

    BigDecimal regular
    BigDecimal overtime

    BigDecimal regularHoliday
    BigDecimal overtimeHoliday

    BigDecimal regularDoubleHoliday
    BigDecimal overtimeDoubleHoliday

    BigDecimal regularSpecialHoliday
    BigDecimal overtimeSpecialHoliday

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