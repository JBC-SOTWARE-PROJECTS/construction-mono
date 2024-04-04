package com.backend.gbp.graphqlservices.assets

import com.backend.gbp.domain.assets.AssetVehicleUsageAccumulation
import com.backend.gbp.domain.assets.RentalRates
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
import java.time.Instant

@Component
@GraphQLApi
@TypeChecked
class AssetVehUsageAccService extends AbstractDaoService<AssetVehicleUsageAccumulation> {
    AssetVehUsageAccService() {
        super(AssetVehicleUsageAccumulation.class)
    }



    @GraphQLQuery(name = "AssetVehicleUsageAccumulationPageable")
    Page<AssetVehicleUsageAccumulation> assetVehicleUsageAccumulationPageable(
            @GraphQLArgument(name = "startDate") Instant startDate,
            @GraphQLArgument(name = "endDate") Instant endDate,
            @GraphQLArgument(name = "asset") UUID asset,
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ) {

        String query = '''Select p from AssetVehicleUsageAccumulation p where p.asset.id = :asset AND
						lower(concat(p.asset.description)) like lower(concat('%',:filter,'%')) 
						 AND p.dateOfUsage >= :startDate
                         AND p.dateOfUsage <= :endDate
						'''

        String countQuery = '''Select count(p) from AssetVehicleUsageAccumulation p where p.asset.id = :asset AND
							lower(concat(p.asset.description)) like lower(concat('%',:filter,'%'))
							 AND p.dateOfUsage >= :startDate
                             AND p.dateOfUsage <= :endDate
							'''

        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        params.put('asset', asset)
        params.put('startDate', startDate)
        params.put('endDate', endDate)

        query += ''' ORDER BY p.dateOfUsage DESC'''

        Page<AssetVehicleUsageAccumulation> result = getPageable(query, countQuery, page, size, params)
        return result
    }
}
