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
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
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

	private static final UUID EXPENSE_DOCUMENT_TYPE_ID = UUID.fromString("0f3c2b76-445a-4f78-a256-21656bd62872")
	private static final String ASSET_REPAIR_REFERENCE_PREFIX = "ARM-"

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
	NamedParameterJdbcTemplate namedParameterJdbcTemplate

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

	private static String assetRepairMaintenanceReference(UUID repairItemId) {
		return ASSET_REPAIR_REFERENCE_PREFIX + repairItemId.toString()
	}

	boolean hasAssetRepairMaintenanceLedger(UUID repairItemId) {
		return getLedgerByRef(assetRepairMaintenanceReference(repairItemId)).find() != null
	}

	/**
	 * Records material consumed by an asset repair. The office-item row is locked
	 * before reading on-hand so simultaneous requests cannot consume the same stock.
	 */
	@Transactional
	InventoryLedger upsertAssetRepairMaintenanceLedger(
			UUID repairItemId,
			UUID officeId,
			Item item,
			BigDecimal quantity,
			BigDecimal unitCost
	) {
		UUID company = SecurityUtils.currentCompanyId()
		String reference = assetRepairMaintenanceReference(repairItemId)
		InventoryLedger ledger = getLedgerByRef(reference).find()

		if (quantity == null || quantity.compareTo(BigDecimal.ZERO) <= 0) {
			throw new IllegalArgumentException("Material quantity must be greater than zero.")
		}

		Office sourceOffice = ledger?.sourceOffice
		if (sourceOffice == null && officeId != null) {
			sourceOffice = officeRepository.findById(officeId).orElse(null)
		}
		if (sourceOffice == null) {
			throw new IllegalArgumentException("A source office is required for repair materials.")
		}
		if (sourceOffice.company?.id != company) {
			throw new IllegalArgumentException("The selected source office is not available for this company.")
		}
		if (item == null || item.company != company) {
			throw new IllegalArgumentException("The selected inventory item is not available for this company.")
		}
		if (ledger?.item != null && ledger.item.id != item.id) {
			throw new IllegalArgumentException("The inventory item of an existing repair material cannot be changed.")
		}

		Map<String, Object> params = new HashMap<>()
		params.put("office", sourceOffice.id)
		params.put("item", item.id)
		params.put("company", company)

		String lockQuery = '''
			SELECT id
			FROM inventory.office_item
			WHERE office = :office
			  AND item = :item
			  AND company = :company
			  AND is_assign = true
			FOR UPDATE'''
		List<Map<String, Object>> assignedItems = namedParameterJdbcTemplate.queryForList(lockQuery, params)
		if (assignedItems.isEmpty()) {
			throw new IllegalArgumentException("The selected item is not assigned to the source office.")
		}

		String onHandQuery = '''
			SELECT COALESCE(SUM(ledger_qty_in - ledger_qty_out), 0)
			FROM inventory.inventory_ledger
			WHERE source_office = :office
			  AND item = :item
			  AND is_include = true'''
		BigDecimal onHand = namedParameterJdbcTemplate.queryForObject(onHandQuery, params, BigDecimal.class) ?: BigDecimal.ZERO
		BigDecimal previouslyIssued = ledger?.ledgerQtyOut ?: BigDecimal.ZERO
		BigDecimal available = onHand.add(previouslyIssued)

		if (quantity.compareTo(available) > 0) {
			throw new IllegalArgumentException(
					"Insufficient inventory for ${item.descLong}. Available quantity: ${available.stripTrailingZeros().toPlainString()}."
			)
		}

		if (ledger == null) {
			ledger = new InventoryLedger()
			ledger.referenceNo = reference
			ledger.ledgerDate = Instant.now()
		}
		ledger.sourceOffice = sourceOffice
		ledger.destinationOffice = sourceOffice
		ledger.documentTypes = documentTypeRepository.findById(EXPENSE_DOCUMENT_TYPE_ID).get()
		ledger.item = item
		ledger.ledgerQtyIn = BigDecimal.ZERO
		ledger.ledgerQtyOut = quantity
		ledger.ledgerPhysical = BigDecimal.ZERO
		ledger.ledgerUnitCost = unitCost != null ? unitCost : (inventoryResource.getLastWcost(item.id.toString()) ?: BigDecimal.ZERO)
		ledger.isInclude = true
		ledger.company = company

		return save(ledger)
	}

	@Transactional
	InventoryLedger voidAssetRepairMaintenanceLedger(UUID repairItemId) {
		return voidLedgerByRef(assetRepairMaintenanceReference(repairItemId))
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
		BigDecimal unit_cost = BigDecimal.ZERO
		BigDecimal qty = BigDecimal.ZERO
		items.each {
			it->

				if(it.documentTypes.documentCode.equalsIgnoreCase('RCS')){
					unit_cost = it.ledgerUnitCost.negate()
					qty = it.ledgerQtyIn.negate()
				}else{
					unit_cost = it.ledgerUnitCost
					qty = it.ledgerQtyOut
				}
				BigDecimal total = qty.multiply(it.ledgerUnitCost)
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
				upsert.ledgerQtyOut = BigDecimal.ZERO
				upsert.ledgerPhysical = BigDecimal.ZERO
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
	@GraphQLMutation(name = "postInventoryLedgerRecNew")
	InventoryLedger postInventoryLedgerRecNew(
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
				upsert.ledgerQtyOut = BigDecimal.ZERO
				upsert.ledgerPhysical = BigDecimal.ZERO
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
				upsert.ledgerQtyIn = BigDecimal.ZERO
				upsert.ledgerQtyOut = it.qty
				upsert.ledgerPhysical = BigDecimal.ZERO
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
	@GraphQLMutation(name = "postInventoryLedgerReturnNew")
	InventoryLedger postInventoryLedgerReturnNew(
			@GraphQLArgument(name = "items") ArrayList<Map<String, Object>> items
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
				upsert.ledgerQtyIn = BigDecimal.ZERO
				upsert.ledgerQtyOut = it.qty
				upsert.ledgerPhysical = BigDecimal.ZERO
				upsert.ledgerUnitCost = it.unitcost
				upsert.isInclude = true
				upsert.company = company
				save(upsert)

				//update returns Item
				returnSupplierItemsService.updateRtsItemStatus(UUID.fromString(it.id), true)


		}
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
				upsert.ledgerQtyIn = it.type.equalsIgnoreCase("STI") ? it.qty : BigDecimal.ZERO
				upsert.ledgerQtyOut = it.type.equalsIgnoreCase("STO") || it.type.equalsIgnoreCase("EX") ? it.qty : BigDecimal.ZERO
				upsert.ledgerPhysical = BigDecimal.ZERO
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
	@GraphQLMutation(name = "postInventoryLedgerIssuanceNew")
	InventoryLedger postInventoryLedgerIssuanceNew(
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
				upsert.ledgerQtyIn = it.type.equalsIgnoreCase("STI") ? it.qty : BigDecimal.ZERO
				upsert.ledgerQtyOut = it.type.equalsIgnoreCase("STO") || it.type.equalsIgnoreCase("EX") ? it.qty : BigDecimal.ZERO
				upsert.ledgerPhysical = BigDecimal.ZERO
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
				upsert.ledgerQtyIn = it.type.equalsIgnoreCase("MPO") ? it.qty : BigDecimal.ZERO
				upsert.ledgerQtyOut = it.type.equalsIgnoreCase("MPS") ? it.qty : BigDecimal.ZERO
				upsert.ledgerPhysical = BigDecimal.ZERO
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
		upsert.ledgerQtyOut = BigDecimal.ZERO
		upsert.ledgerPhysical = BigDecimal.ZERO
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
		upsert.ledgerQtyOut = BigDecimal.ZERO
		upsert.ledgerPhysical = BigDecimal.ZERO
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
			BigDecimal qty,
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
		inv.ledgerQtyIn = type.equalsIgnoreCase('rcs') || type.equalsIgnoreCase('return') ? qty : BigDecimal.ZERO
		inv.ledgerQtyOut = type.equalsIgnoreCase('cs') ? qty : BigDecimal.ZERO
		inv.ledgerPhysical = BigDecimal.ZERO
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
			BigDecimal quantity = it.qty.multiply(BigDecimal.valueOf(serviceQty.longValue()))

			inv = new InventoryLedger()
			inv.sourceOffice = officeRepository.findById(office).get()
			inv.destinationOffice = officeRepository.findById(office).get()
			inv.documentTypes = documentTypeRepository.findById(UUID.fromString(typeId)).get()
			inv.item = it.item
			inv.referenceNo = reference_no
			inv.ledgerDate = Instant.now()
			inv.ledgerQtyIn = BigDecimal.ZERO
			inv.ledgerQtyOut = quantity
			inv.ledgerPhysical = BigDecimal.ZERO
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
			@GraphQLArgument(name = "qty") BigDecimal qty,
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
		upsert.ledgerQtyIn = BigDecimal.ZERO
		upsert.ledgerQtyOut = qty
		upsert.ledgerPhysical = BigDecimal.ZERO
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
			@GraphQLArgument(name = "qty") BigDecimal qty
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
