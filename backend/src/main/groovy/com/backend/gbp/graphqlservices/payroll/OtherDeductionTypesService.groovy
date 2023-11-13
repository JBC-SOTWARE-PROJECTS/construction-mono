package com.backend.gbp.graphqlservices.payroll

import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.payroll.OtherDeductionTypes
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.payroll.OtherDeductionTypesRepository
import com.backend.gbp.security.SecurityUtils
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Component

@TypeChecked
@Component
@GraphQLApi
class OtherDeductionTypesService {

    @Autowired
    OtherDeductionTypesRepository otherDeductionTypesRepository

    //---------------------- Queries and Mutation ------------------------------------\\

    @GraphQLQuery(name ="fetchAllOtherDeduction")
    List<OtherDeductionTypes>fetchAllOtherDeduction(){
        return otherDeductionTypesRepository.findAll()
    }

    @GraphQLQuery(name ="fetchOtherDeductionPageable")
    Page<OtherDeductionTypes>fetchOtherDeductionPageable(
            @GraphQLArgument(name ="filter") String filter,
            @GraphQLArgument(name = 'page') Integer page,
            @GraphQLArgument(name = 'pageSize') Integer pageSize
    ){
        otherDeductionTypesRepository.getPageable(filter, PageRequest.of(page, pageSize, Sort.Direction.ASC, 'createdDate'))
    }


    @GraphQLMutation(name = "upsertOtherDeductionType")
    GraphQLRetVal<OtherDeductionTypes>upsertOtherDeductionType(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name ="name") String name
    ){
        CompanySettings companySettings = SecurityUtils.currentCompany()
        OtherDeductionTypes type = new OtherDeductionTypes()
        if(id){
          type = otherDeductionTypesRepository.findById(id).get()
        }
        type.name = name
        type.company = companySettings
        type = otherDeductionTypesRepository.save(type)
        return  new GraphQLRetVal<OtherDeductionTypes>(type, true, 'Successfully Saved')
    }

    @GraphQLMutation(name = "deleteOtherDeduction")
    GraphQLRetVal<String> deleteOtherDeduction(@GraphQLArgument(name = "id") UUID id) {
        if (!id) return new GraphQLRetVal<String>("ERROR", false, "Failed to delete event calendar")
        OtherDeductionTypes type = otherDeductionTypesRepository.findById(id).get()
        otherDeductionTypesRepository.delete(type)
        return new GraphQLRetVal<String>("OK", true, "Successfully deleted event.")
    }

}

