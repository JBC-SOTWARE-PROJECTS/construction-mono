package com.backend.gbp.graphqlservices.billing

import com.backend.gbp.domain.billing.Job
import com.backend.gbp.domain.billing.JobItems
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.inventory.ItemService
import com.backend.gbp.graphqlservices.services.ServiceManagementService
import com.backend.gbp.rest.dto.JobItemsDto
import com.backend.gbp.services.GeneratorService
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

import javax.transaction.Transactional

@Component
@GraphQLApi
@TypeChecked
class JobItemService extends AbstractDaoService<JobItems> {

    JobItemService() {
        super(JobItems.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService

    @Autowired
    ItemService itemService

    @Autowired
    ServiceCategoryService serviceCategoryService

    @Autowired
    ServiceManagementService serviceManagementService


    @GraphQLQuery(name = "jobItemById")
    JobItems jobItemById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            findOne(id)
        }else{
            null
        }
    }

    @GraphQLQuery(name = "jobItemByParent")
    List<JobItems> jobItemByParent(
            @GraphQLArgument(name = "id") UUID id
    ) {
        String query = '''Select e from JobItems e where e.job.id = :id'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        createQuery(query, params).resultList.sort { it.descriptions }
    }

    @GraphQLQuery(name = "jobItemByServiceCategory")
    List<JobItems> jobItemByServiceCategory(
            @GraphQLArgument(name = "id") UUID id
    ) {
        String query = '''Select e from JobItems e where e.job.id = :id and e.type = 'SERVICE' '''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        createQuery(query, params).resultList.sort { it.serviceCategory.description }
    }

    @GraphQLQuery(name = "jobItemByItems")
    List<JobItems> jobItemByItems(
            @GraphQLArgument(name = "id") UUID id
    ) {
        String query = '''Select e from JobItems e where e.job.id = :id and e.type = 'ITEM' '''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        createQuery(query, params).resultList.sort { it.descriptions }
    }


    // ============== Mutation =======================//
    @Transactional
    @GraphQLMutation(name = "upsertJobItem")
    JobItems upsertJobItem(
            @GraphQLArgument(name = "dto") JobItemsDto dto,
            @GraphQLArgument(name = "item") UUID item,
            @GraphQLArgument(name = "job") Job job
    ) {
        def upsert = new JobItems()
        if(!dto.isNew){
            upsert = findOne(UUID.fromString(dto.id))
        }
        upsert.job = job
        if(item){
            upsert.item = itemService.itemById(item)
        }
        upsert.service = null
        if(dto.serviceCategory){
            upsert.serviceCategory = serviceCategoryService.serviceCategoryById(UUID.fromString(dto.serviceCategory))
        }
        upsert.type = dto.type
        upsert.descriptions = dto.descriptions
        upsert.qty = dto.qty
        upsert.cost = dto.cost
        upsert.subTotal = dto.subTotal
        upsert.outputTax = dto.outputTax
        upsert.wcost = dto.wcost
        upsert.billed = dto.billed
        save(upsert)
    }

    @Transactional
    @GraphQLMutation(name = "upsertJobItemFormBilling")
    JobItems upsertJobItemFormBilling(
            @GraphQLArgument(name = "serviceCategory") UUID serviceCategory,
            @GraphQLArgument(name = "type") String type,
            @GraphQLArgument(name = "descriptions") String descriptions,
            @GraphQLArgument(name = "qty") Integer qty,
            @GraphQLArgument(name = "cost") BigDecimal cost,
            @GraphQLArgument(name = "subTotal") BigDecimal subTotal,
            @GraphQLArgument(name = "outputTax") BigDecimal outputTax,
            @GraphQLArgument(name = "wcost") BigDecimal wcost,
            @GraphQLArgument(name = "item") UUID item,
            @GraphQLArgument(name = "job") Job job
    ) {
        def upsert = new JobItems()
        upsert.job = job
        if(item){
            upsert.item = itemService.itemById(item)
        }
        upsert.service = null
        if(serviceCategory){
            upsert.serviceCategory = serviceCategoryService.serviceCategoryById(serviceCategory)
        }
        upsert.type = type
        upsert.descriptions = descriptions
        upsert.qty = qty
        upsert.cost = cost
        upsert.subTotal = subTotal
        upsert.outputTax = outputTax
        upsert.wcost = wcost
        upsert.billed = true
        save(upsert)
    }

    @Transactional
    @GraphQLMutation(name = "removeJobItem")
    JobItems removeJobItem(
            @GraphQLArgument(name = "id") UUID id
    ) {
        def del = findOne(id)
        delete(del)
        return del
    }

    @Transactional
    @GraphQLMutation(name = "updateBilled")
    JobItems updateBilled(
            @GraphQLArgument(name = "status") Boolean status,
            @GraphQLArgument(name = "id") UUID id
    ) {
        def upsert = findOne(id)
        upsert.billed = status
        save(upsert)
    }

}
