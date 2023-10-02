package com.backend.gbp.graphqlservices.hrm


import com.backend.gbp.domain.hrm.Allowance
import com.backend.gbp.domain.hrm.EventCalendar
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.hrm.AllowanceRepository
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Example
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Component
import org.springframework.data.domain.Page


@TypeChecked
@Component
@GraphQLApi
class AllowanceService  {

    @Autowired
    ObjectMapper objectMapper


    @Autowired
    AllowanceRepository allowanceRepository

    //---------------------- Queries and Mutation ------------------------------------\\

    @GraphQLQuery(name ="fetchAllowancePageable", description = "get all allowance")
    Page<Allowance>fetchAllowancePageable(
            @GraphQLArgument(name ="filter") String filter,
            @GraphQLArgument(name = 'page') Integer page,
            @GraphQLArgument(name = 'pageSize') Integer pageSize
    ){
        allowanceRepository.getAllowancePageable(filter, PageRequest.of(page, pageSize, Sort.Direction.ASC, 'createdDate'))
    }



    @GraphQLMutation(name = "upsertAllowanceType", description = " Add allowance type ")
    GraphQLRetVal<Allowance>upsertAllowanceType(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name ="fields") Map<String, Object> fields
    ){
        if(id){
            Allowance allowance = allowanceRepository.findById(id).get()
            allowance = objectMapper.updateValue(allowance, fields)
            allowance = allowanceRepository.save(allowance)
            return new GraphQLRetVal<Allowance>(allowance, true, 'Successfully Updated')
        }
        Allowance allowance = objectMapper.convertValue(fields, Allowance)
        allowance =allowanceRepository.save(allowance)
        return  new GraphQLRetVal<Allowance>(allowance, true, 'Successfully Saved')
    }


    @GraphQLMutation(name = "deleteAllowance", description = "Delete deleteAllowance")
    GraphQLRetVal<String> deleteAllowance(@GraphQLArgument(name = "id") UUID id) {
        if (!id) return new GraphQLRetVal<String>("ERROR", false, "Failed to delete event calendar")
        Allowance allowance = allowanceRepository.findById(id).get()
        allowanceRepository.delete(allowance)
        return new GraphQLRetVal<String>("OK", true, "Successfully deleted event.")
    }

}

