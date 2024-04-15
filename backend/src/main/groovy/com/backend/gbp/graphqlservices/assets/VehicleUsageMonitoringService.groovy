package com.backend.gbp.graphqlservices.assets

import com.backend.gbp.domain.assets.AssetMaintenanceTypes
import com.backend.gbp.domain.assets.VehicleUsageMonitoring
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.repository.asset.VehicleUsageRepository
import com.backend.gbp.security.SecurityUtils
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
class VehicleUsageMonitoringService extends AbstractDaoService<VehicleUsageMonitoring> {
    VehicleUsageMonitoringService() {
        super(VehicleUsageMonitoring.class)
    }

    @Autowired
    VehicleUsageRepository vehicleUsageRepository

    @GraphQLMutation(name = "upsertVehicleUsageMonitoring")
    @Transactional
    VehicleUsageMonitoring upserVehicleUsageMonitoring(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ){
        def company = SecurityUtils.currentCompanyId()
        def project = upsertFromMap(id, fields, { VehicleUsageMonitoring entity, boolean forInsert ->
            entity.company = company
        })

        return project
    }

    @GraphQLQuery(name = "vehicleUsageMonitoringPageable")
    Page<VehicleUsageMonitoring> vehicleUsageMonitoringListPageable(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size,
            @GraphQLArgument(name = "asset") UUID asset
    ) {

        String query = '''Select p from VehicleUsageMonitoring p where p.asset.id = :asset AND
						lower(concat(p.usagePurpose,p.route)) like lower(concat('%',:filter,'%'))'''

        String countQuery = '''Select count(p) from VehicleUsageMonitoring p where p.asset.id = :asset AND
							lower(concat(p.usagePurpose,p.route)) like lower(concat('%',:filter,'%'))'''

        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        params.put('asset', asset)

        query += ''' ORDER BY p.startDatetime DESC'''

        Page<VehicleUsageMonitoring> result = getPageable(query, countQuery, page, size, params)
        return result
    }

    @GraphQLQuery(name = "vehicleUsageMonitoringLatest")
    VehicleUsageMonitoring vehicleUsageMonitoringLatest(
            @GraphQLArgument(name = "asset") UUID asset
    ) {

        List<VehicleUsageMonitoring> vehList = vehicleUsageRepository.findByAsset(asset);

        VehicleUsageMonitoring result = vehList[0]
        return result
    }
}
