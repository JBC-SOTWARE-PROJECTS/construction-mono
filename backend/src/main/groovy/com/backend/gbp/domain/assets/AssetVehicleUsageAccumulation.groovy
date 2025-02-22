package com.backend.gbp.domain.assets

import com.backend.gbp.domain.assets.enums.PreventiveScheduleType
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*
import java.time.Instant

@Entity
@Table(schema = "asset", name = "vehicle_usage_accumulated_report")
class AssetVehicleUsageAccumulation implements Serializable{

	@GraphQLQuery
	@Id
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "date_of_usage")
	Instant dateOfUsage

	@GraphQLQuery
	@Column(name = "accumulated_odometer")
	BigDecimal accumulatedOdo

	@GraphQLQuery
	@Column(name = "accumulated_fuel")
	BigDecimal accumulatedFuel

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "asset", referencedColumnName = "id")
	Assets asset

}
