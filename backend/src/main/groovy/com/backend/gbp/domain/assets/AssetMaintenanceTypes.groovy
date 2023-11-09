package com.backend.gbp.domain.assets

import com.backend.gbp.domain.AbstractAuditingEntity
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import org.hibernate.annotations.Where

import javax.persistence.*

@Entity
@Table(schema = "asset", name = "asset_maintenance_types")
@SQLDelete(sql = "UPDATE asset.asset_maintenance_types SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class AssetMaintenanceTypes extends AbstractAuditingEntity implements Serializable{

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "name")
	String name

	@GraphQLQuery
	@Column(name = "description")
	String description

	/*@GraphQLQuery
	@Column(name = "category")
	String category*/

}
