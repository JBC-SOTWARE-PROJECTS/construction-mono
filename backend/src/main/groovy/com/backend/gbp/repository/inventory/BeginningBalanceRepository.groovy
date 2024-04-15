package com.backend.gbp.repository.inventory

import com.backend.gbp.domain.inventory.BeginningBalance
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface BeginningBalanceRepository extends JpaRepository<BeginningBalance, UUID> {
	
	@Query(value = "select q from BeginningBalance q where q.item.id = :id and q.company = :company")
	List<BeginningBalance> getBeginningById(@Param('id') UUID id, @Param('company') UUID company)

	@Query(value = "select q from BeginningBalance q where q.item.id = :id and q.office.id = :office and q.company = :company")
	List<BeginningBalance> getBeginningByIdLocation(@Param('id') UUID id, @Param('office') UUID office, @Param('company') UUID company)

	@Query(value = "select q from BeginningBalance q where q.item.id = :id and q.isPosted = true and q.company = :company")
	List<BeginningBalance> getBeginningByIdPosted(@Param('id') UUID id, @Param('company') UUID company)

	@Query(value = "select q from BeginningBalance q where q.item.id = :id and q.office.id = :office and q.isPosted = true and q.company = :company")
	List<BeginningBalance> getBeginningByItemLocationPosted(@Param('id') UUID id, @Param('office') UUID office, @Param('company') UUID company)
	
}
