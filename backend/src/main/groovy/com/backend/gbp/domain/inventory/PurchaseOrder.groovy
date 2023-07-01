package com.backend.gbp.domain.inventory

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.Office
import com.backend.gbp.domain.projects.Projects
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*
import java.time.Instant

@Entity
@Table(schema = "inventory", name = "purchase_order")
class PurchaseOrder extends AbstractAuditingEntity implements Serializable {
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "po_number", columnDefinition = "varchar")
	String poNumber

	@GraphQLQuery
	@Column(name = "prepared_date", columnDefinition = "timestamp")
	Instant preparedDate

	@GraphQLQuery
	@Column(name = "eta_date", columnDefinition = "timestamp")
	Instant etaDate
	
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "`supplier`", referencedColumnName = "id")
	Supplier supplier

	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "`project`", referencedColumnName = "id")
	Projects project

	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "`payment_terms`", referencedColumnName = "id")
	PaymentTerm paymentTerms

	@GraphQLQuery
	@Column(name = "pr_nos", columnDefinition = "varchar")
	String prNos
	
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "office", referencedColumnName = "id")
	Office office

	@GraphQLQuery
	@Column(name = "remarks", columnDefinition = "varchar")
	String remarks

	@GraphQLQuery
	@Column(name = "is_approve", columnDefinition = "bool")
	Boolean isApprove

	@GraphQLQuery
	@Column(name = "is_voided", columnDefinition = "bool")
	Boolean isVoided

	@GraphQLQuery
	@Column(name = "status", columnDefinition = "varchar")
	String status

	@GraphQLQuery
	@Column(name = "user_id", columnDefinition = "varchar")
	UUID userId

	@GraphQLQuery
	@Column(name = "prepared_by", columnDefinition = "varchar")
	String preparedBy

	@GraphQLQuery
	@Column(name = "no_pr", columnDefinition = "bool")
	Boolean noPr

	@GraphQLQuery
	@Column(name = "is_completed", columnDefinition = "bool")
	Boolean isCompleted
	
	@Transient
	Instant getCreated() {
		return createdDate
	}
}
