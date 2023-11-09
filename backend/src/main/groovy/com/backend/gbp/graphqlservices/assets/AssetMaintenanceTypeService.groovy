package com.backend.gbp.graphqlservices.assets

import com.backend.gbp.domain.assets.AssetMaintenanceTypes
import com.backend.gbp.domain.assets.AssetPreventiveMaintenance
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.stereotype.Component

import javax.transaction.Transactional

@Component
@GraphQLApi
@TypeChecked
class AssetMaintenanceTypeService extends AbstractDaoService<AssetMaintenanceTypes> {
    AssetMaintenanceTypeService() {
        super(AssetMaintenanceTypes.class)
    }

    @GraphQLMutation(name = "upsertAssetMaintenanceType")
    @Transactional
    AssetMaintenanceTypes upsertAssetMaintenanceType(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ){
        def project = upsertFromMap(id, fields, { AssetMaintenanceTypes entity, boolean forInsert ->

        })

        return project
    }
}
