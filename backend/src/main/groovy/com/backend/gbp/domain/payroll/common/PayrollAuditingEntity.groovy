package com.backend.gbp.domain.payroll.common

import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.payroll.enums.PayrollStatus
import io.leangen.graphql.annotations.GraphQLQuery

import javax.persistence.*
import java.time.Instant

@MappedSuperclass
class PayrollAuditingEntity extends PayrollStatusEntity<PayrollStatus> implements Serializable {

    @GraphQLQuery
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "finalized_by", referencedColumnName = "id")
    Employee finalizedBy

    @GraphQLQuery
    @Column(name = "finalized_date", columnDefinition = "timestamp")
    Instant finalizedDate

}