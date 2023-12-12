package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.rest.InventoryResource
import com.backend.gbp.rest.dto.BrandDto
import com.backend.gbp.security.SecurityUtils
import com.backend.gbp.services.GeneratorService
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.StringUtils
import org.springframework.data.domain.Page
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

import javax.transaction.Transactional


@Component
@GraphQLApi
@TypeChecked
class ItemService extends AbstractDaoService<Item> {

    ItemService() {
        super(Item.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService

    @Autowired
    InventoryResource inventoryResource


    @GraphQLQuery(name = "itemById")
    Item itemById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            findOne(id)
        }else{
            null
        }
    }

    @GraphQLQuery(name = "itemList")
    List<Item> itemList(
            @GraphQLArgument(name = "filter") String filter
    ) {
        def company = SecurityUtils.currentCompanyId()
        String query = '''Select e from Item e where lower(concat(e.sku,e.itemCode,e.descLong)) like lower(concat('%',:filter,'%')) and e.company = :company'''
        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        params.put('company', company)
        createQuery(query, params).resultList.sort { it.descLong }
    }

    @GraphQLQuery(name = "getItemByName")
    List<Item> getItemByName(
            @GraphQLArgument(name = "name") String name,
            @GraphQLArgument(name = "id") UUID id
    ) {
        def company = SecurityUtils.currentCompanyId()
        String query = '''Select e from Item e where lower(e.descLong) like lower(concat('%',:name,'%')) and e.company = :company'''
        Map<String, Object> params = new HashMap<>()
        params.put('name', name)
        params.put('company', company)
        if (id) {
            query += ''' and e.id not in (:id)'''
            params.put('id', id)
        }
        createQuery(query, params).resultList.sort { it.descLong }
    }

    @GraphQLQuery(name = "itemListActive")
    List<Item> itemListActive() {
        def company = SecurityUtils.currentCompanyId()
        String query = '''Select e from Item e where e.active = :status and e.company = :company'''
        Map<String, Object> params = new HashMap<>()
        params.put('status', true)
        params.put('company', company)
        createQuery(query, params).resultList.sort { it.descLong }
    }

    @GraphQLQuery(name = "getBrands")
    List<BrandDto> getBrands() {
        def company = SecurityUtils.currentCompanyId()
        inventoryResource.getBrands(company).sort{it.brand}
    }

    @GraphQLQuery(name = "itemByFiltersPage")
	Page<Item> itemByFiltersPage(
			@GraphQLArgument(name = "filter") String filter,
			@GraphQLArgument(name = "group") UUID group,
			@GraphQLArgument(name = "category") List<UUID> category,
            @GraphQLArgument(name = "brand") String brand,
            @GraphQLArgument(name = "type") String type,
			@GraphQLArgument(name = "page") Integer page,
			@GraphQLArgument(name = "size") Integer size
	) {
        def company = SecurityUtils.currentCompanyId()

		String query = '''Select inv from Item inv where
						(lower(inv.descLong) like lower(concat('%',:filter,'%')) or
						lower(inv.sku) like lower(concat('%',:filter,'%')) or
						lower(inv.brand) like lower(concat('%',:brand,'%')))'''

		String countQuery = '''Select count(inv) from Item inv where
							(lower(inv.descLong) like lower(concat('%',:filter,'%')) or
							lower(inv.sku) like lower(concat('%',:filter,'%')) or
						lower(inv.brand) like lower(concat('%',:brand,'%')))'''

		Map<String, Object> params = new HashMap<>()
		params.put('filter', filter)
        params.put('brand', brand)
		if (group) {
			query += ''' and (inv.item_group.id = :group)'''
			countQuery += ''' and (inv.item_group.id = :group)'''
			params.put("group", group)
		}

		if (category) {
			query += ''' and (inv.item_category.id IN (:category))'''
			countQuery += ''' and (inv.item_category.id IN (:category))'''
			params.put("category", category)
		}

        if (company) {
            query += ''' and (inv.company = :company)'''
            countQuery += ''' and (inv.company = :company)'''
            params.put("company", company)
        }

        if (company) {
            query += ''' and (inv.company = :company)'''
            countQuery += ''' and (inv.company = :company)'''
            params.put("company", company)
        }

        if (type.equalsIgnoreCase("medicine")) {
            query += ''' and (inv.isMedicine = true)'''
            countQuery += ''' and (inv.isMedicine = true)'''
        }else if (type.equalsIgnoreCase("consignment")) {
            query += ''' and (inv.consignment = true)'''
            countQuery += ''' and (inv.consignment = true)'''
        }else if (type.equalsIgnoreCase("production")) {
            query += ''' and (inv.production = true)'''
            countQuery += ''' and (inv.production = true)'''
        }else if (type.equalsIgnoreCase("fix")) {
            query += ''' and (inv.fixAsset = true)'''
            countQuery += ''' and (inv.fixAsset = true)'''
        }

		query += ''' ORDER BY inv.descLong ASC'''

		Page<Item> result = getPageable(query, countQuery, page, size, params)
		return result
	}

    @GraphQLQuery(name = "itemsByFilterOnly")
    Page<Item> itemsByFilterOnly(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ) {
        def company = SecurityUtils.currentCompanyId()
        String query = '''Select inv from Item inv where
						(lower(inv.descLong) like lower(concat('%',:filter,'%')) or
						lower(inv.sku) like lower(concat('%',:filter,'%'))) and inv.active = :status and inv.company = :company'''

        String countQuery = '''Select count(inv) from Item inv where
							(lower(inv.descLong) like lower(concat('%',:filter,'%')) or
							lower(inv.sku) like lower(concat('%',:filter,'%'))) and inv.active = :status and inv.company = :company'''

        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        params.put('status', true)
        params.put('company', company)

        query += ''' ORDER BY inv.descLong ASC'''

        Page<Item> result = getPageable(query, countQuery, page, size, params)
        return result
    }

    @GraphQLQuery(name = "itemsActivePage")
    Page<Item> itemsActivePage(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ) {
        def company = SecurityUtils.currentCompanyId()
        String query = '''Select e from Item e where (lower(e.descLong) like lower(concat('%',:filter,'%')) or
						lower(e.sku) like lower(concat('%',:filter,'%'))) and e.active = :status and e.company = :company'''

        String countQuery = '''Select count(e) from Item e where (lower(e.descLong) like lower(concat('%',:filter,'%')) or
						lower(e.sku) like lower(concat('%',:filter,'%'))) and e.active = :status and e.company = :company'''

        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        params.put('status', true)
        params.put('company', company)

        query += ''' ORDER BY e.descLong ASC'''

        Page<Item> result = getPageable(query, countQuery, page, size, params)
        return result
    }

    @GraphQLQuery(name = "itemActive")
    List<Item> itemActive() {
        def company = SecurityUtils.currentCompanyId()
        String query = '''Select e from Item e where e.active = :status and e.company = :company'''
        Map<String, Object> params = new HashMap<>()
        params.put('status', true)
        params.put('company', company)
        createQuery(query, params).resultList.sort { it.descLong }
    }

    // ============== Mutation =======================//
    @Transactional
    @GraphQLMutation(name = "upsertItem")
    GraphQLRetVal<Boolean> upsertItem(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ) {
        def company = SecurityUtils.currentCompanyId()
        def result = new GraphQLRetVal<Boolean>(true,true,"Item Added")
        def name = fields['descLong'] as String;
        def checkPoint = this.getItemByName(name.toLowerCase(), id)
        if(checkPoint){
            result = new GraphQLRetVal<Boolean>(false,false,"Item with the same description already exist. Please try again.")
        }else{
            upsertFromMap(id, fields, { Item entity, boolean forInsert ->
                if(forInsert){
                    entity.company = company
                }
            })
            if(id){
                result = new GraphQLRetVal<Boolean>(true,true,"Item Information Updated")
            }
        }
        return result
    }
}
