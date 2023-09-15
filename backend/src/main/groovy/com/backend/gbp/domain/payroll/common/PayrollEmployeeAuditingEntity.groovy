package com.backend.gbp.domain.payroll.common

import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.payroll.PayrollEmployee
import com.backend.gbp.domain.payroll.enums.PayrollEmployeeStatus
import com.fasterxml.jackson.annotation.JsonIgnore
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction

import javax.persistence.*
import java.time.Instant

@MappedSuperclass
class PayrollEmployeeAuditingEntity extends PayrollStatusEntity<PayrollEmployeeStatus> implements Serializable {

    @NotFound(action = NotFoundAction.IGNORE)
    @JsonIgnore
    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employee", referencedColumnName = "id")
    @MapsId
    PayrollEmployee payrollEmployee

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "approved_by", referencedColumnName = "id")
    Employee approvedBy

    @Column(name = "approved_date", columnDefinition = "timestamp")
    Instant approvedDate

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "finalized_by", referencedColumnName = "id")
    Employee finalizedBy

    @Column(name = "finalized_date", columnDefinition = "timestamp")
    Instant finalizedDate

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rejected_by", referencedColumnName = "id")
    Employee rejectedBy

    @Column(name = "rejected_date", columnDefinition = "timestamp")
    Instant rejectedDate

}