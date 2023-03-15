package com.backend.gbp.rest.dto

import groovy.transform.TupleConstructor

@TupleConstructor
class SrrItemDto {
    String srrNo
    String poNum
    String recDate
    String supplier
    String item
    BigDecimal unitCost
    Integer qty
    BigDecimal totalAmount
}


