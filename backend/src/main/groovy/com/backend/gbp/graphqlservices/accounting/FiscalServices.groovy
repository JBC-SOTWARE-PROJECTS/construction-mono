package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.Fiscal
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.security.SecurityUtils
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.GeneratorType
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.stereotype.Service

import java.time.Instant
import java.time.LocalDate
import java.time.ZoneId

@Service
@GraphQLApi
class FiscalServices extends AbstractDaoService<Fiscal> {
	
	@Autowired
	GeneratorService generatorService

    FiscalServices() {
		super(Fiscal.class)
	}
	
	@GraphQLQuery(name = "fiscalById")
	Fiscal fiscalById(
			@GraphQLArgument(name = "id") UUID id
	) {
		findOne(id)
	}
	
	@GraphQLQuery(name = "findFiscalActive", description = "Find Fiscal By id")
	Fiscal findFiscalActive() {
		createQuery("Select f from Fiscal f where f.active = true").resultList.find()
	}


	Fiscal findFiscalForTransactionDate(Instant transactionDate) {

		// @Adonis @Wilson  - you will encounter an error if no Fiscal Record matched your transaction Date
		LocalDate localDateOfTransaction = transactionDate.atZone(ZoneId.systemDefault()).toLocalDate()
		createQuery("Select f from Fiscal f where   :localDate >= f.fromDate   and :localDate <= f.toDate and f.active is true ",[
				localDate:localDateOfTransaction]).resultList.find()
	}


	@GraphQLQuery(name = "fiscals")
	Page<Fiscal> fiscals(
			@GraphQLArgument(name = "filter") String filter,
			@GraphQLArgument(name = "page") Integer page,
			@GraphQLArgument(name = "size") Integer size
	) {
		UUID companyId = SecurityUtils.currentCompanyId()
		getPageable("Select c from Fiscal c  where c.company.id = :companyId and lower(c.remarks) like lower(concat('%',:filter,'%')) ORDER BY c.fiscalId ASC",
				"Select count(c) from Fiscal c  where c.company.id = :companyId and lower(c.remarks) like lower(concat('%',:filter,'%'))",
				page,
				size,
				[
						filter: filter,
						companyId:companyId
				]
		)
	}
	
	@GraphQLMutation
	Fiscal upsertFiscal(
			@GraphQLArgument(name = "id") UUID id,
			@GraphQLArgument(name = "fields") Map<String, Object> fields
	) {
		
		upsertFromMap(id, fields, { Fiscal entity, boolean forInsert ->
			
			if (forInsert) {
				entity.company = SecurityUtils.currentCompany()
				entity.fiscalId = generatorService.getNextValue(GeneratorType.FISCAL, {
					return "FL-" + StringUtils.leftPad(it.toString(), 6, "0")
				})
				if (entity.active) {
					List<Fiscal> list = createQuery("SELECT q FROM Fiscal q WHERE q.fiscalId NOT IN (:id)",
							[id: entity.fiscalId]).resultList
					list.each {
						it ->
							Fiscal x = findOne(it.id)
							x.active = false
							save(x)
					}
				}
				
			} else {
				if (entity.active) {
					List<Fiscal> list = createQuery("SELECT q FROM Fiscal q WHERE q.id NOT IN (:id)",
							[id: entity.id]).resultList
					list.each {
						it ->
							Fiscal x = findOne(it.id)
							x.active = false
							save(x)
					}
					
				} else {
					def check = createCountQuery("Select count(p) from Fiscal p where p.active = true").resultList
					if (!check[0]) {
						def x = findOne(entity.id)
						x.active = true
						save(x)
					}
				}
				
			}
			
		})
		
	}
}
