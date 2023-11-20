package com.backend.gbp.domain.assets

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.annotations.UpperCase
import com.backend.gbp.domain.assets.enums.AssetStatus
import com.backend.gbp.domain.assets.enums.AssetType
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
@Table(schema = "asset", name = "assets")
@SQLDelete(sql = "UPDATE asset.assets SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class Assets extends AbstractAuditingEntity implements Serializable {
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "code")
	String assetCode

	@GraphQLQuery
	@Column(name = "description")
	@UpperCase
	String description
	
	@GraphQLQuery
	@Column(name = "brand")
	@UpperCase
	String brand

	@GraphQLQuery
	@Column(name = "make")
	@UpperCase
	String model

	@GraphQLQuery
	@Column(name = "plate_no")
	String plateNo

	@GraphQLQuery
	@Column(name = "prefix")
	String prefix

	@GraphQLQuery
	@Column(name = "image")
	String image

	@Enumerated(EnumType.STRING)
	@Column(name = "status")
	AssetStatus status

	@Enumerated(EnumType.STRING)
	@Column(name = "type")
	AssetType type

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "item", referencedColumnName = "id")
	Item item

	@GraphQLQuery
	@Column(name = "company")
	UUID company

}
