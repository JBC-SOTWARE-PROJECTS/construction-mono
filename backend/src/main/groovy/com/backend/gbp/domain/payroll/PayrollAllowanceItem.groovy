package com.backend.gbp.domain.payroll

import com.backend.gbp.domain.hrm.Allowance
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import org.hibernate.annotations.Where

import javax.persistence.*

@Entity
@Table(schema = "payroll", name = "payroll_allowance_items")
class PayrollAllowanceItem implements Serializable {


    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "payrollEmployeeAllowance", referencedColumnName = "employee")
    PayrollEmployeeAllowance payrollEmployeeAllowance

    @GraphQLQuery
    @Column(name = "name", columnDefinition = "varchar")
    String name

    @GraphQLQuery
    @Column(name = "original_amount", columnDefinition = "numeric")
    BigDecimal originalAmount

    @GraphQLQuery
    @Column(name = "amount", columnDefinition = "numeric")
    BigDecimal amount

    @GraphQLQuery
    @Column(name = "deleted", columnDefinition = "bool")
    Boolean deleted

    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "allowance", referencedColumnName = "id")
    Allowance allowance

}
