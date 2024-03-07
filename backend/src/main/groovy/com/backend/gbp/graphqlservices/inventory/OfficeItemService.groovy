package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.inventory.OfficeItem
import com.backend.gbp.graphqlservices.CompanySettingsService
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.repository.OfficeRepository
import com.backend.gbp.security.SecurityUtils
import com.backend.gbp.services.GeneratorService
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

import javax.transaction.Transactional
import java.math.RoundingMode


@Component
@GraphQLApi
@TypeChecked
class OfficeItemService extends AbstractDaoService<OfficeItem> {

    OfficeItemService() {
        super(OfficeItem.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    ItemService itemService

    @Autowired
    OfficeRepository officeRepository

    @Autowired
    InventoryService inventoryService

    @Autowired
    CompanySettingsService companySettingsService

    @Autowired
    GeneratorService generatorService


    @GraphQLQuery(name = "findByItemOffice")
    OfficeItem findByItemOffice(
            @GraphQLArgument(name = "itemId") UUID itemId,
            @GraphQLArgument(name = "depId") UUID depId
    ) {
        def company = SecurityUtils.currentCompanyId()
        String query = '''Select s from OfficeItem s where s.item.id=:itemId AND s.office.id=:depId'''
        Map<String, Object> params = new HashMap<>()
        params.put('itemId', itemId)
        params.put('depId', depId)

        if (company) {
            query += ''' and (s.company = :company)'''
            params.put("company", company)
        }

        createQuery(query, params).resultList.find()
    }

    @GraphQLQuery(name = "officeListByItem")
    List<OfficeItem> officeListByItem(
            @GraphQLArgument(name = "id") UUID id
    ) {
        def company = SecurityUtils.currentCompanyId()
        String query = '''Select s from OfficeItem s where s.item.id=:id'''
        Map<String, Object> params = new HashMap<>()
        params.put('id', id)

        if (company) {
            query += ''' and (s.company = :company)'''
            params.put("company", company)
        }

        createQuery(query, params).resultList.sort { it.office.officeDescription }
    }



    // ============== Mutation =======================//
    @Transactional
    @GraphQLMutation(name = "upsertOfficeItem")
    OfficeItem upsertOfficeItem(
            @GraphQLArgument(name = "depId") UUID depId,
            @GraphQLArgument(name = "itemId") UUID itemId,
            @GraphQLArgument(name = "trade") Boolean trade,
            @GraphQLArgument(name = "assign") Boolean assign,
            @GraphQLArgument(name = "id") UUID id
    ) {
        OfficeItem officeItem = new OfficeItem()
        OfficeItem depItemObj = this.findByItemOffice(itemId, depId)
        def company = SecurityUtils.currentCompanyId()

        if(id){ //update
            officeItem = findOne(id)
            officeItem.allow_trade = trade
            officeItem.is_assign = assign
            save(officeItem)
        }else{ //insert
            if(!depItemObj){
                officeItem.item = itemService.itemById(itemId)
                officeItem.office = officeRepository.findById(depId).get()
                officeItem.reorder_quantity = 0
                officeItem.actualCost = 0
                officeItem.outputTax = 0
                officeItem.sellingPrice = 0
                officeItem.allow_trade = true
                officeItem.is_assign = true
                officeItem.company = company
                save(officeItem)
            }
        }
    }

    @Transactional
    @GraphQLMutation(name = "updateReorder")
    OfficeItem updateReorder(
            @GraphQLArgument(name = "qty") BigDecimal qty,
            @GraphQLArgument(name = "id") UUID id
    ) {
        OfficeItem officeItem = findOne(id)
        officeItem.reorder_quantity = qty
        save(officeItem)
    }

    @Transactional
    @GraphQLMutation(name = "applyDefaultsPrice")
    OfficeItem applyDefaultsPrice(
            @GraphQLArgument(name = "office") UUID office
    ) {
        def list = inventoryService.itemListByOffice(office)
        def com = companySettingsService.comById()
        def upsert = new OfficeItem()
        list.each {
            upsert = findOne(it.id)
            if(it.actualCost == 0){
                BigDecimal lcost = it.lastUnitCost.setScale(2, RoundingMode.HALF_EVEN)
                BigDecimal markupPrice = lcost + (lcost * com.markup);
                BigDecimal outputTax =  it.vatable ? markupPrice * com.vatRate : BigDecimal.ZERO;
                BigDecimal sellPrice = markupPrice + outputTax;
                upsert.actualCost = lcost
                upsert.sellingPrice = sellPrice.setScale(2, RoundingMode.HALF_EVEN)
                upsert.outputTax = outputTax.setScale(2, RoundingMode.HALF_EVEN)
            }
            save(upsert)
        }
        return upsert
    }

    @Transactional
    @GraphQLMutation(name = "updatePrices")
    OfficeItem updatePrices(
            @GraphQLArgument(name = "el") String el,
            @GraphQLArgument(name = "value") BigDecimal value,
            @GraphQLArgument(name = "id") UUID id
    ) {
        OfficeItem officeItem = findOne(id)
        def com = companySettingsService.comById()
        if(el.equalsIgnoreCase("actualCost")){
            officeItem.actualCost = value
        } else if(el.equalsIgnoreCase("sellingPrice")) {
            BigDecimal beforeVat = value / (com.vatRate + 1) as BigDecimal;
            BigDecimal outputTax =  officeItem.item.vatable ? beforeVat * com.vatRate : BigDecimal.ZERO;
            officeItem.sellingPrice = value
            officeItem.outputTax = outputTax.setScale(2, RoundingMode.HALF_EVEN)
        }
        save(officeItem)
    }

    @Transactional
    @GraphQLMutation(name = "updateReOrderQty")
    OfficeItem updateReOrderQty(
            @GraphQLArgument(name = "value") BigDecimal value,
            @GraphQLArgument(name = "id") UUID id
    ) {
        OfficeItem officeItem = findOne(id)
        officeItem.reorder_quantity = value
        save(officeItem)
    }

}
