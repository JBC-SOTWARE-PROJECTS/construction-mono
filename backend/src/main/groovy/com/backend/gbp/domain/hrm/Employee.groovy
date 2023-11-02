package com.backend.gbp.domain.hrm

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.Office
import com.backend.gbp.domain.Position
import com.backend.gbp.domain.hrm.dto.EmployeeLoanConfig
import com.backend.gbp.domain.hrm.dto.HoursLog
import com.backend.gbp.domain.payroll.EmployeeLoan
import com.backend.gbp.domain.payroll.TimekeepingEmployee
import com.backend.gbp.domain.types.JaversResolvable
import com.fasterxml.jackson.annotation.JsonFormat
import com.backend.gbp.domain.User
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.*

import javax.persistence.*
import java.time.LocalDateTime

@javax.persistence.Entity
@javax.persistence.Table(schema = "hrm", name = "employees")
class Employee extends AbstractAuditingEntity implements JaversResolvable, Serializable {

    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "`user`", referencedColumnName = "id")
    User user

    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "office", referencedColumnName = "id")
    Office office

    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "position", referencedColumnName = "id")
    Position position

    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "current_company", referencedColumnName = "id")
    CompanySettings currentCompany

    @GraphQLQuery
    @Column(name = "emp_no", columnDefinition = "varchar")
    String employeeNo


    @GraphQLQuery
    @Column(name = "first_name", columnDefinition = "varchar")
    String firstName

    @GraphQLQuery
    @Column(name = "last_name", columnDefinition = "varchar")
    String lastName

    @GraphQLQuery
    @Column(name = "middle_name", columnDefinition = "varchar")
    String middleName

    @GraphQLQuery
    @Column(name = "name_suffix", columnDefinition = "varchar")
    String nameSuffix

    @GraphQLQuery
    @Column(name = "title_initials", columnDefinition = "varchar")
    String titleInitials

    @GraphQLQuery
    @Column(name = "email_address", columnDefinition = "varchar")
    String emailAddress

    @GraphQLQuery
    @Column(name = "nationality", columnDefinition = "varchar")
    String nationality

    @GraphQLQuery
    @Column(name = "civil_status", columnDefinition = "varchar")
    String civilStatus

    @GraphQLQuery
    @Column(name = "gender", columnDefinition = "varchar")
    String gender

    @GraphQLQuery
    @Column(name = "dob", columnDefinition = "date")
    LocalDateTime dob

    @GraphQLQuery
    @Column(name = "street", columnDefinition = "varchar")
    String street

    @GraphQLQuery
    @Column(name = "country", columnDefinition = "varchar")
    String country

    @GraphQLQuery
    @Column(name = "province", columnDefinition = "varchar")
    String stateProvince

    @GraphQLQuery
    @Column(name = "municipality", columnDefinition = "varchar")
    String cityMunicipality

    @GraphQLQuery
    @Column(name = "blood_type", columnDefinition = "varchar")
    String bloodType

    @GraphQLQuery
    @Column(name = "barangay", columnDefinition = "varchar")
    String barangay

    @GraphQLQuery
    @Column(name = "zipcode", columnDefinition = "varchar")
    String zipCode

    @GraphQLQuery
    @Column(name = "emergency_contact_name", columnDefinition = "varchar")
    String emergencyContactName

    @GraphQLQuery
    @Column(name = "emergency_contact_address", columnDefinition = "varchar")
    String emergencyContactAddress

    @Column(name = "emergency_contact_relationship", columnDefinition = "varchar")
    String emergencyContactRelationship

    @GraphQLQuery
    @Column(name = "emergency_contact_no", columnDefinition = "varchar")
    String emergencyContactNo


    @GraphQLQuery
    @Column(name = "employee_tel_no", columnDefinition = "varchar")
    String employeeTelNo

    @GraphQLQuery
    @Column(name = "employee_cel_no", columnDefinition = "varchar")
    String employeeCelNo

    @GraphQLQuery
    @Column(name = "philhealth_no", columnDefinition = "varchar")
    String philhealthNo

    @GraphQLQuery
    @Column(name = "sss_no", columnDefinition = "varchar")
    String sssNo

    @GraphQLQuery
    @Column(name = "tin_no", columnDefinition = "varchar")
    String tinNo

    @GraphQLQuery
    @Column(name = "pag_ibig_id", columnDefinition = "varchar")
    String pagIbigId

    @GraphQLQuery
    @Column(name = "employee_type", columnDefinition = "varchar")
    String employeeType

    @GraphQLQuery
    @Column(name = "basic_salary")
    @JsonFormat(shape = JsonFormat.Shape.STRING)
    BigDecimal basicSalary

    @GraphQLQuery
    @Formula("concat(last_name , coalesce(', ' || nullif(first_name,'') , ''), coalesce(' ' || nullif(middle_name,'') , ''), coalesce(' ' || nullif(name_suffix,'') , ''))")
    String fullName

    @GraphQLQuery
    @Formula("concat(last_name , coalesce(', ' || nullif(first_name,'') , ''), coalesce(' ' || nullif(substring(middle_name, 1, 1),'') , ''), coalesce(' ' || nullif(name_suffix,'') , ''))")
    String fullInitialName

    @GraphQLQuery
    @Formula("concat(last_name , coalesce(', ' || nullif(first_name,'') , ''))")
    String initialName

    @GraphQLQuery
    @Formula("concat(coalesce(nullif(left(first_name,1),'') , '. '), coalesce('' || nullif(left(middle_name,1),'') , '. '), last_name)")
    String shortName

    @GraphQLQuery
    @Column(name = "is_active", columnDefinition = "boolean")
    Boolean isActive

    @GraphQLQuery
    @Formula("concat(first_name , coalesce(' ' || nullif(middle_name,'') , ''), coalesce(' ' || nullif(last_name,'') , ''), coalesce(' ' || nullif(name_suffix,'') , ''), coalesce(', ' || nullif(title_initials,'') , ''))")
    String fullnameWithTitle

    @GraphQLQuery
    @Formula("concat(street , coalesce(' ' || nullif(barangay,'') , ''), coalesce(' ' || nullif(municipality,'') , ''), coalesce(', ' || nullif(province,'') , ''), coalesce(', ' || nullif(country,'') , ''), coalesce(', ' || nullif(zipcode,'') , ''))")
    String fullAddress

    @GraphQLQuery
    @Column(name = "is_active_phic", columnDefinition = "boolean")
    Boolean isActivePHIC

    @GraphQLQuery
    @Column(name = "is_active_sss", columnDefinition = "boolean")
    Boolean isActiveSSS

    @GraphQLQuery
    @Column(name = "is_active_hdmf", columnDefinition = "boolean")
    Boolean isActiveHDMF

    @Type(type = "jsonb")
    @GraphQLQuery
    @Column(name = "employee_loan_config", columnDefinition = "jsonb")
    EmployeeLoanConfig employeeLoanConfig

    @OneToMany(fetch = FetchType.LAZY, mappedBy = "employee")
    List<EmployeeAllowance> allowanceItems = []

    @GraphQLQuery
    @Column(name = "allowance_package", columnDefinition = "uuid")
    UUID allowancePackageId

    @Override
    String resolveEntityForJavers() {
        return fullName
    }
}
