package com.backend.gbp.domain.billing

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.accounting.ArCustomers
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
@Table(schema = "billing", name = "billing")
@SQLDelete(sql = "UPDATE billing.billing SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class Billing extends AbstractAuditingEntity implements Serializable {

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "date_trans")
	Instant dateTrans

	@GraphQLQuery
	@Column(name = "bill_no")
	String billNo

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "job", referencedColumnName = "id")
	Job job

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "customer", referencedColumnName = "id")
	ArCustomers customer

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "project", referencedColumnName = "id")
	Projects project

	@GraphQLQuery
	@Column(name = "company")
	UUID companyId

	@GraphQLQuery
	@Column(name = "otc_name")
	String otcName

	@GraphQLQuery
	@Column(name = "locked")
	Boolean locked

	@GraphQLQuery
	@Column(name = "locked_by")
	String lockedBy

	@GraphQLQuery
	@Column(name = "status")
	Boolean status // active = true //inactive = false


}
