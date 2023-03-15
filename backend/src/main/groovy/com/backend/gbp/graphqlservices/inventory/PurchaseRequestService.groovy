package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.domain.inventory.PurchaseRequest
import com.backend.gbp.domain.inventory.PurchaseRequestItem
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.rest.dto.PurchaseDto
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
import java.time.Instant
import java.time.LocalDateTime

@Component
@GraphQLApi
@TypeChecked
class PurchaseRequestService extends AbstractDaoService<PurchaseRequest> {

    PurchaseRequestService() {
        super(PurchaseRequest.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService

    @Autowired
    PurchaseRequestItemService purchaseRequestItemService


    @GraphQLQuery(name = "prById")
    PurchaseRequest prById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            findOne(id)
        }else{
            null
        }
    }


    @GraphQLQuery(name = "prByFiltersPage")
	Page<PurchaseRequest> prByFiltersPage(
			@GraphQLArgument(name = "filter") String filter,
			@GraphQLArgument(name = "office") UUID office,
			@GraphQLArgument(name = "page") Integer page,
			@GraphQLArgument(name = "size") Integer size
	) {


		String query = '''Select pr from PurchaseRequest pr where
						(lower(pr.prNo) like lower(concat('%',:filter,'%')))
						and pr.requestingOffice.id = :office'''

		String countQuery = '''Select count(pr) from PurchaseRequest pr where
						(lower(pr.prNo) like lower(concat('%',:filter,'%')))
						and pr.requestingOffice.id = :office'''

		Map<String, Object> params = new HashMap<>()
		params.put('filter', filter)
        params.put('office', office)


		query += ''' ORDER BY pr.prNo DESC'''

		Page<PurchaseRequest> result = getPageable(query, countQuery, page, size, params)
		return result
	}

    @GraphQLQuery(name = "prItemNoPo")
    List<PurchaseRequest> prItemNoPo() {
        String query = '''SELECT DISTINCT pi.purchaseRequest from PurchaseRequestItem pi where pi.purchaseRequest.isApprove = :status and pi.refPo is null'''
        Map<String, Object> params = new HashMap<>()
        params.put('status', true)
        createQuery(query, params).resultList.sort { it.prNo }
    }

    // ============== Mutation =======================//
    @Transactional
    @GraphQLMutation(name = "upsertPR")
    PurchaseRequest upsertPR(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "items") ArrayList<Map<String, Object>> items,
            @GraphQLArgument(name = "id") UUID id
    ) {
        def pr = upsertFromMap(id, fields, { PurchaseRequest entity , boolean forInsert ->
            if(forInsert){
                entity.prNo = generatorService.getNextValue(GeneratorType.PR_NO, {
                    return "PR-" + StringUtils.leftPad(it.toString(), 6, "0")
                })
                entity.prDateRequested = Instant.now()
                entity.status = "FOR APPROVAL"
            }
        })
        //items
        def prItems = items as ArrayList<PurchaseDto>
        prItems.each {
            def item = objectMapper.convertValue(it.item, Item.class)
            def con = objectMapper.convertValue(it, PurchaseDto.class)
            purchaseRequestItemService.upsertPRItem(con, item, pr)
        }
        return pr
    }

    @Transactional
    @GraphQLMutation(name = "updatePRStatus")
    PurchaseRequest updatePRStatus(
            @GraphQLArgument(name = "status") Boolean status,
            @GraphQLArgument(name = "id") UUID id
    ) {
        def upsert = findOne(id)
        upsert.isApprove = status
        upsert.status = status ? "APPROVED" : "FOR APPROVAL"
        save(upsert)
    }
}
