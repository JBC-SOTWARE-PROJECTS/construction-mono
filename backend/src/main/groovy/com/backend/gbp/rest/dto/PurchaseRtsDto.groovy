package com.backend.gbp.rest.dto

import com.backend.gbp.domain.inventory.Item



class PurchaseRtsDto {
	UUID id
	Item item
	Integer returnQty
	BigDecimal returnUnitCost
	String return_remarks
	Boolean isPosted
	Boolean isNew
}

class PurchaseIssuanceDto {
	UUID id
	Item item
	Integer issueQty
	BigDecimal unitCost
	String remarks
	Boolean isPosted
	Boolean isNew
}

class PurchaseMPDto {
	UUID id
	Item item
	Integer qty
	BigDecimal unitCost
	String type
	Boolean isPosted
	Boolean isNew
}













