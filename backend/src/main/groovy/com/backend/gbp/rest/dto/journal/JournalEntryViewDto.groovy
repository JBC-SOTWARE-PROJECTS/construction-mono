package com.backend.gbp.rest.dto.journal

import groovy.transform.TupleConstructor

@TupleConstructor
class JournalEntryViewDto {
	String code
	String desc
	BigDecimal debit
	BigDecimal credit
}


