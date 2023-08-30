package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.AccountCategory
import com.backend.gbp.domain.accounting.AccountType
import com.backend.gbp.domain.accounting.ParentAccount
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.security.SecurityUtils
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.requestscope.ChartofAccountGenerator
import groovy.transform.Canonical
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.BooleanUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Canonical
class OptionDto {
	String label
	String value
}

@Canonical
class AccountTypeDto {
	String label
	List<OptionDto> options
}

@Service
@GraphQLApi
class ParentAccountServices extends AbstractDaoService<ParentAccount> {

	ParentAccountServices() {
		super(ParentAccount.class)
	}

	@GraphQLQuery(name = "coaList", description = "List of charts of Accounts")
	List<ParentAccount> getCOAList() {
		
		createQuery("Select coa from ParentAccount coa where coa.parent is null order by coa.accountCode")
				.resultList.findAll { BooleanUtils.isNotTrue(it.deprecated)}
		
	}

	@GraphQLQuery(name = "groupedAccountTypes", description = "List of  grouped account types")
	List<AccountTypeDto> groupedAccountTypes(){
		def groupedAccountType = AccountCategory.values().collect { category ->
			[
					label: category.label,
					options: AccountType.values()
							.findAll { it.category == category }
							.collect {
								[
								        label:it.label,
										value:it.name()
								] as OptionDto
							}
			] as AccountTypeDto
		}
		return  groupedAccountType
	}


	@GraphQLQuery(name = "parentAccountPageable", description = "List of Mother Accounts")
	Page<ParentAccount> parentAccountPageable(
			@GraphQLArgument(name="filter") String filter,
			@GraphQLArgument(name="page") Integer page,
			@GraphQLArgument(name="size") Integer size
	) {
		UUID companyID = SecurityUtils.currentCompanyId()
		def pageData = getPageable("""
				Select s from ParentAccount s where
				s.company.id = :companyID
				and 
				 (lower(s.accountCode) like lower(concat('%',:filter,'%'))
				  or
				  lower(s.description) like lower(concat('%',:filter,'%'))
				 )
				 order by s.accountCode
			""",
				"""
				 Select count(s) from ParentAccount s where
				 s.company.id = :companyID
				 and
				   (lower(s.accountCode) like lower(concat('%',:filter,'%'))
				 or
				 lower(s.description) like lower(concat('%',:filter,'%'))
				  )
			""",
				page,
				size,
				[
						filter: filter,
						companyID: companyID
				]
		)

		pageData.content.each {
			it.accountTrace = it.accountCode
		}

		pageData

	}
	
	@GraphQLQuery(name = "getCoaById", description = "Get getCoaById")
	ParentAccount getCoaById(@GraphQLArgument(name = "id") UUID id) {
		if(id){
			findOne(id)
		}else{
			return null
		}

	}

	//mutation
	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "updateInsertParentAccount", description = "insert chartsOfAccounts")
	ParentAccount updateInsertParentAccount(
			@GraphQLArgument(name = "fields") Map<String, Object> fields,
			@GraphQLArgument(name = "id") UUID id
	) {

		upsertFromMap(id, fields, { ParentAccount entity, boolean forInsert ->
			if (forInsert) {
				entity.company = SecurityUtils.currentCompany()
				entity.accountCategory = entity.accountType.category.name().toString()
				String a = entity.accountType.category.name().toString()
				String b = entity.accountCategory
			}
		})

	}


}

