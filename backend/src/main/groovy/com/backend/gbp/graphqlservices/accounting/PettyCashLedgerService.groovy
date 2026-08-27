package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.PettyCashAccounting
import com.backend.gbp.domain.accounting.PettyCashCashIn
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.security.SecurityUtils
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.security.access.AccessDeniedException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

import java.math.RoundingMode
import java.time.Instant

import groovy.transform.Canonical

@Canonical
class PettyCashLedgerEntry {
	@GraphQLQuery
	UUID id
	@GraphQLQuery
	Instant transactionDate
	@GraphQLQuery
	String entryType
	@GraphQLQuery
	String referenceNo
	@GraphQLQuery
	String description
	@GraphQLQuery
	BigDecimal cashIn
	@GraphQLQuery
	BigDecimal cashOut
	@GraphQLQuery
	BigDecimal runningBalance
}

@Canonical
class PettyCashLedger {
	@GraphQLQuery
	List<PettyCashLedgerEntry> entries
	@GraphQLQuery
	BigDecimal cashInTotal
	@GraphQLQuery
	BigDecimal cashOutTotal
	@GraphQLQuery
	BigDecimal cashOnHand
}

@Service
@GraphQLApi
class PettyCashLedgerService extends AbstractDaoService<PettyCashCashIn> {

	PettyCashLedgerService() {
		super(PettyCashCashIn.class)
	}

	@GraphQLQuery(name = "pettyCashCashIns")
	List<PettyCashCashIn> pettyCashCashIns() {
		UUID company = currentCompany()
		return createQuery("""
			select cashIn from PettyCashCashIn cashIn
			where cashIn.company = :company
			order by cashIn.transDate desc, cashIn.createdDate desc
		""", [company: company]).resultList
	}

	/**
	 * The ledger is deliberately calculated from source transactions. This keeps a
	 * voided or draft PCV out of the on-hand balance without a second reversal row.
	 */
	@GraphQLQuery(name = "pettyCashLedger")
	@Transactional(readOnly = true)
	PettyCashLedger pettyCashLedger() {
		UUID company = currentCompany()
		List<PettyCashLedgerEntry> entries = []

		pettyCashCashIns().each { cashIn ->
			entries << new PettyCashLedgerEntry(
				cashIn.id,
				cashIn.transDate,
				"CASH_IN",
				cashIn.referenceNo,
				cashIn.description,
				amount(cashIn.amount),
				BigDecimal.ZERO,
				BigDecimal.ZERO
			)
		}

		def postedVouchersQuery = createGenericQuery("""
			select voucher from PettyCashAccounting voucher
			where voucher.company = :company and voucher.posted = true
		""")
		postedVouchersQuery.setParameter("company", company)
		List<PettyCashAccounting> postedVouchers = postedVouchersQuery.resultList
		postedVouchers.each { voucher ->
			entries << new PettyCashLedgerEntry(
				voucher.id,
				voucher.pcvDate,
				"PETTY_CASH_VOUCHER",
				voucher.pcvNo,
				voucher.payeeName ?: voucher.remarks,
				BigDecimal.ZERO,
				amount(voucher.amountUsed),
				BigDecimal.ZERO
			)
		}

		entries.sort { left, right ->
			def dateCompare = (left.transactionDate ?: Instant.EPOCH) <=> (right.transactionDate ?: Instant.EPOCH)
			dateCompare ?: (left.entryType <=> right.entryType) ?: (left.referenceNo <=> right.referenceNo)
		}

		BigDecimal runningBalance = BigDecimal.ZERO
		entries.each { entry ->
			runningBalance = runningBalance + entry.cashIn - entry.cashOut
			entry.runningBalance = runningBalance
		}

		new PettyCashLedger(
			entries,
			entries.sum(BigDecimal.ZERO) { it.cashIn } ?: BigDecimal.ZERO,
			entries.sum(BigDecimal.ZERO) { it.cashOut } ?: BigDecimal.ZERO,
			runningBalance
		)
	}

	@GraphQLMutation(name = "upsertPettyCashCashIn")
	@Transactional(rollbackFor = Exception.class)
	PettyCashCashIn upsertPettyCashCashIn(
			@GraphQLArgument(name = "id") UUID id,
			@GraphQLArgument(name = "fields") Map<String, Object> fields
	) {
		UUID company = currentCompany()
		PettyCashCashIn cashIn = id ? cashInInCurrentCompany(id, company) : new PettyCashCashIn()
		Map<String, Object> permittedFields = new HashMap<>(fields ?: [:])
		permittedFields.remove("id")
		permittedFields.remove("company")
		permittedFields.remove("createdBy")
		permittedFields.remove("createdDate")
		permittedFields.remove("lastModifiedBy")
		permittedFields.remove("lastModifiedDate")
		updateFromMap(cashIn, permittedFields)
		cashIn.company = company
		cashIn.transDate = cashIn.transDate ?: Instant.now()
		cashIn.amount = amount(cashIn.amount)
		if (cashIn.amount <= BigDecimal.ZERO) {
			throw new IllegalArgumentException("Cash In amount must be greater than zero")
		}
		return save(cashIn)
	}

	private PettyCashCashIn cashInInCurrentCompany(UUID id, UUID company) {
		def cashIn = createQuery("""
			select cashIn from PettyCashCashIn cashIn
			where cashIn.id = :id and cashIn.company = :company
		""", [id: id, company: company]).resultList.find()
		if (!cashIn) {
			throw new AccessDeniedException("Cash In entry was not found in the current company")
		}
		return cashIn
	}

	private UUID currentCompany() {
		UUID company = SecurityUtils.currentCompanyId()
		if (!company) {
			throw new AccessDeniedException("A company context is required for petty cash")
		}
		return company
	}

	private static BigDecimal amount(BigDecimal value) {
		return (value ?: BigDecimal.ZERO).setScale(2, RoundingMode.HALF_EVEN)
	}
}
