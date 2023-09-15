package com.backend.gbp.domain.payroll

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.CompanySettings
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.Table


@Entity
@Table(schema = "payroll", name = "sss_contribution")
class SSSContribution extends AbstractAuditingEntity implements  Serializable {

    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @GraphQLQuery
    @Column(name = "min_amount", columnDefinition = "decimal")
    BigDecimal minAmount

    @GraphQLQuery
    @Column(name = "max_amount", columnDefinition = "decimal")
    BigDecimal maxAmount

    @GraphQLQuery
    @Column(name = "monthly_salary_credit", columnDefinition = "decimal")
    BigDecimal monthlySalaryCredit

    @GraphQLQuery
    @Column(name = "er_contribution", columnDefinition = "decimal")
    BigDecimal erContribution

    @GraphQLQuery
    @Column(name = "ee_contribution", columnDefinition = "decimal")
    BigDecimal eeContribution

    @GraphQLQuery
    @Column(name = "er_ec_contribution", columnDefinition = "decimal")
    BigDecimal er_ec_Contribution

    @GraphQLQuery
    @Column(name = "wisp_er_contribution", columnDefinition = "decimal")
    BigDecimal wispErContribution

    @GraphQLQuery
    @Column(name = "wisp_ee_contribution", columnDefinition = "decimal")
    BigDecimal wispEeContribution

    @GraphQLQuery
    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company", referencedColumnName = "id")
    CompanySettings company

}
