package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.Office
import com.backend.gbp.domain.accounting.Disbursement
import com.backend.gbp.domain.accounting.DisbursementExpense
import com.backend.gbp.domain.accounting.ExpenseTransaction
import com.backend.gbp.domain.projects.Projects
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.rest.dto.payables.DisbursementExpDto
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
class DisbursementExpenseServices extends AbstractDaoService<DisbursementExpense> {

	@Autowired
	GeneratorService generatorService

	@Autowired
	ObjectMapper objectMapper

	@Autowired
	DisbursementServices disbursementServices


    DisbursementExpenseServices() {
		super(DisbursementExpense.class)
	}
	
	@GraphQLQuery(name = "disExpById")
	DisbursementExpense disExpById(
			@GraphQLArgument(name = "id") UUID id
	) {
		findOne(id)
	}
	
	@GraphQLQuery(name = "disExpByParent", description = "Find DisbursementExpense by Parent")
	List<DisbursementExpense> disExpByParent(@GraphQLArgument(name = "id") UUID id) {
		createQuery("Select ds from DisbursementExpense ds where ds.disbursement.id = :id", ["id": id]).resultList
	}

	//mutations
	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "upsertExp")
	DisbursementExpense upsertExp(
			@GraphQLArgument(name="it") DisbursementExpDto it,
			@GraphQLArgument(name="parent")	Disbursement parent
	) {
		DisbursementExpense upsert = new DisbursementExpense()
		def trans = objectMapper.convertValue(it.transType, ExpenseTransaction.class)

		if(!it.isNew){
			upsert = findOne(UUID.fromString(it.id))
		}
		upsert.disbursement = parent
		if (it.office) {
			def office = objectMapper.convertValue(it.office, Office.class)
			upsert.office = office
		}
		if (it.project) {
			def project = objectMapper.convertValue(it.project, Projects.class)
			upsert.project = project
		}
		upsert.transType = trans
		upsert.amount = it.amount
		upsert.remarks = it.remarks
		
		save(upsert)
	}

	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "removeExpense")
	DisbursementExpense removeExpense(
			@GraphQLArgument(name = "id") UUID id
	) {
		def ex = findOne(id)
		//update parent
		disbursementServices.updateRemove(ex.disbursement.id, "EX", ex.amount)
		delete(ex)
		return ex
	}

	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "removeExpenseByList")
	DisbursementExpense removeExpenseByList(
			@GraphQLArgument(name = "id") UUID id
	) {
		def ex = this.disExpByParent(id)
		//update parent
		def result = new DisbursementExpense()
		ex.each {
			def obj = it
			result = it
			delete(obj)
		}
		return result
	}

}
