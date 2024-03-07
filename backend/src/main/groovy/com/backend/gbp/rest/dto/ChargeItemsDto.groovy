package com.backend.gbp.rest.dto

import groovy.transform.TupleConstructor

import java.time.Instant

@TupleConstructor
class ChargeItemsDto {
    UUID id
    Instant transDate
    String refNo
    String description
    String transType
    BigDecimal qty
    BigDecimal unitCost
    BigDecimal totalAmount
}


