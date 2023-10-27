package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.Bank
import com.backend.gbp.domain.accounting.Disbursement
import com.backend.gbp.domain.accounting.DisbursementCheck
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.rest.dto.payables.DisbursementDto
import com.backend.gbp.security.SecurityUtils
import com.backend.gbp.services.GeneratorService
import com.fasterxml.jackson.databind.ObjectMapper
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
@GraphQLApi
class DisbursementCheckServices extends AbstractDaoService<DisbursementCheck> {

	@Autowired
	GeneratorService generatorService

	@Autowired
	ObjectMapper objectMapper

	@Autowired
	DisbursementServices disbursementServices


    DisbursementCheckServices() {
		super(DisbursementCheck.class)
	}
	
	@GraphQLQuery(name = "disCheckById")
	DisbursementCheck disCheckById(
			@GraphQLArgument(name = "id") UUID id
	) {
		findOne(id)
	}
	
	@GraphQLQuery(name = "disCheckByParent", description = "Find DisbursementCheck by Parent")
	List<DisbursementCheck> disCheckByParent(@GraphQLArgument(name = "id") UUID id) {
		createQuery("Select ds from DisbursementCheck ds where ds.disbursement.id = :id", ["id": id]).resultList
	}

	@GraphQLQuery(name = "checksFilter", description = "Filter Checks")
	Page<DisbursementCheck> checksFilter(
			@GraphQLArgument(name = "filter") String filter,
			@GraphQLArgument(name = "bank") UUID bank,
			@GraphQLArgument(name = "start") String start,
			@GraphQLArgument(name = "end") String end,
			@GraphQLArgument(name = "page") Integer page,
			@GraphQLArgument(name = "size") Integer size
	) {
		def company = SecurityUtils.currentCompanyId()

		String query = '''Select d from DisbursementCheck d where
						(lower(d.checkNo) like lower(concat('%',:filter,'%')) or
						lower(d.disbursement.payeeName) like lower(concat('%',:filter,'%')) or
						lower(d.disbursement.disNo) like lower(concat('%',:filter,'%')))
						and to_date(to_char(d.checkDate, 'YYYY-MM-DD'),'YYYY-MM-DD')
             			between to_date(:start,'YYYY-MM-DD') and  to_date(:end,'YYYY-MM-DD')
						and d.disbursement.posted = true and d.releasing is null '''

		String countQuery = '''Select count(d) from DisbursementCheck d where
						(lower(d.checkNo) like lower(concat('%',:filter,'%')) or
						lower(d.disbursement.payeeName) like lower(concat('%',:filter,'%')) or
						lower(d.disbursement.disNo) like lower(concat('%',:filter,'%')))
						and to_date(to_char(d.checkDate, 'YYYY-MM-DD'),'YYYY-MM-DD')
             			between to_date(:start,'YYYY-MM-DD') and  to_date(:end,'YYYY-MM-DD')
             			and d.disbursement.posted = true and d.releasing is null '''

		Map<String, Object> params = new HashMap<>()
		params.put('filter', filter)
		params.put('start', start)
		params.put('end', end)

		if (company) {
			query += ''' and (d.company = :company) '''
			countQuery += ''' and (d.company = :company) '''
			params.put("company", company)
		}

		if (bank) {
			query += ''' and (d.bank.id = :bank) '''
			countQuery += ''' and (d.bank.id = :bank) '''
			params.put("bank", bank)
		}

		query += ''' ORDER BY d.createdDate DESC'''

		getPageable(query, countQuery, page, size, params)
	}

	@GraphQLQuery(name = "printChecks", description = "Filter Checks")
	Page<DisbursementCheck> printChecks(
			@GraphQLArgument(name = "filter") String filter,
			@GraphQLArgument(name = "bank") UUID bank,
			@GraphQLArgument(name = "supplier") UUID supplier = null,
			@GraphQLArgument(name = "start") String start,
			@GraphQLArgument(name = "end") String end,
			@GraphQLArgument(name = "page") Integer page,
			@GraphQLArgument(name = "size") Integer size
	) {
		def company = SecurityUtils.currentCompanyId()

		String query = '''Select d from DisbursementCheck d where
						(lower(d.checkNo) like lower(concat('%',:filter,'%')) or 
						lower(d.disbursement.payeeName) like lower(concat('%',:filter,'%')) or
						lower(d.disbursement.disNo) like lower(concat('%',:filter,'%')))
						and to_date(to_char(d.checkDate, 'YYYY-MM-DD'),'YYYY-MM-DD')
             			between to_date(:start,'YYYY-MM-DD') and  to_date(:end,'YYYY-MM-DD')
						and d.disbursement.posted = true '''

		String countQuery = '''Select count(d) from DisbursementCheck d where
						(lower(d.checkNo) like lower(concat('%',:filter,'%')) or 
						lower(d.disbursement.payeeName) like lower(concat('%',:filter,'%')) or
						lower(d.disbursement.disNo) like lower(concat('%',:filter,'%')))
						and to_date(to_char(d.checkDate, 'YYYY-MM-DD'),'YYYY-MM-DD')
             			between to_date(:start,'YYYY-MM-DD') and  to_date(:end,'YYYY-MM-DD')
             			and d.disbursement.posted = true '''

		Map<String, Object> params = new HashMap<>()
		params.put('filter', filter)
		params.put('start', start)
		params.put('end', end)

		if (company) {
			query += ''' and (d.company = :company) '''
			countQuery += ''' and (d.company = :company) '''
			params.put("company", company)
		}

		if (bank) {
			query += ''' and (d.bank.id = :bank) '''
			countQuery += ''' and (d.bank.id = :bank) '''
			params.put("bank", bank)
		}

		if (supplier) {
			query += ''' and (d.disbursement.supplier.id = :supplier) '''
			countQuery += ''' and (d.disbursement.supplier.id = :supplier) '''
			params.put("supplier", supplier)
		}

		query += ''' ORDER BY d.checkDate DESC'''

		getPageable(query, countQuery, page, size, params)
	}

	//mutations
	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "upsertCheck")
	DisbursementCheck upsertCheck(
			@GraphQLArgument(name="it") DisbursementDto it,
			@GraphQLArgument(name="parent") Disbursement parent
	) {
		DisbursementCheck upsert = new DisbursementCheck()
		def company = SecurityUtils.currentCompanyId()
		if(!it.isNew){
			upsert = findOne(UUID.fromString(it.id))
		}
		upsert.disbursement = parent
		if(it.bank){
			def bank = objectMapper.convertValue(it.bank, Bank.class)
			upsert.bank = bank
		}
		upsert.bankBranch = it.bankBranch
		upsert.checkNo = it.checkNo
		upsert.checkDate = it.checkDate
		upsert.amount = it.amount
		upsert.company = company
		
		save(upsert)
	}

	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "removeCheck")
	DisbursementCheck removeCheck(
			@GraphQLArgument(name = "id") UUID id
	) {
		def check = findOne(id)
		//update parent
		disbursementServices.updateRemove(check.disbursement.id, "CK", check.amount)
		delete(check)
		return check
	}

	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "removeCheckList")
	DisbursementCheck removeCheckList(
			@GraphQLArgument(name = "id") UUID id
	) {
		def check = this.disCheckByParent(id)
		//update parent
		def result = new DisbursementCheck()
		check.each {
			result = it
			delete(result)
		}
		return result
	}

	@Transactional(rollbackFor = Exception.class)
	DisbursementCheck updateCheck(UUID id, UUID releasing) {
		def check = findOne(id)
		check.releasing = releasing
		save(check)
	}
}
