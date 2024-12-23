package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.Integration
import com.backend.gbp.domain.accounting.IntegrationGroup
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.security.SecurityUtils
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@GraphQLApi
class IntegrationGroupServices extends AbstractDaoService<IntegrationGroup> {

    IntegrationGroupServices(){
        super(IntegrationGroup.class)
    }

    @Autowired
    IntegrationServices integrationServices

    @GraphQLQuery(name="integrationGroupList")
    List<IntegrationGroup> integrationGroupList(){
        return findAll().sort{it.createdDate}
    }

    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation(name="upsertIntegrationGroup")
    Boolean upsertIntegration(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ) {
        try{
            upsertFromMap(id, fields, { IntegrationGroup entity, boolean forInsert ->
                if(forInsert) entity.company = SecurityUtils.currentCompany()
            })
            return true
        }catch(ignored){
            return false
        }
    }

    @GraphQLQuery(name="integrationGroupItemList")
    Page<Integration> integrationGroupItemList(
            @GraphQLArgument(name="id") UUID id,
            @GraphQLArgument(name="filter") String filter,
            @GraphQLArgument(name="page") Integer page,
            @GraphQLArgument(name="size") Integer size
    ){
        try{
            integrationServices.getPageable(
                    """
              	Select i from Integration i where i.integrationGroup.id = :id
              	and 
              		(
						lower(coalesce(i.description,'')) like lower(concat('%',:filter,'%')) or 
						lower(coalesce(i.flagValue,'')) like lower(concat('%',:filter,'%'))
              		) 
                order by i.orderPriority
				""",
                    """
			 	Select count(i) from Integration i where i.integrationGroup.id = :id
              	and 
              		(
						lower(coalesce(i.description,'')) like lower(concat('%',:filter,'%')) or 
						lower(coalesce(i.flagValue,'')) like lower(concat('%',:filter,'%'))
              		) 
				""",
                    page,
                    size,
                    [
                            filter: filter,
                            id: id,
                    ]
            )
        }
        catch (ignored){
            return Page.empty()
        }
    }

    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation(name="onDeleteIntegrationGroup")
    Boolean onDeleteIntegrationGroup(
            @GraphQLArgument(name = "id") UUID id
    ) {
       deleteById(id)
    }
}
