package com.backend.gbp.repository.inventory

import com.backend.gbp.domain.inventory.QuantityAdjustment
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface QuantityAdjustmentRepository extends JpaRepository<QuantityAdjustment, UUID> {
	
	@Query(value = "select q from QuantityAdjustment q where q.item.id = :id and q.company = :company")
	List<QuantityAdjustment> getAdjustById(@Param('id') UUID id, @Param('company') UUID company)
	
}
