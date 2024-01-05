package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.JournalType
import com.backend.gbp.domain.accounting.LOAN_AMORTIZATION_INTEGRATION
import com.backend.gbp.domain.accounting.LedgerDocType
import com.backend.gbp.domain.accounting.Loan
import com.backend.gbp.domain.accounting.LoanAmortization
import com.backend.gbp.domain.types.AutoIntegrateable
import com.backend.gbp.graphqlservices.base.AbstractDaoCompanyService
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.services.EntityObjectMapperService
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.GeneratorType
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.scheduling.annotation.Async
import org.springframework.stereotype.Component
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

import java.time.ZoneId
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter

@GraphQLApi
@Service
@Component
class LoanAmortizationServices extends AbstractDaoCompanyService<LoanAmortization> {
    LoanAmortizationServices(){
        super(LoanAmortization.class)
    }

    @Autowired
    EntityObjectMapperService entityObjectMapperService

    @Autowired
    GeneratorService generatorService

    @Autowired
    IntegrationServices integrationServices

    @Autowired
    LedgerServices ledgerServices

    @Autowired
    ArInvoiceServices arInvoiceServices

    @Transactional(rollbackFor = Exception.class)
    @Async
    GraphQLRetVal<Boolean> addLoanAmortization(Loan loan, List<Map<String,Object>> loanSchedule){

        try{
            if(loanSchedule){
                Integer count = 1
                loanSchedule.each {
                    it->
                        LoanAmortization details = upsertFromMap(null,it)
                        details.recordNo = generatorService.getNextValue(GeneratorType.LOAN_RECORD, {
                            return StringUtils.leftPad(it.toString(), 6, "0")
                        })
                        details.orderNo = count++
                        details.loan = loan
                        save(details)
                }
            }
            return new GraphQLRetVal<Boolean>(true,true,'Success')
        }
        catch (e){
            return new GraphQLRetVal<Boolean>(false,false,e.message)
        }

    }

    @GraphQLQuery(name="getLoanScheduleById")
    Page<LoanAmortization> getLoanScheduleById(
            @GraphQLArgument(name="id") UUID id,
            @GraphQLArgument(name="filter") String filter,
                @GraphQLArgument(name="page") Integer page,
                @GraphQLArgument(name="size") Integer size
    ){
        Page<LoanAmortization> accountList = Page.empty()
        Map<String,Object> param = [:]
        param.put("id",id)

        String queryStr = "Select b from LoanAmortization b where b.loan.id = :id and "
        String countQueryStr = "Select count(b) from LoanAmortization b where b.loan.id = :id and "

        queryStr += "(b.referenceNo like lower(concat('%',:filter,'%')) or b.recordNo like lower(concat('%',:filter,'%'))) order by b.recordNo"
        countQueryStr += "(b.referenceNo like lower(concat('%',:filter,'%')) or b.recordNo like lower(concat('%',:filter,'%')))"

        param.put("filter",filter)

        def result = getPageable(
                queryStr,
                countQueryStr,
                page,
                size,
                param)

        if(result)
            accountList = result

        return accountList
    }

    @GraphQLQuery(name="loanMViewPaidLoan")
    GraphQLRetVal<List<Map<String,Object>>> loanMViewPaidLoan(@GraphQLArgument(name="id") UUID id){
        try{
            if(id) {
                def loanAmortization = findOne(id)
                if(loanAmortization) {
                    List<Map<String,Object>> entry = []

                    def headerLedger =	integrationServices.generateAutoEntries(loanAmortization){it, nul ->
                        it.flagValue = LOAN_AMORTIZATION_INTEGRATION.LOANM_PAYMENT.name()
                    }

                    if(headerLedger) {
                        headerLedger.ledger.each {
                            it ->
                                Map<String, Object> rows = [:]
                                rows["code"] = it['journalAccount']["code"]
                                rows["accountName"] = it['journalAccount']["accountName"]
                                rows["debit"] = it['debit']
                                rows["credit"] = it['credit']
                                entry.push(rows)
                        }
                        entry.sort{it['debit']}.reverse(true)
                        return new GraphQLRetVal<List<Map<String,Object>>>(entry, true, 'Success.')
                    }
                    return  new GraphQLRetVal<List<Map<String,Object>>>([],false,'No records found.')
                }
            }
            return  new GraphQLRetVal<List<Map<String,Object>>>([],false,'No records found.')
        }
        catch (e){
            return  new GraphQLRetVal<List<Map<String,Object>>>([],false,e.message)
        }
    }

    @GraphQLMutation(name="loanMPaidLoan")
    GraphQLRetVal<Boolean> loanMPaidLoan(
            @GraphQLArgument(name="id") UUID id,
            @GraphQLArgument(name="entries") List<Map<String,Object>> entries
    ){
        try {

            def loanAmortization = findOne(id)
            if (loanAmortization) {

                def headerLedger =	integrationServices.generateAutoEntries(loanAmortization){it, nul ->
                    it.flagValue = LOAN_AMORTIZATION_INTEGRATION.LOANM_PAYMENT.name()
                }

                Map<String,String> details = [:]
                loanAmortization.details.each { k,v ->
                    details[k] = v
                }

                if(entries.size() > 0) {
                    headerLedger.ledger = []
                    headerLedger = arInvoiceServices.addHeaderManualEntries(headerLedger, entries)
                }

                headerLedger.transactionNo = loanAmortization.recordNo
                headerLedger.transactionType = 'LOAN AMORTIZATION'

                headerLedger.referenceNo = loanAmortization.loan.loanNo
                headerLedger.referenceType = 'LOAN'

                def groupHeader = ledgerServices.findOne(loanAmortization.loan.postedLedger)
                if(groupHeader.headerLedgerGroup){
                    headerLedger.headerLedgerGroup = groupHeader.headerLedgerGroup
                }

                details["LOAN_AMORTIZATION_ID"] = loanAmortization.id.toString()
                def pHeader =	ledgerServices.persistHeaderLedger(headerLedger,
                        "LOAN ${loanAmortization.loan.loanNo}".toString(),
                        "LOAN ${loanAmortization.loan.loanNo} - ${loanAmortization.loan.bankAccount.accountNumber}".toString(),
                        "PAID ${loanAmortization.payment} FOR PAYMENT NO: ${loanAmortization.orderNo}".toString(),
                        LedgerDocType.JV,
                        JournalType.GENERAL,
                        loanAmortization.createdDate,
                        details)

                loanAmortization.postedLedger = pHeader.id
                save(loanAmortization)
                return  new GraphQLRetVal<Boolean>(true,true,'Payment Successful.')
            }
            return new GraphQLRetVal<Boolean>(false, false, 'No records found.')
        }
        catch (e){
            return  new GraphQLRetVal<Boolean>(false,false,e.message)
        }
    }

    @GraphQLMutation(name="loanMVoidPaidLoan")
    GraphQLRetVal<Boolean> loanMVoidPaidLoan(
            @GraphQLArgument(name="id") UUID id
    ){
        try{
            if(id) {
                def loanSchedule = findOne(id)
                if (loanSchedule){
                    if(loanSchedule.postedLedger) {
                        def header = ledgerServices.findOne(loanSchedule.postedLedger)
                        if(header) {
                            ledgerServices.reverseEntries(header)
                            loanSchedule.postedLedger = null
                            save(loanSchedule)
                            return new GraphQLRetVal<Boolean>(true, true, 'Cancel Successful.')
                        }
                        return  new GraphQLRetVal<Boolean>(false,false,'No records found.')
                    }
                    return new GraphQLRetVal<Boolean>(false, false, 'Invalid transaction.')
                }
                return  new GraphQLRetVal<Boolean>(false,false,'No records found.')
            }
            return  new GraphQLRetVal<Boolean>(false,false,"Invalid transaction.")
        }
        catch (e){
            return new GraphQLRetVal<Boolean>(false,false,e.message)
        }
    }

}
