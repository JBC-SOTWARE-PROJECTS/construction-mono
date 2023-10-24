package com.backend.gbp.domain.payroll

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.payroll.enums.EmployeeLoanCategory
import com.fasterxml.jackson.annotation.JsonIgnore
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*

@Entity
@Table(schema = "payroll", name = "employee_loan")
class EmployeeLoan extends AbstractAuditingEntity implements Serializable {

    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employee", referencedColumnName = "id")
    Employee employee

    @GraphQLQuery
    @Column(name = "amount", columnDefinition = "numeric")
    BigDecimal amount

    @GraphQLQuery
    @Column(name = "description", columnDefinition = "varchar")
    String description

    @Enumerated(EnumType.STRING)
    @Column(name = "category", columnDefinition = "varchar")
    EmployeeLoanCategory category

    @GraphQLQuery
    @Column(name = "status", columnDefinition = "bool")
    Boolean status

    @GraphQLQuery
    @Column(name = "is_voided", columnDefinition = "bool")
    Boolean isVoided

    @GraphQLQuery
    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company", referencedColumnName = "id")
    CompanySettings company

}
