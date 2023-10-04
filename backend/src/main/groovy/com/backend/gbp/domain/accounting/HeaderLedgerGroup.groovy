package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.annotations.UpperCase
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.BatchSize
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.*
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneOffset

@Entity
@Table(name = "header_ledger_group", schema = "accounting")
class HeaderLedgerGroup extends AbstractAuditingEntity implements Serializable {
	
	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "fiscal", referencedColumnName = "id")
	Fiscal fiscal

	@GraphQLQuery
	@Column(name = "record_no", columnDefinition = "date")
	String recordNo

	@GraphQLQuery
	@Column(name = "entity_name", columnDefinition = "date")
	@UpperCase
	String entity_name

	@GraphQLQuery
	@Column(name = "particulars", columnDefinition = "date")
	@UpperCase
	String particulars

	@GraphQLQuery
	@Column(name = "reference_id", columnDefinition = "date")
	UUID referenceId

	@GraphQLQuery
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "company_id", referencedColumnName = "id")
	CompanySettings company

}

