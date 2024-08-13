package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.annotations.UpperCase
import com.backend.gbp.domain.inventory.Supplier
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Where

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.Table
import java.time.Instant

@Entity
@Table(name = "ap_ledger", schema = "accounting")
@SQLDelete(sql = "UPDATE accounting.ap_ledger SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class ApLedger extends AbstractAuditingEntity implements Serializable {

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id
	
	@NotFound(action = NotFoundAction.IGNORE)
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "supplier", referencedColumnName = "id")
	Supplier supplier

	@GraphQLQuery
	@Column(name = "ledger_type", columnDefinition = "varchar")
	@UpperCase
	String ledgerType

	@GraphQLQuery
	@Column(name = "ledger_date", columnDefinition = "date")
	Instant ledgerDate

	@GraphQLQuery
	@Column(name = "ref_no", columnDefinition = "varchar")
	String refNo

	@GraphQLQuery
	@Column(name = "ref_id", columnDefinition = "uuid")
	UUID refId

	@GraphQLQuery
	@Column(name = "debit", columnDefinition = "numeric")
	BigDecimal debit

	@GraphQLQuery
	@Column(name = "credit", columnDefinition = "numeric")
	BigDecimal credit

	@GraphQLQuery
	@Column(name = "is_include", columnDefinition = "bool")
	Boolean isInclude

	@GraphQLQuery
	@Column(name = "company", columnDefinition = "uuid")
	UUID company

	
}

