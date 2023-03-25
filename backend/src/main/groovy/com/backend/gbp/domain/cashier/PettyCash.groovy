package com.backend.gbp.domain.cashier

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.annotations.UpperCase
import com.backend.gbp.domain.billing.Billing
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.projects.Projects
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
@Table(schema = "cashier", name = "petty_cash")
@SQLDelete(sql = "UPDATE cashier.petty_cash SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class PettyCash extends AbstractAuditingEntity implements Serializable {

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "code", columnDefinition = 'varchar')
	String code

	@GraphQLQuery
	@Column(name = "cash_type", columnDefinition = 'varchar')
	String cashType

	@GraphQLQuery
	@Column(name = "date_trans")
	Instant dateTrans

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "petty_type", referencedColumnName = "id")
	PettyType pettyType

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "shiftid", referencedColumnName = "id")
	Shift shift

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "project", referencedColumnName = "id")
	Projects project

	@GraphQLQuery
	@Column(name = "remarks", columnDefinition = 'varchar')
	@UpperCase
	String remarks

	@GraphQLQuery
	@Column(name = "notes", columnDefinition = 'varchar')
	@UpperCase
	String notes

	@GraphQLQuery
	@Column(name = "amount", columnDefinition = 'numeric')
	BigDecimal amount

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "received_by", referencedColumnName = "id")
	Employee receivedBy

	@GraphQLQuery
	@Column(name = "received_from", columnDefinition = 'varchar')
	@UpperCase
	String receivedFrom

	@GraphQLQuery
	@Column(name = "is_posted", columnDefinition = 'bool')
	Boolean isPosted

	@GraphQLQuery
	@Column(name = "is_void", columnDefinition = 'bool')
	Boolean isVoid

}
