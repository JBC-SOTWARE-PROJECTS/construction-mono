package com.backend.gbp.rest.dto

import groovy.transform.Canonical
import groovy.transform.TupleConstructor

@Canonical
class JobItemsReportDto {
    String category
    String description
    String cost
}


@TupleConstructor
class JobReportDto {
    String customer
    String address
    String cust_email
    String cust_phone_no
    String plate_no
    String date_trans
    String repair_type
    String insurance
    String engine_no
    String chassis_no
    String body_color
    String year_model
    String series
    String make
    String due_date
}



