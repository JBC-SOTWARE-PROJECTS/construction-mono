package com.backend.gbp.graphqlservices.projects

import com.backend.gbp.domain.billing.Billing
import com.backend.gbp.domain.projects.ProjectCost
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.billing.BillingItemService
import com.backend.gbp.graphqlservices.billing.BillingService
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.rest.InventoryResource
import com.backend.gbp.rest.dto.CategoryDto
import com.backend.gbp.rest.dto.UnitDto
import com.backend.gbp.services.GeneratorService
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLContext
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.stereotype.Component

import javax.transaction.Transactional
import java.math.RoundingMode

@Component
@GraphQLApi
@TypeChecked
class ProjectCostService extends AbstractDaoService<ProjectCost> {

    ProjectCostService() {
        super(ProjectCost.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService

    @Autowired
    InventoryResource inventoryResource

    @Autowired
    BillingService billingService

    @Autowired
    BillingItemService billingItemService

    @Autowired
    ProjectService projectService

    @Autowired
    ProjectCostRevisionService projectCostRevisionService

    @Autowired
    ProjectWorkAccomplishItemsService projectWorkAccomplishItemsService


    @GraphQLQuery(name = "pCostById")
    ProjectCost pCostById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            findOne(id)
        }else{
            null
        }
    }

    @GraphQLQuery(name = "getTotals")
    BigDecimal getTotals(
            @GraphQLArgument(name = "id") UUID id
    ){
        String query = '''Select coalesce(sum(j.totalCost), 0) from ProjectCost j where 
        j.project.id = :id and j.status = true'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        def result = getSum(query, params)
        return result.setScale(2, RoundingMode.HALF_EVEN)
    }

    @GraphQLQuery(name = "pCostByList")
    List<ProjectCost> pCostByList(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "id") UUID id
    ) {
        String query = '''Select e from ProjectCost e where lower(e.description) like lower(concat('%',:filter,'%')) and e.project.id = :id'''
        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        params.put('id', id)
        createQuery(query, params).resultList.sort { it.itemNo }
    }

    @GraphQLQuery(name = "getCategoryProjects")
    List<CategoryDto> getCategoryProjects() {
        inventoryResource.getCategoryProjects().sort{it.category}
    }

    @GraphQLQuery(name = "getUnitProjects")
    List<UnitDto> getUnitProjects() {
        inventoryResource.getUnitProjects().sort{it.unit}
    }


    // ============== Mutation =======================//
    @GraphQLMutation(name = "upsertProjectCost")
    @Transactional
    GraphQLRetVal<Boolean> upsertProjectCost(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ) {
        def projectId = UUID.fromString(fields['project'].toString())

        if(projectId){
            def project = projectService.projectById(projectId)
            //def billing = billingService.billingByProject(project.id)
            //add to billing
            //if(billing){
            //    if(billing.locked){
            //        return new GraphQLRetVal<Boolean>(false, false, "Billing is locked. Please unlocked to charge additional items/service.")
            //   }else{

            //        billingItemService.upsertBillingItemByProject(costing, billing)
            //    }

           // }
           upsertFromMap(id, fields, { ProjectCost entity, boolean forInsert ->
                if(forInsert){
                    //conditions here before save
                }
            })
            return new GraphQLRetVal<Boolean>(true, true, "Bill of Quantities added successfully")
        }else{
            return new GraphQLRetVal<Boolean>(false, false, "Project ID is missing")
        }
    }

    @GraphQLMutation(name = "updateStatusCost")
    @Transactional
    ProjectCost updateStatusCost(
            @GraphQLArgument(name = "id") UUID id
    ) {
        def proj = findOne(id)
        delete(proj)

        if(id){
            billingItemService.deleteBillingItem(id)
        }

        return  proj
    }

    @GraphQLMutation(name = "reviseProjectCost")
    @Transactional
    ProjectCost reviseProjectCost(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "tag") String tag
    ) {
        if(id) {
            def projCost = findOne(id)

            def rev = projectCostRevisionService.upsertProjectRevCost(projCost, tag, null)
            if(rev?.id){
                def costing = upsertFromMap(id, fields, { ProjectCost entity, boolean forInsert ->
                    if(forInsert){
                        //conditions here before save
                        entity.cost = entity.cost.setScale(2, RoundingMode.HALF_EVEN)
                    }
                })
                //update billing
                //billingItemService.updateBillingItemForRevisions(costing.id, costing)
                return  costing
            }
            return  projCost
        }

        return null

    }


}
