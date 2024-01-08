package com.backend.gbp.graphqlservices.projects

import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.domain.projects.ProjectUpdatesMaterials
import com.backend.gbp.domain.projects.Projects
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.inventory.InventoryLedgerService
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.rest.dto.MaterialsDto
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

@Component
@GraphQLApi
@TypeChecked
class ProjectUpdatesMaterialService extends AbstractDaoService<ProjectUpdatesMaterials> {

    ProjectUpdatesMaterialService() {
        super(ProjectUpdatesMaterials.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService

    @Autowired
    ProjectUpdatesService projectUpdatesService

    @Autowired
    ProjectService projectService

    @Autowired
    InventoryLedgerService inventoryLedgerService


    @GraphQLQuery(name = "pMaterialById")
    ProjectUpdatesMaterials pMaterialById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
          findOne(id)
        }else{
            null
        }
    }

    @GraphQLQuery(name = "getTotalMaterials")
    BigDecimal getTotalMaterials(
            @GraphQLArgument(name = "id") UUID id
    ){
        String query = '''Select coalesce(round(sum(j.cost * j.qty),2), 0) from ProjectUpdatesMaterials j where 
        j.project.id = :id'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        getSum(query, params)
    }

    @GraphQLQuery(name = "pMaterialByList")
    List<ProjectUpdatesMaterials> pMaterialByList(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "id") UUID id
    ) {
        String query = '''Select e from ProjectUpdatesMaterials e where lower(e.item.descLong) like lower(concat('%',:filter,'%')) and e.project.id = :id'''
        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        params.put('id', id)
        createQuery(query, params).resultList.sort { it.dateTransact }.reverse()
    }

    @GraphQLQuery(name = "getProjectMaterialsByMilestone")
    List<ProjectUpdatesMaterials> getProjectMaterialsByMilestone(
            @GraphQLArgument(name = "id") UUID id
    ) {
        String query = '''Select e from ProjectUpdatesMaterials e where e.projectUpdates.id = :id'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        createQuery(query, params).resultList.sort { it.dateTransact }.reverse()
    }

    @GraphQLQuery(name = "getMaterialByRefStockCard")
    ProjectUpdatesMaterials getMaterialByRefStockCard(
            @GraphQLArgument(name = "id") UUID id
    ) {
        String query = '''Select e from ProjectUpdatesMaterials e where e.stockCardRefId = :id'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        createQuery(query, params).resultList.find()
    }


    // ============== Mutation =======================//
    @GraphQLMutation(name = "upsertProjectMaterials")
    @Transactional
    ProjectUpdatesMaterials upsertProjectMaterials(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ) {
        upsertFromMap(id, fields, { ProjectUpdatesMaterials entity, boolean forInsert ->
            if(forInsert){
                //conditions here before save
            }
        })
    }

    @GraphQLMutation(name = "upsertManyMaterials")
    @Transactional
    GraphQLRetVal<Boolean> upsertManyMaterials(
            @GraphQLArgument(name = "items") ArrayList<Map<String, Object>> items,
            @GraphQLArgument(name = "projectId") UUID projectId,
            @GraphQLArgument(name = "projectUpdatesId") UUID projectUpdatesId
    ) {
        if(items){
            def toBeInsert = items as ArrayList<MaterialsDto>
            def proj = projectService.projectById(projectId)
            def pUpdates = projectUpdatesService.pUpdatesById(projectUpdatesId)

            toBeInsert.each {
                def item = objectMapper.convertValue(it.item, Item.class)
                //minus inventory
                def inv = inventoryLedgerService.expenseItemFromProjects(proj, item, it.qty, it.wCost)
                //insert materials
                ProjectUpdatesMaterials n = new ProjectUpdatesMaterials()
                n.project = proj
                n.projectUpdates = pUpdates
                n.dateTransact = Instant.now()
                n.item = item
                n.onHand = it.onHand
                n.qty = it.qty
                n.balance = it.balance
                n.wCost = it.wCost
                n.remarks = it.remarks
                n.stockCardRefId = inv.id
                save(n)
            }
        }

        return new GraphQLRetVal<Boolean>(true,true,"Materials Added Successfully")
    }


    @GraphQLMutation(name = "removedMaterial")
    @Transactional
    ProjectUpdatesMaterials removedMaterial(
            @GraphQLArgument(name = "id") UUID id
    ) {
        def one = findOne(id)
        //delete inventory
        inventoryLedgerService.voidLedgerById(one.stockCardRefId)
        //delete
        delete(one)
        return one
    }

    @GraphQLMutation(name = "directExpenseMaterials")
    @Transactional
    GraphQLRetVal<Boolean> directExpenseMaterials(
            @GraphQLArgument(name = "item") Item item,
            @GraphQLArgument(name = "project") Projects project,
            @GraphQLArgument(name = "qty") Integer qty,
            @GraphQLArgument(name = "cost") BigDecimal cost,
            @GraphQLArgument(name = "refId") UUID refId
    ) {
        //insert materials
        ProjectUpdatesMaterials n = new ProjectUpdatesMaterials()
        n.project = project
        n.projectUpdates = null
        n.dateTransact = Instant.now()
        n.item = item
        n.qty = qty
        n.wCost = cost
        n.stockCardRefId = refId
        save(n)

        return new GraphQLRetVal<Boolean>(true,true,"Materials Added Successfully")
    }

    @GraphQLMutation(name = "removedMaterialDirectExpense")
    @Transactional
    ProjectUpdatesMaterials removedMaterialDirectExpense(
            @GraphQLArgument(name = "id") UUID id
    ) {
        def one = this.getMaterialByRefStockCard(id)
        if(one.id){
            delete(one)
            return one
        }
        return null
    }

}
