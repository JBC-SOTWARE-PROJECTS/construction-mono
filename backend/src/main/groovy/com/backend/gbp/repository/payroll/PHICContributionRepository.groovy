package com.backend.gbp.repository.payroll

import com.backend.gbp.domain.payroll.PHICContribution
import org.springframework.data.jpa.repository.JpaRepository

interface PHICContributionRepository extends JpaRepository<PHICContribution, UUID> {

}