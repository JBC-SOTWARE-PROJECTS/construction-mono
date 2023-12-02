package com.backend.gbp.domain.hrm

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.hrm.enums.AttendanceType
import com.backend.gbp.domain.projects.Projects
import com.fasterxml.jackson.annotation.JsonIgnore
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.*
import javax.persistence.*
import java.time.Duration
import java.time.Instant
import javax.persistence.Table
import javax.persistence.Entity

@Entity
@Table(schema = "hrm", name = "employee_attendance")
@SQLDelete(sql = "UPDATE hrm.employee_attendance SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class EmployeeAttendance extends AbstractAuditingEntity {

    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @JsonIgnore
    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "employee", referencedColumnName = "id")
    Employee employee

    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "project", referencedColumnName = "id")
    Projects project

    @GraphQLQuery
    @Column(name = "attendance_time", nullable = false)
    Instant attendance_time

    @GraphQLQuery
    @Column(name = "original_attendance_time", nullable = false)
    Instant original_attendance_time

    @GraphQLQuery
    @Column(name = "type", columnDefinition = "varchar")
    String type

    @GraphQLQuery
    @Column(name = "original_type", columnDefinition = "varchar")
    String originalType


    @GraphQLQuery
    @Column(name = "additional_note", columnDefinition = "varchar")
    String additionalNote

    @GraphQLQuery
    @Column(name = "reference_id", columnDefinition = "varchar")
    String referenceId

    @GraphQLQuery
    @Column(name = "is_manual", columnDefinition = "bool")
    Boolean isManual

    @GraphQLQuery
    @Column(name = "is_ignored", columnDefinition = "bool")
    Boolean isIgnored

    @GraphQLQuery
    @Column(name = "is_transfer", columnDefinition = "bool")
    Boolean isTransfer

    @Transient
    String getDateString() {
        return (attendance_time + Duration.ofHours(8)).toString().substring(0, 10)
    }


}
