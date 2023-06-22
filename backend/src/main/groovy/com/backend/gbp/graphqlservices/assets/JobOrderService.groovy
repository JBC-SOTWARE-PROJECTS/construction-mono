package com.backend.gbp.graphqlservices.assets

import com.backend.gbp.domain.assets.Assets
import com.backend.gbp.domain.assets.JobOrder
import com.backend.gbp.domain.billing.Billing
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.projects.ProjectCostService
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.GeneratorType
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLContext
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
class JobOrderService extends AbstractDaoService<JobOrder> {

    JobOrderService() {
        super(JobOrder.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService

    @Autowired
    JobOrderItemService jobOrderItemService

    //start
    @GraphQLQuery(name = "totals", description = "totals")
    BigDecimal balance(@GraphQLContext JobOrder jobOrder) {
        return jobOrderItemService.getTotals(jobOrder.id)
    }
    //end

    @GraphQLQuery(name = "jobOrderById")
    JobOrder jobOrderById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            findOne(id)
        }else{
            null
        }
    }


    @GraphQLQuery(name = "jobOrderList")
    List<JobOrder> jobOrderList(
            @GraphQLArgument(name = "filter") String filter
    ) {
        String query = '''Select e from JobOrder e where lower(concat(e.code,e.description)) like lower(concat('%',:filter,'%'))'''
        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        createQuery(query, params).resultList.sort { it.code }
    }

    @GraphQLQuery(name = "jobOrderListPageable")
    Page<JobOrder> jobOrderListPageable(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "status") String status,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ) {

        String query = '''Select p from JobOrder p where
						lower(concat(p.code,p.description)) like lower(concat('%',:filter,'%'))'''

        String countQuery = '''Select count(p) from JobOrder p where
							lower(concat(p.code,p.description)) like lower(concat('%',:filter,'%'))'''

        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)


        if (status) {
            query += ''' and (p.status = :status)'''
            countQuery += ''' and (p.status = :status)'''
            params.put("status", status)
        }

        query += ''' ORDER BY p.code DESC'''

        Page<JobOrder> result = getPageable(query, countQuery, page, size, params)
        return result
    }

    @GraphQLQuery(name = "jobOrderListFilterPageable")
    Page<JobOrder> jobOrderListFilterPageable(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "status") String status,
            @GraphQLArgument(name = "customer") UUID customer,
            @GraphQLArgument(name = "project") UUID project,
            @GraphQLArgument(name = "asset") UUID asset,
            @GraphQLArgument(name = "sortBy") String sortBy = "code",
            @GraphQLArgument(name = "sortType") String sortType = "DESC",
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ) {

        String query = '''Select p from JobOrder p where
						lower(concat(p.code,p.description)) like lower(concat('%',:filter,'%'))'''

        String countQuery = '''Select count(p) from JobOrder p where
							lower(concat(p.code,p.description)) like lower(concat('%',:filter,'%'))'''

        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)

        if (customer) {
            query += ''' and (p.customer.id = :customer)'''
            countQuery += ''' and (p.customer.id = :customer)'''
            params.put("customer", customer)
        }

        if (status) {
            query += ''' and (p.status = :status)'''
            countQuery += ''' and (p.status = :status)'''
            params.put("status", status)
        }

        if (project) {
            query += ''' and (p.projects.id = :project)'''
            countQuery += ''' and (p.projects.id = :project)'''
            params.put("project", project)
        }

        if (asset) {
            query += ''' and (p.assets.id = :asset)'''
            countQuery += ''' and (p.assets.id = :asset)'''
            params.put("asset", asset)
        }


        query += " ORDER BY p.${sortBy} ${sortType}"

        Page<JobOrder> result = getPageable(query, countQuery, page, size, params)
        return result
    }

    // ============== Mutation =======================//
    @GraphQLMutation(name = "upsertJobOrder")
    @Transactional
    JobOrder upsertJobOrder(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ) {
        upsertFromMap(id, fields, { JobOrder entity, boolean forInsert ->
            if(forInsert){
                entity.code = generatorService.getNextValue(GeneratorType.JOB, {
                    return "JOB-" + StringUtils.leftPad(it.toString(), 6, "0")
                })
            }
        })
    }

}
