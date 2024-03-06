package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.accounting.AccountsPayable
import com.backend.gbp.domain.accounting.JournalType
import com.backend.gbp.domain.accounting.Ledger
import com.backend.gbp.domain.accounting.LedgerDocType
import com.backend.gbp.graphqlservices.accounting.IntegrationServices
import com.backend.gbp.graphqlservices.accounting.LedgerServices
import com.backend.gbp.rest.dto.journal.JournalEntryViewDto
import com.backend.gbp.security.SecurityUtils
import com.fasterxml.jackson.databind.ObjectMapper
import com.backend.gbp.domain.inventory.QuantityAdjustment
import com.backend.gbp.repository.inventory.QuantityAdjustmentRepository
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.GeneratorType
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

import javax.transaction.Transactional
import java.math.RoundingMode
import java.time.ZoneId
import java.time.format.DateTimeFormatter

@Component
@GraphQLApi
@TypeChecked
class QuantityAdjustmentService {

    @Autowired
    QuantityAdjustmentRepository quantityAdjustmentRepository

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    InventoryLedgerService inventoryLedgerService

    @Autowired
    GeneratorService generatorService

    @Autowired
    QuantityAdjustmentTypeService quantityAdjustmentTypeService


    @Autowired
    IntegrationServices integrationServices

    @Autowired
    LedgerServices ledgerServices

    @GraphQLQuery(name = "quantityListByItem", description = "List of Quantity Adjustment by Item")
    List<QuantityAdjustment> getAdjustById(@GraphQLArgument(name = "item") UUID id) {
        def company = SecurityUtils.currentCompanyId()
        return quantityAdjustmentRepository.getAdjustById(id, company).sort { it.createdDate }.reverse(true)
    }

    //
    //MUTATION
    @Transactional
    @GraphQLMutation(name = "quantityAdjustmentInsert", description = "insert adj")
    QuantityAdjustment quantityAdjustmentInsert(
            @GraphQLArgument(name = "fields") Map<String, Object> fields
    ) {
        def company = SecurityUtils.currentCompanyId()
        QuantityAdjustment insert = new QuantityAdjustment()
        def data
        def adj = objectMapper.convertValue(fields, QuantityAdjustment)
        try {
            insert.refNum = generatorService.getNextValue(GeneratorType.QTY_ADJ) { Long no ->
                'ADJ-' + StringUtils.leftPad(no.toString(), 6, "0")
            }
            insert.office = adj.office
            insert.dateTrans = adj.dateTrans
            insert.item = adj.item
            insert.quantity = adj.quantity
            insert.unit_cost = adj.unit_cost
            insert.isPosted = false
            insert.isCancel = false
            insert.quantityAdjustmentType = adj.quantityAdjustmentType
            insert.remarks = adj.remarks
            insert.company = company

            data = quantityAdjustmentRepository.save(insert)

        } catch (Exception e) {
            throw new Exception("Something was Wrong : " + e)
        }

        return data
    }

    @Transactional
    @GraphQLMutation(name = "upsertQty")
    QuantityAdjustment upsertQty(
            @GraphQLArgument(name = "qty") Integer qty,
            @GraphQLArgument(name = "id") UUID id
    ) {
        QuantityAdjustment upsert = quantityAdjustmentRepository.findById(id).get()
        upsert.quantity = qty
        return upsert
    }

    @Transactional
    @GraphQLMutation(name = "upsertAdjustmentRemarks")
    QuantityAdjustment upsertAdjustmentRemarks(
            @GraphQLArgument(name = "remarks") String remarks,
            @GraphQLArgument(name = "type") UUID type,
            @GraphQLArgument(name = "id") UUID id
    ) {
        QuantityAdjustment upsert = quantityAdjustmentRepository.findById(id).get()
        upsert.remarks = remarks
        if(type) {
            def qtyType = quantityAdjustmentTypeService.findOneAdjustmentType(type)
            upsert.quantityAdjustmentType = qtyType
        }
        return upsert
    }


    @GraphQLQuery(name = "adjQuantityAccountView")
    List<JournalEntryViewDto> adjQuantityAccountView(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "status") Boolean status
    ) {
        def result = new ArrayList<JournalEntryViewDto>()
        def adjItem = quantityAdjustmentRepository.findById(id).get()

        def flagValue = adjItem.quantityAdjustmentType.flagValue
        def source = adjItem.quantityAdjustmentType.sourceColumn
        def reverse = adjItem.quantityAdjustmentType.reverse

        if (adjItem.postedLedger) {
			def header = ledgerServices.findOne(adjItem.postedLedger)
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
                def headerLedger = integrationServices.generateAutoEntries(adjItem) {
                    it, mul ->
                        //NOTE: always round cost to Bankers Note HALF EVEN
                        BigDecimal inventoryCost = adjItem.unit_cost * adjItem.quantity
                        BigDecimal cost = inventoryCost.setScale(2, RoundingMode.HALF_EVEN)
                        def cat = adjItem.item.assetSubAccount
                        it.flagValue = flagValue

                        //not multiple
                        it.inventorySubAccount = cat
                        it.inventoryCost = cost
                        it[source] = reverse ? cost * -1 : cost

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

    // post and void
    @Transactional
    @GraphQLMutation(name = "updateQtyAdjStatus")
    QuantityAdjustment updateQtyAdjStatus(
            @GraphQLArgument(name = "status") Boolean status,
            @GraphQLArgument(name = "id") UUID id
    ) {
        def upsert = quantityAdjustmentRepository.findById(id).get()
        //do some magic here ...
        //check transaction
        if (status) {
            //ledger post
            inventoryLedgerService.postInventoryLedgerQtyAdjustment(upsert)
            //accounting post
            postToLedgerAccounting(upsert)
        } else {
            //check if has accounting entries
            upsert.isPosted = status
            upsert.isCancel = !status
            upsert.postedLedger = null
            upsert.postedBy = null
            if(upsert.postedLedger){
                def header = ledgerServices.findOne(upsert.postedLedger)
                ledgerServices.reverseEntriesCustom(header, upsert.dateTrans)
            }
            //ledger void
            inventoryLedgerService.voidLedgerByRef(upsert.refNum)
            quantityAdjustmentRepository.save(upsert)
        }
    }

    //accounting entries save
    QuantityAdjustment postToLedgerAccounting(QuantityAdjustment quantityAdjustment) {
        def yearFormat = DateTimeFormatter.ofPattern("yyyy")
        def adjItem = quantityAdjustment

        def flagValue = adjItem.quantityAdjustmentType.flagValue
        def source = adjItem.quantityAdjustmentType.sourceColumn
        def reverse = adjItem.quantityAdjustmentType.reverse

        if (flagValue) {
            def headerLedger = integrationServices.generateAutoEntries(adjItem) {
                it, mul ->
                    //NOTE: always round cost to Bankers Note HALF EVEN
                    BigDecimal inventoryCost = adjItem.unit_cost * adjItem.quantity
                    BigDecimal cost = inventoryCost.setScale(2, RoundingMode.HALF_EVEN)
                    def cat = adjItem.item.assetSubAccount
                    it.flagValue = flagValue

                    //not multiple
                    it.inventorySubAccount = cat
                    it.inventoryCost = cost
                    it[source] = reverse ? cost * -1 : cost

            }

            Map<String, String> details = [:]

            adjItem.details.each { k, v ->
                details[k] = v
            }

            details["TRANSACTION_ID"] = adjItem.id.toString()
            details["LOCATION_ID"] = adjItem.office.id.toString()
            details["LOCATION_DESCRIPTION"] = adjItem.office.officeDescription

            headerLedger.transactionNo = adjItem.refNum
            headerLedger.transactionType = "QUANTITY ADJUSTMENT"
            headerLedger.referenceType = adjItem?.quantityAdjustmentType?.description
            headerLedger.referenceNo = adjItem.quantityAdjustmentType?.code

            def pHeader = ledgerServices.persistHeaderLedger(headerLedger,
                    "${adjItem.dateTrans.atZone(ZoneId.systemDefault()).format(yearFormat)}-${adjItem.refNum}",
                    "${adjItem.office.officeDescription}${adjItem.remarks ? '-' + adjItem.remarks: ''}",
                    "${adjItem.remarks ?: ""}",
                    LedgerDocType.QA,
                    JournalType.GENERAL,
                    adjItem.dateTrans,
                    details)

            adjItem.postedLedger = pHeader.id
            adjItem.isPosted = true
            adjItem.isCancel = false
            adjItem.postedBy = SecurityUtils.currentLogin()

            return quantityAdjustmentRepository.save(adjItem)
        }
       return adjItem
    }

}
