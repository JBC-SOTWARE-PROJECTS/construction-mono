package com.backend.gbp.graphqlservices.projects

import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.domain.projects.ProjectUpdatesMaterials
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

    @GraphQLQuery(name = "getMaterialsByRefId")
    List<ProjectUpdatesMaterials> getMaterialsByRefId(
            @GraphQLArgument(name = "id") UUID id
    ) {
        String query = '''Select e from ProjectUpdatesMaterials e where refId = :id'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        createQuery(query, params).resultList.sort { it.dateTransact }.reverse()
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


    @GraphQLMutation(name = "deleteMaterials")
    @Transactional
    List<ProjectUpdatesMaterials> deleteMaterials(
            @GraphQLArgument(name = "refId") UUID refId
    ) {
        def list = this.getMaterialsByRefId(refId)
        list.each {entity ->
            delete(entity)
        }
        return list
    }

}
