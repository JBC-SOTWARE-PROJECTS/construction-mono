package com.backend.gbp.domain.payroll

import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.payroll.common.PayrollAuditingEntity
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*
import java.time.Instant

@Entity
@Table(schema = "payroll", name = "payroll_other_deduction")
class PayrollOtherDeduction extends PayrollAuditingEntity implements Serializable {


    @Id
    @Column(name = "payroll", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @OneToMany(mappedBy = "payrollAdjustment")
    List<PayrollEmployeeAdjustment> employees = []

    @Column(name = "deleted", columnDefinition = "bool")
    Boolean deleted

    @Column(name = "deleted_date", columnDefinition = "timestamp")
    Instant deletedEnd



    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "payroll", referencedColumnName = "id")
    @MapsId
    Payroll payroll

    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company", referencedColumnName = "id")
    CompanySettings company

}
