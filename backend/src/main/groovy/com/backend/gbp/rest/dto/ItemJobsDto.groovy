package com.backend.gbp.rest.dto

import groovy.transform.TupleConstructor

@TupleConstructor
class ItemJobsDto {
    List<JobItemType> types
    List<JobItemUnit> units
}     
@TupleConstructor
class JobItemType {
    String j_type
}

@TupleConstructor
class JobItemUnit {
    String unit
}



