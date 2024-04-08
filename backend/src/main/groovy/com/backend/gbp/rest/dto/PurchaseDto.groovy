package com.backend.gbp.rest.dto

import com.backend.gbp.domain.Office
import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.domain.inventory.PurchaseOrderItems
import groovy.transform.TupleConstructor

import java.time.Instant

@TupleConstructor
class PurchaseDto {
	UUID id
	Item item
	String unitMeasurement
	BigDecimal requestedQty
	BigDecimal unitCost
	BigDecimal onHandQty
	String remarks
	Boolean isNew
}

class PurchasePODto {
	UUID id
	Item item
	String unitMeasurement
	BigDecimal quantity
	BigDecimal unitCost
	String prNos
	String type
	String type_text
	Boolean isNew
}

class PurchaseRecDto {
	UUID id
	Item item
	String unitMeasurement
	PurchaseOrderItems refPoItem
	BigDecimal receiveQty
	BigDecimal receiveUnitCost
	BigDecimal receiveDiscountCost
	Instant expirationDate
	BigDecimal totalAmount
	BigDecimal inputTax
	BigDecimal netAmount
	Boolean isTax
	Boolean isFg
	Boolean isDiscount
	Boolean isCompleted
	Boolean isPartial
	Boolean isPosted
	Boolean isNew
}


@TupleConstructor
class ReceivingAmountDto {
	BigDecimal grossAmount
	BigDecimal totalDiscount
	BigDecimal netDiscount
	BigDecimal inputTax
	BigDecimal netAmount
	BigDecimal amount
}

@TupleConstructor
class POMonitoringDto {
	UUID purchaseOrderItem
	UUID receivingReport
	UUID receivingReportItem
	BigDecimal quantity
	String status
}

@TupleConstructor
class PostLedgerDto {
	String id
	String ledgerNo
	String poId
	String poItem
	Office source
	Office destination
	String date
	String typeId
	String itemId
	BigDecimal qty
	BigDecimal unitcost
	Boolean isFg
	Boolean isDiscount
	Boolean isPartial
	Boolean isCompleted
	UUID account

}

class PostDto {
	String id
	String ledgerNo
	Office source
	Office destination
	String date
	String type
	String typeId
	String itemId
	BigDecimal qty
	BigDecimal unitcost

}













