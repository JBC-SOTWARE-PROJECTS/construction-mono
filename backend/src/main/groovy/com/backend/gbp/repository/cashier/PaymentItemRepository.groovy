package com.backend.gbp.repository.cashier


import com.backend.gbp.domain.cashier.PaymentItem
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface PaymentItemRepository extends JpaRepository<PaymentItem, UUID> {

    @Query(value = "select q from PaymentItem q where q.id = :id and q.referenceItemType = :type")
    List<PaymentItem> getPaymentItemsByPayment(@Param('id') UUID id, @Param('type') String type)

    @Query(value = "select coalesce(sum(q.withholdingTax),0) from PaymentItem q where q.id = :id and q.referenceItemType = :type")
    BigDecimal getOutputTax(@Param('id') UUID id, @Param('type') String type)

    @Query(value = "select coalesce(sum(q.amount), 0)  from PaymentItem q where q.id = :id and q.referenceItemType = :type")
    BigDecimal getVatableNonVatable(@Param('id') UUID id, @Param('type') String type)

}
