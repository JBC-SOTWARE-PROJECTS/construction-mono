package com.backend.gbp.graphqlservices.projects

import com.backend.gbp.domain.projects.ProjectCost
import com.backend.gbp.domain.projects.Projects
import com.backend.gbp.graphqlservices.base.AbstractDaoService
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
import org.springframework.data.domain.Page
import org.springframework.stereotype.Component

import javax.transaction.Transactional

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
        String query = '''Select coalesce(round(sum(j.cost),2), 0) from ProjectCost j where 
        j.project.id = :id and j.status = true'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        getSum(query, params)
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
        createQuery(query, params).resultList.sort { it.dateTransact }.reverse()
    }


    // ============== Mutation =======================//
    @GraphQLMutation(name = "upsertProjectCost")
    @Transactional
    ProjectCost upsertProjectCost(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ) {
        upsertFromMap(id, fields, { ProjectCost entity, boolean forInsert ->
            if(forInsert){
                //conditions here before save
            }
        })
    }

    @GraphQLMutation(name = "updateStatusCost")
    @Transactional
    ProjectCost updateStatusCost(
            @GraphQLArgument(name = "id") UUID id
    ) {
        def proj = findOne(id)
        proj.status = false
        save(proj)
    }

}
