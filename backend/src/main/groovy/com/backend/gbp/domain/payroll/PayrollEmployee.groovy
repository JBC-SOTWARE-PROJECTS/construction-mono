package com.backend.gbp.domain.payroll

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.payroll.enums.PayrollEmployeeStatus
import com.fasterxml.jackson.annotation.JsonIgnore
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*

@Entity
@Table(schema = "payroll", name = "payroll_employees")
class PayrollEmployee extends AbstractAuditingEntity implements Serializable {


    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @Enumerated(EnumType.STRING)
    @Column(name = "status", columnDefinition = "varchar")
    PayrollEmployeeStatus status

    @NotFound(action = NotFoundAction.IGNORE)
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "payroll", referencedColumnName = "id")
    Payroll payroll

    @NotFound(action = NotFoundAction.IGNORE)
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employee", referencedColumnName = "id")
    Employee employee


    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company", referencedColumnName = "id")
    CompanySettings company

//    @OneToOne(mappedBy = "payrollEmployee")
//    OtherDeductionEmployee otherDeduction
//
    @OneToOne(mappedBy = "payrollEmployee")
    TimekeepingEmployee timekeepingEmployee
//
//    @OneToOne(mappedBy = "payrollEmployee")
//    PayrollEmployeeAllowance allowanceEmployee
//
    @OneToOne(mappedBy = "payrollEmployee")
    PayrollEmployeeContribution payrollEmployeeContribution

    @Transient
    Boolean isOld

}
