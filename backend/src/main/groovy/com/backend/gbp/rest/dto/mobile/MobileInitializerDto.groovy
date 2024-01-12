package com.backend.gbp.rest.dto.mobile

import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.projects.Projects
import groovy.transform.TupleConstructor

@TupleConstructor
class MobileInitializerDto implements Serializable {
    List<CompanySettings> companies
    List<EmployeeDetailsDto> employees
    List<Projects> projects
}
