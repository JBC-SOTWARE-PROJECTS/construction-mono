package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.NormalSide
import com.backend.gbp.domain.accounting.ReportsLayoutItem
import com.backend.gbp.domain.accounting.SavedAccounts
import com.backend.gbp.graphqlservices.base.AbstractDaoCompanyService
import com.backend.gbp.security.SecurityUtils
import com.google.gson.Gson
import groovy.json.JsonSlurper
import groovy.transform.Canonical
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.beanutils.BeanUtils
import org.hibernate.query.NativeQuery
import org.hibernate.transform.Transformers
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

import javax.persistence.EntityManager
import java.time.LocalDate

@Canonical
class FinancialReportDto {
    Integer order
    UUID id
    String code
    String title
    String normalSide
    BigDecimal amount
    Boolean isHide
    Boolean isGroup
    Boolean isChild
    Boolean isFormula
    Boolean isTotal
    String rows
}


@Canonical
class SavedAccountDto {
    String code
    String account
    String normalSide
    BigDecimal debit
    BigDecimal credit
    BigDecimal balance
}

@Canonical
class RemapDto {
    List<FinancialReportDto> list
    Map<UUID,FinancialReportDto> mapTotal
    BigDecimal total
    Integer order
    Integer col
}

@Component
@GraphQLApi
class SavedAccountsServices extends AbstractDaoCompanyService<SavedAccounts> {

    SavedAccountsServices() {
        super(SavedAccounts.class)
    }


    @Autowired
    FiscalServices fiscalServices

    @Autowired
    ReportsLayoutServices reportsLayoutServices

    @Autowired
    ReportsLayoutItemServices reportsLayoutItemServices

    @Autowired
    EntityManager entityManager


    @GraphQLQuery(name='getSaveItemsByParent')
    List<SavedAccounts> getSaveItemsByParent(
            @GraphQLArgument(name = "code") String  code
    ){
        def company = SecurityUtils.currentCompany()
        createQuery(""" 
                Select s from SavedAccounts s
                where s.motherCode = :code
                s.companyId = :company
                order by s.description asc
        """)
                .setParameter('code',code)
                .setParameter('company',company)
            .resultList
    }

    @GraphQLQuery(name='getSaveAccountsMother')
    List<SavedAccountDto> getSaveAccountsMother(
            @GraphQLArgument(name = "start") String start,
            @GraphQLArgument(name = "end") String end
    ){
        def company = SecurityUtils.currentCompany()

        entityManager.createNativeQuery(""" 
                select 
                sa.mother_code as "code" ,
                sa.mother_account as "account",
                sa.normal_side as "normalSide",
                sum(sa.debit) as "debit",
                sum(sa.credit) as "credit",
                sum(sa.balance) as "balance"
                from accounting.save_accounts sa 
                where 
                sa.transaction_date_str >= :start 
                and 
                sa.transaction_date_str <= :end
                and sa.company_id = :company
                group by sa.mother_code , sa.mother_account ,
                sa.normal_side
        """)
                .setParameter('start',start)
                .setParameter('end',end)
                .setParameter('company',company)
                .unwrap(NativeQuery.class)
                .setResultTransformer(Transformers.aliasToBean(SavedAccountDto.class))
                .resultList
    }

    @GraphQLQuery(name='saveAccountSummary')
    List<SavedAccounts> saveAccountSummary(
            @GraphQLArgument(name = "end") String end
    ){
        def company = SecurityUtils.currentCompany()

        entityManager.createNativeQuery(""" 
            select
                transaction_date_str "transactionDateStr",
                year_char as "yearChar",
                mother_code as "motherCode",
                sub_code as "subCode",
                sub_sub_code as "subSubCode",
                mother_account as "motherAccount",
                sub_account as "subAccount",
                sub_sub_account as "subSubAccount", 
                code as "code",
                description as "description",
                normal_side as "normalSide",
                sum(debit) as "debit",
                sum(credit) as "credit",
                case 
                    when normal_side = 'CREDIT'
                    then sum(balance * -1) 
                    else sum(balance)
                end as "balance"
            from accounting.save_accounts 
            where
                transaction_date_str <= :end
                and company_id = :company
            group by 
                id,
                transaction_date,
                transaction_date_str,
                year_char,
                mother_code,
                sub_code,
                sub_sub_code,
                mother_account,
                sub_account,
                sub_sub_account,
                code,
                description,
                normal_side
            order by created_date;
            """)
                .setParameter('end',end)
                .setParameter('company',company)
        .unwrap(NativeQuery.class)
        .setResultTransformer(Transformers.aliasToBean(SavedAccounts.class))
        .resultList
    }

    @GraphQLQuery(name='saveAccountSummaryMonth')
    List<SavedAccounts> saveAccountSummaryMonth(
        @GraphQLArgument(name = "month") String month
    ){

        def company = SecurityUtils.currentCompany()

        entityManager.createNativeQuery(""" 
            select
                transaction_date_str "transactionDateStr",
                year_char as "yearChar",
                mother_code as "motherCode",
                sub_code as "subCode",
                sub_sub_code as "subSubCode",
                mother_account as "motherAccount",
                sub_account as "subAccount",
                sub_sub_account as "subSubAccount", 
                code as "code",
                description as "description",
                normal_side as "normalSide",
                sum(debit) as "debit",
                sum(credit) as "credit",
                case 
                    when normal_side = 'CREDIT'
                    then sum(balance * -1) 
                    else sum(balance)
                end as "balance"
            from accounting.save_accounts 
            where
                transaction_date_str = :month
                and company_id = :company
            group by 
                id,
                transaction_date,
                transaction_date_str,
                year_char,
                mother_code,
                sub_code,
                sub_sub_code,
                mother_account,
                sub_account,
                sub_sub_account,
                code,
                description,
                normal_side
            order by created_date;
            """)
                .setParameter('month',month)
                .setParameter('company',company)
                .unwrap(NativeQuery.class)
                .setResultTransformer(Transformers.aliasToBean(SavedAccounts.class))
                .resultList
    }

    @GraphQLQuery(name='getExistingTrialBalance')
    List<SavedAccounts> getExistingTrialBalance(
            @GraphQLArgument(name = "monthDate") String monthDate
    ){
        try{
            def company = SecurityUtils.currentCompany()
            createQuery(""" 
                    Select s from SavedAccounts s
                    where s.transactionDateStr = :monthDate
                    and s.companyId = :company
            """)
                    .setParameter('monthDate',monthDate)
                    .setParameter('company',company)
                    .resultList
        }
        catch (e) {
            return  []
        }
    }


    @Transactional(rollbackFor = Exception.class)
    void deleteExistingMonth(String start) {
        int rowsAffected = entityManager.createNativeQuery(
                "DELETE FROM accounting.save_accounts WHERE transaction_date_str = :start"
        ).setParameter("start", start).executeUpdate()
        // Handle the response or return it as needed
    }

    @GraphQLQuery(name = 'fetchAccounts')
    List<String>   fetchAccounts(
            @GraphQLArgument(name = "start") String  start,
            @GraphQLArgument(name = "end") String  end
    ){
        try{
            def company = SecurityUtils.currentCompany()
            entityManager.createNativeQuery("""
            select
                cast(
                    jsonb_build_object(
                    'motherCode',l.journal_account -> 'motherAccount'->>'code',
                    'motherAccount',l.journal_account -> 'motherAccount'->>'accountName',
                    'subCode', l.journal_account -> 'subAccount' ->> 'code',
                    'subAccount', l.journal_account -> 'subAccount' ->> 'accountName',
                    'subSubCode', l.journal_account -> 'subSubAccount' ->> 'code',
                    'subSubAccount', l.journal_account -> 'subSubAccount' ->> 'accountName',
                    'code',l.journal_account ->> 'code',
                    'accountName', l.journal_account ->> 'accountName',
                    'normalSide',l.journal_account -> 'motherAccount'->>'normalSide',
                    'account_type',coa.account_type,
                    'debit',sum(l.debit),
                    'credit', sum(l.credit),
                    'balance', sum(l.debit) - sum(l.credit)
                    ) as text) as fields
                from accounting.ledger l 
                left join accounting.parent_account coa on coa.code  = l.journal_account -> 'motherAccount'->>'code'
                where (l.transaction_date_only  >= cast(:startDate as date) and l.transaction_date_only  <= cast(:endDate as date))
                and l.approved_by is not null
                and coa.account_type is not null
                group by  l.journal_account -> 'motherAccount'->>'code',
                 l.journal_account -> 'motherAccount'->>'accountName',
                 l.journal_account -> 'subAccount' ->> 'code',
                 l.journal_account -> 'subAccount' ->> 'accountName',
                 l.journal_account -> 'subSubAccount' ->> 'code',
                 l.journal_account -> 'subSubAccount' ->> 'accountName',
                 l.journal_account -> 'motherAccount'->>'normalSide',
                 l.journal_account ->> 'code',
                 l.journal_account ->> 'accountName',
                 coa.account_type
                order by  l.journal_account -> 'motherAccount'->>'accountName'
        """).setParameter('startDate',start).setParameter('endDate',end).getResultList()
        }
        catch (e) {
            return []
        }
    }

    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation(name='onGenerateMonthlyTrialBalance')
    Boolean onGenerateMonthlyTrialBalance(
            @GraphQLArgument(name = "start") String start,
            @GraphQLArgument(name = "end") String end,
            @GraphQLArgument(name = "fiscalId") UUID fiscalId,
            @GraphQLArgument(name = "fields") Map<String, Object> fields
    ) {
            def fiscal = fiscalServices.upsertFiscal(fiscalId,fields)
            if(fiscal) {
                def existing = getExistingTrialBalance(start) ?: []
                if (existing) {
                    deleteExistingMonth(start)
                }

                def monthAccounts = fetchAccounts(start,end)
                if (monthAccounts) {
                    monthAccounts.each {
                        it ->
                            def json = new JsonSlurper()
                            Map<String, Object> resultMap = json.parseText(it) as Map<String, Object>
                            upsertFromMap(null, resultMap, { sa, isInsert ->
                                if (isInsert) {
                                    sa.transactionDate = LocalDate.parse(start)
                                    sa.transactionDateStr = start
                                    sa.yearChar = sa.transactionDate.getYear()
                                }
                            })
                    }
                }
            }
            return true

    }



    @GraphQLMutation(name='onGenerateTrialBalance')
    List<SavedAccounts> onGenerateTrialBalance(
            @GraphQLArgument(name = "start") String  start,
            @GraphQLArgument(name = "end") String  end,
            @GraphQLArgument(name = "sync") Boolean  sync
    ){
        return []
//        if(!savedReport){
//            List<SavedAccounts> accounts = fetchAccounts(start,end)
//            accounts.each {
//                account ->
//                    SavedAccounts item = new SavedAccounts()
//                    item.code = account.code
//                    item.title = account.account
//                    item.debit = account.debit
//                    item.credit = account.credit
//                    item.amount = account.amount
//                    save(item)
//            }
//            return  getSaveItemsByParent(savedReports.id)
//        }
//        if(sync){
//            List<SavedAccounts> accounts = fetchAccounts(start,end)
//            accounts.each {
//                account ->
//                    SavedAccounts item = new SavedAccounts()
//                    item.saveReportId = savedReport.id
//                    item.motherAccount = account.motherAccount
//                    item.description = account.description
//                    item.debit = account.debit
//                    item.credit = account.credit
//                    item.balance = account.balance
//                    save(item)
//            }
//        }
//        return  getSaveItemsByParent(savedReport.id)
    }

    static def mapAmount (BigDecimal amount, String normalSide){
        if (normalSide == 'DEBIT') {
            return amount
        } else {
            if (amount < 0) return amount.abs()
            return amount.negate()
        }
    }


    RemapDto remapReportLayout(List<ReportsLayoutItem> data, Map<String,SavedAccounts> accountsMapped, Boolean isHide = false, Boolean isChild = false) {
        RemapDto remapDto = new RemapDto()
        remapDto.mapTotal = [:]
        remapDto.list = []
        remapDto.total = 0.00

        data.findAll {
            isChild ? it.reportLayoutItemsParent != null : it.reportLayoutItemsParent == null
        }.sort {it.createdDate}.eachWithIndex { node, index ->
            def newNode = new FinancialReportDto(
                    order: index,
                    id: node.id,
                    title: node?.account?.accountName ?: node.title,
                    normalSide: node?.normalSide,
                    isGroup: node?.isGroup,
                    isChild: node?.account ? true : false,
                    isFormula: node?.isFormula,
                    isHide: node?.config?.hideGroupAccounts
            )

            if(node?.account){
                String normalSide = NormalSide.DEBIT.name()
                if(node.reportLayoutItemsParent){
                    if(node.reportLayoutItemsParent.normalSide.name() != accountsMapped[node?.account?.code]?.normalSide)
                        normalSide = node.reportLayoutItemsParent.normalSide.name()
                }
                newNode.amount =  mapAmount(accountsMapped[node?.account?.code]?.balance ?: 0.00,normalSide)
                remapDto.total += newNode.amount
            }

            def children = []

            if (node.reportsChild) {
                def remap = remapReportLayout(node.reportsChild, accountsMapped, node?.config?.hideGroupAccounts, true)
                children = remap.list
                if(!node?.config?.hideGroupAccounts) {
                    children.push(new FinancialReportDto(
                            order: remap.list.size(),
                            id: node.id,
                            title: node?.config?.totalLabel ?: "Total ${node.title}",
                            amount: remap.total,
                            isTotal: true
                    ))
                }else {
                    newNode.amount = remap.total
                }
                remapDto.mapTotal[node.id] = new FinancialReportDto(
                        id: node.id,
                        title: node?.account?.accountName ?: node.title,
                        normalSide: node?.normalSide,
                        amount: remap.total,
                )
                if(node.isGroup){
                    remapDto.total += remap.total
                }
            }

            newNode.rows = new Gson().toJson(children.sort {it.order})

            if(node.isFormula){
                BigDecimal amount = 0.00
                node.formulaGroups.eachWithIndex{
                    operands, opIndex ->
                        FinancialReportDto finOperand = remapDto.mapTotal[UUID.fromString(operands)]
                        BigDecimal operandAmount = finOperand?.amount ?: 0.00
                        if(node.itemType.equalsIgnoreCase('+')){
                            amount += operandAmount
                        }
                        if(node.itemType.equalsIgnoreCase('-')){
                            if(opIndex == 0)
                                amount = operandAmount
                            else
                                amount -= operandAmount
                        }
                }
                newNode.amount = amount

                remapDto.mapTotal[node.id] = new FinancialReportDto(
                        id: node.id,
                        title: node.title,
                        normalSide: 'DEBIT',
                        amount: amount
                )
            }

            if(!isHide) {
                remapDto.list << newNode
            }
        }


        return remapDto
    }

    @GraphQLQuery(name='onGenerateProfitAndLoss')
    List<FinancialReportDto> onGenerateProfitAndLoss(
            @GraphQLArgument(name = "reportLayoutId") UUID  reportLayoutId,
            @GraphQLArgument(name = "start") String  start,
            @GraphQLArgument(name = "end") String  end
    ){
        def reportLayout = reportsLayoutServices.findOne(reportLayoutId)
        if(!reportLayout)
            return []

        def reportLayoutMainGroup = reportsLayoutItemServices.getReportItemsByReportType(reportLayout.reportType)
        if(!reportLayoutMainGroup)
            return []

        def trialBalance = getSaveAccountsMother(start,end)
        Map<String,SavedAccounts> accountsMapped = [:]
        trialBalance.each {
            tb->
                // update this to tb.code later on
                accountsMapped[tb.account] = tb
        }

        return remapReportLayout(reportLayoutMainGroup,accountsMapped,false,false).list
    }


    @GraphQLQuery(name='onGenerateSaveAccounts')
    List<FinancialReportDto> onGenerateSaveAccounts(
            @GraphQLArgument(name = "reportLayoutId") UUID  reportLayoutId,
            @GraphQLArgument(name = "durationType") String  durationType,
            @GraphQLArgument(name = "end") String  end
    ){
        def reportLayout = reportsLayoutServices.findOne(reportLayoutId)
        if(!reportLayout)
            return []

        def reportLayoutMainGroup = reportsLayoutItemServices.getReportItemsByReportId(reportLayout.id)
        if(!reportLayoutMainGroup)
            return []

        def reportData = []
        if(durationType.equalsIgnoreCase('MONTH')) {
            reportData = saveAccountSummaryMonth(end)
        }
        else {
            reportData = saveAccountSummary(end)
        }

        Map<String,SavedAccounts> accountsMapped = [:]
        reportData.each {
            tb->
                if(accountsMapped["${tb.motherCode}-0000-0000"]){
                    accountsMapped["${tb.motherCode}-0000-0000"].debit += tb.debit
                    accountsMapped["${tb.motherCode}-0000-0000"].credit += tb.credit
                    accountsMapped["${tb.motherCode}-0000-0000"].balance += tb.balance
                }
                else {
                    def mother = new SavedAccounts()
                    BeanUtils.copyProperties(mother, tb);
                    mother.id = null
                    mother.subCode = null
                    mother.subAccount = null
                    accountsMapped["${tb.motherCode}-0000-0000"] = mother
                }

                if(tb.subCode) {
                    if (accountsMapped["${tb.motherCode}-${tb.subCode}-0000"]) {
                        accountsMapped["${tb.motherCode}-${tb.subCode}-0000"].debit += tb.debit
                        accountsMapped["${tb.motherCode}-${tb.subCode}-0000"].credit += tb.credit
                        accountsMapped["${tb.motherCode}-${tb.subCode}-0000"].balance += tb.balance
                    } else {
                        def sub = new SavedAccounts()
                        BeanUtils.copyProperties(sub, tb);
                        sub.id = null
                        sub.subSubCode = null
                        sub.subSubAccount = null
                        accountsMapped["${tb.motherCode}-${tb.subCode}-0000"] = sub
                    }
                }

                accountsMapped[tb.code] = tb
        }

        return remapReportLayout(reportLayoutMainGroup,accountsMapped,false,false).list
    }


}
