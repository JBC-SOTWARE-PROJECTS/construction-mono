package com.backend.gbp.rest.report

import com.backend.gbp.domain.hrm.SalaryRateMultiplier
import com.backend.gbp.domain.payroll.Payroll
import com.backend.gbp.domain.payroll.PayrollEmployee
import com.backend.gbp.domain.payroll.enums.AdjustmentOperation
import com.backend.gbp.graphqlservices.hrm.SalaryRateMultiplierService
import com.backend.gbp.graphqlservices.payroll.TimekeepingEmployeeService
import com.backend.gbp.repository.payroll.PayrollEmployeeRepository
import com.backend.gbp.repository.payroll.PayrollRepository
import groovy.transform.Canonical
import groovy.transform.TypeChecked
import org.apache.commons.csv.CSVFormat
import org.apache.commons.csv.CSVPrinter
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

import java.math.RoundingMode
import java.nio.charset.Charset
import java.time.Instant
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.ZoneOffset
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import java.util.concurrent.Callable


@Canonical
class PayrollRegEmployeeDto {
    String accountNo;
    String name;
    String days;
    String regularPay;
    String underTimePay;
    String overtimePay;
    String holiday;
    String vacationLeave;
    String sickLeave;
    String allowance;
    String totalGrossPay;
    String withholdingTax;
    String sss;
    String hdmf;
    String phic;
    String insurance;
    String salaryLoan;
    String late;
    String otherDeductions;
    String totalPayrollDeductions;
    String subTotal;
    String adjustment;
    String netPay;
    String payFrequencyTotals;
    String totalNetPaySemiMonthly;
}


@TypeChecked
@RestController
@RequestMapping('/reports/payroll/print')
class PayrollLedger {

    @Autowired
    PayrollEmployeeRepository payrollEmployeeRepository

    @Autowired
    SalaryRateMultiplierService salaryRateMultiplierService

    @Autowired
    PayrollRepository payrollRepository


    @RequestMapping("/payrollLedgerDownload")
    Callable<ResponseEntity<byte[]>> payrollLedgerDownload(
            @RequestParam(name ="id") UUID id
//              @RequestParam(name = "payPeriod")  Instant payPeriod,
    ) {


        Instant currentInstant = Instant.now();
        ZonedDateTime zonedDateTime = currentInstant.atZone(ZoneId.of("UTC"));
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");
        String formattedDate = formatter.format(zonedDateTime);

        DateTimeFormatter formatterD = DateTimeFormatter.ofPattern("MM-dd-yyyy").withZone(ZoneId.systemDefault())

        return new Callable<ResponseEntity<byte[]>>() {
            @Override
            ResponseEntity<byte[]> call() throws Exception {
                StringBuffer buffer = new StringBuffer()


//                SalaryRateMultiplier multiplier = salaryRateMultiplierService.getSalaryRateMultiplier()
                List<PayrollEmployee> payrollEmployees = payrollEmployeeRepository.getPayrollEmpById(id)
                Payroll payrollEmp = payrollRepository.getPayrollById(id)

                String startDate = formatterD.format(payrollEmp?.dateStart)
                String endDate = formatterD.format(payrollEmp?.dateEnd)

                def totalHours = payrollEmployees?.timekeepingEmployee?.totalHours;

                def getTotalHrs = 0.0;
                if (totalHours != null) {
                    totalHours.each { employeeHours ->
                        if (employeeHours != null && employeeHours.regular != null) {
                            getTotalHrs += employeeHours.regular
                        }
                    }
                }

                SalaryRateMultiplier multipliers = salaryRateMultiplierService.getSalaryRateMultiplier()


                CSVPrinter csvPrinter = new CSVPrinter(buffer, CSVFormat.POSTGRESQL_CSV)
                csvPrinter.printRecord("Company Name", payrollEmp.company.companyName ?: "")
                csvPrinter.printRecord("Payroll Code", payrollEmp.code ?: "")
                csvPrinter.printRecord("PayPeriod from ", "${startDate} to ${endDate}" )
                csvPrinter.printRecord("Check Date")
                csvPrinter.printRecord("")
                csvPrinter.printRecord(
                        "Account No.",
                        "Name",
                        "Regular Pay",
                        "UnderTime Pay",
                        "Overtime Pay",
                        "Holiday",
//                        "Vacation Leave",
//                        "Sick Leave",
                        "Allowance",
                        "Total Gross Pay",
                        "Late",
                        "With holding Tax",
                        "SSS",
                        "HDMF",
                        "PHIC",
//                        "Insurance",
                        "Salary Loan",
                        "Other Deductions",
                        "Total Payroll Deductions",
                        "SubTotal",
                        "Adjustment",
                        "Net Pay"
                )
//

                def getTotalPayFreq = "";
                payrollEmployees.eachWithIndex{ it, idx->
                    SalaryRateMultiplier multiplier = salaryRateMultiplierService.getSalaryRateMultiplier()

                    def summary = it.employeeAdjustment;
                    def totalNet = it.timekeepingEmployee.totalSalary;
                  
                    def otherDeduction = it?.employeeOtherDeduction;
                    def contribution = it?.payrollEmployeeContribution;
                    def loanDeduction = it?.payrollEmployeeLoan

                    BigDecimal hourlyRate = TimekeepingEmployeeService.getHourlyRate(it.employee, 12)
                    def totalRate = 0.00;

                    if(hourlyRate){
                        totalRate = (hourlyRate * multipliers?.regular);
                    }


                    getTotalPayFreq =  totalRate * (getTotalHrs as Number);

                    BigDecimal grossTT = 0.0
                    if(it?.allowanceEmployee){
                          def allowance = it?.allowanceEmployee;

                          if(allowance != null && allowance.allowanceItems != null){
                            allowance.allowanceItems.each{
                                grossTT +=it.amount ?: 0.0
                              }
                          }
                    }
                    

                    BigDecimal otherDeduct = 0.0
                    if(otherDeduction != null && otherDeduction.deductionItems != null){
                        otherDeduction.deductionItems.each {
                            otherDeduct += it.amount
                        }
                    }

                    BigDecimal loanDeduct = 0.0
                    if(loanDeduction != null && loanDeduction.loanItems != null){
                        loanDeduction.loanItems.each {
                            loanDeduct += it.amount
                        }
                    }

                    def totalHoursEmp = it.timekeepingEmployee.totalHours
                    def overTimeRate = ((hourlyRate * multiplier?.regularOvertime ?: 0.00) as BigDecimal).round(2)
                    def overTimeNoHours = ((totalHoursEmp?.overtime ?: 0.00) as BigDecimal).setScale(2, RoundingMode.HALF_UP)
                    def totalOverTime = overTimeRate * overTimeNoHours

                    def regRate = ((hourlyRate * multiplier?.regular ?: 0.00) as BigDecimal).round(2)
                    def regNoHours = ((totalHoursEmp?.regular ?: 0.00) as BigDecimal).setScale(2, RoundingMode.HALF_UP)
                    def totalReg = regNoHours * regRate

                    def regHolNoHours = ((totalHoursEmp?.regularHoliday ?: 0.00) as BigDecimal).setScale(2, RoundingMode.HALF_UP)
                    def regHolRate = ((hourlyRate *  multiplier?.regularHoliday ?: 0.00) as BigDecimal).round(2)
                    def totalRegHol = regHolNoHours * regHolRate

                    def netPay = it.employee.isFixedRate ? (it.employee.monthlyRate / 2) : ( totalRegHol + totalReg + totalOverTime);
                   // def netPay =  (totalNet?.regular ?: 0.0) + (totalNet?.overtime ?: 0.0) + (totalNet?.regularHoliday ?: 0.0);


                    def totalGrossPay = netPay + grossTT;

                    def deduction = (totalNet?.late ?: 0.0) + (totalNet?.underTime ?: 0.0) + (it?.withholdingTax ?: 0.0) +
                            (contribution?.sssEE ?: 0.0) + (contribution?.hdmfEE ?: 0.0) + (contribution?.phicEE ?: 0.0)

                    def totalDeduction = deduction + otherDeduct + loanDeduct;

                    BigDecimal adjustTotal = 0.0
                    if(summary != null && summary.adjustmentItems != null) {
                        summary.adjustmentItems.each {
                            if (it.operation == AdjustmentOperation.ADDITION) {
                                adjustTotal += it.amount
                            } else if (it.operation == AdjustmentOperation.SUBTRACTION) {
                                adjustTotal -= it.amount
                            }
                        }
                    }

                  //  def subtotal = totalGrossPay + totalDeduction + adjustTotal;
                    def subtotal = totalGrossPay - totalDeduction ;
                    def totalNetPay =subtotal + adjustTotal;
                  //  def totalNetPay =( totalGrossPay - totalDeduction) + adjustTotal;

//                    if()
//                    it.allowanceEmployee?.allowanceItems?.name

                    PayrollRegEmployeeDto payrollDto = new PayrollRegEmployeeDto();
                    payrollDto.accountNo = it.employee.employeeNo ?: ""
                    payrollDto.name = it.employee.fullName ?: ""

                    payrollDto.regularPay = it.employee.isFixedRate ? "FIXED": (totalReg ?: "")
                    payrollDto.underTimePay = it.timekeepingEmployee?.totalSalary?.underTime ?: ""
                    payrollDto.overtimePay = totalOverTime?: ""
                    payrollDto.holiday = totalRegHol ?: ""
                    payrollDto.allowance = grossTT ?: ""
                    payrollDto.totalGrossPay = ( totalGrossPay ?: "")
                    payrollDto.withholdingTax = it.withholdingTax ?: ""
                    payrollDto.late = totalNet?.late ?: ""
                    payrollDto.sss = it.payrollEmployeeContribution?.sssEE ?: ""
                    payrollDto.hdmf = it.payrollEmployeeContribution?.hdmfEE ?: ""
                    payrollDto.phic = it.payrollEmployeeContribution?.phicEE ?: ""
//                    payrollDto.insurance = ''
                    payrollDto.salaryLoan = loanDeduct?:""
                    payrollDto.otherDeductions = otherDeduct ?: ""
                    payrollDto.totalPayrollDeductions = totalDeduction ?: ""
                    payrollDto.subTotal =  (subtotal ?: "")
                    payrollDto.adjustment = adjustTotal ?: ""
                    payrollDto.netPay =   (totalNetPay ?: "")




                    csvPrinter.printRecord(
                            payrollDto.accountNo,
                            payrollDto.name,
                            payrollDto.regularPay,
                            payrollDto.underTimePay,
                            payrollDto.overtimePay,
                            payrollDto.holiday,
                            payrollDto.allowance,
                            payrollDto.totalGrossPay,
                            payrollDto.late,
                            payrollDto.withholdingTax,
                            payrollDto.sss,
                            payrollDto.hdmf,
                            payrollDto.phic,
//                            payrollDto.insurance,
                            payrollDto.salaryLoan,
                            payrollDto.otherDeductions,
                            payrollDto.totalPayrollDeductions,
                            payrollDto.subTotal,
                            payrollDto.adjustment,
                            payrollDto.netPay
                    )
                }
                def semiMonthly = '';
                def payFrequencyTotal = '';

                csvPrinter.printRecord("")
                csvPrinter.printRecord("Pay Frequency Totals", getTotalPayFreq)
                csvPrinter.printRecord("Total Net Pays for Semi-Monthly Frequency", semiMonthly )

                payrollEmployees.eachWithIndex{ it, idx->
                    def paymentsSemiMonthly = ""
                    if(it.payroll.type != null){
                        if(it.payroll.type == it.payroll.type.SEMI_MONTHLY){
                            paymentsSemiMonthly = "SEMI MONTHLY"
                        }else if (it.payroll.type == it.payroll.type.WEEKLY){
                            paymentsSemiMonthly = "WEEKLY"
                        }
                    }


                    PayrollRegEmployeeDto payrollDto = new PayrollRegEmployeeDto();
                    payrollDto.payFrequencyTotals = ''
                    payrollDto.totalNetPaySemiMonthly = paymentsSemiMonthly



                    payFrequencyTotal = payrollDto.payFrequencyTotals
                    semiMonthly = payrollDto.totalNetPaySemiMonthly

                }
//
                csvPrinter.printRecord("")
                csvPrinter.printRecord("Date Printed", formattedDate)

                def data = buffer.toString().getBytes(Charset.defaultCharset())
                def responseHeaders = new HttpHeaders()
                responseHeaders.setContentType(MediaType.TEXT_PLAIN)
                responseHeaders.setContentLength(data.length)
                responseHeaders.add("Content-Disposition", "attachment;filename=payrollLedger.csv")


                return new ResponseEntity(data, responseHeaders, HttpStatus.OK)
            }
        }
    }



}
