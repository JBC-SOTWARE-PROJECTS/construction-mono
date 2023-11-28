package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.*
import java.time.Instant

//import org.joda.time.DateTime

@Entity
@Table(schema = "accounting", name = "ar_payment_posting_details")
class ARPaymentPostingItems extends AbstractAuditingEntity implements Serializable{

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "record_no")
	String recordNo

	@GraphQLQuery
	@Column(name = "or_number")
	String orNumber

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "ar_payment_posting", referencedColumnName = "id")
	ARPaymentPosting arPaymentPosting

	@GraphQLQuery
	@Column(name = "payment_tracker_id", columnDefinition = "uuid")
	UUID paymentTrackerId

	@GraphQLQuery
	@Column(name = "payment_datetime")
	Instant paymentDatetime

	@GraphQLQuery
	@Column(name = "item_type")
	String itemType

	@GraphQLQuery
	@Column(name = "invoice_id")
	UUID invoiceId

	@GraphQLQuery
	@Column(name = "invoice_no")
	String invoiceNo

	@GraphQLQuery
	@Column(name = "invoice_due_date")
	Date invoiceDueDate

	@GraphQLQuery
	@Column(name = "invoice_item_id")
	UUID invoiceItemId

	@GraphQLQuery
	@Column(name = "item_name")
	String itemName

	@GraphQLQuery
	@Column(name = "description")
	String description

	@GraphQLQuery
	@Column(name = "reference")
	String reference

	@GraphQLQuery
	@Column(name = "customer_id")
	UUID customerId

	@GraphQLQuery
	@Column(name = "customer_name")
	String customerName

	@GraphQLQuery
	@Column(name = "total_amount_due")
	BigDecimal totalAmountDue

	@GraphQLQuery
	@Column(name = "applied_discount")
	BigDecimal appliedDiscount

	@GraphQLQuery
	@Column(name = "amount_paid")
	BigDecimal amountPaid
}
