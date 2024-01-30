package com.backend.gbp.rest.dto

import groovy.transform.Canonical
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource

import java.sql.Date
import java.time.Instant

@Canonical
class PayslipPayrollDto {
    String empId
    String empname
    String department
    String payrollCode
    Instant payPeriod
    Date paycheckdate
    Integer regularNoHrs
    BigDecimal regularRate
    BigDecimal regularTotal
    JRBeanCollectionDataSource descriptionField
    JRBeanCollectionDataSource deductionField
    JRBeanCollectionDataSource summaryField
    JRBeanCollectionDataSource  totalNetPay
    Double totalGross
    Double totalDeduction
    Double totalAdjustment
    BigDecimal netpay
    String dateprinted
    InputStream logo

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
class DetailDto{
  String detail1
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
    String nohours
    String rate
    BigDecimal total
    BigDecimal totalGross
}

@Canonical
class DeductionDto {
    String description
    String nohours
    String rate
    BigDecimal total
    BigDecimal totalDeduction
}

@Canonical
class  SummaryDto{
    String description
    BigDecimal nohours
    String rate
    BigDecimal total
}

@Canonical
class  TotalNetPay{
    BigDecimal totalNetPay
}






