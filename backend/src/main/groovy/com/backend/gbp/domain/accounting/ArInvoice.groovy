package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.types.AutoIntegrateable
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.*
import java.time.Instant

enum AR_INVOICE_FLAG  {
    AR_CLAIMS_INVOICE,
    AR_REGULAR_INVOICE
}

@Entity
@Table(schema = "accounting", name = "ar_invoice")
class ArInvoice extends AbstractAuditingEntity implements Serializable, AutoIntegrateable {

    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @GraphQLQuery
    @Column(name = "invoice_no", unique = true)
    String invoiceNo

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ar_customers", referencedColumnName = "id")
    ArCustomers arCustomer

    @GraphQLQuery
    @Column(name = "due_date")
    Date dueDate

    @GraphQLQuery
    @Column(name = "invoice_date")
    Date invoiceDate

    @GraphQLQuery
    @Column(name = "billing_address")
    String billingAddress

    @GraphQLQuery
    @Column(name = "discount_amount")
    BigDecimal discountAmount

    @GraphQLQuery
    @Column(name = "cwt_amount")
    BigDecimal cwtAmount

    @GraphQLQuery
    @Column(name = "is_CWT")
    Boolean isCWT

    @GraphQLQuery
    @Column(name = "cwt_rate")
    BigDecimal cwtRate

    @GraphQLQuery
    @Column(name = "vat_amount")
    BigDecimal vatAmount

    @GraphQLQuery
    @Column(name = "is_vatable")
    Boolean isVatable

    @GraphQLQuery
    @Column(name = "total_amount_due")
    BigDecimal totalAmountDue

    @GraphQLQuery
    @Column(name = "total_credit_note")
    BigDecimal totalCreditNote

    @GraphQLQuery
    @Column(name = "total_payments")
    BigDecimal totalPayments

    @GraphQLQuery
    @Column(name = "invoice_type")
    String invoiceType

    @GraphQLQuery
    @Column(name = "reference")
    String reference

    @GraphQLQuery
    @Column(name = "notes")
    String notes

    @GraphQLQuery
    @Column(name = "status")
    String status

    @GraphQLQuery
    @Column(name = "ledger_id")
    UUID ledgerId

    @GraphQLQuery
    @Column(name = "approved_by")
    UUID approvedBy

    @GraphQLQuery
    @Column(name = "approved_date")
    Instant approvedDate


    @Override
    String getDomain() {
        return ArInvoice.class.name
    }

    @Override
    Map<String, String> getDetails() {
        return [:]
    }

    @Transient
    String flagValue

    @Transient
    BigDecimal netTotalAmount
    BigDecimal getNetTotalAmount() {
        BigDecimal credit =  totalCreditNote?:0.00
        BigDecimal payments = totalPayments?:0.00
        BigDecimal totalCredits  = payments + credit
        BigDecimal total = totalAmountDue?:0.00
        BigDecimal netTotal =  total - totalCredits
        return  netTotal
    }

    @Transient
    BigDecimal negativeTotalHCIAmount
    BigDecimal getNegativeTotalHCIAmount() {
        return totalHCIAmount.negate()
    }

    @Transient
    BigDecimal negativeTotalPFAmount
    BigDecimal getNegativeTotalPFAmount() {
        return totalPFAmount.negate()
    }

    @Transient
    BigDecimal negativeTotalAmountDue
    BigDecimal getNegativeTotalAmountDue() {
        return totalAmountDue.negate()
    }

    @Transient
    BigDecimal negativeCWTAmount
    BigDecimal getNegativeCWTAmount() {
        return cwtAmount.negate()
    }

    @Transient
    BigDecimal negativeVATAmount
    BigDecimal getNegativeVATAmount() {
        return vatAmount.negate()
    }

    @Transient
    BigDecimal payment,electricity, rental, others, unitPrice, quantity, totalAmount, negativeTotalAmount, totalHCIVat, totalHCITax
}
