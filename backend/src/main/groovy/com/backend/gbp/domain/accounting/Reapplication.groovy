package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.annotations.UpperCase
import com.backend.gbp.domain.inventory.Supplier
import com.backend.gbp.domain.types.AutoIntegrateable
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
import javax.persistence.Transient


@Entity
@Table(name = "reapplication", schema = "accounting")
class Reapplication extends AbstractAuditingEntity implements Serializable, AutoIntegrateable {

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id
	

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "transaction_type", referencedColumnName = "id")
	ApTransaction transType


	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "supplier", referencedColumnName = "id")
	Supplier supplier

	@GraphQLQuery
	@Column(name = "rp_no", columnDefinition = "varchar")
	@UpperCase
	String rpNo

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "disbursement", referencedColumnName = "id")
	Disbursement disbursement

	@GraphQLQuery
	@Column(name = "discount_amount", columnDefinition = "numeric")
	@UpperCase
	BigDecimal discountAmount

	@GraphQLQuery
	@Column(name = "reference_no", columnDefinition = "varchar")
	@UpperCase
	String referenceNo

	@GraphQLQuery
	@Column(name = "ewt_amount", columnDefinition = "bool")
	@UpperCase
	BigDecimal ewtAmount

	@GraphQLQuery
	@Column(name = "applied_amount", columnDefinition = "numeric")
	@UpperCase
	BigDecimal appliedAmount

	@GraphQLQuery
	@Column(name = "prev_applied", columnDefinition = "numeric")
	@UpperCase
	BigDecimal prevApplied

	@GraphQLQuery
	@Column(name = "status", columnDefinition = "varchar")
	@UpperCase
	String status

	@GraphQLQuery
	@Column(name = "is_posted", columnDefinition = "bool")
	Boolean posted

	@GraphQLQuery
	@Column(name = "posted_ledger", columnDefinition = "uuid")
	UUID postedLedger

	@GraphQLQuery
	@Column(name = "company", columnDefinition = "uuid")
	UUID company

	@GraphQLQuery
	@Column(name = "remarks", columnDefinition = "varchar")
	@UpperCase
	String remarks

	@GraphQLQuery
	@Column(name = "rounding", columnDefinition = "int")
	Integer rounding

	//accounting integrate
	@Override
	String getDomain() {
		return Reapplication.class.name
	}

	@Transient
	String flagValue

	@Override
	Map<String, String> getDetails() {
		return [:]
	}

	@Transient
	BigDecimal advanceAmount, disbursementAmount, discAmount

	@Transient
	BigDecimal ewt1Percent,ewt2Percent,
			   ewt3Percent,ewt4Percent,ewt5Percent,ewt7Percent,ewt10Percent,ewt15Percent,ewt18Percent,ewt30Percent

	
}

