package com.backend.gbp.rest.dto

import groovy.transform.TupleConstructor

@TupleConstructor
class DiscountDto {
    String type
    String description
    String discountType
    BigDecimal percent
    BigDecimal amount
}


