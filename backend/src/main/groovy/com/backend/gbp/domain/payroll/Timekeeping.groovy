package com.backend.gbp.domain.payroll

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.hrm.dto.HoursLog
import com.backend.gbp.domain.payroll.common.PayrollAuditingEntity
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import org.hibernate.annotations.Where

import javax.persistence.*
import java.time.Instant

@Entity
@Table(schema = "payroll", name = "timekeepings")
@SQLDelete(sql = "UPDATE payroll.timekeepings SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class Timekeeping extends PayrollAuditingEntity implements Serializable {


    @Id
    @Column(name = "payroll", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @OneToMany(mappedBy = "timekeeping")
    List<TimekeepingEmployee> timekeepingEmployees = []

    @Column(name = "deleted", columnDefinition = "bool")
    Boolean deleted

    @Column(name = "deleted_date", columnDefinition = "timestamp")
    Instant deletedEnd

    @Type(type = "jsonb")
    @GraphQLQuery
    @Column(name="project_breakdown",columnDefinition = "jsonb")
    List<HoursLog> projectBreakdown

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "payroll", referencedColumnName = "id")
    @MapsId
    Payroll payroll

}
