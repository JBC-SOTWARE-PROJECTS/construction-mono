package com.backend.gbp.domain.assets

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.Office
import com.backend.gbp.domain.annotations.UpperCase
import com.backend.gbp.domain.billing.Customer
import com.backend.gbp.domain.billing.Insurances
import com.backend.gbp.domain.billing.RepairType
import com.backend.gbp.domain.projects.Projects
import groovy.transform.Canonical
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
@Table(schema = "asset", name = "job_order")
@SQLDelete(sql = "UPDATE asset.job_order SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class JobOrder extends AbstractAuditingEntity implements Serializable{

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "date_transact")
	Instant dateTrans

	@GraphQLQuery
	@Column(name = "code")
	String code

	@GraphQLQuery
	@Column(name = "description")
	@UpperCase
	String description

	@GraphQLQuery
	@Column(name = "duration_start")
	Instant durationStart

	@GraphQLQuery
	@Column(name = "duration_end")
	Instant durationEnd

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "customer", referencedColumnName = "id")
    Customer customer

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "project", referencedColumnName = "id")
	Projects project

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "asset", referencedColumnName = "id")
	Assets assets

	@GraphQLQuery
	@Column(name = "remarks")
	String remarks

	@GraphQLQuery
	@Column(name = "status")
	String status



}
