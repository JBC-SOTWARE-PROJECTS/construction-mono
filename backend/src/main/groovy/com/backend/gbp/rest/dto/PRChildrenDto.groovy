package com.backend.gbp.rest.dto

import com.backend.gbp.domain.inventory.PurchaseRequest
import com.backend.gbp.domain.inventory.PurchaseRequestItem
import groovy.transform.TupleConstructor

@TupleConstructor
class PRChildrenDto {
    PurchaseRequest parent
    List<PurchaseRequestItem> items
}

