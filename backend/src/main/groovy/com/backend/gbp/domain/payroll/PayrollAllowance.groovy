package com.backend.gbp.domain.payroll

import com.backend.gbp.domain.hrm.dto.EmployeeSalaryDto
import com.backend.gbp.domain.payroll.common.PayrollAuditingEntity
import com.backend.gbp.graphqlservices.payroll.AllowanceTotalDto
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.Type

import javax.persistence.*
import java.time.Instant

@Entity
@Table(schema = "payroll", name = "payroll_allowances")
class PayrollAllowance extends PayrollAuditingEntity implements Serializable {


    @Id
    @Column(name = "payroll", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "payroll", referencedColumnName = "id")
    @MapsId
    Payroll payroll

    @OneToMany(mappedBy = "allowance", cascade = CascadeType.ALL)
    List<PayrollEmployeeAllowance> allowanceEmployees = []

    @Column(name = "total", columnDefinition = "numeric")
    BigDecimal total

    @Type(type = "jsonb")
    @GraphQLQuery
    @Column(name="totals_breakdown",columnDefinition = "jsonb")
    List<AllowanceTotalDto> totalsBreakdown

}
