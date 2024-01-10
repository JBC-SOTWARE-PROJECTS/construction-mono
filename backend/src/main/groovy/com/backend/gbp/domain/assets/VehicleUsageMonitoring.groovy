package com.backend.gbp.domain.assets

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.assets.enums.RepairMaintenanceStatus
import com.backend.gbp.domain.assets.enums.RepairServiceClassification
import com.backend.gbp.domain.assets.enums.RepairServiceType
import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.domain.projects.Projects
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import org.hibernate.annotations.Where

import javax.persistence.*
import java.time.Instant

@Entity
@Table(schema = "asset", name = "vehicle_usage_monitoring")
@SQLDelete(sql = "UPDATE asset.vehicle_usage_monitoring SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class VehicleUsageMonitoring extends AbstractAuditingEntity implements Serializable {
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "usage_purpose")
	String usagePurpose

	@GraphQLQuery
	@Column(name = "route")
	String route

	@GraphQLQuery
	@Column(name = "start_odometer_reading")
	String startOdometerReading

	@GraphQLQuery
	@Column(name = "end_odometer_reading")
	String endOdometerReading

	@GraphQLQuery
	@Column(name = "start_fuel_reading")
	String startFuelReading

	@GraphQLQuery
	@Column(name = "end_fuel_reading")
	String endFuelReading

	@GraphQLQuery
	@Column(name = "start_datetime")
	Instant startDatetime

	@GraphQLQuery
	@Column(name = "end_datetime")
	Instant endDatetime

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "project", referencedColumnName = "id")
	Projects project

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "item", referencedColumnName = "id")
	Item item

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "asset", referencedColumnName = "id")
	Assets asset

	@GraphQLQuery
	@Column(name = "company")
	UUID company

}
