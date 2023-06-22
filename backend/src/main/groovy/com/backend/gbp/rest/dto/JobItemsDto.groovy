package com.backend.gbp.rest.dto

import com.backend.gbp.domain.inventory.Item
import groovy.transform.TupleConstructor


@TupleConstructor
class JobItemsDto {
    String id
    String type
    Item item
    String service
    String serviceCategory
    String descriptions
    Integer qty
    BigDecimal cost
    BigDecimal subTotal
    BigDecimal outputTax
    BigDecimal wcost
    Boolean billed
    Boolean isNew
}

@TupleConstructor
class JobOrderItemsDto {
    String id
    String description
    String type
    BigDecimal qty
    String unit
    BigDecimal cost
    BigDecimal subTotal
    BigDecimal total
    Boolean active
    Boolean isNew
}


