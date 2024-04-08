package com.backend.gbp.domain.inventory

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.Office
import com.backend.gbp.domain.accounting.IntegrationDomainEnum
import com.backend.gbp.domain.types.AutoIntegrateable
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
@Table(schema = "inventory", name = "beginning_balance")
@SQLDelete(sql = "UPDATE inventory.beginning_balance SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class BeginningBalance extends AbstractAuditingEntity implements AutoIntegrateable {

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "ref_num")
	String refNum

	@GraphQLQuery
	@Column(name = "date_trans")
	Instant dateTrans

	@GraphQLQuery
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "item", referencedColumnName = "id")
	Item item

	@GraphQLQuery
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "office", referencedColumnName = "id")
	Office office

	@GraphQLQuery
	@Column(name = "quantity")
	BigDecimal quantity

	@GraphQLQuery
	@Column(name = "unit_cost")
	BigDecimal unitCost

	@GraphQLQuery
	@Column(name = "is_posted")
	Boolean isPosted

	@GraphQLQuery
	@Column(name = "is_cancel")
	Boolean isCancel

	@GraphQLQuery
	@Column(name = "posted_by")
	String postedBy

	@GraphQLQuery
	@Column(name = "company")
	UUID company

	@GraphQLQuery
	@Column(name = "posted_ledger")
	UUID postedLedger

	@GraphQLQuery(name = "unitMeasurement")
	@Transient
	String getUnitMeasurement() {
		return "${item.unit_of_purchase?.unitDescription} (${item.item_conversion} ${item.unit_of_usage?.unitDescription})"
	}

	@GraphQLQuery(name = "uou")
	@Transient
	String getUou() {
		return "${item.unit_of_usage?.unitDescription}"
	}

	//accounting integrate
	@Override
	String getDomain() {
		return IntegrationDomainEnum.BEGINNING_BALANCE.name()
	}

	@Transient
	String flagValue

	@Override
	Map<String, String> getDetails() {
		return [:]
	}

	// cost for adjustment
	@Transient
	BigDecimal inventoryCost = BigDecimal.ZERO

	@Transient
	BigDecimal inventoryCostNegative = BigDecimal.ZERO

	@Transient
	BigDecimal beginningCost = BigDecimal.ZERO

	@Transient
	BigDecimal beginningCostNegative = BigDecimal.ZERO

	@Transient
	ItemSubAccount inventorySubAccount
}
