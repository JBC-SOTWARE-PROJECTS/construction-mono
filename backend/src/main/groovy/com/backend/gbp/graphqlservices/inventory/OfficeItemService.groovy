package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.inventory.OfficeItem
import com.backend.gbp.graphqlservices.CompanySettingsService
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.repository.OfficeRepository
import com.backend.gbp.rest.dto.MarkupItemDto
import com.backend.gbp.security.SecurityUtils
import com.backend.gbp.services.GeneratorService
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.PageImpl
import org.springframework.data.domain.PageRequest
import org.springframework.jdbc.core.namedparam.NamedParameterJdbcTemplate
import org.springframework.stereotype.Component
import org.springframework.data.domain.Page

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

    @Autowired
    NamedParameterJdbcTemplate namedParameterJdbcTemplate


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

    @GraphQLQuery(name = "markupListPage")
    Page<MarkupItemDto> markupListPage(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "office") UUID office,
            @GraphQLArgument(name = "groupId") UUID groupId,
            @GraphQLArgument(name = "category") List<UUID> category,
            @GraphQLArgument(name = "brand") String brand,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ) {
        def company = SecurityUtils.currentCompanyId()
        List<MarkupItemDto> records = []

        String query = '''SELECT a.id,
    						a.item,
                            COALESCE(d.unitcost , 0::bigint::numeric) AS last_unit_cost,
                            b.desc_long,
                            b.sku,
                            b.item_code,
                            b.brand,
                            um.unit_description as uou,
                            b.item_group,
                            b.item_category,
                            ic.category_description,
                            a.actual_cost,
                            a.output_tax,
                            a.selling_price,
                            b.production,
                            b.is_medicine,
                            b.vatable,
                            b.fix_asset,
                            b.consignment,
                            b.for_sale
   						FROM inventory.office_item a
     						LEFT JOIN inventory.unitcostref d ON d.item = a.item
   						    LEFT JOIN inventory.item b ON b.id = a.item
     						LEFT JOIN inventory.item_categories ic ON ic.id = b.item_category
   						    LEFT JOIN inventory.unit_measurements um ON um.id = b.unit_of_usage 
  						WHERE a.is_assign = true AND b.active = true and b.for_sale = true
  							and (b.desc_long ilike concat('%',:filter,'%')
  							or b.sku ilike concat('%',:filter,'%')
  							or b.item_code ilike concat('%',:filter,'%')) '''

        String countQuery = '''SELECT count(*)
   						FROM inventory.office_item a
     						LEFT JOIN inventory.unitcostref d ON d.item = a.item
   						    LEFT JOIN inventory.item b ON b.id = a.item
     						LEFT JOIN inventory.item_categories ic ON ic.id = b.item_category
   						    LEFT JOIN inventory.unit_measurements um ON um.id = b.unit_of_usage
  						WHERE a.is_assign = true AND b.active = true and b.for_sale = true
  							and (b.desc_long ilike concat('%',:filter,'%')
  							or b.sku ilike concat('%',:filter,'%')
  							or b.item_code ilike concat('%',:filter,'%')) '''

        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        params.put('size', size)
        params.put('offset', size * page)

        if (office) {
            query += ''' and (a.office = :office) '''
            countQuery += ''' and (a.office = :office) '''
            params.put("office", office)
        }

        if (groupId) {
            query += ''' and (b.item_group = :groupId) '''
            countQuery += ''' and (b.item_group = :groupId) '''
            params.put("groupId", groupId)
        }

        if (category) {
            query += ''' and (b.item_category IN (:category)) '''
            countQuery += ''' and (b.item_category IN (:category)) '''
            params.put("category", category)
        }

        if (brand) {
            query += ''' and (b.brand = :brand)'''
            countQuery += ''' and (b.brand = :brand)'''
            params.put("brand", brand)
        }

        if (company) {
            query += ''' and (a.company = :company) '''
            countQuery += ''' and (a.company = :company) '''
            params.put("company", company)

        }

        query += ''' order by b.desc_long ASC LIMIT :size OFFSET :offset '''

        def recordsRaw = namedParameterJdbcTemplate.queryForList(query, params)

        recordsRaw.each {
            BigDecimal actualCost = it.get("actual_cost", BigDecimal.ZERO) as BigDecimal;
            BigDecimal sellingPrice = it.get("selling_price", BigDecimal.ZERO) as BigDecimal;

            def rate = 0.00
            if(actualCost && sellingPrice){
                def lprice = actualCost;
                def sprice = sellingPrice - actualCost;
                rate = (sprice / lprice) * 100;
            }
            BigDecimal markup = rate.setScale(2, RoundingMode.HALF_EVEN)

            //maps
            records << new MarkupItemDto(
                    id: it.get("id", null) as UUID,
                    item: it.get("item", "") as UUID,
                    descLong: it.get("desc_long", "") as String,
                    sku: it.get("sku", "") as String,
                    itemCode: it.get("item_code", "") as String,
                    brand: it.get("brand", "") as String,
                    uou: it.get("uou", "") as String,
                    categoryDescription: it.get("category_description", "") as String,
                    lastUnitCost: it.get("last_unit_cost", BigDecimal.ZERO) as BigDecimal,
                    actualCost: actualCost,
                    outputTax: it.get("output_tax", BigDecimal.ZERO) as BigDecimal,
                    markup: markup,
                    sellingPrice: sellingPrice,
                    production: it.get("production", false) as Boolean,
                    isMedicine: it.get("is_medicine", false) as Boolean,
                    vatable: it.get("vatable", false) as Boolean,
                    fixAsset: it.get("fix_asset", false) as Boolean,
                    consignment: it.get("consignment", false) as Boolean,
                    forSale: it.get("for_sale", false) as Boolean,

            )
        }

        def count = namedParameterJdbcTemplate.queryForObject(countQuery, params, Long.class)


        new PageImpl<MarkupItemDto>(records, PageRequest.of(page, size), count)
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

        if (id) { //update
            officeItem = findOne(id)
            officeItem.allow_trade = trade
            officeItem.is_assign = assign
            save(officeItem)
        } else { //insert
            if (!depItemObj) {
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
            if (it.actualCost == 0) {
                BigDecimal lcost = it.lastUnitCost.setScale(2, RoundingMode.HALF_EVEN)
                BigDecimal markupPrice = lcost + (lcost * com.markup);
                BigDecimal outputTax = it.vatable ? markupPrice * com.vatRate : BigDecimal.ZERO;
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
        if (el.equalsIgnoreCase("actualCost")) {
            officeItem.actualCost = value
        } else if (el.equalsIgnoreCase("sellingPrice")) {
            BigDecimal beforeVat = value / (com.vatRate + 1) as BigDecimal;
            BigDecimal outputTax = officeItem.item.vatable ? beforeVat * com.vatRate : BigDecimal.ZERO;
            officeItem.sellingPrice = value
            officeItem.outputTax = outputTax.setScale(2, RoundingMode.HALF_EVEN)
        }
        save(officeItem)
    }

    @Transactional
    @GraphQLMutation(name = "updateMarkupPrice")
    OfficeItem updateMarkupPrice(
            @GraphQLArgument(name = "actualCost") BigDecimal actualCost,
            @GraphQLArgument(name = "sellingPrice") BigDecimal sellingPrice,
            @GraphQLArgument(name = "id") UUID id
    ) {
        OfficeItem officeItem = findOne(id)
        def com = companySettingsService.comById()
        officeItem.actualCost = actualCost.setScale(2, RoundingMode.HALF_EVEN)
        BigDecimal beforeVat = sellingPrice / (com.vatRate + 1) as BigDecimal;
        BigDecimal outputTax = officeItem.item.vatable ? beforeVat * com.vatRate : BigDecimal.ZERO;
        officeItem.sellingPrice = sellingPrice.setScale(2, RoundingMode.HALF_EVEN)
        officeItem.outputTax = outputTax.setScale(2, RoundingMode.HALF_EVEN)
        save(officeItem)
    }

    @Transactional
    @GraphQLMutation(name = "updateMarkupPriceSync")
    OfficeItem updateMarkupPriceSync(
            @GraphQLArgument(name = "actualCost") BigDecimal actualCost,
            @GraphQLArgument(name = "sellingPrice") BigDecimal sellingPrice,
            @GraphQLArgument(name = "item") UUID item
    ) {
        def com = companySettingsService.comById()
        def list = this.officeListByItem(item)
        OfficeItem result = new OfficeItem()
        list.each {
            def officeItem = it
            officeItem.actualCost = actualCost.setScale(2, RoundingMode.HALF_EVEN)
            BigDecimal beforeVat = sellingPrice / (com.vatRate + 1) as BigDecimal;
            BigDecimal outputTax = officeItem.item.vatable ? beforeVat * com.vatRate : BigDecimal.ZERO;
            officeItem.sellingPrice = sellingPrice.setScale(2, RoundingMode.HALF_EVEN)
            officeItem.outputTax = outputTax.setScale(2, RoundingMode.HALF_EVEN)
            result = save(officeItem)
        }
        return result
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
