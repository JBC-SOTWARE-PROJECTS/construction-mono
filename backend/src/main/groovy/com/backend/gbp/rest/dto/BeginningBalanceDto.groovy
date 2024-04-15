package com.backend.gbp.rest.dto

import groovy.transform.Canonical
import groovy.transform.TupleConstructor

@TupleConstructor
class BeginningBalanceDto {
    UUID id
    ItemDto item
    OfficeDto office
    String uou
    BigDecimal beginningBalance
    BigDecimal beginningCost
}

@Canonical
class ItemDto {
    UUID id
    String descLong
    String sku
    String itemCode
    String brand
    UUID itemGroupId
    UUID itemCategory
    String categoryDescription
    Boolean production
    Boolean isMedicine
    Boolean vatable
    Boolean fixAsset
    Boolean consignment
    Boolean forSale
}

@Canonical
class OfficeDto {
    UUID id
    String officeDescription
}