package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.AccountCategory
import com.backend.gbp.domain.accounting.AccountType
import com.backend.gbp.domain.accounting.ParentAccount
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
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

	@GraphQLQuery(name = "parentAccountsPerCategory", description = "List of parents account")
	List<AccountTypeDto> parentAccountsPerCategory() {
		List<ParentAccount> parentAccounts = createQuery("Select p from ParentAccount p order by p.accountCode")
				.resultList.findAll { BooleanUtils.isNotTrue(it.deprecated)}
		return   AccountCategory.values().collect { category ->
			[
					label: category.label,
					options: parentAccounts.findAll { it.accountCategory == category }
							.collect {
								[
										label:it.accountName,
										value:it.id
								] as OptionDto
							}
			] as AccountTypeDto
		}
	}

	@GraphQLQuery(name = "groupedAccountTypes", description = "List of  grouped account types")
	static List<AccountTypeDto> groupedAccountTypes(){
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
			@GraphQLArgument(name="accountCategory") AccountCategory accountCategory,
			@GraphQLArgument(name="filter") String filter,
			@GraphQLArgument(name="page") Integer page,
			@GraphQLArgument(name="size") Integer size
	) {
		UUID companyID = SecurityUtils.currentCompanyId()
		Map<String,Object> params = [:]
		params['filter'] = filter
		params['companyID'] = companyID

		String query = """ from ParentAccount s where
				s.company.id = :companyID
				and 
				(lower(s.accountCode) like lower(concat('%',:filter,'%'))
				or
				lower(s.accountName) like lower(concat('%',:filter,'%'))
				) """

		if(accountCategory){
			query += """ and s.accountCategory = :accountCategory """
			params['accountCategory'] = accountCategory
		}

		def pageData = getPageable("""
				Select s ${query}
				 order by s.accountCode
			""",
				"""
				 Select count(s) ${query}
			""",
				page,
				size,
				params
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
//	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "updateInsertParentAccount", description = "insert chartsOfAccounts")
	GraphQLRetVal<ParentAccount> updateInsertParentAccount(
			@GraphQLArgument(name = "fields") Map<String, Object> fields,
			@GraphQLArgument(name = "id") UUID id
	) {

		try {
			ParentAccount parentAccount = upsertFromMap(id, fields, { ParentAccount entity, boolean forInsert ->
				if (forInsert) {
					entity.company = SecurityUtils.currentCompany()
					entity.accountCategory = entity.accountType.category.name().toString()
					String a = entity.accountType.category.name().toString()
					String b = entity.accountCategory
				}
			})
			return  new GraphQLRetVal<ParentAccount>(parentAccount,true,'Your changes have been saved.')
		}catch (e){
			if(e?.cause['constraintName'] == 'constraint_code_unique')
				return  new GraphQLRetVal<ParentAccount>(new ParentAccount(),false,'Code Duplication Detected.')
			else
				return  new GraphQLRetVal<ParentAccount>(new ParentAccount(),false,'An error occurred while attempting to save the record.')
		}
	}


}

