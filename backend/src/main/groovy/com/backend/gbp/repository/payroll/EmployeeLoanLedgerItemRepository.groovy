package com.backend.gbp.repository.payroll

import com.backend.gbp.domain.address.Country
import com.backend.gbp.domain.payroll.EmployeeLoanLedgerItem
import com.backend.gbp.domain.payroll.enums.EmployeeLoanCategory
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface EmployeeLoanLedgerItemRepository extends JpaRepository<EmployeeLoanLedgerItem, UUID> {


    @Query(value = """Select sum(l.debit - l.credit) from EmployeeLoanLedgerItem l where l.employee.id = :id and l.category = :category """)
    BigDecimal getBalanceByCategory(
            @Param("id") UUID filter,
            @Param("category") EmployeeLoanCategory category
    )

}