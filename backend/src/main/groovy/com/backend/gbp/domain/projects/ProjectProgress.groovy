package com.backend.gbp.domain.projects

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.annotations.UpperCase
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import org.hibernate.annotations.Where

import javax.persistence.*
import java.time.Instant

@Entity
@Table(schema = "projects", name = "project_progress")
@SQLDelete(sql = "UPDATE projects.project_progress SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class ProjectProgress extends AbstractAuditingEntity implements Serializable {
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

    @GraphQLQuery
    @Column(name = "trans_no")
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
	@Column(name = "progress")
	@UpperCase
	String progress

	@GraphQLQuery
	@Column(name = "status")
	String status

	@GraphQLQuery
	@Column(name = "progress_percent")
	BigDecimal progressPercent

}
