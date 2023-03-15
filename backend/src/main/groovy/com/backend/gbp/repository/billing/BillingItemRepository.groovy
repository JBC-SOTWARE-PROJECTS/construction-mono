package com.backend.gbp.repository.billing


import com.backend.gbp.domain.billing.BillingItem
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface BillingItemRepository extends JpaRepository<BillingItem, UUID> {


}
