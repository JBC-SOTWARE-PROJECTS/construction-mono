package com.backend.gbp.domain.hrm

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.CompanySettings
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import org.hibernate.annotations.Where

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.Table
import java.time.Instant


@Entity
@Table(schema = "hrm", name = "event_calendar")
@SQLDelete(sql = "UPDATE hrm.event_calendar SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class EventCalendar extends AbstractAuditingEntity {

    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @GraphQLQuery
    @Column(name = "name", columnDefinition = "varchar")
    String name

    @GraphQLQuery
    @Column(name = "start_date")
    Instant startDate

    @GraphQLQuery
    @Column(name = "end_date")
    Instant endDate

    @GraphQLQuery
    @Column(name = "fixed", columnDefinition = "varchar")
    String fixed

    @GraphQLQuery
    @Column(name = "holiday_type", columnDefinition = "varchar")
    String holidayType

    @GraphQLQuery
    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company", referencedColumnName = "id")
    CompanySettings company
}
