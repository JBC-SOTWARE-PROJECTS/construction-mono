package com.backend.gbp.domain.projects

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.inventory.Item
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
@Table(schema = "projects", name = "projects_updates_notes")
@SQLDelete(sql = "UPDATE projects.projects_updates_materials SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class ProjectUpdatesNotes extends AbstractAuditingEntity implements Serializable {
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "project_updates", referencedColumnName = "id")
	ProjectUpdates projectUpdates

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "user_id", referencedColumnName = "id")
	Employee user

	@GraphQLQuery
	@Column(name = "date_transact")
	Instant dateTransact

	@GraphQLQuery
	@Column(name = "remarks")
	String remarks

}
