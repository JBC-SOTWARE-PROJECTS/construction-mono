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
@Table(schema = "inventory", name = "supplier_item")
@SQLDelete(sql = "UPDATE inventory.supplier_item SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class SupplierItem extends AbstractAuditingEntity implements Serializable {
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id
	
	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "supplier", referencedColumnName = "id")
	Supplier supplier
	
	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "item_id", referencedColumnName = "id")
	Item item
	
	@GraphQLQuery
	@Column(name = "cost")
	BigDecimal cost

	@GraphQLQuery
	@Column(name = "cost_unit_of_purchase")
	BigDecimal costPurchase

	@GraphQLQuery
	@Column(name = "company")
	UUID company
	
	@Transient
	String getDescLong() {
		return item.descLong
	}

	@Transient
	String getGenericName() {
		return item.item_generics.genericDescription
	}

	@Transient
	String getBrand() {
		return item.brand
	}
	
	@Transient
	String getUnitMeasurement() {
		return "${item.unit_of_purchase?.unitDescription} (${item.item_conversion} ${item.unit_of_usage?.unitDescription})"
	}
	
	@Transient
	String getItemId() {
		return item.id
	}
	
}
