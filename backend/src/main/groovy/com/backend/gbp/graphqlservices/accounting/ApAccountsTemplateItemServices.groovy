package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.ApAccountsTemplateItems
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.rest.dto.payables.AccountsTemplateItemDto
import com.backend.gbp.services.GeneratorService
import com.fasterxml.jackson.databind.ObjectMapper
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@GraphQLApi
class ApAccountsTemplateItemServices extends AbstractDaoService<ApAccountsTemplateItems> {

	@Autowired
	GeneratorService generatorService

	@Autowired
	ApAccountsTemplateServices accountsTemplateServices

	@Autowired
	ObjectMapper objectMapper

    ApAccountsTemplateItemServices() {
		super(ApAccountsTemplateItems.class)
	}
	
	@GraphQLQuery(name = "apAccountsTemplateItemById")
	ApAccountsTemplateItems apAccountsTemplateItemById(
			@GraphQLArgument(name = "id") UUID id
	) {
		findOne(id)
	}

	@GraphQLQuery(name = "accountsItemsByParent", description = "Find Ap Accounts Template Items By Parent")
	List<ApAccountsTemplateItems> accountsItemsByParent(@GraphQLArgument(name = "id") UUID id) {
		createQuery("Select ap from ApAccountsTemplateItems ap where ap.apAccountsTemplate.id = :id",
				[id: id]).resultList
	}


	//mutations
	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "upsertAccountTemplateItem")
	ApAccountsTemplateItems upsertAccountTemplateItem(
			@GraphQLArgument(name = "entries") List<Map<String, Object>> entries,
			@GraphQLArgument(name = "id") UUID id
	) {
		def parent = accountsTemplateServices.apAccountsTemplateById(id)
		def items = entries as ArrayList<AccountsTemplateItemDto>

		def upsert = new ApAccountsTemplateItems()

		items.each {
			def mapped = objectMapper.convertValue(it, AccountsTemplateItemDto.class)
			if(mapped.isNew){
				upsert = new ApAccountsTemplateItems()
				upsert.apAccountsTemplate = parent
				upsert.code = mapped.code
				upsert.desc = mapped.desc
				upsert.accountType = mapped.accountType
				save(upsert)
			}
		}

		return upsert
	}

	//mutations
	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "removeAccountTemplateItem")
	ApAccountsTemplateItems removeAccountTemplateItem(
			@GraphQLArgument(name = "id") UUID id
	) {
		def obj = findOne(id)
		if(obj){
			delete(obj)
		}
		return obj
	}
}
