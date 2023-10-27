package com.backend.gbp.graphqlservices.hrm

import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.hrm.Allowance
import com.backend.gbp.domain.hrm.AllowanceItem
import com.backend.gbp.domain.hrm.AllowancePackage
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.hrm.AllowanceItemRepository
import com.backend.gbp.repository.hrm.AllowancePackageRepository
import com.backend.gbp.repository.hrm.AllowanceRepository
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
class AllowanceItemService extends AbstractDaoService<AllowanceItem> {

    AllowanceItemService(){
        super(AllowanceItem.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    AllowanceItemRepository allowanceItemRepository

    @Autowired
    AllowanceRepository allowanceRepository

    @Autowired
    AllowancePackageRepository allowancePackageRepository


    @GraphQLQuery(name ="fetchAllowanceItemPageable", description = "fetch all allowance Item")
    Page<AllowanceItem> fetchAllowanceItemPageable(
            @GraphQLArgument(name ="filter") String filter,
            @GraphQLArgument(name = 'page') Integer page,
            @GraphQLArgument(name = 'pageSize') Integer pageSize
    ){
        return  allowanceItemRepository.getAllowanceItemPageable(filter, PageRequest.of(page, pageSize, Sort.Direction.ASC, 'createdDate'))
    }

    @GraphQLQuery(name ="fetchAllowanceItemByPackagePageable", description = "fetch all allowance Item")
    Page<AllowanceItem> fetchAllowanceItemByPackagePageable(
            @GraphQLArgument(name ="allowancePackage") UUID allowancePackage,
            @GraphQLArgument(name = 'page') Integer page,
            @GraphQLArgument(name = 'pageSize') Integer pageSize,
            @GraphQLArgument(name = 'filter') String filter
    ){
        return  allowanceItemRepository.getAllowanceItemByPackagePageable(allowancePackage,filter, PageRequest.of(page, pageSize, Sort.Direction.DESC, 'createdDate'))
    }


    @GraphQLMutation(name = "upsertAllAllowanceItem", description = "add allowance item")
    GraphQLRetVal<String> upsertAllAllowanceItem(
            @GraphQLArgument(name ="allowancePackage") UUID allowancePackageId,
            @GraphQLArgument(name ="allowanceList") List<Allowance> allowanceList,
            @GraphQLArgument(name ="toDelete") List<UUID> toDelete

    ){

        List<AllowanceItem> allowances = new ArrayList<AllowanceItem>()
        CompanySettings companySettings = SecurityUtils.currentCompany()

        AllowancePackage allPackage = allowancePackageRepository.findById(allowancePackageId).get()

        List<AllowanceItem> allowanceItemList = allowanceItemRepository.getByPackage(allowancePackageId)

        List<AllowanceItem> deleteItems = [];
        List<UUID> existAllowanceItemTypes = [];

        allowanceItemList.each {

            if(toDelete.contains(it.allowanceType.id)){
                deleteItems.push(it)
            }
            existAllowanceItemTypes.push(it.allowanceType.id)
        }
         allowanceItemRepository.deleteAll(deleteItems)

            allowanceList.each {it
                if(!existAllowanceItemTypes.contains(it.id)) {
                    AllowanceItem allowanceItem = new AllowanceItem()

                    allowanceItem.allowanceType = allowanceRepository.findById(it.id).get()
                    allowanceItem.amount = it.amount
                    allowanceItem.name = it.name
                    allowanceItem.allowanceTypeName = it.allowanceType
                    allowanceItem.allowancePackage = allPackage
                    allowanceItem.company = companySettings
                    allowances.add(allowanceItem)
                }

            }
            allowanceItemRepository.saveAll(allowances)
         return new GraphQLRetVal<String>("success", true , "Successfully Saved!")
    }

    @GraphQLMutation(name = "upsertAllowanceItem", description = "add allowance package")
    GraphQLRetVal<AllowanceItem> upsertAllowanceItem(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name ="fields") Map<String, Object> fields
    ){
        if(id){
            AllowanceItem allowanceItem = allowanceItemRepository.findById(id).get()
            allowanceItem = objectMapper.updateValue(allowanceItem, fields)
            allowanceItem = allowanceItemRepository.save(allowanceItem)
            return new GraphQLRetVal<AllowanceItem>(allowanceItem, true, 'Successfully Updated')
        }
        AllowanceItem allowanceItem = objectMapper.convertValue(fields, AllowanceItem)
        allowanceItem =allowanceItemRepository.save(allowanceItem)
        return  new GraphQLRetVal<AllowanceItem>(allowanceItem, true, 'Successfully Saved')
    }



    @GraphQLMutation(name = "deleteAllowanceItem", description = "Delete delete Allowance Item")
    GraphQLRetVal<String> deleteAllowanceItem(@GraphQLArgument(name = "id") UUID id) {
        if (!id) return new GraphQLRetVal<String>("ERROR", false, "Failed to delete allowance item")
        AllowanceItem allowanceItem = allowanceItemRepository.findById(id).get()
        allowanceItemRepository.delete(allowanceItem)
        return new GraphQLRetVal<String>("OK", true, "Successfully deleted allowance item.")
    }

}
