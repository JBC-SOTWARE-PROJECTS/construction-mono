package com.backend.gbp.domain.fixed_asset

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.Office
import com.backend.gbp.domain.accounting.IntegrationDomainEnum
import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.domain.inventory.ItemSubAccount
import com.backend.gbp.domain.inventory.PurchaseOrder
import com.backend.gbp.domain.inventory.ReceivingReport
import com.backend.gbp.domain.inventory.ReceivingReportItem
import com.backend.gbp.domain.types.AutoIntegrateable
import com.backend.gbp.domain.types.Subaccountable
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.Type

import javax.persistence.*

enum DepreciationMethod {
    NO_DEPRECIATION("No Depreciation"),
    STRAIGHT_LINE("Straight_line")

    String label

    DepreciationMethod(String label) {
        this.label = label
    }
}


@Entity
@Table(schema = "fixed_asset", name = "fixed_asset_items")
class FixedAssetItems extends AbstractAuditingEntity implements Serializable, AutoIntegrateable {

    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @GraphQLQuery
    @Column(name = "serial_no", unique = true)
    String serialNo

    @GraphQLQuery
    @Column(name = "asset_no", unique = true)
    String assetNo

    @GraphQLQuery
    @Column(name = "item_id", unique = true)
    UUID itemId

    @GraphQLQuery
    @Column(name = "item_name", unique = true)
    String itemName

    @GraphQLQuery
    @Column(name = "description")
    String description

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "office_id", referencedColumnName = "id")
    Office office

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "purchase_id", referencedColumnName = "id")
    PurchaseOrder purchase

    @GraphQLQuery
    @Column(name = "purchase_no")
    String purchaseNo

    @GraphQLQuery
    @Column(name = "purchase_price")
    BigDecimal purchasePrice

    @GraphQLQuery
    @Column(name = "purchase_date")
    Date purchaseDate

    @GraphQLQuery
    @Enumerated(EnumType.STRING)
    @Column(name = "depreciation_method", columnDefinition = "varchar")
    DepreciationMethod depreciationMethod

    @GraphQLQuery
    @Column(name = "depreciation_start_date")
    Date depreciationStartDate

    @GraphQLQuery
    @Column(name = "salvage_value")
    BigDecimal salvageValue

    @GraphQLQuery
    @Column(name = "useful_life")
    BigDecimal usefulLife

    @GraphQLQuery
    @Column(name = "accumulated_depreciation")
    BigDecimal accumulatedDepreciation

    @GraphQLQuery
    @Column(name = "book_value")
    BigDecimal bookValue

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "delivery_receiving_id", referencedColumnName = "id")
    ReceivingReport deliveryReceiving

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "delivery_receiving_item_id", referencedColumnName = "id")
    ReceivingReportItem deliveryReceivingItem

    @GraphQLQuery
    @Column(name = "delivery_receiving_date")
    Date deliveryReceivingDate

    @GraphQLQuery
    @Column(name = "reference")
    String reference

    @GraphQLQuery
    @Column(name = "status")
    String status

    @GraphQLQuery
    @Column(name = "company_id")
    UUID companyId

    @GraphQLQuery
    @Column(name = "ledger_group_id")
    UUID ledgerGroupId

    @GraphQLQuery
    @Column(name = "is_beginning_balance")
    Boolean isBeginningBalance

    @Override
    String getDomain() {
        return IntegrationDomainEnum.FIXED_ASSET_ITEM.name()
    }

    @Override
    Map<String, String> getDetails() {
        return [:]
    }

    @Transient
    String flagValue

    @Transient
    ItemSubAccount subAccount

    @Transient
    BigDecimal negativeAmount

}
