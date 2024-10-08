package com.backend.gbp.domain.inventory

import com.backend.gbp.domain.AbstractAuditingEntity
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*

@Entity
@Table(schema = "inventory", name = "po_delivery_monitoring")
class PODeliveryMonitoring extends AbstractAuditingEntity implements Serializable{
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id
	
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "purchase_order_item", referencedColumnName = "id")
	PurchaseOrderItems purchaseOrderItem

	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "receiving", referencedColumnName = "id")
	ReceivingReport receivingReport

	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "receiving_item", referencedColumnName = "id")
    ReceivingReportItem receivingReportItem
	
	@GraphQLQuery
	@Column(name = "delivered_qty", columnDefinition = "numeric")
	BigDecimal quantity
	
	@GraphQLQuery
	@Column(name = "delivery_status", columnDefinition = "varchar")
	String status //

	

	
}
