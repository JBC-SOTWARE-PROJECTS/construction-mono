package com.backend.gbp.domain.assets

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.annotations.UpperCase
import com.backend.gbp.domain.assets.enums.AssetStatus
import com.backend.gbp.domain.assets.enums.AssetType
import com.backend.gbp.domain.fixed_asset.FixedAssetItems
import com.backend.gbp.domain.inventory.Item
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import org.hibernate.annotations.Where

import javax.annotation.Nullable
import javax.persistence.*

@Entity
@Table(schema = "asset", name = "rental_rates")
@SQLDelete(sql = "UPDATE asset.rental_rates SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class RentalRates extends AbstractAuditingEntity implements Serializable {
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "rent_type")
	String rentType

	@GraphQLQuery
	@Column(name = "description")
	@UpperCase
	String description
	
	@GraphQLQuery
	@Nullable
	@Column(name = "measurement")
	@UpperCase
	String measurement

	@GraphQLQuery
	@Column(name = "amount")
	@UpperCase
	BigDecimal amount

	@GraphQLQuery
	@Column(name = "coverage_start")
	@UpperCase
	BigDecimal coverageStart

	@GraphQLQuery
	@Column(name = "coverage_end")
	@UpperCase
	BigDecimal coverageEnd

	@GraphQLQuery
	@Column(name = "unit")
	String unit

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "asset", referencedColumnName = "id")
	Assets asset

	@GraphQLQuery
	@Column(name = "company")
	UUID company

}
