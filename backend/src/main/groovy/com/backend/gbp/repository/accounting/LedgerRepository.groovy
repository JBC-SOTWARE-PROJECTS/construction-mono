package com.backend.gbp.repository.accounting

import com.backend.gbp.domain.accounting.Ledger
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Modifying
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface LedgerRepository extends JpaRepository<Ledger, UUID> {

    @Modifying
    @Query("delete from Ledger b where b.id=:id")
    void deleteLedger(@Param("id") UUID id);
}
