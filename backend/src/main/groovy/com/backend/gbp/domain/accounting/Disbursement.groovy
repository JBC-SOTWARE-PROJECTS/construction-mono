package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.annotations.UpperCase
import com.backend.gbp.domain.inventory.Supplier
import com.backend.gbp.domain.types.AutoIntegrateable
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
import javax.persistence.Transient
import java.time.Instant

@Entity
@Table(name = "disbursement", schema = "accounting")
class Disbursement extends AbstractAuditingEntity implements Serializable, AutoIntegrateable {

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "supplier", referencedColumnName = "id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	Supplier supplier

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "trans_type", referencedColumnName = "id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	ApTransaction transType

	@GraphQLQuery
	@Column(name = "payee_name", columnDefinition = "varchar")
	@UpperCase
	String payeeName
	
	@GraphQLQuery
	@Column(name = "dis_no", columnDefinition = "varchar")
	@UpperCase
	String disNo

	@GraphQLQuery
	@Column(name = "payment_cat", columnDefinition = "varchar")
	@UpperCase
	String paymentCategory

	@GraphQLQuery
	@Column(name = "dis_type", columnDefinition = "varchar")
	@UpperCase
	String disType

	@GraphQLQuery
	@Column(name = "dis_date", columnDefinition = "date")
	Instant disDate

	@GraphQLQuery
	@Column(name = "cash", columnDefinition = "numeric")
	@UpperCase
	BigDecimal cash

	@GraphQLQuery
	@Column(name = "checks", columnDefinition = "numeric")
	@UpperCase
	BigDecimal checks

	@GraphQLQuery
	@Column(name = "discount_amount", columnDefinition = "numeric")
	@UpperCase
	BigDecimal discountAmount

	@GraphQLQuery
	@Column(name = "ewt_amount", columnDefinition = "bool")
	@UpperCase
	BigDecimal ewtAmount

	@GraphQLQuery
	@Column(name = "voucher_amount", columnDefinition = "numeric")
	@UpperCase
	BigDecimal voucherAmount

	@GraphQLQuery
	@Column(name = "applied_amount", columnDefinition = "numeric")
	@UpperCase
	BigDecimal appliedAmount

	@GraphQLQuery
	@Column(name = "status", columnDefinition = "varchar")
	@UpperCase
	String status

	@GraphQLQuery
	@Column(name = "is_advance", columnDefinition = "bool")
	Boolean isAdvance

	@GraphQLQuery
	@Column(name = "posted", columnDefinition = "bool")
	@UpperCase
	Boolean posted

	@GraphQLQuery
	@Column(name = "posted_by", columnDefinition = "varchar")
	@UpperCase
	String postedBy

	@GraphQLQuery
	@Column(name = "posted_ledger", columnDefinition = "uuid")
	UUID postedLedger

	@GraphQLQuery
	@Column(name = "company", columnDefinition = "uuid")
	UUID company

	@GraphQLQuery
	@Column(name = "remarks_notes", columnDefinition = "varchar")
	@UpperCase
	String remarksNotes


	//accounting integrate
	@Override
	String getDomain() {
		return Disbursement.class.name
	}

	@Transient
	String flagValue

	@Override
	Map<String, String> getDetails() {
		return [:]
	}

	@Transient
	Bank bank

	@Transient
	BigDecimal cashOnHand, cashOnBank, supplierAmount, advancesSupplier, discAmount

	@Transient
	BigDecimal ewt1Percent,ewt2Percent,
			ewt3Percent,ewt4Percent,ewt5Percent,ewt7Percent,ewt10Percent,ewt15Percent,ewt18Percent,ewt30Percent

	//expense




}

