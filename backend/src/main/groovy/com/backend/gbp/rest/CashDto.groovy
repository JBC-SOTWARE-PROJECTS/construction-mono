package com.backend.gbp.rest

import groovy.transform.Canonical

@Canonical
class CashDto {
    String denomination
    int noofpieces = 0
    BigDecimal total

}

@Canonical
class CheckCC {
    String bank = ""
    String type = ""
    String chnumber = ""
    BigDecimal amount = BigDecimal.ZERO

}

@Canonical
class DCTRItems {
    String description = ""
    BigDecimal totalpayments = BigDecimal.ZERO
    String ornumber = ""
    String paymentType = ""
    String details = ""
    String receiptTypeStr = ""
    String category = ""
    String order = 0
}


