package com.backend.gbp.repository.accounting

import com.backend.gbp.domain.accounting.AccountsPayable
import org.springframework.data.jpa.repository.JpaRepository

interface AccountPayeableRepository extends JpaRepository<AccountsPayable, UUID> {

}