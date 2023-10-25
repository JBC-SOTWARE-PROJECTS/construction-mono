package com.backend.gbp.domain.inventory

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.annotations.UpperCase
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import org.hibernate.annotations.Where

import javax.persistence.*

@Entity
@Table(schema = "inventory", name = "item")
@SQLDelete(sql = "UPDATE inventory.item SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class Item extends AbstractAuditingEntity implements Serializable {
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "sku")
	String sku

	@GraphQLQuery
	@Column(name = "item_code")
	String itemCode

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "item_group", referencedColumnName = "id")
	ItemGroup item_group

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "item_category", referencedColumnName = "id")
	ItemCategory item_category
	
	@GraphQLQuery
	@Column(name = "desc_long")
	@UpperCase
	String descLong

	@GraphQLQuery
	@Column(name = "brand")
	@UpperCase
	String brand

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "unit_of_purchase", referencedColumnName = "id")
	UnitMeasurement unit_of_purchase

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "unit_of_usage", referencedColumnName = "id")
	UnitMeasurement unit_of_usage

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "item_generics", referencedColumnName = "id")
	Generic item_generics

	@GraphQLQuery
	@Column(name = "item_conversion")
	Integer item_conversion

	@GraphQLQuery
	@Column(name = "item_maximum")
	BigDecimal item_maximum

	@GraphQLQuery
	@Column(name = "item_demand_qty")
	BigDecimal item_demand_qty

	@GraphQLQuery
	@Column(name = "base_price")
	BigDecimal actualUnitCost

	@GraphQLQuery
	@Column(name = "item_markup")
	BigDecimal item_markup

	@GraphQLQuery
	@Column(name = "markup_lock")
	Boolean markupLock

	@GraphQLQuery
	@Column(name = "is_medicine")
	Boolean isMedicine

	@GraphQLQuery
	@Column(name = "vatable")
	Boolean vatable

	@GraphQLQuery
	@Column(name = "consignment")
	Boolean consignment

	@GraphQLQuery
	@Column(name = "discountable")
	Boolean discountable
	
	@GraphQLQuery
	@Column(name = "production")
	Boolean production

	@GraphQLQuery
	@Column(name = "active")
	Boolean active

	@GraphQLQuery
	@Column(name = "fix_asset")
	Boolean fixAsset

	@GraphQLQuery
	@Column(name = "company")
	UUID company

	@Transient
	String getUnitMeasurement() {
		return "${unit_of_purchase.unitDescription} (${item_conversion} ${unit_of_usage.unitDescription})"
	}

	@Transient
	String getUnitOfUsage() {
		return unit_of_usage.unitDescription
	}

}
