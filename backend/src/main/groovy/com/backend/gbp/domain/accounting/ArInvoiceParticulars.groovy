package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import groovy.transform.Canonical
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.*

@Canonical
class SalesAccount{
    String code
    String description
}

@Entity
@Table(schema = "accounting", name = "ar_invoice_particulars")
class ArInvoiceParticulars extends AbstractAuditingEntity implements Serializable {

    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @GraphQLQuery
    @Column(name = "item_code")
    String itemCode

    @GraphQLQuery
    @Column(name = "item_name")
    String itemName

    @GraphQLQuery
    @Column(name = "description")
    String description

    @GraphQLQuery
    @Column(name = "item_category")
    String itemCategory

    @GraphQLQuery
    @Column(name = "cost_price")
    BigDecimal costPrice

    @GraphQLQuery
    @Column(name = "sale_price")
    BigDecimal salePrice

    @GraphQLQuery
    @Column(name = "is_active")
    Boolean isActive

    @GraphQLQuery
    @Column(name = "sales_account")
    String salesAccountCode

    @GraphQLQuery
    @Column(name = "company_id")
    UUID companyId
}
