package com.backend.gbp.rest

import com.backend.gbp.domain.Office
import com.backend.gbp.graphqlservices.CompanySettingsService
import com.backend.gbp.graphqlservices.inventory.InventoryService
import com.backend.gbp.graphqlservices.inventory.ItemService
import com.backend.gbp.graphqlservices.inventory.PurchaseOrderItemService
import com.backend.gbp.graphqlservices.inventory.PurchaseOrderService
import com.backend.gbp.graphqlservices.inventory.PurchaseRequestItemService
import com.backend.gbp.graphqlservices.inventory.PurchaseRequestService
import com.backend.gbp.graphqlservices.inventory.ReceivingReportItemService
import com.backend.gbp.graphqlservices.inventory.ReceivingReportService
import com.backend.gbp.graphqlservices.inventory.ReturnSupplierItemsService
import com.backend.gbp.graphqlservices.inventory.ReturnSupplierService
import com.backend.gbp.graphqlservices.inventory.StockIssuanceService
import com.backend.gbp.graphqlservices.inventory.StockIssueItemsService
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.google.gson.Gson
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.inventory.*
import com.backend.gbp.graphqlservices.inventory.InventoryLedgerService
import com.backend.gbp.graphqlservices.inventory.SignatureService
import com.backend.gbp.repository.OfficeRepository
import com.backend.gbp.repository.inventory.*
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
import org.apache.commons.io.IOUtils
import org.apache.commons.text.WordUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.context.ApplicationContext
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.util.LinkedMultiValueMap
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

import java.time.Duration
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter

@TypeChecked
@RestController
@RequestMapping('/reports/inventory/print')
class InventoryReportResource {

    @Autowired
    ApplicationContext applicationContext

    @Autowired
	PurchaseOrderService purchaseOrderService

	@Autowired
	PurchaseOrderItemService purchaseOrderItemService

	@Autowired
	PurchaseRequestService purchaseRequestService

	@Autowired
	PurchaseRequestItemService purchaseRequestItemService

	@Autowired
	ReceivingReportService receivingReportService

	@Autowired
	ReceivingReportItemService receivingReportItemService

	@Autowired
	EmployeeRepository employeeRepository

	@Autowired
	InventoryLedgerService inventoryLedgerService

	@Autowired
	InventoryService inventoryService

	@Autowired
	ItemService itemService

	@Autowired
	InventoryResource inventoryResource

	@Autowired
	OfficeRepository officeRepository

	@Autowired
	CompanySettingsService companySettingsService

    @Autowired
    SignatureService signatureService

    @Autowired
    SignatureRepository signatureRepository

	@Autowired
	ReturnSupplierService returnSupplierService

	@Autowired
	ReturnSupplierItemsService returnSupplierItemsService

	@Autowired
	StockIssuanceService stockIssuanceService

	@Autowired
	StockIssueItemsService stockIssueItemsService

    @RequestMapping(value = ['/po_report/{id}'], produces = ['application/pdf'])
    ResponseEntity<byte[]> poReport(@PathVariable('id') UUID id) {

        PurchaseOrder purchaseOrder = purchaseOrderService.poById(id)
        List<PurchaseOrderItems> purchaseOrderItems = purchaseOrderItemService.poItemByParent(id).sort {
            it.item.descLong
        }
        Employee emp = employeeRepository.findByUsername(purchaseOrder?.createdBy).first()
        Employee currentEmp = employeeRepository.findByUsername(SecurityUtils.currentLogin()).first()

		Office office = officeRepository.findById(currentEmp.office.id).get()
		def com = companySettingsService.comById()

        def res = applicationContext?.getResource("classpath:/reports/inventory/po_report.jasper")
        def bytearray = new ByteArrayInputStream()
        def os = new ByteArrayOutputStream()
        def parameters = [:] as Map<String, Object>
        def logo = applicationContext?.getResource("classpath:/reports/${com.logoFileName}")
        def itemsDto = new ArrayList<POItemReportDto>()

        DateTimeFormatter dateFormat =
                DateTimeFormatter.ofPattern("MM/dd/yyyy").withZone(ZoneId.systemDefault())

		String desc = purchaseOrder.category.equalsIgnoreCase("PROJECTS") ? purchaseOrder?.project?.description ?: "" : purchaseOrder?.assets?.description ?: ""
		String title = purchaseOrder.category.equalsIgnoreCase("PROJECTS") ? "Project: " : "Asset Equipment: "
		if(purchaseOrder.category.equalsIgnoreCase("PERSONAL")){
			desc = ""
			title = ""
		}

        def dto = new POReportDto(
                date: dateFormat.format(purchaseOrder?.preparedDate),
                poNum: purchaseOrder?.poNumber,
                prNum: purchaseOrder?.prNos,
                supplier: purchaseOrder?.supplier?.supplierFullname,
				office: purchaseOrder?.office?.officeDescription,
                terms: purchaseOrder?.paymentTerms?.paymentDesc,
				project: desc,
				projTitle: title,
				location: purchaseOrder?.project?.location?.fullAddress ?: "",
                fullname: emp?.fullName

        )
        def gson = new Gson()
        def dataSourceByteArray = new ByteArrayInputStream(gson.toJson(dto).getBytes("UTF8"))
        def dataSource = new JsonDataSource(dataSourceByteArray)

        if (purchaseOrderItems) {
            def counter = 1
            purchaseOrderItems.each {
                it ->

                    def discount = 0.00
                    def deals = ''
                    def total = 0.00
                    if (it.type) {
                        if (it.type.equalsIgnoreCase('discountRate')) {
                            def discount_rate = (it.type_text as BigDecimal) / 100
                            discount = (it.unitCost * it.quantity) * discount_rate

                            if (discount_rate > 0) {
                                deals = it.type_text + ' %'
                                total = (it.unitCost * it.quantity) - discount
                            } else {
                                deals = '-------'
                                total = it.unitCost * it.quantity
                            }
                        } else if (it.type.equalsIgnoreCase('discountAmount')) {
                            deals = '-------'
                            discount = it.type_text
                            total = (it.unitCost * it.quantity) - (it.type_text as BigDecimal)
                        } else if (it.type.equalsIgnoreCase('package')) {
                            deals = it.type_text
                            discount = 0.00
                            total = (it.unitCost * it.quantity)
                        } else {
                            deals = '-------'
                            discount = 0.00
                            total = (it.unitCost * it.quantity)
                        }
                    } else {
                        discount = 0.00
                        deals = '-------'
                        total = it.unitCost * it.quantity
                    }

                    def itemDto = new POItemReportDto(
                            description: it.item.descLong,
                            uom: it.item.unit_of_purchase.unitDescription + '(' + it.item.item_conversion + ')',
                            deals: deals,
                            discount: discount as BigDecimal,
                            no: counter,
                            request_qty: it.quantity,
                            unit_cost: it.unitCost,
                            total: total,

                    )
                    itemsDto.add(itemDto)
                    counter = counter + 1
            }
        }

        List<Signature> signList = signatureService.signatureList("PO").sort({ it.sequence })
        def signColumn1 = new ArrayList<SignatureReportDto>()
        def signColumn2 = new ArrayList<SignatureReportDto>()

        if (signList) {
            Integer count = 1
            signList.each {
                it ->
                    def signData

                    if (it.currentUsers) {
                        signData = new SignatureReportDto(
                                signatureHeader: it.signatureHeader,
                                signaturies: currentEmp.fullName,
                                position: it.signaturePosition,
                        )
                    } else {
                        signData = new SignatureReportDto(
                                signatureHeader: it.signatureHeader,
                                signaturies: (it.signaturePerson != null) ? it.signaturePerson : "",
                                position: it.signaturePosition,
                        )
                    }

                    if (count == 1) {
                        signColumn1.add(signData)
                    } else if (count == 2) {
                        signColumn2.add(signData)
                        count = 0
                    }

                    count++
            }
        }

        if (signColumn1) {
            parameters.put('sign_column1', new JRBeanCollectionDataSource(signColumn1))
        }
        if (signColumn2) {
            parameters.put('sign_column2', new JRBeanCollectionDataSource(signColumn2))
        }

        if (logo.exists()) {
            parameters.put("logo", logo?.getURL())
        }

        if (itemsDto) {
            parameters.put('items', new JRBeanCollectionDataSource(itemsDto))
        }

		String tel = office.telNo ?: "N/A";String phone = office.phoneNo ?: "N/A"
		String company = com.companyName ?: "";String addr = office.fullAddress ?: ""
		parameters.put("company_name", company)
		parameters.put("com_address", addr.trim())
		parameters.put("phone_no", "Phone No: "+phone)
		parameters.put("tel_no", "Tel No: "+tel)
		parameters.put("email", office.emailAdd ?: "N/A")

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
        params.add("Content-Disposition", "inline;filename=PO-Report-of-\"" + purchaseOrder?.poNumber + "\".pdf")
        return new ResponseEntity(data, params, HttpStatus.OK)
    }

    //pr print
    @RequestMapping(value = ['/pr_report/{id}'], produces = ['application/pdf'])
    ResponseEntity<byte[]> prReport(@PathVariable('id') UUID id) {
        PurchaseRequest purchaseRequest = purchaseRequestService.prById(id)
        List<PurchaseRequestItem> purchaseRequestItems = purchaseRequestItemService.prItemByParent(id).sort {
            it.item.descLong
        }
        Employee emp = employeeRepository.findByUsername(SecurityUtils.currentLogin()).first()
		Office office = officeRepository.findById(emp.office.id).get()
		def com = companySettingsService.comById()

        def res = applicationContext?.getResource("classpath:/reports/inventory/pr_report.jasper")
		def bytearray = new ByteArrayInputStream()
		def os = new ByteArrayOutputStream()
		def parameters = [:] as Map<String, Object>
		def logo = applicationContext?.getResource("classpath:/reports/${com.logoFileName}")
		def itemsDto = new ArrayList<PRItemReportDto>()


		DateTimeFormatter dateFormat =
				DateTimeFormatter.ofPattern("MM/dd/yyyy").withZone(ZoneId.systemDefault())

		String desc = purchaseRequest.category.equalsIgnoreCase("PROJECTS") ? purchaseRequest?.project?.description ?: "" : purchaseRequest?.assets?.description ?: ""
		String title = purchaseRequest.category.equalsIgnoreCase("PROJECTS") ? "Project: " : "Asset Equipment: "
		if(purchaseRequest.category.equalsIgnoreCase("PERSONAL")){
			desc = ""
			title = ""
		}

		def dto = new PRReportDto(
				prNo: purchaseRequest?.prNo ?: "",
				date: dateFormat.format(purchaseRequest?.prDateRequested),
				supplier: purchaseRequest?.supplier?.supplierFullname ?: "",
				fullname: purchaseRequest?.userFullname ?: "",
				project: desc ?: "",
				projTitle: title ?: "",

		)
		def gson = new Gson()
		def dataSourceByteArray = new ByteArrayInputStream(gson.toJson(dto).getBytes("UTF8"))
		def dataSource = new JsonDataSource(dataSourceByteArray)

		if (purchaseRequestItems) {
			purchaseRequestItems.each {
				it ->
					Inventory inv = inventoryService.getOnHandByItem(emp.office.id, it.item.id)
					def itemDto = new PRItemReportDto(
							description: it.item.descLong,
							brand: it.item.brand ?: "",
							uop: it.item.unit_of_purchase.unitDescription,
							uou: it.item.unit_of_usage.unitDescription,
							content_ratio: it.item.item_conversion,
							qty_uop: it.requestedQty,
							qty_uou: it.requestedQty * it.item.item_conversion,
							onhand: inv?.onHand ? inv?.onHand : 0,
							reorder: inv?.reOrderQty ? inv?.reOrderQty : 0
					)
					itemsDto.add(itemDto)
			}
		}

		List<Signature> signList = signatureService.signatureList("PR").sort({ it.sequence })
		def signColumn1 = new ArrayList<SignatureReportDto>()
		def signColumn2 = new ArrayList<SignatureReportDto>()
		def signColumn3 = new ArrayList<SignatureReportDto>()

		if (signList) {
			Integer count = 1
			signList.each {
				it ->
					def signData
					if (it.currentUsers) {
						signData = new SignatureReportDto(
								signatureHeader: it.signatureHeader,
								signaturies: emp.fullName,
								position: it.signaturePosition,
						)
					} else {
						signData = new SignatureReportDto(
								signatureHeader: it.signatureHeader,
								signaturies: (it.signaturePerson != null) ? it.signaturePerson : "",
								position: it.signaturePosition,
						)
					}

					if (count == 1) {
						signColumn1.add(signData)
					} else if (count == 2) {
						signColumn2.add(signData)
					} else if (count == 3) {
						signColumn3.add(signData)
						count = 0

					}
					count++
			}
		}

		if (signColumn1) {
			parameters.put('sign_column1', new JRBeanCollectionDataSource(signColumn1))
		}
		if (signColumn2) {
			parameters.put('sign_column2', new JRBeanCollectionDataSource(signColumn2))
		}
		if (signColumn3) {
			parameters.put('sign_column3', new JRBeanCollectionDataSource(signColumn3))
		}

		if (logo.exists()) {
			parameters.put("logo", logo?.getURL())
		}

		if (itemsDto) {
			parameters.put('items', new JRBeanCollectionDataSource(itemsDto))
		}

		String tel = office.telNo ?: "N/A";String phone = office.phoneNo ?: "N/A"
		String company = com.companyName ?: "";String addr = office.fullAddress ?: ""
		parameters.put("company_name",  company)
		parameters.put("com_address",  addr.trim())
		parameters.put("phone_no", "Phone No: "+phone)
		parameters.put("tel_no", "Tel No: "+tel)
		parameters.put("email", office.emailAdd ?: "N/A")
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
		params.add("Content-Disposition", "inline;filename=PR-Report-of-\"" + purchaseRequest?.prNo + "\".pdf")
		return new ResponseEntity(data, params, HttpStatus.OK)
	}

	//wilson report
	@RequestMapping(value = ['/receiving_report/{id}'], produces = ['application/pdf'])
	ResponseEntity<byte[]> reReport(@PathVariable('id') UUID id) {
		//query
		def com = companySettingsService.comById()
		def receiving = receivingReportService.recById(id)
		def receivingItem = receivingReportItemService.recItemByParent(id).sort { it.item.descLong }

		def res = applicationContext?.getResource("classpath:/reports/inventory/receiving_report.jasper")
		def bytearray = new ByteArrayInputStream()
		def os = new ByteArrayOutputStream()
		def parameters = [:] as Map<String, Object>
		def logo = applicationContext?.getResource("classpath:/reports/${com.logoFileName}")
		def itemsDto = new ArrayList<ReceivingReportItemDto>()

		DateTimeFormatter dateFormat =
				DateTimeFormatter.ofPattern("MM/dd/yyyy").withZone(ZoneId.systemDefault())
		String desc = receiving.category.equalsIgnoreCase("PROJECTS") ? receiving?.project?.description ?: "" : receiving?.assets?.description ?: ""
		String title = receiving.category.equalsIgnoreCase("PROJECTS") ? "Project: " : "Asset Equipment: "
		if(receiving.category.equalsIgnoreCase("PERSONAL")){
			desc = ""
			title = ""
		}

		def dto = new ReceivingReportDto(
				srrNo: receiving?.rrNo,
				date: dateFormat.format(receiving?.receiveDate),
				poNo: receiving?.purchaseOrder?.poNumber ? receiving?.purchaseOrder?.poNumber : '',
				refNo: receiving.receivedRefNo,
				supplier: receiving?.supplier?.supplierFullname,
				remarks: receiving?.receivedRemarks ? receiving?.receivedRemarks : '',
				project: desc,
				projTitle: title,
//				totalDiscount: receiving.totalDiscount,
//				netDiscount: receiving.netDiscount,
//				amount: receiving.amount,
//				vatRate: receiving.vatRate,
//				inputTax: receiving.inputTax,
//				netAmount: receiving.netAmount,
		)
		def gson = new Gson()
		def dataSourceByteArray = new ByteArrayInputStream(gson.toJson(dto).getBytes("UTF8"))
		def dataSource = new JsonDataSource(dataSourceByteArray)

		if (receivingItem) {
			receivingItem.each {
				it ->
					def itemDto = new ReceivingReportItemDto(
							item_code: it.item?.itemCode,
							uou_qty: it.receiveQty,
							uou_unit: it.item?.unit_of_usage?.unitDescription,
							uop_qty: it.receiveQty / it.item?.item_conversion,
							uop_unit: it.item?.unit_of_purchase?.unitDescription,
							item_description: it.item?.descLong,
							unit_cost: it.receiveUnitCost.round(2),
							input_tax: it.inputTax.round(2),
							inventory: receiving?.vatInclusive ? it.netAmount.round(2) : it.totalAmount.round(2),
							total: receiving?.vatInclusive ? it.totalAmount.round(2) : it.netAmount.round(2)
					)
					itemsDto.add(itemDto)
			}
		}

		Employee emp = employeeRepository.findByUsername(SecurityUtils.currentLogin()).first()
		List<Signature> signList = signatureService.signatureList("DR").sort({ it.sequence })
		def signColumn1 = new ArrayList<SignatureReportDto>()
		def signColumn2 = new ArrayList<SignatureReportDto>()

		Office office = officeRepository.findById(emp.office.id).get()


		if (signList) {
			Integer count = 1
			signList.each {
				it ->
					def signData
					if (it.currentUsers) {
						signData = new SignatureReportDto(
								signatureHeader: it.signatureHeader,
								signaturies: emp.fullName,
								position: it.signaturePosition,
						)
					} else {
						signData = new SignatureReportDto(
								signatureHeader: it.signatureHeader,
								signaturies: (it.signaturePerson != null) ? it.signaturePerson : "",
								position: it.signaturePosition,
						)
					}

					if (count == 1) {
						signColumn1.add(signData)
					} else if (count == 2) {
						signColumn2.add(signData)
						count = 0
					}
					count++
			}
		}

		if (signColumn1) {
			parameters.put('sign_column1', new JRBeanCollectionDataSource(signColumn1))
		}
		if (signColumn2) {
			parameters.put('sign_column2', new JRBeanCollectionDataSource(signColumn2))
		}

		if (logo.exists()) {
			parameters.put("logo", logo?.getURL())
		}

		if (itemsDto) {
			parameters.put('items', new JRBeanCollectionDataSource(itemsDto))
		}

		String tel = office.telNo ?: "N/A";String phone = office.phoneNo ?: "N/A"
		String company = com.companyName ?: "";String addr = office.fullAddress ?: ""
		parameters.put("company_name",  company)
		parameters.put("com_address",  addr.trim())
		parameters.put("phone_no", "Phone No: +"+phone)
		parameters.put("tel_no", "Tel No: "+tel)
		parameters.put("email", office.emailAdd ?: "N/A")

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
		params.add("Content-Disposition", "inline;filename=Receiving-Report-of-\"" + receiving?.rrNo + "\".pdf")
		return new ResponseEntity(data, params, HttpStatus.OK)
	}

	@RequestMapping(value = ['/stockcard_report/{id}/{officeId}'], produces = ['application/pdf'])
	ResponseEntity<byte[]> stockcard_report(@PathVariable('id') String itemId, @PathVariable('officeId') String officeId) {
		//query
		def stockcard = inventoryLedgerService.getStockCard(itemId, officeId)
		def item = itemService.itemById(UUID.fromString(itemId))
		def com = companySettingsService.comById()
		def res = applicationContext?.getResource("classpath:/reports/inventory/stockcard_report.jasper")
		def bytearray = new ByteArrayInputStream()
		def os = new ByteArrayOutputStream()
		def parameters = [:] as Map<String, Object>
		def logo = applicationContext?.getResource("classpath:/reports/${com.logoFileName}")
		def itemsDto = new ArrayList<StockCardPrint>()

		DateTimeFormatter dateFormat =
				DateTimeFormatter.ofPattern("MM/dd/yyyy").withZone(ZoneId.systemDefault())
		def dto = new HeaderDtoPrint(
				descLong: item.descLong,
		)
		def gson = new Gson()
		def dataSourceByteArray = new ByteArrayInputStream(gson.toJson(dto).getBytes("UTF8"))
		def dataSource = new JsonDataSource(dataSourceByteArray)

		if (stockcard) {
			stockcard.each {
				it ->
					def total = (it.ledger_qtyin + it.ledger_qty_out + it.adjustment) * it.unitcost
					def itemDto = new StockCardPrint(
							ledger_date: it.ledger_date.substring(0, 10),
							reference_no: it.reference_no,
							document_desc: it.document_desc,
							source_officename: it.source_officename,
							destination_officename: it.destination_officename,
							ledger_qtyin: it.ledger_qtyin,
							ledger_qty_out: it.ledger_qty_out,
							adjustment: it.adjustment,
							unitcost: it.unitcost.round(2),
							totalCost: total.round(2),
							runningqty: it.runningqty,
							wcost: it.wcost.round(2),
							runningbalance: it.runningbalance.round(2)
					)
					itemsDto.add(itemDto)
			}
		}

		if (logo.exists()) {
			parameters.put("logo", logo?.getURL())
		}

		if (itemsDto) {
			parameters.put('items', new JRBeanCollectionDataSource(itemsDto))
		}

		Employee emp = employeeRepository.findByUsername(SecurityUtils.currentLogin()).first()
		Office office = officeRepository.findById(emp.office.id).get()


		String tel = office.telNo ?: "N/A";String phone = office.phoneNo ?: "N/A"
		String company = com.companyName ?: "";String addr = office.fullAddress ?: ""
		parameters.put("company_name",  company)
		parameters.put("com_address",  addr.trim())
		parameters.put("phone_no", "Phone No: "+phone)
		parameters.put("tel_no", "Tel No: "+tel)
		parameters.put("email", office.emailAdd ?: "N/A")

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
		params.add("Content-Disposition", "inline;filename=Stockcard-Report-of-\"" + item?.descLong + "\".pdf")
		return new ResponseEntity(data, params, HttpStatus.OK)
	}

	@RequestMapping(value = ['/onhand_report/{id}/{date}'], produces = ['application/pdf'])
	ResponseEntity<byte[]> onhand_report(@PathVariable('id') String id, @PathVariable('date') String date) {
		//query
		def items = inventoryResource.getOnHandReport(date,id, '')
		def office = officeRepository.findById(UUID.fromString(id)).get()
		def com = companySettingsService.comById()
		def res = applicationContext?.getResource("classpath:/reports/inventory/onhand_report.jasper")
		def bytearray = new ByteArrayInputStream()
		def os = new ByteArrayOutputStream()
		def parameters = [:] as Map<String, Object>
		def logo = applicationContext?.getResource("classpath:/reports/${com.logoFileName}")

		DateTimeFormatter dateFormat =
				DateTimeFormatter.ofPattern("MM/dd/yyyy").withZone(ZoneId.systemDefault())
		def dto = new OnHandHeader(
				date: date,
				office: office.officeDescription,
		)
		def gson = new Gson()
		def dataSourceByteArray = new ByteArrayInputStream(gson.toJson(dto).getBytes("UTF8"))
		def dataSource = new JsonDataSource(dataSourceByteArray)

		if (logo.exists()) {
			parameters.put("logo", logo?.getURL())
		}

		if (items) {
			parameters.put('items', new JRBeanCollectionDataSource(items))
		}

		Employee emp = employeeRepository.findByUsername(SecurityUtils.currentLogin()).first()
		Office officeData = officeRepository.findById(emp.office.id).get()


		String tel = officeData.telNo ?: "N/A";String phone = officeData.phoneNo ?: "N/A"
		String company = com.companyName ?: "";String addr = officeData.fullAddress ?: ""
		parameters.put("company_name",  company)
		parameters.put("com_address",  addr.trim())
		parameters.put("phone_no", "Phone No: "+phone)
		parameters.put("tel_no", "Tel No: "+tel)
		parameters.put("email", officeData.emailAdd ?: "N/A")

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
		params.add("Content-Disposition", "inline;filename=OnHandReport-of-\"" + office?.officeDescription + "\".pdf")
		return new ResponseEntity(data, params, HttpStatus.OK)
	}


	@RequestMapping(value = ['/srr_detail/{fromDate}/{toDate}'], produces = ['application/pdf'])
	ResponseEntity<byte[]> stockcard_report(
			@PathVariable('fromDate') Instant fromDate,
			@PathVariable('toDate') Instant toDate
	) {
		//query
		def itemList = receivingReportItemService.getSrrItemByDateRange(fromDate,toDate,'')
		def com = companySettingsService.comById()
		def res = applicationContext?.getResource("classpath:/reports/inventory/srr_item_report.jasper")
		def bytearray = new ByteArrayInputStream()
		def os = new ByteArrayOutputStream()
		def parameters = [:] as Map<String, Object>
		def logo = applicationContext?.getResource("classpath:/reports/${com.logoFileName}")
		def itemsDto = new ArrayList<SrrItemDto>()

		DateTimeFormatter dateFormat =
				DateTimeFormatter.ofPattern("MM/dd/yyyy").withZone(ZoneId.systemDefault())
		def dto = new HeaderDtoPrint(
				descLong: dateFormat.format(fromDate)+ " - "+ dateFormat.format(toDate.minus(Duration.ofHours(8))),
		)
		def gson = new Gson()
		def dataSourceByteArray = new ByteArrayInputStream(gson.toJson(dto).getBytes("UTF8"))
		def dataSource = new JsonDataSource(dataSourceByteArray)

		println("to date => "+ toDate)
		println("to date formatted => "+ dateFormat.format(toDate))

		if (itemList) {
			itemList.each {
				it ->
					def itemDto = new SrrItemDto(
							srrNo: it.receivingReport?.rrNo ?: "",
							poNum: it.receivingReport?.purchaseOrder?.poNumber ?: "",
							recDate: dateFormat.format(it.receivingReport?.receiveDate) ?: "",
							supplier: it.receivingReport?.supplier?.supplierFullname ?: "",
							item: it.item?.descLong ?: "",
							unitCost: it.receiveUnitCost.round(2),
							qty: it.receiveQty,
							totalAmount: it.totalAmount.round(2),
					)
					itemsDto.add(itemDto)
			}
		}

		if (logo.exists()) {
			parameters.put("logo", logo?.getURL())
		}

		if (itemsDto) {
			parameters.put('items', new JRBeanCollectionDataSource(itemsDto))
		}

		Employee emp = employeeRepository.findByUsername(SecurityUtils.currentLogin()).first()
		Office officeData = officeRepository.findById(emp.office.id).get()


		String tel = officeData.telNo ?: "N/A";String phone = officeData.phoneNo ?: "N/A"
		String company = com.companyName ?: "";String addr = officeData.fullAddress ?: ""
		parameters.put("company_name",  company)
		parameters.put("com_address",  addr.trim())
		parameters.put("phone_no", "Phone No: "+phone)
		parameters.put("tel_no", "Tel No: "+tel)
		parameters.put("email", officeData.emailAdd ?: "N/A")

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
		params.add("Content-Disposition", "inline;filename=SRR-Item-Report.pdf")
		return new ResponseEntity(data, params, HttpStatus.OK)
	}

	@RequestMapping(value = ['/return_sup/{id}'], produces = ['application/pdf'])
	ResponseEntity<byte[]> returnReport(@PathVariable('id') UUID id) {

		ReturnSupplier returnSupplierDetails = returnSupplierService.rtsById(id)
		List<ReturnSupplierItem> returnSupplierItem = returnSupplierItemsService.rtsItemByParent(id)
		Employee emp = employeeRepository.findByUsername(returnSupplierDetails?.createdBy).first()
		def com = companySettingsService.comById()
		def res = applicationContext?.getResource("classpath:/reports/inventory/return_sup_report.jasper")
		def bytearray = new ByteArrayInputStream()
		def os = new ByteArrayOutputStream()
		def parameters = [:] as Map<String, Object>
		def logo = applicationContext?.getResource("classpath:/reports/${com.logoFileName}")
		def itemsDto = new ArrayList<ReturnSuppItemReportDto>()

		DateTimeFormatter dateFormat =
				DateTimeFormatter.ofPattern("MM/dd/yyyy").withZone(ZoneId.systemDefault())

		def dto = new ReturnSuppReportDto(
				date: dateFormat.format(Instant.now()),
				rts: returnSupplierDetails?.rtsNo,
				refNo: "${returnSupplierDetails?.refSrr}${returnSupplierDetails?.receivedRefNo ? "/${returnSupplierDetails?.receivedRefNo}" : ""}",
				supplierCode: returnSupplierDetails?.supplier?.supplierCode,
				supplierName: returnSupplierDetails?.supplier?.supplierFullname,
				returnBy: emp?.fullName,
				returnDate: dateFormat.format(returnSupplierDetails?.returnDate),
				receivedBy: returnSupplierDetails?.received_by,
				receivedDate: dateFormat.format(returnSupplierDetails?.returnDate)
		)

		def gson = new Gson()
		def dataSourceByteArray = new ByteArrayInputStream(gson.toJson(dto).getBytes("UTF8"))
		def dataSource = new JsonDataSource(dataSourceByteArray)

		if (returnSupplierItem) {
			returnSupplierItem.each {
				it ->

					def itemDto = new ReturnSuppItemReportDto(
							stockCode: it.item.sku,
							itemDesc: it.item.descLong,
							uom: it.item.unit_of_usage.unitDescription,
							quantityReturn: it.returnQty,
							reasonForReturn: it.return_remarks
					)
					itemsDto.add(itemDto)
			}
		}

		if (logo.exists()) {
			parameters.put("logo", logo?.getURL())
		}

		if (itemsDto) {
			parameters.put('items', new JRBeanCollectionDataSource(itemsDto))
		}


		Office officeData = officeRepository.findById(emp.office.id).get()


		String tel = officeData.telNo ?: "N/A";String phone = officeData.phoneNo ?: "N/A"
		String company = com.companyName ?: "";String addr = officeData.fullAddress ?: ""
		parameters.put("company_name",  company)
		parameters.put("com_address",  addr.trim())
		parameters.put("phone_no", "Phone No: "+phone)
		parameters.put("tel_no", "Tel No: "+tel)
		parameters.put("email", officeData.emailAdd ?: "N/A")

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
		params.add("Content-Disposition", "inline;filename=RETURN-SUPPLIER-Report-of-\"" + returnSupplierDetails?.rtsNo + "\".pdf")
		return new ResponseEntity(data, params, HttpStatus.OK)
	}

	@RequestMapping(value = ['/issue_report/{id}'], produces = ['application/pdf'])
	ResponseEntity<byte[]> issueReport(@PathVariable('id') UUID id) {

		def com = companySettingsService.comById()
		StockIssue parent = stockIssuanceService.stiById(id)
		List<StockIssueItems> items = stockIssueItemsService.stiItemByParent(id).sort {
			it.item.descLong
		}
		String issueBy = parent.issued_by.fullName
		String receivedBy = parent.received_by.fullName

		def res = applicationContext?.getResource("classpath:/reports/inventory/stock_transfer.jasper")
		def bytearray = new ByteArrayInputStream()
		def os = new ByteArrayOutputStream()
		def parameters = [:] as Map<String, Object>
		def logo = applicationContext?.getResource("classpath:/reports/${com.logoFileName}")
		def itemsDto = new ArrayList<STSReportItemDto>()

		DateTimeFormatter dateFormat =
				DateTimeFormatter.ofPattern("MM/dd/yyyy").withZone(ZoneId.systemDefault())

		def dto = new STSReportDto(
				date: dateFormat.format(parent?.issueDate),
				stsNo: parent?.issueNo,
				issuing_location: parent?.issueFrom?.officeDescription,
				receiving_location: parent?.issueTo?.officeDescription,
				project: parent?.project?.description ?: "N/A",
				issuedBy: issueBy,
				receivedBy: receivedBy,

		)
		def gson = new Gson()
		def dataSourceByteArray = new ByteArrayInputStream(gson.toJson(dto).getBytes("UTF8"))
		def dataSource = new JsonDataSource(dataSourceByteArray)

		if (items) {
			items.each {
				it ->
					BigDecimal total = it.issueQty * (it.unitCost ?: BigDecimal.ZERO)
					def itemDto = new STSReportItemDto(
							code: it.item.itemCode ?: "",
							description: it.item.descLong ?: "",
							uom: it.item?.unit_of_usage?.unitDescription ?: "",
							issued: it.issueQty,
							unitCost: it.unitCost,
							total: total,

					)
					itemsDto.add(itemDto)
			}
		}


		if (logo.exists()) {
			parameters.put("logo", logo?.getURL())
		}

		if (itemsDto) {
			parameters.put('items', new JRBeanCollectionDataSource(itemsDto))
		}
		UUID officeId = parent?.issued_by?.office?.id ?: null
		Office officeData = officeRepository.findById(officeId).get()


		String tel = officeData.telNo ?: "N/A";String phone = officeData.phoneNo ?: "N/A"
		String company = com.companyName ?: "";String addr = officeData.fullAddress ?: ""
		parameters.put("company_name",  company)
		parameters.put("com_address",  addr.trim())
		parameters.put("phone_no", "Phone No: "+phone)
		parameters.put("tel_no", "Tel No: "+tel)
		parameters.put("email", officeData.emailAdd ?: "N/A")

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
		params.add("Content-Disposition", "inline;filename=STI-Report-of-\"" + parent?.issueNo + "\".pdf")
		return new ResponseEntity(data, params, HttpStatus.OK)
	}


}
