package com.backend.gbp.domain.projects

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.inventory.Item
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import org.hibernate.annotations.Where

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.Table
import java.math.RoundingMode
import java.time.Instant

@Entity
@Table(schema = "projects", name = "projects_updates_workers")
@SQLDelete(sql = "UPDATE projects.projects_updates_workers SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class ProjectUpdatesWorkers extends AbstractAuditingEntity implements Serializable {
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "project", referencedColumnName = "id")
	Projects project

	@GraphQLQuery
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "project_updates", referencedColumnName = "id")
	ProjectUpdates projectUpdates

	@GraphQLQuery
	@Column(name = "date_transact")
	Instant dateTransact

	@GraphQLQuery
	@Column(name = "position")
	String position

	@GraphQLQuery
	@Column(name = "am_shift")
	Integer amShift

	@GraphQLQuery
	@Column(name = "pm_shift")
	Integer pmShift

	@GraphQLQuery
	@Column(name = "remarks")
	String remarks


}
