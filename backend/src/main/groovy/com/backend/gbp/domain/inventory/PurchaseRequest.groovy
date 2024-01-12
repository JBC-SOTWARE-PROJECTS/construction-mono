package com.backend.gbp.domain.inventory

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.Office
import com.backend.gbp.domain.assets.Assets
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
import java.time.LocalDateTime

@Entity
@Table(schema = "inventory", name = "purchase_request")
@SQLDelete(sql = "UPDATE inventory.purchase_request SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class PurchaseRequest extends AbstractAuditingEntity implements Serializable {
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id
	
	@GraphQLQuery
	@Column(name = "pr_no", columnDefinition = "varchar")
	String prNo
	
	@GraphQLQuery
	@Column(name = "pr_date_requested")
	Instant prDateRequested
	
	@GraphQLQuery
	@Column(name = "pr_date_needed")
	Instant prDateNeeded

	@GraphQLQuery
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "project", referencedColumnName = "id")
	Projects project

	@GraphQLQuery
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "asset", referencedColumnName = "id")
	Assets assets
	
	@GraphQLQuery
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "supplier", referencedColumnName = "id")
	Supplier supplier
	
	@GraphQLQuery
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "requesting_office", referencedColumnName = "id")
	Office requestingOffice

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "requested_office", referencedColumnName = "id")
	Office requestedOffice

	@GraphQLQuery
	@Column(name = "category", columnDefinition = "varchar")
	String category
	
	@GraphQLQuery
	@Column(name = "pr_type", columnDefinition = "varchar")
	String prType
	
	@GraphQLQuery
	@Column(name = "is_approve", columnDefinition = "bool")
	Boolean isApprove
	
	@GraphQLQuery
	@Column(name = "status", columnDefinition = "varchar")
	String status

	@GraphQLQuery
	@Column(name = "user_id", columnDefinition = "uuid")
	UUID userId

	@GraphQLQuery
	@Column(name = "user_fullname", columnDefinition = "varchar")
	String userFullname

	@GraphQLQuery
	@Column(name = "remarks", columnDefinition = "varchar")
	String remarks

	@GraphQLQuery
	@Column(name = "company")
	UUID company
	
}
