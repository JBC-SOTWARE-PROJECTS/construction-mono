package com.backend.gbp.domain.payroll

import com.backend.gbp.domain.payroll.common.PayrollAuditingEntity
import org.hibernate.annotations.Type

import javax.persistence.*

@Entity
@Table(schema = "payroll", name = "payroll_contributions")
class PayrollContribution extends  PayrollAuditingEntity implements Serializable {

    @Id
    @Column(name = "payroll", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "payroll", referencedColumnName = "id")
    @MapsId
    Payroll payroll


    @OneToMany(mappedBy = "contribution", cascade = CascadeType.ALL)
    List<PayrollEmployeeContribution> contributionEmployees = []


}
