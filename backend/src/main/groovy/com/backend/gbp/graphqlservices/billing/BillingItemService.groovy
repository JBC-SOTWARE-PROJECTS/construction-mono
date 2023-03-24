package com.backend.gbp.graphqlservices.billing

import com.backend.gbp.domain.billing.Billing
import com.backend.gbp.domain.billing.BillingItem
import com.backend.gbp.domain.billing.DiscountDetails
import com.backend.gbp.domain.billing.JobItems
import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.domain.projects.ProjectCost
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.inventory.InventoryLedgerService
import com.backend.gbp.graphqlservices.inventory.ItemService
import com.backend.gbp.graphqlservices.services.ServiceManagementService
import com.backend.gbp.repository.billing.DiscountDetailsRepository
import com.backend.gbp.rest.InventoryResource
import com.backend.gbp.rest.dto.BillingItemsDto
import com.backend.gbp.rest.dto.DiscountDto
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
import org.springframework.stereotype.Component

import javax.transaction.Transactional
import java.time.Duration
import java.time.Instant

@Component
@GraphQLApi
@TypeChecked
class BillingItemService extends AbstractDaoService<BillingItem> {

    BillingItemService() {
        super(BillingItem.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService

    @Autowired
    ItemService itemService

    @Autowired
    BillingService billingService

    @Autowired
    InventoryLedgerService inventoryLedgerService

    @Autowired
    InventoryResource inventoryResource

    @Autowired
    DiscountDetailsRepository discountDetailsRepository

    @Autowired
    ServiceManagementService serviceManagementService

    @Autowired
    JobItemService jobItemService


    @GraphQLQuery(name = "billingItemById")
    BillingItem billingItemById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            findOne(id)
        }else{
            null
        }
    }

    @GraphQLQuery(name = "billingItemByParent")
    List<BillingItem> billingItemByParent(
            @GraphQLArgument(name = "id") UUID id
    ) {
        String query = '''Select e from BillingItem e where e.billing.id = :id'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        createQuery(query, params).resultList.sort { it.description }
    }

    @GraphQLQuery(name = "billingItemByParentType")
    List<BillingItem> billingItemByParentType(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "type") List<String> type
    ) {
        String query = '''select q from BillingItem q where 
                        (lower(q.description) like lower(concat('%',:filter,'%')) OR 
                        lower(q.recordNo) like lower(concat('%',:filter,'%'))) 
					  AND q.billing.id = :id AND q.itemType IN (:type)'''
        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        params.put('id', id)
        params.put('type', type)
        createQuery(query, params).resultList.sort { it.transDate }.reverse(true)
    }

    @GraphQLQuery(name = "billingItemByDateType")
    List<BillingItem> billingItemByDateType(
            @GraphQLArgument(name = "start") String start,
            @GraphQLArgument(name = "end") String end,
            @GraphQLArgument(name = "type") List<String> type,
            @GraphQLArgument(name = "filter") String filter
    ) {
        String query = '''select q from BillingItem q where q.itemType IN (:type)
                        and (lower(q.description) like lower(concat('%',:filter,'%')) OR 
                        lower(q.recordNo) like lower(concat('%',:filter,'%')))
                        and to_date(to_char(q.transDate, 'YYYY-MM-DD'),'YYYY-MM-DD')
             			between to_date(:start,'YYYY-MM-DD') and  to_date(:end,'YYYY-MM-DD') and q.status = true'''
        Map<String, Object> params = new HashMap<>()
        params.put('start', start)
        params.put('end', end)
        params.put('type', type)
        params.put('filter', filter)
        createQuery(query, params).resultList.sort { it.transDate }.reverse(true)
    }


    @GraphQLQuery(name = "getItemDiscountable")
    List<BillingItem> getItemDiscountable(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "type") List<String> type
    ) {
        String query = '''select q from BillingItem q where q.billing.id = :id AND q.itemType IN (:type) AND q.status = true'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        params.put('type', type)
        createQuery(query, params).resultList.sort { it.transDate }.reverse(true)
    }

    @GraphQLQuery(name = "getAmountsDeduct")
    BigDecimal getAmountsDeduct(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "type") List<String> type
    ){
        String query = '''Select coalesce(round(sum(j.credit),2), 0) from BillingItem j 
        where j.billing.id = :id AND j.itemType in (:type) AND j.status = true'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        params.put('type', type)
        getSum(query, params)
    }

    @GraphQLQuery(name = "getAmounts")
    BigDecimal getAmounts(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "type") List<String> type
    ){
        String query = '''Select coalesce(round(sum(j.subTotal),2), 0) from BillingItem j where 
        j.billing.id = :id AND j.itemType in (:type) AND j.status = true'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        params.put('type', type)
        getSum(query, params)
    }

    @GraphQLQuery(name = "getAllAmounts")
    BigDecimal getAllAmounts(
            @GraphQLArgument(name = "type") List<String> type
    ){
        String query = '''Select coalesce(round(sum(j.subTotal),2), 0) from BillingItem j where 
        j.itemType in (:type) AND j.status = true'''
        Map<String, Object> params = new HashMap<>()
        params.put('type', type)
        getSum(query, params)
    }

    @GraphQLQuery(name = "totalPayments")
    BigDecimal totalPayments() {
        String query = '''select abs(sum(q.subTotal)) from BillingItem q where q.itemType IN (:type) and q.status = true'''
        Map<String, Object> params = new HashMap<>()
        params.put('type', ['PAYMENTS'])
        getSum(query, params)
    }

    @GraphQLQuery(name = "getBalance")
    BigDecimal getBalance(
            @GraphQLArgument(name = "id") UUID id
    ){
        String query = '''Select coalesce(round(sum(j.subTotal),2), 0) from BillingItem j where 
        j.billing.id = :id AND j.status = true'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        getSum(query, params)
    }

    @GraphQLQuery(name = "getBillingItemFilterActive")
    List<BillingItem> getBillingItemFilterActive(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "type") List<String> type
    ){
        String query = '''select q from BillingItem q where q.billing.id = :id AND q.itemType IN (:type) AND q.status = true'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        params.put('type', type)
        createQuery(query, params).resultList
    }


    // ============== Mutation =======================//
    @Transactional
    @GraphQLMutation(name = "upsertBillingItemByJob")
    BillingItem upsertBillingItemByJob(
            @GraphQLArgument(name = "it") JobItems it,
            @GraphQLArgument(name = "recordNo") String recordNo,
            @GraphQLArgument(name = "billing") Billing billing
    ) {
        BillingItem item = new BillingItem()

        item.transDate = Instant.now()
        item.billing = billing
        item.recordNo = recordNo
        if (it.type == 'ITEM') {
            item.item = it.item
        }
        if (it.type == 'SERVICE') {
            item.service = it.service
        }
        item.description = it.descriptions
        item.qty = it.qty
        item.debit = it.cost
        item.credit = BigDecimal.ZERO
        item.subTotal = it.subTotal
        item.itemType = it.type
        item.outputTax = it.outputTax ? it.outputTax : BigDecimal.ZERO
        item.wcost = it.wcost ? it.wcost : BigDecimal.ZERO
        item.refId = it.id
        item.transType = 'JOB'
        item.status = true
        save(item)
    }

    @Transactional
    @GraphQLMutation(name = "upsertBillingItemByProject")
    BillingItem upsertBillingItemByProject(
            @GraphQLArgument(name = "it") ProjectCost it,
            @GraphQLArgument(name = "billing") Billing billing
    ) {
        BillingItem item = new BillingItem()

        item.transDate = Instant.now()
        item.billing = billing
        item.recordNo = generatorService.getNextValue(GeneratorType.REC_NO) { Long no ->
            StringUtils.leftPad(no.toString(), 6, "0")
        }

        item.description = it.description
        item.qty = it.qty
        item.debit = it.cost
        item.credit = BigDecimal.ZERO
        item.subTotal = it.qty * it.cost
        item.itemType = "SERVICE"
        item.outputTax = BigDecimal.ZERO
        item.wcost = BigDecimal.ZERO
        item.refId = it.id
        item.transType = 'PROJECT'
        item.status = true
        save(item)
    }

    @Transactional
    @GraphQLMutation(name = "upsertBillingItemByMisc")
    BillingItem upsertBillingItemByLayout(
            @GraphQLArgument(name = "value") BigDecimal value,
            @GraphQLArgument(name = "desc") String desc,
            @GraphQLArgument(name = "billing") Billing billing
    ) {
        BillingItem item = new BillingItem()
        def recordNo = generatorService.getNextValue(GeneratorType.REC_NO) { Long no ->
            StringUtils.leftPad(no.toString(), 6, "0")
        }
        item.transDate = Instant.now()
        item.billing = billing
        item.recordNo = recordNo
        item.item = null
        item.description = desc
        item.qty = 1
        item.debit = value
        item.credit = BigDecimal.ZERO
        item.subTotal = value
        item.itemType = 'MISC'
        item.transType = 'PROJECT'
        item.status = true
        save(item)
    }

    //
    @Transactional
    @GraphQLMutation(name = "addService")
    BillingItem addService(
            @GraphQLArgument(name = "desc") String description,
            @GraphQLArgument(name = "amount") BigDecimal amount,
            @GraphQLArgument(name = "qty") Integer qty,
            @GraphQLArgument(name = "billing") UUID billing,
            @GraphQLArgument(name = "itemtype") String itemtype,
            @GraphQLArgument(name = "type") String type
    ) {
        BillingItem item = new BillingItem()
        def billObject = billingService.billingById(billing)

        def recordNo = generatorService.getNextValue(GeneratorType.REC_NO) { Long no ->
            StringUtils.leftPad(no.toString(), 6, "0")
        }
        item.transDate = Instant.now()
        item.billing = billObject
        item.recordNo = recordNo
        item.description = description
        item.qty = qty
        item.debit = amount
        item.credit = BigDecimal.ZERO
        item.subTotal = qty * amount
        item.itemType = itemtype
        item.transType = type
        item.status = true
        save(item)

        return item
    }

    //add service management
    @Transactional
    @GraphQLMutation(name = "addNewService", description = "Add Services to bill")
    BillingItem addNewService(
            @GraphQLArgument(name = "items") ArrayList<Map<String, Object>> items,
            @GraphQLArgument(name = "billing") UUID billing,
            @GraphQLArgument(name = "type") String type
    ) {
        def billItems = items as ArrayList<BillingItemsDto>
        BillingItem item = new BillingItem()
        def billObject = billingService.billingById(billing)

        billItems.each {
            it ->
                item = new BillingItem()
                def recordNo = generatorService.getNextValue(GeneratorType.REC_NO) { Long no ->
                    StringUtils.leftPad(no.toString(), 6, "0")
                }
                //end add job order

                //insert
                item.transDate = Instant.now()
                item.billing = billObject
                item.recordNo = recordNo
                item.service = null
                item.description = it.description
                item.qty = it.qty
                item.debit = it.amount
                item.credit = BigDecimal.ZERO
                item.subTotal = it.subTotal
                item.itemType = 'SERVICE'
                item.transType = type
                item.outputTax = BigDecimal.ZERO
                item.wcost = BigDecimal.ZERO
                item.refId = null
                item.status = true
                save(item)

                //add to job items
        }
        return item

    }

    //add items
    @Transactional
    @GraphQLMutation(name = "addItems", description = "Add Items to bill")
    BillingItem addItems(
            @GraphQLArgument(name = "items") ArrayList<Map<String, Object>> items,
            @GraphQLArgument(name = "billing") UUID billing,
            @GraphQLArgument(name = "type") String type,
            @GraphQLArgument(name = "office") UUID office
    ) {
        def billItems = items as ArrayList<BillingItemsDto>
        BillingItem item = new BillingItem()
        def billObject = billingService.billingById(billing)

        billItems.each {
            it ->
                item = new BillingItem()
                def itemObject = objectMapper.convertValue(it.item, Item.class)
                def recordNo = generatorService.getNextValue(GeneratorType.REC_NO) { Long no ->
                    StringUtils.leftPad(no.toString(), 6, "0")
                }

                //insert
                item.transDate = Instant.now()
                item.billing = billObject
                item.recordNo = recordNo
                item.item = itemObject
                item.description = it.description
                item.qty = it.qty
                item.debit = it.amount
                item.credit = BigDecimal.ZERO
                item.subTotal = it.subTotal
                item.itemType = 'ITEM'
                item.transType = type
                item.outputTax = it.outputTax ? it.outputTax : BigDecimal.ZERO
                item.wcost = it.wcost ? it.wcost : BigDecimal.ZERO
                item.refId = null
                item.status = true
                save(item)

                //inventory charge
                inventoryLedgerService.inventoryCharge(
                        office,
                        itemObject.id,
                        recordNo,
                        'cs',
                        it.qty,
                        it.wcost
                )
        }
        return item

    }

    //cancel billing item
    @Transactional
    @GraphQLMutation(name = "cancelItem", description = "Cancel Item")
    BillingItem canceled(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "office") UUID office
    ) {
        def it = findOne(id)
        it.status = false
        save(it)

        //reverse item
        if (it.itemType.equalsIgnoreCase('ITEM')) {
            inventoryLedgerService.voidLedgerByRef(it.recordNo)

        }
        if(it.itemType.equalsIgnoreCase('SERVICE')){
            def type = it.service.type;
            if(type.equalsIgnoreCase("BUNDLE")){
                inventoryLedgerService.voidLedgerByRef(it.recordNo)
            }
        }

        //delete discount details
        if(it.itemType == 'DEDUCTIONS'){
            def todelete = discountDetailsRepository.getItemDiscountsByBillingItem(id)
            todelete.each {
                del ->
                    discountDetailsRepository.delete(del)
            }
        }

        return it
    }

    @Transactional
    @GraphQLMutation(name = "addDiscounts")
    BillingItem addDiscounts(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "type") String type
    ) {
        def it = objectMapper.convertValue(fields, DiscountDto.class)
        BigDecimal percentage = 0;

        //
        List<String> types = ['ITEM', 'SERVICE', 'MISC']
        BigDecimal discountable = this.getAmounts(id, types)
        def discountItems = this.getItemDiscountable(id, types)

        //calculate
        if (it.discountType == "PERCENTAGE") {
            percentage = it.percent / 100
        } else {
            //calculate percent
            percentage = it.amount / discountable
        }

        //insert billing item as deductions
        BillingItem item = new BillingItem();
        def recordNo = generatorService.getNextValue(GeneratorType.REC_NO) { Long no ->
            StringUtils.leftPad(no.toString(), 6, "0")
        }
        BigDecimal discount = discountable * percentage
        item.transDate = Instant.now()
        item.billing = billingService.findOne(id)
        item.recordNo = recordNo
        item.description = it.description
        item.qty = 1
        item.debit = BigDecimal.ZERO
        item.credit = discount.round(2)
        item.subTotal = BigDecimal.ZERO - (discount.round(2))
        item.itemType = "DEDUCTIONS"
        item.transType = type
        item.status = true
        def afterSave = save(item)

        //insert discounts details
        discountItems.each {
            dis ->
                if(it.type == "DISCOUNT"){
                    def amount = dis.subTotal * percentage
                    def disc = new DiscountDetails();
                    disc.billing = billingService.findOne(id)
                    disc.billingItem = afterSave
                    disc.refBillItem = dis
                    disc.amount = amount.round(4)
                    discountDetailsRepository.save(disc)
                }
        }
        return item
    }

    //cash flow data
    @GraphQLQuery(name = "totalRevenue")
    BigDecimal totalRevenue(
            @GraphQLArgument(name = "start") String start,
            @GraphQLArgument(name = "end") String end
    ) {
        String query = '''select abs(sum(q.subTotal)) from BillingItem q where q.itemType IN (:type)
                        and to_date(to_char(q.transDate, 'YYYY-MM-DD'),'YYYY-MM-DD')
             			between to_date(:start,'YYYY-MM-DD') and  to_date(:end,'YYYY-MM-DD') and q.status = true'''
        Map<String, Object> params = new HashMap<>()
        params.put('start', start)
        params.put('end', end)
        params.put('type', ['PAYMENTS'])
        getSum(query, params)
    }



}
