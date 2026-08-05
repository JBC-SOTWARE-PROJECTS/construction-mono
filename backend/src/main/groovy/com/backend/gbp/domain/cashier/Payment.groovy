package com.backend.gbp.domain.cashier

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.accounting.Bank
import com.backend.gbp.domain.accounting.IntegrationDomainEnum
import com.backend.gbp.domain.billing.Billing
import com.backend.gbp.domain.billing.BillingItem
import com.backend.gbp.domain.types.AutoIntegrateable
import com.backend.gbp.graphqlservices.cashier.PaymentTarget
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import org.hibernate.annotations.Where

import javax.persistence.*
import java.time.Instant

enum PaymentType {
	CASH,
	CHECK,
	CARD, //CREDIT/DEBIT
	BANKDEPOSIT,
	EWALLET
}

enum ReceiptType {
	SI("Sales Invoice", true),
	AR("Acknowledgement Receipt", false),
	OR("Official Receipt", false)

	final String label
	final boolean isDefault

	ReceiptType(String label, boolean isDefault) {
		this.label = label
		this.isDefault = isDefault
	}
}

@Entity
@Table(schema = "cashier", name = "payments")
@SQLDelete(sql = "UPDATE cashier.payments SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class Payment extends AbstractAuditingEntity implements Serializable, AutoIntegrateable{

	@GraphQLQuery
	@Id
	@GeneratedValue(generator = "system-uuid")
	@GenericGenerator(name = "system-uuid", strategy = "uuid2")
	@Column(name = "id", columnDefinition = "uuid")
	@Type(type = "pg-uuid")
	UUID id

	@GraphQLQuery
	@Column(name = "totalpayments")
	BigDecimal totalPayments

	@GraphQLQuery
	@Column(name = "totalcash")
	BigDecimal totalCash

	@GraphQLQuery
	@Column(name = "totalcheck")
	BigDecimal totalCheck

	@GraphQLQuery
	@Column(name = "totalcard")
	BigDecimal totalCard

	@GraphQLQuery
	@Column(name = "total_deposit", columnDefinition = "numeric")
	BigDecimal totalDeposit

	@GraphQLQuery
	@Column(name = "total_e_wallet", columnDefinition = "numeric")
	BigDecimal totalEWallet

	@GraphQLQuery
	@Column(name = "change", columnDefinition = "numeric")
	BigDecimal change

	@GraphQLQuery
	@Column(name = "ornumber")
	String orNumber

	@GraphQLQuery
	@Column(name = "description")
	String description

	@GraphQLQuery
	@Column(name = "in_words")
	String inWords

	@GraphQLQuery
	@Column(name = "remarks")
	String remarks

	@GraphQLQuery
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "billingid", referencedColumnName = "id")
	Billing billing

	@GraphQLQuery
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "billingitemid", referencedColumnName = "id")
	BillingItem billingItem

	@GraphQLQuery
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "shiftid", referencedColumnName = "id")
	Shift shift

	@GraphQLQuery
	@Column(name = "receipt_type")
	String receiptType

	@GraphQLQuery
	@Column(name = "void")
	Boolean voided

	@GraphQLQuery
	@Column(name = "void_date")
	Instant voidDate

	@GraphQLQuery
	@Column(name = "void_type")
	String voidBy

	@OneToMany(fetch = FetchType.LAZY, cascade = [CascadeType.ALL], orphanRemoval = true, mappedBy = "payment")
	List<PaymentDetails> paymentDetails = []

	@GraphQLQuery
	@Column(name = "posted_ledger_id")
	UUID postedLedgerId

	@GraphQLQuery
	@Column(name = "payor_name")
	String payorName

	@GraphQLQuery
	@Column(name = "transaction_type")
	String transactionType

	@GraphQLQuery
	@Column(name = "ar_customer_id", columnDefinition = "uuid")
	UUID arCustomerId

	@GraphQLQuery
	@Column(name = "company_id")
	UUID companyId

	@Transient
	List<PaymentTarget> paymentTargets = []

	@Override
	String getDomain() {
		return IntegrationDomainEnum.PAYMENT.name()
	}

	@Transient
	String flagValue

	@Override
	Map<String, String> getDetails() {
		return [:]
	}

	@Transient
	Terminal cashierTerminal
	Terminal getCashierTerminal()
	{
		return shift.terminal
	}

	@Transient
	Bank bankForCashDeposit

	@Transient
	Bank  bankForCreditCard

	@Transient
	BigDecimal  amountForCreditCard

	@Transient
	BigDecimal  amountForCashDeposit



	@Transient
	BigDecimal erPayments


	@Transient
	BigDecimal opdPayments

	@Transient
	BigDecimal ipdPayments

	@Transient
	BigDecimal otcPayments


	@Transient
	BigDecimal pfPaymentsAll


	@Transient
	BigDecimal advancesFromPatients

	@Transient
	String investorNo

	//Investors
	@Transient
	BigDecimal subscribedShareCapital, subscriptionReceivable, additionalPaidInCapital, discountOnShareCapital,
			   advancesFromInvestors, shareCapital, payableToInvestor

}
