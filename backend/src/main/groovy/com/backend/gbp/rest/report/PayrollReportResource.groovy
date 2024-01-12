package com.backend.gbp.rest.report


import com.backend.gbp.domain.accounting.AccountsPayable
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.hrm.SalaryRateMultiplier
import com.backend.gbp.domain.payroll.PayrollEmployee
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
        def logo = applicationContext?.getResource("classpath:/reports/logo.png")

        if (logo.exists()) {
            parameters.put("logo", logo?.inputStream)
        }

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

                BigDecimal hourlyRate = TimekeepingEmployeeService.getHourlyRate(employee.employee, 12)
                SalaryRateMultiplier multiplier = salaryRateMultiplierService.getSalaryRateMultiplier()


                def grossBreakdown = employee?.timekeepingEmployee
                def allowance = employee?.allowanceEmployee?.allowanceItems



                BigDecimal regular = 0
                BigDecimal regularHoliday = 0
                BigDecimal late = 0
                BigDecimal overTime = 0
                BigDecimal underTime = 0

                grossBreakdown.projectBreakdown.each {
                    regular += it.regular
                    regularHoliday += it.regularHoliday
                    late += it.late
                    overTime += it.overtime
                    underTime += it.underTime
                }

//                allowance.allowanceItems.each{
//
//                }

                def totalSalary = employee?.timekeepingEmployee?.totalSalary
                def totalHours = employee?.timekeepingEmployee?.totalHours



                grossDtoList.push(new GrossDto(
                            description: "Over Time",
                            nohours: totalHours.overtime,
                            rate: (hourlyRate * multiplier.regularOvertime) as Integer,
                            total: (employee?.timekeepingEmployee?.salaryBreakdown?.overtime ?: 0) as Integer
                    ))
                    grossDtoList.push(new GrossDto(
                            description: "Regular",
                            nohours: totalHours?.regular,
                            rate: (hourlyRate * multiplier.regular) as Integer,
                            total: (employee?.timekeepingEmployee?.salaryBreakdown?.regular ?: 0) as Integer
                    ))

                    grossDtoList.push(new GrossDto(
                            description: "Regular Holiday",
                            nohours:  totalHours.regularHoliday,
                            rate: (hourlyRate *  multiplier.regularHoliday) as Integer,
                            total: (employee?.timekeepingEmployee?.salaryBreakdown?.regularHoliday ?: 0) as Integer
                    ))

//                    if(allowance){
//                       allowance.each {it ->

                           grossDtoList.push(new GrossDto(
                                   description: "Special Non-Working",
                                   nohours: 0,
                                   rate: 100,
                                   total: 0
                           ))

                           grossDtoList.push(new GrossDto(
                                   description: "Vacation Leave",
                                   nohours: 0,
                                   rate: 100,
                                   total: 0
                           ))

                           grossDtoList.push(new GrossDto(
                                   description: "Sick leave",
                                   nohours: 0,
                                   rate: 100,
                                   total: 0
                           ))

                           grossDtoList.push(new GrossDto(
                                   description: "Semi Monthly Allowance",
                                   nohours: 0,
                                   rate: 100,
                                   total: 200
                           ))

                           grossDtoList.push(new GrossDto(
                                   description: "Daily Allowance",
                                   nohours: 0,
                                   rate: 100,
                                   total: 0
                           ))

                           grossDtoList.push(new GrossDto(
                                   description: "Load Allowance",
                                   nohours: 0,
                                   rate: 100,
                                   total: 200
                           ))

                           grossDtoList.push(new GrossDto(
                                   description: "Transportation Allowance",
                                   nohours: 0,
                                   rate: 100,
                                   total: 200
                           ))

                           grossDtoList.push(new GrossDto(
                                   description: "Food Allowance",
                                   nohours: 0,
                                   rate: 100,
                                   total: 200
                           ))
//
//                       }
//                    }



                    grossDtoList.push(new GrossDto(
                            totalGross: 0
                    ))

                //-------- deduction----

                    deductionDtoList.push(new DeductionDto(
                            description: "Late",
                            nohours: (late ?:0) as Integer,
                            rate: 0,
                            total: (employee?.timekeepingEmployee?.salaryBreakdown?.late ?: 0) as Integer
                    ))

                    deductionDtoList.push(new DeductionDto(
                            description: "Under Time",
                            nohours: (underTime ?: 0) as Integer,
                            rate: 0,
                            total: (employee?.timekeepingEmployee?.salaryBreakdown?.underTime ?: 0) as Integer
                    ))



                    deductionDtoList.push(new DeductionDto(
                            description: "Withholding Tax",
                            nohours: 100,
                            rate: 100,
                            total: 0
                    ))
//
                    deductionDtoList.push(new DeductionDto(
                            description: "SSS",
                            nohours: 100,
                            rate: 100,
                            total: 200
                    ))

                    deductionDtoList.push(new DeductionDto(
                            description: "HDMF",
                            nohours: 100,
                            rate: 100,
                            total: 200
                    ))

                    deductionDtoList.push(new DeductionDto(
                            description: "PHIC",
                            nohours: 100,
                            rate: 100,
                            total: 200
                    ))

//                deductionDtoList.push( new DeductionDto(
//                        description: "HMO Insurance",
//                        nohours: 100,
//                        rate: 100,
//                        total: 200
//                ))
////
//                deductionDtoList.push( new DeductionDto(
//                        description: "Cash Advance",
//                        nohours: 100,
//                        rate: 100,
//                        total: 200
//                ))
//
//                deductionDtoList.push( new DeductionDto(
//                        description: "Item Credit",
//                        nohours: 100,
//                        rate: 100,
//                        total: 200
//                ))

                    summaryDtoList.push(new SummaryDto(
                            description: "Sample 1",
                            nohours: 100,
                            rate: 100,
                            total: 200
                    ))


                    def data = new PayslipPayrollDto(
                            empId: employee?.employee?.employeeNo ?: "",
                            empname: employee?.employee?.fullName ?: "",
                            department: employee?.company?.companyName ?: "",
//                            regularNoHrs: 0,
//                            regularRate: 100.0,
//                            regularTotal: 123.0,
                            descriptionField: new JRBeanCollectionDataSource(grossDtoList),
                            deductionField: new JRBeanCollectionDataSource(deductionDtoList),
                            summaryField: new JRBeanCollectionDataSource(summaryDtoList),
                            payrollCode: '0',
//                            payPeriod: null,
//                            paycheckdate: null,
                            totalGross: 1000,
                            totalDeduction: 1000,
                            totalAdjustment: 1000,
                            netpay: 1000

                    )

//                    params1.add(data)

                    if (idx % 2 == 0) {
                        params1.add(data)
                    } else {
                        params2.add(data)
                    }

                }

            }

            if (!params1.isEmpty()) {
                parameters.put("params1", new JRBeanCollectionDataSource(params1));
            }

            if (!params2.isEmpty()) {
                parameters.put("params2", new JRBeanCollectionDataSource(params2));
            }


//        if (params1) {
//            parameters.put('params1', new JRBeanCollectionDataSource(params1))
//        }

            def dto = new DetailDto(
                    detail1: '',
            )

            def gson = new Gson()
            def dataSourceByteArray = new ByteArrayInputStream(gson.toJson(dto).bytes)
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
