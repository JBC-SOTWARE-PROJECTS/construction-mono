package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.domain.inventory.PurchaseOrder
import com.backend.gbp.domain.inventory.PurchaseRequestItem
import com.backend.gbp.domain.inventory.ReturnSupplier
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.rest.dto.PurchaseRtsDto
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
class ReturnSupplierService extends AbstractDaoService<ReturnSupplier> {

    ReturnSupplierService() {
        super(ReturnSupplier.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService

    @Autowired
    ReturnSupplierItemsService returnSupplierItemsService

    @Autowired
    InventoryLedgerService inventoryLedgerService


    @GraphQLQuery(name = "rtsById")
    ReturnSupplier rtsById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            findOne(id)
        }else{
            null
        }
    }


    @GraphQLQuery(name = "rtsByFiltersPage")
	Page<ReturnSupplier> rtsByFiltersPage(
			@GraphQLArgument(name = "filter") String filter,
			@GraphQLArgument(name = "office") UUID office,
			@GraphQLArgument(name = "page") Integer page,
			@GraphQLArgument(name = "size") Integer size
	) {


		String query = '''Select po from ReturnSupplier po where
						(lower(po.rtsNo) like lower(concat('%',:filter,'%')) or
						lower(po.receivedRefNo) like lower(concat('%',:filter,'%')))
						and po.office.id = :office'''

		String countQuery = '''Select count(po) from ReturnSupplier po where
						(lower(po.rtsNo) like lower(concat('%',:filter,'%')) or
						lower(po.receivedRefNo) like lower(concat('%',:filter,'%')))
						and po.office.id = :office'''

		Map<String, Object> params = new HashMap<>()
		params.put('filter', filter)
        params.put('office', office)


		query += ''' ORDER BY po.rtsNo DESC'''

		Page<ReturnSupplier> result = getPageable(query, countQuery, page, size, params)
		return result
	}

    // ============== Mutation =======================//
    @Transactional
    @GraphQLMutation(name = "upsertRTS")
    ReturnSupplier upsertRTS(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "items") ArrayList<Map<String, Object>> items,
            @GraphQLArgument(name = "id") UUID id
    ) {
        ReturnSupplier rts = upsertFromMap(id, fields, { ReturnSupplier entity , boolean forInsert ->
            if(forInsert){
                entity.rtsNo = generatorService.getNextValue(GeneratorType.RET_SUP, {
                    return "RTS-" + StringUtils.leftPad(it.toString(), 6, "0")
                })
                entity.isPosted = false
                entity.isVoid = false
            }
        })
//        items to be inserted
        def rtsItems = items as ArrayList<PurchaseRtsDto>
        rtsItems.each {
            def item = objectMapper.convertValue(it.item, Item.class)
            def con = objectMapper.convertValue(it, PurchaseRtsDto.class)
            returnSupplierItemsService.upsertRtsItem(con, item, rts)
        }

        return rts
    }

    @Transactional
    @GraphQLMutation(name = "updateRTSStatus")
    ReturnSupplier updateRTSStatus(
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
            inventoryLedgerService.voidLedgerByRef(upsert.rtsNo)
            //rts items
            def rtsItems = returnSupplierItemsService.rtsItemByParent(id)
            rtsItems.each {
                returnSupplierItemsService.updateRtsItemStatus(it.id, status)
            }
        }

        save(upsert)
    }
}
