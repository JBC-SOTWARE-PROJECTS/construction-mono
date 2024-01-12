package com.backend.gbp.domain.projects

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.accounting.IntegrationDomainEnum
import com.backend.gbp.domain.annotations.UpperCase
import com.backend.gbp.domain.types.AutoIntegrateable
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.*

@Entity
@Table(schema = "projects", name = "project_work_accomplish")
class ProjectWorkAccomplish extends AbstractAuditingEntity implements Serializable, AutoIntegrateable {
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "record_no")
	String recordNo

	@GraphQLQuery
	@Column(name = "project")
	UUID project

	@GraphQLQuery
	@Column(name = "period_start")
	String periodStart

	@GraphQLQuery
	@Column(name = "period_end")
	String periodEnd

	@GraphQLQuery
	@Column(name = "total_amount")
	BigDecimal totalAmount

	@GraphQLQuery
	@Column(name = "total_payments")
	BigDecimal totalPayments

	@GraphQLQuery
	@Column(name = "total_prev_amount")
	BigDecimal totalPrevAmount

	@GraphQLQuery
	@Column(name = "total_period_amount")
	BigDecimal totalPeriodAmount

	@GraphQLQuery
	@Column(name = "total_to_date_amount")
	BigDecimal totalToDateAmount

	@GraphQLQuery
	@Column(name = "total_balance_amount")
	BigDecimal totalBalanceAmount

	@GraphQLQuery
	@Column(name = "total_percentage")
	BigDecimal totalPercentage

	@GraphQLQuery
	@Column(name = "prepared_by")
	@UpperCase
	String preparedBy

	@GraphQLQuery
	@Column(name = "verified_by")
	@UpperCase
	String verifiedBy

	@GraphQLQuery
	@Column(name = "checked_by")
	@UpperCase
	String checkedBy

	@GraphQLQuery
	@Column(name = "recommending_approval")
	@UpperCase
	String recommendingApproval

	@GraphQLQuery
	@Column(name = "approved_for_approval")
	@UpperCase
	String approvedForPayment

	@GraphQLQuery
	String status

	@GraphQLQuery
	@Column(name = "company_id")
	UUID companyId

	@Override
	String getDomain() {
		return IntegrationDomainEnum.PROJECT_WORK_ACCOMPLISH.name()
	}

	@Override
	Map<String, String> getDetails() {
		return [:]
	}

	@Transient
	String flagValue

}
