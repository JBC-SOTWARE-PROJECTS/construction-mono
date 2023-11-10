package com.backend.gbp.rest.dto

import com.backend.gbp.domain.Office

import java.time.Instant

class LedgerDto {
	Office sourceOffice
	Office destinationOffice
	UUID documentTypes
	UUID item
	String referenceNo
	Instant ledgerDate
	Integer ledgerQtyIn
	Integer ledgerQtyOut
	Integer ledgerPhysical
	BigDecimal ledgerUnitCost
	Boolean isInclude
}

class RawLedgerDto {
	String id
	Office source
	Office destination
	String itemId
	String typeId
	String type
	String ledgerNo
	Integer qty
	Integer physical
	BigDecimal unitcost
	String date
}
