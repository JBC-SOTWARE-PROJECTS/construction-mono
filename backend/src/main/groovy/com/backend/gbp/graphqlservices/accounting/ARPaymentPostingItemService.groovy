package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.ARPaymentPostingItems
import com.backend.gbp.domain.accounting.ArCustomers
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.services.EntityObjectMapperService
import com.backend.gbp.services.GeneratorService
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component

import javax.transaction.Transactional
import java.time.Instant
import java.time.ZoneId
import java.time.temporal.ChronoUnit

@Component
@GraphQLApi
@Transactional(rollbackOn = Exception.class)
class ARPaymentPostingItemService extends AbstractDaoService<ARPaymentPostingItems> {

	ARPaymentPostingItemService() {
		super(ARPaymentPostingItems.class)
	}

	@Autowired
	EntityObjectMapperService entityObjectMapperService

	@Autowired
	GeneratorService generatorService

	@Autowired
	ArCustomerServices customerServices

	BigDecimal calculateARCustomerDiscount(UUID customerId, BigDecimal baseAmount, Instant datePaid, Date dueDate){
		BigDecimal discountAmount = 0.00
		ArCustomers arCustomers = customerServices.findOne(customerId)
		def datePaidLocal = datePaid.atZone(ZoneId.of("UTC")).toLocalDate()
		def dueDateLocal = dueDate.toInstant().atZone(ZoneId.of("UTC")).toLocalDate()
		def daysDifference = ChronoUnit.DAYS.between(dueDateLocal, datePaidLocal)
		if(arCustomers?.discountAndPenalties){
			if(arCustomers.discountAndPenalties?.autoDiscountInPayment){
				def paymentDiscounts = arCustomers.discountAndPenalties.paymentDiscounts.sort{it.maximumDays}
				for (discount in paymentDiscounts) {
					if(daysDifference <= discount.maximumDays) {
						discountAmount = (discount.rate / 100.0) * baseAmount
						break
					}
				}
			}
		}
		return discountAmount
	}

	@Transactional
	@GraphQLMutation(name='upsertTableARPaymentPostingItem')
	GraphQLResVal<ARPaymentPostingItems> upsertTableARPaymentPostingItem(
			@GraphQLArgument(name='id') UUID id,
			@GraphQLArgument(name='fields') Map<String,Object> fields
	){
		try {
			def paymentItem = upsertFromMap(id, fields,{
				it , forInsert ->
					if(forInsert){
						it.recordNo = generatorService?.getNextValue(GeneratorType.AR_PAYMENT_POSTING_ITEMS, { i -> StringUtils.leftPad(i.toString(), 6, "0") })
					}
					else {
						if(it.amountPaid == it.totalAmountDue){
					  		it.appliedDiscount = calculateARCustomerDiscount(it.customerId,it.totalAmountDue,it.arPaymentPosting.paymentDatetime,it.invoiceDueDate) ?: 0.00
						}
						else {
							it.appliedDiscount = 0
						}
					}
			})

			String message = "Successfully added."
			if(id)
				message = "Successfully updated."
			return new GraphQLResVal<ARPaymentPostingItems>(paymentItem, true, message)
		}catch (Exception e){
			throw new GraphQLResVal<ARPaymentPostingItems>(null,false,e.message) as Throwable
		}
	}


	@GraphQLQuery(name='findOneARPaymentPostingItems')
	ARPaymentPostingItems findOneARPaymentPostingItems(
			@GraphQLArgument(name='id') UUID id
	){
		if(!id)
			return null
		return findOne(id)
	}

	@GraphQLQuery(name="findAllPaymentPostingItemByPaymentPostingId")
	List<ARPaymentPostingItems> findAllPaymentPostingItemByPaymentPostingId(
			@GraphQLArgument(name = "paymentPostingId") UUID paymentPostingId
	){
		if(paymentPostingId) {
			Map<String, Object> params = [:]
			params['paymentPostingId'] = paymentPostingId

			createQuery(
					""" Select c from ARPaymentPostingItems c where c.arPaymentPosting.id = :paymentPostingId order by c.recordNo desc""",
					params
			).resultList ?: []
		}
		else []
	}

	@GraphQLQuery(name="findAllPaymentPostingItemDiscByPaymentPostingId")
	List<ARPaymentPostingItems> findAllPaymentPostingItemDiscByPaymentPostingId(
			@GraphQLArgument(name = "paymentPostingId") UUID paymentPostingId
	){
		if(paymentPostingId) {
			Map<String, Object> params = [:]
			params['paymentPostingId'] = paymentPostingId

			createQuery(
					""" Select c from ARPaymentPostingItems c where c.arPaymentPosting.id = :paymentPostingId and c.appliedDiscount > 0 order by c.recordNo desc""",
					params
			).resultList ?: []
		}
		else []
	}

	@GraphQLMutation(name='removePaymentPostingItem')
	Boolean removePaymentPostingItem (
			@GraphQLArgument(name = "id") UUID id
	){
		deleteById(id)
		return  true
	}

}
