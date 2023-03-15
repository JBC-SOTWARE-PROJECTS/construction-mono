package com.backend.gbp.graphqlservices.projects

import com.backend.gbp.domain.billing.Billing
import com.backend.gbp.domain.projects.Projects
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.GeneratorType
import com.fasterxml.jackson.databind.ObjectMapper
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
class ProjectService extends AbstractDaoService<Projects> {

    ProjectService() {
        super(Projects.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService

    @Autowired
    ProjectCostService projectCostService

    @Autowired
    ProjectMaterialService projectMaterialService

    //context
    @GraphQLQuery(name = "totals", description = "totals")
    BigDecimal totals(@GraphQLContext Projects projects) {
        return projectCostService.getTotals(projects.id)
    }

    @GraphQLQuery(name = "totalsMaterials", description = "totalsMaterials")
    BigDecimal totalsMaterials(@GraphQLContext Projects projects) {
        return projectMaterialService.getTotalMaterials(projects.id)
    }


    @GraphQLQuery(name = "projectById")
    Projects projectById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            findOne(id)
        }else{
            null
        }
    }


    @GraphQLQuery(name = "projectList")
    List<Projects> projectList(
            @GraphQLArgument(name = "filter") String filter
    ) {
        String query = '''Select e from Projects e where lower(concat(e.projectCode,e.description)) like lower(concat('%',:filter,'%'))'''
        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        createQuery(query, params).resultList.sort { it.projectCode }
    }

    @GraphQLQuery(name = "projectByOffice")
    List<Projects> projectByOffice(
            @GraphQLArgument(name = "id") UUID id
    ) {
        String query = '''Select e from Projects e where e.location.id = :id'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        createQuery(query, params).resultList.sort { it.projectCode }
    }

    @GraphQLQuery(name = "projectListPageable")
    Page<Projects> projectListPageable(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "customer") UUID customer,
            @GraphQLArgument(name = "location") UUID location,
            @GraphQLArgument(name = "status") String status,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ) {

        String query = '''Select p from Projects p where
						lower(concat(p.projectCode,p.description)) like lower(concat('%',:filter,'%'))'''

        String countQuery = '''Select count(p) from Projects p where
							lower(concat(p.projectCode,p.description)) like lower(concat('%',:filter,'%'))'''

        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)

        if (customer) {
            query += ''' and (p.customer.id = :customer)'''
            countQuery += ''' and (p.customer.id = :customer)'''
            params.put("customer", customer)
        }

        if (location) {
            query += ''' and (p.location.id = :location)'''
            countQuery += ''' and (p.location.id = :location)'''
            params.put("location", location)
        }

        if (status) {
            query += ''' and (p.status = :status)'''
            countQuery += ''' and (p.status = :status)'''
            params.put("status", status)
        }

        query += ''' ORDER BY p.projectCode DESC'''

        Page<Projects> result = getPageable(query, countQuery, page, size, params)
        return result
    }

    // ============== Mutation =======================//
    @GraphQLMutation(name = "upsertProject")
    @Transactional
    Projects upsertSupplier(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ) {
        upsertFromMap(id, fields, { Projects entity, boolean forInsert ->
            if(forInsert){
                entity.projectCode = generatorService.getNextValue(GeneratorType.PROJECT_CODE, {
                    return "PROJ-" + StringUtils.leftPad(it.toString(), 6, "0")
                })
            }
        })
    }

}
