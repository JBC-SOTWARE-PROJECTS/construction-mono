package com.backend.gbp.rest

import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.Office
import com.backend.gbp.domain.accounting.ArInvoice
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.projects.ProjectWorkAccomplish
import com.backend.gbp.graphqlservices.inventory.*
import com.backend.gbp.graphqlservices.projects.ProjectService
import com.backend.gbp.graphqlservices.projects.ProjectWorkAccomplishItemsService
import com.backend.gbp.graphqlservices.projects.ProjectWorkAccomplishService
import com.backend.gbp.rest.dto.*
import com.backend.gbp.security.SecurityUtils
import com.backend.gbp.services.GeneratorService
import com.fasterxml.jackson.databind.ObjectMapper
import com.google.gson.Gson
import groovy.transform.Canonical
import net.sf.jasperreports.engine.JRException
import net.sf.jasperreports.engine.JasperFillManager
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource
import net.sf.jasperreports.engine.data.JsonDataSource
import net.sf.jasperreports.engine.export.JRPdfExporter
import net.sf.jasperreports.export.SimpleExporterInput
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput
import net.sf.jasperreports.export.SimplePdfExporterConfiguration
import org.apache.commons.csv.CSVFormat
import org.apache.commons.csv.CSVPrinter
import org.apache.commons.lang3.StringUtils
import org.apache.xmlbeans.impl.xb.xsdschema.AnyDocument
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.ApplicationContext
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.jdbc.core.BeanPropertyRowMapper
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.util.LinkedMultiValueMap
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

import java.text.SimpleDateFormat
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter

@Canonical
class StatementOfWorkAccomplishedDto {
	String contractId
	String contractName
	String location
	String contractor
	String periodStart
	String periodEnd
	String preparedBy
	String verifiedBy
	String checkedBy
	String recommendBy
	String paymentBy
}

@RestController
class ProjectResource {

	@Autowired
	ApplicationContext applicationContext

	@Autowired
	ProjectWorkAccomplishItemsService accomplishItemsService

	@Autowired
	ProjectWorkAccomplishService accomplishService

	@Autowired
	ProjectService projectService

	@RequestMapping(value = "/statement-of-work-accomplished", produces = ["application/pdf"])
	ResponseEntity<byte[]> statementOfWorkAccomplish(
			@RequestParam UUID id
	) {
		ProjectWorkAccomplish accomplish = accomplishService.findOne(id)

		def res = applicationContext.getResource("classpath:/reports/inventory/statement_of_work_accomplish.jasper")
		def os = new ByteArrayOutputStream()
		def parameters = [:] as Map<String, Object>

		def project = projectService.findOne(accomplish.project)
		def items = accomplishItemsService.getProjectWorkAccomplishItemsByGroupId(accomplish.id)

		if (items) {
			parameters.put('work_items', new JRBeanCollectionDataSource(items))
		}

		def inputFormat = new SimpleDateFormat("yyyy-MM-dd")
		def outputFormat = new SimpleDateFormat("MMMM d,yyyy")

		def start = inputFormat.parse(accomplish.periodStart)
		def formattedStart = outputFormat.format(start)

		def end = inputFormat.parse(accomplish.periodEnd)
		def formattedEnd = outputFormat.format(end)

		def dto = new StatementOfWorkAccomplishedDto(
				contractId: project.contractId,
				contractName: project.description,
				location: project.location.fullAddress,
				contractor: "",
				periodStart:formattedStart,
				periodEnd: formattedEnd,
				preparedBy: accomplish.preparedBy,
				verifiedBy: accomplish.verifiedBy,
				checkedBy: accomplish.checkedBy,
				recommendBy: accomplish.recommendingApproval,
				paymentBy: accomplish.approvedForPayment,
		)

		def gson = new Gson()
		def dataSourceByteArray = new ByteArrayInputStream(gson.toJson(dto).getBytes("UTF8"))
		def dataSource = new JsonDataSource(dataSourceByteArray)


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

		def data = os.toByteArray()
		def params = new LinkedMultiValueMap<String, String>()
		params.add("Content-Disposition", "inline;filename=statement-work-accomplished-" + accomplish.recordNo + ".pdf")
		return new ResponseEntity(data, params, HttpStatus.OK)

	}
}
