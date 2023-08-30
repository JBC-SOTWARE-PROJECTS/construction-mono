package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.annotations.UpperCase
import com.fasterxml.jackson.annotation.JsonIgnore
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.Formula
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*
import java.time.Instant

enum AccountCategory {
	ASSET("Asset"),
	LIABILITY("Liability"),
	EQUITY("Equity"),
	REVENUE("Revenue"),
	EXPENSE("Expense")

	String label

	AccountCategory(String label) {
		this.label = label
	}
}


enum AccountType {
	// Assets
	CURRENT_ASSETS("Current Assets", AccountCategory.ASSET),
	LONG_TERM_ASSETS("Long-Term Assets", AccountCategory.ASSET),

	// Liabilities
	CURRENT_LIABILITIES("Current Liabilities", AccountCategory.LIABILITY),
	LONG_TERM_LIABILITIES("Long-Term Liabilities", AccountCategory.LIABILITY),

	// Equity
	EQUITY("Equity", AccountCategory.EQUITY),

	// Revenue
	REVENUE("Revenue", AccountCategory.REVENUE),

	// Expenses
	EXPENSES("Expenses", AccountCategory.EXPENSE)

	String label
	AccountCategory category

	AccountType(String label, AccountCategory category) {
		this.label = label
		this.category = category
	}
}


enum FinancialStatementType {
	BALANCE_SHEET,
	INCOME
}

enum NormalSide {
	DEBIT,
	CREDIT
}

@Entity
@Table(name = "parent_account", schema = "accounting")
class ParentAccount extends AbstractAuditingEntity implements Serializable {
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id
	
	@GraphQLQuery
	@Column(name = "code", columnDefinition = "varchar")
	@UpperCase
	String accountCode
	
	@GraphQLQuery
	@Column(name = "account_name", columnDefinition = "varchar")
	@UpperCase
	String accountName

	@GraphQLQuery
	@Column(name = "description", columnDefinition = "varchar")
	@UpperCase
	String description

	@GraphQLQuery
	@Enumerated(EnumType.STRING)
	@Column(name = "category", columnDefinition = "varchar")
	AccountCategory accountCategory

	@GraphQLQuery
	@Enumerated(EnumType.STRING)
	@Column(name = "account_type", columnDefinition = "varchar")
	AccountType accountType

	@GraphQLQuery
	@Column(name = "deprecated", columnDefinition = "bool")
	Boolean deprecated
	
	@GraphQLQuery
	@Enumerated(EnumType.STRING)
	@Column(name = "normal_side", columnDefinition = "varchar")
	NormalSide normalSide
	
	@GraphQLQuery
	@Column(name = "is_contra", columnDefinition = "bool")
	Boolean isContra

	@GraphQLQuery
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "company_id", referencedColumnName = "id")
	CompanySettings company

	@JsonIgnore
	@Transient
	Instant getDateCreated() {
		return createdDate
	}
	
	@GraphQLQuery
	@Transient
	String accountTrace
}
