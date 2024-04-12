package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.Office
import com.backend.gbp.domain.accounting.DebitMemo
import com.backend.gbp.domain.accounting.Disbursement
import com.backend.gbp.domain.accounting.DisbursementPettyCash
import com.backend.gbp.domain.accounting.ExpenseTransaction
import com.backend.gbp.domain.accounting.PettyCashAccounting
import com.backend.gbp.domain.assets.Assets
import com.backend.gbp.domain.projects.Projects
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.rest.dto.payables.DisbursementExpDto
import com.backend.gbp.rest.dto.payables.DisbursementPettyDto
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
class DisbursementPettyCashServices extends AbstractDaoService<DisbursementPettyCash> {

	@Autowired
	GeneratorService generatorService

	@Autowired
	ObjectMapper objectMapper

	@Autowired
	DisbursementServices disbursementServices

	@Autowired
	PettyCashAccountingService pettyCashAccountingService


    DisbursementPettyCashServices() {
		super(DisbursementPettyCash.class)
	}
	
	@GraphQLQuery(name = "disPettyById")
	DisbursementPettyCash disPettyById(
			@GraphQLArgument(name = "id") UUID id
	) {
		findOne(id)
	}
	
	@GraphQLQuery(name = "disPettyByParent", description = "Find DisbursementPettyCash by Parent")
	List<DisbursementPettyCash> disPettyByParent(@GraphQLArgument(name = "id") UUID id) {
		createQuery("Select ds from DisbursementPettyCash ds where ds.disbursement.id = :id", ["id": id]).resultList
	}

	//mutations
	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "upsertDisPettyCash")
	DisbursementPettyCash upsertDisPettyCash(
			@GraphQLArgument(name="it") DisbursementPettyDto it,
			@GraphQLArgument(name="parent")	Disbursement parent
	) {
		DisbursementPettyCash upsert = new DisbursementPettyCash()
		if(!it.isNew){
			upsert = findOne(UUID.fromString(it.id))
		}
		upsert.disbursement = parent
		if(it.pettyCashAccounting) {
			def pc = objectMapper.convertValue(it.pettyCashAccounting, PettyCashAccounting.class)
			upsert.pettyCashAccounting = pc
		}
		upsert.amount = it.amount
		save(upsert)
	}

	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "upsertDMPettyCash")
	DisbursementPettyCash upsertDMPettyCash(
			@GraphQLArgument(name="it") DisbursementPettyDto it,
			@GraphQLArgument(name="parent")	DebitMemo parent
	) {
		DisbursementPettyCash upsert = new DisbursementPettyCash()
		if(!it.isNew){
			upsert = findOne(UUID.fromString(it.id))
		}
		upsert.debitMemo = parent
		if(it.pettyCashAccounting) {
			def pc = objectMapper.convertValue(it.pettyCashAccounting, PettyCashAccounting.class)
			upsert.pettyCashAccounting = pc
		}
		upsert.amount = it.amount
		save(upsert)
	}

	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "removeDisPettyCash")
	DisbursementPettyCash removeDisPettyCash(
			@GraphQLArgument(name = "id") UUID id
	) {
		def ex = findOne(id)
		//update parent
		disbursementServices.updateRemove(ex.disbursement.id, "PCV", ex.amount)
		delete(ex)
		return ex
	}

	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "removeDisPettyCashByList")
	DisbursementPettyCash removeDisPettyCashByList(
			@GraphQLArgument(name = "id") UUID id
	) {
		def ex = this.disPettyByParent(id)
		//update parent
		def result = new DisbursementPettyCash()
		ex.each {
			def obj = it
			result = it
			delete(obj)
		}
		return result
	}

}
