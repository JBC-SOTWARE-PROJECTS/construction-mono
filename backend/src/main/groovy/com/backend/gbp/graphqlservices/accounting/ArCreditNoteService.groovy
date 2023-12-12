package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.AR_CREDIT_NOTE_FLAG
import com.backend.gbp.domain.accounting.ArCreditNote
import com.backend.gbp.domain.accounting.ArCreditNoteItems
import com.backend.gbp.domain.accounting.ArInvoice
import com.backend.gbp.domain.accounting.ArInvoiceItems
import com.backend.gbp.domain.accounting.HeaderLedger
import com.backend.gbp.domain.accounting.JournalType
import com.backend.gbp.domain.accounting.Ledger
import com.backend.gbp.domain.accounting.LedgerDocType
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.security.SecurityUtils
import com.backend.gbp.services.GeneratorService
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.stereotype.Service

import javax.persistence.EntityManager
import javax.transaction.Transactional
import java.time.ZoneId
import java.time.format.DateTimeFormatter

@Service
@GraphQLApi
@Transactional(rollbackOn = Exception.class)
class ArCreditNoteService extends  ArAbstractFormulaHelper<ArCreditNote>{

    ArCreditNoteService(){
        super(ArCreditNote.class)
    }

    @Autowired
    GeneratorService generatorService

    @Autowired
    ArInvoiceServices arInvoiceServices


    @Autowired
    IntegrationServices integrationServices

    @Autowired
    EntityManager entityManager

    @Autowired
    LedgerServices ledgerServices

    @Autowired
    ArCreditNoteItemServices arCreditNoteItemServices

    @Autowired
    ArInvoiceItemServices arInvoiceItemServices

    @Autowired
    ArTransactionLedgerServices arTransactionLedgerServices

    @GraphQLQuery(name="findOneCreditNote")
    ArCreditNote findOneCreditNote(
            @GraphQLArgument(name = "id") UUID id
    ){
        try{
            if(id) findOne(id)
            else return null
        }
        catch (ignored) {
            return null
        }
    }

    @GraphQLQuery(name="findAllCreditNote")
    Page<ArCreditNote> findAllCreditNote(
            @GraphQLArgument(name = "customerId") UUID customerId,
            @GraphQLArgument(name = "search") String search,
            @GraphQLArgument(name = "status") String status = '',
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ){
        String queryStr = """ from ArCreditNote c where c.companyId = :companyId and ( lower(c.reference) like concat('%',lower(:search),'%') or  c.creditNoteNo like concat('%',:search,'%'))
                            """
        Map<String,Object> params = [:]
        params['search'] = search
        params['companyId'] = SecurityUtils.currentCompanyId()

        if(status != 'ALL') {
            queryStr += "and c.status = :status "
            params['status'] = status
        }

        if(customerId){
            queryStr += "and  c.arCustomer.id = :customerId  "
            params['customerId'] = customerId
        }

        getPageable(
                """ Select c ${queryStr}  order by c.createdDate desc""",
                """ Select count(c) ${queryStr} """,
                page,
                size,
                params
        )
    }

    HeaderLedger creditNoteTransferPosting(ArCreditNote arCreditNote){
            def dateFormat = DateTimeFormatter.ofPattern("yyyy-MM")
            List<ArCreditNoteItems> transferList = arCreditNoteItemServices.findCreditNoteItemsByCNIdByItemType(arCreditNote.id, ['TRANSFER-ERRONEOUS', 'TRANSFER-FINANCIAL-ASSISTANCE'])
            if(transferList) {
                def headerLedger = integrationServices.generateAutoEntries(arCreditNote) { it, mul ->
                    def companyAccount = companyAccountServices.findOne(it.arCustomer.referenceId)
                    it.flagValue = AR_CREDIT_NOTE_FLAG.AR_CREDIT_NOTE_TRANSFER.name()
                    it.companyAccount = companyAccount
                }

                Map<String, String> details = [:]
                arCreditNote.details.each { k, v ->
                    details[k] = v
                }

                details["CREDIT_NOTE_ID"] = arCreditNote.id.toString()


                Date dateTime = arCreditNote.creditNoteDate

                def transactionDate
                transactionDate = dateToInstantConverter(dateTime)

                def pHeader = ledgerServices.persistHeaderLedger(headerLedger,
                        "${arCreditNote.arCustomer.customerName}-${transactionDate.atZone(ZoneId.systemDefault()).format(dateFormat)}",
                        "RECEIVABLES - ${arCreditNote.arCustomer.customerName} ${arCreditNote.arCustomer.customerType == CustomerType.PROMISSORY_NOTE ? '(PN)' : ''}",
                        "${arCreditNote.creditNoteNo} - CLAIMS CREDIT NOTE TRANSFER FOR ${arCreditNote.totalAmountDue}",
                        LedgerDocType.INV,
                        JournalType.GENERAL,
                        transactionDate,
                        details)
                arCreditNote.ledgerId = pHeader.id
                save(arCreditNote)
                return pHeader
            }
            return null
    }

    @Transactional
    HeaderLedger creditNotePosting(ArCreditNote arCreditNote){
        def dateFormat = DateTimeFormatter.ofPattern("yyyy-MM")
        try{
            List<ArCreditNoteItems> cnList = arCreditNoteItemServices.findCreditNoteItemsByCNIdByItemType(arCreditNote.id)
            if (cnList) {
                def headerLedger = integrationServices.generateAutoEntries(arCreditNote) { it, mul ->
                    it.flagValue = AR_CREDIT_NOTE_FLAG.AR_CREDIT_NOTE.name()
                }

                Map<String, String> details = [:]
                arCreditNote.details.each { k, v ->
                    details[k] = v
                }

                details["CREDIT_NOTE_ID"] = arCreditNote.id.toString()

                Date dateTime = arCreditNote.creditNoteDate

                def transactionDate
                transactionDate = dateToInstantConverter(dateTime)

                List<Map<String,Object>>  entries = []
                Map<String,Object> salesAccount = [:]
                salesAccount['code'] = arCreditNote.arCustomer.discountAndPenalties.salesAccountCode
                salesAccount['debit'] = 0.00
                salesAccount['credit'] = (arCreditNote.totalAmountDue?:0.00) + (arCreditNote.vatAmount?:0.00) + (arCreditNote.cwtAmount?:0.00)
                entries.push(salesAccount)

                cnList.each {
                    Map<String,Object> itemsAccount = [:]
                    itemsAccount['code'] = it.accountCode.value
                    itemsAccount['debit'] = it.totalAmountDue?:0.00
                    itemsAccount['credit'] = 0.00
                    entries.push(itemsAccount)
                }

                headerLedger = arInvoiceServices.addHeaderManualEntries(headerLedger,entries)

                headerLedger.transactionNo = arCreditNote.creditNoteNo
                headerLedger.transactionType = 'CREDIT NOTE'
                headerLedger.referenceNo = arCreditNote.reference
                headerLedger.referenceType = arCreditNote?.reference ? 'INVOICE' : ''

                def pHeader = ledgerServices.persistHeaderLedger(headerLedger,
                        arCreditNote.creditNoteNo,
                        "${arCreditNote.arCustomer.customerName}",
                        "CLAIMS CREDIT NOTE",
                        LedgerDocType.CN,
                        JournalType.GENERAL,
                        transactionDate,
                        details)
                arCreditNote.ledgerId = pHeader.id
                save(arCreditNote)
                return pHeader
            }
        }catch (e){
            return null
        }

    }


    @GraphQLMutation(name="createCreditNote")
    GraphQLResVal<ArCreditNote> createCreditNote(
        @GraphQLArgument(name = "id") UUID id,
        @GraphQLArgument(name = "fields") Map<String,Object> fields
    ){
            def creditNote = upsertFromMap(id, fields)
            if (fields['billingAddress'] == null) {
                def address = creditNote.arCustomer.address
                creditNote.billingAddress = address ?: ''
                save(creditNote)
            }

            if(!creditNote.creditNoteNo){
                def formatter = DateTimeFormatter.ofPattern("yyyy")
                String year = creditNote.createdDate.atZone(ZoneId.systemDefault()).format(formatter)
                creditNote.creditNoteNo = generatorService.getNextGeneratorFeatPrefix("ar_cn_${year}") {
                    it -> return "RCN${year}-${StringUtils.leftPad(it.toString(), 6, "0")}"
                }
                save(creditNote)
            }
      
            if (creditNote.status.equalsIgnoreCase('UNAPPLIED')) {
                    updateCreditNoteTotals(creditNote.id)
            }

            return new GraphQLResVal<ArCreditNote>(creditNote, true, "Credit Note transaction completed successfully")
    }

    @GraphQLQuery(name="findPostedCNPerInvoice")
    List<ArCreditNote> findPostedCNPerInvoice(
            @GraphQLArgument(name = "invoiceId") UUID invoiceId
    ){
        try{
            createQuery(
                    """ Select c from ArCreditNote c where c.arInvoice.id = :invoiceId and c.status = 'Posted' order by c.creditNoteNo asc """,
                    [
                            invoiceId:invoiceId
                    ] as Map<String,Object>).resultList
        }
        catch (ignored) {
            return []
        }
    }

    @GraphQLQuery(name="findPendingCNPerInvoice")
    ArCreditNote findPendingCNPerInvoice(
            @GraphQLArgument(name = "invoiceId") UUID invoiceId
    ){
        try{
            createQuery(
                    """ Select c from ArCreditNote c where c.arInvoice.id = :invoiceId and c.status = 'New' order by c.creditNoteNo asc """,
                    [
                            invoiceId:invoiceId
                    ] as Map<String,Object>).setMaxResults(1).singleResult
        }
        catch (ignored) {
            return null
        }
    }

    @GraphQLMutation(name="checkExistingCreditNoteForInvoice")
    GraphQLResVal<ArCreditNote> checkExistingCreditNoteForInvoice(
            @GraphQLArgument(name = "invoiceId") UUID invoiceId
    ){
        try{
            ArInvoice invoice = arInvoiceServices.findOne(invoiceId)
            if(invoice){
                ArCreditNote creditNote = findPendingCNPerInvoice(invoice.id)
                if(creditNote)
                   return new GraphQLResVal<ArCreditNote>(creditNote, true, "Credit Note transaction completed successfully")

                creditNote = new ArCreditNote()
                creditNote.creditNoteNo = generatorService.getNextValue(GeneratorType.AR_CREDIT_NOTE, {
                    return StringUtils.leftPad(it.toString(), 6, "0")
                })

                creditNote.creditNoteType = 'claims_discount'
                creditNote.arCustomer = invoice.arCustomer
                creditNote.status = 'New'
                def newCN = save(creditNote)
                return new GraphQLResVal<ArCreditNote>(newCN, true, "Credit Note transaction completed successfully")
            }

        }catch(e){
            return new GraphQLResVal<ArCreditNote>(null, false, 'Unable to complete credit note transaction. Please contact support for assistance.')
        }
    }

    @GraphQLMutation(name="updateCreditNoteTotals")
    ArCreditNote updateCreditNoteTotals(
            @GraphQLArgument(name = "id") UUID id
    ){
        try{
            def result = entityManager.createQuery(""" 
                        Select 
                                sum(i.totalAmountDue), 
                                sum(i.discountAmount), 
                                sum(i.cwtAmount), 
                                sum(i.vatAmount)
                                 from ArCreditNoteItems i where i.arCreditNote.id = :id  
            """)
                    .setParameter('id',id)
                    .getSingleResult()
            ArCreditNote arCreditNote = findOne(id)
            arCreditNote.totalAmountDue = result[0] as BigDecimal ?: 0.00
            arCreditNote.discountAmount = result[1] as BigDecimal ?: 0.00
            arCreditNote.cwtAmount = result[2] as BigDecimal ?: 0.00
            arCreditNote.vatAmount = result[3] as BigDecimal ?: 0.00
            save(arCreditNote)

            return arCreditNote
        }
        catch (ignored) {
            return null
        }
    }

    @Transactional
    @GraphQLMutation(name = "arCreditNotePosting")
    GraphQLResVal<ArCreditNote> arCreditNotePosting(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "fields") Map<String,Object> fields
    ) {
        def creditNote  =  createCreditNote(id,fields).response
        if(!creditNote)
            return  new GraphQLResVal<ArCreditNote>(null, false, 'Transaction failed: Calculation error. Please check your input and try again.')

        return  new GraphQLResVal<ArCreditNote>(creditNote, true, 'Credit Note transaction completed successfully.')

    }


}
