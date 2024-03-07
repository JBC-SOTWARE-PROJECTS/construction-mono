package com.backend.gbp.domain.inventory

import com.backend.gbp.domain.AbstractAuditingEntity
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*

@Entity
@Table(schema = "inventory", name = "po_items_with_monitoring")
class PurchaseOrderItemsMonitoring extends AbstractAuditingEntity implements Serializable {

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id
	
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "item", referencedColumnName = "id")
	Item item

	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "purchase_order", referencedColumnName = "id")
	PurchaseOrder purchaseOrder

	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "receiving_report", referencedColumnName = "id")
	ReceivingReport receivingReport
	
	@GraphQLQuery
	@Column(name = "quantity", columnDefinition = "numeric")
	BigDecimal quantity

	@GraphQLQuery
	@Column(name = "unit_cost", columnDefinition = "numeric")
	BigDecimal unitCost

	@GraphQLQuery
	@Column(name = "pr_nos", columnDefinition = "varchar")
	String prNos
	
	@GraphQLQuery
	@Column(name = "qty_in_small", columnDefinition = "int")
	BigDecimal qtyInSmall

	@GraphQLQuery
	@Column(name = "type", columnDefinition = "varchar")
	String type

	@GraphQLQuery
	@Column(name = "type_text", columnDefinition = "varchar")
	String type_text

	@GraphQLQuery
	@Column(name = "delivered_qty")
	BigDecimal deliveredQty

	@GraphQLQuery
	@Column(name = "delivery_balance")
	BigDecimal deliveryBalance

	@Transient
	String getUnitMeasurement() {
		return "${item.unit_of_purchase?.unitDescription} (${item.item_conversion} ${item.unit_of_usage?.unitDescription})"
	}
	
}
