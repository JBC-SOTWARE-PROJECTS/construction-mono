package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.types.AutoIntegrateable
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.Formula
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.*

enum CompoundType {
    annually,
    monthly
}

enum LOAN_INTEGRATION {
    LOAN_ENTRY
}

@Entity
@Table(name = "loans", schema = "accounting")
class Loan extends  AbstractAuditingEntity implements Serializable, AutoIntegrateable {

    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @GraphQLQuery
    @Column(name = "loan_no")
    String loanNo

    @GraphQLQuery
    @Column(name="reference_no")
    String referenceNo

    @GraphQLQuery
    @Column(name="start_date")
    Date startDate

    @ManyToOne(fetch = FetchType.LAZY)
    
    @JoinColumn(name="bank_account",referencedColumnName = "id")
    Bank bankAccount

    @GraphQLQuery
    @Column(name="compound_type")
    String compoundType

    @GraphQLQuery
    @Column(name="interest_rate")
    BigDecimal interestRate

    @GraphQLQuery
    @Column(name="loan_period")
    Integer loanPeriod

    @GraphQLQuery
    @Column(name="loan_amount")
    BigDecimal loanAmount

    @GraphQLQuery
    @Column(name="number_of_payments")
    Integer numberOfPayments

    @GraphQLQuery
    @Column(name="total_interest")
    BigDecimal totalInterest

    @GraphQLQuery
    @Column(name="loan_payment")
    BigDecimal loanPayment

    @GraphQLQuery
    @Column(name="total_cost_of_loan")
    BigDecimal totalCostOfLoan

    @GraphQLQuery
    @Column(name="posted_ledger")
    UUID postedLedger

    @GraphQLQuery
    @Formula("(Select coalesce(sum(la.payment),0) from accounting.loan_amortization la where la.posted_ledger is not null and la.loan=id)")
    BigDecimal paidPayments

    @GraphQLQuery
    @Column(name = "company_id")
    UUID companyId

    @Transient
    BigDecimal remainingBalance
    BigDecimal getRemainingBalance() {
        def b = totalCostOfLoan-paidPayments
        return b
    }

    @Override
    String getDomain() {
        return IntegrationDomainEnum.LOAN.name()
    }

    @Override
    Map<String, String> getDetails() {
        return [:]
    }

    @Transient
    String flagValue


    @Transient
    BigDecimal negativeLoanAmount
    BigDecimal getNegativeLoanAmount() {
        def b = -loanAmount
        return b
    }

    @Transient
    BigDecimal negativeLoanPayment
    BigDecimal getNegativeLoanPayment() {
        def b = -loanPayment
        return b
    }

    @Transient
    BigDecimal negativeInterestRate
    BigDecimal getNegativeInterestRate() {
        def b = -interestRate
        return b
    }


}
