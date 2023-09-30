package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.annotations.UpperCase
import com.backend.gbp.graphqlservices.accounting.ChartOfAccountGenerate

/*
https://github.com/vladmihalcea/hibernate-types
https://vladmihalcea.com/how-to-map-json-objects-using-generic-hibernate-types/
https://vladmihalcea.com/how-to-store-schema-less-eav-entity-attribute-value-data-using-json-and-hibernate/
https://www.postgresql.org/docs/9.4/datatype-json.html
https://www.postgresqltutorial.com/postgresql-json/
 */

import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*
import java.time.LocalDate

@Entity
@Table(name = "ledger", schema = "accounting")
class Ledger extends AbstractAuditingEntity implements Serializable {
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id
	
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "header", referencedColumnName = "id")
	HeaderLedger header

	@GraphQLQuery
	@Type(type = "jsonb")
	@Column(name="journal_account",columnDefinition = "jsonb")
	ChartOfAccountGenerate journalAccount


	@GraphQLQuery
	@Column(name = "particulars", columnDefinition = "varchar")
	@UpperCase
	String particulars
	
	@GraphQLQuery
	@Column(name = "debit", columnDefinition = "numeric")
	@UpperCase
	BigDecimal debit
	
	@GraphQLQuery
	@Column(name = "credit", columnDefinition = "numeric")
	@UpperCase
	BigDecimal credit

    @Transient
	BigDecimal totalAppliedOr

	@GraphQLQuery
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "company_id", referencedColumnName = "id")
	CompanySettings company

	@GraphQLQuery
	@Column(name = "transaction_date_only")
	LocalDate transactionDateOnly

	@PrePersist
	@PreUpdate
	void updateTransactionDate() {
		// Subtract 8 hours from transactionDatetime and assign the date part to transactionDate
		if(header != null) {
			transactionDateOnly = header.transactionDateOnly
		}
	}

}

