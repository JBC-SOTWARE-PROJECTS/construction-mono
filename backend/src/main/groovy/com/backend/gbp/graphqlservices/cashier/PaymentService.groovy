package com.backend.gbp.graphqlservices.cashier

import com.backend.gbp.domain.accounting.CustomerType
import com.backend.gbp.domain.accounting.JournalType
import com.backend.gbp.domain.accounting.LedgerDocType
import com.backend.gbp.domain.cashier.PaymentType
import com.backend.gbp.domain.cashier.ReceiptType
import com.backend.gbp.domain.types.AutoIntegrateable
import com.backend.gbp.graphqlservices.accounting.ARPaymentPostingService
import com.backend.gbp.graphqlservices.accounting.ArCustomerServices
import com.backend.gbp.graphqlservices.accounting.Entry
import com.backend.gbp.graphqlservices.accounting.IntegrationServices
import com.backend.gbp.graphqlservices.accounting.LedgerServices
import com.backend.gbp.graphqlservices.accounting.SubAccountSetupService
import com.backend.gbp.graphqlservices.billing.BillingItemService
import com.backend.gbp.graphqlservices.billing.BillingService
import com.backend.gbp.graphqlservices.billing.JobService
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.repository.billing.BillingRepository
import com.backend.gbp.services.EntityObjectMapperService
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
import groovy.transform.Canonical
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

@Canonical
class PaymentTarget {
	String journalCode
	BigDecimal amount
}


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

	@Autowired
	ArCustomerServices arCustomerServices

	@Autowired
	EntityObjectMapperService entityObjectMapperService

	@Autowired
	SubAccountSetupService subAccountSetupService

	@Autowired
	IntegrationServices integrationServices

	@Autowired
	LedgerServices ledgerServices

	@Autowired
	ARPaymentPostingService arPaymentPostingService

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
			pay.description = paymentVal.receiptType+' #' + paymentVal.orNumber + ' - ' + (billObject.customer?.accountName ? billObject.customer?.accountName : billObject.otcName)
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

	Payment postARPaymentsToAccounting(Payment paymentTracker, String clientType) {


		def allCoa = subAccountSetupService.getAllChartOfAccountGenerate("", "", "", "", "", "")

		def headerLedger = integrationServices.generateAutoEntriesEnhanced(paymentTracker) { Payment ptracker, multipleData ->

			ptracker.flagValue = "AR_CLIENTS_PAYMENT"
			multipleData['amountForCreditCard'] = []
			multipleData['amountForCashDeposit'] = []
			//Check for Credit Card

			ptracker.paymentDetails.findAll { it.type == PaymentType.CARD.name() }.each { pdt ->
				multipleData['amountForCreditCard'] << new Payment().tap {
					it.amountForCreditCard = pdt.amount
					it.bankForCreditCard = pdt.bankEntity
				}
			}

			ptracker.paymentDetails.findAll { it.type == PaymentType.EWALLET.name() }.each { pdt ->
				multipleData['amountForCreditCard'] << new Payment().tap {
					it.amountForCreditCard = pdt.amount
					it.bankForCreditCard = pdt.bankEntity
				}
			}


			ptracker.paymentDetails.findAll { it.type == PaymentType.BANKDEPOSIT.name() }.each { pdt ->
				multipleData['amountForCashDeposit'] << new Payment().tap {
					it.amountForCashDeposit = pdt.amount
					it.bankForCashDeposit = pdt.bankEntity
				}
			}

		}


		List<Entry> entries = []


		headerLedger.ledger.each {
			it.journalAccount.fromGenerator = true
			entries << new Entry(it.journalAccount, it.debit)
		}

		paymentTracker.paymentTargets.each { target ->

			def match = allCoa.find { it.code == target.journalCode }
			if (match) {
				if(match.motherAccount.normalSide.equalsIgnoreCase('debit'))
					entries << new Entry(match, target.amount.negate())
				else
					entries << new Entry(match, target.amount)
			}
		}

		headerLedger = ledgerServices.createDraftHeaderLedger(entries,headerLedger.transactionDate)

		headerLedger.transactionType =  "${paymentTracker.receiptType} NO"
		headerLedger.transactionNo = paymentTracker.orNumber

//		headerLedger.referenceType = paymentTracker.referenceType
//		headerLedger.referenceNo = paymentTracker.reference

		def pHeader = ledgerServices.persistHeaderLedger(headerLedger,
				"${paymentTracker.receiptType}-${paymentTracker.orNumber}",
				"${paymentTracker.payorName}",
				"${clientType} PAYMENTS",
				paymentTracker.receiptType == ReceiptType.AR.name() ? LedgerDocType.AR : LedgerDocType.OR,
				JournalType.RECEIPTS,
				paymentTracker.createdDate,
				[:]
		)
		paymentTracker.postedLedgerId = pHeader.id
		paymentRepository.save(paymentTracker)
	}

	@GraphQLMutation
	@Transactional
	GraphQLResVal<Payment> addReceivablePayment(
			@GraphQLArgument(name = "customerId") UUID  customerId,
			@GraphQLArgument(name = "tendered") List<Map<String, Object>> tendered,
			@GraphQLArgument(name = "shiftId") UUID shiftId,
			@GraphQLArgument(name = "orNumber") BigDecimal orNumber,
			@GraphQLArgument(name = "transactionType") String transactionType,
			@GraphQLArgument(name = "paymentMethod") String paymentMethod,
			@GraphQLArgument(name = "transactions") List<Map<String, Object>> transactions
	) {

		def client = arCustomerServices.findOne(customerId)

		String clientType = client.customerType
		def totalpayments = 0.0,
			totalCash = 0.0,
			totalCheck = 0.0,
			totalCard = 0.0,
			totalDeposit = 0.0,
			totalEWallet = 0.0,
			pf = 0.0,
			hosp = 0.0


		def paymentTracker = new Payment()
		paymentTracker.payorName = client.customerName
		paymentTracker.arCustomerId = client.id

		tendered.each {
			map ->
				def payTrackerDetail = new PaymentDetial()
				payTrackerDetail.payment = paymentTracker
				entityObjectMapperService.updateFromMap(payTrackerDetail, map)

				if (payTrackerDetail.type == PaymentType.CASH.name())
					totalCash += payTrackerDetail.amount

				if (payTrackerDetail.type == PaymentType.CHECK.name())
					totalCheck += payTrackerDetail.amount

				if (payTrackerDetail.type == PaymentType.CARD.name())
					totalCard += payTrackerDetail.amount

				if (payTrackerDetail.type == PaymentType.BANKDEPOSIT.name())
					totalDeposit += payTrackerDetail.amount

				if (payTrackerDetail.type == PaymentType.EWALLET.name())
					totalEWallet += payTrackerDetail.amount

				paymentTracker.paymentDetails.add(payTrackerDetail)
		}


		paymentTracker.totalCash = totalCash
		paymentTracker.totalCheck = totalCheck
		paymentTracker.totalCard = totalCard
		paymentTracker.totalDeposit = totalDeposit
		paymentTracker.totalEWallet = totalEWallet

		totalpayments = (totalCash + totalCheck + totalCard + totalDeposit + totalEWallet)

		paymentTracker.totalPayments = totalpayments

		transactions.each {
			String itemType = it['itemType'] ?: '' as String
			def payAmount = it['payment']
			BigDecimal paymentApplied = (payAmount ? payAmount : 0.00) as BigDecimal
			if(paymentApplied > 0) {
				if (itemType.equalsIgnoreCase('PF'))
					pf += paymentApplied
				else
					hosp += paymentApplied
			}
		}

//		def receiptIssuance = receiptIssuanceService.findOne(batchReceiptId)
		def shift = shiftRepository.findById(shiftId).get()

//		if (type == "OR") {
			paymentTracker.orNumber = orNumber
			paymentTracker.receiptType = ReceiptType.OR
			paymentTracker.shift = shift
			paymentTracker.description = "OR [${paymentTracker.orNumber}] - AR CLIENT PAYMENT ${paymentTracker?.remarks ?: ''}"

//			receiptIssuance.receiptCurrent++
//
//			if (receiptIssuance.receiptCurrent > receiptIssuance.receiptTo) {
//				receiptIssuance.receiptCurrent = null
//				receiptIssuance.activebatch = false
//			}
//			receiptIssuanceService.save(receiptIssuance)
//		} else {
//			paymentTracker.ornumber = receiptIssuance.arCurrent
//			paymentTracker.receiptType = ReceiptType.AR
//			paymentTracker.shift = shift
//			paymentTracker.description = "OR [${paymentTracker.ornumber}] - AR CLIENT PAYMENT ${paymentTracker?.reference ?: ''}"
//
//			receiptIssuance.arCurrent++
//
//			if (receiptIssuance.arCurrent > receiptIssuance.arTo) {
//				receiptIssuance.arCurrent = null
//				receiptIssuance.aractive = false
//			}
//			receiptIssuanceService.save(receiptIssuance)
//
//		}

//		paymentTracker.referenceType = referenceType
//		paymentTracker.reference = referenceNo
		paymentTracker = paymentRepository.save(paymentTracker)

		// changed to new Coa
		def pt = new PaymentTarget()
		pt.amount = totalpayments

		pt.journalCode = client?.discountAndPenalties?.salesAccountCode ?: ''

		paymentTracker.paymentTargets << pt

		postARPaymentsToAccounting(paymentTracker,clientType)

		arPaymentPostingService.onProcessPaymentInvoice(paymentTracker,transactions,paymentMethod,transactionType)

		paymentTracker

		return new GraphQLResVal<Payment>(paymentTracker, true, 'Payment was successful. Your invoice now reflects the updated total amount due. ')
	}
}
