package com.backend.gbp.domain.payroll

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.payroll.enums.PayrollType
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*

@Entity
@Table(schema = "payroll", name = "withholding_tax_matrix")
class WithholdingTaxMatrix extends AbstractAuditingEntity implements  Serializable {

    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @GraphQLQuery
    @Column(name = "min_amount", columnDefinition = "numeric")
    BigDecimal minAmount

    @GraphQLQuery
    @Column(name = "max_amount", columnDefinition = "numeric")
    BigDecimal maxAmount

    @GraphQLQuery
    @Column(name = "base_amount", columnDefinition = "numeric")
    BigDecimal baseAmount

    @GraphQLQuery
    @Column(name = "percentage", columnDefinition = "numeric")
    BigDecimal percentage

    @GraphQLQuery
    @Column(name = "threshold_amount", columnDefinition = "numeric")
    BigDecimal thresholdAmount

    @GraphQLQuery
    @Enumerated(EnumType.STRING)
    @Column(name = "type", columnDefinition = "varchar")
    PayrollType type

    @GraphQLQuery
    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company", referencedColumnName = "id")
    CompanySettings company

}
