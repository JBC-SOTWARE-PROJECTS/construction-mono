package com.backend.gbp.domain.assets

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.inventory.Item
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import org.hibernate.annotations.Where

import javax.persistence.*

@Entity
@Table(schema = "asset", name = "asset_repair_maintenance_items")
@SQLDelete(sql = "UPDATE asset.asset_repair_maintenance_items SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class AssetRepairMaintenanceItems extends AbstractAuditingEntity implements Serializable {
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "quantity")
	Integer quantity

	@GraphQLQuery
	@Column(name = "base_price")
	BigDecimal basePrice

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "asset_repair_maintenance", referencedColumnName = "id")
	AssetRepairMaintenance assetRepairMaintenance

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "item", referencedColumnName = "id")
	Item item

	@GraphQLQuery
	@Column(name = "company")
	UUID company

}
