package com.backend.gbp.domain.cashier

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.hrm.Employee
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import org.hibernate.annotations.Where

import javax.persistence.*
import java.time.Instant

@Entity
@Table(schema = "cashier", name = "shifting")
@SQLDelete(sql = "UPDATE cashier.shifting SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class Shift extends AbstractAuditingEntity {

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "terminal", referencedColumnName = "id")
	Terminal terminal

	@GraphQLQuery
	@Column(name = "shift_no")
	String shiftNo

	@GraphQLQuery
	@Column(name = "active")
	Boolean active

	@GraphQLQuery
	@Column(name = "start_shift")
	Instant startShift

	@GraphQLQuery
	@Column(name = "end_shift")
	Instant endShift

	@GraphQLQuery
	@Column(name = "remarks")
	String remarks

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "employee", referencedColumnName = "id")
	Employee employee

	@GraphQLQuery
	@OneToMany(fetch = FetchType.LAZY, mappedBy = "shift")
	@OrderBy("orNumber")
	Set<Payment> payments = []

}
