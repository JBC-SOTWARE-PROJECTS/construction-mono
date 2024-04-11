package com.backend.gbp.rest.dto.payables

import com.backend.gbp.domain.Office
import com.backend.gbp.domain.accounting.AccountsPayable
import com.backend.gbp.domain.accounting.Bank
import com.backend.gbp.domain.accounting.Disbursement
import com.backend.gbp.domain.accounting.ExpenseTransaction
import com.backend.gbp.domain.accounting.PettyCashAccounting
import com.backend.gbp.domain.assets.Assets
import com.backend.gbp.domain.projects.Projects
import groovy.transform.TupleConstructor

import java.time.Instant

@TupleConstructor
class DisbursementDto {
	String id
	Bank bank
	String bankBranch
	String checkNo
	Instant checkDate
	BigDecimal amount
	Boolean isNew
}

class DisbursementApDto{
	UUID id
	AccountsPayable payable
	BigDecimal appliedAmount
	BigDecimal vatRate
	Boolean vatInclusive
	BigDecimal vatAmount
	String ewtDesc
	BigDecimal ewtRate
	BigDecimal ewtAmount
	BigDecimal grossAmount
	BigDecimal discount
	BigDecimal netAmount
	Boolean isNew
}

class DisbursementExpDto{
	String id
	ExpenseTransaction transType
	Office office
	Projects project
	Assets assets
	BigDecimal amount
	String remarks
	Boolean	isNew
}

class DisbursementWtxDto {
	String id
	String ewtDesc
	BigDecimal appliedAmount
	Integer vatRate
	Boolean vatInclusive
	BigDecimal vatAmount
	BigDecimal ewtRate
	BigDecimal ewtAmount
	BigDecimal grossAmount
	BigDecimal netAmount
	Boolean isNew
}


class DisbursementPettyDto{
	String id
	PettyCashAccounting pettyCashAccounting
	BigDecimal amount
	Boolean	isNew
}

