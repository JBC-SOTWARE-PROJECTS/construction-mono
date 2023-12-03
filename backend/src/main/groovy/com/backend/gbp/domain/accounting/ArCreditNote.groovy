package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.types.AutoIntegrateable
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.*

enum AR_CREDIT_NOTE_FLAG  {
    AR_CREDIT_NOTE
}

@Entity
@Table(schema = "accounting", name = "ar_credit_note")
class ArCreditNote extends AbstractAuditingEntity implements Serializable, AutoIntegrateable {

    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @GraphQLQuery
    @Column(name = "credit_note_no", unique = true)
    String creditNoteNo

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ar_customers", referencedColumnName = "id")
    ArCustomers arCustomer

    @GraphQLQuery
    @Column(name = "credit_note_date")
    Date creditNoteDate

    @GraphQLQuery
    @Column(name = "cwt_rate")
    BigDecimal cwtRate

    @GraphQLQuery
    @Column(name = "discount_percentage")
    BigDecimal discountPercentage

    @GraphQLQuery
    @Column(name = "discount_amount")
    BigDecimal discountAmount

    @GraphQLQuery
    @Column(name = "total_cwt_amount")
    BigDecimal cwtAmount

    @GraphQLQuery
    @Column(name = "is_CWT")
    Boolean isCWT

    @GraphQLQuery
    @Column(name = "total_vat_amount")
    BigDecimal vatAmount

    @GraphQLQuery
    @Column(name = "is_vatable")
    Boolean isVatable

    @GraphQLQuery
    @Column(name = "total_amount_due")
    BigDecimal totalAmountDue

    @GraphQLQuery
    @Column(name = "credit_note_type")
    String creditNoteType

    @GraphQLQuery
    @Column(name = "invoice_type")
    String invoiceType

    @GraphQLQuery
    @Column(name = "billing_address")
    String billingAddress

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
    @Column(name = "company_id")
    UUID companyId

    @Override
    String getDomain() {
        return IntegrationDomainEnum.CREDIT_NOTE.name()
    }

    @Override
    Map<String, String> getDetails() {
        return [:]
    }

    @Transient
    String flagValue

    @Transient
    BigDecimal negativeCwtAmount
    BigDecimal getNegativeCwtAmount() {
        if(cwtAmount) return cwtAmount.negate()
        return 0.00
    }

    @Transient
    BigDecimal negativeVatAmount
    BigDecimal getNegativeVatAmount() {
        if(vatAmount) return vatAmount.negate()
        return 0.00
    }


    @Transient
    BigDecimal negativeTotalAmountDue
    BigDecimal getNegativeTotalAmountDue() {
        if(totalAmountDue) return totalAmountDue.negate()
        return 0.00
    }

    @Transient
    BigDecimal negativeCWTAmount
    BigDecimal getNegativeCWTAmount() {
        if(cwtAmount) return cwtAmount.negate()
        return 0.00
    }

    @Transient
    BigDecimal totalDiscount , totalTransfer, negativeTotalAmount, totalHCICreditNote, totalPFCreditNote

}
