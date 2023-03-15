package com.backend.gbp.rest.dto

import groovy.transform.Canonical

@Canonical
class BillingPrintDto {

    String date, doctype, docno, description, qty, price, debit, credit, runningbal,
           reference, category

    Integer ordering

    BigDecimal subtotal

}


