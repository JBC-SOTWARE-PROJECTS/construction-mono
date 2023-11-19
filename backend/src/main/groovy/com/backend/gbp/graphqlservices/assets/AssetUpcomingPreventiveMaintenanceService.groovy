package com.backend.gbp.graphqlservices.assets


import com.backend.gbp.domain.assets.AssetPreventiveMaintenance
import com.backend.gbp.domain.assets.AssetUpcomingPreventiveMaintenance
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
class AssetUpcomingPreventiveMaintenanceService extends AbstractDaoService<AssetUpcomingPreventiveMaintenance> {
    AssetUpcomingPreventiveMaintenanceService() {
        super(AssetUpcomingPreventiveMaintenance.class)
    }


    @GraphQLQuery(name = "upcomingMaintenance")
    Page<AssetUpcomingPreventiveMaintenance> upcomingMaintenance(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ) {
            String query = '''
                SELECT p
                FROM AssetUpcomingPreventiveMaintenance p
                WHERE lower(concat(p.scheduleType,p.occurrenceDate, p.reminderDate, p.assetMaintenanceType.description, p.assetMaintenanceType.name , p.asset.item.descLong)) like lower(concat('%',:filter,'%'))
             ''';

            String countQuery = '''
                SELECT count(p)
                FROM AssetUpcomingPreventiveMaintenance p
                WHERE lower(concat(p.scheduleType,p.occurrenceDate, p.reminderDate, p.assetMaintenanceType.description, p.assetMaintenanceType.name, p.asset.item.descLong )) like lower(concat('%',:filter,'%'))
            ''';

            Map<String, Object> params = new HashMap<>()
            params.put('filter', filter)

            query += ''' ORDER BY p.occurrenceDate DESC'''

            Page<AssetUpcomingPreventiveMaintenance> result = getPageable(query, countQuery, page, size, params)
            return result;


    }







}
