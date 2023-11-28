package com.backend.gbp.domain.cashier

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.accounting.Bank
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import org.hibernate.annotations.Where

import javax.persistence.*

@Entity
@Table(schema = "cashier", name = "payments_details")
@SQLDelete(sql = "UPDATE cashier.payments_details SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is  null ")
class PaymentDetial extends AbstractAuditingEntity {

    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @GraphQLQuery
    @Column(name = "amount")
    BigDecimal amount

    @GraphQLQuery
    @Column(name = "type")
    String type

    @GraphQLQuery
    @Column(name = "reference")
    String reference

    @GraphQLQuery
    @Column(name = "check_date")
    String checkDate

    @GraphQLQuery
    @Column(name = "expiry")
    String expiry

    @GraphQLQuery
    @Column(name = "bank")
    String bank

    @GraphQLQuery
    @Column(name = "name_of_card")
    String cardName

    @GraphQLQuery
    @Column(name = "card_type")
    String cardType

    @GraphQLQuery
    @Column(name = "approval_code")
    String approvalCode

    @GraphQLQuery
    @Column(name = "pos_terminal_id")
    String posTerminalId

    @GraphQLQuery
    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "paymentid", referencedColumnName = "id")
    Payment payment

    @GraphQLQuery
    @Column(name = "voided")
    Boolean voided

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bank_id", referencedColumnName = "id")
    Bank bankEntity

}
