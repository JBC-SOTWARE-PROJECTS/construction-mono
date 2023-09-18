package com.backend.gbp.repository.payroll

import com.backend.gbp.domain.payroll.PayrollEmployeeContributionsView
import org.springframework.data.jpa.repository.JpaRepository

interface PayrollEmployeeContributionsViewRepository extends JpaRepository<PayrollEmployeeContributionsView, UUID> {

}
