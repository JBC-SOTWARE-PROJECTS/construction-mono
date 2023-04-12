package com.backend.gbp.rest

import com.backend.gbp.graphqlservices.inventory.InventoryLedgerService
import com.backend.gbp.graphqlservices.inventory.ItemService
import com.backend.gbp.graphqlservices.inventory.ReceivingReportItemService
import com.backend.gbp.graphqlservices.inventory.ReceivingReportService
import com.backend.gbp.graphqlservices.inventory.StockIssuanceService
import com.backend.gbp.graphqlservices.inventory.StockIssueItemsService
import com.fasterxml.jackson.databind.ObjectMapper
import com.google.common.reflect.TypeToken
import com.google.gson.Gson
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.inventory.*
import com.backend.gbp.repository.inventory.*
import com.backend.gbp.rest.dto.*
import com.backend.gbp.security.SecurityUtils
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.GeneratorType
import org.apache.commons.csv.CSVFormat
import org.apache.commons.csv.CSVPrinter
import org.apache.commons.lang3.StringUtils
import org.apache.http.client.methods.HttpPost
import org.apache.http.entity.StringEntity
import org.apache.http.impl.client.HttpClients
import org.apache.http.message.BasicNameValuePair
import org.apache.xmlbeans.impl.xb.xsdschema.AnyDocument
import org.json.JSONArray
import org.json.JSONObject
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.http.HttpHeaders
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.jdbc.core.BeanPropertyRowMapper
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.transaction.annotation.Transactional
import org.springframework.util.LinkedMultiValueMap
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestMethod
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController

import java.lang.reflect.Type
import java.time.Instant
import java.time.LocalDate
import java.time.LocalDateTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter

@RestController
class InventoryResource {

	@Autowired
	GeneratorService generatorService

	@Autowired
	ItemService itemService

	@Autowired
	ObjectMapper objectMapper

	@Autowired
	JdbcTemplate jdbcTemplate

	@Autowired
	StockIssueItemsService stockIssueItemsService

	@Autowired
	ReceivingReportItemService receivingReportItemService

	@Autowired
	ReceivingReportService receivingReportService

	@Autowired
	InventoryLedgerService inventoryLedgerService


	@RequestMapping(method = [RequestMethod.POST], value = ["/api/get/ledger"])
	List<StockCard> getLedger(
			@RequestParam("itemId") String itemId,
			@RequestParam("department") String depId
	) {
		String sql = "SELECT * from inventory.stock_card('${itemId}', '${depId}');"
		List<StockCard> items = jdbcTemplate.query(sql, new BeanPropertyRowMapper(StockCard.class))
		return items

	}

	@RequestMapping(method = [RequestMethod.POST], value = ["/api/get/ledger_all"])
	List<StockCard> getLedgerAll(
			String itemId
	) {

		String sql = "SELECT * from inventory.stock_card_all("+"'"+itemId+"'"+");"
		List<StockCard> items = jdbcTemplate.query(sql, new BeanPropertyRowMapper(StockCard.class))
		return items
	}

	@RequestMapping(method = [RequestMethod.POST], value = ["/api/getBrands"])
	List<BrandDto> getBrands() {

		String sql = "select distinct(i.brand) from inventory.item i;"
		List<BrandDto> brands = jdbcTemplate.query(sql, new BeanPropertyRowMapper(BrandDto.class))
		return brands
	}


	List<CategoryDto> getCategoryProjects() {

		String sql = "select distinct(i.category) from projects.project_costs i;"
		List<CategoryDto> category = jdbcTemplate.query(sql, new BeanPropertyRowMapper(CategoryDto.class))
		return category
	}

	List<UnitDto> getUnitProjects() {

		String sql = "select distinct(i.unit) from projects.project_costs i;"
		List<UnitDto> units = jdbcTemplate.query(sql, new BeanPropertyRowMapper(UnitDto.class))
		return units
	}

	@RequestMapping(method = [RequestMethod.POST], value = ["/api/getPlateNo"])
	List<PlateNumberDto> getPlateNo() {

		String sql = "select distinct(j.plate_no) from billing.jobs j;"
		List<PlateNumberDto> brands = jdbcTemplate.query(sql, new BeanPropertyRowMapper(PlateNumberDto.class))
		return brands
	}


	//lastUnitPrice
	@RequestMapping(method = [RequestMethod.POST], value = ["/api/get/lastWcost"])
	BigDecimal getLastWcost(
			@RequestParam("itemId") String itemId
	) {

		String sql = "SELECT coalesce(inventory.last_wcost('${itemId}'),0);"
		BigDecimal unitCost = jdbcTemplate.queryForObject(sql, BigDecimal) as BigDecimal
		return unitCost
	}

	@RequestMapping(method = [RequestMethod.POST], value = ["/api/get/on_hand_report"])
	List<OnHandReport> getOnHandReport(
			@RequestParam("filter_date") String filter_date,
			@RequestParam("office") String office,
			@RequestParam("filter") String filter
	) {

		String sql = "SELECT * from inventory.on_hand('${filter_date}', '${office}', '${filter}');"
		List<OnHandReport> items = jdbcTemplate.query(sql, new BeanPropertyRowMapper(OnHandReport.class))
		return items
	}

	//billing
	//@RequestMapping(method = [RequestMethod.POST], value = ["/api/get/customer_bill"])
	List<CustomerBillingDto> getCustomerBilling(
			@RequestParam("billing") UUID billing
	) {

		String sql = "select * from billing.customer_billing(" + "'" + billing + "'" + ");"
		List<CustomerBillingDto> items = jdbcTemplate.query(sql, new BeanPropertyRowMapper(CustomerBillingDto.class))
		return items
	}


	//@RequestMapping(method = [RequestMethod.POST], value = ["/api/get/sales_report"])
	List<SalesReportDto> getSalesReport(
			@RequestParam("start") String start,
			@RequestParam("end") String end,
			@RequestParam("filter") String filter
	) {

		String sql = "select * from billing.sales_reports(" + "'" + start + "'" + ","+ "'" + end + "'" +","+ "'" + filter + "'" +");"
		List<SalesReportDto> items = jdbcTemplate.query(sql, new BeanPropertyRowMapper(SalesReportDto.class))
		return items
	}

	//@RequestMapping(method = [RequestMethod.POST], value = ["/api/get/sales_chart"])
	SalesChartsDto getSaleChartsGross(
			@RequestParam("start") String start
	) {

		String sql = "select * from billing.sales_charts(" + "'" + start + "'" + ");"
		SalesChartsDto items = jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper(SalesChartsDto.class))
		return items
	}

	SalesChartsDto getSaleChartsDeduct(
			@RequestParam("start") String start
	) {

		String sql = "select * from billing.sales_charts_deduct(" + "'" + start + "'" + ");"
		SalesChartsDto items = jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper(SalesChartsDto.class))
		return items
	}

	SalesChartsDto getSaleChartsNet(
			@RequestParam("start") String start
	) {

		String sql = "select * from billing.sales_charts_net(" + "'" + start + "'" + ");"
		SalesChartsDto items = jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper(SalesChartsDto.class))
		return items
	}

	SalesChartsDto getSaleChartsRevenue(
			@RequestParam("start") String start
	) {

		String sql = "select * from billing.sales_charts_revenue(" + "'" + start + "'" + ");"
		SalesChartsDto items = jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper(SalesChartsDto.class))
		return items
	}

	SalesChartsDto getSaleChartsExpense(
			@RequestParam("start") String start
	) {

		String sql = "select * from billing.sales_charts_expense(" + "'" + start + "'" + ");"
		SalesChartsDto items = jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper(SalesChartsDto.class))
		return items
	}

	SalesChartsDto getSaleChartsProfit(
			@RequestParam("start") String start
	) {

		String sql = "select * from billing.sales_charts_profit(" + "'" + start + "'" + ");"
		SalesChartsDto items = jdbcTemplate.queryForObject(sql, new BeanPropertyRowMapper(SalesChartsDto.class))
		return items
	}


	//@RequestMapping(method = [RequestMethod.POST], value = ["/api/get/total_gross"])
	BigDecimal total_gross(
			@RequestParam("start") String start,
			@RequestParam("end") String end,
			@RequestParam("filter") String filter
	) {

		String sql = "select billing.gross_sales(" + "'" + start + "'" + ","+ "'" + end + "'" +","+ "'" + filter + "'" +");"
		BigDecimal value = jdbcTemplate.queryForObject(sql, BigDecimal) as BigDecimal
		return value
	}

	//@RequestMapping(method = [RequestMethod.POST], value = ["/api/get/total_discount"])
	BigDecimal total_discount(
			@RequestParam("start") String start,
			@RequestParam("end") String end,
			@RequestParam("filter") String filter
	) {

		String sql = "select billing.total_deduction(" + "'" + start + "'" + ","+ "'" + end + "'" +","+ "'" + filter + "'" +");"
		BigDecimal value = jdbcTemplate.queryForObject(sql, BigDecimal) as BigDecimal
		return value
	}

	//@RequestMapping(method = [RequestMethod.POST], value = ["/api/get/total_discount_commision"])
	BigDecimal total_discount_commission(
			@RequestParam("start") String start,
			@RequestParam("end") String end,
			@RequestParam("filter") String filter
	) {

		String sql = "select billing.total_deduction_commision(" + "'" + start + "'" + ","+ "'" + end + "'" +","+ "'" + filter + "'" +");"
		BigDecimal value = jdbcTemplate.queryForObject(sql, BigDecimal) as BigDecimal
		return value
	}

	//@RequestMapping(method = [RequestMethod.POST], value = ["/api/get/total_commission"])
	BigDecimal total_commission(
			@RequestParam("start") String start,
			@RequestParam("end") String end,
			@RequestParam("filter") String filter
	) {

		String sql = "select billing.total_commission(" + "'" + start + "'" + ","+ "'" + end + "'" +","+ "'" + filter + "'" +");"
		BigDecimal value = jdbcTemplate.queryForObject(sql, BigDecimal) as BigDecimal
		return value
	}

	//@RequestMapping(method = [RequestMethod.POST], value = ["/api/get/net_sales"])
	BigDecimal net_sales(
			@RequestParam("start") String start,
			@RequestParam("end") String end,
			@RequestParam("filter") String filter
	) {

		String sql = "select billing.net_sales(" + "'" + start + "'" + ","+ "'" + end + "'" +","+ "'" + filter + "'" +");"
		BigDecimal value = jdbcTemplate.queryForObject(sql, BigDecimal) as BigDecimal
		return value
	}

	//@RequestMapping(method = [RequestMethod.POST], value = ["/api/get/customer_bill_not_paid"])
	List<CustomerBillingDto> getCustomerBillingNotYetPaid(
			@RequestParam("billing") UUID billing
	) {

		String sql = "with c_bill as (select * from billing.customer_billing(" + "'" + billing + "'" + "))select * from c_bill where balance > 0;"
		List<CustomerBillingDto> items = jdbcTemplate.query(sql, new BeanPropertyRowMapper(CustomerBillingDto.class))
		return items
	}
	//end billing

	@RequestMapping(method = RequestMethod.GET, value = ["/api/stockCard/report"])
	ResponseEntity<AnyDocument.Any> stockCard(
			@RequestParam String itemId,
			@RequestParam String office
	) {
		def stockcard = this.getLedger(itemId, office)
		StringBuffer buffer = new StringBuffer()

		DateTimeFormatter formatter =
				DateTimeFormatter.ofPattern("MM/dd/yyyy").withZone(ZoneId.systemDefault())
		CSVPrinter csvPrinter = new CSVPrinter(buffer, CSVFormat.POSTGRESQL_CSV
				.withHeader("DATE", "REF.# ", "TRANS. TYPE", "ITEM", "SOURCE", "DESTINATION", "QTY IN", "QTY OUT", "ADJ.", "UNIT COST", "TOTAL AMOUNT", "QTY", "W. COST", "AMOUNT"))

		try {
			if (stockcard) {
				stockcard.each {
					it ->
						def total = (it.ledger_qtyin + it.ledger_qty_out + it.adjustment) * it.unitcost
						csvPrinter.printRecord(
								it.ledger_date.substring(0, 10),
								it.reference_no,
								it.document_desc,
								it.desc_long,
								it.source_officename,
								it.destination_officename,
								it.ledger_qtyin,
								it.ledger_qty_out,
								it.adjustment,
								it.unitcost.round(2),
								total.round(2),
								it.runningqty,
								it.wcost.round(2),
								it.runningbalance.round(2)
						)
				}
			}

			LinkedMultiValueMap<String, String> extHeaders = new LinkedMultiValueMap<>()
			extHeaders.add("Content-Disposition", "inline;filename=Stock-card-Report.csv")

			return new ResponseEntity(String.valueOf(buffer).getBytes(), extHeaders, HttpStatus.OK)
		}
		catch (e) {
			throw e
		}

	}

	@RequestMapping(method = RequestMethod.GET, value = ["/api/onhand/report"])
	ResponseEntity<AnyDocument.Any> downloadOnhandReport(
			@RequestParam String date,
			@RequestParam UUID office
	) {
		def itemList = this.getOnHandReport(date,office.toString(), '')

		StringBuffer buffer = new StringBuffer()

		DateTimeFormatter formatter =
				DateTimeFormatter.ofPattern("MM/dd/yyyy").withZone(ZoneId.systemDefault())
		CSVPrinter csvPrinter = new CSVPrinter(buffer, CSVFormat.POSTGRESQL_CSV
				.withHeader("ITEM DESCRIPTION", "UNIT OF PURCHASE", "UNIT OF USAGE", "ITEM CATEGORY", "EXPIRY DATE", "UNIT COST", "ON HAND QTY", "TOTAL COST"))

		try {
			itemList.each {
				item ->
					def cost = item.last_unit_cost * item.onhand
					csvPrinter.printRecord(
							item.desc_long,
							item.unit_of_purchase,
							item.unit_of_usage,
							item.category_description,
							item.expiration_date,
							item.last_unit_cost.round(2),
							item.onhand,
							cost.round(2)
					)
			}

			LinkedMultiValueMap<String, String> extHeaders = new LinkedMultiValueMap<>()
			extHeaders.add("Content-Disposition", "inline;filename=OnHand-Report.csv")

			return new ResponseEntity(String.valueOf(buffer).getBytes(), extHeaders, HttpStatus.OK)
		}
		catch (e) {
			throw e
		}

	}

	@RequestMapping(method = RequestMethod.GET, value = ["/api/expense/report"])
	ResponseEntity<AnyDocument.Any> downloadOnhandReport(
			@RequestParam Instant start,
			@RequestParam Instant end,
			@RequestParam UUID expenseFrom
	) {
		Instant fromDate = start.atZone(ZoneId.systemDefault()).toInstant()
		Instant toDate = end.atZone(ZoneId.systemDefault()).toInstant()
		def itemList = stockIssueItemsService.getItemExpensesPerDateRange(fromDate, toDate, expenseFrom, '' )
		StringBuffer buffer = new StringBuffer()

		DateTimeFormatter formatter =
				DateTimeFormatter.ofPattern("MM/dd/yyyy").withZone(ZoneId.systemDefault())
		CSVPrinter csvPrinter = new CSVPrinter(buffer, CSVFormat.POSTGRESQL_CSV
				.withHeader("DATE", "EXPENSE NO", "OFFICE", "ITEM", "ITEM CATEGORY", "QTY", "UNIT", "UNIT COST", "TOTAL", "EXPENSED BY"))

		try {
			itemList.each {
				item ->
					def total = item.unitCost * item.issueQty
					csvPrinter.printRecord(
							formatter.format(item.stockIssue.issueDate),
							item.stockIssue.issueNo,
							item.stockIssue.issueTo.officeDescription,
							item.item.descLong,
							item.item.item_category.categoryDescription,
							item.issueQty,
							item.item.unit_of_purchase.unitDescription,
							item.unitCost.round(2),
							total.round(2),
							item.stockIssue.issued_by.fullName,
					)
			}

			LinkedMultiValueMap<String, String> extHeaders = new LinkedMultiValueMap<>()
			extHeaders.add("Content-Disposition", "inline;filename=Expense-Report.csv")

			return new ResponseEntity(String.valueOf(buffer).getBytes(), extHeaders, HttpStatus.OK)
		}
		catch (e) {
			throw e
		}

	}

	@RequestMapping(method = RequestMethod.GET, value = ["/api/srr/report"])
	ResponseEntity<AnyDocument.Any> downloadSrrReport(
			@RequestParam Instant start,
			@RequestParam Instant end
	) {

		Instant fromDate = start.atZone(ZoneId.systemDefault()).toInstant()
		Instant toDate = end.atZone(ZoneId.systemDefault()).toInstant()
		def itemList = receivingReportService.getSrrByDateRange(fromDate, toDate, '')
		StringBuffer buffer = new StringBuffer()

		DateTimeFormatter formatter =
				DateTimeFormatter.ofPattern("MM/dd/yyyy").withZone(ZoneId.systemDefault())
		CSVPrinter csvPrinter = new CSVPrinter(buffer, CSVFormat.POSTGRESQL_CSV
				.withHeader("SRR NO", "RECEIVING DATE", "PO NUMBER", "REFERENCE NUMBER", "REFERENCE DATE", "OFFICE", "SUPPLIER", "PAYMENT Terms", "GROSS AMOUNT", "TOTAL DISCOUNT", "NET OF DISCOUNT", "NET AMOUNT", "INPUT TAX", " TOTAL AMOUNT", "RECEIVE BY"))

		try {
			itemList.each {
				item ->
					csvPrinter.printRecord(
							item.rrNo,
							formatter.format(item.receiveDate),
							item.purchaseOrder?.poNumber,
							item.receivedRefNo,
							formatter.format(item.receivedRefDate),
							item.receivedOffice?.officeDescription,
							item.supplier?.supplierFullname,
							item.paymentTerms?.paymentDesc,
							item.grossAmount,
							item.totalDiscount,
							item.netDiscount,
							item.netAmount,
							item.inputTax,
							item.amount,
							item.userFullname,
					)
			}

			LinkedMultiValueMap<String, String> extHeaders = new LinkedMultiValueMap<>()
			extHeaders.add("Content-Disposition", "inline;filename=SRR-Report.csv")

			return new ResponseEntity(String.valueOf(buffer).getBytes(), extHeaders, HttpStatus.OK)
		}
		catch (e) {
			throw e
		}

	}

	@RequestMapping(method = RequestMethod.GET, value = ["/api/srrItem/report"])
	ResponseEntity<AnyDocument.Any> downloadSrrItemReport(
			@RequestParam Instant start,
			@RequestParam Instant end
	) {

		Instant fromDate = start.atZone(ZoneId.systemDefault()).toInstant()
		Instant toDate = end.atZone(ZoneId.systemDefault()).toInstant()
		def itemList = receivingReportItemService.getSrrItemByDateRange(fromDate,toDate,'')
		StringBuffer buffer = new StringBuffer()

		DateTimeFormatter formatter =
				DateTimeFormatter.ofPattern("MM/dd/yyyy").withZone(ZoneId.systemDefault())
		CSVPrinter csvPrinter = new CSVPrinter(buffer, CSVFormat.POSTGRESQL_CSV
				.withHeader("SRR NO","RECEIVING DATE","PO NUMBER","REFERENCE NUMBER","REFERENCE DATE","RECEIVING OFFICE","SUPPLIER","ITEM","ITEM CATEGORY","UNIT COST","DISCOUNT","QUANTITY","TAX","TOTAL AMOUNT","NET AMOUNT"))

		try {
			itemList.each {
				item ->
					csvPrinter.printRecord(
							item.receivingReport?.rrNo,
							formatter.format(item.receivingReport?.receiveDate),
							item.receivingReport?.purchaseOrder?.poNumber,
							item.receivingReport?.receivedRefNo,
							formatter.format(item.receivingReport?.receivedRefDate),
							item.receivingReport?.receivedOffice?.officeDescription,
							item.receivingReport?.supplier?.supplierFullname,
							item.item.descLong,
							item.item?.item_category?.categoryDescription,
							item.receiveUnitCost.round(2),
							item.receiveDiscountCost.round(2),
							item.receiveQty,
							item.inputTax.round(2),
							item.totalAmount.round(2),
							item.netAmount.round(2)
					)
			}

			LinkedMultiValueMap<String, String> extHeaders = new LinkedMultiValueMap<>()
			extHeaders.add("Content-Disposition", "inline;filename=SRR-Item-Report.csv")

			return new ResponseEntity(String.valueOf(buffer).getBytes(), extHeaders, HttpStatus.OK)
		}
		catch (e) {
			throw e
		}

	}

	@RequestMapping(method = RequestMethod.GET, value = ["/api/charged/report"])
	ResponseEntity<AnyDocument.Any> downloadChargedReport(
			@RequestParam String start,
			@RequestParam String end,
			@RequestParam String filter
	) {

		def itemList = inventoryLedgerService.chargedItems(start, end, filter)
		StringBuffer buffer = new StringBuffer()

		DateTimeFormatter formatter =
				DateTimeFormatter.ofPattern("MM/dd/yyyy").withZone(ZoneId.systemDefault())
		CSVPrinter csvPrinter = new CSVPrinter(buffer, CSVFormat.POSTGRESQL_CSV
				.withHeader("TRANSACTION DATE", "REFERENCE NO", "DESCRIPTION", "TRANSACTION TYPE", "QTY", "UNIT COST", "TOTAL AMOUNT"))

		try {
			itemList.each {
				item ->
					csvPrinter.printRecord(
							item.transDate,
							item.refNo,
							item.description,
							item.transType,
							item.qty,
							item.unitCost.round(2),
							item.totalAmount.round(2)
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

	List<DashboardDto> projectCountByStatus() {
		String sql = "select p.status, count(p) as value from projects.projects p group by p.status;"
		List<DashboardDto> items = jdbcTemplate.query(sql, new BeanPropertyRowMapper(DashboardDto.class))
		return items
	}

}
