package com.backend.gbp.domain.assets


import com.backend.gbp.domain.assets.enums.PreventiveScheduleType
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*
import java.time.Instant

@Entity
@Table(schema = "asset", name = "asset_preventive_kms")
class AssetUpcomingPreventiveMaintenanceKms implements Serializable{

	@GraphQLQuery
	@Id
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "note")
	String note

	@GraphQLQuery
	@Column(name = "start_basis")
	String startBasis

	@GraphQLQuery
	@Column(name = "latest_usage")
	BigDecimal latestUsage

	@GraphQLQuery
	@Column(name = "next_nearest")
	BigDecimal nextNearest


	@Enumerated(EnumType.STRING)
	@Column(name = "schedule_type")
	PreventiveScheduleType scheduleType

	@GraphQLQuery
	@Column(name = "occurrence")
	String occurrence

	@GraphQLQuery
	@Column(name = "reminder_schedule")
	String reminderSchedule

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "asset", referencedColumnName = "id")
	Assets asset

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "asset_maintenance_type", referencedColumnName = "id")
	AssetMaintenanceTypes assetMaintenanceType

	@GraphQLQuery
	@Column(name = "company")
	UUID company

}
