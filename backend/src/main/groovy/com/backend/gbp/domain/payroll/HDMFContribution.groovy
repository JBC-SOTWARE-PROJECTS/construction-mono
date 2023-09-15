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
@Table(schema = "payroll", name = "hdmf_contribution")
class HDMFContribution extends AbstractAuditingEntity implements Serializable {

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
    @Column(name = "ee_rate", columnDefinition = "decimal")
    BigDecimal eeRate

    @GraphQLQuery
    @Column(name = "er_rate", columnDefinition = "decimal")
    BigDecimal erRate

    @GraphQLQuery
    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company", referencedColumnName = "id")
    CompanySettings company

}
