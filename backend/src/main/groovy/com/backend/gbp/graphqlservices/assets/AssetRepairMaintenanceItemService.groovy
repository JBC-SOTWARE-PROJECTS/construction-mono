package com.backend.gbp.graphqlservices.assets


import com.backend.gbp.domain.assets.AssetRepairMaintenanceItems
import com.backend.gbp.domain.inventory.MaterialProductionItem
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.hrm.EmployeeService
import com.backend.gbp.graphqlservices.inventory.ItemService
import com.backend.gbp.rest.dto.AssetRepairMaintenanceItemDto
import com.backend.gbp.rest.dto.PurchaseMPDto
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
    ObjectMapper objectMapper

    @GraphQLQuery(name = "assetRepairMaintenanceItemById")
    AssetRepairMaintenanceItems assetRepairMaintenanceById(
            @GraphQLArgument(name = "id") UUID id
    ){
        if(id){
            findOne(id)
        }else{
            null
        }
    }



    @GraphQLQuery(name = "findAllAssetRepairMaintenanceItems")
    List<AssetRepairMaintenanceItems> findAllAssetRepairMaintenanceItem(){
       return findAll()
    }

    @GraphQLQuery(name = "assetRepairMaintenanceItemListPageable")
    Page<AssetRepairMaintenanceItems> assetRepairMaintenanceItemListPageable(
            @GraphQLArgument(name = "rmId") UUID rmId,
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ) {


        String query = '''Select p from AssetRepairMaintenanceItems p where p.assetRepairMaintenance.id = :rmId '''

        String countQuery = '''Select count(p) from AssetRepairMaintenanceItems p where p.assetRepairMaintenance.id = :rmId '''

        Map<String, Object> params = new HashMap<>()
        params.put('rmId', rmId)
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

        def company = SecurityUtils.currentCompanyId();
        def project = upsertFromMap(id, fields, { AssetRepairMaintenanceItems entity, boolean forInsert ->
            entity.company = company
        })

        return project
    }

    @GraphQLMutation(name = "upsertMPAssetRepairMaintenanceItem")
    @Transactional
    AssetRepairMaintenanceItems upsertMPAssetRepairMaintenanceItem(
            @GraphQLArgument(name = "items") ArrayList<Map<String, Object>> items
    ){

        def company = SecurityUtils.currentCompanyId();

        def project = new AssetRepairMaintenanceItems();

        def armItems = items
        try{
            armItems.each {
                def item = objectMapper.convertValue(it, AssetRepairMaintenanceItemDto.class)

                def upsert = new AssetRepairMaintenanceItems()
                if(item.id != null){
                    upsert = findOne(item.id)
                }
                upsert.quantity = item.quantity
                upsert.itemType = item.itemType
                upsert.description = item.description
                upsert.item = itemService.itemById(item.item)
                upsert.basePrice = item.basePrice
                upsert.assetRepairMaintenance = assetRepairMaintenanceService.assetRepairMaintenanceById(item.assetRepairMaintenance)
                upsert.company = company

                project=  save(upsert)
            }
        }catch( Exception e){
            throw new Exception("Something was Wrong : " + e)
        }


        return project
    }

    @GraphQLMutation(name = "assetRepairMaintenanceItemDeletedById")
    @Transactional
    AssetRepairMaintenanceItems assetRepairMaintenanceItemDeletedById(
            @GraphQLArgument(name = "id") UUID id
    ){
        if(id){
            deleteById(id)
        }else{
            null
        }
    }





}
