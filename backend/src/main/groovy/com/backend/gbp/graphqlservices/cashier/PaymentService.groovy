package com.backend.gbp.graphqlservices.cashier

import com.backend.gbp.graphqlservices.billing.BillingItemService
import com.backend.gbp.graphqlservices.billing.BillingService
import com.backend.gbp.graphqlservices.billing.JobService
import com.backend.gbp.repository.billing.BillingRepository
import com.fasterxml.jackson.databind.ObjectMapper
import com.backend.gbp.domain.User
import com.backend.gbp.domain.billing.Billing
import com.backend.gbp.domain.billing.BillingItem
import com.backend.gbp.domain.cashier.Payment
import com.backend.gbp.domain.cashier.PaymentDetial
import com.backend.gbp.domain.cashier.PaymentItems
import com.backend.gbp.domain.cashier.PaymentTargetItem
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.billing.Job
import com.backend.gbp.repository.UserRepository
import com.backend.gbp.repository.billing.BillingItemRepository
import com.backend.gbp.repository.cashier.*
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.rest.InventoryResource
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
class PaymentService {

	@Autowired
	ShiftRepository shiftRepository

	@Autowired
	TerminalRepository terminalRepository

	@Autowired
	ObjectMapper objectMapper

	@Autowired
	GeneratorService generatorService

	@Autowired
	InventoryResource inventoryResource

	@Autowired
	UserRepository userRepository

	@Autowired
	EmployeeRepository employeeRepository

	@Autowired
	PaymentRepository paymentRepository

	@Autowired
	PaymentDetailRepository paymentDetailRepository

	@Autowired
	BillingService billingService

	@Autowired
	BillingItemService billingItemService

	@Autowired
	BillingItemRepository billingItemRepository

	@Autowired
	BillingRepository billingRepository

	@Autowired
	PaymentTargetItemRepository paymentTargetItemRepository

	@Autowired
	JobService jobService

	@Autowired
	PaymentItemRepository paymentItemRepository

	@GraphQLQuery(name = "paymentByBillingId", description = "List of Payments By Billing ID")
	List<Payment> paymentByBillingId(@GraphQLArgument(name = "id") UUID id) {
		return paymentRepository.getPaymentByBillingId(id).sort { it.createdDate }
	}

	@GraphQLQuery(name = "paymentsByShift", description = "List of Payments By shift ID")
	List<Payment> paymentsByShift(@GraphQLArgument(name = "id") UUID id, @GraphQLArgument(name = "filter") String filter) {
		return paymentRepository.paymentsByShift(id, filter).sort { it.createdDate }
	}

	@GraphQLQuery(name = "paymentItems", description = "List of Payments By shift ID")
	List<PaymentItems> paymentItems(@GraphQLArgument(name = "id") UUID id, @GraphQLArgument(name = "type") String type) {
		return paymentItemRepository.getPaymentItemsByPayment(id, type)
	}

	@GraphQLQuery(name = "outputTax", description = "List of Payments By shift ID")
	BigDecimal getOutputTax(@GraphQLArgument(name = "id") UUID id, @GraphQLArgument(name = "type") String type) {
		return paymentItemRepository.getOutputTax(id, type)
	}

	@GraphQLQuery(name = "vatable_non", description = "List of Payments By shift ID")
	BigDecimal vatable_non(@GraphQLArgument(name = "id") UUID id, @GraphQLArgument(name = "type") String type) {
		return paymentItemRepository.getVatableNonVatable(id, type)
	}



	//
	//MUTATION
	@Transactional
	@GraphQLMutation(name = "addPayment", description = "add Payment")
	Payment addPayment(
			@GraphQLArgument(name = "billing") UUID billing,
			@GraphQLArgument(name = "shift") UUID shift,
			@GraphQLArgument(name = "type") String type,
			@GraphQLArgument(name = "payment") Map<String, Object> payment,
			@GraphQLArgument(name = "payment_details") ArrayList<Map<String, Object>> payment_details
	) {

		def paymentVal = objectMapper.convertValue(payment, Payment)
		def listPaymentDetials = payment_details as ArrayList<PaymentDetial>
		def billObject = billingService.billingById(billing)

		Payment pay = new Payment()
		BillingItem item = new BillingItem()

		try {
			//add billing item for payment
			def recordNo = generatorService.getNextValue(GeneratorType.REC_NO) { Long no ->
				StringUtils.leftPad(no.toString(), 6, "0")
			}
			item.transDate = Instant.now()
			item.billing = billObject
			item.recordNo = recordNo
			item.description = 'PAYMENT '+paymentVal.receiptType+' #' + paymentVal.orNumber + '[' + paymentVal.remarks + ']'.toUpperCase()
			item.qty = 1
			item.debit = BigDecimal.ZERO
			item.credit = paymentVal.totalPayments
			item.subTotal = BigDecimal.ZERO - paymentVal.totalPayments
			item.itemType = 'PAYMENTS'
			item.transType = type
			item.status = true
			def bill_item = billingItemRepository.save(item)
			//end billing Item

			//add payment record
			pay.totalPayments = paymentVal.totalPayments
			pay.totalCash = paymentVal.totalCash
			pay.totalCheck = paymentVal.totalCheck
			pay.orNumber = paymentVal.orNumber
			pay.description = paymentVal.receiptType+' #' + paymentVal.orNumber + ' - ' + (billObject.customer?.fullName ? billObject.customer?.fullName : billObject.otcName)
			pay.remarks = paymentVal.remarks
			pay.billing = billObject
			pay.billingItem = bill_item
			pay.shift = shiftRepository.findById(shift).get()
			pay.receiptType = paymentVal.receiptType
			def paymentObject = paymentRepository.save(pay)
			//end payment record

			//start loop insert payment details
			listPaymentDetials.each {
				it ->
					PaymentDetial detial = new PaymentDetial()
					detial.amount = it.amount
					detial.type = it.type
					detial.reference = it.reference
					detial.checkDate = it.checkDate
					detial.bank = it.bank
					detial.payment = paymentObject
					paymentDetailRepository.save(detial)
			}
			//end loop insert payment details

			//target OR# to billing item
			def amountToPay = paymentVal.totalPayments
			def loopbill = inventoryResource.getCustomerBillingNotYetPaid(billing)
			loopbill.each {
				PaymentTargetItem target = new PaymentTargetItem()
				if(amountToPay != 0){
					def bitem = billingItemRepository.findById(it.id).get()
					target.payment = paymentObject
					target.billing = billObject
					target.billingItem = bitem
					if(amountToPay >= it.balance){
						target.amount = it.balance
						amountToPay = amountToPay - it.balance
					}else{
						target.amount = amountToPay
						amountToPay = 0
					}
					paymentTargetItemRepository.save(target)

					//update billing_item put or number
					BillingItem up = bitem
					up.orNum = up.orNum ? up.orNum.concat(","+paymentVal.orNumber) : paymentVal.orNumber
					billingItemRepository.save(up)
				}
			}

			//check if balance is zero
			def balance = billingItemService.getBalance(billing)
			if(balance <= 0){
				Billing upbill = billObject
				upbill.status = false
				billingRepository.save(upbill)
			}

		} catch (Exception e) {
			throw new Exception("Something was Wrong : " + e)
		}
		return pay
	}

	// void
	@Transactional
	@GraphQLMutation(name = "voidOr", description = "void Payment")
	Payment voidOr(
			@GraphQLArgument(name = "paymentId") UUID paymentId
	) {
		User user = userRepository.findOneByLogin(SecurityUtils.currentLogin())
		Employee employee = employeeRepository.findOneByUser(user)

		//void payment first
		Payment voidPay = paymentRepository.findById(paymentId).get()
		voidPay.voided = true
		voidPay.voided = employee.fullName
		voidPay.voidDate = Instant.now()
		paymentRepository.save(voidPay)

		//billing item
		BillingItem cancel = voidPay.billingItem
		cancel.status = false
		billingItemRepository.save(cancel)

		//void payment details
		def paymentDetials = paymentDetailRepository.getDetailsById(paymentId)
		paymentDetials.each {
			it ->
				PaymentDetial upd = it
				upd.voided = true
				paymentDetailRepository.save(upd)
		}

		//target detail
		def targetItems = paymentTargetItemRepository.getTargetItemsByPayment(paymentId)
		targetItems.each {
			it ->
				PaymentTargetItem up = it
				up.voided = true
				paymentTargetItemRepository.save(up)

				//update OR billing item
				BillingItem bItem = it.billingItem
				if(bItem.orNum){
					def after = bItem.orNum.replace(voidPay.orNumber+",", "")
					def before = bItem.orNum.replace(","+voidPay.orNumber, "")
					if(after == bItem.orNum){
						bItem.orNum = before
					}else{
						bItem.orNum = after
					}
					billingItemRepository.save(bItem)
				}

		}

		//check if balance is zero
		def balance = billingItemService.getBalance(voidPay.billing.id)
		if(balance > 0){
			Billing upbill = voidPay.billing
			upbill.status = true
			billingRepository.save(upbill)

		}

		return voidPay
	}


}
