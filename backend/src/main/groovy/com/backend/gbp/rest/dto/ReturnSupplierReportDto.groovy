package com.backend.gbp.rest.dto

import groovy.transform.TupleConstructor

@TupleConstructor
class ReturnSuppItemReportDto {
	String stockCode, itemDesc, uom, reasonForReturn, srrNo
	BigDecimal quantityReturn
}

@TupleConstructor
class ReturnSuppReportDto {
	String date, rts, refNo, supplierCode, supplierName, returnBy, returnDate, receivedBy, receivedDate
}
