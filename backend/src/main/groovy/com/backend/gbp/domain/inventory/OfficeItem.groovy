package com.backend.gbp.domain.inventory

import com.backend.gbp.domain.Office
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*
import java.math.RoundingMode

@Entity
@Table(schema = "inventory", name = "office_item")
class OfficeItem implements Serializable{
	
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
	@JoinColumn(name = "item", referencedColumnName = "id")
	Item item
	
	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "office", referencedColumnName = "id")
	Office office
	
	@GraphQLQuery
	@Column(name = "reorder_quantity")
	BigDecimal reorder_quantity

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
	@Column(name = "allow_trade")
	Boolean allow_trade

	@GraphQLQuery
	@Column(name = "is_assign")
	Boolean is_assign

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
