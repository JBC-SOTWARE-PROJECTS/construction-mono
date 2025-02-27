package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.AccountType
import com.backend.gbp.domain.accounting.NormalSide
import com.backend.gbp.domain.accounting.ReportType
import com.backend.gbp.domain.accounting.ReportsLayout
import com.backend.gbp.domain.accounting.ReportsLayoutItem
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.services.EntityObjectMapperService
import com.backend.gbp.services.GeneratorService
import groovy.transform.Canonical
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

import javax.persistence.EntityManager
import javax.persistence.NoResultException
import javax.transaction.Transactional
import java.time.ZoneId
import java.time.format.DateTimeFormatter

@Canonical
class ReportsLayoutItemDto {
    UUID key
    String title
    Boolean disableCheckbox
    List<ReportsLayoutItemDto> children
}

@Canonical
class ReportsLayoutDto {
    String id
    String title
    List<ReportsLayoutItemDto> children
}

@Canonical
class ReportLayoutDefaultDto {
    UUID id
    Integer lastCount
}



@TypeChecked
@Service
@GraphQLApi
@Transactional(rollbackOn = Exception.class)
class ReportsLayoutServices extends ArAbstractFormulaHelper<ReportsLayout> {

    ReportsLayoutServices(){
        super(ReportsLayout.class)
    }

    @Autowired
    GeneratorService generatorService

    @Autowired
    EntityManager entityManager

    @Autowired
    EntityObjectMapperService entityObjectMapperService

    @Autowired
    ParentAccountServices chartOfAccountServices

    @Autowired
    ReportsLayoutItemServices reportsLayoutItemServices


    @GraphQLMutation(name="createReportsLayout")
    GraphQLResVal<ReportsLayout> createReportsLayout(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "fields") Map<String,Object> fields
    ){
        def report = upsertFromMap(id, fields,{
            it , isInsert ->
                if(!isInsert){
//                        if(fields['currentYearEarningsFormula']){
//                            if(!it?.config) {
//                                it?.config = new ReportConfig()
//                            }
//                            it?.config?.currentYearEarningsFormula = UUID.fromString((fields['currentYearEarningsFormula'] as String))
//
//                        }
                }
        })
        return new GraphQLResVal<ReportsLayout>(report, true, "Invoice transaction completed successfully")
    }

    @GraphQLQuery(name="findActiveReportLayoutByType")
    ReportsLayout findActiveReportLayoutByType(
            @GraphQLArgument(name = "reportType") ReportType reportType
    ){
        createQuery("""
                Select r from ReportsLayout r where r.reportType = :reportType
                and r.isActive is true
            """).setParameter('reportType', reportType).singleResult
    }

    @GraphQLMutation(name="onToggleDefaultReportsLayout")
    GraphQLResVal<Boolean> onToggleDefaultReportsLayout(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "reportType") ReportType reportType
    ){
        def activeRecord = findActiveReportLayoutByType(reportType)
        if(activeRecord) {
            activeRecord.isActive = false
            save(activeRecord)
        }

        def newActive = findOne(id)
        newActive.isActive = true
        save(newActive)

        return new GraphQLResVal<Boolean>(true, true, "Invoice transaction completed successfully")
    }

    @GraphQLQuery(name="findStandardReportLayoutByType")
    ReportsLayout findStandardReportLayoutByType(
            @GraphQLArgument(name = "reportType") ReportType reportType
    ){
        try{
            createQuery("""
                Select r from ReportsLayout r where r.reportType = :reportType
                and r.isStandard is true
            """).setParameter('reportType', reportType).singleResult
        }catch (ignore){
            return null
        }

    }

    @GraphQLQuery(name="findOneReportLayoutById")
    ReportsLayout findOneReportLayoutById(
            @GraphQLArgument(name = "id") UUID id
    ){
        createQuery("""
                Select r from ReportsLayout r where r.id = :id and r.isActive is true
            """).setParameter('id', id).singleResult
    }

    @GraphQLQuery(name="checkExistingReportLayout")
    ReportsLayout checkExistingReportLayout(
            @GraphQLArgument(name = "reportType") ReportType reportType
    ){
        try {
            def report = createQuery("""
                Select r from ReportsLayout r where r.reportType = :reportType and r.isActive is true
            """).setParameter('reportType', reportType).singleResult

            if (report) {
                return report
            } else {
                return generateStandardReport(reportType)
            }
        } catch (NoResultException e) {
            return generateStandardReport(reportType)
        }
    }


    @GraphQLQuery(name="getReportLayoutByType")
    ReportsLayout getReportLayoutByType(
            @GraphQLArgument(name = "reportType") ReportType reportType
    ){
        createQuery(""" 
                Select r from ReportsLayout r
                WHERE r.reportType = :reportType and r.isActive is true
        """).setParameter("reportType",reportType).singleResult
    }

    @GraphQLQuery(name="getAllCustomReportLayoutByType")
    List<ReportsLayout> getAllCustomReportLayoutByType(
            @GraphQLArgument(name = "reportType") ReportType reportType
    ){
        createQuery(""" 
                Select r from ReportsLayout r
                WHERE r.reportType = :reportType
                and r.isStandard is false
                order by r.createdDate
        """)
                .setParameter("reportType",reportType)
                .resultList
    }

    @GraphQLQuery(name="getAllReportLayoutByType")
    List<ReportsLayout> getAllReportLayoutByType(
            @GraphQLArgument(name = "reportType") ReportType reportType
    ){
        createQuery(""" 
                Select r from ReportsLayout r
                WHERE r.reportType = :reportType
        """)
                .setParameter("reportType",reportType)
                .resultList
    }

    List<ReportsLayoutItemDto> remapTreeData(List<ReportsLayoutItem> data,Boolean isChild = false) {
        List<ReportsLayoutItemDto> result = []

        data.findAll {
            isChild ? it.reportLayoutItemsParent != null : it.reportLayoutItemsParent == null
        }.sort {it.orderNo}.each { node ->
            def newNode = new ReportsLayoutItemDto(
                    key: node.id,
                    title: node?.account?.accountName ?: node.title,
                    disableCheckbox: node.isGroup
            )

            if (node.reportsChild) {
                newNode.children = remapTreeData(node.reportsChild, true)
            }

            result << newNode
        }

        return result
    }

    ReportLayoutDefaultDto addSingleGroupReportLayout(ReportsLayout standard, List<AccountType> accountTypes, String title, NormalSide normalSide, Integer order){
        Map<AccountType,Boolean> mapAccountType = [:]
        accountTypes.each {
            it -> mapAccountType[it] = true
        }

        def existingAccounts = reportsLayoutItemServices.getAccountByAccountType(standard.id, accountTypes.collect{it.name()})
        Map<String,ReportsLayoutItem> accounts = [:]
        existingAccounts.each { ex ->
            accounts[ex.code] = ex
            accounts[ex.code].exist = false
        }

        // Group
        def group = new ReportsLayoutItem()
        def existingItem = reportsLayoutItemServices.getReportsLayoutItemByTitle(standard.id,title)
        if(existingItem.isPresent()){
            group = existingItem.get()
        }

        group.reportsLayoutId = standard
        group.orderNo = order
        group.isGroup = true
        group.title = title
        group.normalSide = normalSide
        group = reportsLayoutItemServices.save(group)


        chartOfAccountServices.findAll().findAll {
            if(accounts[it.accountCode] && mapAccountType[it.accountType]) {
                accounts[it.accountCode].exist = true
            }else {
                if (it.accountCode && !accounts[it.accountCode] && mapAccountType[it.accountType]) {
                    ReportsLayoutItem item = new ReportsLayoutItem()
                    item.code = it.accountCode
                    item.reportsLayoutId = standard
                    item.reportLayoutItemsParent = group
                    item.accountType = it.accountType
                    ChartOfAccountGenerate coa = new ChartOfAccountGenerate()
                    coa.code = it.accountCode
                    coa.accountName = it.accountName
                    CoaComponentContainer motherAccount = new CoaComponentContainer()
                    motherAccount.id = it.id
                    motherAccount.code = it.accountCode
                    motherAccount.accountName = it.accountName
                    motherAccount.normalSide = it.normalSide
                    coa.motherAccount = motherAccount
                    item.account = coa
                    item.orderNo = order
                    reportsLayoutItemServices.save(item)
                    order+=1
                }
            }
        }

        accounts.each {key, value ->
            if(!value.exist) {
                group.getReportsChild().removeIf({ child -> child.id == value.id });
                standard.getReportsItem().removeIf ({ child -> child.id == value.id })
            }
        }

        return new ReportLayoutDefaultDto(group.id,order)
    }

    ReportsLayoutItem addDefaultFormula(ReportsLayout standard,String title, String itemType,List<String> formulaGroups,Integer order) {
        def formula = new ReportsLayoutItem()

        def existingItem = reportsLayoutItemServices.getReportsLayoutItemByTitle(standard.id,title)

        if(existingItem.isPresent()){
            formula = existingItem.get()
        }

        formula.reportsLayoutId = standard
        formula.orderNo = order
        formula.title = title
        formula.itemType = itemType
        formula.isFormula = true
        formula.formulaGroups = formulaGroups
        reportsLayoutItemServices.save(formula)
        return formula
    }

    ReportsLayout generateProfitAndLoss(){
        Integer order = 0
        def standard = findStandardReportLayoutByType(ReportType.PROFIT_AND_LOSS)

        if(!standard) {
            standard = new ReportsLayout()
            standard.reportType = ReportType.PROFIT_AND_LOSS
            standard.title = 'Profit and Loss'
            standard.layoutName = 'Profit and Loss'
            standard.isStandard = true
            standard.isActive = true
            standard = save(standard)
        }

        List<AccountType> revenueTypes = Arrays.asList(AccountType.REVENUE,AccountType.SALE)
        ReportLayoutDefaultDto revGroup = addSingleGroupReportLayout(standard,revenueTypes,'REVENUE',NormalSide.CREDIT,order+=1)
        order = revGroup.lastCount

        List<AccountType> costOfSaleTypes = Arrays.asList(AccountType.COST_OF_SALE)
        ReportLayoutDefaultDto costOfSaleGroup = addSingleGroupReportLayout(standard,costOfSaleTypes,'COST OF SALE',NormalSide.DEBIT,order+=1)
        order = costOfSaleGroup.lastCount

        List<String> grossProfitVar = Arrays.asList(revGroup.id.toString(),costOfSaleGroup.id.toString())
        ReportsLayoutItem grossProfit = addDefaultFormula(standard,'Gross Profit','-',grossProfitVar,order+=1)

        List<AccountType> otherIncomeType = Arrays.asList(AccountType.OTHER_INCOME)
        ReportLayoutDefaultDto otherIncomeGroup = addSingleGroupReportLayout(standard,otherIncomeType,'OTHER INCOME',NormalSide.CREDIT,order+=1)
        order = otherIncomeGroup.lastCount

        List<String> grossIncomeVar = Arrays.asList(grossProfit.id.toString(),otherIncomeGroup.id.toString())
        ReportsLayoutItem grossIncome = addDefaultFormula(standard,'Gross Income','+',grossIncomeVar,order+=1)

        List<AccountType> expenseTypes = Arrays.asList(AccountType.OPERATING_EXPENSE,AccountType.EXPENSES)
        ReportLayoutDefaultDto expenseGroup = addSingleGroupReportLayout(standard,expenseTypes,'EXPENSE',NormalSide.DEBIT,order+=1)
        order = expenseGroup.lastCount

        List<String> operatingIncomeVar = Arrays.asList(grossIncome.id.toString(),expenseGroup.id.toString())
        ReportsLayoutItem operatingIncome = addDefaultFormula(standard,'NET OPERATING INCOME','-',operatingIncomeVar,order+=1)

//        List<AccountType> financeType = Arrays.asList(AccountType.FINANCE_EXPENSE)
//        ReportLayoutDefaultDto financeGroup = addSingleGroupReportLayout(standard,financeType,'FINANCIAL COST',NormalSide.DEBIT,order+=1)
//        order = financeGroup.lastCount
//
//        List<String> netIncomeVar = Arrays.asList(operatingIncome.id.toString(),financeGroup.id.toString())
//        ReportsLayoutItem netIncomeBeforeTax = addDefaultFormula(standard,'NET INCOME BEFORE TAX','-',netIncomeVar,order+=1)
//
//        List<AccountType> taxExpenseType = Arrays.asList(AccountType.TAX_EXPENSE)
//        ReportLayoutDefaultDto taxExpenseGroup = addSingleGroupReportLayout(standard,taxExpenseType,'INCOME TAX EXPENSE',NormalSide.DEBIT,order+=1)
//        order = taxExpenseGroup.lastCount
//
//        List<String> comprehensiveNetIncomeVar = Arrays.asList(netIncomeBeforeTax.id.toString(),taxExpenseGroup.id.toString())
//        addDefaultFormula(standard,'COMPREHENSIVE NET INCOME','-',comprehensiveNetIncomeVar,order+=1)

        return  standard
    }

    ReportsLayoutItem addBalanceSheetDefaultPrimaryGroup (ReportsLayout standard,String title,NormalSide normalSide,Integer order){
        // Group
        def group = new ReportsLayoutItem()
        def existingItem = reportsLayoutItemServices.getReportsLayoutItemByTitle(standard.id,title)
        if(existingItem.isPresent()){
            group = existingItem.get()
        }

        group.reportsLayoutId = standard
        group.orderNo = order
        group.isGroup = true
        group.title = title
        group.normalSide = normalSide
        group = reportsLayoutItemServices.save(group)
        return  group
    }

    ReportLayoutDefaultDto addBalanceSheetDefaultAccount(ReportsLayoutItem primaryGroup, List<AccountType> accountTypes, String title, NormalSide normalSide,Integer order){
        Map<AccountType,Boolean> mapAccountType = [:]
        accountTypes.each {
            it -> mapAccountType[it] = true
        }

        // Group
        def group = new ReportsLayoutItem()
        def existingItem = reportsLayoutItemServices.getReportsLayoutItemByTitle(primaryGroup.reportsLayoutId.id,title)
        if(existingItem.isPresent()){
            group = existingItem.get()
        }

        group.reportsLayoutId = primaryGroup.reportsLayoutId
        group.reportLayoutItemsParent = primaryGroup
        group.orderNo = order
        group.isGroup = true
        group.title = title
        group.normalSide = normalSide
        group = reportsLayoutItemServices.save(group)

        def existingAccounts = reportsLayoutItemServices.getAccountByGroupAccountType(primaryGroup.reportsLayoutId.id,group.id)
        Map<String,ReportsLayoutItem> accounts = [:]
        existingAccounts.each { ex ->
            accounts[ex.code] = ex
            accounts[ex.code].exist = false
        }




        chartOfAccountServices.findAll().findAll {
            if(accounts[it.accountCode] && mapAccountType[it.accountType]) {
                accounts[it.accountCode].exist = true
            }else {
                if (it.accountCode && !accounts[it.accountCode] && mapAccountType[it.accountType]) {
                    ReportsLayoutItem item = new ReportsLayoutItem()
                    item.code = it.accountCode
                    item.reportsLayoutId = primaryGroup.reportsLayoutId
                    item.reportLayoutItemsParent = group
                    item.accountType = it.accountType
                    ChartOfAccountGenerate coa = new ChartOfAccountGenerate()
                    coa.code = it.accountCode
                    coa.accountName = it.description
                    CoaComponentContainer motherAccount = new CoaComponentContainer()
                    motherAccount.id = it.id
                    motherAccount.code = it.accountCode
                    motherAccount.accountName = it.description
                    motherAccount.normalSide = it.normalSide
                    coa.motherAccount = motherAccount
                    item.account = coa
                    item.orderNo = order
                    reportsLayoutItemServices.save(item)
                    order+=1
                }
            }
        }

        accounts.each {key, value ->
            if(!value.exist) {
                group.getReportsChild().removeIf({ child -> child.id == value.id })
                group.reportLayoutItemsParent.getReportsChild().removeIf({ child -> child.id == value.id })
                primaryGroup.reportsLayoutId.getReportsItem().removeIf ({ child -> child.id == value.id })
            }
        }

        return new ReportLayoutDefaultDto(group.id,order)
    }

    ReportsLayout generateBalanceSheet(){
        Integer order = 0
        def standard = findStandardReportLayoutByType(ReportType.BALANCE_SHEET)

        if(!standard) {
            standard = new ReportsLayout()
            standard.reportType = ReportType.BALANCE_SHEET
            standard.layoutName = "Balance Sheet"
            standard.title = "Balance Sheet"
            standard.isStandard = true
            standard.isActive = true
            standard = save(standard)
        }

        // ASSET
        ReportsLayoutItem assetGroup = addBalanceSheetDefaultPrimaryGroup(standard,'ASSET',NormalSide.DEBIT,order+=1)

        List<AccountType> bankType = Arrays.asList(AccountType.BANK)
        ReportLayoutDefaultDto bankGroup = addBalanceSheetDefaultAccount(assetGroup,bankType,'BANK',NormalSide.DEBIT,order+=1)
        order = bankGroup.lastCount

        List<AccountType> currentAssetType = Arrays.asList(AccountType.CURRENT_ASSETS,AccountType.ASSET)
        ReportLayoutDefaultDto currentAssetGroup = addBalanceSheetDefaultAccount(assetGroup,currentAssetType,'CURRENT ASSET',NormalSide.DEBIT,order+=1)
        order = currentAssetGroup.lastCount

        List<AccountType> fixedAssetType = Arrays.asList(AccountType.FIXED_ASSETS)
        ReportLayoutDefaultDto fixedAssetGroup = addBalanceSheetDefaultAccount(assetGroup,fixedAssetType,'FIXED ASSET',NormalSide.DEBIT,order+=1)
        order = fixedAssetGroup.lastCount

        List<AccountType> nonCurrentAssetType = Arrays.asList(AccountType.LONG_TERM_ASSETS)
        ReportLayoutDefaultDto nonCurrentAssetGroup = addBalanceSheetDefaultAccount(assetGroup,nonCurrentAssetType,'NON-CURRENT ASSET',NormalSide.DEBIT,order+=1)
        order = nonCurrentAssetGroup.lastCount

        // LIABILITIES
        ReportsLayoutItem liabilities = addBalanceSheetDefaultPrimaryGroup(standard,'LIABILITIES',NormalSide.CREDIT,order+=1)

        List<AccountType> currentLiabilitiesType = Arrays.asList(AccountType.CURRENT_LIABILITIES,AccountType.LIABILITY)
        ReportLayoutDefaultDto currentLiabilitiesGroup = addBalanceSheetDefaultAccount(liabilities,currentLiabilitiesType,'CURRENT LIABILITIES',NormalSide.CREDIT,order+=1)
        order = currentLiabilitiesGroup.lastCount

        List<AccountType> nonCurrentLiabilitiesType = Arrays.asList(AccountType.LONG_TERM_LIABILITIES)
        ReportLayoutDefaultDto nonCurrentLiabilitiesGroup = addBalanceSheetDefaultAccount(liabilities,nonCurrentLiabilitiesType,'NON-CURRENT LIABILITIES',NormalSide.CREDIT,order+=1)
        order = nonCurrentLiabilitiesGroup.lastCount

        List<String> netAssetsVar = Arrays.asList(assetGroup.id.toString(),liabilities.id.toString())
        ReportsLayoutItem netAssets = addDefaultFormula(standard,'NET ASSETS','-',netAssetsVar,order+=1)

        // EQUITY
        List<AccountType> equityType = Arrays.asList(AccountType.EQUITY)
        addSingleGroupReportLayout(standard,equityType,'EQUITY',NormalSide.CREDIT,order+=1)

        return standard
    }

    ReportsLayout generateCashFlow(){
        Integer order = 0
        def standard = findStandardReportLayoutByType(ReportType.CASH_POSITION)

        if(!standard) {
            standard = new ReportsLayout()
            standard.reportType = ReportType.CASH_POSITION
            standard.layoutName = "Cash Flow"
            standard.title = "Cash Flow"
            standard.isStandard = true
            standard.isActive = true
            standard = save(standard)
        }

        // Cash flow from Operating Activities
        ReportsLayoutItem operatingAct = addBalanceSheetDefaultPrimaryGroup(standard,'CASH FLOW FROM OPERATING ACTIVITIES', NormalSide.CREDIT,order+=1)
//
//        List<AccountType> bankType = Arrays.asList(AccountType.BANK)
//        ReportLayoutDefaultDto bankGroup = addBalanceSheetDefaultAccount(operatingAct,bankType,'BANK',NormalSide.DEBIT,order+=1)
//        order = bankGroup.lastCount

        return standard
    }

    @GraphQLMutation(name="generateStandardReport")
    ReportsLayout generateStandardReport(
            @GraphQLArgument(name="reportType") ReportType reportType
    ){
        if(reportType == ReportType.PROFIT_AND_LOSS){
            return generateProfitAndLoss()
        }
        if(reportType == ReportType.BALANCE_SHEET){
            return generateBalanceSheet()
        }
        if(reportType == ReportType.CASH_POSITION){
            return generateCashFlow()
        }
    }
}
