package com.backend.gbp.domain.payroll


import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.*

@Entity
@Table(schema = "payroll", name = "payroll_contributions_view")
class PayrollEmployeeContributionsView {


    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @GraphQLQuery
    @Column(name = "basic_salary", columnDefinition = "numeric")
    BigDecimal basicSalary

    @GraphQLQuery
    @Column(name = "ss_er_ec_amount", columnDefinition = "numeric")
    BigDecimal sssER_EC

    @GraphQLQuery
    @Column(name = "ss_ee_amount", columnDefinition = "numeric")
    BigDecimal sssEE

    @GraphQLQuery
    @Column(name = "ss_er_amount", columnDefinition = "numeric")
    BigDecimal sssER

    @GraphQLQuery
    @Column(name = "sss_wisp_er", columnDefinition = "numeric")
    BigDecimal sssWispER

    @GraphQLQuery
    @Column(name = "sss_wisp_ee", columnDefinition = "numeric")
    BigDecimal sssWispEE

    @GraphQLQuery
    @Column(name = "phic_ee_amount", columnDefinition = "numeric")
    BigDecimal phicEE

    @GraphQLQuery
    @Column(name = "phic_er_amount", columnDefinition = "numeric")
    BigDecimal phicER

    @GraphQLQuery
    @Column(name = "hdmf_ee_amount", columnDefinition = "numeric")
    BigDecimal hdmfEE

    @GraphQLQuery
    @Column(name = "hdmf_er_amount", columnDefinition = "numeric")
    BigDecimal hdmfER



}
