package com.backend.gbp.rest.dto

import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.Office
import com.backend.gbp.domain.Position
import groovy.transform.TupleConstructor

@TupleConstructor
class EmployeeDto {
    UUID id
    Office office
    Position position
    CompanySettings currentCompany
    String firstName
    String lastName
    String employeeType

}
