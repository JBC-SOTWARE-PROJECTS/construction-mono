package com.backend.gbp.repository.payroll

import com.backend.gbp.domain.payroll.SSSContribution
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface SSSContributionRepository extends JpaRepository<SSSContribution, UUID> {

    @Query(value = '''SELECT a FROM payroll.sss_contribution  a 
           WHERE :minAmount <= a.max_amount AND :maxAmount >= a.min_amount 
             AND (:id = '' OR CAST(a.id as text) != :id)
           ''', nativeQuery = true)
    List<SSSContribution> findMinAndMaxOverlaps(@Param("minAmount") BigDecimal minAmount,
                                                @Param("maxAmount") BigDecimal maxAmount,
                                                @Param("id") String id
    )

}