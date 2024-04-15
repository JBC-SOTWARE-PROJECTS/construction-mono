package com.backend.gbp.repository.inventory

import com.backend.gbp.domain.inventory.ReceivingReportItem
import org.springframework.data.jpa.repository.JpaRepository

interface ReceivingReportItemRepository extends JpaRepository<ReceivingReportItem, UUID> {


}
