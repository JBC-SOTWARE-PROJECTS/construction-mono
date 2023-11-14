package com.backend.gbp.graphqlservices.assets

import com.backend.gbp.domain.assets.AssetMaintenanceTypes
import com.backend.gbp.domain.assets.AssetPreventiveMaintenance
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
        def company = SecurityUtils.currentCompanyId()
        def project = upsertFromMap(id, fields, { AssetMaintenanceTypes entity, boolean forInsert ->
            entity.company = company
        })

        return project
    }

    @GraphQLQuery(name = "assetMaintenanceTypeListPageable")
    Page<AssetMaintenanceTypes> assetMaintenanceTypeListPageable(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ) {

        String query = '''Select p from AssetMaintenanceTypes p where
						lower(concat(p.name,p.description)) like lower(concat('%',:filter,'%'))'''

        String countQuery = '''Select count(p) from AssetMaintenanceTypes p where
							lower(concat(p.name,p.description)) like lower(concat('%',:filter,'%'))'''

        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)

        query += ''' ORDER BY p.name DESC'''

        Page<AssetMaintenanceTypes> result = getPageable(query, countQuery, page, size, params)
        return result
    }
}
