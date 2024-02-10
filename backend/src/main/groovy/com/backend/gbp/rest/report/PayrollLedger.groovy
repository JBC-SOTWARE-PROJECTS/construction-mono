package com.backend.gbp.rest.report

import com.backend.gbp.domain.payroll.PayrollEmployee
import com.backend.gbp.repository.payroll.PayrollEmployeeRepository
import groovy.transform.Canonical
import groovy.transform.TypeChecked
import org.apache.commons.csv.CSVFormat
import org.apache.commons.csv.CSVPrinter
import org.apache.poi.ss.usermodel.Cell
import org.apache.poi.ss.usermodel.CellStyle
import org.apache.poi.ss.usermodel.IndexedColors
import org.apache.poi.ss.usermodel.Row
import org.apache.poi.ss.usermodel.Sheet
import org.apache.poi.ss.usermodel.Workbook
import org.apache.poi.xssf.usermodel.XSSFWorkbook
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.MediaType
import org.springframework.http.ResponseEntity
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

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
    String otherDeductions;
    String totalPayrollDeductions;
    String subTotal;
    String adjustment;
    String netPay;
}


@TypeChecked
@RestController
@RequestMapping('/reports/payroll/print')
class PayrollLedger {

    @Autowired
    PayrollEmployeeRepository payrollEmployeeRepository


    @RequestMapping("/payrollLedgerDownload")
     Callable<ResponseEntity<byte[]>> payrollLedgerDownload(
               @RequestParam(name ="id") UUID id
//              @RequestParam(name = "payPeriod")  Instant payPeriod,
    ) {


        Instant currentInstant = Instant.now();
        ZonedDateTime zonedDateTime = currentInstant.atZone(ZoneId.of("UTC"));
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");
        String formattedDate = formatter.format(zonedDateTime);

        return new Callable<ResponseEntity<byte[]>>() {
            @Override
            ResponseEntity<byte[]> call() throws Exception {
                StringBuffer buffer = new StringBuffer()



                List<PayrollEmployee> payrollEmployees = payrollEmployeeRepository.getPayrollEmpById(id)


                CSVPrinter csvPrinter = new CSVPrinter(buffer, CSVFormat.POSTGRESQL_CSV)
                csvPrinter.printRecord("Company Name", payrollEmployees?.company?.companyName)
                csvPrinter.printRecord("Payroll Code")
                csvPrinter.printRecord("PayPeriod from ")
                csvPrinter.printRecord("Check Date")
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
//                        "Total Gross Pay",
//                        "With holding Tax",
                        "SSS",
                        "HDMF",
                        "PHIC",
                        "Insurance",
                        "Salary Loan",
                        "Other Deductions",
                        "Total Payroll Deductions",
                        "SubTotal",
                        "Adjustment",
                        "Net Pay"
                )
//


                payrollEmployees.eachWithIndex{ it, idx->
                    PayrollRegEmployeeDto payrollDto = new PayrollRegEmployeeDto();
                    payrollDto.accountNo = it.employee.employeeNo ?: ""
                    payrollDto.name = it.employee.fullName ?: ""
                    payrollDto.regularPay = it.timekeepingEmployee.totalSalary.regular ?: ""
                    payrollDto.underTimePay = it.timekeepingEmployee.totalSalary.underTime ?: ""
                    payrollDto.overtimePay = it.timekeepingEmployee.totalSalary.overtime ?: ""
                    payrollDto.holiday = it.timekeepingEmployee.totalSalary.regularHoliday ?: ""
                    payrollDto.allowance = it.allowanceEmployee.allowanceItems.amount ?: ""
                    payrollDto.sss = it.payrollEmployeeContribution.sssEE ?: ""
                    payrollDto.hdmf = it.payrollEmployeeContribution.hdmfEE ?: ""
                    payrollDto.phic = it.payrollEmployeeContribution.phicEE ?: ""

                    csvPrinter.printRecord(
                            payrollDto.accountNo,
                            payrollDto.name,
                            payrollDto.regularPay,
                            payrollDto.underTimePay,
                            payrollDto.overtimePay,
                            payrollDto.holiday,
                            payrollDto.allowance,
                            payrollDto.sss,
                            payrollDto.hdmf,
                            payrollDto.phic
                    )
                }



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
