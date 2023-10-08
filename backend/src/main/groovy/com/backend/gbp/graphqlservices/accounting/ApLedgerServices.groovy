package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.ApLedger
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.inventory.SupplierService
import com.backend.gbp.security.SecurityUtils
import com.backend.gbp.services.GeneratorService
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

import java.time.Duration
import java.time.Instant

@Service
@GraphQLApi
class ApLedgerServices extends AbstractDaoService<ApLedger> {

	@Autowired
	GeneratorService generatorService

	@Autowired
	SupplierService supplierService

    ApLedgerServices() {
		super(ApLedger.class)
	}
	
	@GraphQLQuery(name = "apLedgerById")
	ApLedger apLedgerById(
			@GraphQLArgument(name = "id") UUID id
	) {
		findOne(id)
	}
	
	@GraphQLQuery(name = "apLedgerInclude", description = "Find Ap Ledger Include")
	List<ApLedger> apLedgerInclude() {
		def company = SecurityUtils.currentCompanyId()
		createQuery("Select ap from ApLedger ap where ap.isInclude = true and ap.company = :company", [company: company]).resultList
	}

	@GraphQLQuery(name = "apLedgerByRef", description = "Find Ap Ledger Include")
	ApLedger apLedgerByRef(@GraphQLArgument(name = "refNo") String refNo) {
		def company = SecurityUtils.currentCompanyId()
		createQuery("Select ap from ApLedger ap where ap.refNo = :refNo and ap.company = :company",[refNo: refNo, company: company]).resultList.find()
	}

	@GraphQLQuery(name = "apLedgerBySupplier", description = "Find Ap Transaction Active")
	List<ApLedger> apLedgerBySupplier(@GraphQLArgument(name = "supplier") UUID supplier) {
		def company = SecurityUtils.currentCompanyId()
		createQuery("Select ap from ApLedger ap where ap.supplier.id = :supplier and ap.isInclude = true and ap.company = :company",
				[supplier: supplier, company: company]).resultList
	}

	@GraphQLQuery(name = "apLedgerFilter", description = "Transaction List")
	List<ApLedger> apLedgerFilter(@GraphQLArgument(name = "filter") String filter,
                                  @GraphQLArgument(name = "supplier") UUID supplier) {
		def company = SecurityUtils.currentCompanyId()

		def query = "Select f from ApLedger f where lower(f.ref_no) like lower(concat('%',:desc,'%'))"
		Map<String, Object> params = new HashMap<>()
		params.put('filter', filter)

		if(supplier){
			query+= " and f.supplier.id = :type"
			params.put('supplier', supplier)
		}

		if(company){
			query+= " and f.company = :company"
			params.put('company', company)
		}

		createQuery(query,
				params)
				.resultList.sort { it.ledgerDate }

	}

	//mutations
	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "upsertApLedger")
	ApLedger upsertApLedger(
			@GraphQLArgument(name = "fields") Map<String, Object> fields,
			@GraphQLArgument(name = "supplier") UUID supplier,
			@GraphQLArgument(name = "id") UUID id
	) {
		def company = SecurityUtils.currentCompanyId()
		upsertFromMap(id, fields, { ApLedger entity, boolean forInsert ->
			if(forInsert){
				entity.company = company
				if(supplier){
					entity.supplier = supplierService.supById(supplier)
				}
				entity.isInclude = true
				if(!entity.ledgerDate){
					entity.ledgerDate = Instant.now().plus(Duration.ofHours(8))
				}

			}
		})
	}

	@Transactional(rollbackFor = Exception.class)
	@GraphQLMutation(name = "removeApLedger")
	ApLedger removeApLedger(
			@GraphQLArgument(name = "ref") String ref
	) {
		def ledger = apLedgerByRef(ref)
		if(ledger){
			delete(ledger)
		}
		return ledger
	}
}
