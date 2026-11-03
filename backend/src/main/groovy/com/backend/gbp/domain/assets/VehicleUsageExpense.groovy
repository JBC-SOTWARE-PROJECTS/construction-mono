package com.backend.gbp.domain.assets

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.assets.enums.VehicleUsageExpenseType
import com.backend.gbp.domain.inventory.Item
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.SQLDelete
import org.hibernate.annotations.Type
import org.hibernate.annotations.Where

import javax.persistence.*

@Entity
@Table(schema = "asset", name = "vehicle_usage_expense")
@SQLDelete(sql = "UPDATE asset.vehicle_usage_expense SET deleted = true WHERE id = ?")
@Where(clause = "deleted <> true or deleted is null")
class VehicleUsageExpense extends AbstractAuditingEntity implements Serializable {

    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id

    @GraphQLQuery
    @Enumerated(EnumType.STRING)
    @Column(name = "expense_type", nullable = false)
    VehicleUsageExpenseType expenseType

    @GraphQLQuery
    @Column(name = "particulars", nullable = false)
    String particulars

    @GraphQLQuery
    @Column(name = "quantity")
    BigDecimal quantity

    @GraphQLQuery
    @Column(name = "amount", nullable = false, precision = 19, scale = 2)
    BigDecimal amount

    @GraphQLQuery
    @NotFound(action = NotFoundAction.IGNORE)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "item", referencedColumnName = "id")
    Item item

    @GraphQLQuery
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "vehicle_usage", referencedColumnName = "id", nullable = false)
    VehicleUsageMonitoring vehicleUsage

    @GraphQLQuery
    @Column(name = "company", nullable = false)
    UUID company
}
