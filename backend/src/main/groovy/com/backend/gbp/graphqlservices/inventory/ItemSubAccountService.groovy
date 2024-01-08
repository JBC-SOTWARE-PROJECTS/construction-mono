package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.inventory.ItemSubAccount
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.security.SecurityUtils
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
class ItemSubAccountService extends AbstractDaoService<ItemSubAccount> {

    ItemSubAccountService() {
        super(ItemSubAccount.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService


    @GraphQLQuery(name = "itemSubAccountList")
    List<ItemSubAccount> itemSubAccountList(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "type") String type
    ) {
        def company = SecurityUtils.currentCompanyId()

        String query = '''Select e from ItemSubAccount e where lower(concat(e.subAccountCode,e.subAccountDescription)) like lower(concat('%',:filter,'%'))'''
        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)

        if (type) {
            query += ''' and (e.accountType = :type)'''
            params.put("type", type)
        }

        if (company) {
            query += ''' and (e.company = :company)'''
            params.put("company", company)
        }

        createQuery(query, params).resultList.sort {it.subAccountCode}
    }

    @GraphQLQuery(name = "itemSubAccountActive")
    List<ItemSubAccount> itemSubAccountActive(
            @GraphQLArgument(name = "type") ArrayList<String> type
    ) {
        def company = SecurityUtils.currentCompanyId()
        String query = '''Select e from ItemSubAccount e where e.isActive = :status'''
        Map<String, Object> params = new HashMap<>()
        params.put('status', true)

        if (type) {
            query += ''' and (e.accountType in :type)'''
            params.put("type", type)
        }

        if (company) {
            query += ''' and (e.company = :company)'''
            params.put("company", company)
        }
        createQuery(query, params).resultList.sort { it.accountType }
    }

    // ============== Mutation =======================//
    @GraphQLMutation(name = "upsertItemSubAccount")
    @Transactional
    ItemSubAccount upsertItemSubAccount(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ) {
        def company = SecurityUtils.currentCompanyId()
        upsertFromMap(id, fields, { ItemSubAccount entity, boolean forInsert ->
            if(forInsert){
                entity.company = company
            }
        })
    }

}
