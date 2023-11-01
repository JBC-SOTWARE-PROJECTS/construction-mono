package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.Office
import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.domain.projects.Projects
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.Table
import javax.persistence.Transient
import java.time.Instant


@Entity
@Table(name = "petty_cash_purchases", schema = "accounting")
class PettyCashItem extends AbstractAuditingEntity implements Serializable {

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "item", referencedColumnName = "id")
	Item item

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "office", referencedColumnName = "id")
	Office office

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "project", referencedColumnName = "id")
	Projects project

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "petty_cash", referencedColumnName = "id")
	PettyCashAccounting pettyCash

	@GraphQLQuery
	@Column(name = "qty", columnDefinition = "int")
	Integer qty

	@GraphQLQuery
	@Column(name = "unit_cost", columnDefinition = "numeric")
	BigDecimal unitCost

	@GraphQLQuery
	@Column(name = "inventory_cost", columnDefinition = "numeric")
	BigDecimal inventoryCost

	@GraphQLQuery
	@Column(name = "gross_amount", columnDefinition = "numeric")
	BigDecimal grossAmount

	@GraphQLQuery
	@Column(name = "disc_rate", columnDefinition = "numeric")
	BigDecimal discRate

	@GraphQLQuery
	@Column(name = "disc_amount", columnDefinition = "numeric")
	BigDecimal discAmount

	@GraphQLQuery
	@Column(name = "net_discount", columnDefinition = "numeric")
	BigDecimal netDiscount

	@GraphQLQuery
	@Column(name = "expiration_date", columnDefinition = 'date')
	Instant expirationDate

	@GraphQLQuery
	@Column(name = "lot_no", columnDefinition = 'date')
	String lotNo

	@GraphQLQuery
	@Column(name = "is_vat", columnDefinition = "bool")
	Boolean isVat

	@GraphQLQuery
	@Column(name = "vat_amount", columnDefinition = "numeric")
	BigDecimal vatAmount

	@GraphQLQuery
	@Column(name = "net_amount", columnDefinition = "numeric")
	BigDecimal netAmount

	@GraphQLQuery
	@Column(name = "is_posted", columnDefinition = 'bool')
	Boolean isPosted

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

	@GraphQLQuery(name = "descLong")
	@Transient
	String getDescLong() {
		return "${item.descLong}"
	}

	@GraphQLQuery
	@Column(name = "company", columnDefinition = "uuid")
	UUID company

}

