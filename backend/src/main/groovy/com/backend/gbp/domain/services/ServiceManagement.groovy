package com.backend.gbp.domain.services

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.Office
import com.backend.gbp.domain.cashier.PaymentDetial
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import org.hibernate.annotations.Where

import javax.persistence.*

@Entity
@Table(schema = "services", name = "service")
@SQLDelete(sql = "UPDATE services.service SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class ServiceManagement extends AbstractAuditingEntity implements Serializable {

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "code")
	String code

	@GraphQLQuery
	@Column(name = "description")
	String description

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "office", referencedColumnName = "id")
	Office office

	@GraphQLQuery
	@Column(name = "type")
	String type

	@GraphQLQuery
	@Column(name = "available")
	Boolean available

	@GraphQLQuery
	@Column(name = "cost")
	BigDecimal cost

	@GraphQLQuery
	@Column(name = "gov_cost")
	BigDecimal govCost
}
