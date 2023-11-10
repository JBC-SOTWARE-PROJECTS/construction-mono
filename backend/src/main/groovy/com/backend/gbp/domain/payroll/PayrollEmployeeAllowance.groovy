package com.backend.gbp.domain.payroll

import com.backend.gbp.domain.payroll.common.PayrollEmployeeAuditingEntity
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.Formula
import org.hibernate.annotations.Type

import javax.persistence.*

@Entity
@Table(schema = "payroll", name = "payroll_employee_allowances")
class PayrollEmployeeAllowance extends PayrollEmployeeAuditingEntity implements Serializable {

    @Id
    @Column(name = "employee", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @OneToMany(mappedBy = "payrollEmployeeAllowance", orphanRemoval = true, cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    List<PayrollAllowanceItem> allowanceItems = []

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "payrollAllowance", referencedColumnName = "payroll")
    PayrollAllowance allowance

    @GraphQLQuery
    @Formula("(SELECT COALESCE(sum(i.amount),0) FROM payroll.payroll_allowance_items i WHERE i.payroll_employee_allowance = employee)")
    BigDecimal total


}
