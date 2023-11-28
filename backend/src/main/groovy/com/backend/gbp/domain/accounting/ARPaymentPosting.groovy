package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.*

//import org.joda.time.DateTime

import java.time.Instant

@Entity
@Table(schema = "accounting", name = "ar_payment_posting")
class ARPaymentPosting extends AbstractAuditingEntity implements Serializable{

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
	@Column(name = "customer_name")
	String customerName

	@GraphQLQuery
	@Column(name = "customer_id")
	UUID arCustomerId

	@GraphQLQuery
	@Column(name = "receipt_type")
	String receiptType

	@GraphQLQuery
	@Column(name = "invoice_no")
	String invoiceNo

	@GraphQLQuery
	@Column(name = "invoice_id")
	UUID invoiceId

	@GraphQLQuery
	@Column(name = "payment_datetime")
	Instant paymentDatetime

	@GraphQLQuery
	@Column(name = "or_number")
	String orNumber

	@GraphQLQuery
	@Column(name = "payment_tracker_id", columnDefinition = "uuid")
	UUID paymentTrackerId

	@GraphQLQuery
	@Column(name = "discount_amount")
	BigDecimal discountAmount

	@GraphQLQuery
	@Column(name = "payment_amount")
	BigDecimal paymentAmount

	@GraphQLQuery
	@Column(name = "notes")
	String notes

	@GraphQLQuery
	@Column(name = "status")
	String status

	@GraphQLQuery
	@Column(name = "reference_cn", columnDefinition = "uuid")
	UUID referenceCn

}
