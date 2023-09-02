package com.backend.gbp.repository.payroll

import com.backend.gbp.domain.payroll.HDMFContribution
import org.springframework.data.jpa.repository.JpaRepository

interface HDMFContributionRepository extends JpaRepository<HDMFContribution, UUID>{


}