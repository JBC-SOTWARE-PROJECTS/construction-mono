package com.backend.gbp.domain.assets

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.annotations.UpperCase
import com.backend.gbp.domain.hrm.Employee
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
@Table(schema = "asset", name = "assets")
@SQLDelete(sql = "UPDATE asset.AssetRepairMaintenance SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class AssetRepairMaintenance extends AbstractAuditingEntity implements Serializable {
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "service_classification")
	String serviceClassification

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

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "project", referencedColumnName = "id")
	Projects project;

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "company", referencedColumnName = "id")
	CompanySettings company;

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "asset", referencedColumnName = "id")
	Assets asset;

	@GraphQLQuery
	@Column(name = "status")
	String status;


	@GraphQLQuery
	@Column(name = "rm_image")
	String rmImage


	@GraphQLQuery
	@Column(name = "inspection_remarks")
	String inspectionRemarks

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "inspection remarks", referencedColumnName = "id")
	Employee inspectionBy;


}
