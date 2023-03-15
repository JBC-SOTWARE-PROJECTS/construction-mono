package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.inventory.QuantityAdjustment
import com.fasterxml.jackson.databind.ObjectMapper
import com.backend.gbp.domain.inventory.BeginningBalance
import com.backend.gbp.repository.inventory.BeginningBalanceRepository
import com.backend.gbp.rest.InventoryResource
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.GeneratorType
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

import javax.transaction.Transactional

@Component
@GraphQLApi
@TypeChecked
class BeginningBalanceService {
	
	@Autowired
	BeginningBalanceRepository beginningBalanceRepository
	
	@Autowired
	InventoryResource inventoryResource
	
	@Autowired
	ObjectMapper objectMapper
	
	@Autowired
	GeneratorService generatorService

	@Autowired
	InventoryLedgerService inventoryLedgerService
	
	@GraphQLQuery(name = "beginningListByItem", description = "List of Beginning Balance by Item")
	List<BeginningBalance> getBeginningById(@GraphQLArgument(name = "item") UUID id) {
		return beginningBalanceRepository.getBeginningById(id).sort { it.createdDate }.reverse(true)
	}
	
	//
	//MUTATION
	
	@Transactional
	@GraphQLMutation(name = "beginningBalanceInsert", description = "insert BEG")
	BeginningBalance beginningBalanceInsert(
			@GraphQLArgument(name = "fields") Map<String, Object> fields
	) {
		BeginningBalance insert = new BeginningBalance()
		def data = new BeginningBalance()
		def beg = objectMapper.convertValue(fields, BeginningBalance)
		try {
			def check = inventoryResource.getLedger(beg.item.id as String, beg.office.id as String)
			def checkIfExist = beginningBalanceRepository.getBeginningByIdPosted(beg.item.id)
			if (!check) {
				if (!checkIfExist) {
					insert.refNum = generatorService.getNextValue(GeneratorType.BEGINNING) { Long no ->
						'BEG-' + StringUtils.leftPad(no.toString(), 6, "0")
					}
					insert.dateTrans = beg.dateTrans
					insert.item = beg.item
					insert.office = beg.office
					insert.quantity = beg.quantity
					insert.unitCost = beg.unitCost
					insert.isPosted = false
					insert.isCancel = false
					data = beginningBalanceRepository.save(insert)
				}
			}
		} catch (Exception e) {
			throw new Exception("Something was Wrong : " + e)
		}
		return data
	}

	@Transactional
	@GraphQLMutation(name = "upsertBegQty")
	BeginningBalance upsertBegQty(
			@GraphQLArgument(name = "qty") Integer qty,
			@GraphQLArgument(name = "id") UUID id
	) {
		BeginningBalance upsert = beginningBalanceRepository.findById(id).get()
		upsert.quantity = qty
		return upsert
	}


	@Transactional
	@GraphQLMutation(name = "updateBegBalStatus")
	BeginningBalance updateBegBalStatus(
			@GraphQLArgument(name = "status") Boolean status,
			@GraphQLArgument(name = "id") UUID id
	) {
		def upsert = beginningBalanceRepository.findById(id).get()
		upsert.isPosted = status
		upsert.isCancel = !status

		//do some magic here ...
		//update ledger
		if(status){
			//ledger post
			inventoryLedgerService.postInventoryLedgerBegBalance(upsert)
		}else{
			//ledger void
			inventoryLedgerService.voidLedgerByRef(upsert.refNum)
		}

		beginningBalanceRepository.save(upsert)
	}
	
}
