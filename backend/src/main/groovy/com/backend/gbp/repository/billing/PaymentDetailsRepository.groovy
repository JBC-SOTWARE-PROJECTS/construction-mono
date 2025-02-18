package com.backend.gbp.repository.billing


import com.backend.gbp.domain.billing.DiscountDetails
import com.backend.gbp.domain.billing.PaymentDetails
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface PaymentDetailsRepository extends JpaRepository<PaymentDetails, UUID> {

}
