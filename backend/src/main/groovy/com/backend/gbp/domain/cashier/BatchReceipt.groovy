package com.backend.gbp.domain.cashier

import com.backend.gbp.domain.AbstractAuditingEntity
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.Column
import javax.persistence.Entity
import javax.persistence.EnumType
import javax.persistence.Enumerated
import javax.persistence.FetchType
import javax.persistence.GeneratedValue
import javax.persistence.Id
import javax.persistence.JoinColumn
import javax.persistence.ManyToOne
import javax.persistence.Table


@Entity
@Table(name = "batch_receipt", schema = "cashier")
class BatchReceipt extends AbstractAuditingEntity implements Serializable {

    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @GraphQLQuery
    @Column(name = "batch_code", columnDefinition = "varchar")
    String batchCode

    @GraphQLQuery
    @Enumerated(EnumType.STRING)
    @Column(name = "receipt_type", columnDefinition = "varchar")
    ReceiptType receiptType

    @GraphQLQuery
    @Column(name = "receipt_current_no", columnDefinition = "varchar")
    Long receiptCurrentNo

    @GraphQLQuery
    @Column(name = "range_start", columnDefinition = "varchar")
    Long rangeStart

    @GraphQLQuery
    @Column(name = "range_end", columnDefinition = "varchar")
    Long rangeEnd

    @GraphQLQuery
    @Column(name = "is_active", columnDefinition = "bool")
    Boolean active

    @GraphQLQuery
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "terminal", referencedColumnName = "id")
    Terminal terminal

    @GraphQLQuery
    @Column(name = "company_id")
    UUID companyId
}
