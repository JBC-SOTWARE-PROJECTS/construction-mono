package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.*
import java.time.Instant

@Entity
@Table(schema = "accounting", name = "ar_transaction_ledger")
class ArTransactionLedger extends AbstractAuditingEntity implements Serializable {

    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @GraphQLQuery
    @Column(name = "record_no", unique = true)
    String recordNo

    @GraphQLQuery
    @Column(name = "doc_no", unique = true)
    String docNo

    @GraphQLQuery
    @Column(name = "doc_type")
    String docType

    @GraphQLQuery
    @Column(name = "reference_no", unique = true)
    String referenceNo

    @GraphQLQuery
    @Column(name = "reference_type")
    String referenceType

    @GraphQLQuery
    @Column(name = "ar_customers")
    UUID arCustomerId

    @GraphQLQuery
    @Column(name = "ar_invoice_id")
    UUID arInvoiceId

    @GraphQLQuery
    @Column(name = "ar_credit_note_id")
    UUID arCreditNoteId

    @GraphQLQuery
    @Column(name = "ar_payment_id")
    UUID arPaymentId

    @GraphQLQuery
    @Column(name = "ledger_date")
    Instant ledgerDate

    @GraphQLQuery
    @Column(name = "doc_date")
    Date docDate

    @GraphQLQuery
    @Column(name = "total_cwt_amount")
    BigDecimal totalCwtAmount

    @GraphQLQuery
    @Column(name = "total_vat_amount")
    BigDecimal totalVatAmount

    @GraphQLQuery
    @Column(name = "total_amount_due")
    BigDecimal totalAmountDue

    @GraphQLQuery
    @Column(name = "remaining_balance")
    BigDecimal remainingBalance

}
