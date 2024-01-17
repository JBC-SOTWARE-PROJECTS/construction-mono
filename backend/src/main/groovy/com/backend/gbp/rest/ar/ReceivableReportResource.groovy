package com.backend.gbp.rest.ar

import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.Office
import com.backend.gbp.domain.accounting.ArCreditNote
import com.backend.gbp.domain.accounting.ArCreditNoteItems
import com.backend.gbp.domain.accounting.ArInvoice
import com.backend.gbp.domain.accounting.HeaderLedger
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.graphqlservices.CompanySettingsService
import com.backend.gbp.graphqlservices.accounting.ArCreditNoteItemServices
import com.backend.gbp.graphqlservices.accounting.ArCreditNoteService
import com.backend.gbp.graphqlservices.accounting.ArInvoiceItemServices
import com.backend.gbp.graphqlservices.accounting.ArInvoiceServices
import com.backend.gbp.graphqlservices.accounting.LedgerServices
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.rest.dto.ARCreditNoteFieldsDto
import com.backend.gbp.rest.dto.ARInvoiceBankDto
import com.backend.gbp.rest.dto.ARInvoiceDto
import com.backend.gbp.rest.dto.ARInvoiceFieldsDto
import com.backend.gbp.rest.dto.ArCreditNoteItemsDTO
import com.backend.gbp.rest.dto.ArCreditNoteJournalEntryDTO
import com.backend.gbp.security.SecurityUtils
import com.google.gson.Gson
import net.sf.jasperreports.engine.JRException
import net.sf.jasperreports.engine.JasperFillManager
import net.sf.jasperreports.engine.data.JRBeanCollectionDataSource
import net.sf.jasperreports.engine.data.JsonDataSource
import net.sf.jasperreports.engine.export.JRPdfExporter
import net.sf.jasperreports.export.SimpleExporterInput
import net.sf.jasperreports.export.SimpleOutputStreamExporterOutput
import net.sf.jasperreports.export.SimplePdfExporterConfiguration
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.ApplicationContext
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.util.LinkedMultiValueMap
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

import javax.persistence.EntityManager
import java.text.SimpleDateFormat
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter

@RestController
@RequestMapping("/arreports")
class ReceivableReportResource {

	@Autowired
	EmployeeRepository employeeRepository

	@Autowired
	ApplicationContext applicationContext

	@Autowired
	ArInvoiceItemServices arInvoiceItemServices

	@Autowired
	ArInvoiceServices arInvoiceServices

	@Autowired
	ArCreditNoteService arCreditNoteService

	@Autowired
	ArCreditNoteItemServices arCreditNoteItemServices

	@Autowired
	LedgerServices ledgerServices

	@Autowired
	CompanySettingsService companySettingsService
//
//	@Autowired
//	ArStatementOfAccountServices statementOfAccountServices
//
//	@Autowired
//	ArStatementOfAccountItemsServices statementOfAccountItemsServices

	@RequestMapping(value = "/arinvoice", produces = ["application/pdf"])
	ResponseEntity<byte[]> arinvoice(
			@RequestParam UUID id
	) {
		ArInvoice invoice = arInvoiceServices.findOne(id)

		def res = applicationContext.getResource("classpath:/reports/ar/arinvoice.jasper")
		def os = new ByteArrayOutputStream()
		def parameters = [:] as Map<String, Object>
		def maker = employeeRepository.findByUsername(invoice.createdBy).first()

		SimpleDateFormat invoiceDateFormat = new SimpleDateFormat("MM/dd/yyyy")
		SimpleDateFormat dueDateFormat = new SimpleDateFormat("dd MMM yyyy")

		CompanySettings company = companySettingsService.comById(SecurityUtils.currentCompanyId())
		Employee emp = employeeRepository.findByUsername(SecurityUtils.currentLogin()).first()
		Office office = emp.office
		def logo = applicationContext?.getResource("classpath:/reports/${company.logoFileName ?: "logo.png"}")

		//parameters
		parameters.put("companyName", company.companyName.trim())
		parameters.put("address", office.fullAddress ? office.fullAddress.trim() : "")
		parameters.put("phone", office.phoneNo)
		parameters.put("email", office.emailAdd)

		if (logo.exists()) {
			parameters.put("logo", logo?.getURL())
		}

		List<ARInvoiceDto> dtoList = arInvoiceItemServices.getARInvoiceItemPerId(id)
		DateTimeFormatter dtf = DateTimeFormatter.ofPattern("MM/dd/yyyy")
		LocalDateTime now = LocalDateTime.now()

		if (dtoList) {
			parameters.put('invoice_items', new JRBeanCollectionDataSource(dtoList))
		}

		def dto = new ARInvoiceFieldsDto(
				customer_account_number:"Customer Account Number: ${invoice?.arCustomer?.accountNo?:''}",
				customer_name:"Customer Account Name: ${invoice.arCustomer.customerName}",
				customer_address:"Billing Address: ${invoice.billingAddress}",
				invoice_date: "Invoice Date: ${invoiceDateFormat.format(invoice.invoiceDate)}",
				invoice_intro: "Please find below the list of the patients who availed our Hospital Services :",
				invoice_number:"Invoice Number: ${invoice.invoiceNo}",
				due_date:"Due Date:${dueDateFormat.format(invoice.dueDate)}",
				prepared_by:"${StringUtils.upperCase(maker.fullName)} ${dtf.format(now)}",
				noted_by:"",
				notes: invoice.notes ?: null,
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
		params.add("Content-Disposition", "inline;filename=invoice-" + invoice.invoiceNo + ".pdf")
		return new ResponseEntity(data, params, HttpStatus.OK)

	}

	@RequestMapping(value = "/arcreditnote", produces = ["application/pdf"])
	ResponseEntity<byte[]> arcreditnote(
			@RequestParam UUID id
	) {
		ArCreditNote creditNote = arCreditNoteService.findOne(id)


		def res = applicationContext.getResource("classpath:/reports/ar/arcreditnote.jasper")
		def os = new ByteArrayOutputStream()
		def parameters = [:] as Map<String, Object>

		def maker = employeeRepository.findByUsername(creditNote.createdBy).first()

		SimpleDateFormat invoiceDateFormat = new SimpleDateFormat("MM/dd/yyyy")
		def formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd")

		CompanySettings company = companySettingsService.comById(SecurityUtils.currentCompanyId())
		Employee emp = employeeRepository.findByUsername(SecurityUtils.currentLogin()).first()
		Office office = emp.office
		def logo = applicationContext?.getResource("classpath:/reports/${company.logoFileName ?: "logo.png"}")

		//parameters
		parameters.put("companyName", company.companyName.trim())
		parameters.put("address", office.fullAddress ? office.fullAddress.trim() : "")
		parameters.put("phone", office.phoneNo)
		parameters.put("email", office.emailAdd)

		if (logo.exists()) {
			parameters.put("logo", logo?.getURL())
		}

		List<ArCreditNoteJournalEntryDTO> journalEntryDTOS = []
		if(creditNote.ledgerId) {
			HeaderLedger headerLedger = ledgerServices.findOne(creditNote.ledgerId)
			headerLedger.ledger.each {
				it ->
					journalEntryDTOS.push(
							new ArCreditNoteJournalEntryDTO(
									headerLedger.transactionDate.atZone(ZoneId.systemDefault()).format(formatter),
									creditNote.creditNoteNo,
									it.journalAccount.code,
									it.journalAccount.accountName,
									it.debit,
									it.credit
							)
					)
			}
		}

		List<ArCreditNoteItemsDTO> dtoList = []
		List<ArCreditNoteItems> items = arCreditNoteItemServices.findCreditNoteItemsByCNId(id)
		items.each {
			cn ->
				dtoList.push(
						new ArCreditNoteItemsDTO(
								cn?.invoiceParticulars?.itemName?:'',
								cn?.invoiceParticulars?.description?:'',
								cn.quantity,
								cn.unitPrice,
								cn.totalAmountDue
						)
				)
		}


		if (dtoList) {
			parameters.put('credit_note_items', new JRBeanCollectionDataSource(dtoList))
		}
		def a = journalEntryDTOS.sort{dtoSort -> dtoSort.debit}.reverse(true)
		parameters.put('journal_entry', new JRBeanCollectionDataSource(a))

		def dto = new ARCreditNoteFieldsDto(
				customer_account_number:"Customer Account Number: ${creditNote?.arCustomer?.accountNo?:''}",
				customer_name:"Customer Account Name: ${creditNote.arCustomer.customerName}",
				customer_address:"Customer Address: ${creditNote.arCustomer.address}",
				cn_date: "Credit Note Date: ${invoiceDateFormat.format(creditNote.creditNoteDate)}",
				cn_number:"Credit Note Number: ${creditNote.creditNoteNo}",
				prepared_by:"${StringUtils.upperCase(maker.fullName)}",
				noted_by:"",
				audited_by: ""
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
		params.add("Content-Disposition", "inline;filename=credit-note-" + creditNote.creditNoteNo + ".pdf")
		return new ResponseEntity(data, params, HttpStatus.OK)

	}


//	@RequestMapping(value = "/ar-soa", produces = ["application/pdf"])
//	ResponseEntity<byte[]> arSoa(
//			@RequestParam UUID id
//	) {
//		ArStatementOfAccount statementOfAccount = statementOfAccountServices.findOne(id)
//
//		def res = applicationContext.getResource("classpath:/reports/ar/arsoa.jasper")
//		def os = new ByteArrayOutputStream()
//		def parameters = [:] as Map<String, Object>
//
//		def logo = applicationContext?.getResource("classpath:/reports/logo.png")
//		def maker = employeeRepository.findByUsername(statementOfAccount.createdBy).first()
//
//		SimpleDateFormat soaDateFormat = new SimpleDateFormat("MM/dd/yyyy")
//		SimpleDateFormat dueDateFormat = new SimpleDateFormat("dd MMM yyyy")
//
//
//		if (logo.exists()) {
//			parameters.put("logo", logo.inputStream)
//		}
//
//		List<ARInvoiceBankDto> bankList = []
//		bankList.push(new ARInvoiceBankDto(
//				"Landbank of the Philippines (LBP)",
//				"Tagbilaran Branch",
//				"06-1212-0293"
//		))
//		bankList.push(new ARInvoiceBankDto(
//				"Bank of the Philippine Islands (BPI)",
//				"Tagbilaran Main",
//				"001203-3180-45"
//		))
//		bankList.push(new ARInvoiceBankDto(
//				"BDO",
//				"Tagbilaran Branch",
//				"002958014077"
//		))
//
//		List<ArStatementOfAccountItems> soaList = statementOfAccountItemsServices.getArSoaItemsBySoaId(id)
//
//		DateTimeFormatter dtf = DateTimeFormatter.ofPattern("MM/dd/yyyy")
//		LocalDateTime now = LocalDateTime.now()
//
//		if (soaList) {
//			parameters.put('soa_items', new JRBeanCollectionDataSource(soaList))
//		}
//
//		parameters.put('bank_accounts', new JRBeanCollectionDataSource(bankList))
//		parameters.put('beginning_balance', statementOfAccount.openBalance)
//		parameters.put('unpaid_balance', statementOfAccount.totalBalance)
//
//		def dto = new ARSoaFieldsDto(
//				customer_account_number:"Customer Account Number: ${statementOfAccount.customerNo?:''}",
//				customer_name:"Customer Account Name: ${statementOfAccount.customerName}",
//				customer_address:"Billing Address: ${statementOfAccount.address}",
//				statement_date: "Statement Date: ${dueDateFormat.format(statementOfAccount.soaDate)}",
//				statement_intro: "Please find below the account activity for the period ${statementOfAccount.startDate} to ${statementOfAccount.endDate}.",
//				statement_number: "Statement Number: ${statementOfAccount.soaNo}",
//				prepared_by:"${StringUtils.upperCase(maker.fullName)} ${dtf.format(now)}",
//				noted_by:"MA. ELISA SALINGAY CASTRODES ${dtf.format(now)}",
//		)
//
//		def gson = new Gson()
//		def dataSourceByteArray = new ByteArrayInputStream(gson.toJson(dto).getBytes("UTF8"))
//		def dataSource = new JsonDataSource(dataSourceByteArray)
//
//
//		try {
//			def jrprint = JasperFillManager.fillReport(res.inputStream, parameters, dataSource)
//
//			def pdfExporter = new JRPdfExporter()
//
//			def outputStreamExporterOutput = new SimpleOutputStreamExporterOutput(os)
//
//			pdfExporter.setExporterInput(new SimpleExporterInput(jrprint))
//			pdfExporter.setExporterOutput(outputStreamExporterOutput)
//			def configuration = new SimplePdfExporterConfiguration()
//			pdfExporter.setConfiguration(configuration)
//			pdfExporter.exportReport()
//
//
//		} catch (JRException e) {
//			e.printStackTrace()
//		} catch (IOException e) {
//			e.printStackTrace()
//		}
//
//		def data = os.toByteArray()
//		def params = new LinkedMultiValueMap<String, String>()
//		params.add("Content-Disposition", "inline;filename=ar-soa-" + statementOfAccount.soaNo + ".pdf")
//		return new ResponseEntity(data, params, HttpStatus.OK)
//
//	}
}
