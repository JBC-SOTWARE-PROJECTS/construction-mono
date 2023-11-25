package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.ARPaymentPosting
import com.backend.gbp.domain.accounting.ARPaymentPostingItems
import com.backend.gbp.domain.accounting.ArCreditNote
import com.backend.gbp.domain.accounting.ArCreditNoteItems
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.GeneratorType
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
//@Transactional(rollbackOn = Exception.class)
class ArCreditNoteItemServices extends ArAbstractFormulaHelper<ArCreditNoteItems> {

    ArCreditNoteItemServices(){
        super(ArCreditNoteItems.class)
    }


    @Autowired
    GeneratorService generatorService

    @Autowired
    ArCreditNoteService arCreditNoteService

    @Autowired
    EntityManager entityManager

    @Autowired
    ARPaymentPostingService arPaymentPostingService

    @Autowired
    ARPaymentPostingItemService arPaymentPostingItemService

    @Autowired
    ArCustomerServices arCustomerServices

    @Autowired
    ArInvoiceItemServices arInvoiceItemServices


    @GraphQLMutation(name="upsertCreditNoteItem")
    GraphQLResVal<ArCreditNoteItems> upsertCreditNoteItem(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "fields") Map<String,Object> fields
    ){
        try{
            def creditNoteItem = upsertFromMap(id , fields, { ArCreditNoteItems entity, boolean forInsert ->
                if (forInsert) {
                    entity.recordNo = generatorService.getNextValue(GeneratorType.AR_CREDIT_NOTE_ITEMS, {
                        return StringUtils.leftPad(it.toString(), 6, "0")
                    })

                    return entity
                }
                return entity
            })

            return new GraphQLResVal<ArCreditNoteItems>(creditNoteItem, true, "Credit Note transaction completed successfully")
        }
        catch (ignore){
            return new GraphQLResVal<ArCreditNoteItems>(null, false, 'Unable to complete credit note transaction. Please contact support for assistance.')
        }
    }


    @GraphQLMutation(name="updateMultipleCreditNoteItem")
    Boolean updateMultipleCreditNoteItem(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "fields") List<Map<String,Object>> fields = []
    ){
        try{
            if(fields.size() > 0){
                fields.each {
                    upsertFromMap(UUID.fromString(it['id'].toString()) , it)
                }
            }
            arCreditNoteService.updateCreditNoteTotals(id)

            return true
        }
        catch (ignore){
            return false
        }
    }

    @GraphQLQuery(name="findCreditNoteItems")
    Page<ArCreditNoteItems> findCreditNoteItems(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "search") String search,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ){
        if(id) {
            String queryStr = """   from ArCreditNoteItems c where c.arCreditNote.id = :id 
                                and ( 
                                        lower(c.itemName) like lower(concat('%',:search,'%')) or 
                                        lower(c.description) like lower(concat('%',:search,'%'))
                                ) """
            Map<String, Object> params = [:]
            params['id'] = id
            params['search'] = search

            getPageable(
                    """ Select c ${queryStr} order by c.recordNo""",
                    """ Select count(c) ${queryStr} """,
                    page,
                    size,
                    params
            )
        }
        else return Page.empty()
    }

    @GraphQLQuery(name="findCreditNoteItemsByCustomer")
    Page<ArCreditNoteItems> findCreditNoteItemsByCustomer(
            @GraphQLArgument(name = "arCustomerId") UUID arCustomerId,
            @GraphQLArgument(name = "search") String search,
            @GraphQLArgument(name = "itemType") List<String> itemType=[],
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ){
        String queryStr = """   from ArCreditNoteItems c where c.recipientCustomer.id = :arCustomerId 
                                and c.recipientInvoice is null
                                and ( 
                                        lower(c.itemName) like lower(concat('%',:search,'%')) or 
                                        lower(c.description) like lower(concat('%',:search,'%'))
                                ) """
        Map<String,Object> params = [:]
        params['arCustomerId'] = arCustomerId
        params['search'] = search

        if(itemType.size() > 0){
            queryStr += """ and c.itemType in :itemType """
            params['itemType'] = itemType
        }


        getPageable(
                """ Select c ${queryStr} order by c.recordNo""",
                """ Select count(c) ${queryStr} """,
                page,
                size,
                params
        )
    }


    @GraphQLQuery(name="findAllInvoiceItemUUIDById")
    List<UUID> findAllInvoiceItemUUIDById(
            @GraphQLArgument(name = "id") UUID id
    ){
        try{
            return entityManager.createQuery(""" Select c.arInvoiceItem.id from ArCreditNoteItems c where c.arCreditNote.id = :id """)
                    .setParameter('id',id)
                    .resultList
        }
        catch (ignored){
            return []
        }
    }

    @GraphQLQuery(name="creditNoteItemUUIDList")
    List<UUID> creditNoteItemUUIDList(
            @GraphQLArgument(name = "id") UUID id
    ){
        try{
            return entityManager.createQuery(""" Select c.id from ArCreditNoteItems c where c.arCreditNote.id = :id """)
                    .setParameter('id',id)
                    .resultList
        }
        catch (ignored){
            return []
        }
    }

    @GraphQLQuery(name="findCreditNoteItemsByCNId")
    List<ArCreditNoteItems> findCreditNoteItemsByCNId(
            @GraphQLArgument(name = "id") UUID id
    ){
        try{
            return entityManager.createQuery(""" Select c from ArCreditNoteItems c where c.arCreditNote.id = :id """)
                    .setParameter('id',id)
                    .resultList
        }
        catch (ignored){
            return []
        }
    }

    @GraphQLQuery(name="findCreditNoteItemsByCNIdByItemType")
    List<ArCreditNoteItems> findCreditNoteItemsByCNIdByItemType(
            @GraphQLArgument(name = "id") UUID id
    ){
        try{
            return entityManager.createQuery(""" Select c from ArCreditNoteItems c 
                    where c.arCreditNote.id = :id """)
                    .setParameter('id',id)
                    .resultList
        }
        catch (ignored){
            return []
        }
    }

    @Transactional
    @GraphQLMutation(name="generateCreditNoteItemTaxByCreditNoteId")
    GraphQLResVal<Boolean> generateCreditNoteItemTaxByCreditNoteId(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "taxType") String taxType,
            @GraphQLArgument(name = "remove") Boolean remove
    ){
        List<UUID> items = creditNoteItemUUIDList(id)
        items.each {it->
            // Credit Note Items
            applyCWT(it,remove,0.02)
        }
        // Credit Note
        arCreditNoteService.applyCWT(id,remove,0.02)
        return  new GraphQLResVal<Boolean>(true,true ,'Tax calculation was successful. Your credit note now reflects the updated total amount due.')
    }


    @GraphQLMutation(name="addCreditNoteClaimsItem")
    GraphQLResVal<ArCreditNoteItems> addCreditNoteClaimsItem(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "fields") Map<String,Object> fields
    ){
        try{
            if(fields) {
               def created   =  upsertCreditNoteItem(id,fields).response ?: null
//                ArCreditNote arCreditNote = created.arCreditNote
//                if(created.itemType.equalsIgnoreCase('DISCOUNT')) {
//                    if ((created.vatAmount <= 0 && arCreditNote.isVatable) || (created.cwtAmount <= 0 && arCreditNote.isCWT))
//                        applyVatCWT(created.id, arCreditNote.isVatable, arCreditNote.isCWT, null, 0.02)
//                }
                arCreditNoteService.updateCreditNoteTotals(created.arCreditNote.id)
                return new GraphQLResVal<ArCreditNoteItems>(created, true, 'Invoice item has been successfully saved. ')
            }
        }
        catch (ignore){
            return new GraphQLResVal<ArCreditNoteItems>(null, false, 'Unable to save invoice item. Please contact support for assistance.')
        }
    }

    @GraphQLMutation(name="removeCreditNoteItem")
    GraphQLResVal<ArCreditNoteItems> removeCreditNoteItem(
            @GraphQLArgument(name = "id") UUID id
    ) {
        try{
            def invoiceItem = findOne(id)
            def creditNote = invoiceItem.arCreditNote.id
            if(invoiceItem){
                deleteById(id)
                arCreditNoteService.updateCreditNoteTotals(creditNote)
                return new GraphQLResVal<ArCreditNoteItems>(invoiceItem, true, 'Credit Note item has been successfully removed. ')
            }
            return new GraphQLResVal<ArCreditNoteItems>(null, false, 'Unable to removed credit note item. Please contact support for assistance.')
        }catch (ignore){
            return new GraphQLResVal<ArCreditNoteItems>(null, false, 'Unable to removed credit note item. Please contact support for assistance.')
        }
    }

    @Transactional
    @GraphQLMutation(name = "generateCreditNoteVat")
    GraphQLResVal<Boolean> generateCreditNoteVat(
            @GraphQLArgument(name = "creditNoteId") UUID creditNoteId,
            @GraphQLArgument(name = "isVatable") Boolean isVatable,
            @GraphQLArgument(name = "vatValue") BigDecimal vatValue = 12
    ) {
        try{
            ArCreditNote creditNote = arCreditNoteService.findOne(creditNoteId)
            List<UUID> items = creditNoteItemUUIDList(creditNoteId)
            BigDecimal vatPercentage = vatValue ?: 12
            items.each {it->
                // Vat Items
                if(creditNote.isCWT)
                    applyVatCWT(it,isVatable,true,vatPercentage,creditNote.cwtRate)
                else
                    applyVat(it,isVatable,null)
            }
            // Vat Invoice
            creditNote.isVatable = isVatable
            arCreditNoteService.save(creditNote)
            arCreditNoteService.updateCreditNoteTotals(creditNoteId)
            return  new GraphQLResVal<Boolean>(true,true ,'Tax calculation was successful. Your invoice now reflects the updated total amount due.')
        }catch(ignored){
            return  new GraphQLResVal<Boolean>(false, false, 'Transaction failed: Calculation error. Please check your input and try again.')
        }
    }

    @Transactional
    @GraphQLMutation(name = "generateCreditNoteTax")
    GraphQLResVal<Boolean> generateCreditNoteTax(
            @GraphQLArgument(name = "creditNoteId") UUID creditNoteId,
            @GraphQLArgument(name = "taxType") String taxType,
            @GraphQLArgument(name = "rate") BigDecimal rate,
            @GraphQLArgument(name = "isApply") Boolean isApply = true
    ) {
        try{
            switch (taxType.toUpperCase()){
                case 'CWT':
                    ArCreditNote creditNote = arCreditNoteService.findOne(creditNoteId)
                    List<UUID> items = creditNoteItemUUIDList(creditNoteId)
                    items.each {it->
                        if(creditNote.isVatable)
                            applyVatCWT(it,creditNote.isVatable,isApply,null,rate)
                        else
                            applyCWT(it,isApply,rate)
                    }
                    creditNote.isCWT = isApply
                    creditNote.cwtRate = rate
                    arCreditNoteService.save(creditNote)
                    arCreditNoteService.updateCreditNoteTotals(creditNoteId)
                    return new GraphQLResVal<Boolean>(true, true, 'Tax calculation was successful. Your invoice now reflects the updated total amount due.')
                default:
                    return  new GraphQLResVal<Boolean>(false, false, 'Transaction failed: Calculation error. Please check your input and try again.')
            }
        }catch(ignored){
            return  new GraphQLResVal<Boolean>(false, false, 'Transaction failed: Calculation error. Please check your input and try again.')
        }
    }
}
