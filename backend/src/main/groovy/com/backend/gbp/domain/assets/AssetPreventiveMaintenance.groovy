package com.backend.gbp.domain.assets

import com.backend.gbp.domain.AbstractAuditingEntity
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import org.hibernate.annotations.Where

import javax.persistence.*

@Entity
@Table(schema = "asset", name = "asset_preventive_maintenance")
@SQLDelete(sql = "UPDATE asset.asset_preventive_maintenance SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class AssetPreventiveMaintenance extends AbstractAuditingEntity implements Serializable{

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "note")
	String note

	@GraphQLQuery
	@Column(name = "schedule_type")
	String scheduleType

	@GraphQLQuery
	@Column(name = "occurrence")
	String occurrence

	@GraphQLQuery
	@Column(name = "reminder_schedule")
	String reminderSchedule

	@GraphQLQuery
	@Column(name = "asset")
	Assets asset

	@GraphQLQuery
	@Column(name = "maintenance_type")
	AssetMaintenanceTypes maintenanceType

}
