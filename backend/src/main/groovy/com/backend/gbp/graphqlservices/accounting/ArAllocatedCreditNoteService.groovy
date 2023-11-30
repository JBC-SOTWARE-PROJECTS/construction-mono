package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.ArAllocatedCreditNote
import com.backend.gbp.domain.accounting.ArCreditNote
import com.backend.gbp.graphqlservices.base.AbstractDaoCompanyService
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.services.GeneratorService
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

import javax.transaction.Transactional

@Service
@GraphQLApi
@Transactional(rollbackOn = Exception.class)
class ArAllocatedCreditNoteService extends  AbstractDaoCompanyService<ArAllocatedCreditNote> {

    ArAllocatedCreditNoteService(){
        super(ArAllocatedCreditNote.class)
    }

    @Autowired
    GeneratorService generatorService

    @Autowired
    ArCreditNoteService arCreditNoteService

    @Autowired
    ArInvoiceServices arInvoiceServices

    @Autowired
    ArInvoiceItemServices arInvoiceItemServices

    @Autowired
    ArTransactionLedgerServices arTransactionLedgerServices

    @GraphQLQuery(name="findOneArAllocatedCN")
    ArAllocatedCreditNote findOneArAllocatedCN(
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

    @Transactional
    Boolean allocateInvoiceItemAmount(ArCreditNote creditNote, UUID invoiceId, BigDecimal allocatedAmount){
        def invoice = arInvoiceServices.findOne(invoiceId)

        BigDecimal totalAmount = invoice.totalAmountDue?:0.00
        def invoiceItems = arInvoiceItemServices.findAllInvoiceItemsByInvoice(invoiceId)
        invoiceItems.each {
                BigDecimal amount = it.totalAmountDue ?: 0.00
                BigDecimal allocated = ((amount / totalAmount) * (allocatedAmount ?: 0.00)) ?: 0.00
                it.creditNote = (it.creditNote ?: 0.00) + allocated
                arInvoiceItemServices.save(it)
        }

        invoice.totalCreditNote = (invoice.totalCreditNote?:0.00) + allocatedAmount

        if(invoice.netTotalAmount == 0){
            invoice.status = 'PAID'
        }

        arInvoiceServices.save(invoice)

        ArCreditNote arCreditNote = new ArCreditNote()
        arCreditNote.creditNoteNo = creditNote.creditNoteNo
        arCreditNote.arCustomer = creditNote.arCustomer
        arCreditNote.createdDate = creditNote.createdDate
        arCreditNote.lastModifiedDate = creditNote.lastModifiedDate
        arCreditNote.creditNoteDate = creditNote.creditNoteDate
        arCreditNote.totalAmountDue = allocatedAmount
        arCreditNote.id = creditNote.id
        arTransactionLedgerServices.insertArCreditNoteTransactionLedger(arCreditNote)

        return true
    }

    @Transactional
    @GraphQLMutation(name = "allocateCreditNote")
    GraphQLResVal<ArCreditNote> arCreditNotePosting(
            @GraphQLArgument(name = "creditNoteId") UUID creditNoteId,
            @GraphQLArgument(name = "fields") List<Map<String,Object>> fields = []
    ) {
        try{
            def creditNote = arCreditNoteService.findOne(creditNoteId)
            if(fields.size() > 0){
                fields.each {
                    ArAllocatedCreditNote allocated = new ArAllocatedCreditNote()
                    updateFromMap(allocated, it)
                    def saved =  save(allocated)
                    allocateInvoiceItemAmount(creditNote,saved.invoice.id,saved.amountAllocate)
                }
            }
            creditNote.status = 'POSTED'
            arCreditNoteService.save(creditNote)
            arCreditNoteService.creditNotePosting(creditNote)
            return new GraphQLResVal<ArCreditNote>(creditNote, true, "Credit Note transaction completed successfully")
        }catch (e){
            return new GraphQLResVal<ArCreditNote>(null, false, "Credit Note transaction completed successfully")
        }

    }

    @GraphQLQuery(name='findInvoiceCreditNote')
    List<ArAllocatedCreditNote> findInvoiceCreditNote(
            @GraphQLArgument(name='invoiceId') UUID invoiceId
    ){
        try{
            createQuery("""
				Select p from ArAllocatedCreditNote p
				where p.invoice.id = :invoiceId
				order by p.createdDate
			""")
                    .setParameter('invoiceId',invoiceId)
                    .resultList
        }catch (ignored){
            return []
        }

    }

    @GraphQLQuery(name='findPNCreditNote')
    List<ArAllocatedCreditNote> findPNCreditNote(
            @GraphQLArgument(name='pnId') UUID pnId
    ){
        try{
            createQuery("""
				Select p from ArAllocatedCreditNote p
				where p.pnId = :pnId
				order by p.createdDate
			""")
                    .setParameter('pnId',pnId)
                    .resultList
        }catch (ignored){
            return []
        }
    }


}
