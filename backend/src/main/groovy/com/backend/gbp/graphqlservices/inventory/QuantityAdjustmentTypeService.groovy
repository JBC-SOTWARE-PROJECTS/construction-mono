package com.backend.gbp.graphqlservices.inventory

import com.backend.gbp.services.GeneratorType
import com.fasterxml.jackson.databind.ObjectMapper
import com.backend.gbp.domain.inventory.QuantityAdjustmentType
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.services.GeneratorService
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

@Component
@GraphQLApi
@TypeChecked
class QuantityAdjustmentTypeService extends AbstractDaoService<QuantityAdjustmentType> {

	QuantityAdjustmentTypeService() {
		super(QuantityAdjustmentType.class)
	}

	@Autowired
	ObjectMapper objectMapper

	@Autowired
	GeneratorService generatorService

	//===========mutation====================//
	@Transactional//
	@GraphQLMutation(name = "upsertQuantityAdjustmentType", description = "Insert/Update QuantityAdjustmentType")
	QuantityAdjustmentType upsertQuantityAdjustmentType(
			@GraphQLArgument(name = "fields") Map<String, Object> fields,
			@GraphQLArgument(name = "id") UUID id
	) {

		def forInsert = objectMapper.convertValue(fields, QuantityAdjustmentType)
		QuantityAdjustmentType upsert = new QuantityAdjustmentType()
		try {
			if(id) {
				upsert = findOne(id)
			}
			if(!id){
				upsert.code = generatorService.getNextValue(GeneratorType.ADJ_TYPE) { Long no ->
					'AT-' + StringUtils.leftPad(no.toString(), 6, "0")
				}
			}
			upsert.description = forInsert.description
			upsert.is_active = forInsert.is_active
			upsert.flagValue = forInsert.flagValue
			save(upsert)

		} catch (Exception e) {
			throw new Exception("Something was Wrong : " + e)
		}

	}

	@GraphQLQuery(name = "quantityAdjustmentTypeList", description = "List of quantity adjustment type")
	List<QuantityAdjustmentType> quantityAdjustmentTypeList() {
		createQuery("Select q from QuantityAdjustmentType q").resultList.sort { it.createdDate }
	}

	@GraphQLQuery(name = "findOneAdjustmentType", description = "find Adjustment Type")
	QuantityAdjustmentType findOneAdjustmentType(@GraphQLArgument(name = "id") UUID id) {
		return this.findOne(id)
	}

	@GraphQLQuery(name = "quantityAdjustmentTypeFilter", description = "List of quantity adjustment type")
	List<QuantityAdjustmentType> quantityAdjustmentTypeList(@GraphQLArgument(name = "filter")String filter) {
		createQuery("Select q from QuantityAdjustmentType q where" +
				"(lower(q.code) like lower(concat('%',:filter,'%')) or lower(q.description) like lower(concat('%',:filter,'%')))"
				,
				[
						filter:filter
				] as Map<String, Object>).resultList.sort { it.createdDate}
	}

	@GraphQLQuery(name = "filterAdjustmentType", description = "List of filtered quantity adjustment type")
	List<QuantityAdjustmentType> filterAdjustmentType(@GraphQLArgument(name = "is_active")Boolean is_active,
                                                      @GraphQLArgument(name = "filter")String filter) {
		createQuery("Select q from QuantityAdjustmentType q where q.is_active = :is_active and " +
				"(lower(q.code) like lower(concat('%',:filter,'%')) or lower(q.description) like lower(concat('%',:filter,'%')))"
				,
				[
						is_active:is_active,
						filter:filter
				] as Map<String, Object>).resultList.sort { it.createdDate}
	}

}
