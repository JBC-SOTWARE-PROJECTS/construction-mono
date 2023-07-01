package com.backend.gbp.rest

import com.backend.gbp.domain.Office
import com.backend.gbp.graphqlservices.CompanySettingsService
import com.backend.gbp.graphqlservices.billing.BillingItemService
import com.backend.gbp.graphqlservices.billing.JobItemService
import com.backend.gbp.graphqlservices.billing.JobService
import com.backend.gbp.graphqlservices.cashier.PettyCashService
import com.google.gson.Gson
import com.backend.gbp.domain.User
import com.backend.gbp.domain.cashier.Payment
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.repository.OfficeRepository
import com.backend.gbp.repository.UserRepository
import com.backend.gbp.repository.billing.BillingItemRepository
import com.backend.gbp.repository.billing.BillingRepository
import com.backend.gbp.repository.cashier.PaymentDetailRepository
import com.backend.gbp.repository.cashier.PaymentItemRepository
import com.backend.gbp.repository.cashier.PaymentRepository
import com.backend.gbp.repository.cashier.ShiftRepository
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.rest.dto.*
import com.backend.gbp.security.SecurityUtils
import groovy.transform.TypeChecked
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
import org.apache.commons.io.IOUtils
import org.apache.commons.lang3.StringUtils
import org.apache.xmlbeans.impl.xb.xsdschema.AnyDocument
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.ApplicationContext
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.util.LinkedMultiValueMap
import org.springframework.web.bind.annotation.*
import org.apache.commons.text.WordUtils;

import java.text.DecimalFormat
import java.time.Duration
import java.time.ZoneId
import java.time.format.DateTimeFormatter

@TypeChecked
@RestController
@RequestMapping('/reports/billing/print')
class BillingReportResource {

	@Autowired
	ApplicationContext applicationContext

	@Autowired
	JobService jobService

	@Autowired
	JobItemService jobItemService

	@Autowired
	BillingRepository billingRepository

	@Autowired
	EmployeeRepository employeeRepository

	@Autowired
	BillingItemService billingItemService

	@Autowired
	OfficeRepository officeRepository

	@Autowired
	UserRepository userRepository

	@Autowired
	ShiftRepository shiftRepository

	@Autowired
	PaymentDetailRepository paymentDetailRepository

	@Autowired
	PaymentRepository paymentRepository

	@Autowired
	InventoryResource inventoryResource

	@Autowired
	PaymentItemRepository paymentItemRepository

	@Autowired
	CompanySettingsService companySettingsService

	@Autowired
	PettyCashService pettyCashService


	@RequestMapping(value = ["/billingdetails/{id}"], produces = ["application/pdf"])
	ResponseEntity<byte[]> billingdetails(
			@PathVariable('id') String id
	) {
		User user = userRepository.findOneByLogin(SecurityUtils.currentLogin())
		Employee employee = employeeRepository.findOneByUser(user)
		Office office = officeRepository.findById(employee.office.id).get()
		def com = companySettingsService.comById()

		//footers
		def balance = billingItemService.getBalance(UUID.fromString(id))
		def totals = billingItemService.getAmounts(UUID.fromString(id), ['ITEM', 'SERVICE', 'MISC'])
		def deduct = billingItemService.getAmountsDeduct(UUID.fromString(id), ['DEDUCTIONS'])
		def pay = billingItemService.getAmountsDeduct(UUID.fromString(id), ['PAYMENTS'])
		//end total

		def bill = billingRepository.findById(UUID.fromString(id)).get()

		def item = billingItemService.getBillingItemFilterActive(UUID.fromString(id), ['ITEM']).sort { it.recordNo }
		def service = billingItemService.getBillingItemFilterActive(UUID.fromString(id), ['SERVICE']).sort { it.recordNo }
		def misc = billingItemService.getBillingItemFilterActive(UUID.fromString(id), ['MISC']).sort { it.recordNo }
		def deductions = billingItemService.getBillingItemFilterActive(UUID.fromString(id), ['DEDUCTIONS']).sort { it.recordNo }
		def payments = billingItemService.getBillingItemFilterActive(UUID.fromString(id), ['PAYMENTS']).sort { it.recordNo }

		def res = applicationContext?.getResource("classpath:/reports/billing/billingdetials.jasper")
		def bytearray = new ByteArrayInputStream()
		def os = new ByteArrayOutputStream()
		def parameters = [:] as Map<String, Object>
		def logo = applicationContext?.getResource("classpath:/reports/logo.png")

		DateTimeFormatter dateFormat =
				DateTimeFormatter.ofPattern("MM/dd/yyyy").withZone(ZoneId.systemDefault())
		def yearFormat = DateTimeFormatter.ofPattern("yyyy")


		//header here
		parameters.put("soaref", "Billing Statement Ref. # : ${bill.dateTrans.atZone(ZoneId.systemDefault()).format(yearFormat)}-${bill.billNo}".toString())
		parameters.put("bill_no", bill?.billNo ?: "")
		parameters.put("job_no", bill?.project?.projectCode ?: "")
		parameters.put("date_transaction", bill.dateTrans.atZone(ZoneId.systemDefault()).format(dateFormat) ?: "")

		parameters.put("trans_type", bill?.project ? "PROJECT" : "OTC" )
		parameters.put("job_desc", bill?.project ? bill?.project?.description : "OTC Transaction" )
		parameters.put("customer", bill?.customer?.fullName ?: bill.otcName)
		parameters.put("address", bill?.customer?.address ?: "")
		parameters.put("prepared", employee.fullName ?: "")
		parameters.put("totals", totals ?: 0.00)
		parameters.put("deductions", deduct ?: 0.00)
		parameters.put("payments", pay ?: 0.00)
		parameters.put("balance", balance ?: 0.00)
		//
		String tel = office.telNo ?: "N/A";String phone = office.phoneNo ?: "N/A"
		String company = com.companyName ?: "";String addr = office.fullAddress ?: ""
		parameters.put("company_name",  company)
		parameters.put("com_address",  addr)
		parameters.put("phone_no", "Phone No: +63"+phone)
		parameters.put("tel_no", "Tel No: "+tel)
		parameters.put("email", office.emailAdd ?: "N/A")

		def currentSubtotal = BigDecimal.ZERO

		// Rooms and Lodging

		def records = [] as List<BillingPrintDto>

		item.each {
			currentSubtotal += ((it.debit ?: BigDecimal.ZERO) - (it.credit ?: BigDecimal.ZERO)) * it.qty

			def billItems = new BillingPrintDto([
					category   : "Items",
					date       : it.transDate.atZone(ZoneId.systemDefault()).format(dateFormat),
					reference  : "",
					docno      : it.recordNo ?: "",
					description: it.description,
					qty        : it.qty.toString(),
					price      : new DecimalFormat("#,##0.00").format(((it.debit ?: BigDecimal.ZERO) - (it.credit ?: BigDecimal.ZERO))),
					subtotal   : ((it.debit ?: BigDecimal.ZERO) - (it.credit ?: BigDecimal.ZERO)) * it.qty,
					runningbal : new DecimalFormat("#,##0.00").format(currentSubtotal)

			])

			records.add(billItems)

		}

		service.each {

			currentSubtotal += ((it.debit ?: BigDecimal.ZERO) - (it.credit ?: BigDecimal.ZERO)) * it.qty
			def billItems = new BillingPrintDto([
					category   : "Services",
					date       : it.transDate.atZone(ZoneId.systemDefault()).format(dateFormat),
					reference  : "",
					docno      : it.recordNo ?: "",
					description: it.description.length() >= 254 ? it.description.take(254) + "..." : it.description,
					qty        : it.qty.toString(),
					price      : new DecimalFormat("#,##0.00").format(((it.debit ?: BigDecimal.ZERO) - (it.credit ?: BigDecimal.ZERO))),
					subtotal   : ((it.debit ?: BigDecimal.ZERO) - (it.credit ?: BigDecimal.ZERO)) * it.qty,
					runningbal : new DecimalFormat("#,##0.00").format(currentSubtotal)

			])

			records.add(billItems)

		}
		//
		misc.each {

			currentSubtotal += ((it.debit ?: BigDecimal.ZERO) - (it.credit ?: BigDecimal.ZERO)) * it.qty
			def billItems = new BillingPrintDto([
					category   : "Misc. Services",
					date       : it.transDate.atZone(ZoneId.systemDefault()).format(dateFormat),
					reference  : "",
					docno      : it.recordNo ?: "",
					description: it.description.length() >= 254 ? it.description.take(254) + "..." : it.description,
					qty        : it.qty.toString(),
					price      : new DecimalFormat("#,##0.00").format(((it.debit ?: BigDecimal.ZERO) - (it.credit ?: BigDecimal.ZERO))),
					subtotal   : ((it.debit ?: BigDecimal.ZERO) - (it.credit ?: BigDecimal.ZERO)) * it.qty,
					runningbal : new DecimalFormat("#,##0.00").format(currentSubtotal)

			])

			records.add(billItems)

		}

		deductions.each {

			currentSubtotal += ((it.debit ?: BigDecimal.ZERO) - (it.credit ?: BigDecimal.ZERO)) * it.qty
			def billItems = new BillingPrintDto([
					category   : "Deductions",
					date       : it.transDate.atZone(ZoneId.systemDefault()).format(dateFormat),
					reference  : "",
					docno      : it.recordNo ?: "",
					description: it.description,
					qty        : it.qty.toString(),
					price      : new DecimalFormat("#,##0.00").format(((it.debit ?: BigDecimal.ZERO) - (it.credit ?: BigDecimal.ZERO))),
					subtotal   : ((it.debit ?: BigDecimal.ZERO) - (it.credit ?: BigDecimal.ZERO)) * it.qty,
					runningbal : new DecimalFormat("#,##0.00").format(currentSubtotal)

			])

			records.add(billItems)

		}

		payments.each {

			currentSubtotal += ((it.debit ?: BigDecimal.ZERO) - (it.credit ?: BigDecimal.ZERO)) * it.qty
			def billItems = new BillingPrintDto([
					category   : "Payments",
					date       : it.transDate.atZone(ZoneId.systemDefault()).format(dateFormat),
					reference  : "",
					docno      : it.recordNo ?: "",
					description: it.description,
					qty        : it.qty.toString(),
					price      : new DecimalFormat("#,##0.00").format(((it.debit ?: BigDecimal.ZERO) - (it.credit ?: BigDecimal.ZERO))),
					subtotal   : ((it.debit ?: BigDecimal.ZERO) - (it.credit ?: BigDecimal.ZERO)) * it.qty,
					runningbal : new DecimalFormat("#,##0.00").format(currentSubtotal)

			])

			records.add(billItems)

		}

		if (logo.exists()) {
			parameters.put("logo", logo?.inputStream)
		}


		//printing
		try {
			def jrprint = JasperFillManager.fillReport(res.inputStream, parameters, new JRBeanCollectionDataSource(records))

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
		params.add("Content-Disposition", "inline;filename=SOA-\"" + bill.billNo + "\".pdf")
		return new ResponseEntity(data, params, HttpStatus.OK)

	}


	@RequestMapping(value = ["/collections/{id}"], produces = ["application/pdf"])
	ResponseEntity<byte[]> collections(
			@PathVariable('id') String id
	) {

		def shift = shiftRepository.findById(UUID.fromString(id)).get()

		def res = applicationContext.getResource("classpath:/reports/billing/printdctr.jasper")
		def os = new ByteArrayOutputStream()
		def logo = applicationContext?.getResource("classpath:/reports/logo.png")

		if (!res.exists()) {
			return ResponseEntity.notFound().build()
		}
		def parameters = [:] as Map<String, Object>


		if (logo.exists()) {
			parameters.put("logo", logo?.inputStream)
		}

		List<CashDto> cash = []

		cash.add(new CashDto("1000", 0, BigDecimal.ZERO))
		cash.add(new CashDto("500", 0, BigDecimal.ZERO))
		cash.add(new CashDto("100", 0, BigDecimal.ZERO))
		cash.add(new CashDto("50", 0, BigDecimal.ZERO))
		cash.add(new CashDto("20", 0, BigDecimal.ZERO))
		cash.add(new CashDto("10", 0, BigDecimal.ZERO))
		cash.add(new CashDto("5", 0, BigDecimal.ZERO))
		cash.add(new CashDto("1", 0, BigDecimal.ZERO))
		cash.add(new CashDto(".25", 0, BigDecimal.ZERO))
		cash.add(new CashDto(".1", 0, BigDecimal.ZERO))
		cash.add(new CashDto(".05", 0, BigDecimal.ZERO))

		def dataSourceTable = new JRBeanCollectionDataSource(cash)

		parameters.put("tablesource", dataSourceTable)

		// shift
		def formatter = DateTimeFormatter.ofPattern("MM/dd/yyyy hh:mm a")


		parameters.put("title", "Daily Collection Report")
		parameters.put("shiftno", shift.shiftNo ?: "")
		parameters.put("terminal", shift.terminal?.terminal_no ?: "")
		parameters.put("terminalremarks", shift.terminal?.description ?: "")
		parameters.put("shiftstart", shift.startShift ? formatter.format(shift.startShift.atZone(ZoneId.systemDefault())) : "")
		parameters.put("shiftend", shift.endShift ? formatter.format(shift.endShift.atZone(ZoneId.systemDefault())) : "")

		parameters.put("status", shift.active ? "OPEN" : "CLOSED")
		parameters.put("remarks", shift.remarks ?: "")



		// Fill Report Items

		List<DCTRItems> items = []

		def sortedActiveOr = paymentRepository.getPaymentByShiftActiveOR(UUID.fromString(id), ["OR","SI"])

		sortedActiveOr.each {
            Payment pt ->
				items << new DCTRItems(
						StringUtils.upperCase(pt.description),
						pt.totalPayments,
						pt.orNumber + " [${pt.createdBy}]",
						"",
						"",
						pt.receiptType,
						"Official Receipts",
						""

				)
		}

//		def sortedVoidedOr = shift.payments.findAll { PaymentTracker a -> BooleanUtils.isTrue(a.voided) }.toSorted {
//			PaymentTracker a, PaymentTracker b ->
//				a.ornumber <=> b.ornumber
//		}
		def sortedVoidedOr = paymentRepository.getPaymentByShiftVoidOR(UUID.fromString(id), ["OR","SI"])

		sortedVoidedOr.each {
            Payment pt ->
				items << new DCTRItems(
						StringUtils.upperCase(pt.description),
						pt.totalPayments,
						pt.orNumber + " [${pt.createdBy}]",
						"",
						"",
						pt.receiptType,
						"Voided Official Receipts",
						""

				)
		}

		// Details of Checks and Card

		def sortedActiveOrAr = paymentRepository.getPaymentByShiftActiveOR(UUID.fromString(id), ["OR","SI"])

		def totalchecks = 0.0
		def totalcards = 0.0
		def totalcash = 0.0
		def totalgcash = 0.0
		sortedActiveOrAr.each {
            Payment pt ->

				pt.paymentDetails.each {
					ptd ->

						switch (ptd.type) {

							case "CHECK":
								totalchecks += ptd.amount
								break

							case "CARD":
								totalcards += ptd.amount
								break

							case "CASH":
								totalcash += ptd.amount
								break

							case "GCASH":
								totalgcash += ptd.amount
								break

						}
						if (ptd.type == "CHECK") {
							items << new DCTRItems(
									StringUtils.upperCase(pt.description),
									ptd.amount,
									(ptd.reference ?: "-") + " [${pt.createdBy}]",
									"",
									"",
									ptd.type,
									"Checks and Card",
									""

							)
						}
						if (ptd.type == "GCASH") {
							items << new DCTRItems(
									StringUtils.upperCase(pt.description),
									ptd.amount,
									(ptd.reference ?: "-") + " [${pt.createdBy}]",
									"",
									"",
									ptd.type,
									"GCash Deposits",
									""

							)
						}
				}
		}

		//display cash transactions
		def totalcashin = 0.0
		def totalcashout = 0.0
		def cashTransactions = pettyCashService.pettyCashListPosted(UUID.fromString(id)).sort{it.cashType}
		cashTransactions.each {
			 pc ->

				switch (pc.cashType) {

					case "CASH_IN":
						totalcashin += pc.amount
						break

					case "CASH_OUT":
						totalcashout += pc.amount
						break

				}
				if (pc.cashType == "CASH_IN") {
					items << new DCTRItems(
							StringUtils.upperCase(pc.remarks),
							pc.amount,
							(pc.code ?: "-") + " [${pc.createdBy}]",
							"",
							"",
							"CASH IN",
							"Cash In Transactions",
							""

					)
				}
				if (pc.cashType == "CASH_OUT") {
					items << new DCTRItems(
							StringUtils.upperCase(pc.remarks),
							pc.amount,
							(pc.code ?: "-") + " [${pc.createdBy}]",
							"",
							"",
							pc.pettyType.description,
							"Cash Out Transactions",
							""

					)
				}
		}




		parameters.put("totalchecks", totalchecks)
		parameters.put("totalcards", totalcards)
		parameters.put("totalhardcash", totalcash)
		parameters.put("totalgcash", totalgcash)
		parameters.put("totalcashin", totalcashin)
		parameters.put("totalcashout", totalcashout)

		BigDecimal amountReceived = (totalchecks + totalcards + totalcash + totalgcash + totalcashin) - totalcashout
		parameters.put("totalamountreceived", amountReceived)

		def username = SecurityUtils.currentLogin()
		def user = userRepository.findOneByLogin(username)
		def emp = employeeRepository.findOneByUser(user)

		Office office = officeRepository.findById(emp.office.id).get()
		def com = companySettingsService.comById()

		String tel = office.telNo ?: "N/A";String phone = office.phoneNo ?: "N/A"
		String company = com.companyName ?: "";String addr = office.fullAddress?: ""
		parameters.put("company_name",  company)
		parameters.put("com_address",  addr)
		parameters.put("phone_no", "Phone No: +63"+phone)
		parameters.put("tel_no", "Tel No: "+tel)
		parameters.put("email", office.emailAdd ?: "N/A")

		parameters.put("preparedby", emp.fullName)

		try {
			def jrprint = JasperFillManager.fillReport(res.inputStream, parameters, new JRBeanCollectionDataSource(items))

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
		params.add("Content-Disposition", "inline;filename=DailyCollection-${shift.shiftNo}.pdf".toString())
		return new ResponseEntity(data, params, HttpStatus.OK)

	}


	@RequestMapping(value = ['/receipt/{id}'], produces = ['application/pdf'])
	ResponseEntity<byte[]> receipt(@PathVariable('id') String id) {
		//query
		def payment = paymentRepository.findById(UUID.fromString(id)).get()
		def outputTax = paymentItemRepository.getOutputTax(UUID.fromString(id), 'ITEM')
		def vatable = paymentItemRepository.getVatableNonVatable(UUID.fromString(id), 'ITEM')
		def exempt = paymentItemRepository.getVatableNonVatable(UUID.fromString(id), 'SERVICE')

		User user = userRepository.findOneByLogin(SecurityUtils.currentLogin())
		Employee employee = employeeRepository.findOneByUser(user)

		def res = applicationContext?.getResource("classpath:/reports/billing/receipt.jasper")
		def bytearray = new ByteArrayInputStream()
		def os = new ByteArrayOutputStream()
		def parameters = [:] as Map<String, Object>
		def logo = applicationContext?.getResource("classpath:/reports/logo.png")



		DateTimeFormatter dateFormat =
				DateTimeFormatter.ofPattern("MM/dd/yyyy").withZone(ZoneId.systemDefault())
		def dto = new ReceiptDto(
				date: dateFormat.format(payment.createdDate) ?: "",
				customer: payment?.billing?.customer?.fullName ?: payment?.billing?.otcName,
				tin: "",
				address: payment?.billing?.customer?.address ?: "" ,
				totalWords: "" ,
				totalAmount: payment.totalPayments ?: 0.00,
				vatable: vatable ?: 0.00,
				exempt: exempt ?: 0.00,
				totalDiscount: 0.00,
				outputTax: outputTax,
				cashier: employee.fullName,
				orNumber: payment.orNumber ?: "",
		)
		def gson = new Gson()
		def dataSourceByteArray = new ByteArrayInputStream(gson.toJson(dto).bytes)
		def dataSource = new JsonDataSource(dataSourceByteArray)


		if (logo.exists()) {
			parameters.put("logo", logo?.getURL())
		}


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
		//params.add("Content-Disposition", "inline;filename=Discharge-Instruction-of-\"" + caseDto?.patient?.fullName + "\".pdf")
		params.add("Content-Disposition", "inline;filename=receipt-\"" + payment?.orNumber + "\".pdf")
		return new ResponseEntity(data, params, HttpStatus.OK)
	}


	@RequestMapping(value = ['/sales_print/{start}/{end}'], produces = ['application/pdf'])
	ResponseEntity<byte[]> stockcard_report(
			@PathVariable('start') String start,
			@PathVariable('end') String end
	) {
		//query
		def itemList = inventoryResource.getSalesReport(start, end, '')

		User user = userRepository.findOneByLogin(SecurityUtils.currentLogin())
		Employee employee = employeeRepository.findOneByUser(user)
		Office office = officeRepository.findById(employee.office.id).get()
		def com = companySettingsService.comById()

		def res = applicationContext?.getResource("classpath:/reports/billing/sales_report.jasper")
		def bytearray = new ByteArrayInputStream()
		def os = new ByteArrayOutputStream()
		def parameters = [:] as Map<String, Object>
		def logo = applicationContext?.getResource("classpath:/reports/logo.png")
		def itemsDto = itemList

		DateTimeFormatter dateFormat =
				DateTimeFormatter.ofPattern("MM/dd/yyyy").withZone(ZoneId.systemDefault())
		def dto = new HeaderDtoPrint(
				descLong: start+' - '+end,
		)
		def gson = new Gson()
		def dataSourceByteArray = new ByteArrayInputStream(gson.toJson(dto).bytes)
		def dataSource = new JsonDataSource(dataSourceByteArray)

		String tel = office.telNo ?: "N/A";String phone = office.phoneNo ?: "N/A"
		String company = com.companyName ?: "";String addr = office.fullAddress ?: ""
		parameters.put("company_name",  company)
		parameters.put("com_address",  addr)
		parameters.put("phone_no", "Phone No: +63"+phone)
		parameters.put("tel_no", "Tel No: "+tel)
		parameters.put("email", office.emailAdd ?: "N/A")


		if (logo.exists()) {
			parameters.put("logo", logo?.getURL())
		}

		if (itemsDto) {
			parameters.put('items', new JRBeanCollectionDataSource(itemsDto))
		}

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
		//params.add("Content-Disposition", "inline;filename=Discharge-Instruction-of-\"" + caseDto?.patient?.fullName + "\".pdf")
		params.add("Content-Disposition", "inline;filename=Sales-Report-of-\"" + start +"-"+ end + "\".pdf")
		return new ResponseEntity(data, params, HttpStatus.OK)
	}

	@RequestMapping(method = RequestMethod.GET, value = ["/sales_download"])
	ResponseEntity<AnyDocument.Any> downloadSalesReport(
			@RequestParam String start,
			@RequestParam String end
	) {

		def itemList = inventoryResource.getSalesReport(start, end, '')
		StringBuffer buffer = new StringBuffer()

		DateTimeFormatter formatter =
				DateTimeFormatter.ofPattern("MM/dd/yyyy").withZone(ZoneId.systemDefault())
		CSVPrinter csvPrinter = new CSVPrinter(buffer, CSVFormat.POSTGRESQL_CSV
				.withHeader("TYPE", "DATE", "OR/SI", "REF NO", "CATEGORY", "DESCRIPTION", "GROSS", "DISCOUNT", "DISCOUNT AMOUNT", "NETSALES"))

		try {
			itemList.each {
				item ->
					csvPrinter.printRecord(
							item.trans_type,
							formatter.format(item.trans_date),
							item.ornumber,
							item.bill,
							item.category,
							item.description,
							item.gross,
							item.deductions,
							item.disc_amount,
							item.netsales
					)
			}

			LinkedMultiValueMap<String, String> extHeaders = new LinkedMultiValueMap<>()
			extHeaders.add("Content-Disposition", "inline;filename=Charge-Item-Report.csv")

			return new ResponseEntity(String.valueOf(buffer).getBytes(), extHeaders, HttpStatus.OK)
		}
		catch (e) {
			throw e
		}

	}

	//job order
	@RequestMapping(value = ['/job-order/{id}'], produces = ['application/pdf'])
	ResponseEntity<byte[]> job_estimate(@PathVariable('id') String jobId) {
		//query
		def job = jobService.jobById(UUID.fromString(jobId))
		def jobItems = jobItemService.jobItemByServiceCategory(UUID.fromString(jobId))
		def items = jobItemService.jobItemByItems(UUID.fromString(jobId))

		User user = userRepository.findOneByLogin(SecurityUtils.currentLogin())
		Employee employee = employeeRepository.findOneByUser(user)
		Office office = officeRepository.findById(employee.office.id).get()
		def com = companySettingsService.comById()

		def res = applicationContext?.getResource("classpath:/reports/billing/joborder.jasper")
		def bytearray = new ByteArrayInputStream()
		def os = new ByteArrayOutputStream()
		def parameters = [:] as Map<String, Object>
		def logo = applicationContext?.getResource("classpath:/reports/logo.png")
		def itemsDto = new ArrayList<JobItemsReportDto>()

		DateTimeFormatter dateFormat =
				DateTimeFormatter.ofPattern("MM/dd/yyyy").withZone(ZoneId.systemDefault())

		def totalService = BigDecimal.ZERO
		def totalItems = BigDecimal.ZERO
		def records = [] as List<JobItemsReportDto>

		if (jobItems) {
			jobItems.each {
				it ->
					totalService += it.subTotal
					def serviceItems = new JobItemsReportDto([
							category    : it.serviceCategory?.description,
							description : it.descriptions,
							cost        : new DecimalFormat("#,##0.00").format(it.subTotal)
					])
					records.add(serviceItems)
			}
		}
		if (items) {
			items.each {
				it ->
					totalItems += it.subTotal
					def listItems = new JobItemsReportDto([
							category    : "ITEMS/PARTS",
							description : it.qty > 1 ? it.qty + "PCS ${it.descriptions}"  : it.descriptions,
							cost        : new DecimalFormat("#,##0.00").format(it.subTotal)
					])
					records.add(listItems)
			}

		}
		def lastService = jobItems.last()
		def totalLabor = new JobItemsReportDto([
				category    : items ? "ITEMS/PARTS" : lastService?.serviceCategory?.description,
				description : "Total Labor",
				cost        : new DecimalFormat("#,##0.00").format(totalService)
		])
		records.add(totalLabor)
		def totalParts = new JobItemsReportDto([
				category    : items ? "ITEMS/PARTS" : lastService?.serviceCategory?.description,
				description : "Total Parts",
				cost        : new DecimalFormat("#,##0.00").format(totalItems)
		])
		records.add(totalParts)
		def total = new JobItemsReportDto([
				category    : items ? "ITEMS/PARTS" : lastService?.serviceCategory?.description,
				description : "Total",
				cost        : new DecimalFormat("#,##0.00").format(job.totalCost)
		])
		records.add(total)

		String tel = office.telNo ?: "N/A";String phone = office.phoneNo ?: "N/A"
		String company = com.companyName ?: "";String addr = office.fullAddress ?: ""
		parameters.put("company_name",  company)
		parameters.put("com_address",  addr)
		parameters.put("phone_no", "Phone No: +63"+phone)
		parameters.put("tel_no", "Tel No: "+tel)
		parameters.put("email", office.emailAdd ?: "N/A")


		parameters.put("customer", job.customer?.fullName ?: "N/A")
		parameters.put("address", job.customer?.address ?: "N/A")
		parameters.put("cust_email", job.customer?.emailAdd ?: "N/A")
		parameters.put("cust_phone_no", job.customer?.telNo ? job.customer?.telNo : "N/A")
		parameters.put("plate_no", job.plateNo ?: "N/A")
		parameters.put("date_trans", dateFormat.format(job.dateTrans) ?: "")
		parameters.put("repair_type", job.repair?.description ?: "")
		parameters.put("insurance", job.insurance?.description ?: "N/A")
		parameters.put("engine_no", job.engineNo ?: "N/A")
		parameters.put("chassis_no", job.chassisNo ?: "N/A")
		parameters.put("body_color", job.bodyColor ?: "N/A")
		parameters.put("year_model", job.yearModel ?: "N/A")
		parameters.put("series", job.series ?: "")
		parameters.put("make", job.make ?: "")
		parameters.put("due_date", dateFormat.format(job.deadline) ?: "")
		parameters.put("user", employee.fullName ?: "")

		parameters.put("ref_no", job.jobNo)
		parameters.put("job_desc", job.description)

		if (logo.exists()) {
			parameters.put("logo", logo?.inputStream)
		}

		if (itemsDto) {
			parameters.put('items', new JRBeanCollectionDataSource(itemsDto))
		}

		//printing
		try {
			def jrprint = JasperFillManager.fillReport(res.inputStream, parameters, new JRBeanCollectionDataSource(records))

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
		params.add("Content-Disposition", "inline;filename=Job-Order-\"" + job.jobNo + "\".pdf")
		return new ResponseEntity(data, params, HttpStatus.OK)
	}

	//endorsement
	@RequestMapping(value = ['/endorsement/{id}'], produces = ['application/pdf'])
	ResponseEntity<byte[]> endorsement_form(@PathVariable('id') String jobId) {
		//query
		def job = jobService.jobById(UUID.fromString(jobId))

		User user = userRepository.findOneByLogin(SecurityUtils.currentLogin())
		Employee employee = employeeRepository.findOneByUser(user)
		Office office = officeRepository.findById(employee.office.id).get()
		def com = companySettingsService.comById()

		def res = applicationContext?.getResource("classpath:/reports/billing/endrosement.jasper")
		def bytearray = new ByteArrayInputStream()
		def os = new ByteArrayOutputStream()
		def parameters = [:] as Map<String, Object>
		def logo = applicationContext?.getResource("classpath:/reports/logo.png")
		def car = applicationContext?.getResource("classpath:/reports/car-overview.jpg")
		def e = job.endorsement

		def dto = new EndorsementDto(
				complains: job.customerComplain ?: "",
				history: job.repairHistory ?: "",
				others: job.otherFindings ?: "",
				fieldFindings: e.fieldFindings,
				shopFindings: e.shopFindings,
				fuelGauge: e.fuelGauge,
				aircon: e.aircon,
				lighter: e.lighter,
				lighterPcs: e.lighterPcs,
				headrest: e.headrest,
				headrestPcs: e.headrestPcs,
				horn: e.horn,
				wiperRH: e.wiperRH,
				wiperLH: e.wiperLH,
				windShieldFront: e.windShieldFront,
				windShieldRear: e.windShieldRear,
				runningBoardRH: e.runningBoardRH,
				runningBoardLH: e.runningBoardLH,
				spareTire: e.spareTire,
				hoodStand: e.hoodStand,
				oilCap: e.oilCap,
				engineOilFilter: e.engineOilFilter,
				headlightLH: e.headlightLH,
				headlightRH: e.headlightRH,
				carkey: e.carkey,
				carStereo: e.carStereo,
				sunVisor: e.sunVisor,
				sunVisorPcs: e.sunVisorPcs,
				domeLight: e.domeLight,
				sideMirrorRH: e.sideMirrorRH,
				sideMirrorLH: e.sideMirrorLH,
				logoFront: e.logoFront,
				logoRear: e.logoRear,
				windowsRH: e.windowsRH,
				windowsLH: e.windowsLH,
				antenna: e.antenna,
				jack: e.jack,
				radiator: e.radiator,
				dipStick: e.dipStick,
				speaker: e.speaker,
				speakerPcs: e.speakerPcs,
				rearViewMirror: e.rearViewMirror,
				registrationPapers: e.registrationPapers,
				hubCupRHft: e.hubCupRHft,
				hubCupRHRr: e.hubCupRHRr,
				hubCupLHft: e.hubCupLHft,
				hubCupLHRr: e.hubCupLHRr,
				plateNumberFront: e.plateNumberFront,
				plateNumberRear: e.plateNumberRear,
				bumperFront: e.bumperFront,
				bumperRear: e.bumperRear,
				mudGuardRHft: e.mudGuardRHft,
				mudGuardRHRr: e.mudGuardRHRr,
				mudGuardLHft: e.mudGuardLHft,
				mudGuardLHRr: e.mudGuardLHRr,
				tieWrench: e.tieWrench,
				washerTank: e.washerTank,
				clutchCap: e.clutchCap,
				breakMaster: e.breakMaster,
				tailLightRH: e.tailLightRH,
				tailLightLH: e.tailLightLH,

		)
		def gson = new Gson()
		def dataSourceByteArray = new ByteArrayInputStream(gson.toJson(dto).bytes)
		def dataSource = new JsonDataSource(dataSourceByteArray)

		DateTimeFormatter dateFormat =
				DateTimeFormatter.ofPattern("MM/dd/yyyy").withZone(ZoneId.systemDefault())

		DateTimeFormatter timeFormatter =
				DateTimeFormatter.ofPattern("h:mm a").withZone(ZoneId.systemDefault())



		String tel = office.telNo ?: "N/A";String phone = office.phoneNo ?: "N/A"
		String company = com.companyName ?: "";String addr = office.fullAddress ?: ""
		parameters.put("company_name",  company)
		parameters.put("com_address",  addr)
		parameters.put("phone_no", "Phone No: +63"+phone)
		parameters.put("tel_no", "Tel No: "+tel)
		parameters.put("email", office.emailAdd ?: "N/A")


		parameters.put("customer", job.customer?.fullName ?: "N/A")
		parameters.put("address", job.customer?.address ?: "N/A")
		parameters.put("cust_phone_no", job.customer?.telNo ? job.customer?.telNo : "N/A")
		parameters.put("make", job.make ?: "")
		parameters.put("date_trans", dateFormat.format(job.dateTrans) ?: "")
		parameters.put("trans_time", timeFormatter.format(job.dateTrans) ?: "")
		parameters.put("due_date", dateFormat.format(job.deadline) ?: "")
		parameters.put("chassis_no", job.chassisNo ?: "N/A")
		parameters.put("engine_no", job.engineNo ?: "N/A")
		parameters.put("plate_no", job.plateNo ?: "N/A")
		parameters.put("odo_meter", job.odometerReading ?: "N/A")
		parameters.put("user", employee.fullName ?: "")
		parameters.put("date_released", job.dateReleased ? dateFormat.format(job.dateReleased) : "")
		parameters.put("released_time", job.dateReleased ? timeFormatter.format(job.dateReleased) : "")

		if (logo.exists()) {
			parameters.put("logo", logo?.inputStream)
		}

		if (car.exists()) {
			parameters.put("car", car?.inputStream)
		}

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

		} catch (JRException jre) {
			jre.printStackTrace()
		} catch (IOException ioe) {
			ioe.printStackTrace()
		}

		if (bytearray != null)
			IOUtils.closeQuietly(bytearray)
		//end

		def data = os.toByteArray()
		def params = new LinkedMultiValueMap<String, String>()
		params.add("Content-Disposition", "inline;filename=Job-Order-\"" + job.jobNo + "\".pdf")
		return new ResponseEntity(data, params, HttpStatus.OK)
	}

	//billing cash flow
	@RequestMapping(value = ['/cashflow/{start}/{end}'], produces = ['application/pdf'])
	ResponseEntity<byte[]> cashflow(
			@PathVariable('start') String start,
			@PathVariable('end') String end
	) {
		//query
		def itemList = pettyCashService.cashFlowReport(start, end, '')

		User user = userRepository.findOneByLogin(SecurityUtils.currentLogin())
		Employee employee = employeeRepository.findOneByUser(user)
		Office office = officeRepository.findById(employee.office.id).get()
		def com = companySettingsService.comById()

		def res = applicationContext?.getResource("classpath:/reports/billing/cash_flow.jasper")
		def bytearray = new ByteArrayInputStream()
		def os = new ByteArrayOutputStream()
		def parameters = [:] as Map<String, Object>
		def logo = applicationContext?.getResource("classpath:/reports/logo.png")
		def itemsDto = new ArrayList<CashFlowPrintDto>()

		def dto = new HeaderDtoPrint(
				descLong: start+' - '+end,
		)
		def gson = new Gson()
		def dataSourceByteArray = new ByteArrayInputStream(gson.toJson(dto).bytes)
		def dataSource = new JsonDataSource(dataSourceByteArray)

		DateTimeFormatter dateFormat =
				DateTimeFormatter.ofPattern("MM/dd/yyyy").withZone(ZoneId.systemDefault())

		if (itemList) {
			itemList.each {
				it ->
					def itemDto = new CashFlowPrintDto(
							id: it.id,
							date: dateFormat.format(it.date),
							refNo: it.refNo,
							type: it.type,
							description: it.description,
							amount: it.amount,
							remarks: it.remarks
					)
					itemsDto.add(itemDto)
			}
		}

		String tel = office.telNo ?: "N/A";String phone = office.phoneNo ?: "N/A"
		String company = com.companyName ?: "";String addr = office.fullAddress ?: ""
		parameters.put("company_name",  company)
		parameters.put("com_address",  addr)
		parameters.put("phone_no", "Phone No: +63"+phone)
		parameters.put("tel_no", "Tel No: "+tel)
		parameters.put("email", office.emailAdd ?: "N/A")

		parameters.put("revenue", billingItemService.totalRevenue(start, end) ?: BigDecimal.ZERO)
		parameters.put("cash_in", pettyCashService.totalCashIn(start, end) ?: BigDecimal.ZERO)
		parameters.put("expense", pettyCashService.totalExpense(start, end) ?: BigDecimal.ZERO)
		parameters.put("cash_balance", pettyCashService.totalCashBalance(start, end) ?: BigDecimal.ZERO)
		parameters.put("prepared", employee.fullName ?: "")


		if (logo.exists()) {
			parameters.put("logo", logo?.getURL())
		}

		if (itemsDto) {
			parameters.put('items', new JRBeanCollectionDataSource(itemsDto))
		}

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
		params.add("Content-Disposition", "inline;filename=CashFlow-Report-of-\"" + start +"-"+ end + "\".pdf")
		return new ResponseEntity(data, params, HttpStatus.OK)
	}

	@RequestMapping(value = ['/pettycash/{id}'], produces = ['application/pdf'])
	ResponseEntity<byte[]> pettycash(
			@PathVariable('id') UUID id
	) {
		//query
		def itemList = pettyCashService.pettyCashById(id)

		User user = userRepository.findOneByLogin(SecurityUtils.currentLogin())
		Employee employee = employeeRepository.findOneByUser(user)

		def res = applicationContext?.getResource("classpath:/reports/billing/petty_cash.jasper")
		def bytearray = new ByteArrayInputStream()
		def os = new ByteArrayOutputStream()
		def parameters = [:] as Map<String, Object>
		def itemsDto = new ArrayList<PettyCashDto>()

		def dto = new HeaderDtoPrint(
				descLong: "",
		)
		def gson = new Gson()
		def dataSourceByteArray = new ByteArrayInputStream(gson.toJson(dto).bytes)
		def dataSource = new JsonDataSource(dataSourceByteArray)

		DateTimeFormatter dateFormat =
				DateTimeFormatter.ofPattern("MM/dd/yyyy").withZone(ZoneId.systemDefault())

		if (itemList) {
			def itemDto = new PettyCashDto(
					description: itemList.remarks,
					amount: itemList.amount
			)
			itemsDto.add(itemDto)
		}

		if (itemsDto) {
			parameters.put('items', new JRBeanCollectionDataSource(itemsDto))
		}

		parameters.put('code', itemList.code)
		if(itemList?.project){
			String proj = "[${itemList?.project?.projectCode}] " + itemList?.project?.description
			parameters.put('project', proj)
		}else{
			parameters.put('project', "")
		}

		parameters.put('date', dateFormat.format(itemList.dateTrans))
		parameters.put('prepared', employee.fullName)
		parameters.put('received', itemList.receivedBy?.fullName)
		parameters.put('remarks', itemList.notes)


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
		params.add("Content-Disposition", "inline;filename=Petty-Cash-of-\"" + itemList.code + "\".pdf")
		return new ResponseEntity(data, params, HttpStatus.OK)
	}

	@RequestMapping(method = RequestMethod.GET, value = ["/cashflow_download"])
	ResponseEntity<AnyDocument.Any> downloadCashFlowReport(
			@RequestParam String start,
			@RequestParam String end
	) {

		def itemList = pettyCashService.cashFlowReport(start, end, '')
		StringBuffer buffer = new StringBuffer()

		DateTimeFormatter formatter =
				DateTimeFormatter.ofPattern("MM/dd/yyyy").withZone(ZoneId.systemDefault())
		CSVPrinter csvPrinter = new CSVPrinter(buffer, CSVFormat.POSTGRESQL_CSV
				.withHeader("REFERENCE NO", "TYPE", "DATE", "DESCRIPTION", "AMOUNT", "REMARKS"))

		try {
			itemList.each {
				item ->
					csvPrinter.printRecord(
							item.refNo,
							item.type,
							formatter.format(item.date),
							item.description,
							item.amount,
							item.remarks
					)
			}

			LinkedMultiValueMap<String, String> extHeaders = new LinkedMultiValueMap<>()
			extHeaders.add("Content-Disposition", "inline;filename=Charge-Item-Report.csv")

			return new ResponseEntity(String.valueOf(buffer).getBytes(), extHeaders, HttpStatus.OK)
		}
		catch (e) {
			throw e
		}

	}

	@RequestMapping(method = RequestMethod.GET, value = ["/cashTransaction"])
	ResponseEntity<AnyDocument.Any> downloadCashTransaction(
			@RequestParam(required = false) String shift,
			@RequestParam(required = false) String type,
			@RequestParam(required = false) String project
	) {
		UUID shiftId = shift ? UUID.fromString(shift) : null
		UUID projectId = project ? UUID.fromString(project) : null

		def itemList = pettyCashService.pettyCashList('', shiftId, type, projectId)
		StringBuffer buffer = new StringBuffer()

		DateTimeFormatter formatter =
				DateTimeFormatter.ofPattern("MM/dd/yyyy").withZone(ZoneId.systemDefault())
		CSVPrinter csvPrinter = new CSVPrinter(buffer, CSVFormat.POSTGRESQL_CSV
				.withHeader("REFERENCE NO", "DATE", "SHIFT", "CASH TYPE", "DESCRIPTION", "EXPENSE TYPE", "AMOUNT", "PROJECT", "REMARKS"))

		try {
			if(itemList){
				itemList.each {
					item ->
						csvPrinter.printRecord(
								item.code,
								formatter.format(item.dateTrans),
								item.shift?.id || "",
								item.cashType,
								item.remarks,
								item.pettyType?.description || "",
								item.amount,
								item.project?.description || "",
								item.notes
						)
				}
			}


			LinkedMultiValueMap<String, String> extHeaders = new LinkedMultiValueMap<>()
			extHeaders.add("Content-Disposition", "inline;filename=Charge-Item-Report.csv")

			return new ResponseEntity(String.valueOf(buffer).getBytes(), extHeaders, HttpStatus.OK)
		}
		catch (e) {
			throw e
		}

	}


}
