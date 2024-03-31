package com.backend.gbp.domain.inventory

import com.backend.gbp.domain.AbstractAuditingEntity
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import org.hibernate.annotations.Where

import javax.persistence.*

@Entity
@Table(schema = "inventory", name = "purchase_request_items")
@SQLDelete(sql = "UPDATE inventory.purchase_request_items SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class PurchaseRequestItem extends AbstractAuditingEntity implements Serializable {
	
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
	@JoinColumn(name = "`item`", referencedColumnName = "id")
	Item item
	
	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "`purchase_request`", referencedColumnName = "id")
    PurchaseRequest purchaseRequest

	@GraphQLQuery
	@Column(name = "ref_po", columnDefinition = "int")
	UUID refPo
	
	@GraphQLQuery
	@Column(name = "requested_qty", columnDefinition = "int")
	BigDecimal requestedQty
	
	@GraphQLQuery
	@Column(name = "on_hand_qty", columnDefinition = "numeric")
	BigDecimal onHandQty

	@GraphQLQuery
	@Column(name = "unit_cost", columnDefinition = "numeric")
	BigDecimal unitCost
	
	@GraphQLQuery
	@Column(name = "remarks", columnDefinition = "varchar")
	String remarks

	@Transient
	String getUnitMeasurement() {
		return "${item.unit_of_purchase?.unitDescription} (${item.item_conversion} ${item.unit_of_usage?.unitDescription})"
	}
	
}
