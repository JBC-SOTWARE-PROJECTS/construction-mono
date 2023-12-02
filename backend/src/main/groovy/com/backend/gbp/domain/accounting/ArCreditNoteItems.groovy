package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import groovy.transform.Canonical
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.*

@Canonical
class AccountOpt {
    String label
    String value
}

@Entity
@Table(schema = "accounting", name = "ar_credit_note_items")
class ArCreditNoteItems extends AbstractAuditingEntity implements Serializable {

    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @GraphQLQuery
    @Column(name = "credit_note_no")
    String creditNoteNo

    @GraphQLQuery
    @Column(name = "record_no" , unique = true)
    String recordNo

    @GraphQLQuery
    @Column(name = "ar_invoice_item_record_no" )
    String arInvoiceItemRecordNo

    @ManyToOne(fetch = FetchType.LAZY)

    @JoinColumn(name = "ar_invoice_item_id", referencedColumnName = "id")
    ArInvoiceItems arInvoiceItem

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_particulars", referencedColumnName = "id")
    ArInvoiceParticulars invoiceParticulars

    @GraphQLQuery
    @Column(name = "ar_invoice_no")
    String arInvoiceNo

    @GraphQLQuery
    @Column(name = "ar_invoice" )
    UUID arInvoiceId

    @ManyToOne(fetch = FetchType.LAZY)

    @JoinColumn(name = "ar_credit_note_id", referencedColumnName = "id")
    ArCreditNote arCreditNote

    @ManyToOne(fetch = FetchType.LAZY)

    @JoinColumn(name = "ar_customers", referencedColumnName = "id")
    ArCustomers arCustomer

    @GraphQLQuery
    @Column(name = "item_name")
    String itemName

    @GraphQLQuery
    @Column(name = "description")
    String description

    @GraphQLQuery
    @Column(name = "item_type")
    String itemType

    @GraphQLQuery
    @Column(name = "unit_price")
    BigDecimal unitPrice

    @GraphQLQuery
    @Column(name = "quantity")
    Integer quantity

    @GraphQLQuery
    @Column(name = "discount_percentage")
    BigDecimal discountPercentage

    @GraphQLQuery
    @Column(name = "total_cwt_amount")
    BigDecimal cwtAmount

    @GraphQLQuery
    @Column(name = "is_CWT")
    Boolean isCWT

    @GraphQLQuery
    @Column(name = "cwt_rate")
    BigDecimal cwtRate

    @GraphQLQuery
    @Column(name = "total_vat_amount")
    BigDecimal vatAmount

    @GraphQLQuery
    @Column(name = "is_vatable")
    Boolean isVatable

    @GraphQLQuery
    @Column(name = "discount_amount")
    BigDecimal discountAmount

    @GraphQLQuery
    @Column(name = "total_amount_due")
    BigDecimal totalAmountDue


    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "recipient_customer", referencedColumnName = "id")
    ArCustomers recipientCustomer

    @GraphQLQuery
    @Column(name = "recipient_invoice")
    UUID recipientInvoice

    @GraphQLQuery
    @Type(type = "jsonb")
    @Column(name="account_code",columnDefinition = "jsonb")
    AccountOpt accountCode

    @GraphQLQuery
    @Column(name = "reference")
    String reference

    @GraphQLQuery
    @Column(name = "status")
    String status

    @GraphQLQuery
    @Column(name = "company_id")
    UUID companyId
}
