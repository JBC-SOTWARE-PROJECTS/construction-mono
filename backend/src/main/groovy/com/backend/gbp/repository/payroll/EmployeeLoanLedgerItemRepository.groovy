package com.backend.gbp.repository.payroll

import com.backend.gbp.domain.payroll.EmployeeLoan
import com.backend.gbp.domain.payroll.EmployeeLoanLedgerItem
import com.backend.gbp.domain.payroll.enums.EmployeeLoanCategory
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface EmployeeLoanLedgerItemRepository extends JpaRepository<EmployeeLoanLedgerItem, UUID> {



}