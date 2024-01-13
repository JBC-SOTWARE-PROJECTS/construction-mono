package com.backend.gbp.graphqlservices.cashier

import com.backend.gbp.security.SecurityUtils
import com.fasterxml.jackson.databind.ObjectMapper
import com.backend.gbp.domain.cashier.Terminal
import com.backend.gbp.repository.UserRepository
import com.backend.gbp.repository.billing.DiscountDetailsRepository
import com.backend.gbp.repository.cashier.TerminalRepository
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.GeneratorType
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

import javax.transaction.Transactional


@Component
@GraphQLApi
@TypeChecked
class TerminalService {

	@Autowired
	TerminalRepository terminalRepository

	@Autowired
	ObjectMapper objectMapper

	@Autowired
	GeneratorService generatorService

	@Autowired
	UserRepository userRepository

	@Autowired
	EmployeeRepository employeeRepository

	@Autowired
	DiscountDetailsRepository discountDetailsRepository

	@GraphQLQuery(name = "terminals", description = "List of Terminal")
	List<Terminal> terminals() {
		return terminalRepository.findAll().sort { it.terminal_no }
	}

	@GraphQLQuery(name = "terminalFilter")
	List<Terminal> terminalFilter(
			@GraphQLArgument(name = "filter") String filter
	) {
		def company = SecurityUtils.currentCompanyId()
		return terminalRepository.getTerminalFilter(filter, company).sort { it.terminal_no }
	}


	//
	//MUTATION
	@Transactional
	@GraphQLMutation(name = "addTerminal", description = "add Terminal")
	Terminal addTerminal(
			@GraphQLArgument(name = "fields") Map<String, Object> fields,
			@GraphQLArgument(name = "id") UUID id
	) {
		def company = SecurityUtils.currentCompanyId()
		def value = objectMapper.convertValue(fields, Terminal.class)

		Terminal term = new Terminal()
		if (id) {
			term = terminalRepository.findById(id).get()
		} else {
			term.terminal_no = generatorService.getNextValue(GeneratorType.CTM_NO) { Long no ->
				"CTM-" + StringUtils.leftPad(no.toString(), 6, "0")
			}
		}
		term.description = value.description
		term.mac_address = value.mac_address
		term.employee = value.employee
		term.company = company
		terminalRepository.save(term)

		return term
	}


}
