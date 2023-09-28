package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.Bank
import com.backend.gbp.repository.accounting.BankRepository
import com.backend.gbp.security.SecurityUtils
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.GeneratorType
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Service

@Service
@GraphQLApi
class BankServices {

	
	@Autowired
	BankRepository bankRepository
	
	@Autowired
	GeneratorService generatorService
	
	@GraphQLQuery(name = "bankById")
	Bank bankById(
			@GraphQLArgument(name = "id") UUID id
	) {
		return bankRepository.findById(id).get()
	}

	@GraphQLQuery(name = "bankList")
	List<Bank> bankList() {
		def company = SecurityUtils.currentCompanyId()
		return bankRepository.getBankList(company)
	}
	
	@GraphQLQuery(name = "banks")
	Page<Bank> banks(
			@GraphQLArgument(name = "filter") String filter,
			@GraphQLArgument(name = "page") Integer page,
			@GraphQLArgument(name = "size") Integer size
	) {
		def company = SecurityUtils.currentCompanyId()
		return bankRepository.getBanks(filter, company, new PageRequest(page, size, Sort.Direction.ASC, "bankaccountId"))
		
	}
	
	@GraphQLMutation
	Bank upsertBanks(
			@GraphQLArgument(name = "id") UUID id,
			@GraphQLArgument(name = "fields") Map<String, Object> fields
	) {
		def company = SecurityUtils.currentCompanyId()

		if (id) {
			def item = bankRepository.findById(id).get()
			entityObjectMapperService.updateFromMap(item, fields)
			
			bankRepository.save(item)
			
		} else {
			def item = new Bank()
			item.company = company
			item.bankaccountId = generatorService.getNextValue(GeneratorType.BANKID, {
				return "BNK-" + StringUtils.leftPad(it.toString(), 6, "0")
			})
			entityObjectMapperService.updateFromMap(item, fields)
			bankRepository.save(item)
		}
	}
	
}
