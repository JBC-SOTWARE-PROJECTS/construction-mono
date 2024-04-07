package com.backend.gbp.rest.dto

import com.backend.gbp.domain.inventory.PurchaseOrder
import com.backend.gbp.domain.inventory.PurchaseOrderItemsMonitoring
import groovy.transform.TupleConstructor

@TupleConstructor
class POChildrenDto {
    PurchaseOrder parent
    List<PurchaseOrderItemsMonitoring> items
}

