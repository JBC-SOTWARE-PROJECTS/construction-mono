package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.domain.inventory.ReturnSupplier
import com.backend.gbp.domain.inventory.StockIssue
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.projects.ProjectMaterialService
import com.backend.gbp.rest.dto.PurchaseIssuanceDto
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
class StockIssuanceService extends AbstractDaoService<StockIssue> {

    StockIssuanceService() {
        super(StockIssue.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService

    @Autowired
    StockIssueItemsService stockIssueItemsService

    @Autowired
    InventoryLedgerService inventoryLedgerService

    @Autowired
    ProjectMaterialService projectMaterialService


    @GraphQLQuery(name = "stiById")
    StockIssue stiById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            findOne(id)
        }else{
            null
        }
    }


    @GraphQLQuery(name = "stiByFiltersPage")
	Page<StockIssue> stiByFiltersPage(
			@GraphQLArgument(name = "filter") String filter,
			@GraphQLArgument(name = "office") UUID office,
			@GraphQLArgument(name = "page") Integer page,
			@GraphQLArgument(name = "size") Integer size
	) {


		String query = '''Select po from StockIssue po where
						(lower(po.issueNo) like lower(concat('%',:filter,'%')))
						and po.issueFrom.id = :office'''

		String countQuery = '''Select count(po) from StockIssue po where
						(lower(po.issueNo) like lower(concat('%',:filter,'%')))
						and po.issueFrom.id = :office'''

		Map<String, Object> params = new HashMap<>()
		params.put('filter', filter)
        params.put('office', office)


		query += ''' ORDER BY po.issueNo DESC'''

		Page<StockIssue> result = getPageable(query, countQuery, page, size, params)
		return result
	}

    // ============== Mutation =======================//
    @Transactional
    @GraphQLMutation(name = "upsertSTI")
    StockIssue upsertSTI(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "items") ArrayList<Map<String, Object>> items,
            @GraphQLArgument(name = "id") UUID id
    ) {
        StockIssue sti = upsertFromMap(id, fields, { StockIssue entity , boolean forInsert ->
            if(forInsert){
                entity.issueNo = generatorService.getNextValue(GeneratorType.ISSUE_NO, {
                    return "STI-" + StringUtils.leftPad(it.toString(), 6, "0")
                })
                entity.isPosted = false
                entity.isCancel = false
            }
        })
//        items to be inserted
        def stiItems = items as ArrayList<PurchaseIssuanceDto>
        stiItems.each {
            def item = objectMapper.convertValue(it.item, Item.class)
            def con = objectMapper.convertValue(it, PurchaseIssuanceDto.class)
            stockIssueItemsService.upsertStiItem(con, item, sti)
        }

        return sti
    }

    @Transactional
    @GraphQLMutation(name = "updateSTIStatus")
    StockIssue updateSTIStatus(
            @GraphQLArgument(name = "status") Boolean status,
            @GraphQLArgument(name = "id") UUID id
    ) {
        def upsert = findOne(id)
        upsert.isPosted = status

        //do some magic here ...

        //update ledger
        if(!status){
            upsert.isCancel = status
            //ledger void
            inventoryLedgerService.voidLedgerByRef(upsert.issueNo)
            //rts items
            def stiItems = stockIssueItemsService.stiItemByParent(id)
            stiItems.each {
                stockIssueItemsService.updateStiItemStatus(it.id, status)
            }
            //delete materials
//            if(upsert.project){
//                projectMaterialService.deleteMaterials(upsert.id)
//            }
        }

//        else{ //post
//            if(upsert.project){
//                //save materials
//                def items = stockIssueItemsService.stiItemByParent(id)
//                items.each {
//                    projectMaterialService.upsertMaterialsAuto(
//                            upsert.project,
//                            upsert.id,
//                            upsert.issueNo,
//                            it.item,
//                            it.issueQty,
//                            it.unitCost,
//                    )
//                }
//            }
//        }

        save(upsert)
    }
}
