package com.backend.gbp.rest.dto

import com.backend.gbp.domain.inventory.Item
import groovy.transform.TupleConstructor

@TupleConstructor
class BillingItemsDto {
    String id
    Item item
    UUID service
    String serviceCategory
    String description
    Integer qty
    BigDecimal amount
    BigDecimal subTotal
    BigDecimal wcost
    BigDecimal outputTax
}


