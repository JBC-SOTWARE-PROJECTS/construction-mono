package com.backend.gbp.rest.dto

import groovy.transform.TupleConstructor

@TupleConstructor
class OnHandReport {
    UUID id
    UUID item
    String desc_long
    String unit_of_purchase
    String unit_of_usage
    String category_description
    UUID department
    String department_name
    String expiration_date
    BigDecimal onhand
    BigDecimal last_unit_cost
    BigDecimal last_wcost
}

class OnHandHeader {
    String date
    String office
}



