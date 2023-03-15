package com.backend.gbp.repository.cashier

import com.backend.gbp.domain.cashier.PaymentDetial
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface PaymentDetailRepository extends JpaRepository<PaymentDetial, UUID> {

    @Query(value = "select q from PaymentDetial q where q.payment.id = :id")
    List<PaymentDetial> getDetailsById(@Param('id') UUID id)

    @Query(value = "select q from PaymentDetial q")
    PaymentDetial getActiveShift(@Param('id') UUID id)

}
