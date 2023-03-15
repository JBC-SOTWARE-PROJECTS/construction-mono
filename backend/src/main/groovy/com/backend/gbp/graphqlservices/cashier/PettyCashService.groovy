package com.backend.gbp.graphqlservices.cashier

import com.backend.gbp.domain.cashier.PettyCash
import com.backend.gbp.domain.cashier.PettyType
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.billing.BillingItemService
import com.backend.gbp.rest.dto.CashFlowDto
import com.backend.gbp.rest.dto.StockCardPrint
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


@Component
@GraphQLApi
@TypeChecked
class PettyCashService extends AbstractDaoService<PettyCash> {

    PettyCashService() {
        super(PettyCash.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService

    @Autowired
    BillingItemService billingItemService


    @GraphQLQuery(name = "pettyCashById")
    PettyCash pettyCashById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            findOne(id)
        }else{
            return null
        }
    }

    @GraphQLQuery(name = "pettyCashList")
    List<PettyCash> pettyCashList(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "shift") UUID shift,
            @GraphQLArgument(name = "cashType") String cashType
    ) {
        String query = '''Select e from PettyCash e where 
                          lower(concat(e.code,e.remarks)) like lower(concat('%',:filter,'%'))'''
        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        if (shift) {
            query += ''' and (e.shift.id = :shift)'''
            params.put("shift", shift)
        }
        if (cashType) {
            query += ''' and (e.cashType = :cashType)'''
            params.put("cashType", cashType)
        }
        createQuery(query, params).resultList.sort { it.code }
    }

    @GraphQLQuery(name = "pettyCashListPosted")
    List<PettyCash> pettyCashListPosted(
            @GraphQLArgument(name = "shift") UUID shift
    ) {
        String query = '''Select e from PettyCash e where 
                          e.shift.id = :shift and e.isPosted = true'''
        Map<String, Object> params = new HashMap<>()
        params.put("shift", shift)
        createQuery(query, params).resultList.sort { it.code }
    }

    @GraphQLQuery(name = "pettyCashListByDate")
    List<PettyCash> pettyCashListByDate(
            @GraphQLArgument(name = "start") String start,
            @GraphQLArgument(name = "end") String end,
            @GraphQLArgument(name = "filter") String filter
    ) {
        String query = '''Select e from PettyCash e where 
                          lower(concat(e.code,e.remarks)) like lower(concat('%',:filter,'%'))
                          and to_date(to_char(e.dateTrans, 'YYYY-MM-DD'),'YYYY-MM-DD')
             			between to_date(:start,'YYYY-MM-DD') and  to_date(:end,'YYYY-MM-DD')
             			and e.isPosted = true'''
        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        params.put('start', start)
        params.put('end', end)
        createQuery(query, params).resultList.sort { it.dateTrans }.reverse(true)
    }


    @GraphQLQuery(name = "totalExpense")
    BigDecimal totalExpense(
            @GraphQLArgument(name = "start") String start,
            @GraphQLArgument(name = "end") String end
    ) {
        String query = '''Select sum(e.amount) from PettyCash e where to_date(to_char(e.dateTrans, 'YYYY-MM-DD'),'YYYY-MM-DD')
             			between to_date(:start,'YYYY-MM-DD') and to_date(:end,'YYYY-MM-DD')
             			and e.isPosted = true and e.cashType = :type'''
        Map<String, Object> params = new HashMap<>()
        params.put('start', start)
        params.put('end', end)
        params.put('type', 'CASH_OUT')
        getSum(query, params)
    }

    @GraphQLQuery(name = "totalCashIn")
    BigDecimal totalCashIn(
            @GraphQLArgument(name = "start") String start,
            @GraphQLArgument(name = "end") String end
    ) {
        String query = '''Select sum(e.amount) from PettyCash e where to_date(to_char(e.dateTrans, 'YYYY-MM-DD'),'YYYY-MM-DD')
             			between to_date(:start,'YYYY-MM-DD') and to_date(:end,'YYYY-MM-DD')
             			and e.isPosted = true and e.cashType = :type'''
        Map<String, Object> params = new HashMap<>()
        params.put('start', start)
        params.put('end', end)
        params.put('type', 'CASH_IN')
        getSum(query, params)
    }

    @GraphQLQuery(name = "totalCashBalance")
    BigDecimal totalCashBalance(
            @GraphQLArgument(name = "start") String start,
            @GraphQLArgument(name = "end") String end
    ) {
        def payments = billingItemService.totalRevenue(start, end) ?: BigDecimal.ZERO
        def petty = this.totalExpense(start, end) ?: BigDecimal.ZERO
        def pettyIn = this.totalCashIn(start, end) ?: BigDecimal.ZERO
        def total = (payments + pettyIn) - petty
        return total
    }

    @GraphQLQuery(name = "pettyCashAll")
    List<PettyCash> pettyCashAll() {
        findAll().sort{it.code}
    }


    // ============== Mutation =======================//
    @GraphQLMutation(name = "upsertPettyCash")
    @Transactional
    PettyCash upsertPettyCash(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ) {
        upsertFromMap(id, fields, { PettyCash entity, boolean forInsert ->
            if(forInsert){
                entity.code = generatorService.getNextValue(GeneratorType.PETTY_CASH, {
                    return "CT-" + StringUtils.leftPad(it.toString(), 6, "0")
                })
                entity.isPosted = false
                entity.isVoid = false
            }
        })
    }

    @GraphQLMutation(name = "pettyCashPostVoid")
    @Transactional
    PettyCash pettyCashPostVoid(
            @GraphQLArgument(name = "status") Boolean status,
            @GraphQLArgument(name = "id") UUID id
    ) {
        def upsert = findOne(id)
        upsert.isPosted = status
        upsert.isVoid = !status
        save(upsert)
    }

    //cash flow
    @GraphQLQuery(name = "cashFlowReport")
    List<CashFlowDto> cashFlowReport(
            @GraphQLArgument(name = "start") String start,
            @GraphQLArgument(name = "end") String end,
            @GraphQLArgument(name = "filter") String filter
    ) {
        //payments
        def items = new ArrayList<CashFlowDto>()
        def payments = billingItemService.billingItemByDateType(start, end, ['PAYMENTS'], filter)
        def petty = this.pettyCashListByDate(start, end, filter)
        //loop payments
        if (payments) {
            payments.each {
                it ->
                    def itemDto = new CashFlowDto(
                            id: it.id,
                            date: it.transDate,
                            refNo: it.recordNo,
                            type: "CASH IN",
                            description: "[Bill #: ${it.billing.billNo}] ${it.billing.otcName ? it.billing.otcName: it.billing.customer.fullName} - ${it.description}",
                            amount: it.subTotal.negate(),
                            remarks: ""
                    )
                    items.add(itemDto)
            }
        }
        //loop petty cash
        if (petty) {
            petty.each {
                it ->

                    def cashOut = new CashFlowDto(
                            id: it.id,
                            date: it.dateTrans,
                            refNo: it.code,
                            type: it.cashType.equalsIgnoreCase("CASH_OUT") ? "CASH OUT" : "CASH IN",
                            description: "[TRANS #: ${it.code}] ${it.remarks} - Received by : ${it.receivedBy?.fullName}",
                            amount: it.amount,
                            remarks: it.remarks
                    )
                    items.add(cashOut)

            }
        }

        return items.sort{it.date}.reverse(true)
    }


}
