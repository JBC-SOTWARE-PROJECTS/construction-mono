package com.backend.gbp.rest.dto

import groovy.transform.Canonical

@Canonical
class ARInvoiceDto {
	String itemName
	String description
	Integer qty
	BigDecimal unit_price
	BigDecimal amount
}

@Canonical
class ARInvoiceBankDto {
	String bank_name
	String bank_branch
	String bank_account
}



class ARInvoiceFieldsDto {
	String customer_account_number
	String customer_name
	String invoice_number
	String invoice_date
	String customer_address
	String invoice_intro
	String due_date
	String prepared_by
	String noted_by
	String notes
}

class ARSoaFieldsDto {
	String customer_account_number
	String customer_name
	String statement_number
	String statement_date
	String customer_address
	String statement_intro
	String prepared_by
	String noted_by
	String notes
}

@Canonical
class ArCreditNoteItemsDTO {
	String itemName
	String description
	Integer qty
	BigDecimal unit_price
	BigDecimal amount
}


@Canonical
class ArCreditNoteJournalEntryDTO {
	String transactionDate
	String referenceNo
	String accountCode
	String accountName
	BigDecimal debit
	BigDecimal credit
}


class ARCreditNoteFieldsDto {
	String customer_account_number
	String customer_name
	String customer_address
	String cn_number
	String cn_date
	String prepared_by
	String noted_by
	String audited_by
	String approved_by
}