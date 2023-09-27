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
	// Assets (Normal side: Debit)
	CURRENT_ASSETS("Current Assets", AccountCategory.ASSET, NormalSide.DEBIT),
	LONG_TERM_ASSETS("Long-Term Assets", AccountCategory.ASSET, NormalSide.DEBIT),

	// Liabilities (Normal side: Credit)
	CURRENT_LIABILITIES("Current Liabilities", AccountCategory.LIABILITY, NormalSide.CREDIT),
	LONG_TERM_LIABILITIES("Long-Term Liabilities", AccountCategory.LIABILITY, NormalSide.CREDIT),

	// Equity (Normal side: Credit)
	EQUITY("Equity", AccountCategory.EQUITY, NormalSide.CREDIT),

	// Revenue (Normal side: Credit)
	REVENUE("Revenue", AccountCategory.REVENUE, NormalSide.CREDIT),

	// Expenses (Normal side: Debit)
	EXPENSES("Expenses", AccountCategory.EXPENSE, NormalSide.DEBIT);

	String label;
	AccountCategory category;
	NormalSide normalSide;

	AccountType(String label, AccountCategory category, NormalSide normalSide) {
		this.label = label;
		this.category = category;
		this.normalSide = normalSide;
	}
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
