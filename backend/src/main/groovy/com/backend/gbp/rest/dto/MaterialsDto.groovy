package com.backend.gbp.rest.dto

import com.backend.gbp.domain.inventory.Item
import groovy.transform.TupleConstructor

@TupleConstructor
class MaterialsDto {
    String id
    Item item
    Integer qty
    BigDecimal cost
}


