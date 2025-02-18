package com.backend.gbp.services.cashiering.base

import com.backend.gbp.domain.billing.BillingItem
import com.backend.gbp.domain.cashier.Payment
import com.backend.gbp.domain.cashier.PaymentDetails
import com.backend.gbp.domain.cashier.PaymentItem
import com.backend.gbp.domain.cashier.PaymentType
import com.backend.gbp.domain.cashier.ReceiptType
import com.backend.gbp.domain.cashier.Shift
import com.backend.gbp.graphqlservices.cashier.BatchService
import com.backend.gbp.graphqlservices.cashier.PaymentItemService
import com.backend.gbp.graphqlservices.cashier.ShiftService
import com.backend.gbp.services.EntityObjectMapperService
import org.springframework.beans.factory.annotation.Autowired

interface Callback<T> {
    T call(T entity, Map<String,Object> fields)
    T call(T entity, BigDecimal fields)
    T call(T entity)
}

interface CallbackBillingItem<T> {
    T call(T entity, BillingItem billingItem)
    T call(T entity)
}


class PaymentItemRecording {
    List<PaymentItem> trackerItems
    Payment paymentTracker
}

abstract  class PaymentAbstractHelper {

    @Autowired
    EntityObjectMapperService entityObjectMapperService

    @Autowired
    PaymentItemService paymentItemService

    @Autowired
    ShiftService shiftService

    @Autowired
    BatchService batchService

    void paymentGateway(List<Map<String, Object>> tendered, Payment paymentTracker, Callback<Payment> callBack) {

        List<PaymentDetails> paymentMethods = []
        BigDecimal totalCash = 0.00
        BigDecimal totalCheck = 0.00
        BigDecimal totalCard = 0.00
        BigDecimal totalDeposit = 0.00
        BigDecimal totalEWallet = 0.00

        if(tendered.size() == 0)
            throw  new Exception("Method: No payment method.")

        tendered.each {
            map ->
                def payTrackerDetail = new PaymentDetails()
                payTrackerDetail.payment = paymentTracker
                entityObjectMapperService.updateFromMap(payTrackerDetail, map)

                if (payTrackerDetail.type == PaymentType.CASH)
                    totalCash += payTrackerDetail.amount

                if (payTrackerDetail.type == PaymentType.CHECK)
                    totalCheck += payTrackerDetail.amount

                if (payTrackerDetail.type == PaymentType.CARD)
                    totalCard += payTrackerDetail.amount

                if (payTrackerDetail.type == PaymentType.BANKDEPOSIT)
                    totalDeposit += payTrackerDetail.amount

                if (payTrackerDetail.type == PaymentType.EWALLET)
                    totalEWallet += payTrackerDetail.amount

                paymentMethods << payTrackerDetail
        }

        paymentTracker.paymentDetails = paymentMethods
        paymentTracker.totalCash = totalCash
        paymentTracker.totalCheck = totalCheck
        paymentTracker.totalCard = totalCard
        paymentTracker.totalDeposit = totalDeposit
        paymentTracker.totalEWallet = totalEWallet

        paymentTracker.totalPayments = (paymentTracker.totalCash + paymentTracker.totalCheck + paymentTracker.totalCard + paymentTracker.totalDeposit + paymentTracker.totalEWallet)


        if(callBack) callBack(paymentTracker)
    }

    void recordingPaymentItems(List<Map<String, Object>> items, Payment paymentTracker,Boolean isValidate = true,Callback<PaymentItemRecording> callBack){
        List<PaymentItem> list = []

        if(isValidate){
            if(items.size() == 0)
                throw new Exception("Payment failed. Please select an item before proceeding.")
        }

        items.each {map ->
            PaymentItem trackerItem = new PaymentItem()
            entityObjectMapperService.updateFromMap(trackerItem, map)
            trackerItem.paymentTrackerId = paymentTracker.id
            def newItem = paymentItemService.save(trackerItem)

            paymentTracker.change = paymentTracker.totalPayments - (paymentTracker.totalCash + paymentTracker.totalCheck + paymentTracker.totalCard + paymentTracker.totalDeposit + paymentTracker.totalEWallet)
            list << newItem
        }

        if(paymentTracker.totalPayments <= 0)
            throw new Exception("Payment failed. Please add an amount before proceeding.")

        PaymentItemRecording recording = new PaymentItemRecording()
        recording.trackerItems = list
        recording.paymentTracker = paymentTracker
        if(callBack) callBack(recording)
    }

    void processReceiptsIssuance(
            String batchReceiptId,
            String receiptType,
            String receiptNo,
            UUID shiftId, Payment paymentTracker, Callback<Payment> callBack){

        if(!batchReceiptId){
            throw  new Error("Method: No batch receipts.")
        }

        paymentTracker.orNumber = receiptNo
        paymentTracker.receiptType = ReceiptType.valueOf(receiptType)
        paymentTracker.shift = shiftService.findOne(shiftId)

        UUID batchId = UUID.fromString(batchReceiptId)
        def receiptIssuance = batchService.findOne(batchId)
        receiptIssuance.receiptCurrentNo++

        if (receiptIssuance.receiptCurrentNo > receiptIssuance.rangeEnd) {
            receiptIssuance.receiptCurrentNo = null
            receiptIssuance.active = false
        }
        batchService.save(receiptIssuance)

        if(callBack) callBack(paymentTracker)
    }

}
