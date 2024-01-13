package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.graphqlservices.accounting.ChartOfAccountGenerate
import groovy.transform.Canonical
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*

@Canonical
class  ReportItemConfig {
	String 	totalLabel
	Boolean hideGroupAccounts
	Boolean isCurrentYearEarningsFormula
}


@Entity
@Table(name = "reports_layout_item", schema = "accounting")
class ReportsLayoutItem extends AbstractAuditingEntity implements Serializable {

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@ManyToOne(fetch = FetchType.LAZY)
	@NotFound(action = NotFoundAction.IGNORE)
	@JoinColumn(name = "reports_layout_id", referencedColumnName = "id")
	ReportsLayout reportsLayoutId

	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "reports_layout_items_parent", referencedColumnName = "id")
	ReportsLayoutItem reportLayoutItemsParent

	@OneToMany(fetch = FetchType.EAGER, mappedBy = "reportLayoutItemsParent",cascade = [CascadeType.ALL],orphanRemoval = true)
	List<ReportsLayoutItem> reportsChild = []

	@GraphQLQuery
	@Column(name = "order_no", columnDefinition = "int")
	Integer orderNo

	@GraphQLQuery
	@Type(type = "jsonb")
	@Column(name="account",columnDefinition = "jsonb")
	ChartOfAccountGenerate account

	@GraphQLQuery
	@Column(name = "title", columnDefinition = "varchar")
	String title

	@GraphQLQuery
	@Column(name = "code", columnDefinition = "varchar")
	String code

	@GraphQLQuery
	@Column(name = "account_name", columnDefinition = "varchar")
	String accountName

	@GraphQLQuery
	@Enumerated(EnumType.STRING)
	@Column(name = "normal_side", columnDefinition = "varchar")
	NormalSide normalSide

	@GraphQLQuery
	@Column(name = "item_type", columnDefinition = "varchar")
	String itemType

	@GraphQLQuery
	@Column(name = "is_formula", columnDefinition = "varchar")
	Boolean isFormula

	@GraphQLQuery
	@Column(name = "is_group", columnDefinition = "bool")
	Boolean isGroup

	@GraphQLQuery
	@Column(name = "has_total", columnDefinition = "bool")
	Boolean hasTotal

	@GraphQLQuery
	@Type(type = "jsonb")
	@Column(name = "formula_groups", columnDefinition = "jsonb")
	List<String> formulaGroups

	@GraphQLQuery
	@Type(type = "jsonb")
	@Column(name = "fields", columnDefinition = "jsonb")
	ReportItemConfig config

	@GraphQLQuery
	@Column(name = "company_id")
	UUID companyId

	@Transient
	BigDecimal accountTitle
	BigDecimal getAccountTitle() {
		if(isGroup)
			return title
		return account.description
	}
}
