package com.backend.gbp.domain.payroll

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.payroll.enums.AdjustmentOperation
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*

@Entity
@Table(schema = "payroll", name = "payroll_other_deduction_item")
class PayrollOtherDeductionItem extends AbstractAuditingEntity implements Serializable {

    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employee", referencedColumnName = "employee")
    PayrollEmployeeOtherDeduction employeeOtherDeduction
//
//    @GraphQLQuery
//    @Column(name = "other_deduction_type", columnDefinition = "uuid")
//    UUID type

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "other_deduction_type", referencedColumnName = "id", nullable = false)
    OtherDeductionTypes type

    @GraphQLQuery
    @Column(name = "name", columnDefinition = "varchar")
    String name

    @GraphQLQuery
    @Column(name = "description", columnDefinition = "varchar")
    String description

    @GraphQLQuery
    @Column(name = "amount", columnDefinition = "numeric")
    BigDecimal amount

    @GraphQLQuery
    @Column(name = "subaccount_code", columnDefinition = "varchar")
    String subaccountCode

    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company", referencedColumnName = "id")
    CompanySettings company

}
