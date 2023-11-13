package com.backend.gbp.domain.payroll

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.hrm.enums.AllowanceType
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.*

import javax.persistence.*
import java.time.Instant


@javax.persistence.Entity
@javax.persistence.Table(schema = "payroll", name = "other_deduction_types")
@SQLDelete(sql = "UPDATE hrm.allowance SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class OtherDeductionTypes extends AbstractAuditingEntity {

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
	@Column(name = "code", columnDefinition = "varchar")
	String code

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "company", referencedColumnName = "id")
	CompanySettings company
}
