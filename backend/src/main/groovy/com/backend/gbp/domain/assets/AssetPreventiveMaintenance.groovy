package com.backend.gbp.domain.assets

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.assets.enums.PreventiveScheduleType
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
	@Column(name = "start_basis")
	String startBasis

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
