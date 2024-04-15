package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.annotations.UpperCase
import com.backend.gbp.graphqlservices.accounting.DomainOptionDto
import com.fasterxml.jackson.core.JsonProcessingException
import com.fasterxml.jackson.databind.ObjectMapper
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*


enum DomainEnum {
    NO_DOMAIN("NO DOMAIN", ""),
    SUPPLIER("Supplier", "com.backend.gbp.domain.inventory.Supplier"),
    BANK("Bank", "com.backend.gbp.domain.accounting.Bank"),
    PROJECTS("Projects", "com.backend.gbp.domain.projects.Projects"),
    ITEM_ASSET_SUB_ACCOUNT("Item Asset Sub-account", "com.backend.gbp.domain.inventory.ItemSubAccount", 'isAsset'),
    FIXED_ASSET_SUB_ACCOUNT("Fixed Asset Sub-account", "com.backend.gbp.domain.inventory.ItemSubAccount",'isFixedAsset'),
    ITEM_REVENUE_SUB_ACCOUNT("Item Revenue Sub-account", "com.backend.gbp.domain.inventory.ItemSubAccount", 'isRevenue'),
    ITEM_EXPENSE_SUB_ACCOUNT("Item Expense Sub-account", "com.backend.gbp.domain.inventory.ItemSubAccount", 'isExpense')

    String displayName
    String path
    String flagColumn

    DomainEnum(String displayName, String path, String flagColumn = '') {
        this.displayName = displayName
        this.path = path
        this.flagColumn = flagColumn
    }

    String toString() {
        return displayName
    }

    String getPath() {
        return path
    }

    String getFlagColumn() {
        return flagColumn
    }
}


@Entity
@Table(name = "subaccount", schema = "accounting")
class SubAccountSetup extends AbstractAuditingEntity implements Serializable {

    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @GraphQLQuery
    @Column(name = "subaccount_code", columnDefinition = "varchar")
    @UpperCase
    String subaccountCode

    @GraphQLQuery
    @Column(name = "account_name", columnDefinition = "varchar")
    @UpperCase
    String accountName

    @GraphQLQuery
    @Column(name = "description", columnDefinition = "varchar")
    @UpperCase
    String description

    @GraphQLQuery
    @Enumerated(EnumType.STRING)
    @Column(name = "subaccount_category", columnDefinition = "varchar")
    AccountCategory accountCategory

    @GraphQLQuery
    @Enumerated(EnumType.STRING)
    @Column(name = "subaccount_type", columnDefinition = "varchar")
    AccountType subaccountType

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_account", referencedColumnName = "id")
    ParentAccount parentAccount

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subaccount_parent", referencedColumnName = "id")
    SubAccountSetup subaccountParent

    @GraphQLQuery
    @Enumerated(EnumType.STRING)
    @Column(name = "source_domain", columnDefinition = "varchar")
    DomainEnum sourceDomain

    @GraphQLQuery
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", referencedColumnName = "id")
    CompanySettings company

    @GraphQLQuery
    @Column(name = "is_inactive", columnDefinition = "bool")
    Boolean isInactive

    @GraphQLQuery
    @Type(type = "jsonb")
    @Column(name="domain_excludes",columnDefinition = "jsonb")
    List<DomainOptionDto> domainExcludes

    @GraphQLQuery(name = "domainName")
    @Transient
    String domainName
    String getDomainName() {
        return sourceDomain.displayName
    }

}
