package com.backend.gbp.domain.hrm

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.hrm.enums.AllowanceType
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
	@Enumerated(EnumType.STRING)
	@Column(name = "allowance_type", columnDefinition = "varchar")
	AllowanceType allowanceType

	@GraphQLQuery
	@Column(name = "amount", columnDefinition = "numeric")
	Double amount

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "company", referencedColumnName = "id")
	CompanySettings company

	@GraphQLQuery
	@Column(name = "created_date", columnDefinition = "timestamp")
	Instant createdDate

	@GraphQLQuery
	@Column(name = "subaccount_code", columnDefinition = "varchar")
	String subaccountCode
}
