package com.backend.gbp.rest.dto

import com.backend.gbp.domain.inventory.Item
import groovy.transform.TupleConstructor


@TupleConstructor
class InventoryInfoDto {
    String id
    Item item
    Integer onHand
    BigDecimal cost
}

@TupleConstructor
class InventoryInfoRawDto {
    String id
    String item
    Integer onhand
}

