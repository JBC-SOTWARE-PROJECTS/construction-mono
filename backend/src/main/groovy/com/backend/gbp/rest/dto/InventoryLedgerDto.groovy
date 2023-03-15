package com.backend.gbp.rest.dto

import com.backend.gbp.domain.Office
import groovy.transform.TupleConstructor

class InventoryLedgerDto {
	String id
	String ledgerNo
	String poId
	String poItem
	Office sourceOffice
	Office destOffice
	String ledgerDate
	String typeId
	String typeDesc
	String itemId
	String itemDesc
	String unit
	Integer qty
	BigDecimal unitCost
	BigDecimal discountCost
	Boolean isFg
	Boolean isDiscount
	Boolean isPartial
	Boolean isCompleted
	UUID account
	
}

class StockCard {
	String id
	String source_office
	String source_officename
	String destination_office
	String destination_officename
	String document_types
	String document_code
	String document_desc
	String item
	String sku
	String item_code
	String desc_long
	String reference_no
	String ledger_date
	Integer ledger_qtyin
	Integer ledger_qty_out
	Integer adjustment
	BigDecimal unitcost
	Integer runningqty
	BigDecimal wcost
	BigDecimal runningbalance
}

@TupleConstructor
class StockCardPrint {
	String source_officename
	String destination_officename
	String document_desc
	String reference_no
	String ledger_date
	Integer ledger_qtyin
	Integer ledger_qty_out
	Integer adjustment
	BigDecimal unitcost
	BigDecimal totalCost
	Integer runningqty
	BigDecimal wcost
	BigDecimal runningbalance
}

@TupleConstructor
class HeaderDtoPrint {
	String descLong
}













