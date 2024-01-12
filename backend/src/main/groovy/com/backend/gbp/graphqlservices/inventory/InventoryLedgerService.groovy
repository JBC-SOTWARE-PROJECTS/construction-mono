package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.Office
import com.backend.gbp.domain.inventory.BeginningBalance
import com.backend.gbp.domain.inventory.DocumentTypes
import com.backend.gbp.domain.inventory.InventoryLedger
import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.domain.inventory.PODeliveryMonitoring
import com.backend.gbp.domain.inventory.PurchaseOrderItems
import com.backend.gbp.domain.inventory.QuantityAdjustment
import com.backend.gbp.domain.projects.Projects
import com.backend.gbp.domain.services.ServiceItems
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.projects.ProjectUpdatesMaterialService
import com.backend.gbp.graphqlservices.services.ServiceItemsService
import com.backend.gbp.repository.OfficeRepository
import com.backend.gbp.repository.UserRepository
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.repository.inventory.DocumentTypeRepository
import com.backend.gbp.repository.inventory.QuantityAdjustmentRepository
import com.backend.gbp.rest.InventoryResource
import com.backend.gbp.rest.dto.ChargeItemsDto
import com.backend.gbp.rest.dto.LedgerDto
import com.backend.gbp.rest.dto.OnHandReport
import com.backend.gbp.rest.dto.POMonitoringDto
import com.backend.gbp.rest.dto.PostDto
import com.backend.gbp.rest.dto.PostLedgerDto
import com.backend.gbp.rest.dto.StockCard
import com.backend.gbp.security.SecurityUtils
import com.backend.gbp.services.GeneratorService
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

import java.time.Duration
import java.time.Instant
import java.time.LocalDateTime
import java.time.LocalTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter

@Component
@GraphQLApi
@TypeChecked
class InventoryLedgerService extends AbstractDaoService<InventoryLedger> {

	InventoryLedgerService() {
		super(InventoryLedger.class)
	}

	@Autowired
	ObjectMapper objectMapper

	@Autowired
	GeneratorService generatorService

	@Autowired
	UserRepository userRepository

	@Autowired
	EmployeeRepository employeeRepository

	@Autowired
	PurchaseOrderItemService purchaseOrderItemService

	@Autowired
	ReceivingReportService receivingReportService

	@Autowired
	ReceivingReportItemService receivingReportItemService

	@Autowired
	DocumentTypeRepository documentTypeRepository

	@Autowired
	PODeliveryMonitoringService poDeliveryMonitoringService

	@Autowired
	PurchaseOrderService purchaseOrderService

	@Autowired
	ItemService itemService

	@Autowired
	ReturnSupplierItemsService returnSupplierItemsService

	@Autowired
	ReturnSupplierService returnSupplierService

	@Autowired
	StockIssuanceService stockIssuanceService

	@Autowired
	StockIssueItemsService stockIssueItemsService

	@Autowired
	MaterialProductionService materialProductionService

	@Autowired
	MaterialProductionItemsService materialProductionItemsService

	@Autowired
	OfficeRepository officeRepository

	@Autowired
	InventoryResource inventoryResource

	@Autowired
	ServiceItemsService serviceItemsService

	@Autowired
	ProjectUpdatesMaterialService projectMaterialService

	@GraphQLQuery(name = "getLedgerByRef")
	List<InventoryLedger> getLedgerByRef(
			@GraphQLArgument(name = "ref") String ref
	) {
		def company = SecurityUtils.currentCompanyId()
		String query = '''Select e from InventoryLedger e where e.referenceNo = :ref and e.company = :company'''
		Map<String, Object> params = new HashMap<>()
		params.put('ref', ref)
		params.put('company', company)
		createQuery(query, params).resultList.sort { it.item.descLong }
	}

	@GraphQLQuery(name = "stockCard", description = "List of Stock Card")
	List<StockCard> getStockCard(
			@GraphQLArgument(name = "itemId") String item,
			@GraphQLArgument(name = "office") String office
	) {
		if (item && office) {
			return inventoryResource.getLedger(item, office)
		} else {
			return null
		}
	}

	@GraphQLQuery(name = "getLegerByDoc")
	List<InventoryLedger> getLegerByDoc(
			@GraphQLArgument(name = "id") List<UUID> id,
			@GraphQLArgument(name = "dateStart") String dateStart,
			@GraphQLArgument(name = "dateEnd") String dateEnd,
			@GraphQLArgument(name = "filter") String filter
	){
		def company = SecurityUtils.currentCompanyId()

		String query = '''Select inv from InventoryLedger inv where inv.documentTypes.id IN (:id) and inv.isInclude = true 
and to_date(to_char(inv.ledgerDate, 'YYYY-MM-DD'),'YYYY-MM-DD') between to_date(:dateStart,'YYYY-MM-DD') and  to_date(:dateEnd,'YYYY-MM-DD')
and lower(inv.item.descLong) like lower(concat('%',:filter,'%')) and inv.company = :company'''
		Map<String, Object> params = new HashMap<>()
		params.put('id', id)
		params.put('dateStart', dateStart)
		params.put('dateEnd', dateEnd)
		params.put('filter', filter)
		params.put('company', company)
		createQuery(query, params).resultList.sort { it.ledgerDate }
	}

	@GraphQLQuery(name = "chargedItems", description = "List of Charged Items")
	List<ChargeItemsDto> chargedItems(@GraphQLArgument(name = "start") String start,
									  @GraphQLArgument(name = "end") String end,
									  @GraphQLArgument(name = "filter") String filter) {

		def uuids = new ArrayList<UUID>()
		uuids.add(UUID.fromString("19c0c388-7e85-4abf-aa13-cdafecf8dc8c"));
		uuids.add(UUID.fromString("5776d7f2-6972-4980-a0ef-360642ee7572"));

		def items = this.getLegerByDoc(uuids, start, end, filter)
		def result = new ArrayList<ChargeItemsDto>()
		def unit_cost = BigDecimal.ZERO;def qty = 0;
		items.each {
			it->

				if(it.documentTypes.documentCode.equalsIgnoreCase('RCS')){
					unit_cost = it.ledgerUnitCost * -1;
					qty = it.ledgerQtyIn * -1;
				}else{
					unit_cost = it.ledgerUnitCost
					qty = it.ledgerQtyOut;
				}
				def total = qty * it.ledgerUnitCost;
				def res = new ChargeItemsDto(
						id: it.id,
						transDate: it.ledgerDate,
						refNo: it.referenceNo,
						description: it.item?.descLong,
						transType: it.documentTypes?.documentDescription,
						qty: qty,
						unitCost: unit_cost,
						totalAmount: total
				)
				result.add(res)
		}
		return result
	}

	@GraphQLQuery(name = "onHandReport")
	List<OnHandReport> onHandReport(
			@GraphQLArgument(name = "office") UUID office,
			@GraphQLArgument(name = "date") String date,
			@GraphQLArgument(name = "filter") String filter) {
		if (office && date) {
			return inventoryResource.getOnHandReport(date, office.toString(), filter)
		} else {
			return null
		}
	}

	// ========= Mutation =====/
	@Transactional
	@GraphQLMutation(name = "postInventoryLedgerRec")
	InventoryLedger postInventoryLedgerRec(
			@GraphQLArgument(name = "items") ArrayList<Map<String, Object>> items,
			@GraphQLArgument(name = "parentId") UUID parentId
	) {
		def company = SecurityUtils.currentCompanyId()
		def upsert = new InventoryLedger()
		def postItems = items as ArrayList<PostLedgerDto>
		postItems.each {
			it ->
				upsert = new InventoryLedger()
				def source = objectMapper.convertValue(it.source, Office.class)
				def dest = objectMapper.convertValue(it.destination, Office.class)

				upsert.sourceOffice = source
				upsert.destinationOffice = dest
				upsert.documentTypes = documentTypeRepository.findById(UUID.fromString(it.typeId)).get()
				upsert.item = itemService.itemById(UUID.fromString(it.itemId))
				upsert.referenceNo = it.ledgerNo
				upsert.ledgerDate = Instant.parse(it.date)
				upsert.ledgerQtyIn = it.qty
				upsert.ledgerQtyOut = 0
				upsert.ledgerPhysical = 0
				upsert.ledgerUnitCost = it.unitcost
				upsert.isInclude = true
				upsert.company = company
				save(upsert)

				//update receiving Item
				receivingReportItemService.updateRecItemStatus(UUID.fromString(it.id), true)

				//insert sa PO Monitoring
				if (it.poItem != null) {
					def mon = new POMonitoringDto(
							purchaseOrderItem: UUID.fromString(it.poItem),
							receivingReport: parentId,
							receivingReportItem: UUID.fromString(it.id),
							quantity: it.qty,
							status: it.isPartial ? "PARTIAL DELIVERED" : "DELIVERED",
					)
					poDeliveryMonitoringService.upsertPOMonitoring(mon, null)

					//link po item into receiving id
					def parentRec = receivingReportService.recById(parentId)
					purchaseOrderItemService.linkPOItemRec(UUID.fromString(it.poItem), parentRec)

				}

		}
		//update parent
		receivingReportService.updateRECStatus(true, parentId)
		return upsert
	}

	@Transactional
	@GraphQLMutation(name = "postInventoryLedgerReturn")
	InventoryLedger postInventoryLedgerReturn(
			@GraphQLArgument(name = "items") ArrayList<Map<String, Object>> items,
			@GraphQLArgument(name = "parentId") UUID parentId
	) {
		def company = SecurityUtils.currentCompanyId()
		def upsert = new InventoryLedger()
		def postItems = items as ArrayList<PostDto>
		postItems.each {
			it ->
				//insert
				upsert = new InventoryLedger()
				def source = objectMapper.convertValue(it.source, Office.class)
				def dest = objectMapper.convertValue(it.destination, Office.class)

				upsert.sourceOffice = source
				upsert.destinationOffice = dest
				upsert.documentTypes = documentTypeRepository.findById(UUID.fromString(it.typeId)).get()
				upsert.item = itemService.itemById(UUID.fromString(it.itemId))
				upsert.referenceNo = it.ledgerNo
				upsert.ledgerDate = Instant.parse(it.date)
				upsert.ledgerQtyIn = 0
				upsert.ledgerQtyOut = it.qty
				upsert.ledgerPhysical = 0
				upsert.ledgerUnitCost = it.unitcost
				upsert.isInclude = true
				upsert.company = company
				save(upsert)

				//update returns Item
				returnSupplierItemsService.updateRtsItemStatus(UUID.fromString(it.id), true)


		}
		//update parent
		returnSupplierService.updateRTSStatus(true, parentId)
		return upsert
	}

	@Transactional
	@GraphQLMutation(name = "postInventoryLedgerIssuance")
	InventoryLedger postInventoryLedgerIssuance(
			@GraphQLArgument(name = "items") ArrayList<Map<String, Object>> items,
			@GraphQLArgument(name = "parentId") UUID parentId
	) {
		def company = SecurityUtils.currentCompanyId()
		def upsert = new InventoryLedger()
		def postItems = items as ArrayList<PostDto>
		def parent = stockIssuanceService.stiById(parentId)
		postItems.each {
			it ->
				//insert
				upsert = new InventoryLedger()
				def source = objectMapper.convertValue(it.source, Office.class)
				def dest = objectMapper.convertValue(it.destination, Office.class)
				def item = itemService.itemById(UUID.fromString(it.itemId))
				def doctype = documentTypeRepository.findById(UUID.fromString(it.typeId)).get()
				upsert.sourceOffice = source
				upsert.destinationOffice = dest
				upsert.documentTypes = doctype
				upsert.item = item
				upsert.referenceNo = it.ledgerNo
				upsert.ledgerDate = Instant.parse(it.date)
				upsert.ledgerQtyIn = it.type.equalsIgnoreCase("STI") ? it.qty : 0
				upsert.ledgerQtyOut = it.type.equalsIgnoreCase("STO") || it.type.equalsIgnoreCase("EX") ? it.qty : 0
				upsert.ledgerPhysical = 0
				upsert.ledgerUnitCost = it.unitcost
				upsert.isInclude = true
				upsert.company = company
				def afterSave = save(upsert)

				//update issuance Item
				stockIssueItemsService.updateStiItemStatus(UUID.fromString(it.id), true)

				//insert direct to materials expense in project
				if(doctype.documentCode.equalsIgnoreCase("EX")){
					if(parent.project){
						projectMaterialService.directExpenseMaterials(item,
								parent.project,
								it.qty,
								it.unitcost,
								afterSave.id)
					}
				}

		}
		//update parent
		stockIssuanceService.updateSTIStatus(true, parentId)

		return upsert
	}

	@Transactional
	@GraphQLMutation(name = "postInventoryLedgerMaterial")
	InventoryLedger postInventoryLedgerMaterial(
			@GraphQLArgument(name = "items") ArrayList<Map<String, Object>> items,
			@GraphQLArgument(name = "parentId") UUID parentId
	) {
		def company = SecurityUtils.currentCompanyId()
		def upsert = new InventoryLedger()
		def postItems = items as ArrayList<PostDto>
		postItems.each {
			it ->
				//insert
				upsert = new InventoryLedger()
				def source = objectMapper.convertValue(it.source, Office.class)
				def dest = objectMapper.convertValue(it.destination, Office.class)

				upsert.sourceOffice = source
				upsert.destinationOffice = dest
				upsert.documentTypes = documentTypeRepository.findById(UUID.fromString(it.typeId)).get()
				upsert.item = itemService.itemById(UUID.fromString(it.itemId))
				upsert.referenceNo = it.ledgerNo
				upsert.ledgerDate = Instant.parse(it.date)
				upsert.ledgerQtyIn = it.type.equalsIgnoreCase("MPO") ? it.qty : 0
				upsert.ledgerQtyOut = it.type.equalsIgnoreCase("MPS") ? it.qty : 0
				upsert.ledgerPhysical = 0
				upsert.ledgerUnitCost = it.unitcost
				upsert.isInclude = true
				upsert.company = company
				save(upsert)

				//update mp Item
				materialProductionItemsService.updateMpItemStatus(UUID.fromString(it.id), true)

		}
		//update parent
		materialProductionService.updateMPStatus(true, parentId)
		return upsert
	}

	@Transactional
	@GraphQLMutation(name = "postInventoryLedgerQtyAdjustment")
	InventoryLedger postInventoryLedgerQtyAdjustment(
			@GraphQLArgument(name = "it") QuantityAdjustment it
	) {
		def company = SecurityUtils.currentCompanyId()
		def upsert = new InventoryLedger()

		//insert
		upsert.sourceOffice = it.office
		upsert.destinationOffice = it.office
		upsert.documentTypes = documentTypeRepository.findById(UUID.fromString("4f88d8d7-ecce-4538-a97b-88884b1e106e")).get()
		upsert.item = itemService.itemById(it.item.id)
		upsert.referenceNo = it.refNum
		upsert.ledgerDate = it.dateTrans
		upsert.ledgerQtyIn = it.quantity
		upsert.ledgerQtyOut = 0
		upsert.ledgerPhysical = 0
		upsert.ledgerUnitCost = it.unit_cost
		upsert.isInclude = true
		upsert.company = company

		save(upsert)

		return upsert
	}

	@Transactional
	@GraphQLMutation(name = "postInventoryLedgerBegBalance")
	InventoryLedger postInventoryLedgerBegBalance(
			@GraphQLArgument(name = "it") BeginningBalance it
	) {
		def company = SecurityUtils.currentCompanyId()
		def upsert = new InventoryLedger()

		//insert
		upsert.sourceOffice = it.office
		upsert.destinationOffice = it.office
		upsert.documentTypes = documentTypeRepository.findById(UUID.fromString("0caab388-e53b-4e94-b2ea-f8cc47df6431")).get()
		upsert.item = itemService.itemById(it.item.id)
		upsert.referenceNo = it.refNum
		upsert.ledgerDate = it.dateTrans
		upsert.ledgerQtyIn = it.quantity
		upsert.ledgerQtyOut = 0
		upsert.ledgerPhysical = 0
		upsert.ledgerUnitCost = it.unitCost
		upsert.isInclude = true
		upsert.company = company
		save(upsert)

		return upsert
	}

	@Transactional
	InventoryLedger inventoryCharge(
			UUID office,
			UUID itemId,
			String reference_no,
			String type,
			Integer qty,
			BigDecimal wcost
	) {
		def company = SecurityUtils.currentCompanyId()
		String typeId = "19c0c388-7e85-4abf-aa13-cdafecf8dc8c"
		if (type.equalsIgnoreCase('rcs')) {
			typeId = '5776d7f2-6972-4980-a0ef-360642ee7572'
		} else if (type.equalsIgnoreCase('cs')) {
			typeId = '19c0c388-7e85-4abf-aa13-cdafecf8dc8c'
		} else if (type.equalsIgnoreCase('return')) {
			typeId = '0702930b-a1ec-4f64-be6a-7f656ac4c300'
		}

		def inv = new InventoryLedger()

		inv.sourceOffice = officeRepository.findById(office).get()
		inv.destinationOffice = officeRepository.findById(office).get()
		inv.documentTypes = documentTypeRepository.findById(UUID.fromString(typeId)).get()
		inv.item = itemService.itemById(itemId)
		inv.referenceNo = reference_no
		inv.ledgerDate = Instant.now()
		inv.ledgerQtyIn = type.equalsIgnoreCase('rcs') || type.equalsIgnoreCase('return') ? qty : 0
		inv.ledgerQtyOut = type.equalsIgnoreCase('cs') ? qty : 0
		inv.ledgerPhysical = 0
		inv.ledgerUnitCost = wcost
		inv.isInclude = true
		inv.company = company
		save(inv)

	}

	@Transactional
	InventoryLedger serviceBundle(
			UUID office,
			UUID service,
			Integer serviceQty,
			String reference_no
	) {
		def company = SecurityUtils.currentCompanyId()
		String typeId = "c17eb9d9-c0bd-432b-987e-b3c89edecab8"
		def inv = new InventoryLedger()
		def serviceItems = serviceItemsService.serviceItemByParentId(service)

		serviceItems.each {
			def quantity = serviceQty * it.qty

			inv = new InventoryLedger()
			inv.sourceOffice = officeRepository.findById(office).get()
			inv.destinationOffice = officeRepository.findById(office).get()
			inv.documentTypes = documentTypeRepository.findById(UUID.fromString(typeId)).get()
			inv.item = it.item
			inv.referenceNo = reference_no
			inv.ledgerDate = Instant.now()
			inv.ledgerQtyIn = 0
			inv.ledgerQtyOut = quantity
			inv.ledgerPhysical = 0
			inv.ledgerUnitCost = it.wcost
			inv.isInclude = true
			inv.company = company
			save(inv)
		}

		return inv

	}

	@Transactional
	@GraphQLMutation(name = "voidLedgerByRef")
	InventoryLedger voidLedgerByRef(
			@GraphQLArgument(name = "ref") String ref
	) {
		def items = this.getLedgerByRef(ref)
		def upsert = new InventoryLedger()
		items.each {
			upsert = it
			delete(upsert)
		}
		return upsert
	}

	@Transactional
	@GraphQLMutation(name = "voidLedgerByRefExpense")
	InventoryLedger voidLedgerByRefExpense(
			@GraphQLArgument(name = "ref") String ref
	) {
		def items = this.getLedgerByRef(ref)
		def upsert = new InventoryLedger()
		items.each {
			upsert = it

			//delete material direct expense
			if(it.documentTypes.documentCode.equalsIgnoreCase("EX")){
				projectMaterialService.removedMaterialDirectExpense(it.id)
			}


			delete(upsert)
		}
		return upsert
	}

	@Transactional
	@GraphQLMutation(name = "expenseItemFromProjects")
	InventoryLedger expenseItemFromProjects(
			@GraphQLArgument(name = "it") Projects it,
			@GraphQLArgument(name = "item") Item item,
			@GraphQLArgument(name = "qty") Integer qty,
			@GraphQLArgument(name = "cost") BigDecimal cost
	) {
		def company = SecurityUtils.currentCompanyId()
		def upsert = new InventoryLedger()

		//insert 0f3c2b76-445a-4f78-a256-21656bd62872 -- EXPENSE DOC TYPES
		upsert.sourceOffice = it.location
		upsert.destinationOffice = it.location
		upsert.documentTypes = documentTypeRepository.findById(UUID.fromString("0f3c2b76-445a-4f78-a256-21656bd62872")).get()
		upsert.item = item
		upsert.referenceNo = it.projectCode
		upsert.ledgerDate = Instant.now()
		upsert.ledgerQtyIn = 0
		upsert.ledgerQtyOut = qty
		upsert.ledgerPhysical = 0
		upsert.ledgerUnitCost = cost
		upsert.isInclude = true
		upsert.company = company
		save(upsert)

		return upsert
	}

	@Transactional
	@GraphQLMutation(name = "editExpenseItemFromProjects")
	InventoryLedger editExpenseItemFromProjects(
			@GraphQLArgument(name = "id") UUID id,
			@GraphQLArgument(name = "qty") Integer qty
	) {
		if(id){
			def upsert = findOne(id)
			upsert.ledgerQtyOut = qty
			def afterSave = save(upsert)
			return afterSave
		}
		return null
	}

	@Transactional
	@GraphQLMutation(name = "voidLedgerById")
	InventoryLedger voidLedgerById(
			@GraphQLArgument(name = "id") UUID id
	) {
		def one = findOne(id)
		delete(one)
		return one
	}

	@Transactional
	@GraphQLMutation(name = "postInventoryGlobal")
	InventoryLedger postInventoryGlobal(
			@GraphQLArgument(name = "items") LedgerDto it
	) {
		def company = SecurityUtils.currentCompanyId()
		def upsert = new InventoryLedger()
		upsert.sourceOffice = it.sourceOffice
		upsert.destinationOffice = it.destinationOffice
		upsert.documentTypes = documentTypeRepository.findById(it.documentTypes).get()
		upsert.item = itemService.itemById(it.item)
		upsert.referenceNo = it.referenceNo
		upsert.ledgerDate = it.ledgerDate
		upsert.ledgerQtyIn = it.ledgerQtyIn
		upsert.ledgerQtyOut = it.ledgerQtyOut
		upsert.ledgerPhysical = it.ledgerPhysical
		upsert.ledgerUnitCost = it.ledgerUnitCost
		upsert.isInclude = true
		upsert.company = company
		def afterSave = save(upsert)
		return afterSave
	}

}
