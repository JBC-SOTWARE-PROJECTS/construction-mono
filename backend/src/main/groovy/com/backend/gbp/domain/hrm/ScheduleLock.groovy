package com.backend.gbp.domain.hrm

import com.backend.gbp.domain.AbstractAuditingEntity
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.Table
import java.time.Instant

@Entity
@Table(schema = "hrm", name = "schedule_locks")
class ScheduleLock extends AbstractAuditingEntity {


    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @GraphQLQuery
    @Column(name = "date", columnDefinition = "timestamp")
    Instant date

    @GraphQLQuery
    @Column(name = "is_locked", columnDefinition = "bool")
    Boolean isLocked

}
