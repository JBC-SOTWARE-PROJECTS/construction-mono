package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.ARPaymentPosting
import com.backend.gbp.domain.accounting.ARPaymentPostingItems
import com.backend.gbp.domain.accounting.ArInvoice
import com.backend.gbp.domain.accounting.HeaderLedger
import com.backend.gbp.domain.cashier.Payment
import com.backend.gbp.graphqlservices.base.AbstractDaoCompanyService
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.security.SecurityUtils
import com.backend.gbp.services.EntityObjectMapperService
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.GeneratorType
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.stereotype.Component

import javax.transaction.Transactional
import java.time.ZoneId
import java.time.format.DateTimeFormatter

class CustomGraphQLError extends RuntimeException {
	private final String message;
	private final String errorMessage;

	public CustomGraphQLError(String message, String errorMessage) {
		this.message = message;
		this.errorMessage = errorMessage;
	}
}

@Component
@GraphQLApi
class ARPaymentPostingService extends AbstractDaoCompanyService<ARPaymentPosting> {

	ARPaymentPostingService() {
		super(ARPaymentPosting.class)
	}

	@Autowired
	EntityObjectMapperService entityObjectMapperService

	@Autowired
	GeneratorService generatorService

	@Autowired
	ARPaymentPostingItemService paymentPostingItemService

	@Autowired
	IntegrationServices integrationServices

	@Autowired
	LedgerServices ledgerServices

	@Autowired
	ArInvoiceItemServices arInvoiceItemServices

	@Autowired
	ArInvoiceServices arInvoiceServices

	@Autowired
	ArTransactionLedgerServices arTransactionLedgerServices

	@Transactional
	@GraphQLMutation(name='upsertTableARPaymentPosting')
	GraphQLResVal<ARPaymentPosting> upsertTableARPaymentPosting(
			@GraphQLArgument(name='id') UUID id,
			@GraphQLArgument(name='fields') Map<String,Object> fields
	){
		try {
			Boolean updatedAccount = false
			if(id && fields['arCustomer']) {
				def existing = findOne(id)
				if(existing.arCustomer.id.toString() != fields['arCustomer']['id']) updatedAccount = true
			}

			def payment = upsertFromMap(id, fields)
			if(payment.paymentTracker){
				payment.orNumber = payment.paymentTracker.ornumber
				payment.paymentAmount = payment.paymentTracker.totalpayments
				payment.paymentDatetime = payment.paymentTracker.createdDate
			}
			if(payment.arCustomer){
				payment.customerName = payment.arCustomer.customerName
			}

			if(!payment.recordNo) {
				def formatter = DateTimeFormatter.ofPattern("yyyy")
				String year = payment.createdDate.atZone(ZoneId.systemDefault()).format(formatter)
				payment.recordNo = generatorService.getNextGeneratorFeatPrefix("ar_pp_${year}") {
					it -> return "P${year}-${StringUtils.leftPad(it.toString(), 6, "0")}"
				}
			}


			if(payment.status.equalsIgnoreCase('posted')){
				BigDecimal pfAmount = 0.00
				BigDecimal hciAmount = 0.00
				def items = paymentPostingItemService.findAllPaymentPostingItemByPaymentPostingId(id)
				if(items){
					items.each {
						it ->
							if(it.invoiceItems.itemType.equalsIgnoreCase('PF'))
								pfAmount += it.amountPaid
							else
								hciAmount += it.amountPaid

							it.invoiceItems.payment = it?.invoiceItems?.payment ?: 0 + it.amountPaid
					}
				}
				payment.pfAmount = pfAmount
				payment.hospitalAmount = hciAmount
			}



			if(updatedAccount){
				def items = paymentPostingItemService.findAllPaymentPostingItemByPaymentPostingId(id)
				if(items){
					items.each {
						it ->
							paymentPostingItemService.deleteById(it.id)
					}
				}
			}


			save(payment)
			return new GraphQLResVal<ARPaymentPosting>(payment, true, "Payment Posting creation completed.")
		}catch (Exception e){
			throw new GraphQLResVal<ARPaymentPosting>(null,false,e.message)
		}
	}


	@GraphQLQuery(name='findOneARPaymentPosting')
	ARPaymentPosting findOneARPaymentPosting(
			@GraphQLArgument(name='id') UUID id
	){
		if(!id)
			return null
		return findOne(id)
	}

	@GraphQLQuery(name='findInvoicePayments')
	List<ARPaymentPosting> findInvoicePayments(
			@GraphQLArgument(name='invoiceId') UUID invoiceId
	){
		try{
			createQuery("""
				Select p from ARPaymentPosting p
				where 
				p.companyId = :companyId and
				p.invoiceId = :invoiceId
				and p.status != 'VOIDED'
				order by p.createdDate
			""")
					.setParameter('invoiceId',invoiceId)
					.setParameter('companyId', SecurityUtils.currentCompanyId())
				.resultList
		}catch (e){
			return []
		}

	}


	@GraphQLQuery(name='findPNPayments')
	List<ARPaymentPosting> findPNPayments(
			@GraphQLArgument(name='pnId') UUID pnId
	){
		try{
			createQuery("""
				Select p from ARPaymentPosting p
				where p.pnId = :pnId
				and p.status != 'VOIDED'
				order by p.createdDate
			""")
					.setParameter('pnId',pnId)
					.resultList
		}catch (e){
			return []
		}

	}

	@GraphQLQuery(name='findByPaymentTracker')
	List<ARPaymentPosting> findByPaymentTracker(
			@GraphQLArgument(name='paymentTrackerId') UUID paymentTrackerId
	){
		try{
			createQuery("""
				Select p from ARPaymentPosting p
				where p.paymentTrackerId = :paymentTrackerId
				and p.status != 'VOIDED'
				order by p.createdDate
			""")
					.setParameter('paymentTrackerId',paymentTrackerId)
					.resultList
		}catch (ignored){
			return []
		}

	}


	@GraphQLQuery(name="findAllARPaymentPosting")
	Page<ARPaymentPosting> findAllARPaymentPosting(
			@GraphQLArgument(name = "customerId") UUID customerId,
			@GraphQLArgument(name = "search") String search,
			@GraphQLArgument(name = "page") Integer page,
			@GraphQLArgument(name = "size") Integer size,
			@GraphQLArgument(name = "status") String status
	){
		try {
			String queryStr = """ from ARPaymentPosting c where 
			(c.orNumber like concat('%',:search,'%') or c.recordNo like concat('%',:search,'%')) and c.status != 'VOIDED'
                            """
			Map<String, Object> params = [:]
			params['search'] = search

			if (customerId) {
				queryStr += "and c.arCustomer.id = :customerId "
				params['customerId'] = customerId
			}

			if (status != 'ALL') {
				queryStr += "and c.status = :status "
				params['status'] = status
			}

			getPageable(
					""" Select c ${queryStr} order by c.createdDate desc""",
					""" Select count(c) ${queryStr}""",
					page,
					size,
					params
			)
		}catch (e){
			return Page.empty()
		}
	}

	HeaderLedger paymentPostingJournalEntry(ARPaymentPosting paymentPosting){
		def yearFormat = DateTimeFormatter.ofPattern("yyyy")

		def headerLedger =	integrationServices.generateAutoEntries(paymentPosting){it, nul ->
			it.flagValue = 'AR_PAYMENT_POSTING'
			it.negatePaymentAmount = it.paymentAmount.negate()
			it.negateHospitalAmount = it.hospitalAmount.negate()
		}

		Map<String,String> details = [:]
		paymentPosting.details.each { k,v ->
			details[k] = v
		}

		details["PAYMENT_POSTING_ID"] = paymentPosting.id.toString()



		def transactionDate
		transactionDate = paymentPosting.paymentDatetime

		def pHeader =	ledgerServices.persistHeaderLedger(headerLedger,
				"${transactionDate.atZone(ZoneId.systemDefault()).format(yearFormat)}-${paymentPosting.recordNo}",
				"RECEIVABLES - ${paymentPosting.arCustomer.customerName}",
				"PP-${paymentPosting.recordNo} - PAYMENT POSTING FOR ${paymentPosting.paymentAmount}",
				LedgerDocType.PP,
				JournalType.GENERAL,
				transactionDate,
				details)

		paymentPosting.postedLedger = pHeader.id
		save(paymentPosting)
		return  pHeader
	}


	@Transactional
	@GraphQLMutation(name = "paymentPostingApproval")
	GraphQLResVal<ARPaymentPosting> paymentPostingApproval(
			@GraphQLArgument(name = "id") UUID id,
			@GraphQLArgument(name = "fields") Map<String,Object> fields,
			@GraphQLArgument(name = "entryPosting") Boolean entryPosting
	) {
		def paymentPosting  =  upsertTableARPaymentPosting(id,fields).response
		if(!paymentPosting)
			return  new GraphQLResVal<ArInvoice>(null, false, 'Transaction failed: Calculation error. Please check your input and try again.')

		if(paymentPosting.status.equalsIgnoreCase('pending') && entryPosting) {
			paymentPostingJournalEntry(paymentPosting)
//			arTransactionLedgerServices.insertArInvoiceTransactionLedger(invoice)
		}
		return  new GraphQLResVal<ARPaymentPosting>(paymentPosting, true, 'Payment Posting transaction completed successfully.')
	}

	void onProcessPaymentInvoice(
			Payment paymentTracker,
			List<Map<String,Object>> invoiceItems,
			String paymentMethod,
			String transactionType
	){
		Map<UUID,Map<String,BigDecimal>> invoiceMap = [:]
		Map<UUID,List<ARPaymentPostingItems>> postingItems = [:]

		invoiceItems.each {
			items ->
				def arInvoiceItems = arInvoiceItemServices.findOne(UUID.fromString(items['id'] as String))
				updateFromMap(arInvoiceItems, items)
				BigDecimal invItemsTotalPayments = arInvoiceItems?.totalPayments?:0.00
				arInvoiceItems.totalPayments = invItemsTotalPayments + arInvoiceItems.amountToApply
				arInvoiceItemServices.save(arInvoiceItems)

				if (!invoiceMap[arInvoiceItems.arInvoice.id])
					invoiceMap[arInvoiceItems.arInvoice.id] = [:]

				if(arInvoiceItems.itemType.equalsIgnoreCase('PF')) {
					if (!invoiceMap[arInvoiceItems.arInvoice.id]['PF'])
						invoiceMap[arInvoiceItems.arInvoice.id]['PF'] = arInvoiceItems.amountToApply
					else
						invoiceMap[arInvoiceItems.arInvoice.id]['PF'] += arInvoiceItems.amountToApply
				}
				else {
					if (!invoiceMap[arInvoiceItems.arInvoice.id]['HCI'])
						invoiceMap[arInvoiceItems.arInvoice.id]['HCI'] = arInvoiceItems.amountToApply
					else
						invoiceMap[arInvoiceItems.arInvoice.id]['HCI'] += arInvoiceItems.amountToApply
				}

				def paymentPostingItem = new ARPaymentPostingItems()
				paymentPostingItem.recordNo = generatorService?.getNextValue(GeneratorType.AR_PAYMENT_POSTING_ITEMS, { i -> StringUtils.leftPad(i.toString(), 6, "0") })
				paymentPostingItem.orNumber = paymentTracker.orNumber
				paymentPostingItem.paymentTrackerId = paymentTracker.id
				paymentPostingItem.paymentDatetime = paymentTracker.createdDate
				paymentPostingItem.itemType = arInvoiceItems.itemType
				paymentPostingItem.invoiceId = arInvoiceItems.arInvoice.id
				paymentPostingItem.invoiceNo = arInvoiceItems.arInvoice.invoiceNo
				paymentPostingItem.invoiceDueDate = arInvoiceItems.arInvoice.dueDate
				paymentPostingItem.invoiceItemId = arInvoiceItems.id
				paymentPostingItem.itemName = arInvoiceItems.itemName
				paymentPostingItem.description = arInvoiceItems.description
				paymentPostingItem.reference = arInvoiceItems.arInvoice.reference
				paymentPostingItem.customerId = arInvoiceItems.arCustomer.id
				paymentPostingItem.customerName = arInvoiceItems.arCustomer.customerName
				paymentPostingItem.totalAmountDue = arInvoiceItems.totalAmountDue

				if(arInvoiceItems.totalAmountDue == arInvoiceItems.amountToApply && arInvoiceItems.itemType.equalsIgnoreCase('HCI')) {
					paymentPostingItem.appliedDiscount = paymentPostingItemService.calculateARCustomerDiscount(
							arInvoiceItems.arCustomer.id, arInvoiceItems.totalAmountDue, paymentTracker.createdDate, arInvoiceItems.arInvoice.dueDate
					) ?: 0.00
					if (!invoiceMap[arInvoiceItems.arInvoice.id]['DISC'])
						invoiceMap[arInvoiceItems.arInvoice.id]['DISC'] = paymentPostingItem.appliedDiscount
					else
						invoiceMap[arInvoiceItems.arInvoice.id]['DISC'] += paymentPostingItem.appliedDiscount
				}
				paymentPostingItem.amountPaid = arInvoiceItems.amountToApply
				def newPaymentItem = paymentPostingItemService.save(paymentPostingItem)

				if (!postingItems[arInvoiceItems.arInvoice.id])
					postingItems[arInvoiceItems.arInvoice.id] = []
				postingItems[arInvoiceItems.arInvoice.id].push(newPaymentItem)
		}

		invoiceMap.each {
			key, value ->
				def invoice = arInvoiceServices.findOne(key)
				BigDecimal hci = value['HCI']?:0.00 as BigDecimal
				BigDecimal pf = value['PF']?:0.00 as BigDecimal
				BigDecimal discount = value['DISC']?:0.00 as BigDecimal
				BigDecimal invTotalPayments = invoice?.totalPayments?:0.00
				invoice.totalPayments = invTotalPayments + hci + pf
				if(invoice.netTotalAmount == 0)
					invoice.status = 'PAID'
				else {
					if(invoice.netTotalAmount > 0)
						invoice.status = 'PARTIALLY_PAID'
				}
				arInvoiceServices.save(invoice)

				def paymentPosting = new ARPaymentPosting()
				def formatter = DateTimeFormatter.ofPattern("yyyy")
				String year = paymentTracker.createdDate.atZone(ZoneId.systemDefault()).format(formatter)
				paymentPosting.recordNo = generatorService.getNextGeneratorFeatPrefix("ar_payment_${year}") {
					it -> return "ARP${year}-${StringUtils.leftPad(it.toString(), 6, "0")}"
				}
				paymentPosting.customerName = paymentTracker.payorName
				paymentPosting.arCustomerId = paymentTracker.arCustomerId
				paymentPosting.invoiceNo = invoice.invoiceNo
				paymentPosting.invoiceId = invoice.id
				paymentPosting.paymentDatetime = paymentTracker.createdDate
				paymentPosting.orNumber = paymentTracker.orNumber
				paymentPosting.paymentTrackerId = paymentTracker.id
				paymentPosting.paymentAmount = hci + pf
				paymentPosting.discountAmount = discount
				paymentPosting.status = 'POSTED'
				def newPayment = save(paymentPosting)
				if(postingItems[key]){
					postingItems[key].each {
						it.arPaymentPosting = newPayment
						paymentPostingItemService.save(it)
					}
				}
				arTransactionLedgerServices.insertArPaymentTransactionLedger(paymentTracker,newPayment)
		}

	}


	void onProcessPaymentPromissory(
			Payment paymentTracker,
			List<Map<String,Object>> promissoryNotes,
			String paymentMethod,
			String transactionType
	){
		Map<UUID,Map<String,BigDecimal>> promissoryMap = [:]
		Map<UUID,List<ARPaymentPostingItems>> postingItems = [:]

			promissoryNotes.each {
				items ->
					def pnItems = arPromissoryItemServices.findOne(UUID.fromString(items['id']))
					updateFromMap(pnItems, items)
					BigDecimal pnItemsTotalPayments = pnItems?.totalPayment ?: 0.00

					if(paymentTracker.receiptType == ReceiptType.OR) {
						pnItems.totalPayment = pnItemsTotalPayments + pnItems.amountToApply
						arPromissoryItemServices.save(pnItems)
					}

					if (!promissoryMap[pnItems.promissory.id])
						promissoryMap[pnItems.promissory.id] = [:]

					if(pnItems.pnItemType.equalsIgnoreCase('PF')) {
						if (!promissoryMap[pnItems.promissory.id]['PF'])
							promissoryMap[pnItems.promissory.id]['PF'] = pnItems.amountToApply
						else
							promissoryMap[pnItems.promissory.id]['PF'] += pnItems.amountToApply
					}
					else {
						if (!promissoryMap[pnItems.promissory.id]['HCI'])
							promissoryMap[pnItems.promissory.id]['HCI'] = pnItems.amountToApply
						else
							promissoryMap[pnItems.promissory.id]['HCI'] += pnItems.amountToApply
					}

					def paymentPostingItem = new ARPaymentPostingItems()
					paymentPostingItem.recordNo = generatorService?.getNextValue(GeneratorType.AR_PAYMENT_POSTING_ITEMS, { i -> StringUtils.leftPad(i.toString(), 6, "0") })
					paymentPostingItem.orNumber = paymentTracker.orNumber
					paymentPostingItem.paymentTrackerId = paymentTracker.id
					paymentPostingItem.paymentDatetime = paymentTracker.createdDate
					paymentPostingItem.payment_method = paymentMethod
					paymentPostingItem.pnItemId = pnItems.id
					paymentPostingItem.pnId = pnItems.promissory.id
					paymentPostingItem.pnNo = pnItems.promissory.pnNo
					paymentPostingItem.itemType = pnItems.pnItemType
					paymentPostingItem.itemName = pnItems.description
					paymentPostingItem.invoiceDueDate = pnItems.promissory.pnDueDate


					paymentPostingItem.patientId = pnItems.promissory.patientId
					paymentPostingItem.patientName = pnItems.promissory.patientName
					paymentPostingItem.customerId = pnItems.arCustomer.id
					paymentPostingItem.customerName = pnItems.arCustomer.customerName
					paymentPostingItem.totalAmountDue = pnItems.totalAmount

					if(pnItems.totalAmount == pnItems.amountToApply && pnItems.pnItemType.equalsIgnoreCase('HCI')) {
						paymentPostingItem.appliedDiscount = paymentPostingItemService.calculateARCustomerDiscount(
								pnItems.arCustomer.id, pnItems.totalAmount, paymentTracker.createdDate, pnItems.promissory.pnDueDate
						) ?: 0.00
						if (!promissoryMap[pnItems.promissory.id]['DISC'])
							promissoryMap[pnItems.promissory.id]['DISC'] = paymentPostingItem.appliedDiscount
						else
							promissoryMap[pnItems.promissory.id]['DISC'] += paymentPostingItem.appliedDiscount
					}
					paymentPostingItem.amountPaid = pnItems.amountToApply
					def newPaymentItem = paymentPostingItemService.save(paymentPostingItem)

					if (!postingItems[pnItems.promissory.id])
						postingItems[pnItems.promissory.id] = []
					postingItems[pnItems.promissory.id].push(newPaymentItem)

			}

			promissoryMap.each {
				key, value ->
					def pn = arPromissoryServices.findOne(key)
					BigDecimal hci = value['HCI']?:0.00 as BigDecimal
					BigDecimal pf = value['PF']?:0.00 as BigDecimal
					BigDecimal discount = value['DISC']?:0.00 as BigDecimal
					BigDecimal pnTotalPayments = pn?.totalPayments?:0.00

					if(paymentTracker.receiptType == ReceiptType.OR) {
						pn.totalPayments = pnTotalPayments + hci + pf
						if(pn.netTotalAmount == 0)
							pn.status = 'PAID'
						else {
							if(pn.netTotalAmount > 0)
								pn.status = 'PARTIALLY_PAID'
						}
						arPromissoryServices.save(pn)
					}

					def paymentPosting = new ARPaymentPosting()
					def formatter = DateTimeFormatter.ofPattern("yyyy")
					String year = paymentTracker.createdDate.atZone(ZoneId.systemDefault()).format(formatter)
					paymentPosting.recordNo = generatorService.getNextGeneratorFeatPrefix("ar_payment_${year}") {
						it -> return "ARP${year}-${StringUtils.leftPad(it.toString(), 6, "0")}"
					}
					paymentPosting.transactionType = transactionType
					paymentPosting.receiptType = paymentTracker.receiptType
					paymentPosting.customerName = paymentTracker.payorName
					paymentPosting.arCustomerId = paymentTracker.arCustomerId
					paymentPosting.paymentDatetime = paymentTracker.createdDate
					paymentPosting.orNumber = paymentTracker.orNumber
					paymentPosting.paymentTrackerId = paymentTracker.id
					paymentPosting.pnId = pn.id
					paymentPosting.hospitalAmount = hci
					paymentPosting.pfAmount = pf
					paymentPosting.paymentAmount = hci + pf
					paymentPosting.discountAmount = discount
					paymentPosting.paymentMethod = paymentMethod
					paymentPosting.status = 'POSTED'
					def newPayment = save(paymentPosting)
					if(postingItems[key]){
						postingItems[key].each {
							it.arPaymentPosting = newPayment
							paymentPostingItemService.save(it)
						}
					}

					if(paymentTracker.receiptType == ReceiptType.OR) {
						arTransactionLedgerServices.insertArPaymentTransactionLedger(paymentTracker,newPayment)
					}
			}

	}

	void processVoidInvoicePayment(UUID id, BigDecimal amount){
		def invoice = arInvoiceServices.findOne(id)
		if(invoice?.totalPayments > 0) {
			invoice.totalPayments = invoice.totalPayments - amount
			if(invoice.status == 'PAID'){
				if(invoice.totalAmount == invoice.netTotalAmount)
					invoice.status = 'PENDING'
				else
					invoice.status = 'PARTIALLY_PAID'
			}
			arInvoiceServices.save(invoice)
		}
	}

	void processVoidInvoiceItemPayment(UUID id, BigDecimal amount){
		def invoice = arInvoiceItemServices.findOne(id)
		if(invoice?.totalPayments > 0) {
			invoice.totalPayments = invoice.totalPayments - amount
			arInvoiceItemServices.save(invoice)
		}
	}

	void processVoidPNPayment(UUID id, BigDecimal amount){
		def pn = arPromissoryServices.findOne(id)
		if(pn?.totalPayments > 0) {
			pn.totalPayments = pn.totalPayments - amount
			if(pn.status == 'PAID'){
				if(pn.totalAmountDue == pn.netTotalAmount)
					pn.status = 'PENDING'
				else
					pn.status = 'PARTIALLY_PAID'
			}
			arPromissoryServices.save(pn)
		}
	}

	void processVoidPNItemPayment(UUID id, BigDecimal amount){
		def pn = arPromissoryItemServices.findOne(id)
		if(pn?.totalPayment > 0) {
			pn.totalPayment = pn.totalPayment - amount
			arPromissoryItemServices.save(pn)
		}
	}

	@Transactional
	void processVoidPaymentPosting(UUID id) {
		def payments = findOne(id)
		if(payments.invoiceId){
			processVoidInvoicePayment(payments.invoiceId, payments.paymentAmount)
		}
		if(payments.pnId && payments.receiptType.equalsIgnoreCase('OR')){
			processVoidPNPayment(payments.pnId, payments.paymentAmount)
		}

		def paymentsItem = paymentPostingItemService.findAllPaymentPostingItemByPaymentPostingId(id)
		paymentsItem.each {
			if(it.invoiceItemId){
				processVoidInvoiceItemPayment(it.invoiceItemId, it.amountPaid)
			}
			if(it.pnItemId && payments.receiptType.equalsIgnoreCase('OR')){
				processVoidPNItemPayment(it.pnItemId, it.amountPaid)
			}
		}

		payments.status = 'VOIDED'
		save(payments)
	}
}
