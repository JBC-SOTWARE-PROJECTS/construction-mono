package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.Office
import com.backend.gbp.domain.accounting.PettyCashAccounting
import com.backend.gbp.domain.accounting.PettyCashItem
import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.rest.dto.payables.PCVItemsDto
import com.backend.gbp.security.SecurityUtils
import com.backend.gbp.services.GeneratorService
import com.fasterxml.jackson.databind.ObjectMapper
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

import java.math.RoundingMode
import java.time.LocalDate
import java.time.ZoneOffset

@Service
@GraphQLApi
class PettyCashItemServices extends AbstractDaoService<PettyCashItem> {

	@Autowired
	GeneratorService generatorService

	@Autowired
	ObjectMapper objectMapper


	PettyCashItemServices() {
		super(PettyCashItem.class)
	}

	@GraphQLQuery(name = "pettyCashItemById")
	PettyCashItem pettyCashItemById(
			@GraphQLArgument(name = "id") UUID id
	) {
		findOne(id)
	}

	@GraphQLQuery(name = "purchaseItemsByPetty")
	List<PettyCashItem> purchaseItemsByPetty(@GraphQLArgument(name = "id") UUID id) {
		createQuery("Select da from PettyCashItem da where da.pettyCash.id = :id", ["id": id]).resultList
	}



	//mutations
	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "upsertPurchaseItems")
	PettyCashItem upsertPurchaseItems(
			@GraphQLArgument(name="it") PCVItemsDto it,
			@GraphQLArgument(name="parent") PettyCashAccounting parent
	) {
		PettyCashItem upsert = new PettyCashItem()
		def item = objectMapper.convertValue(it.item, Item.class)

		def company = SecurityUtils.currentCompanyId()
		if(!it.isNew){
			upsert = findOne(UUID.fromString(it.id))
		}
		upsert.item = item

		if(it.office){
			def office = objectMapper.convertValue(it.office, Office.class)
			upsert.office = office
		}
		upsert.pettyCash = parent
		upsert.qty = it.qty
		upsert.unitCost = it.unitCost.setScale(2, RoundingMode.HALF_EVEN)
		upsert.inventoryCost = it.inventoryCost.setScale(2, RoundingMode.HALF_EVEN)
		upsert.grossAmount = it.grossAmount.setScale(2, RoundingMode.HALF_EVEN)
		upsert.discRate = it.discRate.setScale(2, RoundingMode.HALF_EVEN)
		upsert.discAmount = it.discAmount.setScale(2, RoundingMode.HALF_EVEN)
		upsert.netDiscount = it.netDiscount.setScale(2, RoundingMode.HALF_EVEN)
		if(it.expirationDate){
			LocalDate exp = LocalDate.parse(it.expirationDate)
			upsert.expirationDate = exp.atStartOfDay().toInstant(ZoneOffset.UTC)
		}else{
			upsert.expirationDate = null
		}
		upsert.lotNo = it.lotNo
		upsert.isVat = it.isVat
		upsert.vatAmount = it.vatAmount.setScale(2, RoundingMode.HALF_EVEN)
		upsert.netAmount = it.netAmount.setScale(2, RoundingMode.HALF_EVEN)
		upsert.isPosted = it.isPosted
		upsert.company = company
		save(upsert)
	}

	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "removePurchaseItemsByParent")
	PettyCashItem removePurchaseItemsByParent(
			@GraphQLArgument(name="parent") UUID parent
	) {
		def items = this.purchaseItemsByPetty(parent)
		def lastRemove = new PettyCashItem()
		items.each {
			lastRemove = it
			def remove = it
			delete(remove)
		}
		return lastRemove
	}

	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "removePettyCashItemById")
	PettyCashItem removePettyCashItemById(
			@GraphQLArgument(name="id") UUID id
	) {
		def obj = findOne(id)
		if(obj){
			delete(obj)
		}
		return obj
	}

}
