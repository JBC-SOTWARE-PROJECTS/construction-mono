package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.billing.Billing
import com.backend.gbp.domain.billing.DiscountDetails
import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.domain.inventory.TransactionType
import com.backend.gbp.domain.projects.Projects
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.LazyCollection
import org.hibernate.annotations.LazyCollectionOption
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*
import java.time.Instant
import org.hibernate.annotations.Immutable

@Embeddable
class ProjectExpenseViewId implements Serializable {

	@Type(type = "pg-uuid")
	@Column(name = "project_id", columnDefinition = "uuid")
	UUID projectId

	@Type(type = "pg-uuid")
	@Column(name = "trans_type", columnDefinition = "uuid")
	UUID transTypeId

	// IMPORTANT: generate equals/hashCode (IDE)
}
@Immutable
@Entity
@Table(schema = "accounting", name = "project_expense") // your VIEW name
class ProjectExpenseView implements Serializable {

	@EmbeddedId
	ProjectExpenseViewId id

	@GraphQLQuery
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "project_id", referencedColumnName = "id", insertable = false, updatable = false)
	Projects project

	// This is the key fix: referencedColumnName MUST be "id"
	@GraphQLQuery(name = "transactionType") // optional: exposes field name transactionType in GraphQL
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "trans_type", referencedColumnName = "id", insertable = false, updatable = false)
	ApTransaction transactionType

	@GraphQLQuery
	@Column(name = "project_description")
	String projectDescription

	@GraphQLQuery
	@Column(name = "trans_type_description")
	String transTypeDescription

	@GraphQLQuery
	@Column(name = "total_net_amount")
	BigDecimal totalNetAmount

	// COUNT(*) returns bigint → use Long
	@GraphQLQuery
	@Column(name = "line_count")
	Long lineCount

	@GraphQLQuery
	@Column(name = "payable_count")
	Long payableCount
}