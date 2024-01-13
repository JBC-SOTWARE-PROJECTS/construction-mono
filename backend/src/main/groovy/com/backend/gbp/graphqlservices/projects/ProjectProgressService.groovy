package com.backend.gbp.graphqlservices.projects

import com.backend.gbp.domain.projects.ProjectProgress
import com.backend.gbp.domain.projects.ProjectUpdates
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.rest.InventoryResource
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
class ProjectProgressService extends AbstractDaoService<ProjectProgress> {

    ProjectProgressService() {
        super(ProjectProgress.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService

    @Autowired
    ProjectUpdatesMaterialService projectUpdatesMaterialService

    @Autowired
    InventoryResource inventoryResource

    @Autowired
    ProjectService projectService


    @GraphQLQuery(name = "pProgressById")
    ProjectProgress pProgressById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            findOne(id)
        }else{
            null
        }
    }

    Boolean checkpointGetProjectByDate(
            @GraphQLArgument(name = "date") String date,
            @GraphQLArgument(name = "id") UUID id
    ) {
        String query = '''Select e from ProjectProgress e where e.project.id = :id and to_date(to_char(e.dateTransact, 'YYYY-MM-DD'),'YYYY-MM-DD') = to_date(:date,'YYYY-MM-DD')'''
        Map<String, Object> params = new HashMap<>()
        params.put('date', date)
        params.put('id', id)
        def list = createQuery(query, params).resultList.sort { it.transNo }
        if(list.size()){
            return true
        }else{
            return false
        }
    }

    @GraphQLQuery(name = "pProgressByList")
    List<ProjectProgress> pProgressByList(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "id") UUID id
    ) {
        String query = '''Select e from ProjectProgress e where lower(e.description) like lower(concat('%',:filter,'%')) and e.project.id = :id'''
        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        params.put('id', id)
        createQuery(query, params).resultList.sort { it.dateTransact }
    }

    @GraphQLQuery(name = "pProgressByListNotIn")
    List<ProjectProgress> pProgressByListNotIn(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "projectUpdateId") UUID projectProgressId
    ) {
        String query = '''Select e from ProjectProgress e where e.id not in (:projectProgressId) and e.project.id = :id'''
        Map<String, Object> params = new HashMap<>()
        params.put('projectProgressId', projectProgressId)
        params.put('id', id)
        createQuery(query, params).resultList.sort { it.dateTransact }
    }

    @GraphQLQuery(name = "pProgressByPage")
    Page<ProjectProgress> pProgressByPage(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ) {
        String query = '''Select e from ProjectProgress e where lower(e.description) like lower(concat('%',:filter,'%')) and e.project.id = :id'''

        String countQuery = '''Select count(e) from ProjectProgress e where lower(e.description) like lower(concat('%',:filter,'%')) and e.project.id = :id'''

        Map<String, Object> params = new HashMap<>()

        params.put('filter', filter)
        params.put('id', id)

        query += ''' ORDER BY e.dateTransact DESC'''

        getPageable(query, countQuery, page, size, params)
    }


    // ============== Mutation =======================//
    @GraphQLMutation(name = "upsertProjectProgress")
    @Transactional
    GraphQLRetVal<Boolean> upsertProjectProgress(
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
            def updated = upsertFromMap(id, fields, { ProjectProgress entity, boolean forInsert ->
                if(forInsert){
                    entity.transNo = generatorService.getNextValue(GeneratorType.PRS_NO, {
                        return "PRS" + StringUtils.leftPad(it.toString(), 6, "0")
                    })
                    entity.status = "ACTIVE"
                }
            })
            if(id) {
                // ============= update project =================
                if(updated.status.equalsIgnoreCase("ACTIVE")){
                    projectService.updatePercent(projectId, updated.progressPercent)
                }
                return new GraphQLRetVal<Boolean>(true, true, "Progress Report Updated.")
            }else{
                // ============= update project =================
                projectService.updatePercent(projectId, updated.progressPercent)
                this.lockedOtherProgress(projectId, updated.id)
                return new GraphQLRetVal<Boolean>(true, true, "Progress Report Added.")
            }
        }else{
            return new GraphQLRetVal<Boolean>(false, false, "Progress Report already added with the same date.")
        }
    }

    @GraphQLMutation(name = "lockedOtherProgress")
    @Transactional
    GraphQLRetVal<Boolean> lockedOtherProgress(
            @GraphQLArgument(name = "projectId") UUID projectId,
            @GraphQLArgument(name = "projectProgressId") UUID projectProgressId
    ) {
        def list = this.pProgressByListNotIn(projectId, projectProgressId)
        list.each {
            def update = it
            update.status = "LOCKED"
            save(update)
        }
        return new GraphQLRetVal<Boolean>(true, true, "Progress Report Updated.")
    }

}
