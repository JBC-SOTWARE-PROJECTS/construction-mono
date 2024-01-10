package com.backend.gbp.domain.payroll

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.payroll.enums.AdjustmentOperation
import com.backend.gbp.domain.payroll.enums.EmployeeLoanCategory
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*

@Entity
@Table(schema = "payroll", name = "payroll_adjustment_item")
class PayrollAdjustmentItem extends AbstractAuditingEntity implements Serializable {

    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employee", referencedColumnName = "employee")
    PayrollEmployeeAdjustment employeeAdjustment


    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "adjustment_category", referencedColumnName = "id", nullable = false)
    AdjustmentCategory category

    @GraphQLQuery
    @Column(name = "description", columnDefinition = "varchar")
    String description

    @GraphQLQuery
    @Column(name = "amount", columnDefinition = "numeric")
    BigDecimal amount

    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company", referencedColumnName = "id")
    CompanySettings company

    @GraphQLQuery
    @Transient
    String getName() {
        return category.name
    }

    @Enumerated(EnumType.STRING)
    @Column(name = "operation", columnDefinition = "varchar")
    AdjustmentOperation operation

    @GraphQLQuery
    @Column(name = "subaccount_code", columnDefinition = "varchar")
    String subaccountCode
}
