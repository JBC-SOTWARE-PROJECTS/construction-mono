package com.backend.gbp.graphqlservices.payroll

import com.backend.gbp.domain.payroll.Payroll
import com.backend.gbp.domain.payroll.PayrollContribution
import com.backend.gbp.domain.payroll.PayrollEmployee
import com.backend.gbp.domain.payroll.PayrollEmployeeContribution
import com.backend.gbp.domain.payroll.PayrollContribution
import com.backend.gbp.domain.payroll.enums.AccountingEntryType
import com.backend.gbp.domain.payroll.enums.PayrollStatus
import com.backend.gbp.graphqlservices.payroll.enums.ContributionTypes
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.payroll.PayrollContributionRepository
import com.backend.gbp.repository.payroll.PayrollEmployeeContributionRepository
import com.backend.gbp.repository.payroll.PayrollRepository
import com.backend.gbp.security.SecurityUtils
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

import javax.persistence.EntityManager
import javax.persistence.PersistenceContext

@TypeChecked
@Component
@GraphQLApi
@Transactional(rollbackFor = Exception.class)
class PayrollContributionsService implements IPayrollModuleBaseOperations<PayrollContribution> {


    @Autowired
    PayrollRepository payrollRepository

    @Autowired
    PayrollContributionRepository payrollContributionRepository

    @Autowired
    PayrollEmployeeContributionRepository payrollEmployeeContributionRepository

    @Autowired
    PayrollEmployeeContributionService payrollEmployeeContributionService


    @Autowired
    ObjectMapper objectMapper

    @PersistenceContext
    EntityManager entityManager

    private PayrollContribution contribution;


    //=================================QUERY=================================\\

    @GraphQLQuery(name = "getContributionByPayrollId", description = "Get contribution by ID")
    GraphQLResVal<PayrollContribution> getContributionByPayrollId(@GraphQLArgument(name = "id") UUID id) {
        if (id) {
            return new GraphQLResVal<PayrollContribution>(payrollContributionRepository.findByPayrollId(id).get(), true, "Successfully fetched payroll contribution module")
        } else {
            return new GraphQLResVal<PayrollContribution>(null, true, "No payroll id provided")

        }

    }


    //=================================QUERY=================================\\


    //================================MUTATION================================\\


    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation
    GraphQLResVal<String> updatePayrollContributionStatus(
            @GraphQLArgument(name = "payrollId") UUID payrollId,
            @GraphQLArgument(name = "status") PayrollStatus status

    ) {
        PayrollContribution payrollContribution = payrollContributionRepository.findByPayrollId(payrollId).get()

        if (status == PayrollStatus.FINALIZED) {
            Map<String, SubAccountBreakdownDto> breakdownMap = new HashMap<>()
            payrollContribution.contributionEmployees.each {
                generateBreakdown(it.sssEE + it.sssWispEE, 'SSS EE', '217-01-0000', breakdownMap)
                generateBreakdown(it.sssER + it.sssWispER, 'SSS ER', '211-03-0000', breakdownMap)
                generateBreakdown(it.phicEE, 'PHIC EE', '217-03-0000', breakdownMap)
                generateBreakdown(it.phicER, 'PHIC ER', '211-05-0000', breakdownMap)
                generateBreakdown(it.hdmfEE, 'HDMF EE', '217-02-0000', breakdownMap)
                generateBreakdown(it.hdmfER, 'HDMF ER', '211-04-0000', breakdownMap)
            }

            payrollContribution.totalsBreakdown = []
            breakdownMap.keySet().each {
                SubAccountBreakdownDto deduction = breakdownMap.get(it.toString())
                payrollContribution.totalsBreakdown.push(deduction)
            }

        }

        payrollContribution.status = status
        payrollContributionRepository.save(payrollContribution)
        return new GraphQLResVal<String>(null, true, "Successfully updated Payroll Contribution status.")
    }

    private static void generateBreakdown(BigDecimal amount,
                                          String description, String subAccountCode,
                                          HashMap<String, SubAccountBreakdownDto> breakdownMap) {
        SubAccountBreakdownDto breakdown = breakdownMap.get(subAccountCode)
        if (!breakdown) breakdown = new SubAccountBreakdownDto()
        breakdown.description = description
        breakdown.entryType = AccountingEntryType.CREDIT
        breakdown.amount += amount
        breakdown.subaccountCode = subAccountCode
        breakdownMap.put(subAccountCode, breakdown)
    }

    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation
    GraphQLResVal<PayrollContribution> updateContributionTypeStatus(
            @GraphQLArgument(name = "payrollId") UUID payrollId,
            @GraphQLArgument(name = "contributionType") ContributionTypes contributionType

    ) {
        PayrollContribution contribution = payrollContributionRepository.findByPayrollId(payrollId).get()
        switch (contributionType) {
            case ContributionTypes.SSS:
                contribution.isActiveSSS = !contribution.isActiveSSS
                break;
            case ContributionTypes.PHIC:
                contribution.isActivePHIC = !contribution.isActivePHIC
                break;
            case ContributionTypes.HDMF:
                contribution.isActiveHDMF = !contribution.isActiveHDMF
                break;
        }
        payrollContributionRepository.save(contribution)
        calculateAllContributions(payrollId)
        return new GraphQLResVal<PayrollContribution>(contribution, true, "Successfully updated contribution")

    }


    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation
    GraphQLResVal<PayrollContribution> calculateAllContributions(
            @GraphQLArgument(name = "id") UUID id
    ) {
        Payroll payroll = payrollRepository.findById(id).get()
        payrollEmployeeContributionService.recalculateAllEmployee(payroll)
        return new GraphQLResVal<PayrollContribution>(payroll.contribution, true, "Successfully updated contribution")

    }


    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation
    GraphQLRetVal<String> calculateOneContributionEmployee(
            @GraphQLArgument(name = "id") UUID id
    ) {
        PayrollEmployeeContribution payrollEmployeeContribution = payrollEmployeeContributionRepository.findById(id).get()
        Payroll payroll = payrollEmployeeContribution.payrollEmployee.payroll
        PayrollEmployee payrollEmployee = payrollEmployeeContribution.payrollEmployee
        payrollEmployeeContributionService.recalculateEmployee(payrollEmployee, payroll)
        return new GraphQLRetVal<String>(null, true, "Successfully recalculated contribution employee.")
    }


//===================================================== INTERFACE METHODS ==============================================

    @Override
    PayrollContribution startPayroll(Payroll payroll) {
        PayrollContribution contribution = new PayrollContribution();
        contribution.payroll = payroll
        contribution.status = PayrollStatus.DRAFT
        contribution.company = SecurityUtils.currentCompany()
        contribution = payrollContributionRepository.save(contribution)

        payroll.contribution = contribution
        payrollEmployeeContributionService.addEmployees(payroll.payrollEmployees, payroll)
        return contribution

    }

    @Override
    void finalizePayroll(Payroll payroll) {

    }

}






