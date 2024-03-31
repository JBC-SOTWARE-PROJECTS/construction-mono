package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.domain.inventory.PurchaseRequest
import com.backend.gbp.domain.inventory.PurchaseRequestItem
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.rest.dto.PurchaseDto
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

    @GraphQLQuery(name = "prByPrNo")
    PurchaseRequest prByPrNo(
            @GraphQLArgument(name = "prNo") String prNo
    ) {
        if(prNo){
            String query = '''SELECT pr from PurchaseRequest pr where pr.prNo = :prNo '''
            Map<String, Object> params = new HashMap<>()
            params.put('prNo', prNo)
            createQuery(query, params).resultList.find()
        }else{
            null
        }
    }


    @GraphQLQuery(name = "prByFiltersPage")
	Page<PurchaseRequest> prByFiltersPage(
			@GraphQLArgument(name = "filter") String filter,
			@GraphQLArgument(name = "office") UUID office,
            @GraphQLArgument(name = "start") String start,
            @GraphQLArgument(name = "end") String end,
			@GraphQLArgument(name = "page") Integer page,
			@GraphQLArgument(name = "size") Integer size
	) {

        def company = SecurityUtils.currentCompanyId()
		String query = '''Select pr from PurchaseRequest pr where
    					(lower(pr.prNo) like lower(concat('%',:filter,'%'))) and to_date(to_char(pr.prDateRequested, 'YYYY-MM-DD'),'YYYY-MM-DD') 
             	        between to_date(:startDate,'YYYY-MM-DD') and  to_date(:endDate,'YYYY-MM-DD')'''



		String countQuery = '''Select count(pr) from PurchaseRequest pr where
						(lower(pr.prNo) like lower(concat('%',:filter,'%')))
						and to_date(to_char(pr.prDateRequested, 'YYYY-MM-DD'),'YYYY-MM-DD')
             	        between to_date(:startDate,'YYYY-MM-DD') and  to_date(:endDate,'YYYY-MM-DD')'''


		Map<String, Object> params = new HashMap<>()
		params.put('filter', filter)
        params.put('startDate', start)
        params.put('endDate', end)

        if(office){
            query += ''' and (pr.requestingOffice.id = :office)''';
            countQuery += ''' and (pr.requestingOffice.id = :office)''';
            params.put('office', office)
        }

        if (company) {
            query += ''' and (pr.company = :company)'''
            countQuery += ''' and (pr.company = :company)'''
            params.put("company", company)
        }


        query += ''' ORDER BY pr.prDateRequested DESC'''

		Page<PurchaseRequest> result = getPageable(query, countQuery, page, size, params)
		return result
	}

    @GraphQLQuery(name = "prByFiltersPageNoDate")
    Page<PurchaseRequest> prByFiltersPageNoDate(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "office") UUID office,
            @GraphQLArgument(name = "category") String category,
            @GraphQLArgument(name = "status") String status,
            @GraphQLArgument(name = "project") UUID project,
            @GraphQLArgument(name = "asset") UUID asset,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ) {

        def company = SecurityUtils.currentCompanyId()
        String query = '''Select pr from PurchaseRequest pr where
    					(lower(pr.prNo) like lower(concat('%',:filter,'%')))'''



        String countQuery = '''Select count(pr) from PurchaseRequest pr where
						(lower(pr.prNo) like lower(concat('%',:filter,'%')))'''


        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)

        if(office){
            query += ''' and (pr.requestingOffice.id = :office)''';
            countQuery += ''' and (pr.requestingOffice.id = :office)''';
            params.put('office', office)
        }
        if(category){
            query += ''' and (pr.category = :category)''';
            countQuery += ''' and (pr.category = :category)''';
            params.put('category', category)
        }
        if(status){
            query += ''' and (pr.status = :status)''';
            countQuery += ''' and (pr.status = :status)''';
            params.put('status', status)
        }
        if(project){
            query += ''' and (pr.project.id = :project)''';
            countQuery += ''' and (pr.project.id = :project)''';
            params.put('project', project)
        }
        if(asset){
            query += ''' and (pr.assets.id = :asset)''';
            countQuery += ''' and (pr.assets.id = :asset)''';
            params.put('asset', asset)
        }
        if (company) {
            query += ''' and (pr.company = :company)'''
            countQuery += ''' and (pr.company = :company)'''
            params.put("company", company)
        }

        query += ''' ORDER BY pr.prDateRequested DESC'''

        Page<PurchaseRequest> result = getPageable(query, countQuery, page, size, params)
        return result
    }

    @GraphQLQuery(name = "prItemNoPo")
    List<PurchaseRequest> prItemNoPo() {
        def company = SecurityUtils.currentCompanyId()
        String query = '''SELECT DISTINCT pi.purchaseRequest from PurchaseRequestItem pi where pi.purchaseRequest.isApprove = :status and pi.refPo is null and pi.purchaseRequest.company = :company'''
        Map<String, Object> params = new HashMap<>()
        params.put('status', true)
        params.put('company', company)
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
        def company = SecurityUtils.currentCompanyId()
        def pr = upsertFromMap(id, fields, { PurchaseRequest entity , boolean forInsert ->
            if(forInsert){
                def code = "PR"
                entity.prDateRequested = Instant.now()
                entity.status = "FOR APPROVAL"
                entity.company = company
                if(entity.project?.id){
                    code = entity.project?.prefixShortName ?: "PJ"
                }else if(entity.assets?.id){
                    code = entity.assets?.prefix ?: "SP"
                }

                entity.prNo = generatorService.getNextValue(GeneratorType.PR_NO, {
                    return "${code}-" + StringUtils.leftPad(it.toString(), 6, "0")
                })
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
        if(status){
            upsert.isApprove = status
            upsert.status = status ? "APPROVED" : "FOR APPROVAL"
            save(upsert)
        }else{
            def items = purchaseRequestItemService.prItemByParent(upsert.id)
            def list =  items.findAll({it.refPo != null})
            if(list.size()){
                return null
            }else{
                upsert.isApprove = status
                upsert.status = status ? "APPROVED" : "FOR APPROVAL"
                save(upsert)
            }
        }

    }
}
