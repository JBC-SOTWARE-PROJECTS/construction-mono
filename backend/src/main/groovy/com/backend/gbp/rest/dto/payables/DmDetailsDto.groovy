package com.backend.gbp.rest.dto.payables

import com.backend.gbp.domain.Office
import com.backend.gbp.domain.accounting.ExpenseTransaction
import com.backend.gbp.domain.projects.Projects
import groovy.transform.TupleConstructor

@TupleConstructor
class DmDetailsDto{
	String id
	ExpenseTransaction transType
	Office office
	Projects project
	String type
	BigDecimal percent
	BigDecimal amount
	String remarks
	Boolean	isNew
}


