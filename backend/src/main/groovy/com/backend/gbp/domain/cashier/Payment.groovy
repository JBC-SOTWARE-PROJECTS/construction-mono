package com.backend.gbp.domain.cashier

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.billing.Billing
import com.backend.gbp.domain.billing.BillingItem
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
@Table(schema = "cashier", name = "payments")
@SQLDelete(sql = "UPDATE cashier.payments SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class Payment extends AbstractAuditingEntity {

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "totalpayments")
	BigDecimal totalPayments

	@GraphQLQuery
	@Column(name = "totalcash")
	BigDecimal totalCash

	@GraphQLQuery
	@Column(name = "totalcheck")
	BigDecimal totalCheck

	@GraphQLQuery
	@Column(name = "totalcard")
	BigDecimal totalCard

	@GraphQLQuery
	@Column(name = "ornumber")
	String orNumber

	@GraphQLQuery
	@Column(name = "description")
	String description

	@GraphQLQuery
	@Column(name = "in_words")
	String inWords

	@GraphQLQuery
	@Column(name = "remarks")
	String remarks

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "billingid", referencedColumnName = "id")
	Billing billing

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "billingitemid", referencedColumnName = "id")
	BillingItem billingItem


	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "shiftid", referencedColumnName = "id")
	Shift shift

	@GraphQLQuery
	@Column(name = "receipt_type")
	String receiptType

	@GraphQLQuery
	@Column(name = "void")
	Boolean voided

	@GraphQLQuery
	@Column(name = "void_date")
	Instant voidDate

	@GraphQLQuery
	@Column(name = "void_type")
	String voidBy

	@OneToMany(fetch = FetchType.LAZY, cascade = [CascadeType.ALL], orphanRemoval = true, mappedBy = "payment")
	List<PaymentDetial> paymentDetails = []

}
