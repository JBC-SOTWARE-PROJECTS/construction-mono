package com.backend.gbp.rest.dto

class POItemReportDto {
    String description, uom, deals
    Integer no
    BigDecimal unit_cost, total, discount, request_qty
}

class POReportDto {
    String date, poNum, prNum, supplier, office, terms, fullname, project, location, projTitle
}
