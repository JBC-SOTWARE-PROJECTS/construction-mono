package com.backend.gbp.rest.dto

import groovy.transform.TupleConstructor

@TupleConstructor
class PRItemReportDto {
    String description, brand, uop, uou
    BigDecimal content_ratio, qty_uop, onhand, qty_uou, reorder
}

@TupleConstructor
class PRReportDto {
    String prNo, date, supplier, fullname, project, location, projTitle, remarks
}

@TupleConstructor
class PRItemNotYetPo {
    UUID id
    String prNo
}
