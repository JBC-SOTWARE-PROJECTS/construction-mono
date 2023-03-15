package com.backend.gbp.rest.dto

import groovy.transform.TupleConstructor

import java.time.Instant

@TupleConstructor
class SalesReportDto {
    UUID id
    String trans_type
    Instant trans_date
    String ornumber
    String bill
    String ref_no
    String category
    String description
    BigDecimal gross
    String deductions
    BigDecimal disc_amount
    BigDecimal commission
    BigDecimal netsales
    String date_trans
}


