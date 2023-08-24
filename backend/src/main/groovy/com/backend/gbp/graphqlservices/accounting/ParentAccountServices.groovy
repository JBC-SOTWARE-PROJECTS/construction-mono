package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.ParentAccount
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.requestscope.ChartofAccountGenerator
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.BooleanUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@GraphQLApi
class ParentAccountServices extends AbstractDaoService<ParentAccount> {

	ParentAccountServices() {
		super(ParentAccount.class)
	}
	
	@Autowired
	GeneratorService generatorService

	@Autowired
	ChartofAccountGenerator chartofAccountGenerator


	@GraphQLQuery(name = "coaList", description = "List of charts of Accounts")
	List<ParentAccount> getCOAList() {
		
		createQuery("Select coa from ParentAccount coa where coa.parent is null order by coa.accountCode")
				.resultList.findAll { BooleanUtils.isNotTrue(it.deprecated)}
		
	}


	@GraphQLQuery(name = "motherAccountsPage", description = "List of Mother Accounts")
	Page<ParentAccount> motherAccountsPage(
			@GraphQLArgument(name="filter") String filter,
			@GraphQLArgument(name="page") Integer page,
			@GraphQLArgument(name="size") Integer size
	) {
		def pageData = getPageable("""
				Select s from ParentAccount s where
				s.parent is null
				and 
				 (lower(s.accountCode) like lower(concat('%',:filter,'%'))
				  or
				  lower(s.description) like lower(concat('%',:filter,'%'))
				 )
				 order by s.accountCode
			""",
				"""
				 Select count(s) from ParentAccount s where
				 s.parent is null
				 and
				   (lower(s.accountCode) like lower(concat('%',:filter,'%'))
				 or
				 lower(s.description) like lower(concat('%',:filter,'%'))
				  )
			""",
				page,
				size,
				[
						filter: filter
				]
		)

		pageData.content.each {
			it.accountTrace = it.accountCode
		}

		pageData

	}
	/*@GraphQLQuery(name = "subLedger", description = "Get all ChartsOfAccounts by Group")
	List<ParentAccount> getCOASubLeger(@GraphQLContext ParentAccount chartOfAccount) {
		
		createQuery("Select coa from ParentAccount coa where coa.parent = :id order by coa.createdDate",
				[id: chartOfAccount.id])
				.resultList
		
	}*/
	
	/*@GraphQLQuery(name = "findByTags", description = "Get all ChartsOfAccounts by Group")
	ParentAccount findByTags(@GraphQLArgument(name = "tags") String tags) {
		
		createQuery("Select coa from ParentAccount coa where (lower(coa.tags) like lower(concat('%',:tag,'%')))",
				[tag: tags]).resultList.find()
		
	}*/
	
	/*@GraphQLQuery(name = "categoryList", description = "Get Category ChartsOfAccounts")
	List<ParentAccount> getCategory() {
		
		findAll().sort { it.createdDate }
		
	}*/
	
	@GraphQLQuery(name = "getCoaById", description = "Get getCoaById")
	ParentAccount getCoaById(@GraphQLArgument(name = "id") UUID id) {
		if(id){
			findOne(id)
		}else{
			return null
		}

	}
	
	@GraphQLQuery(name = "searchCoaByPage", description = "Search COA by Page")
	Page<ParentAccount> searchCoaByPage(@GraphQLArgument(name = "filter") String filter,
                                         @GraphQLArgument(name = "page") Integer page,
                                         @GraphQLArgument(name = "size") Integer size) {
		
		def pageData = getPageable("""
				      Select s from ParentAccount s where
						 (lower(s.accountCode) like lower(concat('%',:filter,'%'))
						  or
						  lower(s.description) like lower(concat('%',:filter,'%'))
						 )
			""",
				"""
					 Select count(s) from ParentAccount s where
					   (lower(s.accountCode) like lower(concat('%',:filter,'%'))
					 or
					 lower(s.description) like lower(concat('%',:filter,'%'))
					  )
       """,
				page,
				size,
				[
						filter: filter
				]
		)
		
		pageData.content.each {
			it.accountTrace = it.accountCode
		}
		
		pageData
		
	}
	
	//mutation
	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "chartsOfAccounts", description = "insert chartsOfAccounts")
	ParentAccount chartsOfAccounts(
			@GraphQLArgument(name = "fields") Map<String, Object> fields,
			@GraphQLArgument(name = "id") UUID id
	) {
		
		upsertFromMap(id, fields, { ParentAccount entity, boolean forInsert ->
			
			if (forInsert) {
				entity.category = entity.accountCode.length() <= 2
			}
			
		})

	}

	@GraphQLQuery(name = "accountBalancesCoaList", description = "List of charts of Accounts")
	List<ChartOfAccountGenerate> getAccountBalancesCoaList(
			@GraphQLArgument(name = "motherAccountCode") List<String> motherAccountCode = []
	){
		chartofAccountGenerator.getAccountBalanceParentAccount(motherAccountCode)
	}
	
}

