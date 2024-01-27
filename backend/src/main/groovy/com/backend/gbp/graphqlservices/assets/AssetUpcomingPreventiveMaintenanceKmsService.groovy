package com.backend.gbp.graphqlservices.assets


import com.backend.gbp.domain.assets.AssetUpcomingPreventiveMaintenance
import com.backend.gbp.domain.assets.AssetUpcomingPreventiveMaintenanceKms
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.data.domain.Page
import org.springframework.stereotype.Component

@Component
@GraphQLApi
@TypeChecked
class AssetUpcomingPreventiveMaintenanceKmsService extends AbstractDaoService<AssetUpcomingPreventiveMaintenanceKms> {
    AssetUpcomingPreventiveMaintenanceKmsService() {
        super(AssetUpcomingPreventiveMaintenanceKms.class)
    }


    @GraphQLQuery(name = "upcomingMaintenanceKms")
    Page<AssetUpcomingPreventiveMaintenanceKms> upcomingMaintenanceKms(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ) {
        String query = '''
                SELECT p
                FROM AssetUpcomingPreventiveMaintenanceKms p
                WHERE lower(concat(p.scheduleType,  p.assetMaintenanceType.description, p.assetMaintenanceType.name , p.asset.item.descLong)) like lower(concat('%',:filter,'%'))
             ''';

        String countQuery = '''
                SELECT count(p)
                FROM AssetUpcomingPreventiveMaintenanceKms p
                WHERE lower(concat(p.scheduleType,  p.assetMaintenanceType.description, p.assetMaintenanceType.name, p.asset.item.descLong )) like lower(concat('%',:filter,'%'))
            ''';

        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)

        query += ''' ORDER BY p.latestUsage ASC'''

        Page<AssetUpcomingPreventiveMaintenanceKms> result = getPageable(query, countQuery, page, size, params)
        return result;


    }







}
