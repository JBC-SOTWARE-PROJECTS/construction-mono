package com.backend.gbp.repository.billing


import com.backend.gbp.domain.billing.DiscountDetails
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface DiscountDetailsRepository extends JpaRepository<DiscountDetails, UUID> {

	@Query(value = '''select q from DiscountDetails q where q.billingItem.id = :id''')
	List<DiscountDetails> getItemDiscountsByBillingItem(@Param('id') UUID id)

	@Query(value = '''select q from DiscountDetails q where q.refBillItem.id = :id''')
	List<DiscountDetails> getItemDiscountsByRefBillingItem(@Param('id') UUID id)
}
