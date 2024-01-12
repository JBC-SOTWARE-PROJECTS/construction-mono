package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.Office
import com.backend.gbp.domain.accounting.PettyCashAccounting
import com.backend.gbp.domain.accounting.PettyCashOther
import com.backend.gbp.domain.projects.Projects
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.domain.accounting.ExpenseTransaction
import com.backend.gbp.rest.dto.payables.PCVOthersDto
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
class PettyCashOtherServices extends AbstractDaoService<PettyCashOther> {

	@Autowired
	GeneratorService generatorService

	@Autowired
	ObjectMapper objectMapper



	PettyCashOtherServices() {
		super(PettyCashOther.class)
	}

	@GraphQLQuery(name = "othersById")
	PettyCashOther othersById(
			@GraphQLArgument(name = "id") UUID id
	) {
		findOne(id)
	}

	@GraphQLQuery(name = "othersByPetty")
	List<PettyCashOther> othersByPetty(@GraphQLArgument(name = "id") UUID id) {
		createQuery("Select da from PettyCashOther da where da.pettyCash.id = :id", ["id": id]).resultList
	}


	//mutations
	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "upsertOthers")
	PettyCashOther upsertOthers(
			@GraphQLArgument(name="it") PCVOthersDto it,
			@GraphQLArgument(name="parent") PettyCashAccounting parent
	) {
		PettyCashOther upsert = new PettyCashOther()
		def type = objectMapper.convertValue(it.transType, ExpenseTransaction.class)

		if(!it.isNew){
			upsert = findOne(UUID.fromString(it.id))
		}
		upsert.transType = type
		upsert.pettyCash = parent
		if(it.office){
			def office = objectMapper.convertValue(it.office, Office.class)
			upsert.office = office
		}
		if(it.project){
			def project = objectMapper.convertValue(it.project, Projects.class)
			upsert.project = project
		}
		upsert.amount = it.amount
		upsert.remarks = it.remarks

		save(upsert)
	}


	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "removeOthersByParent")
	PettyCashOther removeOthersByParent(
			@GraphQLArgument(name="parent") UUID parent
	) {
		def items = this.othersByPetty(parent)
		def lastRemove = new PettyCashOther()
		items.each {
			lastRemove = it
			def remove = it
			delete(remove)
		}
		return lastRemove
	}

	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "removeOthersById")
	PettyCashOther removeOthersById(
			@GraphQLArgument(name="id") UUID id
	) {
		def obj = findOne(id)
		if(obj){
			delete(obj)
		}
		return obj
	}

}
