package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.AccountsPayable
import com.backend.gbp.domain.accounting.AccountsPayableDetails
import com.backend.gbp.domain.inventory.ReceivingReport
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.repository.OfficeRepository
import com.backend.gbp.repository.asset.AssetsRepository
import com.backend.gbp.repository.projects.ProjectsRepository
import com.backend.gbp.rest.dto.payables.AccountPayableDetialsDto
import com.backend.gbp.security.SecurityUtils
import com.backend.gbp.services.GeneratorService
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.Canonical
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

import java.math.RoundingMode
import java.time.Instant

@Canonical
class ProjectPayableBreakdown {
    UUID payableId
    String apNo
    Instant apvDate
    String invoiceNo
    String supplierName
    String status
    BigDecimal netAmount
    Long lineCount
}

@Canonical
class ProjectPayableItem {
    UUID detailId
    String transactionTypeDescription
    BigDecimal amount
    BigDecimal discAmount
    BigDecimal vatAmount
    BigDecimal ewtAmount
    BigDecimal netAmount
    String refNo
    String remarksNotes
}

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

    @Autowired
    ProjectsRepository projectsRepository

    @Autowired
    AssetsRepository assetsRepository


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

    @GraphQLQuery(name = "projectPayableBreakdown", description = "Posted payable amounts for a project and transaction type")
    @Transactional(readOnly = true)
    List<ProjectPayableBreakdown> projectPayableBreakdown(
            @GraphQLArgument(name = "projectId") UUID projectId,
            @GraphQLArgument(name = "transactionTypeId") UUID transactionTypeId
    ) {
        if (!isProjectInCurrentCompany(projectId)) {
            return []
        }

        String query = '''
            SELECT detail
            FROM AccountsPayableDetails detail
            JOIN FETCH detail.accountsPayable payable
            LEFT JOIN FETCH payable.supplier
            WHERE detail.project.id = :projectId
              AND payable.posted = true
        '''

        Map<String, Object> params = [projectId: projectId]

        if (transactionTypeId) {
            query += ' AND detail.transType.id = :transactionTypeId'
            params.transactionTypeId = transactionTypeId
        }

        query += ' ORDER BY payable.apvDate DESC, payable.apNo ASC'

        List<AccountsPayableDetails> details = createQuery(query, params).resultList
        return details.groupBy { it.accountsPayable.id }.collect { UUID payableId, List<AccountsPayableDetails> payableDetails ->
            AccountsPayable payable = payableDetails.first().accountsPayable
            BigDecimal netAmount = payableDetails.inject(BigDecimal.ZERO) { total, detail ->
                total + (detail.netAmount ?: BigDecimal.ZERO)
            }

            new ProjectPayableBreakdown(
                    payableId,
                    payable.apNo,
                    payable.apvDate,
                    payable.invoiceNo,
                    payable.supplier?.supplierFullname,
                    payable.status,
                    netAmount,
                    payableDetails.size() as Long
            )
        }
    }

    @GraphQLQuery(name = "projectPayableItems", description = "Posted payable detail items for a project, transaction type, and payable")
    @Transactional(readOnly = true)
    List<ProjectPayableItem> projectPayableItems(
            @GraphQLArgument(name = "projectId") UUID projectId,
            @GraphQLArgument(name = "payableId") UUID payableId,
            @GraphQLArgument(name = "transactionTypeId") UUID transactionTypeId
    ) {
        if (!payableId || !isProjectInCurrentCompany(projectId)) {
            return []
        }

        String query = '''
            SELECT detail
            FROM AccountsPayableDetails detail
            JOIN FETCH detail.accountsPayable payable
            LEFT JOIN FETCH detail.transType
            WHERE detail.project.id = :projectId
              AND payable.id = :payableId
              AND payable.posted = true
        '''

        Map<String, Object> params = [projectId: projectId, payableId: payableId]

        if (transactionTypeId) {
            query += ' AND detail.transType.id = :transactionTypeId'
            params.transactionTypeId = transactionTypeId
        }

        query += ' ORDER BY detail.id ASC'
        List<AccountsPayableDetails> details = createQuery(query, params).resultList
        return details.collect { detail ->
            new ProjectPayableItem(
                    detail.id,
                    detail.transType?.description,
                    detail.amount,
                    detail.discAmount,
                    detail.vatAmount,
                    detail.ewtAmount,
                    detail.netAmount,
                    detail.refNo,
                    detail.remarksNotes
            )
        }
    }

    private boolean isProjectInCurrentCompany(UUID projectId) {
        if (!projectId) {
            return false
        }

        def project = projectsRepository.findById(projectId).orElse(null)
        UUID companyId = SecurityUtils.currentCompanyId()
        return project && (!companyId || project.company == companyId)
    }

    //mutations
    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation(name = "upsertPayablesDetails")
    AccountsPayableDetails upsertPayablesDetails(
            @GraphQLArgument(name = "it") AccountPayableDetialsDto it,
            @GraphQLArgument(name = "ap") AccountsPayable ap,
            @GraphQLArgument(name = "trans") UUID trans,
            @GraphQLArgument(name = "office") UUID office,
            @GraphQLArgument(name = "project") UUID project,
            @GraphQLArgument(name = "assets") UUID assets
    ) {
        AccountsPayableDetails upsert = new AccountsPayableDetails()
        if (!it.isNew) {
            upsert = findOne(UUID.fromString(it.id))
        }
        upsert.accountsPayable = ap
        if (trans) {
            upsert.transType = apTransactionServices.apTransactionById(trans)
        }
        upsert.office = null
        if (office) {
            upsert.office = officeRepository.findById(office).get()
        }
        upsert.project = null
        if (project) {
            upsert.project = projectsRepository.findById(project).get()
        }
        upsert.assets = null
        if (assets) {
            upsert.assets = assetsRepository.findById(assets).get()
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
        upsert.office = it.receivedOffice
        upsert.project = it.project
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
    @GraphQLMutation(name = "removeApDetails")
    AccountsPayableDetails removeApDetails(
            @GraphQLArgument(name = "id") UUID id
    ) {
        def details = findOne(id)
        //update billing

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
        def vatAmount = BigDecimal.ZERO
        if(vatInclusive){
            vatAmount = (amount / (vatRate + 1)) * vatRate
        }else{
            if(vatRate){
                vatAmount = amount * vatRate
            }
        }
        return vatAmount.setScale(2, RoundingMode.HALF_EVEN)
    }

    static calculateEwt(Boolean vatInclusive, BigDecimal amount, BigDecimal vatRate, BigDecimal ewtRate) {
        def netOfdiscount = amount;
        BigDecimal ewt = BigDecimal.ZERO;
        if (vatRate <= 0) {
            ewt = netOfdiscount * ewtRate;
        } else {
            if(vatInclusive){
                ewt = (netOfdiscount / (vatRate + 1)) * ewtRate
            }else{
                ewt = netOfdiscount * ewtRate
            }
        }
        return ewt.setScale(2, RoundingMode.HALF_EVEN)
    }
}
