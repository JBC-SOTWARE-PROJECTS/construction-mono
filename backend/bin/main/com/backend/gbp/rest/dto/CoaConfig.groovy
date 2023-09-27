package com.backend.gbp.rest.dto

import groovy.transform.TupleConstructor

@TupleConstructor
class CoaConfig {
    Boolean show
    Boolean showDepartments
    List<UUID> motherAccounts = null
}
