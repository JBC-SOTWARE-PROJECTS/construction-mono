package com.backend.gbp.graphqlservices.projects

import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.domain.projects.ProjectUpdatesMaterials
import com.backend.gbp.domain.projects.ProjectUpdatesNotes
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
class ProjectUpdatesNotesService extends AbstractDaoService<ProjectUpdatesNotes> {

    ProjectUpdatesNotesService() {
        super(ProjectUpdatesNotes.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService


    @GraphQLQuery(name = "pUpdatesNotesById")
    ProjectUpdatesNotes pMaterialById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
          findOne(id)
        }else{
            null
        }
    }


    @GraphQLQuery(name = "pUpdatesNotesList")
    List<ProjectUpdatesNotes> pUpdatesNotesList(
            @GraphQLArgument(name = "id") UUID id
    ) {
        String query = '''Select e from ProjectUpdatesNotes e where e.projectUpdates.id = :id'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        createQuery(query, params).resultList.sort { it.dateTransact }.reverse()

    }



    // ============== Mutation =======================//
    @GraphQLMutation(name = "upsertProjectNotes")
    @Transactional
    ProjectUpdatesNotes upsertProjectNotes(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ) {
        upsertFromMap(id, fields, { ProjectUpdatesNotes entity, boolean forInsert ->
            if(forInsert){
                //conditions here before save
            }
        })
    }


}
