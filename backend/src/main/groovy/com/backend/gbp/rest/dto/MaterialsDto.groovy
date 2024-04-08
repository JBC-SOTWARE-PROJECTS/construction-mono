package com.backend.gbp.rest.dto

import com.backend.gbp.domain.inventory.Item
import groovy.transform.TupleConstructor

@TupleConstructor
class MaterialsDto {
    String id
    Item item
    BigDecimal onHand
    BigDecimal qty
    BigDecimal balance
    BigDecimal wCost
    String remarks
}


