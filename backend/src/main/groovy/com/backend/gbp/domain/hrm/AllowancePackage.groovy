package com.backend.gbp.domain.hrm

import com.backend.gbp.domain.AbstractAuditingEntity
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import org.hibernate.annotations.Where

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.Table
import java.time.Instant

@Entity
@Table(schema = "hrm", name = "allowance_package")
@SQLDelete(sql = "UPDATE hrm.allowance_package SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class AllowancePackage extends AbstractAuditingEntity implements Serializable {

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
    @Column(name = "status", columnDefinition = "bool")
    Boolean status

    @GraphQLQuery
    @Column(name = "created_date", columnDefinition = "timestamp")
    Instant createdDate
}
