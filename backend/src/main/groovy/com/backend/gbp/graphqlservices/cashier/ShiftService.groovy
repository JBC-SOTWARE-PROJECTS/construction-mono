package com.backend.gbp.graphqlservices.cashier

import com.backend.gbp.domain.cashier.BatchReceipt
import com.backend.gbp.domain.cashier.Payment
import com.backend.gbp.domain.cashier.ReceiptType
import com.backend.gbp.graphqlservices.base.AbstractDaoCompanyService
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
class ShiftService extends AbstractDaoCompanyService<Shift> {

	ShiftService(){
		super(Shift.class)
	}

	@Autowired
	ShiftRepository shiftRepository

	@Autowired
	TerminalRepository terminalRepository

	@Autowired
	BatchService batchService

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
		def company = SecurityUtils.currentCompanyId()
		return shiftRepository.getAllShift(company).sort{ it.createdDate}.reverse(true)
	}

	@GraphQLQuery(name = "shiftPerEmp", description = "List of Shift Per emp")
	List<Shift> shiftPerEmp() {
		def company = SecurityUtils.currentCompanyId()
		User user = userRepository.findOneByLogin(SecurityUtils.currentLogin())
		Employee employee = employeeRepository.findOneByUser(user)

		return shiftRepository.getShiftEmp(employee.id, company).sort{ it.createdDate}.reverse(true)
	}

	@GraphQLQuery(name = "activeShiftList", description = "List of Shift Per emp")
	List<Shift> activeShiftList(@GraphQLArgument(name = "filter") String filter, @GraphQLArgument(name = "status") Boolean status) {
		def company = SecurityUtils.currentCompanyId()
		return shiftRepository.getActiveShiftList(company, filter, status)
	}

	@GraphQLQuery(name = "activeShift", description = "List of Shift Per emp")
	Shift activeShift() {
		def company = SecurityUtils.currentCompanyId()
		def list =  shiftRepository.getActiveShift(company)
		if(list.size() > 1){
			return null
		}else{
			def result = list.findAll().first()
			return result
		}
	}

	@GraphQLQuery(name = "terminalActiveShift", description = "Active Shift Per temp")
	Shift getTerminalActiveShift(
			@GraphQLArgument(name = "terminalId") UUID terminalId
	) {
		try {
			def shift = createQuery("""
			SELECT s FROM Shift s
			WHERE s.terminal.id = :terminalId
			AND s.active = true
		""")
					.setParameter("terminalId", terminalId)
					.singleResult


		}catch (ignore){
			return null
		}

	}

	@GraphQLQuery(name = "employeeActiveShift", description = "Active Shift Per emp")
	Shift employeeActiveShift(
			@GraphQLArgument(name = "receiptType") String receiptType
	) {
		try {
			def companyId = SecurityUtils.currentCompanyId()
			def username = SecurityUtils.currentLogin()
			def user = userRepository.findOneByLogin(username)
			def employeeId = employeeRepository.findOneByUser(user)?.id
			def terminalId = terminalRepository.getTerminalByEmpByComp(employeeId,companyId)?.id
			def shift = getTerminalActiveShift(terminalId)
			if(shift){
				def batch = batchService.getTerminalBatchReceiptByDocType(terminalId, receiptType)
				shift.nextDocNo = batch.receiptCurrentNo
				shift.docType = ReceiptType.valueOf(receiptType)
				shift.batchId = batch.id
			}
			return shift
		}catch (Exception e){
			return null
		}
	}

	//
	//MUTATION
	@Transactional
	@GraphQLMutation(name = "addShift", description = "add shift")
	Shift addShift() {
		def companyId = SecurityUtils.currentCompanyId()
		def username = SecurityUtils.currentLogin()
		def user = userRepository.findOneByLogin(username)
		def employee = employeeRepository.findOneByUser(user)
		def terminal = terminalRepository.getTerminalByEmpByComp(employee?.id,companyId)
		def activeShift = getTerminalActiveShift(terminal?.id)
		def result = new Shift()
		try {
			if(activeShift){
				throw new Exception("There is currently active shift");
			}else{
				if (terminal) {
					Shift term = new Shift()
					term.shiftNo = generatorService.getNextValue(GeneratorType.SHIFT_NO) { Long no ->
						"SFT-" + StringUtils.leftPad(no.toString(), 6, "0")
					}
					term.terminal = terminal
					term.active = true
					term.startShift = Instant.now()
					term.employee = employee
					term.company = companyId
					def afterSave = shiftRepository.save(term)
					result = afterSave
				} else {
					throw new Exception("No Terminal Assign in this account");
				}
			}

		} catch (Exception e) {
			throw new Exception("Something was Wrong : " + e)
		}
		return result
	}

	@Transactional
	@GraphQLMutation(name = "closeShift", description = "close shift")
	Shift closeShift() {
		def company = SecurityUtils.currentCompanyId()
		def upsert = new Shift()
		def close = shiftRepository.getActiveShift(company)
		close.each {
			upsert = it
			upsert.endShift = Instant.now()
			upsert.active = false
			shiftRepository.save(upsert)
		}
		return upsert
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
