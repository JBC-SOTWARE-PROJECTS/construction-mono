package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.*

@Entity
@Table(schema = "accounting", name = "ar_invoice_items")
class ArInvoiceItems extends AbstractAuditingEntity implements Serializable {

    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @GraphQLQuery
    @Column(name = "invoice_no")
    String invoiceNo

    @GraphQLQuery
    @Column(name = "transaction_date")
    Date transactionDate

    @GraphQLQuery
    @Column(name = "record_no" , unique = true)
    String recordNo

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ar_invoice_id", referencedColumnName = "id")
    ArInvoice arInvoice

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ar_customers", referencedColumnName = "id")
    ArCustomers arCustomer

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_particulars", referencedColumnName = "id")
    ArInvoiceParticulars invoiceParticulars

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
    @Column(name = "discount")
    BigDecimal discount

    @GraphQLQuery
    @Column(name = "discount_amount")
    BigDecimal discountAmount

    @GraphQLQuery
    @Column(name = "cwt_amount")
    BigDecimal cwtAmount

    @GraphQLQuery
    @Column(name = "cwt_rate")
    BigDecimal cwtRate

    @GraphQLQuery
    @Column(name = "is_CWT")
    Boolean isCWT

    @GraphQLQuery
    @Column(name = "vat_amount")
    BigDecimal vatAmount

    @GraphQLQuery
    @Column(name = "is_vatable")
    Boolean isVatable

    @GraphQLQuery
    @Column(name = "credit_note")
    BigDecimal creditNote

    @GraphQLQuery
    @Column(name = "payment")
    BigDecimal totalPayments

    @GraphQLQuery
    @Column(name = "total_amount_due")
    BigDecimal totalAmountDue

    @GraphQLQuery
    @Column(name = "soa_no")
    String soa_no

    @GraphQLQuery
    @Column(name = "status")
    String status

    @GraphQLQuery
    @Column(name = "reference_transfer_id")
    UUID reference_transfer_id

    @GraphQLQuery
    @Column(name = "uom")
    String unitOfMeasure

    @GraphQLQuery
    @Column(name = "relative_weight")
    BigDecimal relativeWeight

    @GraphQLQuery
    @Column(name = "percentage")
    BigDecimal percentage

    @GraphQLQuery
    @Column(name = "qty_prev")
    Integer qtyPrev

    @GraphQLQuery
    @Column(name = "qty_this_period")
    Integer qtyThisPeriod

    @GraphQLQuery
    @Column(name = "qty_to_date")
    Integer qtyToDate

    @GraphQLQuery
    @Column(name = "qty_balance")
    Integer qtyBalance

    @GraphQLQuery
    @Column(name = "amount_prev")
    BigDecimal amountPrev

    @GraphQLQuery
    @Column(name = "amount_this_period")
    BigDecimal amountThisPeriod

    @GraphQLQuery
    @Column(name = "amount_to_date")
    BigDecimal amountToDate

    @GraphQLQuery
    @Column(name = "amount_balance")
    BigDecimal amountBalance

    @GraphQLQuery
    @Column(name = "project_id")
    UUID projectId

    @GraphQLQuery
    @Column(name = "project_costs_id")
    UUID projectCostsId

    @Transient
    BigDecimal netTotalAmount
    BigDecimal getNetTotalAmount() {
        BigDecimal credit =  creditNote?:0.00
        BigDecimal payments = totalPayments?:0.00
        BigDecimal totalCredits  = payments + credit
        BigDecimal total = totalAmountDue?:0.00
        BigDecimal netTotal =  total - totalCredits
        return  netTotal
    }

    @GraphQLQuery
    @Column(name = "company_id")
    UUID companyId

    @Transient
    BigDecimal discountPercentage, amountToApply
}
