package com.backend.gbp.rest

import groovy.transform.TupleConstructor


@TupleConstructor
class ReceiptDto {
    String date
    String customer
    String tin
    String address
    String totalWords
    BigDecimal totalAmount
    BigDecimal totalDiscount
    BigDecimal outputTax
    BigDecimal vatable
    BigDecimal exempt
    String cashier
    String orNumber
}


