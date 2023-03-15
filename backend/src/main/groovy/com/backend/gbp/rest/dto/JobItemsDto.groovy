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


