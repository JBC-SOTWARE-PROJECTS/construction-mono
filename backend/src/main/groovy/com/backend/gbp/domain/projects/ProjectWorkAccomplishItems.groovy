package com.backend.gbp.domain.projects

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.accounting.IntegrationDomainEnum
import com.backend.gbp.domain.types.AutoIntegrateable
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.*

@Entity
@Table(schema = "projects", name = "project_work_accomplish_items")
class ProjectWorkAccomplishItems extends AbstractAuditingEntity implements Serializable {
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "project")
	UUID project

	@GraphQLQuery
	@Column(name = "project_cost")
	UUID projectCost

	@GraphQLQuery
	@Column(name = "project_work_accomplish_id")
	UUID projectWorkAccomplishId

	@GraphQLQuery
	@Column(name = "period_start")
	String periodStart

	@GraphQLQuery
	@Column(name = "period_end")
	String periodEnd

	@GraphQLQuery
	@Column(name = "item_no")
	String itemNo

	@GraphQLQuery
	@Column(name = "description")
	String description

	@GraphQLQuery
	@Column(name = "unit")
	String unit

	@GraphQLQuery
	@Column(name = "qty")
	BigDecimal qty

	@GraphQLQuery
	@Column(name = "cost")
	BigDecimal cost

	@GraphQLQuery
	@Column(name = "payments")
	BigDecimal payments

	@GraphQLQuery
	@Column(name = "relative_weight")
	BigDecimal relativeWeight

	@GraphQLQuery
	@Column(name = "prev_qty")
	BigDecimal prevQty

	@GraphQLQuery
	@Column(name = "this_period_qty")
	BigDecimal thisPeriodQty

	@GraphQLQuery
	@Column(name = "to_date_qty")
	BigDecimal toDateQty

	@GraphQLQuery
	@Column(name = "balance_qty")
	BigDecimal balanceQty

	@GraphQLQuery
	@Column(name = "prev_amount")
	BigDecimal prevAmount

	@GraphQLQuery
	@Column(name = "this_period_amount")
	BigDecimal thisPeriodAmount

	@GraphQLQuery
	@Column(name = "to_date_amount")
	BigDecimal toDateAmount

	@GraphQLQuery
	@Column(name = "balance_amount")
	BigDecimal balanceAmount

	@GraphQLQuery
	BigDecimal percentage

	@GraphQLQuery
	String status

	@GraphQLQuery
	@Column(name = "company_id")
	UUID companyId

	@Transient
	BigDecimal amount
	BigDecimal getAmount() {
		BigDecimal calculated =  (cost?:0.00) * (qty?:0)
		return  calculated
	}

}
