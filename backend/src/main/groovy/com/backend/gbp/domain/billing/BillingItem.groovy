package com.backend.gbp.domain.billing

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.annotations.UpperCase
import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.domain.services.ServiceManagement
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.LazyCollection
import org.hibernate.annotations.LazyCollectionOption
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import org.hibernate.annotations.Where

import javax.persistence.*
import java.time.Instant

@Entity
@Table(schema = "billing", name = "billing_item")
@SQLDelete(sql = "UPDATE billing.billing_item SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class BillingItem extends AbstractAuditingEntity implements Serializable {

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
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
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "service", referencedColumnName = "id")
	ServiceManagement service

	@GraphQLQuery
	@Column(name = "ref_id")
	UUID refId

	@GraphQLQuery
	@Column(name = "record_no")
	String recordNo

	@GraphQLQuery
	@UpperCase
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
	@Column(name = "wcost")
	BigDecimal wcost

	@GraphQLQuery
	@Column(name = "output_tax")
	BigDecimal outputTax

	@GraphQLQuery
	@Column(name = "item_type")
	String itemType

	@GraphQLQuery
	@Column(name = "trans_type")
	String transType


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

	@GraphQLQuery
	@Column(name = "recalculation_date")
	Instant recalculationDate

	@GraphQLQuery
	@Column(name = "tag_no")
	String tagNo

	@GraphQLQuery
	@Column(name = "posted_ledger")
	UUID postedLedger


}
