package com.backend.gbp.domain.cashier

import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.Type

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.Id
import javax.persistence.Table
import java.time.Instant

@Entity
@Table(schema = "cashier", name = "payment_items")
class PaymentItems {

	@GraphQLQuery
	@Id
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "paymentid")
	UUID paymentid

	@GraphQLQuery
	@Column(name = "billingid")
	UUID billingid

	@GraphQLQuery
	@Column(name = "billingitemid")
	UUID billingitemid

	@GraphQLQuery
	@Column(name = "payment_date")
	Instant paymentDate

	@GraphQLQuery
	@Column(name = "trans_date")
	Instant transDate

	@GraphQLQuery
	@Column(name = "description")
	String description

	@GraphQLQuery
	@Column(name = "item_type")
	String itemType

	@GraphQLQuery
	@Column(name = "amount")
	BigDecimal amount

	@GraphQLQuery
	@Column(name = "output_tax")
	BigDecimal outputTax

}
