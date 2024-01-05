package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.AR_INVOICE_FLAG
import com.backend.gbp.domain.accounting.ArInvoice
import com.backend.gbp.domain.accounting.ArInvoiceItems
import com.backend.gbp.domain.accounting.HeaderLedger
import com.backend.gbp.domain.accounting.JournalType
import com.backend.gbp.domain.accounting.Ledger
import com.backend.gbp.domain.accounting.LedgerDocType
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.repository.UserRepository
import com.backend.gbp.security.SecurityUtils
import com.backend.gbp.services.EntityObjectMapperService
import com.backend.gbp.services.GeneratorService
import groovy.transform.Canonical
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.StringUtils
import org.hibernate.query.NativeQuery
import org.hibernate.transform.Transformers
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.stereotype.Service

import javax.persistence.EntityManager
import javax.persistence.NoResultException
import javax.transaction.Transactional
import java.time.Instant
import java.time.ZoneId
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter

@Canonical
class ArInvoiceWithOutstandingBal {
    String id
    String invoiceId
    String customerId
    String invoiceNo
    String docNo
    String particular
    String reference
    String itemType
    String dueDate
    BigDecimal amount
    BigDecimal balance
    BigDecimal payment
}

@Canonical
class ArInvoiceWithOutstandingBalForCreditNote {
    String id
    String invoiceNo
    String invoiceDate
    String dueDate
    BigDecimal totalAmount
    BigDecimal totalAmountDue
    BigDecimal allocatedAmount
}

@Service
@GraphQLApi
@Transactional(rollbackOn = Exception.class)
class ArInvoiceServices extends ArAbstractFormulaHelper<ArInvoice> {

    ArInvoiceServices(){
        super(ArInvoice.class)
    }

    @Autowired
    GeneratorService generatorService

    @Autowired
    ArCustomerServices arCustomerServices

    @Autowired
    EntityManager entityManager

    @Autowired
    EntityObjectMapperService entityObjectMapperService

    @Autowired
    IntegrationServices integrationServices

    @Autowired
    LedgerServices ledgerServices


    @Autowired
    ArTransactionLedgerServices arTransactionLedgerServices

    @Autowired
    ArInvoiceItemServices arInvoiceItemServices

    @Autowired
    UserRepository userRepository

    @Autowired
    SubAccountSetupService subAccountSetupService

    @Autowired
    ArCreditNoteItemServices arCreditNoteItemServices


    @GraphQLQuery(name="findOneInvoice")
    ArInvoice findOneInvoice(
            @GraphQLArgument(name = "id") UUID id
    ){
        try{
            if(id) createQuery("""
                Select DISTINCT a from ArInvoice a
                left join fetch a.arCustomer ac
                where a.id = :id
            """)
                    .setParameter('id',id)
                    .getSingleResult()
            else return null
        }
        catch (ignored) {
            return null
        }
    }

    @GraphQLQuery(name="findAllInvoiceOutstandingBal")
    List<ArInvoiceWithOutstandingBal> findAllInvoiceOutstandingBal(
            @GraphQLArgument(name = "invoiceType") String invoiceType,
            @GraphQLArgument(name = "customerId") UUID customerId,
            @GraphQLArgument(name = "filterType") String filterType,
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "hasBalance") Boolean hasBalance = true
    ){
        try{
            String filterStr = ''
            switch (filterType){
                case 'ITEM_NAME':
                    filterStr = """ and (aii.item_name like concat('%',:filter,'%')) """
                    break
                case 'RECORD_NO':
                    filterStr = """ and (aii.record_no like concat('%',:filter,'%')) """
                    break
                default:
                    filterStr = """ and (aii.invoice_no like concat('%',:filter,'%')) """
                    break
            }

            if(hasBalance)
                filterStr = """ and (aii.total_amount_due -(coalesce(aii.payment ,0) + coalesce(aii.credit_note,0))) > 0 """

            if(customerId) entityManager.createNativeQuery("""
                select 
                cast(aii.id as text) as "id",
                cast(ai.id as text) as "invoiceId",
                cast(aii.ar_customers  as text) as "customerId",
                aii.record_no as "docNo",
                aii.invoice_no as "invoiceNo",
                to_char(date(ai.due_date),'YYYY-MM-DD') as "dueDate",
                aii.item_name as "particular",
                aii.approval_code as "reference",
                aii.item_type as "itemType",
                aii.total_amount_due  as "amount",
                (aii.total_amount_due -(coalesce(aii.payment ,0) + coalesce(aii.credit_note,0))) as "balance",
                cast(coalesce(null,0) as numeric) as "payment"
                from accounting.ar_invoice_items aii 
                left join accounting.ar_invoice ai on ai.id = aii.ar_invoice_id 
                where 
                aii.ar_customers = :customerId
                and (ai.invoice_type = :invoiceType or 'ALL' = :invoiceType)
                ${filterStr}
                order by ai.due_date;
            """)
                    .setParameter('customerId',customerId)
                    .setParameter('invoiceType',invoiceType)
                    .setParameter('filter',filter)
                    .unwrap(NativeQuery.class)
                    .setResultTransformer(Transformers.aliasToBean(ArInvoiceWithOutstandingBal.class))
                    .getResultList()
            else return []
        }
        catch (ignored) {
            return []
        }
    }

    @GraphQLQuery(name="findAllPromissoryOutstandingBal")
    List<ArInvoiceWithOutstandingBal> findAllPromissoryOutstandingBal(
            @GraphQLArgument(name = "customerId") UUID customerId,
            @GraphQLArgument(name = "filter") String filter
    ) {
        try {
            String filterStr = ''
//            switch (filterType){
//                case 'ITEM_NAME':
//                    filterStr = """ and (aii.item_name like concat('%',:filter,'%')) """
//                    break
//                case 'RECORD_NO':
//                    filterStr = """ and (aii.record_no like concat('%',:filter,'%')) """
//                    break
//                default:
//                    filterStr = """ and (aii.invoice_no like concat('%',:filter,'%')) """
//                    break
//            }

            if (customerId) entityManager.createNativeQuery("""
                select 
                cast(apn.id as text) as "id",
                cast(apn.ar_customer  as text) as "customerId",
                apn.pn_no  as "docNo",
                to_char(date(apn.pn_due_date),'YYYY-MM-DD') as "dueDate",
                apn.patient_name as "particular",
                apn.pn_type as "itemType",
                apn.total_amount  as "amount",
                (apn.total_amount -(coalesce(apn.total_payments ,0) + coalesce(apn.total_credit_note,0))) as "balance",
                cast(coalesce(null,0) as numeric) as "payment"
                from accounting.ar_promissory_note apn 
                where 
                apn.ar_customer  = :customerId
                and (apn.pn_no  like concat('%',:filter,'%'))
                and (apn.total_amount -(coalesce(apn.total_payments ,0) + coalesce(apn.total_credit_note,0))) > 0
                order by apn.pn_due_date asc;
            """)
                    .setParameter('customerId', customerId)
                    .setParameter('filter', filter)
                    .unwrap(NativeQuery.class)
                    .setResultTransformer(Transformers.aliasToBean(ArInvoiceWithOutstandingBal.class))
                    .getResultList()
            else return []
        }
        catch (ignored) {
            return []
        }
    }


    @org.springframework.transaction.annotation.Transactional
    @GraphQLMutation(name="createInvoice")
    GraphQLResVal<ArInvoice> createInvoice(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "fields") Map<String,Object> fields
    ){
            def invoice = upsertFromMap(id, fields)
            if (fields['billingAddress'] == null) {
                def address = invoice.arCustomer.address
                if (address) {
                    invoice.billingAddress = address
                }
                save(invoice)
            }

            if(!invoice.invoiceNo) {
                def formatter = DateTimeFormatter.ofPattern("yyyy")
                String year = invoice.createdDate.atZone(ZoneId.systemDefault()).format(formatter)
                invoice.invoiceNo = generatorService.getNextGeneratorFeatPrefix("ar_invoice_${year}") {
                    it -> return "INV${year}-${StringUtils.leftPad(it.toString(), 6, "0")}"
                }
                save(invoice)
            }
            if(invoice.status.equalsIgnoreCase('pending')){
                def login =  SecurityUtils.currentLogin()
                def user = userRepository.findOneByLogin(login)
                invoice.approvedBy = user.employee.id
                invoice.approvedDate = Instant.now()
                save(invoice)
            }

            return new GraphQLResVal<ArInvoice>(invoice, true, "Invoice transaction completed successfully")
    }

    @GraphQLQuery(name="findAllInvoice")
    Page<ArInvoice> findAllInvoice(
            @GraphQLArgument(name = "customerId") UUID customerId,
            @GraphQLArgument(name = "search") String search,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size,
            @GraphQLArgument(name = "status") String status
    ){
        String queryStr = """ where c.companyId = :companyId and ( lower(c.invoiceNo) like lower(concat('%',:search,'%')) ) and c.status != 'VOIDED'
                            """
        Map<String,Object> params = [:]
        params['search'] = search
        params['companyId'] = SecurityUtils.currentCompanyId()

        if(customerId){
            queryStr += "and c.arCustomer.id = :customerId "
            params['customerId'] = customerId
        }

        if(status != 'ALL') {
            queryStr += "and c.status = :status "
            params['status'] = status
        }

        getPageable(
                """ Select DISTINCT c from ArInvoice c left join fetch c.arCustomer ${queryStr} order by c.createdDate desc""",
                """ Select COUNT(c) from ArInvoice c ${queryStr}""",
                page,
                size,
                params
        )
    }





    @Transactional
    @GraphQLMutation(name="updateInvoiceTotals")
    ArInvoice updateInvoiceTotals(
            @GraphQLArgument(name = "id") UUID id
    ){
        def result

        try {
            result = entityManager.createQuery("""
                        SELECT 
                            sum(i.totalAmountDue), 
                            sum(i.creditNote), 
                            sum(i.cwtAmount), 
                            sum(i.vatAmount),
                            ai.id
                        FROM 
                            ArInvoiceItems i 
                        LEFT JOIN 
                            i.arInvoice ai
                        WHERE 
                            ai.id = :id
                        GROUP BY 
                            ai.id
                    """)
                    .setParameter('id', id)
                    .getSingleResult()
        } catch (NoResultException ex) {
            // Handle the case where no result is found
            result = null
        }

        ArInvoice invoice = findOne(id)
        if(result) {
            invoice.totalAmountDue = result[0] as BigDecimal ?: 0.00
            invoice.totalCreditNote = result[1] as BigDecimal ?: 0.00
            invoice.cwtAmount = result[2] as BigDecimal ?: 0.00
            invoice.vatAmount = result[3] as BigDecimal ?: 0.00
            save(invoice)
        }else {
            invoice.totalAmountDue = 0.00
            invoice.totalCreditNote = 0.00
            invoice.cwtAmount = 0.00
            invoice.vatAmount = 0.00
            save(invoice)
        }
        return invoice
    }

    @GraphQLQuery(name="invoiceItemAmountSum")
    BigDecimal invoiceItemAmountSum(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "itemType") List<String> itemType
    ){
        try{
            return entityManager.createQuery(""" 
                        Select 
                            sum(i.totalAmountDue)
                            from ArInvoiceItems i
                            left join fetch i.arInvoice ai
                            left join fetch i.arCustomer ar 
                            where i.arInvoice.id = :id
                            and i.itemType in :itemType
            """,BigDecimal.class)
                    .setParameter('id',id)
                    .setParameter('itemType',itemType)
                            .getSingleResult()
        }
        catch (ignored) {
            return 0
        }
    }

    @GraphQLQuery(name="customerBalance")
    BigDecimal customerBalance(
            @GraphQLArgument(name = "customerId") UUID customerId
    ){
        try{
            return entityManager.createQuery(""" 
                        Select 
                        coalesce(sum(i.totalAmountDue),0)
                        from ArInvoiceItems i 
                        left join fetch i.arInvoice ai
                        left join fetch i.arCustomer ar
                        where i.arCustomer.customerId = :customerId 
            """, BigDecimal.class)
                    .setParameter('customerId',customerId)
                    .getSingleResult()
        }
        catch (ignored) {
            return null
        }
    }


    @GraphQLMutation(name="createEmptyInvoice")
    GraphQLResVal<ArInvoice> createEmptyInvoice(
            @GraphQLArgument(name = "customerId") UUID customerId=null
    ){
        try {
                ArInvoice arInvoice = new ArInvoice()
                arInvoice.status = 'Draft'
                if(customerId)
                    arInvoice.arCustomer = arCustomerServices.findOne(customerId)
                def created = save(arInvoice)
                return new GraphQLResVal<ArInvoice>(created, true, 'Successfully saved.')

        }catch (ignored) {
            return new GraphQLResVal<ArInvoice>(null, false, 'Unable to save invoice data. Please contact support for assistance.')
        }
    }

    HeaderLedger addHeaderManualEntries(HeaderLedger headerLedger, List<Map<String,Object>>  entries){
        Map<String, Ledger> existingAccount = [:]
        List<EntryFull> entriesTarget = []
        def coa =  subAccountSetupService.getAllChartOfAccountGenerate("","","","","","")

        for (Map<String,Object> entry in entries ){
            String code = entry.get("code")
            BigDecimal debit = new BigDecimal(entry.get("debit") as String)
            BigDecimal credit =  new BigDecimal(entry.get("credit") as String)
            def match =  coa.find {
                String codex = it.motherAccount.code+"-${it?.subAccount?.code ?: '0000'}-${it?.subSubAccount?.code ?: '0000'}"
                codex == code
            }
            if(!match){
                return  null
            }

            EntryFull entryFull = new EntryFull(match,debit,credit)

            if(existingAccount[code]){
                Ledger existingLedger = existingAccount[code]
                existingLedger.debit += entryFull.debit
                existingLedger.credit += entryFull.credit
            }else {
                Ledger ledger = new Ledger()
                ledger.journalAccount = entryFull.journal
                ledger.transactionDateOnly = headerLedger.transactionDateOnly
                ledger.debit = entryFull.debit
                ledger.credit = entryFull.credit
                ledger.header = headerLedger
                headerLedger.ledger.add(ledger)
                existingAccount[code] = ledger
            }

        }

        return headerLedger
    }


    HeaderLedger claimsInvoicePosting(ArInvoice invoice){
            def headerLedger =	integrationServices.generateAutoEntries(invoice){it, nul ->
                def companyAccount = companyAccountServices.findOne(it.arCustomer.referenceId)
                it.totalHCITax = arInvoiceItemServices.hciInvoiceItemTotalCWT(it.id)?: 0.00
                it.totalHCIVat = arInvoiceItemServices.hciInvoiceItemTotalVat(it.id)?: 0.00
                it.totalAmount = (it.totalHCIAmount?:0.00) + (it.totalHCITax?:0.00) + (it.totalHCIVat?:0.00)
                it.negativeTotalAmount = -it.totalAmount
                it.flagValue = AR_INVOICE_FLAG.AR_CLAIMS_INVOICE.name()
                it.companyAccount = companyAccount
            }

            Map<String,String> details = [:]
            invoice.details.each { k,v ->
                details[k] = v
            }

            details["INVOICE_ID"] = invoice.id.toString()


            Date dateTime = invoice.invoiceDate

            def transactionDate
            transactionDate = dateToInstantConverter(dateTime)

            List<Map<String,Object>>  entries = []
            Map<String,Object> salesAccount = [:]
            salesAccount['code'] = invoice.arCustomer.discountAndPenalties.salesAccountCode
            salesAccount['credit'] = 0.00
            salesAccount['debit'] = (invoice.totalHCIAmount?:0.00) + (invoice.totalHCITax?:0.00) + (invoice.totalHCIVat?:0.00)
            entries.push(salesAccount)
            headerLedger = addHeaderManualEntries(headerLedger,entries)


            headerLedger.transactionNo = invoice.invoiceNo
            headerLedger.transactionType = 'INVOICE'
            headerLedger.referenceNo = invoice.arCustomer.accountNo
            headerLedger.referenceType = 'CUSTOMER'

            def pHeader =	ledgerServices.persistHeaderLedger(headerLedger,
                    invoice.invoiceNo,
                    invoice.arCustomer.customerName,
                    "CLAIMS INVOICE",
                    LedgerDocType.INV,
                    JournalType.GENERAL,
                    transactionDate,
                    details)
            invoice.ledgerId = pHeader.id
            save(invoice)
            return  pHeader

    }

    HeaderLedger personalInvoicePosting(ArInvoice invoice){
        def yearFormat = DateTimeFormatter.ofPattern("yyyy")
        def headerLedger =	integrationServices.generateAutoEntries(invoice){it, nul ->
            it.flagValue = AR_INVOICE_FLAG.AR_REGULAR_INVOICE.name()
            it.totalAmount = (it.totalAmountDue?:0.00) + (it.vatAmount?:0.00) + (it.cwtAmount?:0.00)
        }

        Map<String,String> details = [:]
        invoice.details.each { k,v ->
            details[k] = v
        }

        details["INVOICE_ID"] = invoice.id.toString()


        Date dateTime = invoice.invoiceDate

        def transactionDate
        transactionDate = dateToInstantConverter(dateTime)

        List<Map<String,Object>>  entries = []
        Map<String,Object> salesAccount = [:]
        salesAccount['code'] = invoice.arCustomer.discountAndPenalties.salesAccountCode
        salesAccount['credit'] = 0.00
        salesAccount['debit'] = (invoice.totalAmountDue?:0.00) + (invoice.vatAmount?:0.00) + (invoice.cwtAmount?:0.00)
        entries.push(salesAccount)

        List<ArInvoiceItems> items = arInvoiceItemServices.findAllInvoiceItemsByInvoice(invoice.id)

        items.each {
            Map<String,Object> itemsAccount = [:]
            itemsAccount['code'] = it.invoiceParticulars.salesAccountCode
            itemsAccount['debit'] = 0.00
            itemsAccount['credit'] = it.totalAmountDue?:0.00
            entries.push(itemsAccount)
        }

        headerLedger = addHeaderManualEntries(headerLedger,entries)

        headerLedger.transactionNo = invoice.invoiceNo
        headerLedger.transactionType = 'INVOICE'
        headerLedger.referenceNo = invoice.arCustomer.accountNo
        headerLedger.referenceType = 'CUSTOMER'

        def pHeader =	ledgerServices.persistHeaderLedger(headerLedger,
                invoice.invoiceNo,
                invoice.arCustomer.customerName,
                'REGULAR INVOICE ',
                LedgerDocType.INV,
                JournalType.GENERAL,
                transactionDate,
                details)
        invoice.ledgerId = pHeader.id
        save(invoice)
        return  pHeader
    }


    @Transactional
    @GraphQLMutation(name = "invoicePosting")
    GraphQLResVal<ArInvoice> invoicePosting(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "fields") Map<String,Object> fields,
            @GraphQLArgument(name = "entryPosting") Boolean entryPosting
    ) {
        def invoice  =  createInvoice(id,fields).response
        if(!invoice)
            return  new GraphQLResVal<ArInvoice>(null, false, 'Transaction failed: Calculation error. Please check your input and try again.')

        if(entryPosting) {
            personalInvoicePosting(invoice)
            arTransactionLedgerServices.insertArInvoiceTransactionLedger(invoice)
            invoice.status = 'PENDING'
        }
        return  new GraphQLResVal<ArInvoice>(invoice, true, 'Invoice transaction completed successfully.')
    }

    @Transactional
    @GraphQLMutation(name = "invoiceVoidPosting")
    GraphQLResVal<ArInvoice> invoiceVoidPosting(
            @GraphQLArgument(name = "id") UUID id
    ) {
        def invoice  =  findOne(id)
        if(!invoice)
            return  new GraphQLResVal<ArInvoice>(null, false, 'Transaction failed: Please check your input and try again.')

        def invoiceItems = arInvoiceItemServices.findAllInvoiceItemsByInvoice(id)

        invoice.status = 'VOIDED'
        save(invoice)

        if(invoice.ledgerId) {
            def header = ledgerServices.findOne(invoice.ledgerId)
            ledgerServices.reverseEntries(header)
        }
        arTransactionLedgerServices.insertArInvoiceTransactionLedger(invoice,true)

        return  new GraphQLResVal<ArInvoice>(invoice, true, "Invoice ${invoice.invoiceNo} has been voided.")

    }



    @GraphQLQuery(name="findAllInvoiceOutstandingBalForCreditNote")
    List<ArInvoiceWithOutstandingBalForCreditNote> findAllInvoiceOutstandingBalForCreditNote(
            @GraphQLArgument(name = "customerId") UUID customerId,
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "filterType") String filterType = '',
            @GraphQLArgument(name = "hasBalance") Boolean hasBalance = true
    ){
        try{
            String filterStr = ''
            switch (filterType){
                case 'REFERENCE':
                    filterStr += """ and (ai.reference like concat('%',:filter,'%')) """
                    break
                default:
                    filterStr += """ and (ai.invoice_no like concat('%',:filter,'%')) """
                    break
            }

            if(hasBalance)
                filterStr += """ and (coalesce(ai.total_amount_due,0) - (coalesce(ai.total_payments,0) + coalesce(ai.total_credit_note,0))) > 0"""

            if(customerId) entityManager.createNativeQuery("""
                select
                cast(ai.id as text) as "id",
                ai.invoice_no as "invoiceNo",
                to_char(date(ai.invoice_date),'YYYY-MM-DD') as "invoiceDate",
                to_char(date(ai.due_date),'YYYY-MM-DD') as "dueDate",
                coalesce(total_amount_due,0) as "totalAmount",
                (coalesce(total_amount_due,0) - (coalesce(total_payments,0) + coalesce(total_credit_note,0))) as "totalAmountDue",
                cast(coalesce(null,0) as numeric) as "allocatedAmount"
                from accounting.ar_invoice ai 
                where ai.ar_customers = :customerId 
                and ai.company_id = :companyId
                and ai.status != 'DRAFT'
                ${filterStr}
                order by ai.due_date;
            """)
                    .setParameter('companyId',SecurityUtils.currentCompanyId())
                    .setParameter('customerId',customerId)
                    .setParameter('filter',filter)
                    .unwrap(NativeQuery.class)
                    .setResultTransformer(Transformers.aliasToBean(ArInvoiceWithOutstandingBalForCreditNote.class))
                    .getResultList()
            else return []
        }
        catch (ignored) {
            return []
        }
    }

}
