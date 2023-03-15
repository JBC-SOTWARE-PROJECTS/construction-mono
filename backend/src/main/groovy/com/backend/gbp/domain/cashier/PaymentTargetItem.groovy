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

@Entity
@Table(schema = "cashier", name = "payments_target_item")
@SQLDelete(sql = "UPDATE cashier.payments_target_item SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class PaymentTargetItem extends AbstractAuditingEntity {

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
	@JoinColumn(name = "paymentid", referencedColumnName = "id")
	Payment payment

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
	@Column(name = "amount")
	BigDecimal amount

	@GraphQLQuery
	@Column(name = "voided")
	Boolean voided

}
