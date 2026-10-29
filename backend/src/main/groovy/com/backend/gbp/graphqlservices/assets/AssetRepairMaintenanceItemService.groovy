package com.backend.gbp.graphqlservices.assets


import com.backend.gbp.domain.assets.AssetRepairMaintenanceItems
import com.backend.gbp.domain.assets.AssetRepairMaintenance
import com.backend.gbp.domain.assets.enums.RepairMaintenanceItemType
import com.backend.gbp.domain.inventory.InventoryLedger
import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.inventory.InventoryLedgerService
import com.backend.gbp.graphqlservices.inventory.ItemService
import com.backend.gbp.rest.dto.AssetRepairMaintenanceItemDto
import com.backend.gbp.security.SecurityUtils
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.stereotype.Component

import javax.transaction.Transactional



@Component
@GraphQLApi
@TypeChecked
class AssetRepairMaintenanceItemService extends AbstractDaoService<AssetRepairMaintenanceItems> {
    AssetRepairMaintenanceItemService() {
        super(AssetRepairMaintenanceItems.class)
    }

    @Autowired
    ItemService itemService

    @Autowired
    AssetRepairMaintenanceService assetRepairMaintenanceService

    @Autowired
    InventoryLedgerService inventoryLedgerService

    @Autowired
    ObjectMapper objectMapper

    @GraphQLQuery(name = "assetRepairMaintenanceItemById")
    AssetRepairMaintenanceItems assetRepairMaintenanceById(
            @GraphQLArgument(name = "id") UUID id
    ){
        if (!id) {
            return null
        }
        UUID company = SecurityUtils.currentCompanyId()
        String query = '''Select p from AssetRepairMaintenanceItems p where p.id = :id and p.company = :company'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        params.put('company', company)
        return createQuery(query, params).resultList.find()
    }



    @GraphQLQuery(name = "findAllAssetRepairMaintenanceItems")
    List<AssetRepairMaintenanceItems> findAllAssetRepairMaintenanceItem(){
        UUID company = SecurityUtils.currentCompanyId()
        String query = '''Select p from AssetRepairMaintenanceItems p where p.company = :company'''
        Map<String, Object> params = new HashMap<>()
        params.put('company', company)
        return createQuery(query, params).resultList
    }

    @GraphQLQuery(name = "assetRepairMaintenanceItemListPageable")
    Page<AssetRepairMaintenanceItems> assetRepairMaintenanceItemListPageable(
            @GraphQLArgument(name = "rmId") UUID rmId,
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ) {


        UUID company = SecurityUtils.currentCompanyId()
        String query = '''Select p from AssetRepairMaintenanceItems p where p.assetRepairMaintenance.id = :rmId and p.company = :company '''

        String countQuery = '''Select count(p) from AssetRepairMaintenanceItems p where p.assetRepairMaintenance.id = :rmId and p.company = :company '''

        Map<String, Object> params = new HashMap<>()
        params.put('rmId', rmId)
        params.put('company', company)
        //params.put('filter', filter

        //  query += '''ORDER BY p.item.descLong DESC'''

        Page<AssetRepairMaintenanceItems> result = getPageable(query, countQuery, page, size, params)
        return result
    }



    // ============== Mutation =======================//
    @GraphQLMutation(name = "upsertAssetRepairMaintenanceItem")
    @Transactional
    AssetRepairMaintenanceItems upsertAssetRepairMaintenanceItem(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ){

        UUID company = SecurityUtils.currentCompanyId()
        if (id != null) {
            AssetRepairMaintenanceItems existing = findOne(id)
            if (existing == null || existing.company != company) {
                throw new IllegalArgumentException("Repair/maintenance item was not found.")
            }
        }
        def project = upsertFromMap(id, fields, { AssetRepairMaintenanceItems entity, boolean forInsert ->
            if (entity.assetRepairMaintenance != null && entity.assetRepairMaintenance.company != company) {
                throw new IllegalArgumentException("Repair/maintenance record was not found.")
            }
            if (entity.item != null && entity.item.company != company) {
                throw new IllegalArgumentException("The selected inventory item is not available for this company.")
            }
            entity.company = company
        })

        return project
    }

    @GraphQLMutation(name = "upsertMPAssetRepairMaintenanceItem")
    @Transactional
    AssetRepairMaintenanceItems upsertMPAssetRepairMaintenanceItem(
            @GraphQLArgument(name = "items") ArrayList<Map<String, Object>> items
    ){

        UUID company = SecurityUtils.currentCompanyId()
        AssetRepairMaintenanceItems savedItem = null

        items.each { Map<String, Object> fields ->
            AssetRepairMaintenanceItemDto itemDto = objectMapper.convertValue(fields, AssetRepairMaintenanceItemDto.class)
            boolean forInsert = itemDto.id == null
            AssetRepairMaintenanceItems upsert = forInsert ? new AssetRepairMaintenanceItems() : findOne(itemDto.id)

            if (upsert == null || (!forInsert && upsert.company != company)) {
                throw new IllegalArgumentException("Repair/maintenance item was not found.")
            }

            AssetRepairMaintenance parent = assetRepairMaintenanceService.assetRepairMaintenanceById(itemDto.assetRepairMaintenance)
            if (parent == null || parent.company != company) {
                throw new IllegalArgumentException("Repair/maintenance record was not found.")
            }

            RepairMaintenanceItemType previousType = upsert.itemType
            Item inventoryItem = null
            if (itemDto.itemType == RepairMaintenanceItemType.MATERIAL) {
                if (itemDto.item == null) {
                    throw new IllegalArgumentException("An inventory item is required for repair materials.")
                }
                inventoryItem = itemService.itemById(itemDto.item)
                if (inventoryItem == null || inventoryItem.company != company) {
                    throw new IllegalArgumentException("The selected inventory item is not available for this company.")
                }
                if (itemDto.quantity == null || itemDto.quantity <= 0) {
                    throw new IllegalArgumentException("Material quantity must be greater than zero.")
                }
                if (forInsert && itemDto.office == null) {
                    throw new IllegalArgumentException("A source office is required for repair materials.")
                }
            }

            upsert.quantity = itemDto.quantity
            upsert.itemType = itemDto.itemType
            upsert.description = itemDto.description
            upsert.item = inventoryItem
            upsert.basePrice = itemDto.basePrice
            upsert.assetRepairMaintenance = parent
            upsert.company = company
            savedItem = save(upsert)

            if (itemDto.itemType == RepairMaintenanceItemType.MATERIAL) {
                boolean hasLedger = inventoryLedgerService.hasAssetRepairMaintenanceLedger(savedItem.id)
                // Historical rows created before inventory posting are not back-posted
                // unless a source office is explicitly supplied.
                if (forInsert || itemDto.office != null || hasLedger) {
                    InventoryLedger ledger = inventoryLedgerService.upsertAssetRepairMaintenanceLedger(
                            savedItem.id,
                            itemDto.office,
                            inventoryItem,
                            new BigDecimal(itemDto.quantity),
                            itemDto.basePrice
                    )
                    savedItem.basePrice = savedItem.basePrice != null ? savedItem.basePrice : ledger.ledgerUnitCost
                    savedItem = save(savedItem)
                }
            } else if (previousType == RepairMaintenanceItemType.MATERIAL) {
                inventoryLedgerService.voidAssetRepairMaintenanceLedger(savedItem.id)
            }
        }

        return savedItem
    }

    @GraphQLMutation(name = "assetRepairMaintenanceItemDeletedById")
    @Transactional
    AssetRepairMaintenanceItems assetRepairMaintenanceItemDeletedById(
            @GraphQLArgument(name = "id") UUID id
    ){
        if (!id) {
            return null
        }

        UUID company = SecurityUtils.currentCompanyId()
        AssetRepairMaintenanceItems item = findOne(id)
        if (item == null || item.company != company) {
            throw new IllegalArgumentException("Repair/maintenance item was not found.")
        }
        if (item.itemType == RepairMaintenanceItemType.MATERIAL) {
            inventoryLedgerService.voidAssetRepairMaintenanceLedger(item.id)
        }
        delete(item)
        return item
    }

}
