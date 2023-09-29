package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.ExpenseTransaction
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
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
class ExpenseTransactionService extends AbstractDaoService<ExpenseTransaction> {
	//transaction Type for Petty Cash and Disbursement (This are the for the dynamic accounts targeting)

	@Autowired
	GeneratorService generatorService

    ExpenseTransactionService() {
		super(ExpenseTransaction.class)
	}
	
	@GraphQLQuery(name = "expenseTypeById")
	ExpenseTransaction expenseTypeById(
			@GraphQLArgument(name = "id") UUID id
	) {
		findOne(id)
	}
	
	@GraphQLQuery(name = "exTransList", description = "Transaction List")
	List<ExpenseTransaction> exTransList() {
		findAll().sort { it.description }
	}

	@GraphQLQuery(name = "transTypeBySource", description = "transaction type by type")
	ExpenseTransaction transTypeBySource(@GraphQLArgument(name = "type") String type, @GraphQLArgument(name = "source") String source) {
		createQuery("Select f from ExpenseTransaction f where f.type = :type and f.source = :source",
				[type: type, source: source]).resultList.find()
	}
	
	@GraphQLQuery(name = "transTypeByType", description = "transaction type by type")
	List<ExpenseTransaction> transTypeByType(@GraphQLArgument(name = "type") String type,
                                             @GraphQLArgument(name = "filter") String filter) {
		def result = createQuery("Select f from ExpenseTransaction f where f.type = :type and lower(f.description) like lower(concat('%',:filter,'%'))",
				[type: type, filter: filter]).resultList

		def customCompare = { str1, str2 ->
			def splitAndConvert = { str ->
				def parts = str.split(/(?<=[a-zA-Z])(?=\d)/)
				parts.collect { it.isNumber() ? it.toInteger() : it }
			}

			def parts1 = splitAndConvert(str1)
			def parts2 = splitAndConvert(str2)

			for (int i = 0; i < Math.min(parts1.size(), parts2.size()); i++) {
				if (parts1[i] != parts2[i]) {
					return parts1[i] <=> parts2[i]
				}
			}

			return parts1.size() <=> parts2.size()
		}

		return result.sort {a, b ->
			customCompare(a.source, b.source)
		}
	}
	
	//mutation
	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "upsertExTransType", description = "insert TransType")
	GraphQLRetVal<Boolean> upsertExTransType(
			@GraphQLArgument(name = "fields") Map<String, Object> fields,
			@GraphQLArgument(name = "id") UUID id
	) {

		if(id){
			upsertFromMap(id, fields, { ExpenseTransaction entity, boolean forInsert ->
			})
			return new GraphQLRetVal<Boolean>(true, true, "Transaction Type successfully updated")
		}else{
			def type = fields['type'] as String
			def source = fields['source'] as String
			def check = this.transTypeBySource(type, source)
			if(check?.id){
				return new GraphQLRetVal<Boolean>(false, false, "Source Column is already in used")
			}else{
				upsertFromMap(id, fields, { ExpenseTransaction entity, boolean forInsert ->
				})
				return new GraphQLRetVal<Boolean>(true, true, "Transaction Type successfully added")
			}

		}

	}
	
}
