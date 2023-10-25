package com.backend.gbp.rest.dto.payables

import com.backend.gbp.domain.Office
import com.backend.gbp.domain.accounting.ExpenseTransaction
import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.domain.projects.Projects
import groovy.transform.TupleConstructor

@TupleConstructor
class PCVItemsDto {
	String id
	Item item
	Office office
	Projects project
	Integer qty
	BigDecimal unitCost
	BigDecimal discRate
	BigDecimal discAmount
	BigDecimal netAmount
	Boolean isVat
	BigDecimal vatAmount
	Boolean	isNew
}

class PCVOthersDto{
	String id
	ExpenseTransaction transType
	Office office
	Projects project
	BigDecimal amount
	String remarks
	Boolean	isNew
}


