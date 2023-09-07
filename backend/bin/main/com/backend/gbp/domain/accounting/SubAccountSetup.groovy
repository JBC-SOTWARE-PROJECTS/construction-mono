package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.annotations.UpperCase
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
    ITEM_CATEGORY("Item Category", "com.backend.gbp.domain.inventory.ItemCategory")

    String displayName
    String path

    DomainEnum(String displayName, String path) {
        this.displayName = displayName
        this.path = path
    }

    String toString() {
        return displayName
    }

    String getPath() {
        return path
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

    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "parent_account", referencedColumnName = "id")
    ParentAccount parentAccount

    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "subaccount_parent", referencedColumnName = "id")
    SubAccountSetup subaccountParent

    @GraphQLQuery
    @Enumerated(EnumType.STRING)
    @Column(name = "source_domain", columnDefinition = "varchar")
    DomainEnum sourceDomain

}
