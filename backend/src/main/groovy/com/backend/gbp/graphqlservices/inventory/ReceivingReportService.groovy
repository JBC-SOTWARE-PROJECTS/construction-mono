package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.accounting.Integration
import com.backend.gbp.domain.accounting.IntegrationDomainEnum
import com.backend.gbp.domain.accounting.IntegrationItem
import com.backend.gbp.domain.accounting.JournalType
import com.backend.gbp.domain.accounting.Ledger
import com.backend.gbp.domain.accounting.LedgerDocType
import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.domain.inventory.ItemSubAccount
import com.backend.gbp.domain.inventory.PurchaseOrderItems
import com.backend.gbp.domain.inventory.ReceivingReport
import com.backend.gbp.domain.inventory.ReceivingReportItem
import com.backend.gbp.domain.inventory.ReturnSupplier
import com.backend.gbp.graphqlservices.accounting.IntegrationServices
import com.backend.gbp.graphqlservices.accounting.LedgerServices
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.rest.dto.PurchaseRecDto
import com.backend.gbp.rest.dto.ReceivingAmountDto
import com.backend.gbp.rest.dto.journal.JournalEntryViewDto
import com.backend.gbp.rest.dto.payables.ApReferenceDto
import com.backend.gbp.security.SecurityUtils
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.GeneratorType
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.BooleanUtils
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Component

import javax.transaction.Transactional
import java.math.RoundingMode
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter

@Component
@GraphQLApi
@TypeChecked
class ReceivingReportService extends AbstractDaoService<ReceivingReport> {

    ReceivingReportService() {
        super(ReceivingReport.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService

    @Autowired
    ReceivingReportItemService receivingReportItemService

    @Autowired
    PurchaseRequestItemService purchaseRequestItemService

    @Autowired
    PurchaseOrderService purchaseOrderService

    @Autowired
    InventoryLedgerService inventoryLedgerService

    @Autowired
    PODeliveryMonitoringService poDeliveryMonitoringService

    @Autowired
    NamedParameterJdbcTemplate namedParameterJdbcTemplate

    @Autowired
    IntegrationServices integrationServices

    @Autowired
    LedgerServices ledgerServices


    @GraphQLQuery(name = "recById")
    ReceivingReport recById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            findOne(id)
        }else{
            null
        }
    }

    @GraphQLQuery(name = "srrGetReferenceType")
    List<ApReferenceDto> srrGetReferenceType(){
        List<ApReferenceDto> records = []
        def company = SecurityUtils.currentCompanyId()
        String query = '''select distinct p.reference_type as reference_type from inventory.receiving_report p where p.reference_type is not null and p.company = :company'''
        Map<String, Object> params = new HashMap<>()
        params.put("params", company)
        def recordsRaw= namedParameterJdbcTemplate.queryForList(query, params)

        recordsRaw.each {
            records << new ApReferenceDto(
                    referenceType: StringUtils.upperCase( it.get("reference_type","") as String)
            )
        }

        return records
    }


    @GraphQLQuery(name = "recByFiltersPage")
	Page<ReceivingReport> recByFiltersPage(
			@GraphQLArgument(name = "filter") String filter,
			@GraphQLArgument(name = "office") UUID office,
            @GraphQLArgument(name = "start") String start,
            @GraphQLArgument(name = "end") String end,
            @GraphQLArgument(name = "supplier") UUID supplier,
			@GraphQLArgument(name = "page") Integer page,
			@GraphQLArgument(name = "size") Integer size
	) {

        def company = SecurityUtils.currentCompanyId()
		String query = '''Select r from ReceivingReport r where
						(lower(r.rrNo) like lower(concat('%',:filter,'%')) or
						lower(r.receivedRefNo) like lower(concat('%',:filter,'%')))
						and r.receivedOffice.id = :office and
						to_date(to_char(r.receiveDate, 'YYYY-MM-DD'),'YYYY-MM-DD')
             	        between to_date(:startDate,'YYYY-MM-DD') and  to_date(:endDate,'YYYY-MM-DD') '''

		String countQuery = '''Select count(r) from ReceivingReport r where
						(lower(r.rrNo) like lower(concat('%',:filter,'%')) or
						lower(r.receivedRefNo) like lower(concat('%',:filter,'%')))
						and r.receivedOffice.id = :office and
						to_date(to_char(r.receiveDate, 'YYYY-MM-DD'),'YYYY-MM-DD')
             	        between to_date(:startDate,'YYYY-MM-DD') and  to_date(:endDate,'YYYY-MM-DD') '''

		Map<String, Object> params = new HashMap<>()
		params.put('filter', filter)
        params.put('office', office)
        params.put('startDate', start)
        params.put('endDate', end)

        if (company) {
            query += ''' and (r.company = :company)'''
            countQuery += ''' and (r.company = :company)'''
            params.put("company", company)
        }

        if(supplier){
            query += ''' and (r.supplier.id = :supplier)'''
            countQuery += ''' and (r.supplier.id = :supplier)'''
            params.put('supplier', supplier)
        }


        query += ''' ORDER BY r.receiveDate DESC'''

		Page<ReceivingReport> result = getPageable(query, countQuery, page, size, params)
		return result
	}

    @GraphQLQuery(name = "recByFiltersPageNoDate")
    Page<ReceivingReport> recByFiltersPageNoDate(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "office") UUID office,
            @GraphQLArgument(name = "category") String category,
            @GraphQLArgument(name = "project") UUID project,
            @GraphQLArgument(name = "asset") UUID asset,
            @GraphQLArgument(name = "supplier") UUID supplier,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ) {

        def company = SecurityUtils.currentCompanyId()
        String query = '''Select r from ReceivingReport r where
						(lower(r.rrNo) like lower(concat('%',:filter,'%')) or
						lower(r.receivedRefNo) like lower(concat('%',:filter,'%'))) '''

        String countQuery = '''Select count(r) from ReceivingReport r where
						(lower(r.rrNo) like lower(concat('%',:filter,'%')) or
						lower(r.receivedRefNo) like lower(concat('%',:filter,'%'))) '''

        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)

        if(office){
            query += ''' and (r.receivedOffice.id = :office)''';
            countQuery += ''' and (r.receivedOffice.id = :office)''';
            params.put('office', office)
        }
        if (company) {
            query += ''' and (r.company = :company)'''
            countQuery += ''' and (r.company = :company)'''
            params.put("company", company)
        }
        if(category){
            query += ''' and (r.category = :category)''';
            countQuery += ''' and (r.category = :category)''';
            params.put('category', category)
        }
        if(project){
            query += ''' and (r.project.id = :project)''';
            countQuery += ''' and (r.project.id = :project)''';
            params.put('project', project)
        }
        if(asset){
            query += ''' and (r.assets.id = :asset)''';
            countQuery += ''' and (r.assets.id = :asset)''';
            params.put('asset', asset)
        }
        if(supplier){
            query += ''' and (r.supplier.id = :supplier)'''
            countQuery += ''' and (r.supplier.id = :supplier)'''
            params.put('supplier', supplier)
        }


        query += ''' ORDER BY r.receiveDate DESC'''

        Page<ReceivingReport> result = getPageable(query, countQuery, page, size, params)
        return result
    }

    @GraphQLQuery(name = "srrList")
    List<ReceivingReport> srrList() {
        def company = SecurityUtils.currentCompanyId()
        String query = '''Select e from ReceivingReport e where e.isPosted = :status and e.company = :company'''
        Map<String, Object> params = new HashMap<>()
        params.put('status', true)
        params.put('company', company)
        createQuery(query, params).resultList.sort { it.rrNo }
    }

    @GraphQLQuery(name = "getSrrByDateRange")
    List<ReceivingReport> getSrrByDateRange(
            @GraphQLArgument(name = "start") Instant start,
            @GraphQLArgument(name = "end") Instant end,
            @GraphQLArgument(name = "filter") String filter) {

        Instant fromDate = start.atZone(ZoneId.systemDefault()).toInstant()
        Instant toDate = end.atZone(ZoneId.systemDefault()).toInstant()
        def company = SecurityUtils.currentCompanyId()
        String query = '''Select s from ReceivingReport s
						where
						(s.isVoid = false or s.isVoid is null) AND
						s.receiveDate >= :startDate AND
						s.receiveDate <= :endDate AND
						(lower(s.rrNo) like lower(concat('%',:filter,'%')) OR
						lower(s.supplier.supplierFullname) like lower(concat('%',:filter,'%'))) and s.company = :company'''
        Map<String, Object> params = new HashMap<>()
        params.put('startDate', fromDate)
        params.put('endDate', toDate)
        params.put('filter', filter)
        params.put('company', company)
        createQuery(query, params).resultList.sort { it.receiveDate }
    }

    // ============== Mutation =======================//
    @Transactional
    @GraphQLMutation(name = "upsertRec")
    ReceivingReport upsertRec(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "items") ArrayList<Map<String, Object>> items,
            @GraphQLArgument(name = "id") UUID id
    ) {
        def company = SecurityUtils.currentCompanyId()
        def rr = upsertFromMap(id, fields, { ReceivingReport entity , boolean forInsert ->
            if(forInsert){
                def code = "SRR"

                entity.isPosted = false
                entity.isVoid = false

                if(entity.project?.id){
                    code = entity.project?.prefixShortName ?: "PJ"
                }else if(entity.assets?.id){
                    code = entity.assets?.prefix ?: "SP"
                }

                entity.rrNo = generatorService.getNextValue(GeneratorType.SRR_NO, {
                    return "${code}-" + StringUtils.leftPad(it.toString(), 6, "0")
                })
                entity.receivedType = code
                entity.company = company
            }
        })
        //items to be inserted
        def recItems = items as ArrayList<PurchaseRecDto>
        recItems.each {
            def item = objectMapper.convertValue(it.item, Item.class)
            def poItem = objectMapper.convertValue(it.refPoItem, PurchaseOrderItems.class)
            def con = objectMapper.convertValue(it, PurchaseRecDto.class)
            receivingReportItemService.upsertRecItem(con, item, poItem, rr)
        }
        return rr
    }

    @Transactional
    @GraphQLMutation(name = "upsertRecNew")
    ReceivingReport upsertRecNew(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "items") ArrayList<Map<String, Object>> items,
            @GraphQLArgument(name = "forRemove") ArrayList<Map<String, Object>> forRemove,
            @GraphQLArgument(name = "id") UUID id
    ) {
        def company = SecurityUtils.currentCompanyId()
        def rr = upsertFromMap(id, fields, { ReceivingReport entity , boolean forInsert ->
            if(forInsert){
                def code = "SRR"

                entity.isPosted = false
                entity.isVoid = false

                if(entity.project?.id){
                    code = entity.project?.prefixShortName ?: "PJ"
                }else if(entity.assets?.id){
                    code = entity.assets?.prefix ?: "SP"
                }

                entity.rrNo = generatorService.getNextValue(GeneratorType.SRR_NO, {
                    return "${code}-" + StringUtils.leftPad(it.toString(), 6, "0")
                })
                entity.receivedType = code
                entity.company = company
            }
        })
        //remove first
        def removeItems = forRemove as ArrayList<ReceivingReportItem>
        if(removeItems.size()){
            removeItems.each {
                def deleted = objectMapper.convertValue(it, ReceivingReportItem.class)
                receivingReportItemService.removeRecItemNoQuery(deleted)
            }
        }
        //items to be inserted
        def recItems = items as ArrayList<PurchaseRecDto>
        recItems.each {
            def item = objectMapper.convertValue(it.item, Item.class)
            def poItem = objectMapper.convertValue(it.refPoItem, PurchaseOrderItems.class)
            def con = objectMapper.convertValue(it, PurchaseRecDto.class)
            receivingReportItemService.upsertRecItem(con, item, poItem, rr)
        }

        return rr
    }

    @Transactional
    @GraphQLMutation(name = "updateRECStatus")
    ReceivingReport updateRECStatus(
            @GraphQLArgument(name = "status") Boolean status,
            @GraphQLArgument(name = "id") UUID id
    ) {
        def upsert = findOne(id)
        upsert.isPosted = status

        //do some magic here ...
        //update ledger
        if(!status){
            upsert.isVoid = status
            inventoryLedgerService.voidLedgerByRef(upsert.rrNo)
            //rec items
            def recItems = receivingReportItemService.recItemByParent(id)
            recItems.each {
                receivingReportItemService.updateRecItemStatus(it.id, status)
            }
            //po monitoring delete
            def poMon = poDeliveryMonitoringService.getPOMonitoringByRec(id)
            poMon.each {
                poDeliveryMonitoringService.delPOMonitoring(it.id)
            }
        }

        save(upsert)
    }

    @Transactional
    @GraphQLMutation(name = "redoReceiving")
    ReceivingReport redoReceiving(
            @GraphQLArgument(name = "id") UUID id
    ) {
        def upsert = findOne(id)
        upsert.isPosted = false
        upsert.isVoid = false
        save(upsert)
    }

    @GraphQLQuery(name = "receivingAccountView")
    List<JournalEntryViewDto> receivingAccountView(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "status") Boolean status
    ) {
        def result = new ArrayList<JournalEntryViewDto>()
        def parent =  findOne(id)
        def childrenList =  receivingReportItemService.recItemByParent(id)

        def flagValue = parent.account.flagValue

        if (parent.postedLedger) {
            def header = ledgerServices.findOne(parent.postedLedger)
            Set<Ledger> ledger = new HashSet<Ledger>(header.ledger);
            ledger.each {
                if(!status) {
                    //reverse entry if status is false for void
                    def list = new JournalEntryViewDto(
                            code: it.journalAccount.code,
                            desc: it.journalAccount.accountName,
                            debit: it.credit,
                            credit: it.debit
                    )
                    result.add(list)
                }else{
                    def list = new JournalEntryViewDto(
                            code: it.journalAccount.code,
                            desc: it.journalAccount.accountName,
                            debit: it.debit,
                            credit: it.credit
                    )
                    result.add(list)
                }
            }
        } else {
            if (flagValue) {
                Integration match = integrationServices.getIntegrationByDomainAndTagValue(IntegrationDomainEnum.RECEIVING_REPORT, flagValue)
                def headerLedger = integrationServices.generateAutoEntries(parent) {
                    it, mul ->
                        //NOTE: always round cost to Bankers Note HALF EVEN
                        it.flagValue = flagValue
                        BigDecimal payableAmount = BigDecimal.ZERO
                        //initialize
                        Map<String, List<ReceivingReport>> finalAcc  = [:]
                        match.integrationItems.findAll { BooleanUtils.isTrue(it.multiple) }.eachWithIndex { IntegrationItem entry, int i ->
                            if(!finalAcc.containsKey(entry.sourceColumn)){
                                finalAcc[entry.sourceColumn] = []
                            }
                        }
                        //loop items
                        Map<ItemSubAccount, BigDecimal> listItems  = [:]
                        childrenList.each { a ->
                            if(!listItems.containsKey(a.item.assetSubAccount)) {
                                listItems[a.item.assetSubAccount] = 0.0
                            }
                            listItems[a.item.assetSubAccount] =  listItems[a.item.assetSubAccount] + a.netAmount
                        }
                        // loop to final Accounts
                        listItems.each {k, v ->
                            if(v > 0){
                                finalAcc[k.sourceColumn] << new ReceivingReport().tap {
                                    it.itemSubAccount = k
                                    it[k.sourceColumn] = status ? v.setScale(2, RoundingMode.HALF_EVEN) : v.setScale(2, RoundingMode.HALF_EVEN) * -1
                                }
                            }
                        }
                        // ====================== loop multiples ========================
                        finalAcc.each { key, items ->
                            mul << items
                        }
                        // ====================== not multiple here =====================
                        it.payableAmount = status ? parent.amount : parent.amount * -1

                }

                Set<Ledger> ledger = new HashSet<Ledger>(headerLedger.ledger);
                ledger.each {
                    def list = new JournalEntryViewDto(
                            code: it.journalAccount.code,
                            desc: it.journalAccount.accountName,
                            debit: it.debit,
                            credit: it.credit
                    )
                    result.add(list)
                }
            }

        }
        return result.sort { it.credit }
    }

    @Transactional
    @GraphQLMutation(name = "receivingPostInventory")
    ReceivingReport receivingPostInventory(
            @GraphQLArgument(name = "status") Boolean status,
            @GraphQLArgument(name = "items") ArrayList<Map<String, Object>> items,
            @GraphQLArgument(name = "id") UUID id
    ) {
        def upsert = findOne(id)

        if(status){
            //ledger post
            inventoryLedgerService.postInventoryLedgerRecNew(items, upsert.id)
            //accounting post
            return postToLedgerAccounting(upsert)

        }else{
            upsert.isPosted = status
            upsert.isVoid = !status
            upsert.postedLedger = null
            upsert.postedBy = null

            if(upsert.postedLedger){
                def header = ledgerServices.findOne(upsert.postedLedger)
                ledgerServices.reverseEntriesCustom(header, upsert.receiveDate)
            }
            //ledger void
            inventoryLedgerService.voidLedgerByRef(upsert.rrNo)
            //rec items
            def recItems = receivingReportItemService.recItemByParent(id)
            recItems.each {
                receivingReportItemService.updateRecItemStatus(it.id, status)
            }
            //po monitoring delete
            def poMon = poDeliveryMonitoringService.getPOMonitoringByRec(id)
            poMon.each {
                poDeliveryMonitoringService.delPOMonitoring(it.id)
            }
        }

        save(upsert)
    }

    //accounting entries save
    ReceivingReport postToLedgerAccounting(ReceivingReport receivingReport) {
        def yearFormat = DateTimeFormatter.ofPattern("yyyy")
        def parent =  receivingReport
        def childrenList =  receivingReportItemService.recItemByParent(parent.id)
        def flagValue = parent.account.flagValue

        if (flagValue) {
            Integration match = integrationServices.getIntegrationByDomainAndTagValue(IntegrationDomainEnum.RECEIVING_REPORT, flagValue)
            def headerLedger = integrationServices.generateAutoEntries(parent) {
                it, mul ->
                    //NOTE: always round cost to Bankers Note HALF EVEN
                    it.flagValue = flagValue
                    //initialize
                    Map<String, List<ReceivingReport>> finalAcc  = [:]
                    match.integrationItems.findAll { BooleanUtils.isTrue(it.multiple) }.eachWithIndex { IntegrationItem entry, int i ->
                        if(!finalAcc.containsKey(entry.sourceColumn)){
                            finalAcc[entry.sourceColumn] = []
                        }
                    }
                    //loop items
                    Map<ItemSubAccount, BigDecimal> listItems  = [:]
                    childrenList.each { a ->
                        if(!listItems.containsKey(a.item.assetSubAccount)) {
                            listItems[a.item.assetSubAccount] = 0.0
                        }
                        listItems[a.item.assetSubAccount] =  listItems[a.item.assetSubAccount] + a.netAmount
                    }
                    // loop to final Accounts
                    listItems.each {k, v ->
                        if(v > 0){
                            finalAcc[k.sourceColumn] << new ReceivingReport().tap {
                                it.itemSubAccount = k
                                it[k.sourceColumn] = v.setScale(2, RoundingMode.HALF_EVEN)
                            }
                        }
                    }
                    // ====================== loop multiples ========================
                    finalAcc.each { key, items ->
                        mul << items
                    }
                    // ====================== not multiple here =====================
                    it.payableAmount = parent.amount
            }
            Map<String, String> details = [:]

            parent.details.each { k, v ->
                details[k] = v
            }

            details["TRANSACTION_ID"] = parent.id.toString()
            details["LOCATION_ID"] = parent.receivedOffice.id.toString()
            details["LOCATION_DESCRIPTION"] = parent.receivedOffice.officeDescription

            headerLedger.transactionNo = parent.rrNo
            headerLedger.transactionType = parent.account.description
            headerLedger.referenceType = parent.account.description
            headerLedger.referenceNo =  parent.receivedRefNo

            def pHeader = ledgerServices.persistHeaderLedger(headerLedger,
                    "${parent.receiveDate.atZone(ZoneId.systemDefault()).format(yearFormat)}-${parent.rrNo}",
                    "${parent.receivedOffice.officeDescription}-${parent.account.description}",
                    "${parent.receivedOffice.officeDescription}-${parent.account.description}",
                    LedgerDocType.RR,
                    JournalType.PURCHASES_PAYABLES,
                    parent.receiveDate,
                    details)

            parent.postedLedger = pHeader.id
            parent.isPosted = true
            parent.isVoid = false
            parent.postedBy = SecurityUtils.currentLogin()

            return save(parent)
        }
        return parent
    }

    @Transactional
    @GraphQLMutation(name = "overrideRecItems")
    ReceivingReport overrideRecItems(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "po") UUID po,
            @GraphQLArgument(name = "toDelete") ArrayList<Map<String, Object>> toDelete,
            @GraphQLArgument(name = "toInsert") ArrayList<Map<String, Object>> toInsert,
            @GraphQLArgument(name = "amount") Map<String, Object> amount

    ) {
        def amountObj = objectMapper.convertValue(amount, ReceivingAmountDto.class)
        def upsert = findOne(id)
        upsert.purchaseOrder = po ? purchaseOrderService.poById(po) : null
        upsert.grossAmount = amountObj.grossAmount
        upsert.totalDiscount = amountObj.totalDiscount
        upsert.netDiscount = amountObj.netDiscount
        upsert.inputTax = amountObj.inputTax
        upsert.netAmount = amountObj.netAmount
        upsert.amount = amountObj.amount

        //
        try {
            if(toDelete){
                def d = toDelete as ArrayList<ReceivingReportItem>
                d.each {
                    def deleted = objectMapper.convertValue(it, ReceivingReportItem.class)
                    receivingReportItemService.removeRecItemNoQuery(deleted)
                }
            }

            if(toInsert){
                def items = toInsert as ArrayList<PurchaseRecDto>
                //loop items
                items.each {
                    def item = objectMapper.convertValue(it.item, Item.class)
                    def poItem = objectMapper.convertValue(it.refPoItem, PurchaseOrderItems.class)
                    def con = objectMapper.convertValue(it, PurchaseRecDto.class)
                    receivingReportItemService.upsertRecItem(con, item, poItem, upsert)
                }
            }
            save(upsert)
        } catch (Exception e) {
            throw new Exception("Something was Wrong : " + e)
        }
        return upsert
    }
}
