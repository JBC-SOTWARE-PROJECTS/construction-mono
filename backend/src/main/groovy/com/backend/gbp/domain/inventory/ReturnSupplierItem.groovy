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
@Table(schema = "inventory", name = "return_supplier_items")
@SQLDelete(sql = "UPDATE inventory.return_supplier_items SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class ReturnSupplierItem extends AbstractAuditingEntity implements Serializable {
	
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
	@JoinColumn(name = "return_supplier", referencedColumnName = "id")
    ReturnSupplier returnSupplier
	
	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "item", referencedColumnName = "id")
	Item item
	
	@GraphQLQuery
	@Column(name = "return_qty", columnDefinition = 'int')
	Integer returnQty
	
	@GraphQLQuery
	@Column(name = "return_unit_cost", columnDefinition = 'numeric')
	BigDecimal returnUnitCost
	
	@GraphQLQuery
	@Column(name = "return_remarks", columnDefinition = 'text')
	String return_remarks
	
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
	
}
