package com.backend.gbp.domain.inventory

import com.backend.gbp.domain.Office
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*

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
	Integer reorder_quantity

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
}
