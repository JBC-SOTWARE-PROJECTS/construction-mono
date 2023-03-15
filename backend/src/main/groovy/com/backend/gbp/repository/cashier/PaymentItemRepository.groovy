package com.backend.gbp.repository.cashier


import com.backend.gbp.domain.cashier.PaymentItems
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface PaymentItemRepository extends JpaRepository<PaymentItems, UUID> {

    @Query(value = "select q from PaymentItems q where q.paymentid = :id and q.itemType = :type")
    List<PaymentItems> getPaymentItemsByPayment(@Param('id') UUID id, @Param('type') String type)

    @Query(value = "select coalesce(sum(q.outputTax),0) from PaymentItems q where q.paymentid = :id and q.itemType = :type")
    BigDecimal getOutputTax(@Param('id') UUID id, @Param('type') String type)

    @Query(value = "select coalesce(sum(q.amount), 0)  from PaymentItems q where q.paymentid = :id and q.itemType = :type")
    BigDecimal getVatableNonVatable(@Param('id') UUID id, @Param('type') String type)

}
