package com.backend.gbp.graphqlservices.billing

import com.backend.gbp.domain.billing.Job
import com.backend.gbp.domain.inventory.Item
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.rest.InventoryResource
import com.backend.gbp.rest.dto.JobItemsDto
import com.backend.gbp.rest.dto.PlateNumberDto
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.GeneratorType
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.stereotype.Component

import javax.transaction.Transactional

@Component
@GraphQLApi
@TypeChecked
class JobService extends AbstractDaoService<Job> {

    JobService() {
        super(Job.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService

    @Autowired
    JobItemService jobItemService

    @Autowired
    InventoryResource inventoryResource

    @GraphQLQuery(name = "jobById")
    Job jobById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            findOne(id)
        }else{
            null
        }
    }

    @GraphQLQuery(name = "jobList")
    List<Job> jobList(
            @GraphQLArgument(name = "filter") String filter
    ) {
        String query = '''Select e from Job e where lower(e.jobNo) like lower(concat('%',:filter,'%'))'''
        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)
        createQuery(query, params).resultList.sort { it.jobNo }.reverse(true)
    }

    @GraphQLQuery(name = "getJobByPlateNo")
    Job getJobByPlateNo(
            @GraphQLArgument(name = "plateNo") String plateNo
    ) {
        String query = '''Select e from Job e where lower(e.plateNo) = lower(:plateNo) '''
        Map<String, Object> params = new HashMap<>()
        params.put('plateNo', plateNo)
        createQuery(query, params).resultList.first()
    }

    @GraphQLQuery(name = "jobCountStatus")
    BigDecimal jobCountStatus(
            @GraphQLArgument(name = "status") String status
    ) {
        String query = '''Select count(e) from Job e where e.status = :status'''
        Map<String, Object> params = new HashMap<>()
        params.put('status', status)
        getCount(query, params)
    }

    @GraphQLQuery(name = "getPlateNo")
    List<PlateNumberDto> getPlateNo(
            @GraphQLArgument(name = "status") String status
    ) {
        inventoryResource.getPlateNo().sort{it.plate_no}
    }


    @GraphQLQuery(name = "jobByFiltersPage")
	Page<Job> jobByFiltersPage(
			@GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "customer") UUID customer,
            @GraphQLArgument(name = "status") String status,
            @GraphQLArgument(name = "office") UUID office,
            @GraphQLArgument(name = "insurance") UUID insurance,
            @GraphQLArgument(name = "sortBy") String sortBy = "jobNo",
            @GraphQLArgument(name = "sortType") String sortType = "DESC",
			@GraphQLArgument(name = "page") Integer page,
			@GraphQLArgument(name = "size") Integer size
	) {

		String query = '''Select j from Job j where
						(lower(j.jobNo) like lower(concat('%',:filter,'%'))
						OR lower(j.description) like lower(concat('%',:filter,'%'))
						OR lower(j.plateNo) like lower(concat('%',:filter,'%'))
						OR lower(j.engineNo) like lower(concat('%',:filter,'%'))
						OR lower(j.chassisNo) like lower(concat('%',:filter,'%'))
						OR lower(j.bodyNo) like lower(concat('%',:filter,'%'))
						OR lower(j.yearModel) like lower(concat('%',:filter,'%'))
						OR lower(j.bodyColor) like lower(concat('%',:filter,'%'))
						OR lower(j.series) like lower(concat('%',:filter,'%'))
						OR lower(j.make) like lower(concat('%',:filter,'%')))'''

		String countQuery = '''Select count(j) from Job j where
						(lower(j.jobNo) like lower(concat('%',:filter,'%'))
						OR lower(j.description) like lower(concat('%',:filter,'%'))
						OR lower(j.plateNo) like lower(concat('%',:filter,'%'))
						OR lower(j.engineNo) like lower(concat('%',:filter,'%'))
						OR lower(j.chassisNo) like lower(concat('%',:filter,'%'))
						OR lower(j.bodyNo) like lower(concat('%',:filter,'%'))
						OR lower(j.yearModel) like lower(concat('%',:filter,'%'))
						OR lower(j.bodyColor) like lower(concat('%',:filter,'%'))
						OR lower(j.series) like lower(concat('%',:filter,'%'))
						OR lower(j.make) like lower(concat('%',:filter,'%')))'''

		Map<String, Object> params = new HashMap<>()
		params.put('filter', filter)

        if (customer) {
            query += ''' and (j.customer.id = :customer)'''
            countQuery += ''' and (j.customer.id = :customer)'''
            params.put("customer", customer)
        }

        if (status) {
            query += ''' and (j.status = :status)'''
            countQuery += ''' and (j.status = :status)'''
            params.put("status", status)
        }

        if (office) {
            query += ''' and (j.office.id = :office)'''
            countQuery += ''' and (j.office.id = :office)'''
            params.put("office", office)
        }
        if (insurance) {
            query += ''' and (j.insurance.id = :insurance)'''
            countQuery += ''' and (j.insurance.id = :insurance)'''
            params.put("insurance", insurance)
        }

		query += " ORDER BY j.${sortBy} ${sortType}"

		Page<Job> result = getPageable(query, countQuery, page, size, params)
		return result
	}

    // ============== Mutation =======================//
    @Transactional
    @GraphQLMutation(name = "upsertJob")
    Job upsertJob(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ) {
        def job = upsertFromMap(id, fields, { Job entity , boolean forInsert ->
            if(forInsert){
                entity.jobNo = generatorService.getNextValue(GeneratorType.JOB, {
                    return "JO-" + StringUtils.leftPad(it.toString(), 6, "0")
                })
                entity.pending = entity.status.equalsIgnoreCase("PENDING");
                entity.completed = entity.status.equalsIgnoreCase("COMPLETED")
            }else{
                entity.pending = entity.status.equalsIgnoreCase("PENDING");
                entity.completed = entity.status.equalsIgnoreCase("COMPLETED")
            }
        })
        return job
    }

    @Transactional
    @GraphQLMutation(name = "upsertJobItemsByParent")
    Job upsertJobItemsByParent(
            @GraphQLArgument(name = "items") ArrayList<Map<String, Object>> items,
            @GraphQLArgument(name = "id") UUID id
    ) {
        //items to be inserted
        Job job = findOne(id)
        def joItems = items as ArrayList<JobItemsDto>
        joItems.each {
            def con = objectMapper.convertValue(it, JobItemsDto.class)
            if(it.item){
                def item = objectMapper.convertValue(it.item, Item.class)
                jobItemService.upsertJobItem(con, item.id, job)
            }else{
                jobItemService.upsertJobItem(con, null, job)
            }

        }
        return job
    }

    @Transactional
    @GraphQLMutation(name = "updateJobStatus")
    Job updateJobStatus(
            @GraphQLArgument(name = "status") String status,
            @GraphQLArgument(name = "id") UUID id
    ) {
        def upsert = findOne(id)
        upsert.status = status
        upsert.pending = status.equalsIgnoreCase("PENDING");
        upsert.completed = status.equalsIgnoreCase("COMPLETED")
        save(upsert)
    }

    @Transactional
    @GraphQLMutation(name = "updateJobBilled")
    Job updateJobBilled(
            @GraphQLArgument(name = "id") UUID id
    ) {
        def upsert = findOne(id)
        upsert.billed = true
        save(upsert)
    }


}
