package com.backend.gbp.graphqlservices.projects

import com.backend.gbp.domain.projects.ProjectWorkAccomplish
import com.backend.gbp.domain.projects.ProjectWorkAccomplishItems
import com.backend.gbp.graphqlservices.base.AbstractDaoCompanyService
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.stereotype.Component

import javax.transaction.Transactional


@Component
@GraphQLApi
@TypeChecked
class ProjectWorkAccomplishItemsService extends AbstractDaoCompanyService<ProjectWorkAccomplishItems> {

    ProjectWorkAccomplishItemsService() {
        super(ProjectWorkAccomplishItems.class)
    }


    @GraphQLQuery(name='getProjectWorkAccomplishItemsByGroupId')
    List<ProjectWorkAccomplishItems> getProjectWorkAccomplishItemsByGroupId(
            @GraphQLArgument(name='id') UUID id
    ){
       createQuery("""
            Select p from ProjectWorkAccomplishItems p where p.projectWorkAccomplishId = :id
            order by p.itemNo
        """)
            .setParameter('id',id)
            .getResultList()
    }

    @GraphQLQuery(name='findOneProjectWorkAccomplishItems')
    ProjectWorkAccomplishItems findOneProjectWorkAccomplishItems(
            @GraphQLArgument(name='id') UUID id
    ){
        createQuery("""
            Select p from ProjectWorkAccomplishItems p
            where p.id = :id
        """)
                .setParameter('id',id)
                .singleResult
    }
}
