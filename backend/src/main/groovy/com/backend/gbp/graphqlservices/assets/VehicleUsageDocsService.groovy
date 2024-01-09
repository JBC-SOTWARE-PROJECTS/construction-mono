package com.backend.gbp.graphqlservices.assets

import com.backend.gbp.domain.assets.AssetMaintenanceTypes
import com.backend.gbp.domain.assets.VehicleUsageDocs
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
class VehicleUsageDocsService extends AbstractDaoService<VehicleUsageDocs> {
    VehicleUsageDocsService() {
        super(VehicleUsageDocs.class)
    }

    @GraphQLMutation(name = "upsertVehicleUsageDocs")
    @Transactional
    VehicleUsageDocs upsertVehicleUsageDocs(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ){
        def company = SecurityUtils.currentCompanyId()
        def data = upsertFromMap(id, fields, { VehicleUsageDocs entity, boolean forInsert ->
            entity.company = company
        })

        return data
    }

    @GraphQLQuery(name = "vehicleUsageDocsListPageable")
    Page<VehicleUsageDocs> vehicleUsageDocsListPageable(
            @GraphQLArgument(name = "vehicleUsageId") UUID vehicleUsageId,
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size

    ) {

        String query = '''Select p from VehicleUsageDocs p where p.vehicleUsage.id = :vehicleUsageId '''

        String countQuery = '''Select count(p) from VehicleUsageDocs p where p.vehicleUsage.id = :vehicleUsageId '''

        Map<String, Object> params = new HashMap<>()
      //  params.put('filter', filter)
        params.put('vehicleUsageId', vehicleUsageId)

       // query += ''' ORDER BY p.description DESC'''

        Page<VehicleUsageDocs> result = getPageable(query, countQuery, page, size, params)
        return result
    }
}
