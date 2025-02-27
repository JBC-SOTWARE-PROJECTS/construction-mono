package com.backend.gbp.graphqlservices.cashier

import com.backend.gbp.domain.cashier.BatchReceipt
import com.backend.gbp.domain.cashier.ReceiptType
import com.backend.gbp.domain.cashier.Terminal
import com.backend.gbp.graphqlservices.accounting.OptionDto
import com.backend.gbp.graphqlservices.base.AbstractDaoCompanyService
import com.backend.gbp.repository.UserRepository
import com.backend.gbp.repository.billing.DiscountDetailsRepository
import com.backend.gbp.repository.cashier.TerminalRepository
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.security.SecurityUtils
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
class BatchService extends AbstractDaoCompanyService<BatchReceipt> {

	BatchService () {
		super(BatchReceipt.class)
	}

	@Transactional(rollbackOn = Exception)
	@GraphQLMutation(name = "upsertBatchReceipt", description = "Add Batch Receipt")
	BatchReceipt upsertBatchReceipt(
			@GraphQLArgument(name = "id") UUID id,
			@GraphQLArgument(name = "fields") Map<String, Object> fields
	) {
		try {
			return upsertFromMap(id, fields)
		} catch (ignored) {
			return new BatchReceipt()
		}
	}

	@GraphQLQuery(name = "getBatchReceipt")
	BatchReceipt getBatchReceipt(
			@GraphQLArgument(name = "id") UUID id
	) {
		try {
			return findOne(id)
		} catch (ignored) {
			return new BatchReceipt()
		}
	}


	@GraphQLQuery(name = "getBatchReceipts")
	Page<BatchReceipt> getBatchReceipts(
			@GraphQLArgument(name = "filter") String filter = '',
			@GraphQLArgument(name = "page") Integer page = 0,
			@GraphQLArgument(name = "size") Integer size = 10
	) {
		try {
			Map<String, Object> params = new HashMap<>()
			params.put('filter', filter)
			params.put('companyId', SecurityUtils.currentCompanyId())
			return getPageable("""
				Select b from BatchReceipt b where b.companyId = :companyId
				and (
					lower(b.batchCode) like lower(concat('%',:filter,'%')) 
				)
			""",
				"""
				Select count(b) from BatchReceipt b where b.companyId = :companyId
				and (
					lower(b.batchCode) like lower(concat('%',:filter,'%')) 
				)	
			""",
			page, size, params)
		} catch (ignored) {
			return Page.empty()
		}
	}

	@GraphQLQuery(name = "receiptTypeOptions")
    static List<OptionDto> getReceiptTypeOptions() {
		try {
			List<OptionDto> options = []
			ReceiptType.values().each { type ->
				options << new OptionDto(label: type.label,value: type.name())
			}
			return options
		} catch (ignored) {
			return []
		}
	}

	@GraphQLQuery(name = "terminalBatchReceiptByDocType")
	BatchReceipt getTerminalBatchReceiptByDocType(
			@GraphQLArgument(name = "terminalId") UUID terminalId,
			@GraphQLArgument(name = "receiptType") String receiptType
	) {
		try {
			return createQuery("""
				SELECT b FROM BatchReceipt b
				WHERE b.terminal.id = :terminalId
				AND b.receiptType = :receiptType
				AND b.receiptCurrentNo <= b.rangeEnd
				order by b.batchCode asc
			""")
				.setParameter("terminalId", terminalId)
				.setParameter("receiptType", ReceiptType.valueOf(receiptType))
				.singleResult
		} catch (ignored) {
			return new BatchReceipt()
		}
	}
}
