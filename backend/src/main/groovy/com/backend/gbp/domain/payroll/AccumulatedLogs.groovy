package com.backend.gbp.domain.payroll

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.hrm.dto.AccumulatedLogsDto
import com.backend.gbp.domain.hrm.dto.HoursLog
import com.backend.gbp.domain.payroll.common.PayrollEmployeeAuditingEntity
import com.fasterxml.jackson.annotation.JsonIgnore
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*
import java.time.Instant

@Entity
@Table(schema = "payroll", name = "accumulated_logs")
class AccumulatedLogs extends AbstractAuditingEntity implements Serializable {

    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @NotFound(action = NotFoundAction.IGNORE)
    @JsonIgnore
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "timekeeping_employee", referencedColumnName = "employee")
    TimekeepingEmployee timekeepingEmployee

    @Column(name = "log_date", columnDefinition = "timestamp")
    Instant date

    @GraphQLQuery
    @Column(name = "schedule_start", columnDefinition = "timestamp")
    Instant scheduleStart

    @GraphQLQuery
    @Column(name = "schedule_end", columnDefinition = "timestamp")
    Instant scheduleEnd

    @GraphQLQuery
    @Column(name = "schedule_title", columnDefinition = "varchar")
    String scheduleTitle

    @GraphQLQuery
    @Column(name = "in_time", columnDefinition = "timestamp")
    Instant inTime

    @GraphQLQuery
    @Column(name = "out_time", columnDefinition = "timestamp")
    Instant outTime

    @GraphQLQuery
    @Column(name = "message", columnDefinition = "varchar")
    String message

    @GraphQLQuery
    @Column(name = "is_error", columnDefinition = "bool")
    Boolean isError

    @GraphQLQuery
    @Column(name = "is_rest_day", columnDefinition = "bool")
    Boolean isRestDay = false

    @GraphQLQuery
    @Column(name = "is_leave", columnDefinition = "bool")
    Boolean isLeave = false

    @Type(type = "jsonb")
    @GraphQLQuery
    @Column(name="hours_log",columnDefinition = "jsonb")
    HoursLog hours

    @Type(type = "jsonb")
    @GraphQLQuery
    @Column(name="project_breakdown",columnDefinition = "jsonb")
    List<HoursLog> projectBreakdown

}
