package com.backend.gbp.graphqlservices.projects

import com.backend.gbp.domain.projects.ProjectProgressImages
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.rest.InventoryResource
import com.backend.gbp.services.DigitalOceanSpaceService
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
class ProjectProgressImageService extends AbstractDaoService<ProjectProgressImages> {

    ProjectProgressImageService() {
        super(ProjectProgressImages.class)
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
    DigitalOceanSpaceService digitalOceanSpaceService


    @GraphQLQuery(name = "pProgressImageById")
    ProjectProgressImages pProgressImageById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            findOne(id)
        }else{
            null
        }
    }


    @GraphQLQuery(name = "pProgressImagesByList")
    List<ProjectProgressImages> pProgressImagesByList(
            @GraphQLArgument(name = "id") UUID id
    ) {
        String query = '''Select e from ProjectProgressImages e where e.projectProgress.id = :id'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)
        createQuery(query, params).resultList.sort { it.dateTransact }
    }


    @GraphQLMutation(name = "removeProjectProgressImage")
    @Transactional
    GraphQLRetVal<Boolean> removeProjectProgressImage(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id) {
            def remove = findOne(id)
            delete(remove)
            //delete in do
            digitalOceanSpaceService.deleteFileToSpace("${remove.folderName}${remove.fileName}")
            return new GraphQLRetVal<Boolean>(true, true, "Image successfully removed.")
        }else{
            return new GraphQLRetVal<Boolean>(false, false, "Unique Id is missing")
        }
    }

}
