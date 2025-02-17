package com.backend.gbp.domain.cashier

import com.backend.gbp.domain.AbstractAuditingEntity
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.Table
import javax.persistence.Transient


@Entity
@Table(name = "payment_items", schema = "cashier")
class PaymentItem extends AbstractAuditingEntity implements Serializable{

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "record_no", columnDefinition = "varchar")
	String recordNo

	@GraphQLQuery
	@Column(name = "item_name", columnDefinition = "varchar")
	String itemName

	@GraphQLQuery
	@Column(name = "description", columnDefinition = "varchar")
	String description

	@GraphQLQuery
	@Column(name = "unit", columnDefinition = "varchar")
	String unit

	@GraphQLQuery
	@Column(name = "qty", columnDefinition = "int")
	Integer qty

	@GraphQLQuery
	@Column(name = "price", columnDefinition = "numeric")
	BigDecimal price

	@GraphQLQuery
	@Column(name = "vat", columnDefinition = "numeric")
	BigDecimal vat

	@GraphQLQuery
	@Column(name = "vat_exempt", columnDefinition = "numeric")
	BigDecimal vatExempt

	@GraphQLQuery
	@Column(name = "vat_zero_rated_sales", columnDefinition = "numeric")
	BigDecimal vatZero_rated_sales

	@GraphQLQuery
	@Column(name = "discount", columnDefinition = "numeric")
	BigDecimal discount

	@GraphQLQuery
	@Column(name = "deductions", columnDefinition = "numeric")
	BigDecimal deductions

	@GraphQLQuery
	@Column(name = "withholding_tax", columnDefinition = "numeric")
	BigDecimal withholdingTax

	@GraphQLQuery
	@Column(name = "recoupment", columnDefinition = "numeric")
	BigDecimal recoupment

	@GraphQLQuery
	@Column(name = "retention", columnDefinition = "numeric")
	BigDecimal retention

	@GraphQLQuery
	@Column(name = "amount", columnDefinition = "numeric")
	BigDecimal amount

	@GraphQLQuery
	@Column(name = "is_voided", columnDefinition = "bool")
	Boolean isVoided

	@GraphQLQuery
	@Column(name = "reference_item_type", columnDefinition = "varchar")
	String referenceItemType

	@GraphQLQuery
	@Column(name = "reference_item_id", columnDefinition = "uuid")
	UUID referenceItemId

	@GraphQLQuery
	@Column(name = "payment_tracker_id", columnDefinition = "uuid")
	UUID paymentTrackerId

	@GraphQLQuery
	@Column(name = "company_id")
	UUID companyId

	@Transient
	BigDecimal tmpSubTotal,tmpPayment
}
