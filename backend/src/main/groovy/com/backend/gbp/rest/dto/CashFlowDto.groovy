package com.backend.gbp.rest.dto

import groovy.transform.TupleConstructor

import java.time.Instant

@TupleConstructor
class CashFlowDto {
    UUID id
    Instant date
    String refNo
    String type
    String description
    BigDecimal amount
    String remarks
}

@TupleConstructor
class CashFlowPrintDto {
    UUID id
    String date
    String refNo
    String type
    String description
    BigDecimal amount
    String remarks
}

@TupleConstructor
class PettyCashDto {
    String description
    BigDecimal amount
}


