package com.backend.gbp.graphqlservices.cashier

import com.fasterxml.jackson.databind.ObjectMapper
import com.backend.gbp.domain.User
import com.backend.gbp.domain.cashier.Shift
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.repository.UserRepository
import com.backend.gbp.repository.billing.DiscountDetailsRepository
import com.backend.gbp.repository.cashier.ShiftRepository
import com.backend.gbp.repository.cashier.TerminalRepository
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.security.SecurityUtils
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
import java.time.Duration
import java.time.Instant

@Component
@GraphQLApi
@TypeChecked
class ShiftService {

	@Autowired
	ShiftRepository shiftRepository

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


	@GraphQLQuery(name = "shiftList", description = "List of Shift Per emp")
	List<Shift> shiftList() {
		return shiftRepository.findAll().sort{ it.createdDate}.reverse(true)
	}

	@GraphQLQuery(name = "shiftPerEmp", description = "List of Shift Per emp")
	List<Shift> shiftPerEmp() {
		User user = userRepository.findOneByLogin(SecurityUtils.currentLogin())
		Employee employee = employeeRepository.findOneByUser(user)

		return shiftRepository.getShiftEmp(employee.id).sort{ it.createdDate}.reverse(true)
	}

	@GraphQLQuery(name = "activeShift", description = "List of Shift Per emp")
	Shift activeShift() {
		User user = userRepository.findOneByLogin(SecurityUtils.currentLogin())
		Employee employee = employeeRepository.findOneByUser(user)

		return shiftRepository.getActiveShift(employee.id)
	}

	//
	//MUTATION
	@Transactional
	@GraphQLMutation(name = "addShift", description = "add shift")
	Shift addShift() {
		User user = userRepository.findOneByLogin(SecurityUtils.currentLogin())
		Employee employee = employeeRepository.findOneByUser(user)

		def terminal = terminalRepository.getTerminalByEmp(employee.id)
		Shift term = new Shift()
		try {
			if (terminal) {
				term.shiftNo = generatorService.getNextValue(GeneratorType.SHIFT_NO) { Long no ->
					"SFT-" + StringUtils.leftPad(no.toString(), 6, "0")
				}
				term.terminal = terminal
				term.active = true
				term.startShift = Instant.now()
				term.employee = employee
				shiftRepository.save(term)
			} else {
				throw new Exception("No Terminal Assign in this account");
			}
		} catch (Exception e) {
			throw new Exception("Something was Wrong : " + e)
		}
		return term
	}

	@Transactional
	@GraphQLMutation(name = "closeShift", description = "close shift")
	Shift closeShift() {
		User user = userRepository.findOneByLogin(SecurityUtils.currentLogin())
		Employee employee = employeeRepository.findOneByUser(user)

		Shift close = shiftRepository.getActiveShift(employee.id)
		close.endShift = Instant.now()
		close.active = false
		shiftRepository.save(close)

		return close
	}

	@Transactional
	@GraphQLMutation(name = "addRemarks", description = "add remarks in shift")
	Shift addRemarks(@GraphQLArgument(name = "id") UUID id, @GraphQLArgument(name = "remarks") String remarks) {

		Shift up = shiftRepository.findById(id).get()
		up.remarks = remarks
		shiftRepository.save(up)

		return up
	}


}
