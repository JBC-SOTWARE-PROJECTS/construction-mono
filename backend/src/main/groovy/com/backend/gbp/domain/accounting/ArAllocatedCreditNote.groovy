package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.*

@Entity
@Table(schema = "accounting", name = "ar_credit_note_allocated_invoice")
class ArAllocatedCreditNote extends AbstractAuditingEntity implements Serializable {

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

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ar_customer", referencedColumnName = "id")
    ArCustomers arCustomer

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "ar_credit_note_id", referencedColumnName = "id")
    ArCreditNote arCreditNote

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "invoice_id", referencedColumnName = "id")
    ArInvoice invoice

    @GraphQLQuery
    @Column(name = "pn_id")
    UUID pnId

    @GraphQLQuery
    @Column(name = "date_applied")
    Date creditNoteDate

    @GraphQLQuery
    @Column(name = "invoice_amount_due")
    BigDecimal invoiceAmountDue

    @GraphQLQuery
    @Column(name = "amount_allocate")
    BigDecimal amountAllocate

    @GraphQLQuery
    @Column(name = "status")
    String status

    @GraphQLQuery
    @Column(name = "company_id")
    UUID companyId

}
