package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.annotations.UpperCase
import com.backend.gbp.domain.inventory.ItemCategory
import com.backend.gbp.domain.inventory.PaymentTerm
import com.backend.gbp.domain.inventory.ReceivingReport
import com.backend.gbp.domain.inventory.Supplier
import com.backend.gbp.domain.types.AutoIntegrateable
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
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
import java.math.RoundingMode
import java.time.Instant


@Entity
@Table(name = "payables", schema = "accounting")
class AccountsPayable extends AbstractAuditingEntity implements Serializable, AutoIntegrateable {

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "receiving", referencedColumnName = "id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	ReceivingReport receiving
	
	@GraphQLQuery
	@Column(name = "ap_no", columnDefinition = "varchar")
	@UpperCase
	String apNo

	@ManyToOne(fetch = FetchType.EAGER)
	@JoinColumn(name = "supplier", referencedColumnName = "id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	Supplier supplier

	@GraphQLQuery
	@Column(name = "ap_category", columnDefinition = "varchar")
	@UpperCase
	String apCategory

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "payment_terms", referencedColumnName = "id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	PaymentTerm paymentTerms

	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "trans_type", referencedColumnName = "id", foreignKey = @ForeignKey(ConstraintMode.NO_CONSTRAINT))
	ApTransaction transType

	@GraphQLQuery
	@Column(name = "apv_date", columnDefinition = "date")
	@UpperCase
	Instant apvDate

	@GraphQLQuery
	@Column(name = "invoice_no", columnDefinition = "varchar")
	@UpperCase
	String invoiceNo

	@GraphQLQuery
	@Column(name = "reference_type", columnDefinition = "varchar")
	@UpperCase
	String referenceType

	@GraphQLQuery
	@Column(name = "gross_amount", columnDefinition = "numeric")
	@UpperCase
	BigDecimal grossAmount

	@GraphQLQuery
	@Column(name = "discount_amount", columnDefinition = "numeric")
	@UpperCase
	BigDecimal discountAmount

	@GraphQLQuery
	@Column(name = "net_of_discount", columnDefinition = "numeric")
	@UpperCase
	BigDecimal netOfDiscount

	@GraphQLQuery
	@Column(name = "vat_rate", columnDefinition = "numeric")
	@UpperCase
	BigDecimal vatRate

	@GraphQLQuery
	@Column(name = "vat_inclusive", columnDefinition = "bool")
	@UpperCase
	Boolean vatInclusive

	@GraphQLQuery
	@Column(name = "vat_amount", columnDefinition = "numeric")
	@UpperCase
	BigDecimal vatAmount

	@GraphQLQuery
	@Column(name = "net_of_vat", columnDefinition = "numeric")
	@UpperCase
	BigDecimal netOfVat

	@GraphQLQuery
	@Column(name = "ewt_amount", columnDefinition = "numeric")
	@UpperCase
	BigDecimal ewtAmount

	@GraphQLQuery
	@Column(name = "net_amount", columnDefinition = "numeric")
	@UpperCase
	BigDecimal netAmount

	@GraphQLQuery
	@Column(name = "applied_amount", columnDefinition = "numeric")
	@UpperCase
	BigDecimal appliedAmount

	@GraphQLQuery
	@Column(name = "da_amount", columnDefinition = "numeric")
	@UpperCase
	BigDecimal daAmount

	@GraphQLQuery
	@Column(name = "dm_amount", columnDefinition = "numeric")
	@UpperCase
	BigDecimal dmAmount

	@GraphQLQuery
	@Column(name = "disbursement", columnDefinition = "varchar")
	String disbursement

	@GraphQLQuery
	@Column(name = "status", columnDefinition = "varchar")
	@UpperCase
	String status

	@GraphQLQuery
	@Column(name = "posted", columnDefinition = "bool")
	@UpperCase
	Boolean posted

	@GraphQLQuery
	@Column(name = "posted_by", columnDefinition = "varchar")
	@UpperCase
	String postedBy

	@GraphQLQuery
	@Column(name = "remarks_notes", columnDefinition = "varchar")
	@UpperCase
	String remarksNotes

	@GraphQLQuery
	@Column(name = "posted_ledger", columnDefinition = "uuid")
	UUID postedLedger

	@GraphQLQuery
	@Column(name = "company", columnDefinition = "uuid")
	UUID company

	@GraphQLQuery
	@Column(name = "dm_ref_no", columnDefinition = "varchar")
	@UpperCase
	String dmRefNo

	@GraphQLQuery
	@Column(name = "due_date", columnDefinition = "date")
	Instant dueDate

	@GraphQLQuery
	@Column(name = "beginning_balance", columnDefinition = "bool")
	@UpperCase
	Boolean isBeginningBalance

	@GraphQLQuery(name = "balance")
	@Transient
	BigDecimal balance
	BigDecimal getBalance() {
		def b = (netAmount ?: BigDecimal.ZERO) - (appliedAmount ?: BigDecimal.ZERO) - (dmAmount ?: BigDecimal.ZERO) - (daAmount ?: BigDecimal.ZERO)
		b.setScale(2, RoundingMode.HALF_EVEN)
	}

	@GraphQLQuery(name = "debitAmount")
	@Transient
	BigDecimal debitAmount
	BigDecimal getDebitAmount() {
		def a = (dmAmount ?: BigDecimal.ZERO) + (daAmount ?: BigDecimal.ZERO)
		a.setScale(2, RoundingMode.HALF_EVEN)
	}


	//accounting integrate
	@Override
	String getDomain() {
		return IntegrationDomainEnum.ACCOUNTS_PAYABLE.name()
	}

	@Transient
	String flagValue

	@Override
	Map<String, String> getDetails() {
		return [:]
	}

	@Transient
	BigDecimal clearingAmount = BigDecimal.ZERO
	@Transient
	BigDecimal supplierAmount = BigDecimal.ZERO
	@Transient
	BigDecimal discAmount = BigDecimal.ZERO


	@Transient
	BigDecimal ewt1Percent = BigDecimal.ZERO
	@Transient
	BigDecimal ewt2Percent = BigDecimal.ZERO
	@Transient
	BigDecimal ewt3Percent = BigDecimal.ZERO
	@Transient
	BigDecimal ewt4Percent = BigDecimal.ZERO
	@Transient
	BigDecimal ewt5Percent = BigDecimal.ZERO
	@Transient
	BigDecimal ewt7Percent = BigDecimal.ZERO
	@Transient
	BigDecimal ewt10Percent = BigDecimal.ZERO
	@Transient
	BigDecimal ewt15Percent = BigDecimal.ZERO
	@Transient
	BigDecimal ewt18Percent = BigDecimal.ZERO
	@Transient
	BigDecimal ewt30Percent = BigDecimal.ZERO

	@Transient
	ItemCategory itemCategory
}

