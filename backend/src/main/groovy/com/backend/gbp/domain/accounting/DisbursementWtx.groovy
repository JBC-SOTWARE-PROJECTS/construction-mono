package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.Column
import javax.persistence.ConstraintMode
import javax.persistence.Entity
import javax.persistence.FetchType
import javax.persistence.ForeignKey
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.Table


@Entity
@Table(name = "disbursement_wtx", schema = "accounting")
class DisbursementWtx extends AbstractAuditingEntity implements Serializable {

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "disbursement", referencedColumnName = "id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	Disbursement disbursement

	@GraphQLQuery
	@Column(name = "applied_amount", columnDefinition = "numeric")
	BigDecimal appliedAmount

	@GraphQLQuery
	@Column(name = "vat_rate", columnDefinition = "numeric")
	BigDecimal vatRate

	@GraphQLQuery
	@Column(name = "vat_inclusive", columnDefinition = "bool")
	Boolean vatInclusive

	@GraphQLQuery
	@Column(name = "vat_amount", columnDefinition = "numeric")
	BigDecimal vatAmount

	@GraphQLQuery
	@Column(name = "ewt_desc", columnDefinition = "varchar")
	String ewtDesc

	@GraphQLQuery
	@Column(name = "ewt_rate", columnDefinition = "numeric")
	BigDecimal ewtRate

	@GraphQLQuery
	@Column(name = "ewt_amount", columnDefinition = "numeric")
	BigDecimal ewtAmount

	@GraphQLQuery
	@Column(name = "gross_amount", columnDefinition = "numeric")
	BigDecimal grossAmount

	@GraphQLQuery
	@Column(name = "net_amount", columnDefinition = "numeric")
	BigDecimal netAmount


}

