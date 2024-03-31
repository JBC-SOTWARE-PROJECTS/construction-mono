package com.backend.gbp.rest.dto

import groovy.transform.TupleConstructor

@TupleConstructor
class MarkupItemDto {
    UUID id
    UUID item
    String descLong
    String sku
    String itemCode
    String brand
    String uou
    String categoryDescription
    BigDecimal lastUnitCost
    BigDecimal actualCost
    BigDecimal outputTax
    BigDecimal markup
    BigDecimal sellingPrice
    Boolean production
    Boolean isMedicine
    Boolean vatable
    Boolean fixAsset
    Boolean consignment
    Boolean forSale

}