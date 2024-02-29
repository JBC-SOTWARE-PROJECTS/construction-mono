package com.backend.gbp.graphqlservices.assets

import com.backend.gbp.domain.assets.AssetMaintenanceTypes
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

@Component
@GraphQLApi
@TypeChecked
class RentalRatesService extends AbstractDaoService<RentalRates> {
    RentalRatesService() {
        super(RentalRates.class)
    }

    @GraphQLMutation(name = "upsertRentalRates")
    @Transactional
    RentalRates upsertRentalRates(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ){
        def company = SecurityUtils.currentCompanyId()
        def project = upsertFromMap(id, fields, { RentalRates entity, boolean forInsert ->
            entity.company = company
        })

        return project
    }

    @GraphQLQuery(name = "rentalRateListByAssetPageable")
    Page<RentalRates> rentalRateListByAssetPageable(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ) {

        String query = '''Select p from RentalRates p where p.asset.id = :id AND
						lower(concat(p.rentType,p.description)) like lower(concat('%',:filter,'%'))'''

        String countQuery = '''Select count(p) from RentalRates p where p.asset.id = :id AND
							lower(concat(p.rentType,p.description)) like lower(concat('%',:filter,'%'))'''

        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        params.put('id', id)

        query += ''' ORDER BY p.description DESC'''

        Page<RentalRates> result = getPageable(query, countQuery, page, size, params)
        return result
    }
}
