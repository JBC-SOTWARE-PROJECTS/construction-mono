package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.AccountsPayable
import com.backend.gbp.domain.accounting.AccountsPayableDetails
import com.backend.gbp.domain.inventory.ReceivingReport
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.repository.OfficeRepository
import com.backend.gbp.rest.dto.payables.AccountPayableDetialsDto
import com.backend.gbp.services.GeneratorService
import com.fasterxml.jackson.databind.ObjectMapper
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

import java.math.RoundingMode

@Service
@GraphQLApi
class AccountsPayableDetialServices extends AbstractDaoService<AccountsPayableDetails> {

    @Autowired
    GeneratorService generatorService

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    ApTransactionServices apTransactionServices

    @Autowired
    OfficeRepository officeRepository

    @Autowired
    AccountsPayableServices accountsPayableServices



    AccountsPayableDetialServices() {
        super(AccountsPayableDetails.class)
    }

    @GraphQLQuery(name = "apDetailsById")
    AccountsPayableDetails apDetailsById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        findOne(id)
    }

    @GraphQLQuery(name = "detailsByAp", description = "Find Ap posted")
    List<AccountsPayableDetails> detailsByAp(@GraphQLArgument(name = "id") UUID id) {
        createQuery("Select ap from AccountsPayableDetails ap where ap.accountsPayable.id = :id", ["id": id]).resultList
    }

    //mutations
    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation(name = "upsertPayablesDetails")
    AccountsPayableDetails upsertPayablesDetails(
            @GraphQLArgument(name = "it") AccountPayableDetialsDto it,
            @GraphQLArgument(name = "ap") AccountsPayable ap,
            @GraphQLArgument(name = "trans") UUID trans,
            @GraphQLArgument(name = "dep") UUID dep
    ) {
        AccountsPayableDetails upsert = new AccountsPayableDetails()
        if (!it.isNew) {
            upsert = findOne(UUID.fromString(it.id))
        }
        upsert.accountsPayable = ap
        if (trans) {
            upsert.transType = apTransactionServices.apTransactionById(trans)
        }
        if (dep) {
            upsert.department = departmentRepository.findById(dep).get()
        }
        upsert.amount = it.amount
        upsert.discRate = it.discRate
        upsert.discAmount = it.discAmount
        upsert.vatInclusive = it.vatInclusive
        upsert.vatAmount = it.vatAmount
        upsert.taxDesc = it.taxDesc
        upsert.ewtRate = it.ewtRate
        upsert.ewtAmount = it.ewtAmount
        upsert.netAmount = it.netAmount
        upsert.remarksNotes = it.remarksNotes
        upsert.refNo = it.refNo
        //upsert.source = "ap"
        save(upsert)
    }

    //mutations
    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation(name = "upsertPayablesDetailsByRec")
    AccountsPayableDetails upsertPayablesDetailsByRec(
            @GraphQLArgument(name = "it") ReceivingReport it,
            @GraphQLArgument(name = "ap") AccountsPayable ap
    ) {
        AccountsPayableDetails upsert = new AccountsPayableDetails()
        //disc rate
        def grossAmount = it.grossAmount.setScale(2, RoundingMode.HALF_EVEN)
        def discountAmount = it.totalDiscount.setScale(2, RoundingMode.HALF_EVEN)
        def netOfDiscount = it.netDiscount.setScale(2, RoundingMode.HALF_EVEN)
        def vatAmount = it.inputTax.setScale(2, RoundingMode.HALF_EVEN)
        def amount = it.amount.setScale(2, RoundingMode.HALF_EVEN)

        def s_price = amount - discountAmount;
        def discountRate = ((amount - s_price) / amount) * 100;
        upsert.accountsPayable = ap
        upsert.department = it.receiveDepartment
        upsert.amount = grossAmount
        upsert.discRate = discountRate
        upsert.discAmount = discountAmount
        upsert.vatInclusive = it.vatInclusive
        upsert.vatAmount = vatAmount
        upsert.ewtRate = 0
        upsert.ewtAmount = 0
        upsert.netAmount = it.vatInclusive ? amount : netOfDiscount
        upsert.refId = it.id
        upsert.refNo = it.receivedRefNo
        upsert.source = "rec"
        save(upsert)
    }

    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation(name = "upsertPayablesDetailsByInvestor")
    AccountsPayableDetails upsertPayablesDetailsByInvestor(
            @GraphQLArgument(name = "unallocated") BigDecimal unallocated,
            @GraphQLArgument(name = "refId") UUID refId,
            @GraphQLArgument(name = "refNo") String refNo,
            @GraphQLArgument(name = "ap") AccountsPayable ap
    ) {
        AccountsPayableDetails upsert = new AccountsPayableDetails()

        upsert.accountsPayable = ap
        upsert.department = null
        upsert.amount = unallocated
        upsert.discRate = BigDecimal.ZERO
        upsert.discAmount = BigDecimal.ZERO
        upsert.vatInclusive = true
        upsert.vatAmount = BigDecimal.ZERO
        upsert.ewtRate = 0
        upsert.ewtAmount = 0
        upsert.netAmount = unallocated
        upsert.refId = refId
        upsert.refNo = refNo
//        upsert.refId = payment.id
//        upsert.refNo = "${payment.receiptType} # "+ payment.ornumber
        upsert.source = "investor"
        save(upsert)
    }

    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation(name = "removeApDetails")
    AccountsPayableDetails removeApDetails(
            @GraphQLArgument(name = "id") UUID id
    ) {
        def details = findOne(id)
        //update billing
        if (details.refId) {
            if (details.source.equalsIgnoreCase("pfNonCompany") || details.source.equalsIgnoreCase("rf")) {
                billingItemServices.updatePfProcess(details.refId, false)
            } else if (details.source.equalsIgnoreCase("pfCompany")) {
                accountReceivableItemsServices.updateApProcess(details.refId, false)
            }

        }
        if(details.accountsPayable?.id){
            accountsPayableServices.updatePayableForRemove(
                    details.accountsPayable?.id,
                    details.amount,
                    details.discAmount,
                    details.vatAmount,
                    details.ewtAmount,
                    details.netAmount
            )
        }
        delete(details)

        return details
    }


    //calculate
    static BigDecimal calculateVat(Boolean vatInclusive,
                                   BigDecimal amount,
                                   BigDecimal vatRate) {

        def vat = (amount) / (vatRate + 1)

        def vatAmount = vatInclusive ?
                vat * vatRate :
                (amount) * vatRate

        return vatAmount.round(2)
    }

    static calculateEwt(Boolean vatInclusive, BigDecimal amount, BigDecimal vatRate, BigDecimal ewtRate) {
        def netOfdiscount = amount;
        def ewt = 0;
        def vat = netOfdiscount / (vatRate + 1)
        if (vatRate <= 0) {
            ewt = netOfdiscount * ewtRate;
        } else {
            ewt = vatInclusive ?
                    vat * ewtRate :
                    netOfdiscount * ewtRate;
        }

        return ewt.round(2)
    }
}
