package com.backend.gbp.rest.dto

import com.backend.gbp.domain.inventory.Item
import groovy.transform.TupleConstructor

@TupleConstructor
class MaterialsDto {
    String id
    Item item
    Integer onHand
    Integer qty
    Integer balance
    BigDecimal wCost
    String remarks
}


