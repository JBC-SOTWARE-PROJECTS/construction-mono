package com.backend.gbp.domain.inventory

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.Office
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
@Table(schema = "inventory", name = "quantity_adjustment")
@SQLDelete(sql = "UPDATE inventory.quantity_adjustment SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class QuantityAdjustment extends AbstractAuditingEntity {
	
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
	@Column(name = "quantity")
	Integer quantity

	@GraphQLQuery
	@Column(name = "unit_cost")
	BigDecimal unit_cost
	
	@GraphQLQuery
	@Column(name = "is_posted")
	Boolean isPosted
	
	@GraphQLQuery
	@Column(name = "is_cancel")
	Boolean isCancel

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "adjustment_type", referencedColumnName = "id")
	QuantityAdjustmentType quantityAdjustmentType

	@GraphQLQuery
	@Column(name = "remarks")
	String remarks

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
}
