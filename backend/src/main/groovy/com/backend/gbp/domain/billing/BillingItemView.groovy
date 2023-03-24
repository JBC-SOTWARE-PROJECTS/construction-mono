package com.backend.gbp.domain.billing


import com.backend.gbp.domain.inventory.Item
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.LazyCollection
import org.hibernate.annotations.LazyCollectionOption
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*
import java.time.Instant

@Entity
@Table(schema = "billing", name = "billing_item_view")
class BillingItemView implements Serializable {

	@GraphQLQuery
	@Id
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "trans_date")
	Instant transDate

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "billing", referencedColumnName = "id")
	Billing billing

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "item", referencedColumnName = "id")
	Item item

	@GraphQLQuery
	@Column(name = "record_no")
	String recordNo

	@GraphQLQuery
	@Column(name = "description")
	String description

	@GraphQLQuery
	@Column(name = "qty")
	BigDecimal qty

	@GraphQLQuery
	@Column(name = "debit")
	BigDecimal debit

	@GraphQLQuery
	@Column(name = "credit")
	BigDecimal credit

	@GraphQLQuery
	@Column(name = "sub_total")
	BigDecimal subTotal

	@GraphQLQuery
	@Column(name = "item_type")
	String itemType

	@GraphQLQuery
	@Column(name = "trans_type")
	String transType

	@GraphQLQuery
	@Column(name = "credit_payment")
	BigDecimal creditPayment

	@GraphQLQuery
	@Column(name = "or_num")
	String orNum

	@GraphQLQuery
	@Column(name = "status")
	Boolean status // active = true //inactive = false

	@NotFound(action = NotFoundAction.IGNORE)
	@GraphQLQuery
	@LazyCollection(LazyCollectionOption.FALSE)
	@OneToMany(mappedBy = "billingItem")
	List<DiscountDetails> discountDetails

}
