package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.domain.inventory.MaterialProduction
import com.backend.gbp.domain.inventory.StockIssue
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.rest.dto.PurchaseIssuanceDto
import com.backend.gbp.rest.dto.PurchaseMPDto
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
class MaterialProductionService extends AbstractDaoService<MaterialProduction> {

    MaterialProductionService() {
        super(MaterialProduction.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService

    @Autowired
    MaterialProductionItemsService materialProductionItemsService

    @Autowired
    InventoryLedgerService inventoryLedgerService


    @GraphQLQuery(name = "mpById")
    MaterialProduction mpById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            findOne(id)
        }else{
            null
        }
    }


    @GraphQLQuery(name = "mpByFiltersPage")
	Page<MaterialProduction> mpByFiltersPage(
			@GraphQLArgument(name = "filter") String filter,
			@GraphQLArgument(name = "office") UUID office,
			@GraphQLArgument(name = "page") Integer page,
			@GraphQLArgument(name = "size") Integer size
	) {

		String query = '''Select po from MaterialProduction po where
						(lower(po.mpNo) like lower(concat('%',:filter,'%')) or
						lower(po.description) like lower(concat('%',:filter,'%')))
						and po.office.id = :office'''

		String countQuery = '''Select count(po) from MaterialProduction po where
						(lower(po.mpNo) like lower(concat('%',:filter,'%')) or
						lower(po.description) like lower(concat('%',:filter,'%')))
						and po.office.id = :office'''

		Map<String, Object> params = new HashMap<>()
		params.put('filter', filter)
        params.put('office', office)


		query += ''' ORDER BY po.mpNo DESC'''

		Page<MaterialProduction> result = getPageable(query, countQuery, page, size, params)
		return result
	}

    // ============== Mutation =======================//
    @Transactional
    @GraphQLMutation(name = "upsertMP")
    MaterialProduction upsertMP(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "items") ArrayList<Map<String, Object>> items,
            @GraphQLArgument(name = "id") UUID id
    ) {
        MaterialProduction mp = upsertFromMap(id, fields, { MaterialProduction entity , boolean forInsert ->
            if(forInsert){
                entity.mpNo = generatorService.getNextValue(GeneratorType.MP_NO, {
                    return "MP-" + StringUtils.leftPad(it.toString(), 6, "0")
                })
                entity.isPosted = false
                entity.isVoid = false
            }
        })
//        items to be inserted
        def stiItems = items as ArrayList<PurchaseMPDto>
        stiItems.each {
            def item = objectMapper.convertValue(it.item, Item.class)
            def con = objectMapper.convertValue(it, PurchaseMPDto.class)
            materialProductionItemsService.upsertMpItem(con, item, mp)
        }

        return mp
    }

    @Transactional
    @GraphQLMutation(name = "updateMPStatus")
    MaterialProduction updateMPStatus(
            @GraphQLArgument(name = "status") Boolean status,
            @GraphQLArgument(name = "id") UUID id
    ) {
        def upsert = findOne(id)
        upsert.isPosted = status

        //do some magic here ...
        //update ledger
        if(!status){
            upsert.isVoid = status
            //ledger void
            inventoryLedgerService.voidLedgerByRef(upsert.mpNo)
            //mp items
            def mpItems = materialProductionItemsService.mpItemByParent(id)
            mpItems.each {
                materialProductionItemsService.updateMpItemStatus(it.id, status)
            }
        }

        save(upsert)
    }
}
