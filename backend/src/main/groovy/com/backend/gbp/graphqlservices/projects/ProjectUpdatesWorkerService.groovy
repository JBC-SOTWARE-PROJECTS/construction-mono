package com.backend.gbp.graphqlservices.projects


import com.backend.gbp.domain.projects.ProjectUpdatesWorkers
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.rest.InventoryResource
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

@Component
@GraphQLApi
@TypeChecked
class ProjectUpdatesWorkerService extends AbstractDaoService<ProjectUpdatesWorkers> {

    ProjectUpdatesWorkerService() {
        super(ProjectUpdatesWorkers.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService

    @Autowired
    ProjectUpdatesMaterialService projectUpdatesMaterialService

    @Autowired
    InventoryResource inventoryResource


    @GraphQLQuery(name = "pUpdatesWorkerById")
    ProjectUpdatesWorkers pUpdatesWorkerById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            findOne(id)
        }else{
            null
        }
    }

    Boolean checkpointGetProjectWorkerByPosition(
            @GraphQLArgument(name = "position") String position,
            @GraphQLArgument(name = "id") UUID id
    ) {
        String query = '''Select e from ProjectUpdatesWorkers e where e.projectUpdates.id = :id and e.position = :position'''
        Map<String, Object> params = new HashMap<>()
        params.put('position', position)
        params.put('id', id)
        def list = createQuery(query, params).resultList.sort { it.position }
        if(list.size()){
            return true
        }else{
            return false
        }
    }

    @GraphQLQuery(name = "pUpdatesWorkersByList")
    List<ProjectUpdatesWorkers> pUpdatesWorkersByList(
            @GraphQLArgument(name = "id") UUID id
    ) {
        String query = '''Select e from ProjectUpdatesWorkers e where e.projectUpdates.id = :id'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        createQuery(query, params).resultList.sort { it.position }
    }


    // ============== Mutation =======================//
    @GraphQLMutation(name = "upsertProjectUpdatesWorkers")
    @Transactional
    GraphQLRetVal<Boolean> upsertProjectUpdatesWorkers(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "position") String position,
            @GraphQLArgument(name = "id") UUID id
    ) {
        Boolean checkpoint = false
        if(!id){
            def projectUpdatesId = UUID.fromString(fields['projectUpdates'].toString())
            checkpoint = this.checkpointGetProjectWorkerByPosition(position, projectUpdatesId)
        }
        if(!checkpoint) {
            upsertFromMap(id, fields, { ProjectUpdatesWorkers entity, boolean forInsert ->

            })
            if(id) {
                return new GraphQLRetVal<Boolean>(true, true, "Total Number of Workers Updated.")
            }else{
                return new GraphQLRetVal<Boolean>(true, true, "Total Number of Workers Added.")
            }
        }else{
            return new GraphQLRetVal<Boolean>(false, false, "Position is already added. Please add another position.")
        }
    }

    @GraphQLMutation(name = "removeProjectUpdateWorkers")
    @Transactional
    GraphQLRetVal<Boolean> removeProjectUpdateWorkers(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id) {
            def remove = findOne(id)
            delete(remove)
            return new GraphQLRetVal<Boolean>(true, true, "Record successfully removed.")
        }else{
            return new GraphQLRetVal<Boolean>(false, false, "Unique Id is missing")
        }
    }

}
