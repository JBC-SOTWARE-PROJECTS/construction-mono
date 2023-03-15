package com.backend.gbp.graphqlservices.services

import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.domain.inventory.PurchaseOrderItems
import com.backend.gbp.domain.inventory.ReceivingReport
import com.backend.gbp.domain.inventory.ReceivingReportItem
import com.backend.gbp.domain.inventory.ReturnSupplierItem
import com.backend.gbp.domain.services.ServiceItems
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.rest.dto.PurchaseIssuanceDto
import com.backend.gbp.rest.dto.PurchaseRecDto
import com.backend.gbp.rest.dto.ServiceItemsDto
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
import java.time.Duration
import java.time.Instant
import java.time.ZoneId

@Component
@GraphQLApi
@TypeChecked
class ServiceItemsService extends AbstractDaoService<ServiceItems> {

    ServiceItemsService() {
        super(ServiceItems.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService

    @Autowired
    ServiceManagementService serviceManagementService


    @GraphQLQuery(name = "serviceItemById")
    ServiceItems serviceItemById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            findOne(id)
        }else{
            null
        }
    }

    @GraphQLQuery(name = "serviceItemByParent")
    List<ServiceItems> serviceItemByParent(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "filter") String filter
    ) {
        String query = '''Select e from ServiceItems e where e.service.id = :id
            and lower(concat(e.item.descLong,e.item.sku)) like lower(concat('%',:filter,'%'))'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        params.put('filter', filter)
        createQuery(query, params).resultList.sort { it.item.descLong }
    }

    @GraphQLQuery(name = "serviceItemByParentId")
    List<ServiceItems> serviceItemByParentId(
            @GraphQLArgument(name = "id") UUID id
    ) {
        String query = '''Select e from ServiceItems e where e.service.id = :id'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        createQuery(query, params).resultList.sort { it.item.descLong }
    }

    // ============== Mutation =======================//
    @Transactional
    @GraphQLMutation(name = "upsertServiceItem")
    ServiceItems upsertServiceItem(
            @GraphQLArgument(name = "items") ArrayList<Map<String, Object>> items,
            @GraphQLArgument(name = "id") UUID id
    ) {
        def upsert = new ServiceItems()
        def parent = serviceManagementService.serviceById(id)
        def serviceItems = items as ArrayList<ServiceItemsDto>
        serviceItems.each {dto ->
            def item = objectMapper.convertValue(dto.item, Item.class)
            upsert = new ServiceItems()
            if(!dto.isNew){
                upsert = findOne(UUID.fromString(dto.id))
            }
            upsert.service = parent
            upsert.item = item
            upsert.qty = dto.qty
            upsert.wcost = dto.wcost
            save(upsert)
        }
        return upsert
    }

    @Transactional
    @GraphQLMutation(name = "removeServiceItem")
    ServiceItems removeServiceItem(
            @GraphQLArgument(name = "id") UUID id
    ) {
        def del = findOne(id)
        delete(del)
        return del
    }
}
