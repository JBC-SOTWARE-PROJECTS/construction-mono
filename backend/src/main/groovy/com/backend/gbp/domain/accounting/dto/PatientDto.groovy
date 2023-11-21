package com.backend.gbp.domain.accounting.dto

import groovy.transform.Canonical

@Canonical
class PatientDto {
    String id
    String fullName
    String lastName
    String firstName
}
