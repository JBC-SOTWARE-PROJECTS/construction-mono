package com.backend.gbp.repository.cashier

import com.backend.gbp.domain.cashier.Payment
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface PaymentRepository extends JpaRepository<Payment, UUID> {

    @Query(value = "select q from Payment q where q.billing.id = :id")
    List<Payment> getPaymentByBillingId(@Param('id') UUID id)

    @Query(value = "select q from Payment q where q.shift.id = :id and (lower(q.billingItem.recordNo) like lower(concat('%',:filter,'%')) OR lower(q.description) like lower(concat('%',:filter,'%'))) ")
    List<Payment> paymentsByShift(@Param('id') UUID id, @Param('filter') String filter)

    @Query(value = "select q from Payment q where q.shift.id = :id and (q.voided is null or q.voided = false) and q.receiptType in (:rctype) order by q.orNumber")
    List<Payment> getPaymentByShiftActiveOR(@Param('id') UUID id, @Param('rctype') List<String> rctype)

    @Query(value = "select q from Payment q where q.shift.id = :id and q.voided = true and q.receiptType in (:rctype) order by q.orNumber")
    List<Payment> getPaymentByShiftVoidOR(@Param('id') UUID id, @Param('rctype') List<String> rctype)

}
