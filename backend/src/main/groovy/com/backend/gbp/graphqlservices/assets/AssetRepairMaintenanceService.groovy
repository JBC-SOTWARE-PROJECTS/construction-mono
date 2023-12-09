package com.backend.gbp.graphqlservices.assets


import com.backend.gbp.domain.assets.AssetPreventiveMaintenance
import com.backend.gbp.domain.assets.AssetRepairMaintenance
import com.backend.gbp.domain.assets.Assets
import com.backend.gbp.domain.assets.enums.AssetStatus
import com.backend.gbp.domain.assets.enums.AssetType
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.security.SecurityUtils
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.data.domain.Page
import org.springframework.stereotype.Component

import javax.transaction.Transactional

@Component
@GraphQLApi
@TypeChecked
class AssetRepairMaintenanceService extends AbstractDaoService<AssetRepairMaintenance> {
    AssetRepairMaintenanceService() {
        super(AssetRepairMaintenance.class)
    }

    @GraphQLQuery(name = "assetRepairMaintenanceById")
    AssetRepairMaintenance assetRepairMaintenanceById(
            @GraphQLArgument(name = "id") UUID id
    ){
        if(id){
            findOne(id)
        }else{
            null
        }
    }

    @GraphQLQuery(name = "findAllAssetRepairMaintenance")
    List<AssetRepairMaintenance> findAllAssetRepairMaintenance(){
       return findAll()
    }

    @GraphQLQuery(name = "assetRepairMaintenanceListPageable")
    Page<AssetRepairMaintenance> assetRepairMaintenanceListPageable(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ) {

        String query = '''Select p from AssetRepairMaintenance p where
						lower(concat(p.serviceType,p.serviceClassification,p.workDescription)) like lower(concat('%',:filter,'%'))'''

        String countQuery = '''Select count(p) from AssetRepairMaintenance p where
							lower(concat(p.serviceType,p.serviceClassification,p.workDescription)) like lower(concat('%',:filter,'%'))'''

        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)



        query += ''' ORDER BY p.serviceDatetimeStart DESC'''

        Page<AssetRepairMaintenance> result = getPageable(query, countQuery, page, size, params)
        return result
    }



    // ============== Mutation =======================//
    @GraphQLMutation(name = "upsertAssetRepairMaintenance")
    @Transactional
    AssetRepairMaintenance upsertAssetRepairMaintenance(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ){
        def company = SecurityUtils.currentCompanyId();
        def project = upsertFromMap(id, fields, { AssetRepairMaintenance entity, boolean forInsert ->
            entity.company = company
        })

        return project
    }




}
