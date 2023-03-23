package com.backend.gbp.graphqlservices.projects

import com.backend.gbp.domain.inventory.Inventory
import com.backend.gbp.domain.projects.ProjectCost
import com.backend.gbp.domain.projects.ProjectUpdates
import com.backend.gbp.domain.projects.ProjectUpdatesNotes
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.services.GeneratorService
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLContext
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
class ProjectUpdatesService extends AbstractDaoService<ProjectUpdates> {

    ProjectUpdatesService() {
        super(ProjectUpdates.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService

    @Autowired
    ProjectUpdatesNotesService projectUpdatesNotesService


    //context
    @GraphQLQuery(name = "notes")
    List<ProjectUpdatesNotes> notes(@GraphQLContext ProjectUpdates projectUpdates) {
        def id = projectUpdates.id
        return projectUpdatesNotesService.pUpdatesNotesList(id)
    }


    @GraphQLQuery(name = "pUpdatesById")
    ProjectUpdates pUpdatesById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            findOne(id)
        }else{
            null
        }
    }

    @GraphQLQuery(name = "pUpdatesByList")
    List<ProjectUpdates> pUpdatesByList(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "id") UUID id
    ) {
        String query = '''Select e from ProjectUpdates e where lower(e.description) like lower(concat('%',:filter,'%')) and e.project.id = :id'''
        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        params.put('id', id)
        createQuery(query, params).resultList.sort { it.dateTransact }
    }


    // ============== Mutation =======================//
    @GraphQLMutation(name = "upsertProjectUpdates")
    @Transactional
    ProjectUpdates upsertProjectUpdates(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ) {
        upsertFromMap(id, fields, { ProjectUpdates entity, boolean forInsert ->
            if(entity.status.equalsIgnoreCase("Completed")){
                entity.completedDate = Instant.now()
            }else{
                entity.completedDate = null
            }
        })
    }

}
