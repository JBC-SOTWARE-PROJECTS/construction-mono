package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.Office
import com.backend.gbp.domain.annotations.UpperCase
import com.backend.gbp.domain.projects.Projects
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
@Table(name = "disbursement_ap", schema = "accounting")
class DisbursementAp extends AbstractAuditingEntity implements Serializable {

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "payable", referencedColumnName = "id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	AccountsPayable payable

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "disbursement", referencedColumnName = "id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	Disbursement disbursement

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "office", referencedColumnName = "id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	Office office

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "project", referencedColumnName = "id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	Projects project

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "debit_memo", referencedColumnName = "id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	DebitMemo debitMemo

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
	@UpperCase
	String ewtDesc

	@GraphQLQuery
	@Column(name = "ewt_rate", columnDefinition = "numeric")
	@UpperCase
	BigDecimal ewtRate

	@GraphQLQuery
	@Column(name = "ewt_amount", columnDefinition = "numeric")
	@UpperCase
	BigDecimal ewtAmount

	@GraphQLQuery
	@Column(name = "gross_amount", columnDefinition = "numeric")
	@UpperCase
	BigDecimal grossAmount

	@GraphQLQuery
	@Column(name = "discount", columnDefinition = "numeric")
	@UpperCase
	BigDecimal discount

	@GraphQLQuery
	@Column(name = "net_amount", columnDefinition = "numeric")
	@UpperCase
	BigDecimal netAmount

	@GraphQLQuery
	@Column(name = "reapplication", columnDefinition = "uuid")
	UUID reapplication



	@GraphQLQuery
	@Column(name = "posted", columnDefinition = "uuid")
	Boolean posted

}

