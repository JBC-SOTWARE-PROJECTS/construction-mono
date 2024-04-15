package com.backend.gbp.rest.dto

import com.backend.gbp.domain.inventory.Item
import groovy.transform.TupleConstructor

@TupleConstructor
class ServiceItemsDto {
    String id
    Item item
    BigDecimal qty
    BigDecimal wcost
    Boolean isNew
}


