package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.ApTransaction
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.security.SecurityUtils
import com.backend.gbp.services.GeneratorService
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
class ApTransactionServices extends AbstractDaoService<ApTransaction> {

	@Autowired
	GeneratorService generatorService

    ApTransactionServices() {
		super(ApTransaction.class)
	}
	
	@GraphQLQuery(name = "apTransactionById")
	ApTransaction apTransactionById(
			@GraphQLArgument(name = "id") UUID id
	) {
		findOne(id)
	}
	
	@GraphQLQuery(name = "apTransactionActive", description = "Find Ap Transaction Active")
	List<ApTransaction> apTransactionActive() {
		def company = SecurityUtils.currentCompanyId()
		createQuery("Select ap from ApTransaction ap where ap.status = true and ap.company = :company", [company: company]).resultList
	}

	@GraphQLQuery(name = "apTransactionByType", description = "Find Ap Transaction Active")
	List<ApTransaction> apTransactionActive(@GraphQLArgument(name = "type") UUID type,
											@GraphQLArgument(name = "category") String category) {
		def company = SecurityUtils.currentCompanyId()
		createQuery("Select ap from ApTransaction ap where ap.supplierType.id = :type and ap.category = :category and ap.status = true and ap.company = :company",
				[type: type, category: category, company: company]).resultList
	}

	@GraphQLQuery(name = "apTransactionOthers", description = "Find Ap Transaction Active")
	List<ApTransaction> apTransactionOthers(@GraphQLArgument(name = "category") String category) {
		def company = SecurityUtils.currentCompanyId()
		createQuery("Select ap from ApTransaction ap where ap.supplierType is null and ap.category = :category and ap.status = true and ap.company = :company",
				[category: category, company: company]).resultList
	}

	@GraphQLQuery(name = "apTransactionList", description = "Transaction List")
	List<ApTransaction> apTransactionList(@GraphQLArgument(name = "desc") String desc,
										  @GraphQLArgument(name = "type") UUID type,
										  @GraphQLArgument(name = "category") String category) {

		def company = SecurityUtils.currentCompanyId()

		def query = "Select f from ApTransaction f where lower(f.description) like lower(concat('%',:desc,'%'))"
		Map<String, Object> params = new HashMap<>()
		params.put('desc', desc)

		if(company){
			query+= " and f.company = :company"
			params.put('company', company)
		}

		if(type){
			query+= " and f.supplierType.id = :type"
			params.put('type', type)
		}

		if(category){
			query+= " and f.category = :category"
			params.put('category', category)
		}

		createQuery(query,
				params)
				.resultList.sort { it.description }

	}

	@GraphQLQuery(name = "apTransactionPage", description = "Transaction List")
	Page<ApTransaction> apTransactionPage(@GraphQLArgument(name = "desc") String desc,
										  @GraphQLArgument(name = "type") UUID type,
										  @GraphQLArgument(name = "category") String category,
										  @GraphQLArgument(name = "page") Integer page,
										  @GraphQLArgument(name = "size") Integer size) {

		def company = SecurityUtils.currentCompanyId()

		String query  = "Select f from ApTransaction f where lower(f.description) like lower(concat('%',:desc,'%'))"
		String countQuery  = "Select count(f) from ApTransaction f where lower(f.description) like lower(concat('%',:desc,'%'))"
		Map<String, Object> params = new HashMap<>()
		params.put('desc', desc)

		if(company){
			query+= " and f.company = :company"
			countQuery+= " and f.company = :company"
			params.put('company', company)
		}

		if(type){
			query+= " and f.supplierType.id = :type"
			countQuery+= " and f.supplierType.id = :type"
			params.put('type', type)
		}

		if(category){
			query+= " and f.category = :category"
			countQuery+= " and f.category = :category"
			params.put('category', category)
		}

		query += ''' ORDER BY f.description ASC'''

		getPageable(query, countQuery, page, size, params)

	}

	//mutations
	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "upsertApTransaction")
	ApTransaction upsertApTransaction(
			@GraphQLArgument(name = "fields") Map<String, Object> fields,
			@GraphQLArgument(name = "id") UUID id
	) {
		def company = SecurityUtils.currentCompanyId()
		upsertFromMap(id, fields, { ApTransaction entity, boolean forInsert ->
			if(forInsert){
				entity.company = company
			}
		})
		
	}
}
