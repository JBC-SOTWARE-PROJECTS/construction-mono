package com.backend.gbp.graphqlservices.projects

import com.backend.gbp.domain.projects.ProjectCost
import com.backend.gbp.domain.projects.ProjectCostRevisions
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
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
import java.math.RoundingMode
import java.time.Instant

@Component
@GraphQLApi
@TypeChecked
class ProjectCostRevisionService extends AbstractDaoService<ProjectCostRevisions> {

    ProjectCostRevisionService() {
        super(ProjectCostRevisions.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService


    @GraphQLQuery(name = "pCostRevById")
    ProjectCostRevisions pCostRevById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            findOne(id)
        }else{
            null
        }
    }

    @GraphQLQuery(name = "pCostRevByList")
    List<ProjectCostRevisions> pCostRevByList(
            @GraphQLArgument(name = "id") UUID id
    ) {
        String query = '''Select e from ProjectCostRevisions e where e.projectCostId = :id'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        createQuery(query, params).resultList.sort { it.prevDate }.reverse()
    }


    // ============== Mutation =======================//
    @GraphQLMutation(name = "upsertProjectRevCost")
    @Transactional
    ProjectCostRevisions upsertProjectRevCost(
            @GraphQLArgument(name = "projectCost") ProjectCost projectCost,
            @GraphQLArgument(name = "tag") String tag,
            @GraphQLArgument(name = "id") UUID id
    ) {
        ProjectCostRevisions upsert = new ProjectCostRevisions()
        if(id){
            upsert = findOne(id)
        }
        upsert.prevDate = Instant.now()
        upsert.project = projectCost.project.id
        upsert.projectCostId = projectCost.id
        upsert.qty = projectCost.qty
        upsert.unit = projectCost.unit
        upsert.cost = projectCost.cost.setScale(2, RoundingMode.HALF_EVEN)
        upsert.tagNo = tag
        save(upsert)
    }

}
