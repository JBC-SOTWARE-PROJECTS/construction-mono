package com.backend.gbp.domain.accounting


import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.accounting.dto.CompanyDiscountAndPenalties
import com.backend.gbp.domain.accounting.dto.CustomerInfo
import com.backend.gbp.domain.accounting.dto.CustomerOtherDetails
import com.backend.gbp.domain.types.Subaccountable
import com.backend.gbp.rest.dto.CoaConfig
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.*

enum CustomerType {
    GOVERNMENT,
    PRIVATE,
}

@Entity
@Table(schema = "accounting", name = "ar_customers")
class ArCustomers extends AbstractAuditingEntity implements Serializable, Subaccountable {

    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @GraphQLQuery
    @Column(name = "account_prefix")
    String accountPrefix

    @GraphQLQuery
    @Column(name = "account_no", unique = true)
    String accountNo

    @GraphQLQuery
    @Column(name = "name")
    String customerName

    @GraphQLQuery
    @Column(name = "address")
    String address

    @GraphQLQuery
    @Column(name = "contact_person")
    String contactPerson

    @GraphQLQuery
    @Column(name = "contact_no")
    String contactNo

    @GraphQLQuery
    @Column(name = "contact_email")
    String contactEmail


    @Enumerated(EnumType.STRING)
    @GraphQLQuery
    @Column(name = "type")
    CustomerType customerType

    @GraphQLQuery
    @Type(type = "jsonb")
    @Column(name="client_info",columnDefinition = "jsonb")
    CustomerInfo customerInfo

    @GraphQLQuery
    @Type(type = "jsonb")
    @Column(name="other_details",columnDefinition = "jsonb")
    CustomerOtherDetails otherDetails

    @GraphQLQuery
    @Type(type = "jsonb")
    @Column(name="discount_and_penalties",columnDefinition = "jsonb")
    CompanyDiscountAndPenalties discountAndPenalties

    @GraphQLQuery
    @Column(name = "company_id")
    UUID companyId

    @Override
    String getDomain() {
        return ArCustomers.class.name
    }

    @Override
    String getCode() {
        return accountNo
    }
    @Override
    String getAccountName() {
        return null
    }
}
