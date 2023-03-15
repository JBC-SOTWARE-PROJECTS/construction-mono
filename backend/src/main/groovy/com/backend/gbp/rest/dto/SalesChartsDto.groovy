package com.backend.gbp.rest.dto

import groovy.transform.TupleConstructor

@TupleConstructor
class SalesChartsDto {
    BigDecimal jan
    BigDecimal feb
    BigDecimal mar
    BigDecimal apr
    BigDecimal may
    BigDecimal jun
    BigDecimal jul
    BigDecimal aug
    BigDecimal sep
    BigDecimal oct
    BigDecimal nov
    BigDecimal dece
}

