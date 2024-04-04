package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.accounting.Integration
import com.backend.gbp.domain.accounting.IntegrationDomainEnum
import com.backend.gbp.domain.accounting.IntegrationItem
import com.backend.gbp.domain.accounting.JournalType
import com.backend.gbp.domain.accounting.Ledger
import com.backend.gbp.domain.accounting.LedgerDocType
import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.domain.inventory.ItemSubAccount
import com.backend.gbp.domain.inventory.StockIssue
import com.backend.gbp.graphqlservices.accounting.IntegrationServices
import com.backend.gbp.graphqlservices.accounting.LedgerServices
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.projects.ProjectUpdatesMaterialService
import com.backend.gbp.rest.dto.PurchaseIssuanceDto
import com.backend.gbp.rest.dto.journal.JournalEntryViewDto
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
import org.springframework.stereotype.Component

import javax.transaction.Transactional
import java.math.RoundingMode
import java.time.ZoneId
import java.time.format.DateTimeFormatter

@Component
@GraphQLApi
@TypeChecked
class StockIssuanceService extends AbstractDaoService<StockIssue> {

    StockIssuanceService() {
        super(StockIssue.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService

    @Autowired
    StockIssueItemsService stockIssueItemsService

    @Autowired
    InventoryLedgerService inventoryLedgerService

    @Autowired
    ProjectUpdatesMaterialService projectMaterialService

    @Autowired
    IntegrationServices integrationServices

    @Autowired
    LedgerServices ledgerServices


    @GraphQLQuery(name = "stiById")
    StockIssue stiById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            findOne(id)
        }else{
            null
        }
    }


    @GraphQLQuery(name = "stiByFiltersPage")
	Page<StockIssue> stiByFiltersPage(
			@GraphQLArgument(name = "filter") String filter,
			@GraphQLArgument(name = "office") UUID office,
			@GraphQLArgument(name = "page") Integer page,
			@GraphQLArgument(name = "size") Integer size
	) {

        def company = SecurityUtils.currentCompanyId()
		String query = '''Select po from StockIssue po where
						(lower(po.issueNo) like lower(concat('%',:filter,'%'))) '''

		String countQuery = '''Select count(po) from StockIssue po where
						(lower(po.issueNo) like lower(concat('%',:filter,'%'))) '''

		Map<String, Object> params = new HashMap<>()
		params.put('filter', filter)

        if (office) {
            query += ''' and (po.issueFrom.id = :office)'''
            countQuery += ''' and (po.issueFrom.id = :office)'''
            params.put("office", office)
        }

        if (company) {
            query += ''' and (po.company = :company)'''
            countQuery += ''' and (po.company = :company)'''
            params.put("company", company)
        }


        query += ''' ORDER BY po.issueNo DESC'''

		Page<StockIssue> result = getPageable(query, countQuery, page, size, params)
		return result
	}

    @GraphQLQuery(name = "stiByFiltersNewPage")
    Page<StockIssue> stiByFiltersNewPage(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "office") UUID office,
            @GraphQLArgument(name = "category") String category,
            @GraphQLArgument(name = "issueType") String issueType,
            @GraphQLArgument(name = "project") UUID project,
            @GraphQLArgument(name = "asset") UUID asset,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ) {

        def company = SecurityUtils.currentCompanyId()
        String query = '''Select po from StockIssue po where
						(lower(po.issueNo) like lower(concat('%',:filter,'%'))) '''

        String countQuery = '''Select count(po) from StockIssue po where
						(lower(po.issueNo) like lower(concat('%',:filter,'%'))) '''

        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)

        if (office) {
            query += ''' and (po.issueFrom.id = :office)'''
            countQuery += ''' and (po.issueFrom.id = :office)'''
            params.put("office", office)
        }

        if (issueType) {
            query += ''' and (po.issueType = :issueType)'''
            countQuery += ''' and (po.issueType = :issueType)'''
            params.put("issueType", issueType)
        }

        if(category){
            query += ''' and (po.category = :category)''';
            countQuery += ''' and (po.category = :category)''';
            params.put('category', category)
        }

        if (project) {
            query += ''' and (po.project.id = :project)'''
            countQuery += ''' and (po.project.id = :project)'''
            params.put("project", project)
        }

        if (asset) {
            query += ''' and (po.assets.id = :asset)'''
            countQuery += ''' and (po.assets.id = :asset)'''
            params.put("asset", asset)
        }

        if (company) {
            query += ''' and (po.company = :company)'''
            countQuery += ''' and (po.company = :company)'''
            params.put("company", company)
        }


        query += ''' ORDER BY po.issueNo DESC'''

        Page<StockIssue> result = getPageable(query, countQuery, page, size, params)
        return result
    }

    // ============== Mutation =======================//
    @Transactional
    @GraphQLMutation(name = "upsertSTI")
    StockIssue upsertSTI(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "items") ArrayList<Map<String, Object>> items,
            @GraphQLArgument(name = "id") UUID id
    ) {
        def company = SecurityUtils.currentCompanyId()

        StockIssue sti = upsertFromMap(id, fields, { StockIssue entity , boolean forInsert ->
            if(forInsert){
                entity.issueNo = generatorService.getNextValue(GeneratorType.ISSUE_NO, {
                    return "STI-" + StringUtils.leftPad(it.toString(), 6, "0")
                })
                entity.isPosted = false
                entity.isCancel = false
                entity.company = company
            }
        })
//        items to be inserted
        def stiItems = items as ArrayList<PurchaseIssuanceDto>
        stiItems.each {
            def item = objectMapper.convertValue(it.item, Item.class)
            def con = objectMapper.convertValue(it, PurchaseIssuanceDto.class)
            stockIssueItemsService.upsertStiItem(con, item, sti)
        }

        return sti
    }

    @GraphQLQuery(name = "issuanceExpenseAccountView")
    List<JournalEntryViewDto> issuanceExpenseAccountView(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "status") Boolean status
    ) {
        def result = new ArrayList<JournalEntryViewDto>()
        def parent =  findOne(id)
        def childrenList =  stockIssueItemsService.stiItemByParent(id)

        def flagValue = parent.transType.flagValue

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
            if (flagValue && parent.issueType.equalsIgnoreCase("EXPENSE")) {
                Integration match = integrationServices.getIntegrationByDomainAndTagValue(IntegrationDomainEnum.ISSUE_EXPENSE, flagValue)
                def headerLedger = integrationServices.generateAutoEntries(parent) {
                    it, mul ->
                        //NOTE: always round cost to Bankers Note HALF EVEN
                        it.flagValue = flagValue

                        //initialize
                        Map<String, List<StockIssue>> finalAcc  = [:]
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
                            listItems[a.item.assetSubAccount] =  listItems[a.item.assetSubAccount] + a.unitCost
                        }
                        // =============== expense =================
                        Map<ItemSubAccount, BigDecimal> expenseItems  = [:]
                        if(parent.issueType.equalsIgnoreCase("EXPENSE")) {
                            childrenList.each { a ->
                                if(!expenseItems.containsKey(a.item.expenseSubAccount)) {
                                    expenseItems[a.item.expenseSubAccount] = 0.0
                                }
                                expenseItems[a.item.expenseSubAccount] =  expenseItems[a.item.expenseSubAccount] + a.unitCost
                            }
                        }

                        // loop to final Accounts
                        listItems.each {k, v ->
                            if(v > 0){
                                finalAcc[k.sourceColumn] << new StockIssue().tap {
                                    it.itemSubAccount = k
                                    it[k.sourceColumn] = status ? v.setScale(2, RoundingMode.HALF_EVEN) * -1 : v.setScale(2, RoundingMode.HALF_EVEN)
                                }
                            }
                        }
                        // ======== expense ========================
                        expenseItems.each {k, v ->
                            if(v > 0){
                                finalAcc[k.sourceColumn] << new StockIssue().tap {
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
    @GraphQLMutation(name = "updateSTIStatus")
    StockIssue updateSTIStatus(
            @GraphQLArgument(name = "status") Boolean status,
            @GraphQLArgument(name = "id") UUID id
    ) {
        def upsert = findOne(id)
        upsert.isPosted = status

        //update ledger
        if(!status){
            upsert.isCancel = status
            //ledger void
            if(upsert.issueType.equalsIgnoreCase("EXPENSE")){
                inventoryLedgerService.voidLedgerByRefExpense(upsert.issueNo)
            }else{
                inventoryLedgerService.voidLedgerByRef(upsert.issueNo)
            }
            //rts items
            def stiItems = stockIssueItemsService.stiItemByParent(id)
            stiItems.each {
                stockIssueItemsService.updateStiItemStatus(it.id, status)
            }
        }

        save(upsert)
    }

    @Transactional
    @GraphQLMutation(name = "postInventoryIssuanceExpense")
    StockIssue postInventoryIssuanceExpense(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "items") ArrayList<Map<String, Object>> items,
            @GraphQLArgument(name = "status") Boolean status
    ) {
        def upsert = findOne(id)
        //update ledger
        if(status){
            if(upsert.issueType.equalsIgnoreCase("EXPENSE")) {
                //ledger post
                inventoryLedgerService.postInventoryLedgerIssuanceNew(items, upsert.id)
                //accounting post
                return postToLedgerAccounting(upsert)
            }else if(upsert.issueType.equalsIgnoreCase("ISSUE")){
                // no accounting entry for ISSUE for location is not part of chart of account
                // if location is part of chart of account please change this
                upsert.isPosted = status
                upsert.isCancel = !status
                upsert.postedLedger = null
                upsert.postedBy = SecurityUtils.currentLogin()
                inventoryLedgerService.postInventoryLedgerIssuanceNew(items, upsert.id)
                return save(upsert)
            }

        }else{
            upsert.isPosted = status
            upsert.isCancel = !status
            upsert.postedLedger = null
            upsert.postedBy = null
            if(upsert.postedLedger){
                def header = ledgerServices.findOne(upsert.postedLedger)
                ledgerServices.reverseEntriesCustom(header, upsert.issueDate)
            }
            //ledger void
            if(upsert.issueType.equalsIgnoreCase("EXPENSE")){
                if(upsert.project?.id){
                    inventoryLedgerService.voidLedgerByRefExpense(upsert.issueNo)
                }else{
                    inventoryLedgerService.voidLedgerByRef(upsert.issueNo)
                }
            }else{
                inventoryLedgerService.voidLedgerByRef(upsert.issueNo)
            }
            //rts items
            def stiItems = stockIssueItemsService.stiItemByParent(id)
            stiItems.each {
                stockIssueItemsService.updateStiItemStatus(it.id, status)
            }
            return save(upsert)
        }

    }

    //accounting entries save
    StockIssue postToLedgerAccounting(StockIssue stockIssue) {
        def yearFormat = DateTimeFormatter.ofPattern("yyyy")
        def parent =  stockIssue
        def childrenList =   stockIssueItemsService.stiItemByParent(parent.id)
        def flagValue = parent.transType.flagValue

        if (flagValue) {
            Integration match = integrationServices.getIntegrationByDomainAndTagValue(IntegrationDomainEnum.ISSUE_EXPENSE, flagValue)
            def headerLedger = integrationServices.generateAutoEntries(parent) {
                it, mul ->
                    //NOTE: always round cost to Bankers Note HALF EVEN
                    it.flagValue = flagValue
                    BigDecimal expenseAmount = BigDecimal.ZERO
                    //initialize
                    Map<String, List<StockIssue>> finalAcc  = [:]
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
                        listItems[a.item.assetSubAccount] =  listItems[a.item.assetSubAccount] + a.unitCost
                        expenseAmount = expenseAmount + a.unitCost
                    }
                    // =============== expense =================
                    Map<ItemSubAccount, BigDecimal> expenseItems  = [:]
                    if(parent.issueType.equalsIgnoreCase("EXPENSE")) {
                        childrenList.each { a ->
                            if(!expenseItems.containsKey(a.item.expenseSubAccount)) {
                                expenseItems[a.item.expenseSubAccount] = 0.0
                            }
                            expenseItems[a.item.expenseSubAccount] =  expenseItems[a.item.expenseSubAccount] + a.unitCost
                        }
                    }

                    // loop to final Accounts
                    listItems.each {k, v ->
                        if(v > 0){
                            finalAcc[k.sourceColumn] << new StockIssue().tap {
                                it.itemSubAccount = k
                                it[k.sourceColumn] = v.setScale(2, RoundingMode.HALF_EVEN) * -1
                            }
                        }
                    }
                    // ======== expense ========================
                    expenseItems.each {k, v ->
                        if(v > 0){
                            finalAcc[k.sourceColumn] << new StockIssue().tap {
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
            }
            Map<String, String> details = [:]

            parent.details.each { k, v ->
                details[k] = v
            }

            details["TRANSACTION_ID"] = parent.id.toString()
            details["LOCATION_ID"] = parent.issueFrom.id.toString()
            details["DESTINATION_LOCATION_ID"] = parent.issueTo.id.toString()
            details["LOCATION_DESCRIPTION"] = parent.issueFrom.officeDescription
            details["DESTINATION_LOCATION_DESCRIPTION"] = parent.issueTo.officeDescription


            headerLedger.transactionNo = parent.issueNo
            headerLedger.transactionType = "ITEM EXPENSE"
            headerLedger.referenceType = "ITEM EXPENSE"
            headerLedger.referenceNo =  parent.issueNo

            def pHeader = ledgerServices.persistHeaderLedger(headerLedger,
                    "${parent.issueDate.atZone(ZoneId.systemDefault()).format(yearFormat)}-${parent.issueNo}",
                    "${parent.issueFrom.officeDescription}-ITEM EXPENSE",
                    "${parent.issueFrom.officeDescription}-ITEM EXPENSE",
                    LedgerDocType.EI,
                    JournalType.GENERAL,
                    parent.issueDate,
                    details)

            parent.postedLedger = pHeader.id
            parent.isPosted = true
            parent.isCancel = false
            parent.postedBy = SecurityUtils.currentLogin()

            return save(parent)
        }
        return parent
    }


}
