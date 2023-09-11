package com.backend.gbp.domain.payroll

import com.backend.gbp.domain.payroll.common.PayrollEmployeeAuditingEntity
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.Type

import javax.persistence.*

@Entity
@Table(schema = "payroll", name = "payroll_employee_contributions")
class PayrollEmployeeContribution extends PayrollEmployeeAuditingEntity{


    @Id
    @Column(name = "employee", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "payrollContribution", referencedColumnName = "payroll")
    PayrollContribution contribution

    @Column(name = "sss_ee", columnDefinition = "numeric")
    BigDecimal sssEE

    @Column(name = "sss_er", columnDefinition = "numeric")
    BigDecimal sssER

    @Column(name = "sss_wisp_er", columnDefinition = "numeric")
    BigDecimal sssWispER

    @Column(name = "sss_wisp_ee", columnDefinition = "numeric")
    BigDecimal sssWispEE

    @Column(name = "phic_ee", columnDefinition = "numeric")
    BigDecimal phicEE

    @Column(name = "phic_er", columnDefinition = "numeric")
    BigDecimal phicER

    @Column(name = "hdmf_er", columnDefinition = "numeric")
    BigDecimal hdmfER

    @Column(name = "hdmf_ee", columnDefinition = "numeric")
    BigDecimal hdmfEE

    @Column(name = "basic_salary", columnDefinition = "numeric")
    BigDecimal basicSalary

    @GraphQLQuery
    @Column(name = "is_active_sss", columnDefinition = "boolean")
    Boolean isActiveSSS

    @GraphQLQuery
    @Column(name = "is_active_phic", columnDefinition = "boolean")
    Boolean isActivePHIC

    @GraphQLQuery
    @Column(name = "is_active_hdmf", columnDefinition = "boolean")
    Boolean isActiveHDMF

    @GraphQLQuery
    @Column(name = "total", columnDefinition = "numeric")
    BigDecimal total
}
