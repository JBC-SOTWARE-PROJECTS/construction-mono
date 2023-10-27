package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.Disbursement
import com.backend.gbp.domain.accounting.DisbursementWtx
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.rest.dto.payables.DisbursementWtxDto
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
class DisbursementWtxServices extends AbstractDaoService<DisbursementWtx> {

	@Autowired
	GeneratorService generatorService

	@Autowired
	ObjectMapper objectMapper

	@Autowired
	DisbursementServices disbursementServices


    DisbursementWtxServices() {
		super(DisbursementWtx.class)
	}
	
	@GraphQLQuery(name = "disWtxById")
	DisbursementWtx disWtxById(
			@GraphQLArgument(name = "id") UUID id
	) {
		findOne(id)
	}
	
	@GraphQLQuery(name = "disWtxByParent", description = "Find DisbursementWtx by Parent")
	List<DisbursementWtx> disWtxByParent(@GraphQLArgument(name = "id") UUID id) {
		createQuery("Select ds from DisbursementWtx ds where ds.disbursement.id = :id", ["id": id]).resultList
	}

	//mutations
	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "upsertWtx")
	DisbursementWtx upsertWtx(
			@GraphQLArgument(name="it")	DisbursementWtxDto it,
			@GraphQLArgument(name="parent") Disbursement parent
	) {
		DisbursementWtx upsert = new DisbursementWtx()
		if(!it.isNew){
			upsert = findOne(UUID.fromString(it.id))
		}
		upsert.disbursement = parent
		upsert.appliedAmount = it.appliedAmount
		upsert.vatRate = it.vatRate
		upsert.vatInclusive = it.vatInclusive
		upsert.vatAmount = it.vatAmount
		upsert.ewtDesc = it.ewtDesc
		upsert.ewtRate = it.ewtRate
		upsert.ewtAmount = it.ewtAmount
		upsert.grossAmount = it.grossAmount
		upsert.netAmount = it.netAmount
		
		save(upsert)
	}

	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "removeWtx")
	DisbursementWtx removeWtx(
			@GraphQLArgument(name = "id") UUID id
	) {
		def wtx = findOne(id)
		//update parent
		disbursementServices.updateRemove(wtx.disbursement.id, "WTX", wtx.ewtAmount)
		delete(wtx)
		return wtx
	}

	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "removeWtxList")
	DisbursementWtx removeWtxList(
			@GraphQLArgument(name = "id") UUID id
	) {
		def wtx = this.disWtxByParent(id)
		//update parent
		def result = new DisbursementWtx()
		wtx.each {
			def obj = it
			result = it
			delete(obj)
		}

		return result
	}

}
