package com.backend.gbp.domain.billing

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
import java.sql.Blob

@Entity
@Table(schema = "billing", name = "repair_type")
@SQLDelete(sql = "UPDATE billing.repair_type SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class ChargeInvoice extends AbstractAuditingEntity implements Serializable {

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
	@JoinColumn(name = "billing", referencedColumnName = "id")
	Billing billing

	@GraphQLQuery
	@Column(name = "description", columnDefinition = 'varchar')
	@UpperCase
	String description

	@GraphQLQuery
	@Column(name = "content", columnDefinition = 'bytea')
	@Lob
	Blob content

	@GraphQLQuery
	@Column(name = "content_type", columnDefinition = 'varchar')
	String content_type

}
