package com.backend.gbp.domain.billing

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.annotations.UpperCase
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import org.hibernate.annotations.Where

import javax.persistence.*

@Entity
@Table(schema = "billing", name = "job_status")
@SQLDelete(sql = "UPDATE billing.job_status SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class JobStatus extends AbstractAuditingEntity implements Serializable {

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "code", columnDefinition = 'varchar')
	String code

	@GraphQLQuery
	@Column(name = "description", columnDefinition = 'varchar')
	@UpperCase
	String description

	@GraphQLQuery
	@Column(name = "is_active", columnDefinition = 'bool')
	Boolean is_active

	@GraphQLQuery
	@Column(name = "disabled_editing", columnDefinition = 'bool')
	Boolean disabledEditing

	@GraphQLQuery
	@Column(name = "company")
	UUID company

	@GraphQLQuery
	@Column(name = "status_color", columnDefinition = 'varchar')
	@UpperCase
	String statusColor

}
