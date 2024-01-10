package com.backend.gbp.graphqlservices.projects

import com.backend.gbp.domain.projects.ProjectWorkAccomplish
import com.backend.gbp.domain.projects.ProjectWorkAccomplishItems
import com.backend.gbp.graphqlservices.base.AbstractDaoCompanyService
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

import javax.transaction.Transactional


@Component
@GraphQLApi
@TypeChecked
class ProjectWorkAccomplishService extends AbstractDaoCompanyService<ProjectWorkAccomplish> {

    ProjectWorkAccomplishService() {
        super(ProjectWorkAccomplish.class)
    }

    @Autowired
    ProjectWorkAccomplishItemsService accomplishItemsService

    @Transactional
    @GraphQLMutation(name='saveProjectWorkAccomplish')
    ProjectWorkAccomplish upsertProjectWorkAccomplish(
            @GraphQLArgument(name='id') UUID id,
            @GraphQLArgument(name='fields') Map<String,Object> fields,
            @GraphQLArgument(name='itemFields') List<Map<String,Object>> itemFields

    ){
       def workAccomplish = upsertFromMap(id,fields)
        if(workAccomplish){
            itemFields.each {
                items ->
                items['projectWorkAccomplishId'] = workAccomplish.id
                accomplishItemsService.upsertFromMap(null,items)
            }
        }

        return workAccomplish
    }

}
