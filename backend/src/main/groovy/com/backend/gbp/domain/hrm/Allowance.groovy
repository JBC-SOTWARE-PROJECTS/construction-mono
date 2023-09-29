package com.backend.gbp.domain.hrm

import com.backend.gbp.domain.AbstractAuditingEntity

import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.*

import javax.persistence.*
import java.time.Instant


@javax.persistence.Entity
@javax.persistence.Table(schema = "hrm", name = "allowance")
@SQLDelete(sql = "UPDATE hrm.allowance SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class Allowance extends AbstractAuditingEntity {

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
	@Column(name = "allowance_type", columnDefinition = "varchar")
	String allowanceType

	@GraphQLQuery
	@Column(name = "amount", columnDefinition = "numeric")
	Double amount

	@GraphQLQuery
	@Column(name = "created_date", columnDefinition = "timestamp")
	Instant createdDate


}
