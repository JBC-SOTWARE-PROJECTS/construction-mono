package com.backend.gbp.repository.inventory

import com.backend.gbp.domain.inventory.ReceivingReport
import org.springframework.data.jpa.repository.JpaRepository

interface ReceivingRepository extends JpaRepository<ReceivingReport, UUID> {


}
