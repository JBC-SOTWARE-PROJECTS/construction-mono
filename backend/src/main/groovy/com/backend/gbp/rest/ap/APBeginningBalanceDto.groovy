package com.backend.gbp.rest.ap

import groovy.transform.TupleConstructor

@TupleConstructor
class APBeginningBalanceDto {
    UUID id
    String apNo
    UUID supplierId
    String supplierFullname
    String supplierType
    BigDecimal total
}