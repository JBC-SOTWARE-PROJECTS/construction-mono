package com.backend.gbp.graphqlservices.assets


import com.backend.gbp.domain.assets.JobOrder
import com.backend.gbp.domain.assets.JobOrderItems
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.rest.InventoryResource
import com.backend.gbp.rest.dto.ItemJobsDto
import com.backend.gbp.rest.dto.JobItemsDto
import com.backend.gbp.rest.dto.JobOrderItemsDto
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

@Component
@GraphQLApi
@TypeChecked
class JobOrderItemService extends AbstractDaoService<JobOrderItems> {

    JobOrderItemService() {
        super(JobOrderItems.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService

    @Autowired
    JobOrderService jobOrderService

    @Autowired
    InventoryResource inventoryResource

    @GraphQLQuery(name = "jobOrderItemById")
    JobOrderItems jobOrderItemById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            findOne(id)
        }else{
            null
        }
    }


    @GraphQLQuery(name = "jobOrderItemByParent")
    List<JobOrderItems> jobOrderItemByParent(
            @GraphQLArgument(name = "id") UUID id
    ) {
        String query = '''Select e from JobOrderItems e where e.jobOrder.id = :id'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        createQuery(query, params).resultList.sort { it.code }
    }

    @GraphQLQuery(name = "jobTypeUnits")
    ItemJobsDto jobTypeUnits() {
        return inventoryResource.getJobOrderDistinct()
    }

    @GraphQLQuery(name = "getTotals")
    BigDecimal getTotals(
            @GraphQLArgument(name = "id") UUID id
    ){
        String query = '''Select coalesce(round(sum(j.subTotal),2), 0) from JobOrderItems j where 
        j.jobOrder.id = :id AND j.active = true'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        getSum(query, params)
    }

    // ============== Mutation =======================//
    @GraphQLMutation(name = "upsertJobOrderItems")
    @Transactional
    JobOrderItems upsertJobOrderItems(
            @GraphQLArgument(name = "items") ArrayList<Map<String, Object>> items,
            @GraphQLArgument(name = "id") UUID jobOrder
    ) {
        def joItems = items as ArrayList<JobOrderItemsDto>
        def result = new JobOrderItems()
        joItems.each {
            def obj = new JobOrderItems()
            if(!it.isNew){
                obj = findOne(UUID.fromString(it.id))
            }
            if(it.isNew) {
                obj.code = generatorService.getNextValue(GeneratorType.JOB_ITEM_REC, {
                     StringUtils.leftPad(it.toString(), 6, "0")
                })
            }
            obj.dateTrans = Instant.now()
            obj.jobOrder = jobOrderService.jobOrderById(jobOrder)
            obj.description = it.description
            obj.type = it.type
            obj.qty = it.qty
            obj.unit = it.unit
            obj.cost = it.cost
            obj.subTotal = it.subTotal
            obj.total = it.total
            obj.active = it.active
            result = save(obj)
        }

        return result
    }

}
