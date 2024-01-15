package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.domain.inventory.PurchaseOrderItems
import com.backend.gbp.domain.inventory.ReceivingReport
import com.backend.gbp.domain.inventory.ReceivingReportItem
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.rest.dto.PurchaseRecDto
import com.backend.gbp.rest.dto.ReceivingAmountDto
import com.backend.gbp.rest.dto.payables.ApReferenceDto
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
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Component

import javax.transaction.Transactional
import java.time.Instant
import java.time.ZoneId

@Component
@GraphQLApi
@TypeChecked
class ReceivingReportService extends AbstractDaoService<ReceivingReport> {

    ReceivingReportService() {
        super(ReceivingReport.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService

    @Autowired
    ReceivingReportItemService receivingReportItemService

    @Autowired
    PurchaseRequestItemService purchaseRequestItemService

    @Autowired
    PurchaseOrderService purchaseOrderService

    @Autowired
    InventoryLedgerService inventoryLedgerService

    @Autowired
    PODeliveryMonitoringService poDeliveryMonitoringService

    @Autowired
    NamedParameterJdbcTemplate namedParameterJdbcTemplate


    @GraphQLQuery(name = "recById")
    ReceivingReport recById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            findOne(id)
        }else{
            null
        }
    }

    @GraphQLQuery(name = "srrGetReferenceType")
    List<ApReferenceDto> srrGetReferenceType(){
        List<ApReferenceDto> records = []
        def company = SecurityUtils.currentCompanyId()
        String query = '''select distinct p.reference_type as reference_type from inventory.receiving_report p where p.reference_type is not null and p.company = :company'''
        Map<String, Object> params = new HashMap<>()
        params.put("params", company)
        def recordsRaw= namedParameterJdbcTemplate.queryForList(query, params)

        recordsRaw.each {
            records << new ApReferenceDto(
                    referenceType: StringUtils.upperCase( it.get("reference_type","") as String)
            )
        }

        return records
    }


    @GraphQLQuery(name = "recByFiltersPage")
	Page<ReceivingReport> recByFiltersPage(
			@GraphQLArgument(name = "filter") String filter,
			@GraphQLArgument(name = "office") UUID office,
            @GraphQLArgument(name = "start") String start,
            @GraphQLArgument(name = "end") String end,
            @GraphQLArgument(name = "supplier") UUID supplier,
			@GraphQLArgument(name = "page") Integer page,
			@GraphQLArgument(name = "size") Integer size
	) {

        def company = SecurityUtils.currentCompanyId()
		String query = '''Select r from ReceivingReport r where
						(lower(r.rrNo) like lower(concat('%',:filter,'%')) or
						lower(r.receivedRefNo) like lower(concat('%',:filter,'%')))
						and r.receivedOffice.id = :office and
						to_date(to_char(r.receiveDate, 'YYYY-MM-DD'),'YYYY-MM-DD')
             	        between to_date(:startDate,'YYYY-MM-DD') and  to_date(:endDate,'YYYY-MM-DD') '''

		String countQuery = '''Select count(r) from ReceivingReport r where
						(lower(r.rrNo) like lower(concat('%',:filter,'%')) or
						lower(r.receivedRefNo) like lower(concat('%',:filter,'%')))
						and r.receivedOffice.id = :office and
						to_date(to_char(r.receiveDate, 'YYYY-MM-DD'),'YYYY-MM-DD')
             	        between to_date(:startDate,'YYYY-MM-DD') and  to_date(:endDate,'YYYY-MM-DD') '''

		Map<String, Object> params = new HashMap<>()
		params.put('filter', filter)
        params.put('office', office)
        params.put('startDate', start)
        params.put('endDate', end)

        if (company) {
            query += ''' and (r.company = :company)'''
            countQuery += ''' and (r.company = :company)'''
            params.put("company", company)
        }

        if(supplier){
            query += ''' and (r.supplier.id = :supplier)'''
            countQuery += ''' and (r.supplier.id = :supplier)'''
            params.put('supplier', supplier)
        }


        query += ''' ORDER BY r.rrNo DESC'''

		Page<ReceivingReport> result = getPageable(query, countQuery, page, size, params)
		return result
	}

    @GraphQLQuery(name = "srrList")
    List<ReceivingReport> srrList() {
        def company = SecurityUtils.currentCompanyId()
        String query = '''Select e from ReceivingReport e where e.isPosted = :status and e.company = :company'''
        Map<String, Object> params = new HashMap<>()
        params.put('status', true)
        params.put('company', company)
        createQuery(query, params).resultList.sort { it.rrNo }
    }

    @GraphQLQuery(name = "getSrrByDateRange")
    List<ReceivingReport> getSrrByDateRange(
            @GraphQLArgument(name = "start") Instant start,
            @GraphQLArgument(name = "end") Instant end,
            @GraphQLArgument(name = "filter") String filter) {

        Instant fromDate = start.atZone(ZoneId.systemDefault()).toInstant()
        Instant toDate = end.atZone(ZoneId.systemDefault()).toInstant()
        def company = SecurityUtils.currentCompanyId()
        String query = '''Select s from ReceivingReport s
						where
						(s.isVoid = false or s.isVoid is null) AND
						s.receiveDate >= :startDate AND
						s.receiveDate <= :endDate AND
						(lower(s.rrNo) like lower(concat('%',:filter,'%')) OR
						lower(s.supplier.supplierFullname) like lower(concat('%',:filter,'%'))) and s.company = :company'''
        Map<String, Object> params = new HashMap<>()
        params.put('startDate', fromDate)
        params.put('endDate', toDate)
        params.put('filter', filter)
        params.put('company', company)
        createQuery(query, params).resultList.sort { it.receiveDate }
    }

    // ============== Mutation =======================//
    @Transactional
    @GraphQLMutation(name = "upsertRec")
    ReceivingReport upsertRec(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "items") ArrayList<Map<String, Object>> items,
            @GraphQLArgument(name = "id") UUID id
    ) {
        def company = SecurityUtils.currentCompanyId()
        def rr = upsertFromMap(id, fields, { ReceivingReport entity , boolean forInsert ->
            if(forInsert){
                def code = "SRR"

                entity.isPosted = false
                entity.isVoid = false

                if(entity.project?.id){
                    code = entity.project?.prefixShortName ?: "PJ"
                }else if(entity.assets?.id){
                    code = entity.assets?.prefix ?: "SP"
                }

                entity.rrNo = generatorService.getNextValue(GeneratorType.SRR_NO, {
                    return "${code}-" + StringUtils.leftPad(it.toString(), 6, "0")
                })
                entity.receivedType = code
                entity.company = company
            }
        })
        //items to be inserted
        def recItems = items as ArrayList<PurchaseRecDto>
        recItems.each {
            def item = objectMapper.convertValue(it.item, Item.class)
            def poItem = objectMapper.convertValue(it.refPoItem, PurchaseOrderItems.class)
            def con = objectMapper.convertValue(it, PurchaseRecDto.class)
            receivingReportItemService.upsertRecItem(con, item, poItem, rr)
        }
        return rr
    }

    @Transactional
    @GraphQLMutation(name = "updateRECStatus")
    ReceivingReport updateRECStatus(
            @GraphQLArgument(name = "status") Boolean status,
            @GraphQLArgument(name = "id") UUID id
    ) {
        def upsert = findOne(id)
        upsert.isPosted = status

        //do some magic here ...
        //update ledger
        if(!status){
            upsert.isVoid = status
            inventoryLedgerService.voidLedgerByRef(upsert.rrNo)
            //rec items
            def recItems = receivingReportItemService.recItemByParent(id)
            recItems.each {
                receivingReportItemService.updateRecItemStatus(it.id, status)
            }
            //po monitoring delete
            def poMon = poDeliveryMonitoringService.getPOMonitoringByRec(id)
            poMon.each {
                poDeliveryMonitoringService.delPOMonitoring(it.id)
            }
        }

        save(upsert)
    }

    @Transactional
    @GraphQLMutation(name = "overrideRecItems")
    ReceivingReport overrideRecItems(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "po") UUID po,
            @GraphQLArgument(name = "toDelete") ArrayList<Map<String, Object>> toDelete,
            @GraphQLArgument(name = "toInsert") ArrayList<Map<String, Object>> toInsert,
            @GraphQLArgument(name = "amount") Map<String, Object> amount

    ) {
        def amountObj = objectMapper.convertValue(amount, ReceivingAmountDto.class)
        def upsert = findOne(id)
        upsert.purchaseOrder = po ? purchaseOrderService.poById(po) : null
        upsert.grossAmount = amountObj.grossAmount
        upsert.totalDiscount = amountObj.totalDiscount
        upsert.netDiscount = amountObj.netDiscount
        upsert.inputTax = amountObj.inputTax
        upsert.netAmount = amountObj.netAmount
        upsert.amount = amountObj.amount

        //
        try {
            if(toDelete){
                def d = toDelete as ArrayList<ReceivingReportItem>
                d.each {
                    def deleted = objectMapper.convertValue(it, ReceivingReportItem.class)
                    receivingReportItemService.removeRecItemNoQuery(deleted)
                }
            }

            if(toInsert){
                def items = toInsert as ArrayList<PurchaseRecDto>
                //loop items
                items.each {
                    def item = objectMapper.convertValue(it.item, Item.class)
                    def poItem = objectMapper.convertValue(it.refPoItem, PurchaseOrderItems.class)
                    def con = objectMapper.convertValue(it, PurchaseRecDto.class)
                    receivingReportItemService.upsertRecItem(con, item, poItem, upsert)
                }
            }
            save(upsert)
        } catch (Exception e) {
            throw new Exception("Something was Wrong : " + e)
        }
        return upsert
    }
}
