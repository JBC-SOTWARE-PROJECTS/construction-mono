package com.backend.gbp.repository.accounting

import com.backend.gbp.domain.accounting.Bank
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository
import org.springframework.data.jpa.repository.Query
import org.springframework.data.repository.query.Param

interface BankRepository extends JpaRepository<Bank, UUID> {
	
	@Query(value = """
    Select c from Bank c  where (lower(c.bankname) like lower(concat('%',:filter,'%'))
    or
    lower(c.accountNumber) like lower(concat('%',:filter,'%'))) and c.companyId = :company
""",
			countQuery = """
     Select count(c) from Bank c  where (lower(c.bankname) like lower(concat('%',:filter,'%'))
     or
    lower(c.accountNumber) like lower(concat('%',:filter,'%'))) and c.companyId = :company
""")
	Page<Bank> getBanks(@Param("filter") String filter, @Param("company") UUID company,
                        Pageable page)

	@Query(value = """Select c from Bank c  where c.companyId = :company""")
	List<Bank> getBankList(@Param("company") UUID company)
}
