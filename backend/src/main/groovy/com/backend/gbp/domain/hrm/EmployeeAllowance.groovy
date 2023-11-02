package com.backend.gbp.domain.hrm

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.hrm.enums.AllowanceType
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.*

import javax.persistence.*

@javax.persistence.Entity
@javax.persistence.Table(schema = "hrm", name = "employee_allowance")
class EmployeeAllowance extends AbstractAuditingEntity {

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "employee", referencedColumnName = "id", nullable = false)
	Employee employee;

	@GraphQLQuery
	@Column(name = "name", columnDefinition = "varchar")
	String name

	@GraphQLQuery
	@Enumerated(EnumType.STRING)
	@Column(name = "allowance_type", columnDefinition = "varchar")
	AllowanceType allowanceType

	@GraphQLQuery
	@Column(name = "amount", columnDefinition = "numeric")
	BigDecimal amount

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "company", referencedColumnName = "id")
	CompanySettings company

	@GraphQLQuery
	@Column(name = "allowance", columnDefinition = "uuid")
	UUID allowance

}
