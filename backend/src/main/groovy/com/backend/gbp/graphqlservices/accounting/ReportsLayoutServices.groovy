package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.ReportType
import com.backend.gbp.domain.accounting.ReportsLayout
import com.backend.gbp.domain.accounting.ReportsLayoutItem
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.services.EntityObjectMapperService
import com.backend.gbp.services.GeneratorService
import groovy.transform.Canonical
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

import javax.persistence.EntityManager
import javax.persistence.NoResultException
import javax.transaction.Transactional

@Canonical
class ReportsLayoutItemDto {
    String key
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


    @GraphQLMutation(name="createReportsLayout")
    GraphQLResVal<ReportsLayout> createReportsLayout(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "fields") Map<String,Object> fields
    ){
            def report = upsertFromMap(id, fields,{
                it , isInsert ->
                    if(!isInsert){
                        if(fields['currentYearEarningsFormula']){
                            it?.config?.currentYearEarningsFormula = UUID.fromString((fields['currentYearEarningsFormula'] as String))
                        }
                    }
            })
            return new GraphQLResVal<ReportsLayout>(report, true, "Invoice transaction completed successfully")
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
                ReportsLayout reportsLayout = new ReportsLayout()
                reportsLayout.reportType = reportType
                reportsLayout.layoutName = reportsLayout.reportType.label
                reportsLayout.title = reportsLayout.reportType.label
                reportsLayout.isActive = true
                def newSave = save(reportsLayout)
                return  newSave
            }
        } catch (NoResultException e) {
            ReportsLayout reportsLayout = new ReportsLayout()
            reportsLayout.reportType = reportType
            reportsLayout.layoutName = reportsLayout.reportType.label
            reportsLayout.title = reportsLayout.reportType.label
            reportsLayout.isActive = true
            def newSave = save(reportsLayout)
            return  newSave
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


    def remapTreeData(List<ReportsLayoutItem> data, Boolean isChild = false) {
        List<ReportsLayoutItemDto> result = []

        data.findAll {
            isChild ? it.reportLayoutItemsParent != null : it.reportLayoutItemsParent == null
        }.sort {it.orderNo}.each { node ->
            def newNode = new ReportsLayoutItemDto(
                    key: node.id,
                    title: node?.account?.description ?: node.title,
                    disableCheckbox: node.isGroup
            )

            if (node.reportsChild) {
                newNode.children = remapTreeData(node.reportsChild, true)
            }

            result << newNode
        }

        return result
    }

}
