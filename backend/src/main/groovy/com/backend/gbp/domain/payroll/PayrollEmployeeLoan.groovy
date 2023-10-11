package com.backend.gbp.domain.payroll

import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.hrm.dto.HoursLog
import com.backend.gbp.domain.payroll.common.PayrollEmployeeAuditingEntity
import com.fasterxml.jackson.annotation.JsonIgnore
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*

@Entity
@Table(schema = "payroll", name = "payroll_employee_loans")
class PayrollEmployeeLoan extends PayrollEmployeeAuditingEntity implements Serializable {

    @GraphQLQuery
    @Id
    @Column(name = "employee", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @NotFound(action = NotFoundAction.IGNORE)
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "payrollLoan", referencedColumnName = "payroll")
    PayrollLoan payrollLoan

    @OneToMany(mappedBy = "employeeLoan", orphanRemoval = true, cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    List<PayrollLoanItem> loanItems = []

    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company", referencedColumnName = "id")
    CompanySettings company
}
