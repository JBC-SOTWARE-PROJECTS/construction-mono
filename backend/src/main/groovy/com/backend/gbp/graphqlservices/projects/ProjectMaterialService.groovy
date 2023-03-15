package com.backend.gbp.graphqlservices.projects

import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.domain.projects.ProjectMaterials
import com.backend.gbp.domain.projects.Projects
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.services.GeneratorService
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import org.xmlsoap.schemas.soap.encoding.Int

import javax.transaction.Transactional
import java.time.Instant

@Component
@GraphQLApi
@TypeChecked
class ProjectMaterialService extends AbstractDaoService<ProjectMaterials> {

    ProjectMaterialService() {
        super(ProjectMaterials.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService


    @GraphQLQuery(name = "pMaterialById")
    ProjectMaterials pMaterialById(
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
        String query = '''Select coalesce(round(sum(j.cost * j.qty),2), 0) from ProjectMaterials j where 
        j.project.id = :id'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        getSum(query, params)
    }

    @GraphQLQuery(name = "pMaterialByList")
    List<ProjectMaterials> pMaterialByList(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "id") UUID id
    ) {
        String query = '''Select e from ProjectMaterials e where lower(e.item.descLong) like lower(concat('%',:filter,'%')) and e.project.id = :id'''
        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        params.put('id', id)
        createQuery(query, params).resultList.sort { it.dateTransact }.reverse()
    }

    @GraphQLQuery(name = "getMaterialsByRefId")
    List<ProjectMaterials> getMaterialsByRefId(
            @GraphQLArgument(name = "id") UUID id
    ) {
        String query = '''Select e from ProjectMaterials e where refId = :id'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        createQuery(query, params).resultList.sort { it.dateTransact }.reverse()
    }


    // ============== Mutation =======================//
    @GraphQLMutation(name = "upsertProjectMaterials")
    @Transactional
    ProjectMaterials upsertProjectMaterials(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ) {
        upsertFromMap(id, fields, { ProjectMaterials entity, boolean forInsert ->
            if(forInsert){
                //conditions here before save
            }
        })
    }

    @GraphQLMutation(name = "upsertMaterialsAuto")
    @Transactional
    ProjectMaterials upsertMaterialsAuto(
            @GraphQLArgument(name = "project") Projects project,
            @GraphQLArgument(name = "refId") UUID refId,
            @GraphQLArgument(name = "refNo") String refNo,
            @GraphQLArgument(name = "item") Item item,
            @GraphQLArgument(name = "qty") Integer qty,
            @GraphQLArgument(name = "cost") BigDecimal cost

    ) {
        def upsert = new ProjectMaterials()
        upsert.project = project
        upsert.dateTransact = Instant.now()
        upsert.refId = refId
        upsert.refNo = refNo
        upsert.item = item
        upsert.qty = qty
        upsert.cost = cost
        save(upsert)
    }

    @GraphQLMutation(name = "deleteMaterials")
    @Transactional
    List<ProjectMaterials> deleteMaterials(
            @GraphQLArgument(name = "refId") UUID refId
    ) {
        def list = this.getMaterialsByRefId(refId)
        list.each {entity ->
            delete(entity)
        }
        return list
    }

}
