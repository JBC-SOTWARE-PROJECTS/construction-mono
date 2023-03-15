package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.rest.InventoryResource
import com.backend.gbp.rest.dto.BrandDto
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
        String query = '''Select e from Item e where lower(concat(e.sku,e.itemCode,e.descLong)) like lower(concat('%',:filter,'%'))'''
        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        createQuery(query, params).resultList.sort { it.descLong }
    }

    @GraphQLQuery(name = "getItemByName")
    List<Item> getItemByName(
            @GraphQLArgument(name = "name") String name
    ) {
        String query = '''Select e from Item e where lower(e.descLong) like lower(concat('%',:name,'%'))'''
        Map<String, Object> params = new HashMap<>()
        params.put('name', name)
        createQuery(query, params).resultList.sort { it.descLong }
    }

    @GraphQLQuery(name = "itemListActive")
    List<Item> itemListActive() {
        String query = '''Select e from Item e where e.active = :status'''
        Map<String, Object> params = new HashMap<>()
        params.put('status', true)
        createQuery(query, params).resultList.sort { it.descLong }
    }

    @GraphQLQuery(name = "getBrands")
    List<BrandDto> getBrands() {
        inventoryResource.getBrands().sort{it.brand}
    }

    @GraphQLQuery(name = "itemByFiltersPage")
	Page<Item> itemByFiltersPage(
			@GraphQLArgument(name = "filter") String filter,
			@GraphQLArgument(name = "group") UUID group,
			@GraphQLArgument(name = "category") List<UUID> category,
			@GraphQLArgument(name = "page") Integer page,
			@GraphQLArgument(name = "size") Integer size
	) {


		String query = '''Select inv from Item inv where
						(lower(inv.descLong) like lower(concat('%',:filter,'%')) or
						lower(inv.sku) like lower(concat('%',:filter,'%')))'''

		String countQuery = '''Select count(inv) from Item inv where
							(lower(inv.descLong) like lower(concat('%',:filter,'%')) or
							lower(inv.sku) like lower(concat('%',:filter,'%')))'''

		Map<String, Object> params = new HashMap<>()
		params.put('filter', filter)

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
        String query = '''Select inv from Item inv where
						(lower(inv.descLong) like lower(concat('%',:filter,'%')) or
						lower(inv.sku) like lower(concat('%',:filter,'%'))) and inv.active = :status'''

        String countQuery = '''Select count(inv) from Item inv where
							(lower(inv.descLong) like lower(concat('%',:filter,'%')) or
							lower(inv.sku) like lower(concat('%',:filter,'%'))) and inv.active = :status'''

        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        params.put('status', true)

        query += ''' ORDER BY inv.descLong ASC'''

        Page<Item> result = getPageable(query, countQuery, page, size, params)
        return result
    }

    @GraphQLQuery(name = "itemActive")
    List<Item> itemActive() {
        String query = '''Select e from Item e where e.isActive = :status'''
        Map<String, Object> params = new HashMap<>()
        params.put('status', true)
        createQuery(query, params).resultList.sort { it.descLong }
    }

    // ============== Mutation =======================//
    @Transactional
    @GraphQLMutation(name = "upsertItem")
    GraphQLRetVal<Boolean> upsertItem(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ) {
        def result = new GraphQLRetVal<Boolean>(true,true,"Item Added")
        def name = fields['descLong'] as String;
        def checkPoint = this.getItemByName(name.toLowerCase())
        if(checkPoint){
            result = new GraphQLRetVal<Boolean>(false,false,"Item with the same description already exist. Please try again.")
        }else{
            upsertFromMap(id, fields, { Item entity, boolean forInsert ->

            })
        }
        return result
    }
}
