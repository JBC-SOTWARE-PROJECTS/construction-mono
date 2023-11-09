package com.backend.gbp.graphqlservices.assets

import com.backend.gbp.domain.assets.AssetPreventiveMaintenance
import com.backend.gbp.domain.assets.Assets
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.stereotype.Component

import javax.transaction.Transactional

@Component
@GraphQLApi
@TypeChecked
class AssetPreventiveMaintenanceService extends AbstractDaoService<AssetPreventiveMaintenance> {
    AssetPreventiveMaintenanceService() {
        super(AssetPreventiveMaintenance.class)
    }

    @GraphQLQuery(name = "assetPreventiveMaintenanceById")
    AssetPreventiveMaintenance assetPreventiveMaintenanceById(
            @GraphQLArgument(name = "id") UUID id
    ){
        if(id){
            findOne(id)
        }else{
            null
        }
    }

    @GraphQLQuery(name = "findAllAssetPreventiveMaintenance")
    List<AssetPreventiveMaintenance> findAllAssetPreventiveMaintenance(){
       return findAll()
    }


    // ============== Mutation =======================//
    @GraphQLMutation(name = "upsertAssetPreventiveMaintenance")
    @Transactional
    AssetPreventiveMaintenance upsertAssetPreventiveMaintenance(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ){
        def project = upsertFromMap(id, fields, { AssetPreventiveMaintenance entity, boolean forInsert ->
            if(forInsert){

            }
        })

        return project
    }




}
