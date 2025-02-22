package com.backend.gbp.domain.inventory

import com.backend.gbp.domain.Office
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.Type

import javax.persistence.*
import java.math.RoundingMode

@Entity
@Table(schema = "inventory", name = "inventory")
class Inventory implements Serializable {

	@GraphQLQuery
	@Id
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "item", referencedColumnName = "id")
	Item item

	@GraphQLQuery
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "office", referencedColumnName = "id")
	Office office

	@GraphQLQuery
	@Column(name = "reorder_quantity")
	BigDecimal reOrderQty

	@GraphQLQuery
	@Column(name = "actual_cost")
	BigDecimal actualCost

	@GraphQLQuery
	@Column(name = "output_tax")
	BigDecimal outputTax

	@GraphQLQuery
	@Column(name = "selling_price")
	BigDecimal sellingPrice

	@GraphQLQuery
	@Column(name = "onhand")
	BigDecimal onHand

	@GraphQLQuery
	@Column(name = "last_unit_cost")
	BigDecimal lastUnitCost //last unit cost upon receiving

	//@GraphQLQuery
	//@Column(name = "last_wcost")
	//BigDecimal last_wcost //cost of sale (unit cost for charging, transfer, physical count, etc.)
	//last_wcost g balhin nako sa contex

	@GraphQLQuery
	@Column(name = "allow_trade")
	Boolean allowTrade

	@GraphQLQuery
	@Column(name = "desc_long")
	String descLong

	@GraphQLQuery
	@Column(name = "sku")
	String sku

	@GraphQLQuery
	@Column(name = "item_code")
	String itemCode

	@GraphQLQuery
	@Column(name = "office_id")
	UUID officeId

	@GraphQLQuery
	@Column(name = "item_id")
	UUID itemId

	@GraphQLQuery
	@Column(name = "item_group")
	UUID item_group

	@GraphQLQuery
	@Column(name = "item_category")
	UUID item_category

	@GraphQLQuery
	@Column(name = "active")
	Boolean active

	@GraphQLQuery
	@Column(name = "production")
	Boolean production

	@GraphQLQuery
	@Column(name = "is_medicine")
	Boolean isMedicine

	@GraphQLQuery
	@Column(name = "vatable")
	Boolean vatable

	@GraphQLQuery
	@Column(name = "gov_markup")
	BigDecimal govMarkup

	@GraphQLQuery
	@Column(name = "vat_rate")
	BigDecimal vatRate

	@GraphQLQuery
	@Column(name = "brand")
	String brand

	@GraphQLQuery
	@Column(name = "fix_asset")
	Boolean fixAsset

	@GraphQLQuery
	@Column(name = "consignment")
	Boolean consignment

	@GraphQLQuery
	@Column(name = "company")
	UUID company

	@Transient
	String getUnitMeasurement() {
		return "${item.unit_of_purchase?.unitDescription} (${item.item_conversion} ${item.unit_of_usage?.unitDescription})"
	}

	@Transient
	String getUou() {
		return item.unit_of_usage?.unitDescription
	}

	@GraphQLQuery(name = "status")
	@Transient
	String status
	String getStatus() {
		def res = "Critical"
		if(reOrderQty < onHand){
			res = "Healthy"
			if(onHand > item.item_maximum){
				res = "Over Stock"
			}
		} else if(onHand <= 0){
			res = "No Stock"
		}
		res
	}

	//Transient
	@GraphQLQuery(name = "markup")
	@Transient
	BigDecimal markup
	BigDecimal getMarkup() {
		def rate = 0.00
		if(actualCost && sellingPrice){
			def lprice = actualCost;
			def sprice = sellingPrice - actualCost;
			rate = (sprice / lprice) * 100;
		}
		rate.setScale(2, RoundingMode.HALF_EVEN)
	}
}
