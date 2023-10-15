package com.hisd3.hismk2.rest.dto

import groovy.transform.TupleConstructor

@TupleConstructor
class AccountsTemplateItemDto {
    String id
    String code
    String desc
    String accountType
    Boolean isNew
}