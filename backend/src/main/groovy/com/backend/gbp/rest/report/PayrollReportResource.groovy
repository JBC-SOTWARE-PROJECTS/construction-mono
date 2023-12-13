package com.backend.gbp.rest.report


import com.backend.gbp.domain.accounting.AccountsPayable
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.graphqlservices.CompanySettingsService
import com.backend.gbp.repository.OfficeRepository
import com.backend.gbp.repository.UserRepository
import com.backend.gbp.repository.accounting.AccountPayeableRepository
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.rest.dto.DeductionDto
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


    @RequestMapping(value = ["/payslipPayroll/{id}"], produces = ["application/pdf"])
    ResponseEntity<byte[]> payslipPayroll(
            @PathVariable('id') String id
    ) {

        def com = companySettingsService.comById()
//        def emp = employeeRepository.getAllEmployee(UUID.fromString(id) as List<UUID>)

        def idList = id.split(',').collect { UUID.fromString(it.trim()) }

        // Call the repository method with the list of UUIDs
        def emp = employeeRepository.getAllEmployee(idList)

        def res = applicationContext?.getResource("classpath:/reports/payroll/reportPayslip.jasper")
        def bytearray = new ByteArrayInputStream()
        def os = new ByteArrayOutputStream()
        def parameters = [:] as Map<String, Object>
        def logo = applicationContext?.getResource("classpath:/reports/logo.png")

        if (logo.exists()) {
            parameters.put("logo", logo?.inputStream)
        }

        def records = []
        List<Employee> employeeList = employeeRepository.getAllEmployee(idList)
        def params1 = new ArrayList<PayslipPayrollDto>()
        def params2 = new ArrayList<PayslipPayrollDto>()


        if (emp) {
            Integer count = 1
                emp.eachWithIndex { employee, idx ->

                    List<GrossDto> grossDtoList = [];
                    List<DeductionDto> deductionDtoList = []
                    List<SummaryDto> summaryDtoList = []

                    grossDtoList.push( new GrossDto(
                            description: "Regular",
                            nohours: 100,
                            rate: 100,
                            total: 200
                    ))

//                    grossDtoList.push( new GrossDto(
//                            description: "Late",
//                            nohours: 0,
//                            rate: 100,
//                            total: 200
//                    ))
//
//                    grossDtoList.push( new GrossDto(
//                            description: "Under Time",
//                            nohours: 0,
//                            rate: 100,
//                            total: 200
//                    ))
//
//                    grossDtoList.push( new GrossDto(
//                            description: "Over Time",
//                            nohours: 0,
//                            rate: 100,
//                            total: 200
//                    ))
//
//                    grossDtoList.push( new GrossDto(
//                            description: "Regular Holiday",
//                            nohours: 0,
//                            rate: 100,
//                            total: 200
//                    ))
//
//                    grossDtoList.push( new GrossDto(
//                            description: "Special Non-Working",
//                            nohours: 0,
//                            rate: 100,
//                            total: 200
//                    ))
//
//                    grossDtoList.push( new GrossDto(
//                            description: "Vacation Leave",
//                            nohours: 0,
//                            rate: 100,
//                            total: 200
//                    ))
//
//                    grossDtoList.push( new GrossDto(
//                            description: "Sick leave",
//                            nohours: 0,
//                            rate: 100,
//                            total: 200
//                    ))
//
//                    grossDtoList.push( new GrossDto(
//                            description: "Semi Monthly Allowance",
//                            nohours: 0,
//                            rate: 100,
//                            total: 200
//                    ))
//
//                    grossDtoList.push( new GrossDto(
//                            description: "Daily Allowance",
//                            nohours: 0,
//                            rate: 100,
//                            total: 200
//                    ))
//
//                    grossDtoList.push( new GrossDto(
//                            description: "Load Allowance",
//                            nohours: 0,
//                            rate: 100,
//                            total: 200
//                    ))
//
//                    grossDtoList.push( new GrossDto(
//                            description: "Transportation Allowance",
//                            nohours: 0,
//                            rate: 100,
//                            total: 200
//                    ))
//
//                    grossDtoList.push( new GrossDto(
//                            description: "Food Allowance",
//                            nohours: 0,
//                            rate: 100,
//                            total: 200
//                    ))

                    deductionDtoList.push( new DeductionDto(
                            description: "Withholding Tax",
                            nohours: 100,
                            rate: 100,
                            total: 200
                    ))

                    deductionDtoList.push( new DeductionDto(
                            description: "SSS",
                            nohours: 100,
                            rate: 100,
                            total: 200
                    ))

                    summaryDtoList.push(new SummaryDto(
                            description: "Sample 1",
                            nohours: 100,
                            rate: 100,
                            total: 200
                    ))


                    def data = new PayslipPayrollDto(
                            empId: employee?.employeeNo ?: "",
                            empname: employee.fullName ?: "",
                            department: employee?.office?.company?.companyName ?: "",
                            regularNoHrs: 0,
                            regularRate: 100.0,
                            regularTotal: 123.0,
                            descriptionField: new JRBeanCollectionDataSource(grossDtoList),
                            deductionField : new JRBeanCollectionDataSource(deductionDtoList),
                            summaryField: new JRBeanCollectionDataSource(summaryDtoList),
                            payrollCode: "19993",
                            payPeriod: "1239848",
                            paycheckdate: "19283",
                            totalGross: 1000

                    )

                    params1.add(data)

//                    if(idx % 2==0){
//                        params1(data)
//                    }else{
//                        params2(data)
//                    }

                }

        }

//        def gson = new Gson()
//        def dataSourceByteArray = new ByteArrayInputStream(gson.toJson(params1).bytes)
//        def dataSource = new JsonDataSource(dataSourceByteArray)

        if (params1) {
            parameters.put('params1', new JRBeanCollectionDataSource(params1))
        }


        //printing
        try {
            def jrprint = JasperFillManager.fillReport(res.inputStream, parameters)

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
        params.add("Content-Disposition", "inline;filename=SOA-\""+"\".pdf")
        return new ResponseEntity(data, params, HttpStatus.OK)


    }

}
