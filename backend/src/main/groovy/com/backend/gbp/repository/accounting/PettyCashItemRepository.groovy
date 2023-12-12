package com.backend.gbp.repository.accounting

import com.backend.gbp.domain.accounting.PettyCashItem
import org.springframework.data.jpa.repository.JpaRepository

interface PettyCashItemRepository extends JpaRepository<PettyCashItem, UUID> {

}
