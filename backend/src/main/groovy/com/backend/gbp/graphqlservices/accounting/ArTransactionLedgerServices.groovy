package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.ARPaymentPosting
import com.backend.gbp.domain.accounting.ArCreditNote
import com.backend.gbp.domain.accounting.ArInvoice
import com.backend.gbp.domain.accounting.ArTransactionLedger
import com.backend.gbp.domain.cashier.Payment
import com.backend.gbp.graphqlservices.base.AbstractDaoCompanyService
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.GeneratorType
import groovy.transform.Canonical
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.stereotype.Service

import javax.persistence.EntityManager
import javax.transaction.Transactional
import java.sql.Date

@Canonical
class ArTransactionLedgerRemainingBalanceDto {
    BigDecimal remainingBalanceSum
}

@Service
@GraphQLApi
@Transactional(rollbackOn = Exception.class)
class ArTransactionLedgerServices extends  AbstractDaoCompanyService<ArTransactionLedger> {

    ArTransactionLedgerServices(){
        super(ArTransactionLedger.class)
    }

    @Autowired
    EntityManager entityManager

    @Autowired
    GeneratorService generatorService

    @GraphQLQuery(name="customerRemainingBalance")
    ArTransactionLedgerRemainingBalanceDto customerRemainingBalance(
            @GraphQLArgument(name = "customerId") UUID customerId
    ){
        try{
            ArTransactionLedger ledger = entityManager.createQuery(""" 
                        Select 
                            i
                            from ArTransactionLedger i 
                            where i.arCustomerId = :customerId
                            ORDER BY i.recordNo DESC
            """,ArTransactionLedger.class)
                    .setParameter('customerId',customerId)
                    .setMaxResults(1)
                    .getSingleResult()
            if(!ledger)
                return new ArTransactionLedgerRemainingBalanceDto(
                        0.00,
                )

            return new ArTransactionLedgerRemainingBalanceDto(
                    ledger.remainingBalance
            )
        }
        catch (ignored) {
            return new ArTransactionLedgerRemainingBalanceDto(
                    0.00,
            )
        }
    }


    Boolean insertArInvoiceTransactionLedger(ArInvoice invoice, Boolean reverse = false){

        ArTransactionLedgerRemainingBalanceDto balanceDto = customerRemainingBalance(invoice.arCustomer.id)
        ArTransactionLedger ledger = new ArTransactionLedger()
        ledger.recordNo = generatorService.getNextValue(GeneratorType.AR_TRANS_LEDGER, {
            return StringUtils.leftPad(it.toString(), 6, "0")
        })
        ledger.docNo = invoice.invoiceNo
//        ledger.docType = reverse ? invoice?.isBeginningBalance ? 'BEGINNING BALANCE - VOIDED' : 'INVOICE-VOIDED' : invoice?.isBeginningBalance ? 'BEGINNING BALANCE' : 'INVOICE'
        ledger.docType = reverse ?  'INVOICE-VOIDED' :  'INVOICE'
        ledger.referenceNo = invoice.arCustomer.accountNo
        ledger.referenceType = 'CUSTOMER'

        ledger.arCustomerId = invoice.arCustomer.id
        ledger.arInvoiceId = invoice.id
        ledger.ledgerDate = invoice.createdDate
        ledger.docDate = reverse ? Date.from(invoice.lastModifiedDate)  : invoice.invoiceDate
        ledger.totalCwtAmount = reverse ? (invoice.cwtAmount?:0.00).negate() : invoice.cwtAmount?:0.00
        ledger.totalVatAmount = reverse ? (invoice.vatAmount?:0.00).negate() : invoice.vatAmount?:0.00
        ledger.totalAmountDue = reverse ? (invoice.totalAmountDue?:0.00).negate() : invoice.totalAmountDue?:0.00

        ledger.remainingBalance = (balanceDto?.remainingBalanceSum?:0.00) + ledger.totalAmountDue
        save(ledger)
    }



    Boolean insertArCreditNoteTransactionLedger(ArCreditNote creditNote, Boolean reverse = false){

        ArTransactionLedgerRemainingBalanceDto balanceDto = customerRemainingBalance(creditNote.arCustomer.id)
        ArTransactionLedger ledger = new ArTransactionLedger()
        ledger.recordNo = generatorService.getNextValue(GeneratorType.AR_TRANS_LEDGER, {
            return StringUtils.leftPad(it.toString(), 6, "0")
        })
        ledger.docNo = creditNote.creditNoteNo
        ledger.docType = reverse ? 'CN-VOIDED' : 'CN'
        ledger.referenceNo = creditNote.arCustomer.accountNo
        ledger.referenceType = 'CUSTOMER'

        ledger.arCustomerId = creditNote.arCustomer.id
        ledger.arCreditNoteId = creditNote.id

        ledger.ledgerDate = creditNote.createdDate
        ledger.docDate = reverse ? Date.from(creditNote.lastModifiedDate) : creditNote.creditNoteDate
        ledger.totalCwtAmount = reverse ?  creditNote.cwtAmount?:0.00 : (creditNote.cwtAmount?:0.00).negate()
        ledger.totalVatAmount = reverse ?  creditNote.vatAmount?:0.00 : (creditNote.vatAmount?:0.00).negate()
        ledger.totalAmountDue = reverse ?  (creditNote.totalAmountDue?:0.00) : (creditNote.totalAmountDue?:0.00).negate()

        ledger.remainingBalance = (balanceDto?.remainingBalanceSum?:0.00) + ledger.totalAmountDue
        save(ledger)
    }

    Boolean insertArPaymentTransactionLedger(Payment paymentTracker, ARPaymentPosting paymentPosting, Boolean reverse = false){

        ArTransactionLedgerRemainingBalanceDto balanceDto = customerRemainingBalance(paymentPosting.arCustomerId)
        ArTransactionLedger ledger = new ArTransactionLedger()
        ledger.recordNo = generatorService.getNextValue(GeneratorType.AR_TRANS_LEDGER, {
            return StringUtils.leftPad(it.toString(), 6, "0")
        })
        ledger.docNo = paymentPosting.recordNo
        ledger.docType = reverse ? 'PAYMENT-VOIDED' : 'PAYMENT'
        ledger.referenceNo = paymentTracker.orNumber
        ledger.referenceType = paymentTracker.receiptType

        ledger.arCustomerId = paymentPosting.arCustomerId
        ledger.arInvoiceId = paymentPosting?.invoiceId ?: null
        ledger.arPaymentId = paymentPosting.id

        ledger.ledgerDate = paymentPosting.createdDate
        ledger.docDate = reverse ? Date.from(paymentPosting.lastModifiedDate)  :Date.from(paymentPosting.paymentDatetime)
        ledger.totalCwtAmount = 0.00
        ledger.totalVatAmount = 0.00
        ledger.totalAmountDue = !reverse ? (paymentPosting.paymentAmount?:0.00).negate() : paymentPosting.paymentAmount?:0.00

        ledger.remainingBalance = (balanceDto?.remainingBalanceSum?:0.00) + ledger.totalAmountDue
        save(ledger)
    }


    @GraphQLQuery(name="arTransactionLedgerPage")
    Page<ArTransactionLedger> arTransactionLedgerPage (
            @GraphQLArgument(name = "customerId") UUID customerId,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ){
        Map<String,Object> params = [:]
        params['customerId'] = customerId

        getPageable(
                """ Select c from ArTransactionLedger c where c.arCustomerId = :customerId order by c.createdDate desc""",
                """ Select count(c) from ArTransactionLedger c where c.arCustomerId = :customerId""",
                page,
                size,
                params
        )
    }


}
