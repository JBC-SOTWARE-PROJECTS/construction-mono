package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.domain.inventory.ReturnSupplier
import com.backend.gbp.domain.inventory.ReturnSupplierItem
import com.backend.gbp.domain.inventory.StockIssue
import com.backend.gbp.domain.inventory.StockIssueItems
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.rest.dto.PurchaseIssuanceDto
import com.backend.gbp.rest.dto.PurchaseRtsDto
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
import java.time.Instant
import java.time.ZoneId


@Component
@GraphQLApi
@TypeChecked
class StockIssueItemsService extends AbstractDaoService<StockIssueItems> {

    StockIssueItemsService() {
        super(StockIssueItems.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService


    @GraphQLQuery(name = "stiItemById")
    StockIssueItems stiItemById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            findOne(id)
        }else{
            null
        }
    }

    @GraphQLQuery(name = "stiItemByParent")
    List<StockIssueItems> stiItemByParent(
            @GraphQLArgument(name = "id") UUID id
    ) {
        String query = '''Select e from StockIssueItems e where e.stockIssue.id = :id'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        createQuery(query, params).resultList.sort { it.item.descLong }
    }

    @GraphQLQuery(name = "ItemExpense", description = "List of item expense")
    List<StockIssueItems> getItemExpensesPerDateRange(
            @GraphQLArgument(name = "start") Instant start,
            @GraphQLArgument(name = "end") Instant end,
            @GraphQLArgument(name = "expenseFrom") UUID expenseFrom,
            @GraphQLArgument(name = "filter") String filter) {

        Instant fromDate = start.atZone(ZoneId.systemDefault()).toInstant()
        Instant toDate = end.atZone(ZoneId.systemDefault()).toInstant()

        String query = '''Select s from StockIssueItems s
						where
						s.stockIssue.issueType = :issueType AND
						s.stockIssue.issueDate >= :startDate AND
						s.stockIssue.issueDate <= :endDate AND
						s.stockIssue.issueFrom.id = :expenseFrom AND
						(lower(s.item.descLong) like lower(concat('%',:filter,'%')) OR
						lower(s.item.item_category.categoryDescription) like lower(concat('%',:filter,'%')) OR
						lower(s.stockIssue.issueNo) like lower(concat('%',:filter,'%')))'''
        Map<String, Object> params = new HashMap<>()
        params.put('startDate', fromDate)
        params.put('endDate', toDate)
        params.put('issueType', 'EXPENSE')
        params.put('filter', filter)
        params.put('expenseFrom', expenseFrom)
        createQuery(query, params).resultList.sort { it.stockIssue.issueDate }
    }



    // ============== Mutation =======================//
    @Transactional
    @GraphQLMutation(name = "upsertStiItem")
    StockIssueItems upsertStiItem(
            @GraphQLArgument(name = "dto") PurchaseIssuanceDto dto,
            @GraphQLArgument(name = "item") Item item,
            @GraphQLArgument(name = "pr") StockIssue pr
    ) {
        def upsert = new StockIssueItems()
        if(!dto.isNew){
            upsert = findOne(dto.id)
        }
        upsert.stockIssue = pr
        upsert.item = item
        upsert.issueQty = dto.issueQty
        upsert.unitCost = dto.unitCost
        upsert.remarks = dto.remarks
        upsert.isPosted = dto.isPosted
        save(upsert)
    }


    @Transactional
    @GraphQLMutation(name = "removeStiItem")
    StockIssueItems removeStiItem(
            @GraphQLArgument(name = "id") UUID id
    ) {
        def del = findOne(id)
        delete(del)
        return del
    }

    @Transactional
    @GraphQLMutation(name = "updateStiItemStatus")
    StockIssueItems updateStiItemStatus(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "status") Boolean status
    ) {
        def upsert = findOne(id)
        upsert.isPosted = status
        save(upsert)
    }

}
