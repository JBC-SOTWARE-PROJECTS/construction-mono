package com.backend.gbp.rest.dto

class STSReportDto {
	String date, stsNo, issuing_location, receiving_location, project, issuedBy, receivedBy, projectTitle, remarks
}

class STSReportItemDto {
	String code, description, uom
	BigDecimal  issued
	BigDecimal unitCost, total
}
