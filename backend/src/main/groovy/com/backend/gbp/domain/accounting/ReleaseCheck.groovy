package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.annotations.UpperCase
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

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
@Table(name = "release_checks", schema = "accounting")
class ReleaseCheck extends AbstractAuditingEntity implements Serializable {

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "release_date", columnDefinition = "date")
	Instant releaseDate

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "disbursement", referencedColumnName = "id")
	Disbursement disbursement

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "bank", referencedColumnName = "id")
	Bank bank

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "checks", referencedColumnName = "id")
	DisbursementCheck check

	@GraphQLQuery
	@Column(name = "is_posted", columnDefinition = "bool")
	@UpperCase
	Boolean isPosted

	@GraphQLQuery
	@Column(name = "release_by", columnDefinition = "varchar")
	@UpperCase
	String release_by

	@GraphQLQuery
	@Column(name = "company", columnDefinition = "uuid")
	UUID company


}

