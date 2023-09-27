package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.Wtx2307
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.inventory.SupplierService
import com.backend.gbp.services.GeneratorService
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
class Wtx2307Service extends AbstractDaoService<Wtx2307> {

	@Autowired
	GeneratorService generatorService

	@Autowired
	SupplierService supplierService

    Wtx2307Service() {
		super(Wtx2307.class)
	}
	
	@GraphQLQuery(name = "wtxById")
	Wtx2307 wtxById(
			@GraphQLArgument(name = "id") UUID id
	) {
		findOne(id)
	}

	@GraphQLQuery(name = "findOneByRefId")
	Wtx2307 findOneByRefId(
			@GraphQLArgument(name = "id") UUID id
	) {
		createQuery("Select d from Wtx2307 d where d.refId = :id",
				[id: id]).resultList.find()
	}

	@GraphQLQuery(name = "wtxListByRef")
	List<Wtx2307> wtxListByRef(
			@GraphQLArgument(name = "id") UUID id
	) {
		createQuery("Select d from Wtx2307 d where d.wtxConsolidated = :id",
				[id: id]).resultList
	}
	
	@GraphQLQuery(name = "wtxList", description = "Transaction List")
	List<Wtx2307> wtxList() {
		findAll().sort { it.refNo }
	}

	@GraphQLQuery(name = "wtxListPage")
	Page<Wtx2307> wtxListPage(
			@GraphQLArgument(name = "filter") String filter,
			@GraphQLArgument(name = "supplier") UUID supplier,
			@GraphQLArgument(name = "start") String start,
			@GraphQLArgument(name = "end") String end,
			@GraphQLArgument(name = "status") Boolean status = false,
			@GraphQLArgument(name = "page") Integer page,
			@GraphQLArgument(name = "size") Integer size
	) {

		String query = '''Select d from Wtx2307 d where
						(lower(d.refNo) like lower(concat('%',:filter,'%')) )
						and to_date(to_char(d.wtxDate, 'YYYY-MM-DD'),'YYYY-MM-DD')
             			between to_date(:start,'YYYY-MM-DD') and  to_date(:end,'YYYY-MM-DD') '''

		String countQuery = '''Select count(d) from Wtx2307 d where
						(lower(d.refNo) like lower(concat('%',:filter,'%')) )
						and to_date(to_char(d.wtxDate, 'YYYY-MM-DD'),'YYYY-MM-DD')
             			between to_date(:start,'YYYY-MM-DD') and  to_date(:end,'YYYY-MM-DD') '''

		Map<String, Object> params = new HashMap<>()
		params.put('filter', filter)
		params.put('start', start)
		params.put('end', end)

		if (status) {
			query += ''' and (d.process = :status) '''
			countQuery += ''' and (d.process = :status) '''
			params.put("status", status)
		}else{
			query += ''' and (d.process = :status or d.process is null) '''
			countQuery += ''' and (d.process = :status or d.process is null) '''
			params.put("status", status)
		}

		if (supplier) {
			query += ''' and (d.supplier.id = :supplier) '''
			countQuery += ''' and (d.supplier.id = :supplier) '''
			params.put("supplier", supplier)
		}


		query += ''' ORDER BY d.wtxDate DESC'''

		getPageable(query, countQuery, page, size, params)
	}
	
	//mutation
	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "upsert2307")
	Wtx2307 upsert2307(
			@GraphQLArgument(name = "fields") Map<String, Object> fields,
			@GraphQLArgument(name = "id") UUID id,
			@GraphQLArgument(name = "supplier") UUID supplier
	) {
		upsertFromMap(id, fields, { Wtx2307 entity, boolean forInsert ->
			if(forInsert){
				entity.wtxDate = entity.wtxDate
				entity.supplier = supplierService.supById(supplier)
				entity.process = false
			}
		})
	}

	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "remove2307")
	Wtx2307 remove2307(
			@GraphQLArgument(name = "id") UUID id
	) {
		def wtx = findOneByRefId(id)
		if(wtx){
			delete(wtx)
		}
		return wtx
	}

	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "update2307")
	Wtx2307 update2307(
			@GraphQLArgument(name = "id") UUID id,
			@GraphQLArgument(name = "status") Boolean status,
			@GraphQLArgument(name = "ref") UUID ref
	) {
		def wtx = findOne(id)
		wtx.process = status
		wtx.wtxConsolidated = ref
		save(wtx)
	}

	
}
