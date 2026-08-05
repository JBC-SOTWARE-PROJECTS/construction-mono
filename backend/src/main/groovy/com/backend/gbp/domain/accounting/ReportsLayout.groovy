package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import groovy.transform.Canonical
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.*



enum ReportType {
	PROFIT_AND_LOSS("Profit & Loss"),
	BALANCE_SHEET("Balance Sheet"),
	CASH_POSITION("Cash Position"),
	CUSTOM("Custom Report")

	String label

	ReportType(String label) {
		this.label = label
	}
}

@Canonical
class ReportConfig {
	Integer maximumChild = 0
	UUID currentYearEarningsFormula = null
}

@Entity
@Table(name = "reports_layout", schema = "accounting")
class ReportsLayout extends AbstractAuditingEntity implements Serializable {
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Enumerated(EnumType.STRING)
	@Column(name = "report_type", columnDefinition = "varchar")
	ReportType reportType
	
	@GraphQLQuery
	@Column(name = "layout_name", columnDefinition = "varchar")
	String layoutName

	@GraphQLQuery
	@Column(name = "title", columnDefinition = "varchar")
	String title
	
	@GraphQLQuery
	@Column(name = "is_active", columnDefinition = "bool")
	Boolean isActive

	@GraphQLQuery
	@Type(type = "jsonb")
	@Column(name = "config", columnDefinition = "jsonb")
	ReportConfig config

	@OneToMany(fetch = FetchType.EAGER, mappedBy = "reportsLayoutId",cascade = [CascadeType.ALL],orphanRemoval = true)
	List<ReportsLayoutItem> reportsItem = []

	@GraphQLQuery
	@Column(name = "company_id")
	UUID companyId

	@GraphQLQuery
	@Column(name = "is_standard", columnDefinition = "bool")
	Boolean isStandard

	@Transient
	String reportLayoutLabel
	String getReportLayoutLabel() {
		return reportType.label
	}
}
