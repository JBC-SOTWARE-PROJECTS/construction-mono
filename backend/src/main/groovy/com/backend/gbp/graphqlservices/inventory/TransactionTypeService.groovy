package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.inventory.TransactionType
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.security.SecurityUtils
import com.backend.gbp.services.GeneratorService
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@GraphQLApi
class TransactionTypeService extends AbstractDaoService<TransactionType> {
	//transaction Type for Receiving Report (SRR)
	
	@Autowired
	GeneratorService generatorService

    TransactionTypeService() {
		super(TransactionType.class)
	}
	
	@GraphQLQuery(name = "transTypeById")
	TransactionType transTypeById(
			@GraphQLArgument(name = "id") UUID id
	) {
		findOne(id)
	}
	
	@GraphQLQuery(name = "transactionList", description = "Transaction List")
	List<TransactionType> transactionList() {
		findAll().sort { it.description }
	}
	
	@GraphQLQuery(name = "transTypeByTag", description = "transaction type by tag")
	List<TransactionType> transTypeByTag(@GraphQLArgument(name = "tag") String tag) {
		def company = SecurityUtils.currentCompanyId()

		String query = '''Select f from TransactionType f where f.tag = :tag and f.status = true'''
		Map<String, Object> params = new HashMap<>()
		params.put("tag", tag)

		if (company) {
			query += ''' and (f.company = :company)'''
			params.put("company", company)
		}

		createQuery(query, params).resultList.sort { it.description }
	}

	@GraphQLQuery(name = "transTypeByTagFilter", description = "transaction type by tag")
	List<TransactionType> transTypeByTagFilter(@GraphQLArgument(name = "tag") String tag,
                                               @GraphQLArgument(name = "filter") String filter) {
		def company = SecurityUtils.currentCompanyId()

		String query = '''Select f from TransactionType f where f.tag = :tag and (lower(f.description) like lower(concat('%',:filter,'%')))'''
		Map<String, Object> params = new HashMap<>()
		params.put("tag", tag)
		params.put("filter", filter)

		if (company) {
			query += ''' and (f.company = :company)'''
			params.put("company", company)
		}

		createQuery(query, params).resultList.sort { it.description }
	}
	
	//mutation
	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "upsertTransType", description = "insert TransType")
	TransactionType upsertTransType(
			@GraphQLArgument(name = "fields") Map<String, Object> fields,
			@GraphQLArgument(name = "id") UUID id
	) {
		def company = SecurityUtils.currentCompanyId()
		upsertFromMap(id, fields, { TransactionType entity, boolean forInsert ->
			if(forInsert){
				entity.company = company
			}
		})
	}
	
}
