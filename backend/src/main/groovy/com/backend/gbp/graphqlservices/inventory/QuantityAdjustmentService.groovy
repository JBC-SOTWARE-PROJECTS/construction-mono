package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.inventory.StockIssue
import com.backend.gbp.security.SecurityUtils
import com.fasterxml.jackson.databind.ObjectMapper
import com.backend.gbp.domain.inventory.QuantityAdjustment
import com.backend.gbp.repository.inventory.QuantityAdjustmentRepository
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
class QuantityAdjustmentService {
	
	@Autowired
	QuantityAdjustmentRepository quantityAdjustmentRepository
	
	@Autowired
	ObjectMapper objectMapper
	
	@Autowired
	InventoryLedgerService inventoryLedgerService
	
	@Autowired
	GeneratorService generatorService

	@Autowired
	QuantityAdjustmentTypeService quantityAdjustmentTypeService

	@GraphQLQuery(name = "quantityListByItem", description = "List of Quantity Adjustment by Item")
	List<QuantityAdjustment> getAdjustById(@GraphQLArgument(name = "item") UUID id) {
		def company = SecurityUtils.currentCompanyId()
		return quantityAdjustmentRepository.getAdjustById(id, company).sort { it.createdDate }.reverse(true)
	}
	
	//
	//MUTATION
	@Transactional
	@GraphQLMutation(name = "quantityAdjustmentInsert", description = "insert adj")
	QuantityAdjustment quantityAdjustmentInsert(
			@GraphQLArgument(name = "fields") Map<String, Object> fields
	) {
		def company = SecurityUtils.currentCompanyId()
		QuantityAdjustment insert = new QuantityAdjustment()
		def data
		def adj = objectMapper.convertValue(fields, QuantityAdjustment)
		try {
			insert.refNum = generatorService.getNextValue(GeneratorType.QTY_ADJ) { Long no ->
				'ADJ-' + StringUtils.leftPad(no.toString(), 6, "0")
			}
			insert.office = adj.office
			insert.dateTrans = adj.dateTrans
			insert.item = adj.item
			insert.quantity = adj.quantity
			insert.unit_cost = adj.unit_cost
			insert.isPosted = false
			insert.isCancel = false
			insert.quantityAdjustmentType = adj.quantityAdjustmentType
			insert.remarks = adj.remarks
			insert.company = company

			data = quantityAdjustmentRepository.save(insert)
			
		} catch (Exception e) {
			throw new Exception("Something was Wrong : " + e)
		}
		
		return data
	}

	@Transactional
	@GraphQLMutation(name = "upsertQty")
	QuantityAdjustment upsertQty(
			@GraphQLArgument(name = "qty") Integer qty,
			@GraphQLArgument(name = "id") UUID id
	) {
		QuantityAdjustment upsert = quantityAdjustmentRepository.findById(id).get()
		upsert.quantity = qty
		return upsert
	}

	@Transactional
	@GraphQLMutation(name = "upsertAdjustmentRemarks")
	QuantityAdjustment upsertAdjustmentRemarks(
			@GraphQLArgument(name = "remarks") String remarks,
			@GraphQLArgument(name = "id") UUID id
	) {
		QuantityAdjustment upsert = quantityAdjustmentRepository.findById(id).get()
		upsert.remarks = remarks
		return upsert
	}


	@Transactional
	@GraphQLMutation(name = "updateQtyAdjStatus")
	QuantityAdjustment updateQtyAdjStatus(
			@GraphQLArgument(name = "status") Boolean status,
			@GraphQLArgument(name = "id") UUID id
	) {
		def upsert = quantityAdjustmentRepository.findById(id).get()
		upsert.isPosted = status
		upsert.isCancel = !status

		//do some magic here ...
		//update ledger
		if(status){
			//ledger post
			inventoryLedgerService.postInventoryLedgerQtyAdjustment(upsert)
		}else{
			//ledger void
			inventoryLedgerService.voidLedgerByRef(upsert.refNum)
		}

		quantityAdjustmentRepository.save(upsert)
	}
	
}
