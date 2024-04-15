package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.domain.inventory.PurchaseOrder
import com.backend.gbp.domain.inventory.PurchaseOrderItems
import com.backend.gbp.domain.inventory.ReceivingReport
import com.backend.gbp.domain.inventory.ReceivingReportItem
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.rest.dto.PurchasePODto
import com.backend.gbp.rest.dto.PurchaseRecDto
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
import java.time.Period
import java.time.ZoneId

@Component
@GraphQLApi
@TypeChecked
class ReceivingReportItemService extends AbstractDaoService<ReceivingReportItem> {

    ReceivingReportItemService() {
        super(ReceivingReportItem.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService


    @GraphQLQuery(name = "recItemById")
    ReceivingReportItem recItemById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            findOne(id)
        }else{
            null
        }
    }

    @GraphQLQuery(name = "recItemByParent")
    List<ReceivingReportItem> recItemByParent(
            @GraphQLArgument(name = "id") UUID id
    ) {
        String query = '''Select e from ReceivingReportItem e where e.receivingReport.id = :id'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        createQuery(query, params).resultList.sort { it.item.descLong }
    }

    @GraphQLQuery(name = "getSrrItemByDateRange", description = "List of receiving report list per date range")
    List<ReceivingReportItem> getSrrItemByDateRange(@GraphQLArgument(name = "start") Instant start,
                                                     @GraphQLArgument(name = "end") Instant end,
                                                     @GraphQLArgument(name = "filter") String filter) {

        Instant fromDate = start.atZone(ZoneId.systemDefault()).toInstant()
        Instant toDate = end.atZone(ZoneId.systemDefault()).toInstant()

        String query = '''Select r from ReceivingReportItem r
						where
						(r.receivingReport.isVoid = false OR r.receivingReport.isVoid is null) AND
						r.receivingReport.receiveDate >= :startDate AND
						r.receivingReport.receiveDate <= :endDate AND
						r.isPosted = true AND
						(lower(r.receivingReport.rrNo) like lower(concat('%',:filter,'%')) OR
						lower(r.item.descLong) like lower(concat('%',:filter,'%')) OR
						lower(r.receivingReport.supplier.supplierFullname) like lower(concat('%',:filter,'%')))'''
        Map<String, Object> params = new HashMap<>()
        params.put('startDate', fromDate)
        params.put('endDate', toDate)
        params.put('filter', filter)
        createQuery(query, params).resultList.sort { it.receivingReport.receiveDate }
    }

    // ============== Mutation =======================//
    @Transactional
    @GraphQLMutation(name = "upsertRecItem")
    ReceivingReportItem upsertRecItem(
            @GraphQLArgument(name = "dto") PurchaseRecDto dto,
            @GraphQLArgument(name = "item") Item item,
            @GraphQLArgument(name = "refPoItem") PurchaseOrderItems refPoItem,
            @GraphQLArgument(name = "rr") ReceivingReport rr
    ) {
        def upsert = new ReceivingReportItem()
        if(!dto.isNew){
            upsert = findOne(dto.id)
        }
        upsert.receivingReport = rr
        upsert.item = item
        upsert.refPoItem = refPoItem
        upsert.receiveQty = dto.receiveQty
        upsert.receiveUnitCost = dto.receiveUnitCost
        upsert.recInventoryCost = dto.recInventoryCost
        upsert.receiveDiscountCost = dto.receiveDiscountCost
        if(dto.expirationDate){
            upsert.expirationDate = dto.expirationDate.plus(Duration.ofDays(1))
        }
        upsert.totalAmount = dto.totalAmount
        upsert.inputTax = dto.inputTax
        upsert.netAmount = dto.netAmount
        upsert.isTax = dto.isTax
        upsert.isFg = dto.isFg
        upsert.isDiscount = dto.isDiscount
        upsert.isCompleted = dto.isCompleted
        upsert.isPartial = dto.isPartial
        upsert.isPosted = dto.isPosted
        save(upsert)
    }

    @Transactional
    @GraphQLMutation(name = "removeRecItem")
    ReceivingReportItem removeRecItem(
            @GraphQLArgument(name = "id") UUID id
    ) {
        def del = findOne(id)
        delete(del)
        return del
    }

    @Transactional
    @GraphQLMutation(name = "removeRecItemNoQuery")
    ReceivingReportItem removeRecItemNoQuery(
            @GraphQLArgument(name = "rr") ReceivingReportItem rr
    ) {
        def del = findOne(rr.id)
        delete(del)
        return rr
    }

    @Transactional
    @GraphQLMutation(name = "updateRecItemStatus")
    ReceivingReportItem updateRecItemStatus(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "status") Boolean status
    ) {
        def upsert = findOne(id)
        upsert.isPosted = status
        save(upsert)
    }
}
