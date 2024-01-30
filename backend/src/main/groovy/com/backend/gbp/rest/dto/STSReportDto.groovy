package com.backend.gbp.rest.dto

class STSReportDto {
	String date, stsNo, issuing_location, receiving_location, project, issuedBy, receivedBy
}

class STSReportItemDto {
	String code, description, uom
	Integer  issued
	BigDecimal unitCost, total
}
