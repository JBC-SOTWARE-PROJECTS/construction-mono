package com.backend.gbp.services.cashiering

import com.backend.gbp.domain.billing.BillingItem
import com.backend.gbp.domain.billing.DiscountDetails
import com.backend.gbp.domain.billing.DiscountDetailsType
import com.backend.gbp.domain.billing.PaymentDetails
import com.backend.gbp.domain.cashier.Payment
import com.backend.gbp.domain.cashier.PaymentItem
import com.backend.gbp.domain.cashier.Shift
import com.backend.gbp.graphqlservices.billing.BillingItemService
import com.backend.gbp.graphqlservices.billing.BillingService
import com.backend.gbp.graphqlservices.cashier.PaymentService
import com.backend.gbp.repository.UserRepository
import com.backend.gbp.repository.billing.PaymentDetailsRepository
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.security.SecurityUtils
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.GeneratorType
import com.backend.gbp.services.cashiering.base.Callback
import com.backend.gbp.services.cashiering.base.CallbackBillingItem
import com.backend.gbp.services.cashiering.base.PaymentAbstractHelper
import com.backend.gbp.services.cashiering.base.PaymentItemRecording
import com.backend.gbp.utils.BillingUtils
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLQuery
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

import javax.persistence.Column
import javax.transaction.Transactional
import java.time.Instant


@Service
class FolioTransactionService  extends PaymentAbstractHelper{


    @Autowired
    BillingService billingService

    @Autowired
    BillingItemService billingItemService

    @Autowired
    PaymentService paymentService

    @Autowired
    GeneratorService generatorService

    @Autowired
    PaymentDetailsRepository paymentDetailsRepository


    @Transactional(rollbackOn = Exception)
    Payment processFolioPayment(
            Payment paymentTracker, List<Map<String, Object>> tendered,
            List<Map<String, Object>> items, Map<String,Object> fields
    ) {
        def payment = new Payment()
        println "Processing payment method ..."
        paymentGateway(tendered,payment, { it -> paymentTracker = it as Payment } as Callback<Payment>)
        paymentTracker = paymentService.save(paymentTracker)

        println "Processing payment items ..."
        List<PaymentItem> trackerItems = []
        recordingPaymentItems(items,paymentTracker, false, { it ->
            paymentTracker = it['paymentTracker'] as Payment
            trackerItems = it['trackerItems'] as List<PaymentItem>
        } as Callback<PaymentItemRecording>)

        println "Processing payment or/ar ..."
        String receiptType = (fields["receiptType"] ?: "") as String
        String receiptNo = (fields["receiptNo"] ?: "") as String
        UUID shiftId = fields["shiftId"] ? UUID.fromString(fields["shiftId"].toString()) : null
        String batchId = (fields["batchId"] ?: "") as String
        processReceiptsIssuance(batchId, receiptType ,receiptNo ,shiftId, paymentTracker , { it -> paymentTracker = it as Payment } as Callback<Payment>)

        println "Processing billing payment..."
        String billingId = fields["billingId"] as String
        def billingItem = new BillingItem()
        processBillingTransaction(paymentTracker,billingId,trackerItems, { it, bi ->
            paymentTracker = it as Payment
            billingItem = bi as BillingItem
        } as CallbackBillingItem<Payment>)

        println "Processing cash basis ..."

        return  paymentTracker
    }


    List<PaymentItem> getFolioBalanceItems(UUID id){
        List<PaymentItem> paymentItems = []
        def billing =  billingService.findOne(id)
        def billingItems = billingItemService.billingItemProgressPaymentByParent(id)
        billingItems.each {
            def payment = 0.00
            def vat = 0.00
            def withholding_tax = 0.00
            def recoupment = 0.00
            def retention = 0.00
            def balance = it.subTotal

            it.discountDetails.each {
                dsc ->
                balance -= dsc.amount
                if(dsc.itemType == DiscountDetailsType.VAT)
                    vat += dsc.amount
                if(dsc.itemType == DiscountDetailsType.WITHHOLDING_TAX)
                    withholding_tax += dsc.amount
                if(dsc.itemType == DiscountDetailsType.RECOUPMENT)
                    recoupment += dsc.amount
                if(dsc.itemType == DiscountDetailsType.RETENTION)
                    retention += dsc.amount
            }

            it.paymentDetails.each {
                paid ->
                    balance -= paid.amount
                    payment += paid.amount
            }


            balance = BillingUtils.bankersRounding(balance)

            if(balance > 0) {
                def paymentItem = new PaymentItem()
                paymentItem.itemName = it.description
                paymentItem.description = ""
                paymentItem.unit = "pcs"
                paymentItem.qty = 1
                paymentItem.price = balance
                paymentItem.vat = vat
                paymentItem.vatExempt = BigDecimal.ZERO
                paymentItem.vatZero_rated_sales = BigDecimal.ZERO
                paymentItem.discount = BigDecimal.ZERO
                paymentItem.withholdingTax = withholding_tax
                paymentItem.retention = retention
                paymentItem.recoupment = recoupment
                paymentItem.amount = balance
                paymentItem.isVoided = BigDecimal.ZERO
                paymentItem.referenceItemType = "FOLIO"
                paymentItem.referenceItemId = it.id
                paymentItem.tmpSubTotal = it.subTotal
                paymentItem.tmpPayment = payment

                paymentItems << paymentItem
            }
        }

        return paymentItems
    }

    void processBillingTransaction(Payment paymentTracker, String billingIdStr, List<PaymentItem> pTrackerItems, CallbackBillingItem<Payment> callBack) {
        def callBackBillingItem = new BillingItem()
        /* For accounting entries */

        if(billingIdStr) {
            UUID billingId = UUID.fromString(billingIdStr)
            def billing = billingService.findOne(billingId)

            if (billing) {
                def customer = billing?.customer
                paymentTracker.billing = billing
                paymentTracker.payorName = customer?.customerName ?: billing.otcName
                paymentTracker.arCustomerId = customer?.id ?: null
                paymentTracker.transactionType = "Project Payment"
                paymentTracker.description = customer?.id ? "Projects Payment(s)" : "OTC Payment"

                List<PaymentItem> forProcessItems = []

                BigDecimal paidAmount = 0.00
                for (pItems in pTrackerItems) {
                    paidAmount = BillingUtils.bankersRounding(paidAmount + pItems.amount)
                }

                def billingItem = addPayment(
                        billingId,
                        paidAmount,
                        paymentTracker,
                        pTrackerItems
                )
                callBackBillingItem = billingItem
            }
        }
        if(callBack) callBack(paymentTracker as Payment,callBackBillingItem as BillingItem)
    }


    static void processPaidBillingItems(BillingItem billingItem, List<PaymentItem> pTrackerItems){
        pTrackerItems.each {
            def paid = new PaymentDetails();
            paid.billing = billingItem.billing
            paid.billingItem = billingItem
            paid.refBillItem = billingItemService.findOne(it.referenceItemId)
            paid.amount = it.amount
            paidountDetailsRepository.save(paid)
        }
    }

    BillingItem addPayment(UUID billingId, BigDecimal amount, Payment paymentTracker, List<PaymentItem> pTrackerItems, String customDescription = null) {

        def billing = billingService.findOne(billingId)

        def companyId = SecurityUtils.currentCompanyId()

        def billingItem = new BillingItem()

        billingItem.debit = 0
        billingItem.credit = 0
        billingItem.qty = 1
        billingItem.billing = billing
        billingItem.companyId = companyId
        billingItem.itemType = "PAYMENTS"

        billingItem.recordNo = generatorService.getNextValue(GeneratorType.BILLING_RECORD_NO) { Long next ->
            StringUtils.leftPad(next.toString(), 5, '0')
        }
        billingItem.status = true

        if (amount > 0) {
            billingItem.credit = amount
            billingItem.subTotal = amount * -1
        }
        else {
            billingItem.debit = amount * -1
            billingItem.subTotal = amount
        }

        if (customDescription)
            billingItem.description = customDescription
        else
            billingItem.description = "PAYMENT #${paymentTracker?.orNumber ?: ""}"

        if (paymentTracker) {
            pTrackerItems.each {
                def paid = new PaymentDetails()
                paid.billing = billingItem.billing
                paid.billingItem = billingItem
                paid.refBillItem = billingItemService.findOne(it.referenceItemId)
                paid.amount = it.amount
                paymentDetailsRepository.save(paid)
            }

        }
        billingItemService.save(billingItem)
    }
}
