package com.backend.gbp.repository.payroll

import com.backend.gbp.domain.payroll.AdjustmentCategory
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface AdjustmentCategoryRepository extends JpaRepository<AdjustmentCategory, UUID> {

    @Query(
            value = """Select a from AdjustmentCategory a 
where a.isDefault = true and
lower(a.name) like lower(concat('%',:filter,'%'))
"""
    )
    List<AdjustmentCategory> getDefaults(@Param("filter") String filter)

    @Query(
            value = """Select a from AdjustmentCategory a 
where a.isDefault = false 
and a.company.id = :company and
lower(a.name) like lower(concat('%',:filter,'%'))
 """
    )
    List<AdjustmentCategory> getByCompanyId(@Param("company") UUID company, @Param("filter") String filter)

}