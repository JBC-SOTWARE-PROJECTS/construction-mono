package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.ArCreditNote
import com.backend.gbp.domain.accounting.ArCreditNoteItems
import com.backend.gbp.domain.accounting.ArInvoice
import com.backend.gbp.domain.accounting.ArInvoiceItems
import com.backend.gbp.domain.accounting.HeaderLedger
import com.backend.gbp.graphqlservices.types.GraphQLResVal
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
        String queryStr = """ from ArCreditNote c where ( lower(c.reference) like concat('%',lower(:search),'%') or  c.creditNoteNo like concat('%',:search,'%'))
                            """
        Map<String,Object> params = [:]
        params['search'] = search

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


    HeaderLedger creditNoteDiscountPosting(ArCreditNote arCreditNote){
            def dateFormat = DateTimeFormatter.ofPattern("yyyy-MM")

            List<ArCreditNoteItems> discountList = arCreditNoteItemServices.findCreditNoteItemsByCNIdByItemType(arCreditNote.id, ['HCI'])
            if (discountList) {
                def headerLedger = integrationServices.generateAutoEntries(arCreditNote) { it, mul ->
                    def companyAccount = companyAccountServices.findOne(it.arCustomer.referenceId)
                    List<ArCreditNote> multipleCN = []
                    Map<String, Object> creditNoteMap = [:]

                    BigDecimal totalHCIVat = 0.00
                    BigDecimal totalPFVat = 0.00
                    BigDecimal totalHCICwt = 0.00
                    BigDecimal totalPFCwt = 0.00
                    discountList.each {
                        discount ->
                                String deptId =  'cc110554-460f-414e-a2fc-aeb145033c99'
                                if (creditNoteMap[deptId] != null) {
                                    creditNoteMap[deptId]['totalDiscount'] += discount.totalAmountDue
                                } else {
                                    creditNoteMap[deptId] = [:]
                                    creditNoteMap[deptId]['discount'] = discountsService.findOne(UUID.fromString('ecd01a44-668b-4335-aa74-f9c71ab9c1bb'))
                                    creditNoteMap[deptId]['department'] = departmentService.findById(UUID.fromString('cc110554-460f-414e-a2fc-aeb145033c99'))
                                    creditNoteMap[deptId]['totalDiscount'] = discount.totalAmountDue
                                }

                                if(discount.totalHCIAmount > 0) {
                                    totalHCIVat += discount?.vatAmount?:0.00
                                    totalHCICwt += discount?.cwtAmount?:0.00
                                }

                                if(discount.totalPFAmount > 0){
                                    totalPFVat += discount?.vatAmount?:0.00
                                    totalPFCwt += discount?.cwtAmount?:0.00
                                }
                    }

                    creditNoteMap.each { k, v ->
                        multipleCN << new ArCreditNote().tap {
                            note ->
//                                note.discount = v['discount'] as Discount
//                                note.department = v['department'] as Department
                                note.totalDiscount = v['totalDiscount'] as BigDecimal
                        }
                    }

                    mul << multipleCN
                    it.flagValue = AR_CREDIT_NOTE_FLAG.AR_CREDIT_NOTE.name()
                    it.totalHCICreditNote = (it?.totalHCIAmount?:0.00 + totalHCIVat?:0.00 + totalHCICwt?:0.00).negate()
                    it.totalPFCreditNote = (it?.totalPFAmount?:0.00 + totalPFVat?:0.00 + totalPFCwt?:0.00).abs()
                }

                Map<String, String> details = [:]
                arCreditNote.details.each { k, v ->
                    details[k] = v
                }

                details["CREDIT_NOTE_ID"] = arCreditNote.id.toString()


                Date dateTime = arCreditNote.creditNoteDate

                def transactionDate
                transactionDate = dateToInstantConverter(dateTime)

                headerLedger.transactionNo = arCreditNote.creditNoteNo
                headerLedger.transactionType = 'CREDIT NOTE'
                headerLedger.referenceNo = arCreditNote.reference
                headerLedger.referenceType = arCreditNote?.reference ? 'INVOICE' : ''


                def pHeader = ledgerServices.persistHeaderLedger(headerLedger,
                        arCreditNote.creditNoteNo,
                        "${arCreditNote.arCustomer.customerName}",
                        "CLAIMS CREDIT NOTE",
                        LedgerDocType.INV,
                        JournalType.GENERAL,
                        transactionDate,
                        details)
                arCreditNote.ledgerId = pHeader.id
                save(arCreditNote)
                return pHeader
            }

    }

    Boolean updateInvoiceItemCreditNoteTotal(UUID creditNote){
        if(creditNote) {
            Map<String,UUID> invoiceID = [:]
            List<ArCreditNoteItems> creditNoteItems = arCreditNoteItemServices.findCreditNoteItemsByCNId(creditNote)
            creditNoteItems.each {
                cnItem ->
                    ArInvoiceItems items = arInvoiceItemServices.findOne(cnItem.arInvoiceItem.id)
                    items.creditNote = (items.creditNote?:0.00) + cnItem.totalAmountDue
                    if(!invoiceID[items.arInvoice.id.toString()]) invoiceID[items.arInvoice.id.toString()] = items.arInvoice.id
                    arInvoiceItemServices.save(items)
            }
            invoiceID.each {
                it->
                    arInvoiceServices.updateInvoiceTotals(it.value)
            }

        }
        return true
    }

    @GraphQLMutation(name="createCreditNote")
    GraphQLResVal<ArCreditNote> createCreditNote(
        @GraphQLArgument(name = "id") UUID id,
        @GraphQLArgument(name = "fields") Map<String,Object> fields
    ){
            def creditNote = upsertFromMap(id, fields)
            if(!creditNote.creditNoteNo){
                def formatter = DateTimeFormatter.ofPattern("yyyy")
                String year = creditNote.createdDate.atZone(ZoneId.systemDefault()).format(formatter)
                creditNote.creditNoteNo = generatorService.getNextGeneratorFeatPrefix("ar_cn_${year}") {
                    it -> return "RCN${year}-${StringUtils.leftPad(it.toString(), 6, "0")}"
                }
                save(creditNote)
            }

            if (fields['billingAddress'] == null) {
                creditNote.billingAddress = creditNote?.arCustomer?.address ?: ''
                save(creditNote)
            }
      
            if (creditNote.status.equalsIgnoreCase('UNAPPLIED')) {
//                creditNoteDiscountPosting(creditNote)
//                creditNoteTransferPosting(creditNote)
//                arTransactionLedgerServices.insertArCreditNoteTransactionLedger(creditNote)
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
