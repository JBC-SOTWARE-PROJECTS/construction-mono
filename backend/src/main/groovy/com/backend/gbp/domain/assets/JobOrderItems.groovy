package com.backend.gbp.domain.assets

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.annotations.UpperCase
import com.backend.gbp.domain.billing.Customer
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
@Table(schema = "asset", name = "job_order_items")
@SQLDelete(sql = "UPDATE asset.job_order_items SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class JobOrderItems extends AbstractAuditingEntity implements Serializable{

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "job_order", referencedColumnName = "id")
	JobOrder jobOrder

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
	@Column(name = "type")
	String type

	@GraphQLQuery
	@Column(name = "qty")
	BigDecimal qty

	@GraphQLQuery
	@Column(name = "unit")
	String unit

	@GraphQLQuery
	@Column(name = "cost")
	BigDecimal cost

	@GraphQLQuery
	@Column(name = "sub_total")
	BigDecimal subTotal

	@GraphQLQuery
	@Column(name = "total")
	BigDecimal total

	@GraphQLQuery
	@Column(name = "active")
	Boolean active



}
