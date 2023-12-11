package com.backend.gbp.graphqlservices.fixed_asset

import com.backend.gbp.domain.fixed_asset.FixedAssetItems
import com.backend.gbp.graphqlservices.base.AbstractDaoCompanyService
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.security.SecurityUtils
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.GeneratorType
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.stereotype.Service

import javax.transaction.Transactional

@Service
@GraphQLApi
@Transactional(rollbackOn = Exception.class)
class FixedAssetItemsService extends AbstractDaoCompanyService<FixedAssetItems> {
    FixedAssetItemsService(){
        super(FixedAssetItems.class)
    }

    @Autowired
    GeneratorService generatorService

    @Transactional
    @GraphQLMutation(name='upsertFixedAssetItems')
    GraphQLResVal<FixedAssetItems> upsertFixedAssetItems(
            @GraphQLArgument(name='id') UUID id,
            @GraphQLArgument(name='fields') Map<String,Object> fields
    ){
        def fixeAssetItem = upsertFromMap(id,fields, { fa, isInsert ->
                if(isInsert){
                    fa.assetNo = generatorService.getNextValue(GeneratorType.FIXED_ASSET_ITEMS) {
                        it -> return "FA-${StringUtils.leftPad(it.toString(), 6, "0")}"
                    }
                }
            }
        )
        return  new GraphQLResVal<FixedAssetItems>(fixeAssetItem,true,'Successfully saved.')
    }

    @Transactional
    @GraphQLMutation(name='upsertMultiFixedAssetItems')
    GraphQLResVal<Boolean> upsertMultiFixedAssetItems(
            @GraphQLArgument(name='fields') List<Map<String,Object>> fields
    ){
        if(fields) {
            fields.each {
                field ->
                upsertFromMap(null,field, { fa, isInsert ->
                        fa.assetNo = generatorService.getNextValue(GeneratorType.FIXED_ASSET_ITEMS) {
                            it -> return "FA-${StringUtils.leftPad(it.toString(), 6, "0")}"
                        }
                    }
                )
            }
        }
        return  new GraphQLResVal<FixedAssetItems>(true,true,'Successfully saved.')
    }


    @GraphQLQuery(name='getFixedAssetPageable')
    Page<FixedAssetItems> getFixedAssetPageable(
            @GraphQLArgument(name='filter') String filter,
            @GraphQLArgument(name='page') Integer page,
            @GraphQLArgument(name='size') Integer size
    ){
        def companyId = SecurityUtils.currentCompanyId()
        Map<String,Object> params = [:]
        params['companyId'] = companyId
        params['filter'] = filter

        getPageable(
                """ Select f from FixedAssetItems f where f.companyId = :companyId and (upper(f.assetNo) like upper(concat('%',:filter,'%'))) order by f.assetNo desc""",
                """ Select count(f) from FixedAssetItems f where f.companyId = :companyId and (upper(f.assetNo) like upper(concat('%',:filter,'%'))) """,
                page,
                size,
                params
        )
    }
}
