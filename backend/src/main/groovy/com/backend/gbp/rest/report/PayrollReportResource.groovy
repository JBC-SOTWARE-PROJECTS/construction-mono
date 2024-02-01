package com.backend.gbp.rest.report


import com.backend.gbp.domain.accounting.AccountsPayable
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.hrm.SalaryRateMultiplier
import com.backend.gbp.domain.hrm.enums.AllowanceType
import com.backend.gbp.domain.payroll.PayrollEmployee
import com.backend.gbp.domain.payroll.enums.AdjustmentOperation
import com.backend.gbp.graphqlservices.CompanySettingsService
import com.backend.gbp.graphqlservices.hrm.SalaryRateMultiplierService
import com.backend.gbp.graphqlservices.payroll.TimekeepingEmployeeService
import com.backend.gbp.repository.OfficeRepository
import com.backend.gbp.repository.UserRepository
import com.backend.gbp.repository.accounting.AccountPayeableRepository
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.repository.hrm.SalaryRateMultiplierRepository
import com.backend.gbp.repository.payroll.PayrollEmployeeRepository
import com.backend.gbp.rest.dto.DeductionDto
import com.backend.gbp.rest.dto.DetailDto
import com.backend.gbp.rest.dto.GrossDto
import com.backend.gbp.rest.dto.HeaderDto
import com.backend.gbp.rest.dto.HeadersDto
import com.backend.gbp.rest.dto.PayslipPayrollDto
import com.backend.gbp.rest.dto.SummaryDto
import com.backend.gbp.rest.dto.TotalNetPay
import com.google.gson.Gson
import groovy.transform.TypeChecked
import net.sf.jasperreports.engine.JRException
import net.sf.jasperreports.engine.JasperFillManager
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource
import net.sf.jasperreports.engine.data.JsonDataSource
import net.sf.jasperreports.engine.export.JRPdfExporter
import net.sf.jasperreports.export.SimpleExporterInput
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput
import net.sf.jasperreports.export.SimplePdfExporterConfiguration
import org.apache.commons.io.IOUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.ApplicationContext
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.util.LinkedMultiValueMap
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController
import org.xmlsoap.schemas.soap.encoding.Int

import javax.swing.text.DateFormatter
import java.math.RoundingMode
import java.time.Instant
import java.time.ZoneId
import java.time.ZonedDateTime
import java.time.format.DateTimeFormatter

@TypeChecked
@RestController
@RequestMapping('/reports/payroll/print')
class PayrollReportResource {

    @Autowired
    ApplicationContext applicationContext

    @Autowired
    UserRepository userRepository

    @Autowired
    EmployeeRepository employeeRepository

    @Autowired
    OfficeRepository officeRepository

    @Autowired
    CompanySettingsService companySettingsService

    @Autowired
    PayrollEmployeeRepository payrollEmployeeRepository

    @Autowired
    SalaryRateMultiplierService salaryRateMultiplierService


    @RequestMapping(value = ["/payslipPayroll/{id}"], produces = ["application/pdf"])
    ResponseEntity<byte[]> payslipPayroll(
            @PathVariable('id')  List<UUID> id
    ) {

        def com = companySettingsService.comById()
//        def emp = employeeRepository.getAllEmployee(id)

//        def idList = id.split(',').collect { UUID.fromString(it.trim()) }

        // Call the repository method with the list of UUIDs
//        def emp = employeeRepository.getAllEmployee(id)
//        payroll_report_payslip_4
        def res = applicationContext?.getResource("classpath:/reports/payroll/payroll_report_payslip_4.jasper")
        def bytearray = new ByteArrayInputStream()
        def os = new ByteArrayOutputStream()
        def parameters = [:] as Map<String, Object>
        def logo = applicationContext?.getResource("classpath:/reports/payroll.jpg")

//        if (logo.exists()) {
//            parameters.put("logo", logo?.inputStream)
//        }

        Instant currentInstant = Instant.now();

        // Convert the instant to a ZonedDateTime in a specific time zone (e.g., UTC)
        ZonedDateTime zonedDateTime = currentInstant.atZone(ZoneId.of("UTC"));

        // Define the desired date format pattern
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy");

        // Format the ZonedDateTime using the specified pattern
        String formattedDate = formatter.format(zonedDateTime);

//        List<Employee> employeeList = employeeRepository.getAllEmployee(null)
//
        List<PayrollEmployee> payrollEmployees = payrollEmployeeRepository.getAllPayrollEmpById(id)

        def params1 = new ArrayList<PayslipPayrollDto>()
        def params2 = new ArrayList<PayslipPayrollDto>()


        if (payrollEmployees) {
            payrollEmployees.eachWithIndex { employee, idx ->

                List<GrossDto> grossDtoList = [];
                List<DeductionDto> deductionDtoList = []
                List<SummaryDto> summaryDtoList = []
                List<TotalNetPay> totalNetPays = []

                BigDecimal hourlyRate = TimekeepingEmployeeService.getHourlyRate(employee.employee, 12)
                SalaryRateMultiplier multiplier = salaryRateMultiplierService.getSalaryRateMultiplier()


                def grossTotal = employee;
                def grossBreakdown = employee?.timekeepingEmployee;
                def allowance = employee?.allowanceEmployee;
                def contribution = employee?.payrollEmployeeContribution;
                def summary = employee?.employeeAdjustment;





                BigDecimal regular = 0.0
                BigDecimal regularHoliday = 0.0
                BigDecimal late = 0.0
                BigDecimal overTime = 0.0
                BigDecimal underTime = 0.0

                grossBreakdown.projectBreakdown.each {
                    regular += it.regular
                    regularHoliday += it.regularHoliday ?: 0.0
                    late += it.late ?: 0.0
                    overTime += it.overtime ?: 0.0
                    underTime += it.underTime ?: 0.0
                }



                def totalSalary = employee?.timekeepingEmployee?.totalSalary
                def totalHours = employee?.timekeepingEmployee?.totalHours


                BigDecimal grossTT = 0.0

                allowance.allowanceItems.each{
                    grossTT = it.amount ?: 0.0
                }

                BigDecimal adjustTotal = 0.0

                summary.adjustmentItems.each{
                    if(it.operation == AdjustmentOperation.ADDITION){
                        adjustTotal += it.amount
                    }else if(it.operation == AdjustmentOperation.SUBTRACTION){
                        adjustTotal -= it.amount
                    }
                }

                def totalNetPay = (totalSalary?.regular ?: 0.0) + (totalSalary?.overtime ?: 0.0) + (totalSalary?.regularHoliday ?: 0.0);
                def deduction = (totalSalary?.late ?: 0.0) + (totalSalary?.underTime ?: 0.0) + (employee?.withholdingTax ?: 0.0) +
                                (contribution?.sssEE ?: 0.0) + (contribution?.hdmfEE ?: 0.0) + (contribution?.phicEE ?: 0.0);
                def finalTotalPay = totalNetPay + grossTT - deduction + adjustTotal;

                    grossDtoList.push(new GrossDto(

                            description: "Over Time",
                            nohours: ((totalHours?.overtime ?: "0") as BigDecimal).setScale(2, RoundingMode.HALF_UP).toString(),
                            rate: ((hourlyRate * multiplier?.regularOvertime ?: '') as BigDecimal).round(2).toString(),
                            total: ((totalSalary?.overtime ?: 0.0) as BigDecimal).round(2),
                    ))


                    grossDtoList.push(new GrossDto(
                            description: "Regular",
                            nohours: ((totalHours?.regular ?: "0") as BigDecimal).setScale(2, RoundingMode.HALF_UP).toString(),
                            rate: ((hourlyRate * multiplier?.regular ?: '') as BigDecimal).round(2).toString(),
                            total: ((totalSalary?.regular ?: '') as BigDecimal).round(2),
                    ))

                    grossDtoList.push(new GrossDto(
                            description: "Regular Holiday",
                            nohours:  ((totalHours?.regularHoliday ?: "0") as BigDecimal).setScale(2, RoundingMode.HALF_UP).toString(),
                            rate: ((hourlyRate *  multiplier?.regularHoliday ?: '') as BigDecimal).round(2).toString(),
                            total: ((totalSalary?.regularHoliday ?: 0.0) as BigDecimal).round(2),

                    ))

//
//                           grossDtoList.push(new GrossDto(
//                                   description: "Special Non-Working",
//                                   nohours: 0.0,
//                                   rate: 0.0,
//                                   total: 0.0
//                           ))
//

                            allowance.allowanceItems.each {
                                grossDtoList.push(new GrossDto(
                                        description: it?.name ?: '',
                                        nohours: '',
                                        rate: '',
                                        total: it?.amount ?: 0.0
                                ))
                            }



////
//                    grossDtoList.push(new GrossDto(
//                            totalGross: 0.0
//                    ))

                //-------- deduction----



                    deductionDtoList.push(new DeductionDto(
                            description: "Late",
                            nohours: ((totalHours?.late ?: "0") as BigDecimal).setScale(2, RoundingMode.HALF_UP).toString(),
                            rate: '',
                            total: ((totalSalary?.late ?: 0.0) as BigDecimal).round(2),
                    ))

                    deductionDtoList.push(new DeductionDto(
                            description: "Under Time",
                            nohours: ((totalHours?.underTime ?: "0") as BigDecimal).setScale(2, RoundingMode.HALF_UP).toString(),
                            rate: '',
                            total: ((totalSalary?.underTime ?: 0.0) as BigDecimal).round(2)
                    ))



                    deductionDtoList.push(new DeductionDto(
                            description: "Withholding Tax",
//                            nohours: '',
//                            rate: 0.0,
                            total:  employee?.withholdingTax ?: 0.0
                    ))
//
                    deductionDtoList.push(new DeductionDto(
                            description: "SSS",
//                            nohours: '',
//                            rate: 0.0,
                            total: contribution?.sssEE ?: 0.0
                    ))

                    deductionDtoList.push(new DeductionDto(
                            description: "HDMF",
//                            nohours: 0.0,
//                            rate: 0.0,
                            total: ((contribution?.hdmfEE ?: 0.0) as BigDecimal).round(2)
                    ))

                    deductionDtoList.push(new DeductionDto(
                            description: "PHIC",
//                            nohours: 0.0,
//                            rate: 0.0,
                            total: ((contribution?.phicEE ?: 0.0) as BigDecimal).round(2)
                    ))

//                deductionDtoList.push( new DeductionDto(
//                        description: "HMO Insurance",
//                        nohours: 100,
//                        rate: 100,
//                        total: contribution?.
//                ))
////
//                deductionDtoList.push( new DeductionDto(
//                        description: "Cash Advance",
//                        nohours: 100.0,
//                        rate: 100.0,
//                        total: 200.0
//                ))
////
//                deductionDtoList.push( new DeductionDto(
//                        description: "Item Credit",
//                        nohours: 100.0,
//                        rate: 100.0,
//                        total: 200.0
//                ))



                if(summary.adjustmentItems){
                    summary.adjustmentItems.each {it->
                        def sumOp
                         if(it.operation.toString() == "ADDITION"){
                             sumOp = "+";
                         } else if(it.operation.toString() == "SUBTRACTION"){
                             sumOp = "-";
                         }else{
                             sumOp = ''
                         }

                        def ggwp =it.operation?.toString();

                        summaryDtoList.push(new SummaryDto(
                                description: it.name ?: '',
//                                nohours: 0.0,
                                rate: sumOp,
                                total: ((it.amount ?: 0.0) as BigDecimal).round(2)
                        ))
                    }
                }


                def data = new PayslipPayrollDto(
                            empId: employee?.employee?.employeeNo ?: "",
                            empname: employee?.employee?.fullName ?: "",
                            department: employee?.employee?.office?.officeDescription ?: "",
                            descriptionField: new JRBeanCollectionDataSource(grossDtoList),
                            deductionField: new JRBeanCollectionDataSource(deductionDtoList),
                            summaryField: new JRBeanCollectionDataSource(summaryDtoList),
                            payrollCode: employee?.payroll?.code ?: '',
//                            payPeriod: employee?.payroll?.dateEnd ?: '',
//                            paycheckdate: null,
                            netpay: finalTotalPay,
                            dateprinted: formattedDate,
                            logo: logo?.inputStream

                    )

                    if (idx % 2 == 0) {
                        params1.add(data)
                    } else {
                        params2.add(data)
                    }
                }
            }

//            if (logo.exists()) {
//                 parameters.put("logo", logo?.inputStream)
//            }

            if (!params1.isEmpty()) {
                parameters.put("params1",  new JRBeanCollectionDataSource(params1));

            }

            if (!params2.isEmpty()) {
                parameters.put("params2", new JRBeanCollectionDataSource(params2));
            }


            def dto = new DetailDto(
                    detail1: '',
            )

            def gson = new Gson()
            def dataSourceByteArray = new ByteArrayInputStream(gson.toJson(dto).getBytes("UTF-8"))
            def dataSource = new JsonDataSource(dataSourceByteArray)


            //printing
            try {
                def jrprint = JasperFillManager.fillReport(res.inputStream, parameters, dataSource)

                def pdfExporter = new JRPdfExporter()

                def outputStreamExporterOutput = new SimpleOutputStreamExporterOutput(os)

                pdfExporter.setExporterInput(new SimpleExporterInput(jrprint))
                pdfExporter.setExporterOutput(outputStreamExporterOutput)
                def configuration = new SimplePdfExporterConfiguration()
                pdfExporter.setConfiguration(configuration)
                pdfExporter.exportReport()

            } catch (JRException e) {
                e.printStackTrace()
            } catch (IOException e) {
                e.printStackTrace()
            }

            if (bytearray != null)
                IOUtils.closeQuietly(bytearray)
            //end

            def data = os.toByteArray()
            def params = new LinkedMultiValueMap<String, String>()
            params.add("Content-Disposition", "inline;filename=SOA-\"" + "\".pdf")
            return new ResponseEntity(data, params, HttpStatus.OK)


        }

}

