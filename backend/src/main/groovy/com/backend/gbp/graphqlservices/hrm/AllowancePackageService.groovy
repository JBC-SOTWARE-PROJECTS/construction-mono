package com.backend.gbp.graphqlservices.hrm

import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.hrm.AllowancePackage
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.hrm.AllowancePackageRepository
import com.backend.gbp.security.SecurityUtils
import com.fasterxml.jackson.databind.ObjectMapper
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
class AllowancePackageService extends AbstractDaoService<AllowancePackage> {

    AllowancePackageService(){
        super(AllowancePackage.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    AllowancePackageRepository allowancePackageRepository


    @GraphQLQuery(name ="fetchAllAllowancePackage", description = "get all fetch allowance package")
    List<AllowancePackage>fetchAllAllowancePackage(){
        return allowancePackageRepository.fetchAllAllowancePackage()
    }

    @GraphQLQuery(name ="fetchAllowancePackagePageable", description = "fetch all allowance package")
    Page<AllowancePackage> fetchAllowancePackagePageable(
            @GraphQLArgument(name ="filter") String filter,
            @GraphQLArgument(name = 'page') Integer page,
            @GraphQLArgument(name = 'pageSize') Integer pageSize
    ){
      return  allowancePackageRepository.getAllowancePackagePageable(filter, PageRequest.of(page, pageSize, Sort.Direction.ASC, 'createdDate'))
    }


    @GraphQLMutation(name = "upsertAllAllowancePackage", description = "add allowance package")
    GraphQLRetVal<AllowancePackage> upsertAllAllowancePackage(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name ="fields") Map<String, Object> fields
    ){
        CompanySettings companySettings = SecurityUtils.currentCompany()
        if(id){
            AllowancePackage allowancePackage = allowancePackageRepository.findById(id).get()
            allowancePackage = objectMapper.updateValue(allowancePackage, fields)
            allowancePackage.company = companySettings
            allowancePackage = allowancePackageRepository.save(allowancePackage)
            return new GraphQLRetVal<AllowancePackage>(allowancePackage, true, 'Successfully Updated')
        }
        AllowancePackage allowancePackage = objectMapper.convertValue(fields, AllowancePackage)
        allowancePackage.company = companySettings
        allowancePackage =allowancePackageRepository.save(allowancePackage)
        return  new GraphQLRetVal<AllowancePackage>(allowancePackage, true, 'Successfully Saved')
    }

    @GraphQLMutation(name = "deleteAllowancePackage", description = "Delete delete Allowance Package")
    GraphQLRetVal<String> deleteAllowancePackage(@GraphQLArgument(name = "id") UUID id) {
        if (!id) return new GraphQLRetVal<String>("ERROR", false, "Failed to delete event calendar")
        AllowancePackage allowancePackage = allowancePackageRepository.findById(id).get()
        allowancePackageRepository.delete(allowancePackage)
        return new GraphQLRetVal<String>("OK", true, "Successfully deleted event.")
    }

}
