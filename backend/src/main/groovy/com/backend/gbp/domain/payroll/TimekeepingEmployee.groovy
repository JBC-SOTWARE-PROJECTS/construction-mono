package com.backend.gbp.domain.payroll

import com.backend.gbp.domain.hrm.dto.AccumulatedLogsDto
import com.backend.gbp.domain.payroll.common.PayrollEmployeeAuditingEntity
import com.fasterxml.jackson.annotation.JsonIgnore
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*

@Entity
@Table(schema = "payroll", name = "timekeeping_employees")
class TimekeepingEmployee extends PayrollEmployeeAuditingEntity implements Serializable {

    @GraphQLQuery
    @Id
    @Column(name = "employee", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @OneToMany(mappedBy = "timekeepingEmployee", orphanRemoval = true, cascade = CascadeType.ALL, fetch = FetchType.LAZY)
    List<AccumulatedLogs> accumulatedLogs = []

    @NotFound(action = NotFoundAction.IGNORE)
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "timekeeping", referencedColumnName = "payroll")
    Timekeeping timekeeping

}
