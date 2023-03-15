package com.backend.gbp.repository.billing

import com.backend.gbp.domain.billing.Billing
import org.springframework.data.jpa.repository.JpaRepository

interface BillingRepository extends JpaRepository<Billing, UUID> {



}
