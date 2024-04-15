package com.backend.gbp.rest.dto.payables


import groovy.transform.TupleConstructor

@TupleConstructor
class AccountPayableDetialsDto {

	String id
	Map<String, Object> transType
	Map<String, Object> office
	Map<String, Object> project
	Map<String, Object> assets

	BigDecimal amount
	BigDecimal discRate
	BigDecimal discAmount
	BigDecimal vatAmount
	Boolean vatInclusive
	String taxDesc

	BigDecimal ewtRate
	BigDecimal ewtAmount
	BigDecimal netAmount
	String remarksNotes
	String refNo
	Boolean isNew

}

class TransTypeDto{
	UUID id
	String description
}

class OfficeDto{
	UUID id
	String officeDescription
}

class ProjectDto{
	UUID id
	String description
}

class AssetDto{
	UUID id
	String description
}



