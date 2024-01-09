package com.backend.gbp.repository.payroll

import com.backend.gbp.domain.payroll.WithholdingTaxMatrix
import com.backend.gbp.domain.payroll.enums.PayrollType
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface WithholdingTaxMatrixRepository extends JpaRepository<WithholdingTaxMatrix, UUID> {

    @Query(value = '''SELECT a FROM WithholdingTaxMatrix a where
    a.company.id = :company 
           ''')
    List<WithholdingTaxMatrix> findByType(
            @Param("company") UUID company
    )
    @Query(value = '''SELECT a FROM WithholdingTaxMatrix a where
(((:amount >= a.minAmount) AND ((:amount <= a.maxAmount) OR (a.maxAmount IS NULL)) AND ((a.maxAmount IS NULL) OR (:amount <= a.maxAmount))))
and a.company.id = :company 
and a.type = :type
           ''')
    List<WithholdingTaxMatrix> findByAmountRangeAndType(
            @Param("amount") BigDecimal amount,
            @Param("type") PayrollType type,
            @Param("company") UUID company
    )
}