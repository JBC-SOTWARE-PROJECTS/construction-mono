package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.ArInvoice
import com.backend.gbp.domain.accounting.ArInvoiceItems
import com.backend.gbp.graphqlservices.hrm.EmployeeService
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.rest.dto.ARInvoiceDto
import com.backend.gbp.services.EntityObjectMapperService
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.GeneratorType
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
import javax.transaction.Transactional
import java.time.ZoneId
import java.time.format.DateTimeFormatter

@Service
@GraphQLApi
@Transactional(rollbackOn = Exception.class)
class ArInvoiceItemServices extends  ArAbstractFormulaHelper<ArInvoiceItems> {

    ArInvoiceItemServices(){
        super(ArInvoiceItems.class)
    }


    @Autowired
    GeneratorService generatorService

    @Autowired
    ArCustomerServices arCustomerServices

    @Autowired
    ArInvoiceServices invoiceServices

    @Autowired
    EmployeeService employeeService

    @Autowired
    EntityManager entityManager

//    @Autowired
//    ArCreditNoteItemServices arCreditNoteItemServices

    @Autowired
    EntityObjectMapperService entityObjectMapperService

    @GraphQLQuery(name="findOneInvoiceItems")
    ArInvoiceItems findOneInvoiceItems(
            @GraphQLArgument(name = "id") UUID id
    ){
        try{
            if(id) createQuery("""
                Select DISTINCT a from ArInvoiceItems a
                left join fetch a.arInvoice ai
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

    @GraphQLMutation(name="addInvoiceItem")
    GraphQLResVal<ArInvoiceItems> addInvoiceItem(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "fields") Map<String,Object> fields
    ){
        try{

            def invoiceItems = upsertFromMap(id, fields, { ArInvoiceItems entity, boolean forInsert ->

                if(!entity?.invoiceNo){
                    entity.invoiceNo = entity.arInvoice.invoiceNo
                }

                if(!entity?.arCustomer && entity?.arInvoice?.arCustomer){
                    entity.arCustomer = entity.arInvoice.arCustomer
                }

                if(entity.arInvoice.invoiceType.equalsIgnoreCase('REGULAR')){
                    entity.itemType = entity?.invoiceParticulars?.itemCategory ?: ''
                    entity.itemName = entity?.invoiceParticulars?.itemName ?: ''
                }

                entity.cwtRate = entity.arInvoice.cwtRate
                entity.isCWT = entity.arInvoice.isCWT
                entity.vatAmount = entity.arInvoice.vatAmount
                entity.isVatable = entity.arInvoice.isVatable

                if (forInsert) {
                    if(!entity.recordNo)
                        entity.recordNo = generatorService.getNextValue(GeneratorType.AR_INVOICE_ITEMS, {
                            return StringUtils.leftPad(it.toString(), 6, "0")
                        })
                    return entity
                }

                return entity
            })

            ArInvoice arInvoice = invoiceItems.arInvoice
            if(arInvoice.isVatable || arInvoice.isCWT)
                applyVatCWT(invoiceItems.id,arInvoice.isVatable,arInvoice.isCWT,null,arInvoice?.cwtRate?:null)
            invoiceServices.updateInvoiceTotals(invoiceItems.arInvoice.id)

            return new GraphQLResVal<ArInvoiceItems>(invoiceItems, true, 'Invoice item has been successfully saved. ')
        }
        catch (ignore){
            if(id){
                ArInvoiceItems arInvoiceItems = findOne(id)
                return new GraphQLResVal<ArInvoiceItems>(arInvoiceItems, false, 'Unable to save invoice item. Please contact support for assistance.')
            }
            return new GraphQLResVal<ArInvoiceItems>(null, false, 'Unable to save invoice item. Please contact support for assistance.')
        }
    }

    @GraphQLMutation(name="addInvoiceClaimsItem")
    GraphQLResVal<ArInvoiceItems> addInvoiceClaimsItem(
            @GraphQLArgument(name = "billingItemId") UUID billingItemId,
            @GraphQLArgument(name = "invoiceId") UUID invoiceId
    ){
        try{
            if(billingItemId) {
                def billingItem = billingItemServices.findOne(billingItemId)
                def invoice =  invoiceServices.findOne(invoiceId)
                if(billingItem && invoice) {
                    ArInvoiceItems invoiceItems = new ArInvoiceItems()
                    invoiceItems.arInvoice = invoice
                    invoiceItems.invoiceNo = invoice.invoiceNo
                    invoiceItems.arCustomer = invoice.arCustomer
                    invoiceItems.recordNo = generatorService.getNextValue(GeneratorType.AR_INVOICE_ITEMS, {
                        return StringUtils.leftPad(it.toString(), 6, "0")
                    })
                    invoiceItems.itemName = billingItem?.billing?.patient?.fullName ?: billingItem.billing.otcname
                    invoiceItems.description = billingItem?.description ?: ''
                    invoiceItems.approval_code = billingItem?.approvalCode ?: ''
                    invoiceItems.itemType = billingItem.itemType.name() == 'DEDUCTIONS'  ? 'HCI' : 'PF'
                    invoiceItems.unitPrice = billingItem.credit
                    invoiceItems.quantity = 1
                    invoiceItems.discount = 0
                    invoiceItems.discountAmount = 0.00
                    invoiceItems.isCWT = invoice.isCWT
                    invoiceItems.isVatable = invoice.isVatable
                    if(invoiceItems.itemType.equalsIgnoreCase('HCI')){
                        invoiceItems.totalHCIAmount =  billingItem.credit
                    }
                    if(invoiceItems.itemType.equalsIgnoreCase('PF')) {
                        invoiceItems.totalPFAmount = billingItem.credit
                    }

                    invoiceItems.totalAmountDue = billingItem.credit
                    invoiceItems.claimsItem = true
                    invoiceItems.patient_name = invoiceItems.itemName
                    invoiceItems.billing_no = billingItem.billing.billingNo
                    invoiceItems.soa_no =  "${DateTimeFormatter.ofPattern(" yyyy ").withZone(ZoneId.systemDefault()).format(billingItem.billing.createdDate)}-${billingItem.billing.billingNo}"
                    invoiceItems.transactionDate = Date.from(billingItem.transactionDate)
                    invoiceItems.admission_date = billingItem?.billing?.patientCase?.admissionDatetime ? Date.from(billingItem.billing.patientCase.admissionDatetime) : Date.from(billingItem.transactionDate)
                    invoiceItems.discharge_date = billingItem?.billing?.patientCase?.dischargedDatetime ?  Date.from(billingItem.billing.patientCase.dischargedDatetime) : Date.from(billingItem.transactionDate)
                    invoiceItems.registry_type = billingItem?.billing?.patientCase?.registryType ?: 'OTC'
                    invoiceItems.billing_item_id = billingItem.id
                    invoiceItems.billing_id = billingItem.billing.id
                    invoiceItems.patient_id = billingItem?.billing?.patient?.id
                    invoiceItems.case_id = billingItem?.billing?.patientCase?.id
                    invoiceItems.status = 'active'

                    if(invoiceItems.isVatable)
                        invoiceItems = applyVatLocal(invoiceItems,null)

                    if(invoiceItems.isCWT)
                        invoiceItems = applyCWTLocal(invoiceItems,invoice?.cwtRate?:null)

                    if(billingItem.itemType.name().equalsIgnoreCase('DEDUCTIONSPF') && billingItem.details['PF_EMPLOYEEID']){
                        def pf = employeeService.findById(UUID.fromString(billingItem.details['PF_EMPLOYEEID']))
                        if(pf) {
                            invoiceItems.pf_name = pf.fullName
                            invoiceItems.pf_id = pf.id
                        }
                    }

                    ArInvoiceItems created = save(invoiceItems)
                    invoiceServices.updateInvoiceTotals(created.arInvoice.id)
                    if(created){
                        billingItem.arBilled = true
                        billingItemServices.save(billingItem)
                    }

                    return new GraphQLResVal<ArInvoiceItems>(created, true, 'Invoice item has been successfully saved. ')
                }
            }
            return new GraphQLResVal<ArInvoiceItems>(null, false, 'Unable to save invoice item. Please contact support for assistance.')
        }
        catch (ignore){
            return new GraphQLResVal<ArInvoiceItems>(null, false, 'Unable to save invoice item. Please contact support for assistance.')
        }
    }

    @GraphQLMutation(name="addTransferItem")
    GraphQLResVal<ArInvoiceItems> addTransferItem(
            @GraphQLArgument(name = "creditNoteItemId") UUID creditNoteItemId,
            @GraphQLArgument(name = "invoiceId") UUID invoiceId
    ){
        try{
//            if(creditNoteItemId) {
//                ArCreditNoteItems creditNoteItems = arCreditNoteItemServices.findOne(creditNoteItemId)
//                def invoice = invoiceServices.findOne(invoiceId)
//                if(creditNoteItems && invoice) {
//                    ArInvoiceItems invoiceItems =  objectMapper.convertValue(creditNoteItems.arInvoiceItem, ArInvoiceItems)
//                    invoiceItems.id = null
//                    invoiceItems.arInvoice = invoice
//                    invoiceItems.invoiceNo = invoice.invoiceNo
//                    invoiceItems.arCustomer = invoice.arCustomer
//                    invoiceItems.recordNo = generatorService.getNextValue(GeneratorType.AR_INVOICE_ITEMS, {
//                        return StringUtils.leftPad(it.toString(), 6, "0")
//                    })
//                    invoiceItems.unitPrice = creditNoteItems.totalAmountDue
//                    invoiceItems.quantity = 1
//                    invoiceItems.discount = 0
//                    invoiceItems.discountAmount = 0.00
//                    invoiceItems.isCWT = invoice.isCWT
//                    invoiceItems.isVatable = invoice.isVatable
//                    invoiceItems.totalAmountDue = creditNoteItems.totalAmountDue
//
//                    if(invoiceItems.itemType.equalsIgnoreCase('HCI')){
//                        invoiceItems.totalHCIAmount =  invoiceItems.totalAmountDue
//                    }
//                    if(invoiceItems.itemType.equalsIgnoreCase('PF')) {
//                        invoiceItems.totalPFAmount = invoiceItems.totalAmountDue
//                    }
//                    invoiceItems.claimsItem = true
//                    invoiceItems.status = 'active'
//                    invoiceItems.reference_transfer_id = creditNoteItems.id
//
//                    if(invoiceItems.isVatable)
//                        invoiceItems = applyVatLocal(invoiceItems,null)
//
//                    if(invoiceItems.isCWT)
//                        invoiceItems = applyCWTLocal(invoiceItems,null)
//
//                    ArInvoiceItems created = save(invoiceItems)
//                    if(created) {
//                        creditNoteItems.recipientInvoice = created.id
//                        arCreditNoteItemServices.save(creditNoteItems)
//                    }
//                    invoice.invoiceType = 'CLAIMS'
//                    invoiceServices.save(invoice)
//                    invoiceServices.updateInvoiceTotals(created.arInvoice.id)
//
//                    return new GraphQLResVal<ArInvoiceItems>(created, true, 'Invoice item has been successfully saved. ')
//                }
//            }
            return new GraphQLResVal<ArInvoiceItems>(null, false, 'Unable to save invoice item. Please contact support for assistance.')
        }
        catch (ignore){
            return new GraphQLResVal<ArInvoiceItems>(null, false, 'Unable to save invoice item. Please contact support for assistance.')
        }
    }


    @GraphQLMutation(name="removeInvoiceItem")
    GraphQLResVal<ArInvoiceItems> removeInvoiceItem(
            @GraphQLArgument(name = "id") UUID id
    ) {
        try{
            def invoiceItem = findOne(id)
            def invoiceId = invoiceItem.arInvoice.id
            if(invoiceItem){
                if(invoiceItem.claimsItem && invoiceItem?.billing_item_id){
                    def billingItem = billingItemServices.findOne(invoiceItem.billing_item_id)
                    billingItem.arBilled = false
                    billingItemServices.save(billingItem)
                }
                if(invoiceItem.reference_transfer_id){
                    def creditNoteItems = arCreditNoteItemServices.findOne(invoiceItem.reference_transfer_id)
                    if(creditNoteItems) {
                        creditNoteItems.recipientInvoice = null
                        arCreditNoteItemServices.save(creditNoteItems)
                    }
                }
                deleteById(id)
                invoiceServices.updateInvoiceTotals(invoiceId)
                return new GraphQLResVal<ArInvoiceItems>(invoiceItem, true, 'Invoice item has been successfully removed. ')
            }
            return new GraphQLResVal<ArInvoiceItems>(invoiceItem, false, 'Unable to removed invoice item. Please contact support for assistance.')
        }catch (ignore){
            return new GraphQLResVal<ArInvoiceItems>(invoiceItem, false, 'Unable to removed invoice item. Please contact support for assistance.')
        }
    }

    @GraphQLQuery(name="findInvoiceItemsByInvoice")
    Page<ArInvoiceItems> findInvoiceItemsByInvoice(
            @GraphQLArgument(name = "invoiceId") UUID invoiceId,
            @GraphQLArgument(name = "search") String search,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ){
        if(invoiceId) {
            String queryStr = """   from ArInvoiceItems c where c.arInvoice.id = :invoiceId 
                                and ( 
                                        lower(c.itemName) like lower(concat('%',:search,'%')) or 
                                        lower(c.description) like lower(concat('%',:search,'%'))
                                ) """
            Map<String, Object> params = [:]
            params['invoiceId'] = invoiceId
            params['search'] = search

            getPageable(
                    """ Select c ${queryStr} order by c.recordNo desc""",
                    """ Select count(c) ${queryStr} """,
                    page,
                    size,
                    params
            )
        }
        else Page.empty()
    }

    @GraphQLQuery(name="findAllInvoiceItemsByInvoice")
    List<ArInvoiceItems> findAllInvoiceItemsByInvoice(
            @GraphQLArgument(name = "invoiceId") UUID invoiceId
    ){
        if(invoiceId) {
            Map<String, Object> params = [:]
            params['invoiceId'] = invoiceId

            createQuery(
                    """ Select c from ArInvoiceItems c where c.arInvoice.id = :invoiceId order by c.recordNo desc""",
                    params
            ).resultList ?: []
        }
        else []
    }

    @GraphQLQuery(name="findInvoiceItemsByCustomer")
    Page<ArInvoiceItems> findInvoiceItemsByCustomer(
            @GraphQLArgument(name = "customerId") UUID customerId,
            @GraphQLArgument(name = "invoiceId") UUID invoiceId,
            @GraphQLArgument(name = "search") String search,
            @GraphQLArgument(name = "status") String status,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ){
        try {
            String queryStr = """   from ArInvoiceItems c where c.arCustomer.id = :customerId 
                                and c.arInvoice.status != 'VOIDED'
                                and ( 
                                        lower(c.itemName) like lower(concat('%',:search,'%')) or 
                                        lower(c.description) like lower(concat('%',:search,'%'))
                                ) """
            Map<String, Object> params = [:]
            params['customerId'] = customerId
            params['search'] = search

            if (invoiceId) {
                params['invoiceId'] = invoiceId
                queryStr += """ and c.arInvoice.id = :invoiceId  """
            }

            if (status) {
                queryStr += "and c.arInvoice.status = :status "
                params['status'] = status
            }

            getPageable(
                    """ Select c ${queryStr} order by c.recordNo""",
                    """ Select count(c) ${queryStr} """,
                    page,
                    size,
                    params
            )
        }
        catch (ignore){
            return  Page.empty()
        }
    }

    @GraphQLQuery(name="arInvoiceItemUUIDList")
    List<UUID> arInvoiceItemUUIDList(
            @GraphQLArgument(name = "id") UUID id
    ){
        try{
            return entityManager.createQuery(""" Select c.id from ArInvoiceItems c where c.arInvoice.id = :id """)
                    .setParameter('id',id)
                    .resultList
        }
        catch (ignored){
            return []
        }
    }

    @GraphQLQuery(name="hciInvoiceItemTotalVat")
    BigDecimal hciInvoiceItemTotalVat(
            @GraphQLArgument(name = "id") UUID id
    ){
        try{
            return entityManager.createQuery(""" 
                        Select 
                            coalesce(sum(i.vatAmount),0)
                            from ArInvoiceItems i where i.arInvoice.id = :id
                            and i.totalHCIAmount > 0
            """,BigDecimal.class)
                    .setParameter('id',id)
                    .getSingleResult()
        }
        catch (ignored){
            return 0
        }
    }

    @GraphQLQuery(name="hciInvoiceItemTotalCWT")
    BigDecimal hciInvoiceItemTotalCWT(
            @GraphQLArgument(name = "id") UUID id
    ){
        try{
            return entityManager.createQuery(""" 
                        Select 
                            coalesce(sum(i.cwtAmount),0)
                            from ArInvoiceItems i where i.arInvoice.id = :id
                            and i.totalHCIAmount > 0
            """,BigDecimal.class)
                    .setParameter('id',id)
                    .getSingleResult()
        }
        catch (ignored){
            return 0
        }
    }



    @Transactional
    @GraphQLMutation(name = "generateInvoiceTax")
    GraphQLResVal<Boolean> generateInvoiceTax(
            @GraphQLArgument(name = "invoiceId") UUID invoiceId,
            @GraphQLArgument(name = "taxType") String taxType,
            @GraphQLArgument(name = "rate") BigDecimal rate,
            @GraphQLArgument(name = "isApply") Boolean isApply = true
    ) {
        try{
            switch (taxType.toUpperCase()){
                case 'CWT':
                    ArInvoice invoice = invoiceServices.findOne(invoiceId)
                    List<UUID> items = arInvoiceItemUUIDList(invoiceId)
                    items.each {it->
                        if(invoice.isVatable)
                            applyVatCWT(it,invoice.isVatable,isApply,null,rate)
                        else
                            applyCWT(it,isApply,rate)
                    }
                    invoice.isCWT = isApply
                    invoice.cwtRate = rate
                    invoiceServices.save(invoice)
                    invoiceServices.updateInvoiceTotals(invoiceId)
                    return new GraphQLResVal<Boolean>(true, true, 'Tax calculation was successful. Your invoice now reflects the updated total amount due.')
                default:
                    return  new GraphQLResVal<Boolean>(false, false, 'Transaction failed: Calculation error. Please check your input and try again.')
            }
        }catch(ignored){
            return  new GraphQLResVal<Boolean>(false, false, 'Transaction failed: Calculation error. Please check your input and try again.')
        }
    }

    @Transactional
    @GraphQLMutation(name = "generateInvoiceVat")
    GraphQLResVal<Boolean> generateInvoiceVat(
            @GraphQLArgument(name = "invoiceId") UUID invoiceId,
            @GraphQLArgument(name = "isVatable") Boolean isVatable,
            @GraphQLArgument(name = "vatValue") BigDecimal vatValue = 12
    ) {
        try{
            ArInvoice invoice = invoiceServices.findOne(invoiceId)
            List<UUID> items = arInvoiceItemUUIDList(invoiceId)
            BigDecimal vatPercentage = vatValue ?: 12
            items.each {it->
                // Vat Items
                if(invoice.isCWT)
                    applyVatCWT(it,isVatable,true,vatPercentage,invoice.cwtRate)
                else
                    applyVat(it,isVatable,vatPercentage)
            }
            // Vat Invoice
            invoice.isVatable = isVatable
            invoiceServices.save(invoice)
            invoiceServices.updateInvoiceTotals(invoiceId)
            return  new GraphQLResVal<Boolean>(true,true ,'Tax calculation was successful. Your invoice now reflects the updated total amount due.')
        }catch(ignored){
            return  new GraphQLResVal<Boolean>(false, false, 'Transaction failed: Calculation error. Please check your input and try again.')
        }
    }

    @GraphQLQuery(name="getARInvoiceItemPerId")
    List<ARInvoiceDto> getARInvoiceItemPerId(
            @GraphQLArgument(name="id") UUID id
    ){
        def invoiceItems = entityManager.createNativeQuery("""
                select
				coalesce(aii.item_name,'') as "itemName",
				coalesce(aii.description,'') as "description",
				coalesce(aii.quantity,0) as "qty",
				coalesce(aii.unit_price,0) as "unit_price",
				coalesce(aii.total_amount_due,0) as "amount"
				from accounting.ar_invoice_items aii
				where
				aii.ar_invoice_id  = CAST(:id AS uuid)
                """).setParameter("id", id)
        return invoiceItems.unwrap(NativeQuery.class).setResultTransformer(Transformers.aliasToBean(ARInvoiceDto.class)).getResultList()
    }


}
