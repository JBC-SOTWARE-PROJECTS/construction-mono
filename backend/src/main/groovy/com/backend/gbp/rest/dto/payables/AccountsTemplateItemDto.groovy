package com.backend.gbp.rest.dto.payables

import groovy.transform.TupleConstructor

@TupleConstructor
class AccountsTemplateItemDto {
    String id
    String code
    String desc
    String accountType
    Boolean isNew
}