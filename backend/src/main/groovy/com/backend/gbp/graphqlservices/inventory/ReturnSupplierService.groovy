package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.accounting.Bank
import com.backend.gbp.domain.accounting.Disbursement
import com.backend.gbp.domain.accounting.Integration
import com.backend.gbp.domain.accounting.IntegrationDomainEnum
import com.backend.gbp.domain.accounting.IntegrationItem
import com.backend.gbp.domain.accounting.JournalType
import com.backend.gbp.domain.accounting.Ledger
import com.backend.gbp.domain.accounting.LedgerDocType
import com.backend.gbp.domain.inventory.BeginningBalance
import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.domain.inventory.ItemSubAccount
import com.backend.gbp.domain.inventory.ReturnSupplier
import com.backend.gbp.graphqlservices.accounting.IntegrationServices
import com.backend.gbp.graphqlservices.accounting.LedgerServices
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.rest.dto.PurchaseRtsDto
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
import java.time.ZoneId
import java.time.format.DateTimeFormatter

@Component
@GraphQLApi
@TypeChecked
class ReturnSupplierService extends AbstractDaoService<ReturnSupplier> {

    ReturnSupplierService() {
        super(ReturnSupplier.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService

    @Autowired
    ReturnSupplierItemsService returnSupplierItemsService

    @Autowired
    InventoryLedgerService inventoryLedgerService

    @Autowired
    NamedParameterJdbcTemplate namedParameterJdbcTemplate

    @Autowired
    IntegrationServices integrationServices

    @Autowired
    LedgerServices ledgerServices


    @GraphQLQuery(name = "rtsById")
    ReturnSupplier rtsById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            findOne(id)
        }else{
            null
        }
    }

    @GraphQLQuery(name = "returnGetReferenceType")
    List<ApReferenceDto> returnGetReferenceType(){
        List<ApReferenceDto> records = []

        def company = SecurityUtils.currentCompanyId()
        String query = '''select distinct p.reference_type as reference_type from inventory.return_supplier p where p.reference_type is not null and p.company = :company'''
        Map<String, Object> params = new HashMap<>()
        params.put("company", company)
        def recordsRaw= namedParameterJdbcTemplate.queryForList(query, params)

        recordsRaw.each {
            records << new ApReferenceDto(
                    referenceType: StringUtils.upperCase( it.get("reference_type","") as String)
            )
        }

        return records
    }


    @GraphQLQuery(name = "rtsByFiltersPage")
	Page<ReturnSupplier> rtsByFiltersPage(
			@GraphQLArgument(name = "filter") String filter,
			@GraphQLArgument(name = "office") UUID office,
			@GraphQLArgument(name = "page") Integer page,
			@GraphQLArgument(name = "size") Integer size
	) {

        def company = SecurityUtils.currentCompanyId()
		String query = '''Select po from ReturnSupplier po where
						(lower(po.rtsNo) like lower(concat('%',:filter,'%')) or
						lower(po.receivedRefNo) like lower(concat('%',:filter,'%'))) '''

		String countQuery = '''Select count(po) from ReturnSupplier po where
						(lower(po.rtsNo) like lower(concat('%',:filter,'%')) or
						lower(po.receivedRefNo) like lower(concat('%',:filter,'%'))) '''

		Map<String, Object> params = new HashMap<>()
		params.put('filter', filter)

        if (office) {
            query += ''' and (po.office.id = :office)'''
            countQuery += ''' and (po.office.id = :office)'''
            params.put("office", office)
        }

        if (company) {
            query += ''' and (po.company = :company)'''
            countQuery += ''' and (po.company = :company)'''
            params.put("company", company)
        }


		query += ''' ORDER BY po.rtsNo DESC'''

		Page<ReturnSupplier> result = getPageable(query, countQuery, page, size, params)
		return result
	}

    // ============== Mutation =======================//
    @Transactional
    @GraphQLMutation(name = "upsertRTS")
    ReturnSupplier upsertRTS(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "items") ArrayList<Map<String, Object>> items,
            @GraphQLArgument(name = "id") UUID id
    ) {
        def company = SecurityUtils.currentCompanyId()

        ReturnSupplier rts = upsertFromMap(id, fields, { ReturnSupplier entity , boolean forInsert ->
            if(forInsert){
                entity.rtsNo = generatorService.getNextValue(GeneratorType.RET_SUP, {
                    return "RTS-" + StringUtils.leftPad(it.toString(), 6, "0")
                })
                entity.isPosted = false
                entity.isVoid = false
                entity.company = company
            }
        })
//        items to be inserted
        def rtsItems = items as ArrayList<PurchaseRtsDto>
        rtsItems.each {
            def item = objectMapper.convertValue(it.item, Item.class)
            def con = objectMapper.convertValue(it, PurchaseRtsDto.class)
            returnSupplierItemsService.upsertRtsItem(con, item, rts)
        }

        return rts
    }

    @GraphQLQuery(name = "returnSupplierAccountView")
    List<JournalEntryViewDto> returnSupplierAccountView(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "status") Boolean status
    ) {
        def result = new ArrayList<JournalEntryViewDto>()
        def parent =  findOne(id)
        def childrenList =  returnSupplierItemsService.rtsItemByParent(id)

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
            if (flagValue) {
                Integration match = integrationServices.getIntegrationByDomainAndTagValue(IntegrationDomainEnum.RETURN_SUPPLIER, flagValue)
                def headerLedger = integrationServices.generateAutoEntries(parent) {
                    it, mul ->
                        //NOTE: always round cost to Bankers Note HALF EVEN
                        it.flagValue = flagValue
                        BigDecimal supplierAmount = BigDecimal.ZERO
                        //initialize
                        Map<String, List<ReturnSupplier>> finalAcc  = [:]
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
                            listItems[a.item.assetSubAccount] =  listItems[a.item.assetSubAccount] + a.returnUnitCost
                            supplierAmount = supplierAmount + a.returnUnitCost
                        }
                        // loop to final Accounts
                        listItems.each {k, v ->
                            if(v > 0){
                                finalAcc[k.sourceColumn] << new ReturnSupplier().tap {
                                    it.itemSubAccount = k
                                    it[k.sourceColumn] = status ? v.setScale(2, RoundingMode.HALF_EVEN) * -1 : v.setScale(2, RoundingMode.HALF_EVEN)
                                }
                            }
                        }
                        // ====================== loop multiples ========================
                        finalAcc.each { key, items ->
                            mul << items
                        }
                        // ====================== not multiple here =====================
                        it.negativeSupplierAmount = status ? supplierAmount.setScale(2, RoundingMode.HALF_EVEN) * -1 : supplierAmount.setScale(2, RoundingMode.HALF_EVEN)
                        it.supplierAmount = status ? supplierAmount.setScale(2, RoundingMode.HALF_EVEN) : supplierAmount.setScale(2, RoundingMode.HALF_EVEN) * -1
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
    @GraphQLMutation(name = "updateRTSStatus")
    ReturnSupplier updateRTSStatus(
            @GraphQLArgument(name = "status") Boolean status,
            @GraphQLArgument(name = "id") UUID id
    ) {
        def upsert = findOne(id)
        upsert.isPosted = status

        //do some magic here ...
        //update ledger
        if(status){
            upsert.isVoid = status
            //ledger void
            inventoryLedgerService.voidLedgerByRef(upsert.rtsNo)
            //rts items
            def rtsItems = returnSupplierItemsService.rtsItemByParent(id)
            rtsItems.each {
                returnSupplierItemsService.updateRtsItemStatus(it.id, status)
            }
        }

        save(upsert)
    }

    @Transactional
    @GraphQLMutation(name = "postReturnInventory")
    ReturnSupplier postReturnInventory(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "items") ArrayList<Map<String, Object>> items,
            @GraphQLArgument(name = "status") Boolean status
    ) {
        def upsert = findOne(id)

        //update ledger
        if(status){
            //ledger post
            inventoryLedgerService.postInventoryLedgerReturnNew(items)
            //accounting post
            return postToLedgerAccounting(upsert)

        }else{
            upsert.isPosted = status
            upsert.isVoid = !status
            upsert.postedLedger = null
            upsert.postedBy = null
            if(upsert.postedLedger){
                def header = ledgerServices.findOne(upsert.postedLedger)
                ledgerServices.reverseEntriesCustom(header, upsert.returnDate)
            }
            //ledger void
            inventoryLedgerService.voidLedgerByRef(upsert.rtsNo)
            //rts items
            def rtsItems = returnSupplierItemsService.rtsItemByParent(id)
            rtsItems.each {
                returnSupplierItemsService.updateRtsItemStatus(it.id, status)
            }
            return save(upsert)
        }


    }

    //accounting entries save
    ReturnSupplier postToLedgerAccounting(ReturnSupplier returnSupplier) {
        def yearFormat = DateTimeFormatter.ofPattern("yyyy")
        def parent =  returnSupplier
        def childrenList =  returnSupplierItemsService.rtsItemByParent(parent.id)
        def flagValue = parent.transType.flagValue

        if (flagValue) {
            Integration match = integrationServices.getIntegrationByDomainAndTagValue(IntegrationDomainEnum.RETURN_SUPPLIER, flagValue)
            def headerLedger = integrationServices.generateAutoEntries(parent) {
                it, mul ->
                    //NOTE: always round cost to Bankers Note HALF EVEN
                    it.flagValue = flagValue
                    BigDecimal supplierAmount = BigDecimal.ZERO
                    //initialize
                    Map<String, List<ReturnSupplier>> finalAcc  = [:]
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
                        listItems[a.item.assetSubAccount] =  listItems[a.item.assetSubAccount] + a.returnUnitCost
                        supplierAmount = supplierAmount + a.returnUnitCost
                    }
                    // loop to final Accounts
                    listItems.each {k, v ->
                        if(v > 0){
                            finalAcc[k.sourceColumn] << new ReturnSupplier().tap {
                                it.itemSubAccount = k
                                it[k.sourceColumn] = v.setScale(2, RoundingMode.HALF_EVEN) * -1
                            }
                        }
                    }
                    // ====================== loop multiples ========================
                    finalAcc.each { key, items ->
                        mul << items
                    }
                    // ====================== not multiple here =====================
                    it.supplierAmount = supplierAmount.setScale(2, RoundingMode.HALF_EVEN)
                    it.negativeSupplierAmount = supplierAmount.setScale(2, RoundingMode.HALF_EVEN) * -1
            }
            Map<String, String> details = [:]

            parent.details.each { k, v ->
                details[k] = v
            }

            details["TRANSACTION_ID"] = parent.id.toString()
            details["LOCATION_ID"] = parent.office.id.toString()
            details["LOCATION_DESCRIPTION"] = parent.office.officeDescription

            headerLedger.transactionNo = parent.rtsNo
            headerLedger.transactionType = "RETURN SUPPLIER ITEMS"
            headerLedger.referenceType = "RECEIPT/SRR/PO NO"
            headerLedger.referenceNo =  parent.receivedRefNo

            def pHeader = ledgerServices.persistHeaderLedger(headerLedger,
                    "${parent.returnDate.atZone(ZoneId.systemDefault()).format(yearFormat)}-${parent.rtsNo}",
                    "${parent.office.officeDescription}-RETURN SUPPLIER",
                    "${parent.office.officeDescription}-RETURN SUPPLIER",
                    LedgerDocType.RT,
                    JournalType.GENERAL,
                    parent.returnDate,
                    details)

            parent.postedLedger = pHeader.id
            parent.isPosted = true
            parent.isVoid = false
            parent.postedBy = SecurityUtils.currentLogin()

            return save(parent)
        }
        return parent
    }


}
