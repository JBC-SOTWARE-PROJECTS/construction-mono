package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.*
import java.time.LocalDate

@Entity
@Table(name="save_accounts", schema = "accounting")
class SavedAccounts extends AbstractAuditingEntity implements Serializable {

    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @GraphQLQuery
    @Column(name="year_char",columnDefinition = "int")
    Integer yearChar

    @GraphQLQuery
    @Column(name="transaction_date",columnDefinition = "date")
    LocalDate transactionDate

    @GraphQLQuery
    @Column(name="transaction_date_str",columnDefinition = "varchar")
    String transactionDateStr

    @GraphQLQuery
    @Column(name="mother_code",columnDefinition = "varchar")
    String motherCode

    @GraphQLQuery
    @Column(name="sub_code",columnDefinition = "varchar")
    String subCode

    @GraphQLQuery
    @Column(name="sub_sub_code",columnDefinition = "varchar")
    String subSubCode

    @GraphQLQuery
    @Column(name="mother_account",columnDefinition = "varchar")
    String motherAccount

    @GraphQLQuery
    @Column(name="sub_account",columnDefinition = "varchar")
    String subAccount

    @GraphQLQuery
    @Column(name="sub_sub_account",columnDefinition = "varchar")
    String subSubAccount

    @GraphQLQuery
    @Column(name="code",columnDefinition = "varchar")
    String code

    @GraphQLQuery
    @Column(name="description",columnDefinition = "varchar")
    String description

    @GraphQLQuery
    @Column(name="debit",columnDefinition = "numeric")
    BigDecimal debit

    @GraphQLQuery
    @Column(name="credit",columnDefinition = "numeric")
    BigDecimal credit

    @GraphQLQuery
    @Column(name="balance",columnDefinition = "numeric")
    BigDecimal balance

    @GraphQLQuery
    @Column(name="normal_side",columnDefinition = "numeric")
    String normalSide

    @GraphQLQuery
    @Column(name="account_type",columnDefinition = "numeric")
    String accountType

    @GraphQLQuery
    @Column(name = "company_id")
    UUID companyId
}
