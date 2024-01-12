package com.backend.gbp.graphqlservices.projects


import com.backend.gbp.domain.projects.ProjectUpdates
import com.backend.gbp.domain.projects.ProjectUpdatesMaterials

import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.rest.InventoryResource
import com.backend.gbp.rest.dto.Weather
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.GeneratorType
import com.fasterxml.jackson.databind.ObjectMapper
import com.sun.org.apache.xpath.internal.operations.Bool
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLContext
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
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
    ProjectUpdatesMaterialService projectUpdatesMaterialService

    @Autowired
    InventoryResource inventoryResource


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

    @GraphQLQuery(name = "weatherList")
    List<Weather> weatherList() {
        return inventoryResource.getWeatherList()
    }

    Boolean checkpointGetProjectByDate(
            @GraphQLArgument(name = "date") String date,
            @GraphQLArgument(name = "id") UUID id
    ) {
        String query = '''Select e from ProjectUpdates e where e.project.id = :id and to_date(to_char(e.dateTransact, 'YYYY-MM-DD'),'YYYY-MM-DD') = to_date(:date,'YYYY-MM-DD')'''
        Map<String, Object> params = new HashMap<>()
        params.put('date', date)
        params.put('id', id)
        def list = createQuery(query, params).resultList.sort { it.dateTransact }
        if(list.size()){
            return true
        }else{
            return false
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

    @GraphQLQuery(name = "pUpdatesByListNotIn")
    List<ProjectUpdates> pUpdatesByListNotIn(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "projectUpdateId") UUID projectUpdateId
    ) {
        String query = '''Select e from ProjectUpdates e where e.id not in (:projectUpdateId) and e.project.id = :id'''
        Map<String, Object> params = new HashMap<>()
        params.put('projectUpdateId', projectUpdateId)
        params.put('id', id)
        createQuery(query, params).resultList.sort { it.dateTransact }
    }

    @GraphQLQuery(name = "pUpdatesByPage")
    Page<ProjectUpdates> pUpdatesByPage(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ) {
        String query = '''Select e from ProjectUpdates e where lower(e.description) like lower(concat('%',:filter,'%')) and e.project.id = :id'''

        String countQuery = '''Select count(e) from ProjectUpdates e where lower(e.description) like lower(concat('%',:filter,'%')) and e.project.id = :id'''

        Map<String, Object> params = new HashMap<>()

        params.put('filter', filter)
        params.put('id', id)

        query += ''' ORDER BY e.dateTransact DESC'''

        getPageable(query, countQuery, page, size, params)
    }


    // ============== Mutation =======================//
    @GraphQLMutation(name = "upsertProjectUpdates")
    @Transactional
    GraphQLRetVal<Boolean> upsertProjectUpdates(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "date") String date,
            @GraphQLArgument(name = "id") UUID id
    ) {
        Boolean checkpoint = false
        def projectId = UUID.fromString(fields['project'].toString())
        if(!id){
            checkpoint = this.checkpointGetProjectByDate(date, projectId)
        }
        if(!checkpoint) {
            def afterSave = upsertFromMap(id, fields, { ProjectUpdates entity, boolean forInsert ->
                if(forInsert){
                    entity.transNo = generatorService.getNextValue(GeneratorType.DAR_NO, {
                        return "DAR" + StringUtils.leftPad(it.toString(), 6, "0")
                    })
                    entity.status = "ACTIVE"
                }
            })
            if(id) {
                return new GraphQLRetVal<Boolean>(true, true, "Accomplishment Report Updated.")
            }else{
                this.lockedOtherUpdates(projectId, afterSave.id)
                return new GraphQLRetVal<Boolean>(true, true, "Accomplishment Report Added.")
            }
        }else{
            return new GraphQLRetVal<Boolean>(false, false, "Accomplishment Report already added with the same date.")
        }
    }

    @GraphQLMutation(name = "lockedOtherUpdates")
    @Transactional
    GraphQLRetVal<Boolean> lockedOtherUpdates(
            @GraphQLArgument(name = "projectId") UUID projectId,
            @GraphQLArgument(name = "projectUpdateId") UUID projectUpdateId
    ) {
        def list = this.pUpdatesByListNotIn(projectId, projectUpdateId)
        list.each {
            def update = it
            update.status = "LOCKED"
            save(update)
        }
        return new GraphQLRetVal<Boolean>(true, true, "Accomplishment Report Updated.")
    }

}
