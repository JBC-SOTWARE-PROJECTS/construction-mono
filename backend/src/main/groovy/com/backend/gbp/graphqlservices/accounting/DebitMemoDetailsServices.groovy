package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.Office
import com.backend.gbp.domain.accounting.DebitMemo
import com.backend.gbp.domain.accounting.DebitMemoDetails
import com.backend.gbp.domain.accounting.ExpenseTransaction
import com.backend.gbp.domain.assets.Assets
import com.backend.gbp.domain.projects.Projects
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.repository.OfficeRepository
import com.backend.gbp.rest.dto.payables.DmDetailsDto
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
class DebitMemoDetailsServices extends AbstractDaoService<DebitMemoDetails> {

	@Autowired
	GeneratorService generatorService

	@Autowired
	ObjectMapper objectMapper

	@Autowired
	OfficeRepository officeRepository

	@Autowired
	DebitMemoService debitMemoService


    DebitMemoDetailsServices() {
		super(DebitMemoDetails.class)
	}
	
	@GraphQLQuery(name = "dmDetailsById")
	DebitMemoDetails dmDetailsById(
			@GraphQLArgument(name = "id") UUID id
	) {
		findOne(id)
	}
	
	@GraphQLQuery(name = "dmDetials")
	List<DebitMemoDetails> dmDetials(@GraphQLArgument(name = "id") UUID id) {
		createQuery("Select dm from DebitMemoDetails dm where dm.debitMemo.id = :id", ["id": id]).resultList
	}


	//mutations
	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "upsertDmDetials")
	DebitMemoDetails upsertDmDetials(
			@GraphQLArgument(name="it") DmDetailsDto it,
			@GraphQLArgument(name="parent") DebitMemo parent
	) {
		DebitMemoDetails upsert = new DebitMemoDetails()
		def type = objectMapper.convertValue(it.transType, ExpenseTransaction.class)
		if(!it.isNew){
			upsert = findOne(UUID.fromString(it.id))
		}
		upsert.transType = type
		upsert.debitMemo = parent
		upsert.office = null
		upsert.project = null
		upsert.assets = null
		if (it.office) {
			def office = objectMapper.convertValue(it.office, Office.class)
			upsert.office = office
		}
		if (it.project) {
			def project = objectMapper.convertValue(it.project, Projects.class)
			upsert.project = project
		}
		if (it.assets) {
			def assets = objectMapper.convertValue(it.assets, Assets.class)
			upsert.assets = assets
		}
		upsert.type = it.type
		upsert.percent = it.percent
		upsert.amount = it.amount
		upsert.remarks = it.remarks

		save(upsert)
	}

	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "removeDmDetails")
	DebitMemoDetails removeDmDetails(
			@GraphQLArgument(name="id") UUID id,
			@GraphQLArgument(name="parent") UUID parent
	) {
		def details = findOne(id)
		if(parent){
			debitMemoService.updateMemoAmount(parent, details.amount, "memo")
		}
		delete(details)
		return details
	}

	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "removeDetailsDebitMemo")
	DebitMemoDetails removeDetailsDebitMemo(
			@GraphQLArgument(name="id") UUID id
	) {
		def list = this.dmDetials(id)
		def details = new DebitMemoDetails()
		list.each {
			details = it
			delete(details)
		}
		return details
	}

}
