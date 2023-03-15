package com.backend.gbp.repository.cashier

import com.backend.gbp.domain.cashier.PaymentTargetItem
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface PaymentTargetItemRepository extends JpaRepository<PaymentTargetItem, UUID> {

    @Query(value = "select q from PaymentTargetItem q where q.payment.id = :id")
    List<PaymentTargetItem> getTargetItemsByPayment(@Param('id') UUID id)

    @Query(value = "select q from PaymentTargetItem q")
    PaymentTargetItem getActiveShift(@Param('id') UUID id)

}
