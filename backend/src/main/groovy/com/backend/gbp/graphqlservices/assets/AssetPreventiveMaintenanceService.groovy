package com.backend.gbp.graphqlservices.assets

import com.backend.gbp.domain.assets.AssetPreventiveMaintenance
import com.backend.gbp.domain.assets.Assets
import com.backend.gbp.domain.projects.Projects
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.security.SecurityUtils
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

    @GraphQLQuery(name = "preventiveByAsset")
    List<AssetPreventiveMaintenance> preventiveByAsset(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            String query = '''Select e from AssetPreventiveMaintenance e where e.asset.id = :id'''
            Map<String, Object> params = new HashMap<>()
            params.put('id', id)
            createQuery(query, params).resultList.sort { it.scheduleType }
        }else{
            return null
        }

    }


    // ============== Mutation =======================//
    @GraphQLMutation(name = "upsertAssetPreventiveMaintenance")
    @Transactional
    AssetPreventiveMaintenance upsertAssetPreventiveMaintenance(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ){
        def company = SecurityUtils.currentCompanyId();
        def project = upsertFromMap(id, fields, { AssetPreventiveMaintenance entity, boolean forInsert ->
            entity.company = company
        })

        return project
    }




}
