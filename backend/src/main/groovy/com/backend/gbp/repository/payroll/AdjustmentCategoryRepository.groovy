package com.backend.gbp.repository.payroll

import com.backend.gbp.domain.payroll.AdjustmentCategory
import com.backend.gbp.domain.payroll.PayrollAdjustmentItem
import org.springframework.data.jpa.repository.JpaRepository

interface AdjustmentCategoryRepository extends JpaRepository<AdjustmentCategory, UUID> {

}