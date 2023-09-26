package com.backend.gbp.domain.payroll

import com.backend.gbp.domain.payroll.common.PayrollAuditingEntity
import io.leangen.graphql.annotations.GraphQLQuery
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

    @GraphQLQuery
    @Column(name = "is_active_phic", columnDefinition = "boolean")
    Boolean isActivePHIC = true

    @GraphQLQuery
    @Column(name = "is_active_sss", columnDefinition = "boolean")
    Boolean isActiveSSS = true

    @GraphQLQuery
    @Column(name = "is_active_hdmf", columnDefinition = "boolean")
    Boolean isActiveHDMF = true


    @OneToMany(mappedBy = "contribution", cascade = CascadeType.ALL)
    List<PayrollEmployeeContribution> contributionEmployees = []


}
