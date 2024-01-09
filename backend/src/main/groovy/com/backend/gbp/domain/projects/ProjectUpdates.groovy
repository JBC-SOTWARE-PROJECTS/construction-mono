package com.backend.gbp.domain.projects

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.annotations.UpperCase
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
@Table(schema = "projects", name = "project_updates")
@SQLDelete(sql = "UPDATE projects.project_updates SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class ProjectUpdates extends AbstractAuditingEntity implements Serializable {
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

    @GraphQLQuery
    @Column(name = "transaction_no")
    @UpperCase
    String transNo

	@GraphQLQuery
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "project", referencedColumnName = "id")
	Projects project

	@GraphQLQuery
	@Column(name = "date_transact")
	Instant dateTransact

	@GraphQLQuery
	@Column(name = "description")
	@UpperCase
	String description

	@GraphQLQuery
	@Column(name = "accomplishment")
	@UpperCase
	String accomplishment

	@GraphQLQuery
	@Column(name = "weather")
	@UpperCase
	String weather

	@GraphQLQuery
	@Column(name = "status")
	String status

}
