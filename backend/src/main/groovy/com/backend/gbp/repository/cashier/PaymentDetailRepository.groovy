package com.backend.gbp.repository.cashier

import com.backend.gbp.domain.cashier.PaymentDetails
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface PaymentDetailRepository extends JpaRepository<PaymentDetails, UUID> {

    @Query(value = "select q from PaymentDetails q where q.payment.id = :id")
    List<PaymentDetails> getDetailsById(@Param('id') UUID id)

    @Query(value = "select q from PaymentDetails q")
    PaymentDetails getActiveShift(@Param('id') UUID id)

}
