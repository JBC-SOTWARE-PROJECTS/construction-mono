package com.backend.gbp.graphqlservices.assets

import com.backend.gbp.domain.assets.Assets
import com.backend.gbp.domain.assets.enums.AssetStatus
import com.backend.gbp.domain.assets.enums.AssetType
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.projects.ProjectCostService
import com.backend.gbp.security.SecurityUtils
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.GeneratorType
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.stereotype.Component

import javax.transaction.Transactional

@Component
@GraphQLApi
@TypeChecked
class AssetsService extends AbstractDaoService<Assets> {

    AssetsService() {
        super(Assets.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService

    @Autowired
    ProjectCostService projectCostService


    @GraphQLQuery(name = "assetById")
    Assets assetById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            findOne(id)
        }else{
            null
        }
    }


    @GraphQLQuery(name = "assetList")
    List<Assets> assetList(
            @GraphQLArgument(name = "filter") String filter
    ) {
        String query = '''Select e from Assets e where lower(concat(e.assetCode,e.description)) like lower(concat('%',:filter,'%'))'''
        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        createQuery(query, params).resultList.sort { it.assetCode }
    }
    @GraphQLQuery(name = "findAllAssets")
    List<Assets> findAllAssets() {
        findAll()
    }


    @GraphQLQuery(name = "assetListPageable")
    Page<Assets> assetListPageable(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "status") AssetStatus status,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size,
            @GraphQLArgument(name = "type") AssetType type
    ) {

        String query = '''Select p from Assets p where
						lower(concat(p.assetCode,p.description,p.brand, p.item.descLong)) like lower(concat('%',:filter,'%'))'''

        String countQuery = '''Select count(p) from Assets p where
							lower(concat(p.assetCode,p.description,p.brand, p.item.descLong)) like lower(concat('%',:filter,'%'))'''

        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)


        if (status) {
            query += ''' and (p.status = :status)'''
            countQuery += ''' and (p.status = :status)'''
            params.put("status", status)
        }

        if (type) {
            query += ''' and (p.type = :type)'''
            countQuery += ''' and (p.type = :type)'''
            params.put("type", type)
        }

        query += ''' ORDER BY p.assetCode DESC'''

        Page<Assets> result = getPageable(query, countQuery, page, size, params)
        return result
    }

    // ============== Mutation =======================//
    @GraphQLMutation(name = "upsertAsset")
    @Transactional
    Assets upsertAsset(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ) {
        def company = SecurityUtils.currentCompanyId()
        def project = upsertFromMap(id, fields, { Assets entity, boolean forInsert ->
            if(forInsert){
                entity.assetCode = generatorService.getNextValue(GeneratorType.ASSET_CODE, {
                    return "AT-" + StringUtils.leftPad(it.toString(), 6, "0")
                })
                entity.company = company
            }
        })

        return project
    }

}
