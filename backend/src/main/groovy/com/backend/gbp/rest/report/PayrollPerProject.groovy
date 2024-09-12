package com.backend.gbp.rest.report

import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.payroll.Payroll
import com.backend.gbp.domain.payroll.PayrollEmployee
import com.backend.gbp.domain.payroll.TimekeepingEmployee
import com.backend.gbp.graphqlservices.payroll.TimekeepingEmployeeService
import com.backend.gbp.repository.hrm.EmployeeRepository
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
import java.time.ZoneId
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter
import java.util.concurrent.Callable


@Canonical
class PayrollPerRegDto {
    String companyName;
    String projectName;
    String payrollCode;
    String name;
    String hours;
    String grossPay;
}

@Canonical
class HrsDto{
   String empName;
   BigDecimal hours;
   BigDecimal grossPay;

}

@Canonical
class  PayrollPerProj{
    UUID id;
    String projectName;
}



@TypeChecked
@RestController
@RequestMapping('/reports/payroll/print')
class PayrollPerProject {

    @Autowired
    PayrollEmployeeRepository payrollEmployeeRepository

    @Autowired
    PayrollRepository payrollRepository

    @Autowired
    EmployeeRepository employeeRepository



    @RequestMapping("/payrollPerRegister")
    Callable<ResponseEntity<byte[]>> payrollPerRegister(
            @RequestParam(name ="id") UUID id

    ) {
        Map<UUID, Employee> employeeMap = [:]
        Map<UUID, BigDecimal> prjTotal = [:]

        Map<UUID, PayrollPerProj> projGroup = [:]
        Map<UUID, Map<UUID,HrsDto>> empPrjHours = [:]
        def payroll = payrollRepository.findById(id).get()

        Instant currentInstant = Instant.now();
        ZonedDateTime zonedDateTime = currentInstant.atZone(ZoneId.of("UTC"));
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");
        String formattedDate = formatter.format(zonedDateTime);
        DateTimeFormatter formatterD = DateTimeFormatter.ofPattern("MM-dd-yyyy").withZone(ZoneId.systemDefault())
        String startDate = formatterD.format(payroll?.dateStart)
        String endDate = formatterD.format(payroll?.dateEnd)

        return new Callable<ResponseEntity<byte[]>>() {
            @Override
            ResponseEntity<byte[]> call() throws Exception {
                StringBuffer buffer = new StringBuffer()
                CSVPrinter csvPrinter = new CSVPrinter(buffer, CSVFormat.POSTGRESQL_CSV)

                csvPrinter.printRecord("Company Name", payroll.company.companyName ?: "")
                csvPrinter.printRecord("Payroll Code", payroll.code ?: "")
                csvPrinter.printRecord("PayPeriod from ", "${startDate} to ${endDate}")

                BigDecimal totalPay = 0.0

                if (payroll) {
                    def timekeeping = payroll?.timekeeping;

                    timekeeping.timekeepingEmployees.each {
                        def gross = it.totalSalary

                        BigDecimal ttGross = gross?.getTotal() ?: 0.0


                        it.accumulatedLogs?.each { al ->
                            def employee = new Employee()
                            if (employeeMap[al?.employeeId]) {

                                employee = employeeMap[al?.employeeId]
                            } else {
                                employee = employeeRepository.findById(al?.employeeId).get()
                                employeeMap[al?.employeeId] = employee
                            }


                            al.projectBreakdown.each {
                                hl ->

                                    if (!projGroup[hl.project]) {
                                        PayrollPerProj proj =  new PayrollPerProj()
                                        proj.id = hl.project
                                        proj.projectName = hl.projectName
                                        projGroup[hl.project] = proj
                                        prjTotal[hl.project] = 0.00
                                    }

                                    if(empPrjHours[hl.project]){
                                        if(empPrjHours[hl.project][al?.employeeId]){
                                            empPrjHours[hl.project][al?.employeeId].hours += hl?.overtime + hl?.regular + hl?.regularHoliday + hl?.regularDoubleHoliday + hl?.regularSpecialHoliday + hl?.overtimeSpecialHoliday + hl?.overtimeDoubleHoliday + hl?.overtimeHoliday
                                        }
                                        else {
                                            HrsDto hrs = new HrsDto()

                                            hrs.empName = employee?.fullName
                                            hrs.hours = hl?.overtime + hl?.regular + hl?.regularHoliday + hl?.regularDoubleHoliday + hl?.regularSpecialHoliday + hl?.overtimeSpecialHoliday + hl?.overtimeDoubleHoliday + hl?.overtimeHoliday
                                            hrs.grossPay = ttGross
                                            empPrjHours[hl.project][al?.employeeId] = hrs
                                            prjTotal[hl.project] = prjTotal[hl.project] + ttGross
                                        }
                                    }else {
                                        Map<UUID,HrsDto> hrsDtoMap = [:]
                                        HrsDto hrs = new HrsDto()
                                        hrs.empName = employee?.fullName
                                        hrs.hours = hl?.totalRegularHours
                                        hrsDtoMap[al?.employeeId] = hrs
                                        empPrjHours[hl.project] = hrsDtoMap
                                    }

                            }
                        }
                    }

                    BigDecimal AllTotal = 0.00

                    projGroup.each {
                        project, projInfo ->
                            csvPrinter.printRecord("")
                            csvPrinter.printRecord("")
                            csvPrinter.printRecord( projInfo?.projectName ?: "")
                            csvPrinter.printRecord("Name", "Hours", "Gross Pay")
                            csvPrinter.printRecord("")

                            empPrjHours[project].each {
                                empId, hrs ->
                                    csvPrinter.printRecord(hrs.empName, hrs.hours, hrs.grossPay);
                            }

                            csvPrinter.printRecord("")
                            csvPrinter.printRecord("Total Pay", "", prjTotal[project])
                            AllTotal +=prjTotal[project]
                    }
                    csvPrinter.printRecord("")
                    csvPrinter.printRecord("Total Pay for Company","", AllTotal)
                }

                def data = buffer.toString().getBytes(Charset.defaultCharset())
                def responseHeaders = new HttpHeaders()
                responseHeaders.setContentType(MediaType.TEXT_PLAIN)
                responseHeaders.setContentLength(data.length)
                responseHeaders.add("Content-Disposition", "attachment;filename=payrollPerRegister.csv")
                return new ResponseEntity(data, responseHeaders, HttpStatus.OK)

            }
        }
    }
}
