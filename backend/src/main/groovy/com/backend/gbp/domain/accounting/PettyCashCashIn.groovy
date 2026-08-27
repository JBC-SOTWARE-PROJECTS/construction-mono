package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.annotations.UpperCase
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
@Table(name = "petty_cash_cash_in", schema = "accounting")
class PettyCashCashIn extends AbstractAuditingEntity implements Serializable {

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "trans_date", columnDefinition = "date")
	Instant transDate

	@GraphQLQuery
	@Column(name = "reference_no", columnDefinition = "varchar")
	@UpperCase
	String referenceNo

	@GraphQLQuery
	@Column(name = "description", columnDefinition = "varchar")
	@UpperCase
	String description

	@GraphQLQuery
	@Column(name = "amount", columnDefinition = "numeric")
	BigDecimal amount

	@GraphQLQuery
	@Column(name = "company", columnDefinition = "uuid")
	UUID company

	@GraphQLQuery
	@Column(name = "status", columnDefinition = "varchar")
	@UpperCase
	String status

	@GraphQLQuery
	@Column(name = "posted", columnDefinition = "bool")
	Boolean posted
}
