package com.backend.gbp.rest.dto

import groovy.transform.Canonical
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource

@Canonical
class PayslipPayrollDto {
    String empId
    String empname
    String department
    String payrollCode
    String payPeriod
    String paycheckdate
    Integer regularNoHrs
    BigDecimal regularRate
    BigDecimal regularTotal
    JRBeanCollectionDataSource descriptionField
    JRBeanCollectionDataSource deductionField
    JRBeanCollectionDataSource summaryField
    Double totalGross

}

@Canonical
class HeaderDto {
    String regular
    String late
    String underTime
    String overTime
    String regularHoliday
    String specialNonWorking
    String vacationLeave
    String sickLeave
    String semiMonthlyAllowance
    String dailyAllowance
    String loadAllowance
    String transportation
    String foodAllowance
}

@Canonical
class HeadersDto{
    String regular,
           late,
           underTime,
           overTime,
           regularHoliday,
           specialNonWorking,
           vacationLeave,
           sickLeave,
           semiMonthlyAllowance,
           dailyAllowance,
           loadAllowance,
           transportation,
           foodAllowance
}


@Canonical
class GrossDto {
    String  description
    Integer nohours
    Integer rate
    Integer total
}

@Canonical
class DeductionDto {
    String description
    Integer nohours
    Integer rate
    Integer total
}

@Canonical
class  SummaryDto{
    String description
    Integer nohours
    Integer rate
    Integer total
}




