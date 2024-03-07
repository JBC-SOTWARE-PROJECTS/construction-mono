package com.backend.gbp.rest.dto

import groovy.transform.TupleConstructor

import java.time.Instant

@TupleConstructor
class CustomerBillingDto {
    UUID id
    UUID billing
    UUID item
    String item_type
    Instant trans_date
    String description
    BigDecimal qty
    BigDecimal price
    BigDecimal amount_charge
    BigDecimal deduction
    BigDecimal net
    BigDecimal credit
    BigDecimal balance
}


