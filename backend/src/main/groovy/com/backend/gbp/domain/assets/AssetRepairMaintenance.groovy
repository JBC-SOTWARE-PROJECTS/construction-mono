package com.backend.gbp.domain.assets

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.annotations.UpperCase
import com.backend.gbp.domain.assets.enums.AssetStatus
import com.backend.gbp.domain.assets.enums.AssetType
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
@Table(schema = "asset", name = "asset_repair_maintenance")
@SQLDelete(sql = "UPDATE asset.asset_repair_maintenance SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class AssetRepairMaintenance extends AbstractAuditingEntity implements Serializable {
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@Enumerated(EnumType.STRING)
	@Column(name = "service_type")
	RepairServiceType serviceType

	@Enumerated(EnumType.STRING)
	@Column(name = "service_classification")
	RepairServiceClassification serviceClassification

	@GraphQLQuery
	@Column(name = "service_datetime_start")
	Instant serviceDatetimeStart

	@GraphQLQuery
	@Column(name = "service_datetime_finished")
	Instant serviceDatetimeFinished

	@GraphQLQuery
	@Column(name = "work_description")
	String workDescription

	@GraphQLQuery
	@Column(name = "findings")
	String findings

	@GraphQLQuery
	@Column(name = "worked_by_employees")
	String workedByEmployees

	@Enumerated(EnumType.STRING)
	@Column(name = "status")
	RepairMaintenanceStatus status

	@GraphQLQuery
	@Column(name = "rm_image")
	String rmImage

	@GraphQLQuery
	@Column(name = "inspection_remarks")
	String inspectionRemarks

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "project", referencedColumnName = "id")
	Projects project

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "asset", referencedColumnName = "id")
	Assets asset

	@GraphQLQuery
	@Column(name = "company")
	UUID company

}
