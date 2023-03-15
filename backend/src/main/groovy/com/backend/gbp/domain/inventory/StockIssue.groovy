package com.backend.gbp.domain.inventory

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.Office
import com.backend.gbp.domain.hrm.Employee
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
@Table(schema = "inventory", name = "stock_issue")
@SQLDelete(sql = "UPDATE inventory.stock_issue SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class StockIssue extends AbstractAuditingEntity implements Serializable {
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id
	
	@GraphQLQuery
	@Column(name = "issue_no")
	String issueNo

	
	@GraphQLQuery
	@Column(name = "issue_date")
	Instant issueDate
	
	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "issue_from", referencedColumnName = "id")
	Office issueFrom
	
	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "issue_to", referencedColumnName = "id")
	Office issueTo

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "project", referencedColumnName = "id")
	Projects project
	
	@GraphQLQuery
	@Column(name = "issue_type")
	String issueType
	
	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "issued_by", referencedColumnName = "id")
	Employee issued_by

	@GraphQLQuery
	@Column(name = "is_cancel")
	Boolean isCancel
	
	@GraphQLQuery
	@Column(name = "is_posted")
	Boolean isPosted
	
	@Transient
	Instant getCreated() {
		return createdDate
	}
}
