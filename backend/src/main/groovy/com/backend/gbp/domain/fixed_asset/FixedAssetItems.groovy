package com.backend.gbp.domain.fixed_asset

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.Office
import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.domain.inventory.PurchaseOrder
import com.backend.gbp.domain.inventory.ReceivingReport
import com.backend.gbp.domain.inventory.ReceivingReportItem
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
class FixedAssetItems extends AbstractAuditingEntity implements Serializable {

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
    String itemId

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

    @GraphQLQuery
    @Column(name = "delivery_receiving_id")
    ReceivingReport deliveryReceiving

    @GraphQLQuery
    @Column(name = "delivery_receiving_item_id")
    ReceivingReportItem deliveryReceivingItem

    @GraphQLQuery
    @Column(name = "delivery_receiving_date")
    Date deliveryReceivingDate

    @GraphQLQuery
    @Column(name = "status")
    String status

    @GraphQLQuery
    @Column(name = "company_id")
    UUID companyId
}
