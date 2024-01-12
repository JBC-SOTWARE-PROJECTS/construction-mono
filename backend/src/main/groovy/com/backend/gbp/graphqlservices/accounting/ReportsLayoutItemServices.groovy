package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.ParentAccount
import com.backend.gbp.domain.accounting.ReportItemConfig
import com.backend.gbp.domain.accounting.ReportType
import com.backend.gbp.domain.accounting.ReportsLayout
import com.backend.gbp.domain.accounting.ReportsLayoutItem
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.services.EntityObjectMapperService
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

import javax.persistence.EntityManager
import javax.transaction.Transactional

@Service
@GraphQLApi
@Transactional(rollbackOn = Exception.class)
class ReportsLayoutItemServices extends ArAbstractFormulaHelper<ReportsLayoutItem> {

    ReportsLayoutItemServices(){
        super(ReportsLayoutItem.class)
    }

    @Autowired
    EntityObjectMapperService entityObjectMapperService

    @Autowired
    EntityManager entityManager

    @Autowired
    ParentAccountServices chartOfAccountServices

    @Autowired
    SubAccountSetupService subAccountSetupService

    @GraphQLQuery(name = "getAllTopGroupReportsItem", description = "List of main group")
    List<ReportsLayoutItem> getAllTopGroupReportsItem(
            @GraphQLArgument(name = "reportLayoutId") UUID reportLayoutId
    ) {
        createQuery("""
            Select r from ReportsLayoutItem r
            where 
            r.reportsLayoutId.id = :reportLayoutId
            and r.account is null 
            and r.reportLayoutItemsParent is null 
            order by r.orderNo
        """)
                .setParameter('reportLayoutId',reportLayoutId).resultList
    }


    def updateOrderWithinParent(ReportsLayoutItem item,Integer beforeUpdate) {
        if(item.reportLayoutItemsParent){
            if (item?.reportLayoutItemsParent?.reportsChild && item?.reportLayoutItemsParent?.reportsChild instanceof List) {
                Integer indexStart = 0
                def siblings = item.reportLayoutItemsParent.reportsChild.findAll { it.id != item.id && it.orderNo >= item.orderNo }
                siblings.sort { a, b -> a.orderNo <=> b.orderNo }
                // Recalculate order values for siblings
                indexStart = item.orderNo
                siblings.eachWithIndex { sibling, index ->
                    indexStart += 1
                    sibling.orderNo = indexStart + 1
                }

                if(item.orderNo > 1 ) {
                    def siblingsTop = item.reportLayoutItemsParent.reportsChild.findAll { it.id != item.id && it.orderNo < item.orderNo }
                    siblingsTop.sort { a, b -> a.orderNo <=> b.orderNo }
                    // Recalculate order values for siblings
                    indexStart = item.orderNo
                    siblingsTop.eachWithIndex { sibling, index ->
                        indexStart -= 1
                        sibling.orderNo = indexStart
                    }
                }

            }
        }
        else {
            List<ReportsLayoutItem> topGroup = getAllTopGroupReportsItem(item.reportsLayoutId.id)
            if (topGroup) {
                if(item.orderNo > beforeUpdate){
                    Integer indexStart = item.orderNo
                    def siblingsTop = topGroup
                            .findAll {
                                it.id != item.id && it.orderNo <= item.orderNo
                            }
                    siblingsTop.sort { a, b -> b.orderNo <=> a.orderNo }
                    // Recalculate order values for siblings
                    siblingsTop.eachWithIndex { sibling, index ->
                        indexStart -= 1
                        sibling.orderNo = indexStart
                    }
                }
                else {
                    Integer indexStart = item.orderNo + 1
                    if(item.orderNo == 1) indexStart = 2
                    def siblings = topGroup
                            .findAll {
                                it.id != item.id && it.orderNo > item.orderNo && it.orderNo < topGroup.size()
                            }
                    siblings.sort { a, b -> a.orderNo <=> b.orderNo }
                    // Recalculate order values for siblings
                    siblings.eachWithIndex { sibling, index ->
                        indexStart += 1
                        sibling.orderNo = indexStart
                    }
                    item.orderNo += 1
                }
            }
        }
    }


    void countGroupChild(Integer count, ReportsLayoutItem child){
        if(child.reportLayoutItemsParent) {
            count += 1;
            countGroupChild(count, child.reportLayoutItemsParent)
        }
        else {
            Integer max = child?.reportsLayoutId?.config?.maximumChild ?: 0
            if(count > max) {
                ReportsLayout reportsLayout = child.reportsLayoutId
                reportsLayout.config = [:]
                reportsLayout.config['maximumChild'] = count
            }
        }
    }


    @GraphQLMutation(name="createReportsLayoutItem")
    GraphQLResVal<ReportsLayoutItem> createReportsLayoutItem(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "fields") Map<String,Object> fields
    ){
        def report = upsertFromMap(id, fields, {it , forInsert ->
            if(forInsert) {
                if (it.isGroup) {
                    countGroupChild(0,it)
                }
                if(it?.reportLayoutItemsParent && !it.isGroup){
                    it.normalSide = it.reportLayoutItemsParent.normalSide ?: NormalSide.DEBIT
                }

                if(!fields['config']){
                    it.config = new ReportItemConfig()
                    it?.config?.isCurrentYearEarningsFormula = false
                    it?.config?.hideGroupAccounts = false
                    it?.config?.totalLabel = ''
                }
            }
            if(fields['formulaGroups']){
                def list = fields['formulaGroups'] as List<String>
                it.formulaGroups = list
            }


        })
        return new GraphQLResVal<ReportsLayoutItem>(report, true, "Transaction completed successfully")
    }

    @GraphQLMutation(name="onAddMultipleAccounts")
    GraphQLResVal<Boolean> onAddMultipleAccounts(
            @GraphQLArgument(name = "parentId") UUID parentId,
            @GraphQLArgument(name = "accounts") List<UUID> accounts
    ){
        ReportsLayoutItem parent = findOne(parentId)
        Integer orderStartingPoint = (parent.reportsChild ?: []).size()
        accounts.each {
            it ->
                ParentAccount coa = chartOfAccountServices.findOne(it) ?: null
                if(coa) {
                    ChartOfAccountGenerate generate = new ChartOfAccountGenerate()
                    generate.motherAccount =  new CoaComponentContainer(coa.accountCode,coa.id,coa.accountName,ParentAccount.class.name,coa.normalSide.name())
                    ReportsLayoutItem child = new ReportsLayoutItem()
                    child.reportsLayoutId = parent.reportsLayoutId
                    child.reportLayoutItemsParent = parent
                    child.account = generate
                    child.orderNo = orderStartingPoint++
                    child.isGroup = false
                    save(child)
                }

        }
        return new GraphQLResVal<Boolean>(true, true, "Delete successfully")
    }


    @GraphQLMutation(name="onAddMultipleSubAccounts")
    GraphQLResVal<Boolean> onAddMultipleSubAccounts(
            @GraphQLArgument(name = "parentId") UUID parentId,
            @GraphQLArgument(name = "accounts") List<Map<String,Object>> accounts
    ){
        ReportsLayoutItem parent = findOne(parentId)
        Integer orderStartingPoint = (parent.reportsChild ?: []).size()
        for (Map<String,Object> entry in accounts ){
            String code = entry.get("code")
            String description = entry.get("description")
            def coa =  subAccountSetupService.getAllChartOfAccountGenerate("","","","","")
            def match =  coa.find {
                it.code == code
            }
            if(!match){
                return   new GraphQLRetVal<Boolean>(false,false,"${code}-${description} is not found in Chart of accounts")
            }
            ReportsLayoutItem child = new ReportsLayoutItem()
            child.reportsLayoutId = parent.reportsLayoutId
            child.reportLayoutItemsParent = parent
            child.account = match
            child.orderNo = orderStartingPoint++
            child.isGroup = false
            save(child)
        }
        return new GraphQLResVal<Boolean>(true, true, "Delete successfully")
    }

    @GraphQLMutation(name="deleteReportItem")
    GraphQLResVal<Boolean> deleteReportItem(
            @GraphQLArgument(name = "id") UUID id
    ){
        try{
            ReportsLayoutItem item = findOne(id)
            ReportsLayoutItem parent = item.reportLayoutItemsParent
            ReportsLayoutItem itemToDelete = item
            if(parent) {
                parent.getReportsChild().remove(itemToDelete)
                itemToDelete.setReportLayoutItemsParent(null)
            }

            ReportsLayout rlParent = item.reportsLayoutId
            if(rlParent) {
                rlParent.getReportsItem().remove(itemToDelete)
                itemToDelete.setReportsLayoutId(null)
            }

            entityManager.remove(itemToDelete); // If you want to immediately delete the item from the database

            return new GraphQLResVal<Boolean>(true, true, "Delete successfully")
        }catch (e){
            return new GraphQLResVal<Boolean>(false, false, "Delete successfully")
        }
    }


    @GraphQLQuery(name = "getAccountsUUIDOnActiveRL", description = "List of charts of Accounts")
    Map<String,String> getAccountsUUIDOnActiveRL(
            @GraphQLArgument(name = "reportType") ReportType reportType
    ) {
        Map<String,String> uuids = [:]
        createQuery("""
            Select r from ReportsLayoutItem r
            left join fetch r.reportsLayoutId  
            where 
            r.reportsLayoutId.isActive is true 
            and r.reportsLayoutId.reportType = :reportType
            and r.account is not null 
        """)
        .setParameter('reportType',reportType)
        .resultList.each {
            it -> uuids[it.account.code] = it.account.code
        }
        return uuids

    }

    @GraphQLQuery(name = "getReportItemByParent", description = "List of child")
    List<ReportsLayoutItem> getReportItemByParent(
            @GraphQLArgument(name = "parentId") UUID parentId
    ) {
        createQuery("""
            Select r from ReportsLayoutItem r
            where 
            r.reportLayoutItemsParent.id = :parentId
            and r.reportLayoutItemsParent is not null 
            order by r.createdDate
        """)
                .setParameter('parentId',parentId).resultList
    }

    @GraphQLQuery(name = "getReportItemsByReportType", description = "List of child")
    List<ReportsLayoutItem> getReportItemsByReportType(
        @GraphQLArgument(name = "reportType") ReportType reportType
    ) {

        createQuery("""
            Select DISTINCT item from ReportsLayoutItem item
            left join fetch item.reportsLayoutId report
            where 
            item.reportLayoutItemsParent is null 
            and report.reportType = :reportType 
            and report.isActive is true
            order by item.createdDate asc
        """)
                .setParameter("reportType",reportType)
                .resultList
    }

    @GraphQLQuery(name = "getReportItemsByReportId", description = "List of child")
    List<ReportsLayoutItem> getReportItemsByReportId(
            @GraphQLArgument(name = "id") UUID id
    ) {
        createQuery("""
            Select DISTINCT item 
            from ReportsLayoutItem item
            left join fetch item.reportsLayoutId report
            where 
            item.reportLayoutItemsParent is null 
            and report.id = :id 
            and report.isActive is true
            order by item.createdDate asc
        """)
            .setParameter("id",id)
            .resultList
    }


    @GraphQLQuery(name = "getFormulaItems", description = "List of child")
    List<ReportsLayoutItem> getFormulaItems(
            @GraphQLArgument(name = "formulas") List<UUID> formulas,
            @GraphQLArgument(name = "reportId") UUID reportId
    ) {

        createQuery("""
            Select DISTINCT item from ReportsLayoutItem item
            left join fetch item.reportsLayoutId report
            where 
            item.id in :formulas
            and report.id = :reportId 
            and report.isActive is true
            order by item.createdDate asc
        """)
                .setParameter("reportId",reportId)
                .setParameter("formulas",formulas)
                .resultList
    }
}
