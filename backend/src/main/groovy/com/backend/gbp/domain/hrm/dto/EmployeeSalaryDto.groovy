package com.backend.gbp.domain.hrm.dto

import java.beans.Transient
import java.time.Instant


class EmployeeSalaryDto {

    String subAccountCode

    UUID project
    String projectName

    UUID company
    String companyName

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
    BigDecimal getTotal() {
        regular + overtime
    }

}


