package com.backend.gbp.domain.billing

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.domain.services.ServiceManagement
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*

@Entity
@Table(schema = "billing", name = "job_items")
class JobItems extends AbstractAuditingEntity implements Serializable {

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
	@JoinColumn(name = "job", referencedColumnName = "id")
	Job job

	@GraphQLQuery
	@Column(name = "type")
	// item or service
	String type

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "item", referencedColumnName = "id")
	Item item

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "service", referencedColumnName = "id")
	ServiceManagement service

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "service_category", referencedColumnName = "id")
	ServiceCategory serviceCategory

	@GraphQLQuery
	@Column(name = "descriptions")
	String descriptions

	@GraphQLQuery
	@Column(name = "qty")
	Integer qty

	@GraphQLQuery
	@Column(name = "cost")
	BigDecimal cost

	@GraphQLQuery
	@Column(name = "total_cost")
	BigDecimal subTotal

	@GraphQLQuery
	@Column(name = "output_tax")
	BigDecimal outputTax

	@GraphQLQuery
	@Column(name = "wcost")
	BigDecimal wcost

	@GraphQLQuery
	@Column(name = "billed")
	Boolean billed

}
