package com.backend.gbp.graphqlservices.billing

import com.backend.gbp.domain.User
import com.backend.gbp.domain.billing.Billing
import com.backend.gbp.domain.billing.Job
import com.backend.gbp.domain.billing.JobItems
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.projects.Projects
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.inventory.InventoryLedgerService
import com.backend.gbp.graphqlservices.projects.ProjectCostService
import com.backend.gbp.graphqlservices.projects.ProjectService
import com.backend.gbp.repository.OfficeRepository
import com.backend.gbp.repository.UserRepository
import com.backend.gbp.repository.billing.BillingItemRepository
import com.backend.gbp.repository.billing.DiscountDetailsRepository
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.rest.InventoryResource
import com.backend.gbp.rest.dto.SalesChartsDto
import com.backend.gbp.rest.dto.SalesReportDto
import com.backend.gbp.security.SecurityUtils
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.GeneratorType
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLContext
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.stereotype.Component

import javax.transaction.Transactional
import java.time.Duration
import java.time.Instant

@Component
@GraphQLApi
@TypeChecked
class BillingService extends AbstractDaoService<Billing> {

    BillingService() {
        super(Billing.class)
    }

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    GeneratorService generatorService

    @Autowired
    JobItemService jobItemService

    @Autowired
    JobService jobService

    @Autowired
    OfficeRepository officeRepository

    @Autowired
    BillingItemService billingItemService

    @Autowired
    InventoryLedgerService inventoryLedgerService

    @Autowired
    UserRepository userRepository

    @Autowired
    EmployeeRepository employeeRepository

    @Autowired
    DiscountDetailsRepository discountDetailsRepository

    @Autowired
    BillingItemRepository billingItemRepository

    @Autowired
    ProjectService projectService

    @Autowired
    InventoryResource inventoryResource

    @Autowired
    ProjectCostService projectCostService

    @GraphQLQuery(name = "billingById")
    Billing billingById(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            findOne(id)
        }else{
            null
        }
    }

    @GraphQLQuery(name = "billingByProject")
    Billing billingByProject(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if(id){
            String query = '''select q from Billing q where q.project.id = :id AND q.status = true'''
            Map<String, Object> params = new HashMap<>()
            params.put('id', id)
            createQuery(query, params).resultList.first()
        }else{
            null
        }
    }

    @GraphQLQuery(name = "balance", description = "balance")
    BigDecimal balance(@GraphQLContext Billing billing) {
        return billingItemService.getBalance(billing.id)
    }

    @GraphQLQuery(name = "totals", description = "totals")
    BigDecimal totals(@GraphQLContext Billing billing) {
        List<String> types = ['ITEM', 'SERVICE', 'MISC']
        return billingItemService.getAmounts(billing.id, types)
    }

    @GraphQLQuery(name = "deductions", description = "deductions")
    BigDecimal deductions(@GraphQLContext Billing billing) {
        List<String> types = ['DEDUCTIONS']
        return billingItemService.getAmountsDeduct(billing.id, types)
    }

    @GraphQLQuery(name = "payments", description = "payments")
    BigDecimal payments(@GraphQLContext Billing billing) {
        List<String> types = ['PAYMENTS']
        return billingItemService.getAmountsDeduct(billing.id, types)
    }

    //get all billing total
    @GraphQLQuery(name = "totalBalances")
    BigDecimal totalBalances() {
        List<String> types = ['ITEM', 'SERVICE', 'MISC', 'DEDUCTIONS']
        def totals =  billingItemService.getAllAmounts(types) ?: BigDecimal.ZERO
        def payments = billingItemService.totalPayments() ?: BigDecimal.ZERO
        return totals - payments
    }



    @GraphQLQuery(name = "billingByFiltersPage")
	Page<Billing> billingByFiltersPage(
			@GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "status") Boolean status,
			@GraphQLArgument(name = "page") Integer page,
			@GraphQLArgument(name = "size") Integer size
	) {

		String query = '''select q from Billing q where  
           (lower(q.billNo) like lower(concat('%',:filter,'%')) OR 
           lower(q.customer.fullName) like lower(concat('%',:filter,'%')) OR
           lower(q.job.jobNo) like lower(concat('%',:filter,'%')) OR
           lower(q.job.description) like lower(concat('%',:filter,'%'))) 
           AND q.otcName is null'''

		String countQuery = '''Select count(q) from Billing q where  
           (lower(q.billNo) like lower(concat('%',:filter,'%')) OR 
           lower(q.customer.fullName) like lower(concat('%',:filter,'%')) OR
           lower(q.job.jobNo) like lower(concat('%',:filter,'%')) OR
           lower(q.job.description) like lower(concat('%',:filter,'%')))
           AND q.otcName is null'''

		Map<String, Object> params = new HashMap<>()
		params.put('filter', filter)

        if (status) {
            query += ''' and (q.status = :status)'''
            countQuery += ''' and (q.status = :status)'''
            params.put("status", status)
        }


		query += ''' ORDER BY q.billNo DESC'''

		Page<Billing> result = getPageable(query, countQuery, page, size, params)
		return result
	}

    @GraphQLQuery(name = "billingByFiltersPageProjects")
    Page<Billing> billingByFiltersPageProjects(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "status") Boolean status,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ) {

        String query = '''select q from Billing q where  
           (lower(q.billNo) like lower(concat('%',:filter,'%')) OR 
           lower(q.customer.fullName) like lower(concat('%',:filter,'%')) OR
           lower(q.project.projectCode) like lower(concat('%',:filter,'%')) OR
           lower(q.project.description) like lower(concat('%',:filter,'%'))) 
           AND q.otcName is null'''

        String countQuery = '''Select count(q) from Billing q where  
           (lower(q.billNo) like lower(concat('%',:filter,'%')) OR 
           lower(q.customer.fullName) like lower(concat('%',:filter,'%')) OR
           lower(q.project.projectCode) like lower(concat('%',:filter,'%')) OR
           lower(q.project.description) like lower(concat('%',:filter,'%')))
           AND q.otcName is null'''

        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)

        if (status) {
            query += ''' and (q.status = :status)'''
            countQuery += ''' and (q.status = :status)'''
            params.put("status", status)
        }


        query += ''' ORDER BY q.billNo DESC'''

        Page<Billing> result = getPageable(query, countQuery, page, size, params)
        return result
    }

    @GraphQLQuery(name = "billingOTCByFiltersPage")
    Page<Billing> billingOTCByFiltersPage(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "status") Boolean status,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ) {

        String query = '''select q from Billing q where  
           (lower(q.billNo) like lower(concat('%',:filter,'%')) OR 
           lower(q.otcName) like lower(concat('%',:filter,'%')))
           AND q.job is null'''

        String countQuery = '''Select count(q) from Billing q where  
           (lower(q.billNo) like lower(concat('%',:filter,'%')) OR 
           lower(q.otcName) like lower(concat('%',:filter,'%')))
           AND q.job is null'''

        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)

        if (status) {
            query += ''' and (q.status = :status)'''
            countQuery += ''' and (q.status = :status)'''
            params.put("status", status)
        }


        query += ''' ORDER BY q.billNo DESC'''

        Page<Billing> result = getPageable(query, countQuery, page, size, params)
        return result
    }

    @GraphQLQuery(name = "billingAllByFiltersPage")
    Page<Billing> billingAllByFiltersPage(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "status") Boolean status,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ) {

        String query = '''select q from Billing q where  
           (lower(q.billNo) like lower(concat('%',:filter,'%')) OR 
           lower(q.otcName) like lower(concat('%',:filter,'%')))'''

        String countQuery = '''Select count(q) from Billing q where  
           (lower(q.billNo) like lower(concat('%',:filter,'%')) OR 
           lower(q.otcName) like lower(concat('%',:filter,'%')))'''

        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)

        if (status) {
            query += ''' and (q.status = :status)'''
            countQuery += ''' and (q.status = :status)'''
            params.put("status", status)
        }


        query += ''' ORDER BY q.billNo DESC'''

        Page<Billing> result = getPageable(query, countQuery, page, size, params)
        return result
    }

    // ============== Mutation =======================//
    @Transactional
    @GraphQLMutation(name = "pushToBill")
    Billing pushToBill(
            @GraphQLArgument(name = "jobId") UUID jobId
    ) {
        Job job = jobService.jobById(jobId)
        List<JobItems> jobItems = jobItemService.jobItemByParent(jobId).sort { it.descriptions }
        Billing bill = new Billing()
        try {
            //add billing first
            bill.dateTrans = Instant.now()
            bill.billNo = generatorService.getNextValue(GeneratorType.BILLING_NO) { Long no ->
                StringUtils.leftPad(no.toString(), 6, "0")
            }
            bill.job = job
            bill.customer = job.customer
            bill.locked = false
            bill.status = true
            def billing = save(bill)

            //add billing items after save billing
            jobItems.each {
                def recordNo = generatorService.getNextValue(GeneratorType.REC_NO) { Long no ->
                    StringUtils.leftPad(no.toString(), 6, "0")
                }
                //save billing items
                billingItemService.upsertBillingItemByJob(it, recordNo, billing)

                //check if ITEM minus to inventory
                if(it.type.equalsIgnoreCase("ITEM")){
                    inventoryLedgerService.inventoryCharge(
                            job.office.id,
                            it.item.id,
                            recordNo,
                            'cs',
                            it.qty,
                            it.wcost
                    )
                }

                //update job items
               jobItemService.updateBilled(true, it.id)

            }
            //update job parent
            jobService.updateJobBilled(jobId)

        } catch (Exception e) {
            throw new Exception("Something was Wrong : " + e)
        }
        return bill
    }

    //push to bill project
    @Transactional
    @GraphQLMutation(name = "pushToBillProject")
    Billing pushToBillProject(
            @GraphQLArgument(name = "projectId") UUID projectId
    ) {
        def project = projectService.projectById(projectId)
        def costItems = projectCostService.pCostByList("", projectId).sort { it.description }
        Billing bill = new Billing()
        try {
            //add billing first
            bill.dateTrans = Instant.now()
            bill.billNo = generatorService.getNextValue(GeneratorType.BILLING_NO) { Long no ->
                StringUtils.leftPad(no.toString(), 6, "0")
            }
            bill.project = project
            bill.customer = project.customer
            bill.locked = false
            bill.status = true
            def billing = save(bill)

            //add billing items after save billing
            costItems.each {
                //save billing items
                billingItemService.upsertBillingItemByProject(it, billing)

            }

        } catch (Exception e) {
            throw new Exception("Something was Wrong : " + e)
        }
        return bill
    }


    @Transactional
    @GraphQLMutation(name = "lockBilling")
    Billing lockBilling(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "type") String type
    ) {
        User user = userRepository.findOneByLogin(SecurityUtils.currentLogin())
        Employee employee = employeeRepository.findOneByUser(user)

        Billing bill = findOne(id);
        if (type == "UNLOCKED") {
            bill.locked = false
            bill.lockedBy = employee.fullName
            save(bill)

            //cancelled deductions
            def deductions = billingItemService.billingItemByParentType("", id, ['DEDUCTIONS'])
            deductions.each {
                it ->
                    it.status = false
                    billingItemRepository.save(it)

                    //delete discount details
                    if(it.itemType == 'DEDUCTIONS'){
                        def todelete = discountDetailsRepository.getItemDiscountsByBillingItem(it.id)
                        todelete.each {
                            del ->
                                discountDetailsRepository.delete(del)
                        }
                    }
            }
        } else {
            bill.locked = true
            bill.lockedBy = employee.fullName
            save(bill)
        }
        return bill
    }

    //create billing from project
    @Transactional
    @GraphQLMutation(name = "createBillingProject")
    Billing createBillingProject(
            @GraphQLArgument(name = "project") Projects project
    ) {

        Billing bill = new Billing()
        try {
            //add billing first
            bill.dateTrans = Instant.now()
            bill.billNo = generatorService.getNextValue(GeneratorType.BILLING_NO) { Long no ->
                StringUtils.leftPad(no.toString(), 6, "0")
            }
            bill.project = project
            bill.customer = project.customer
            bill.locked = false
            bill.status = true
            save(bill)

        } catch (Exception e) {
            throw new Exception("Something was Wrong : " + e)
        }
        return bill
    }

    //add OTC
    @Transactional
    @GraphQLMutation(name = "addOTC")
    Billing addOTC(
            @GraphQLArgument(name = "customer") String customer,
            @GraphQLArgument(name = "dateTrans") Instant dateTrans
    ) {
        Billing bill = new Billing()
        try {
            //add billing first
            bill.dateTrans = dateTrans
            bill.billNo = generatorService.getNextValue(GeneratorType.BILLING_NO) { Long no ->
                StringUtils.leftPad(no.toString(), 6, "0")
            }
            bill.otcName = customer
            bill.locked = false
            bill.status = true
            save(bill)

        } catch (Exception e) {
            throw new Exception("Something was Wrong : " + e)
        }
        return bill
    }

    @Transactional
    @GraphQLMutation(name = "closeBilling")
    Billing closeBilling(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "type") String type
    ) {

        Billing bill = findOne(id);
        bill.status = !type.equalsIgnoreCase("close")
        save(bill)
    }

    //billing reports
    //sales report
    @GraphQLQuery(name = "salesReport", description = "salesReport")
    List<SalesReportDto> salesReport(
            @GraphQLArgument(name = "start") String start,
            @GraphQLArgument(name = "end") String end,
            @GraphQLArgument(name = "filter") String filter
    ) {
        if(start && end){
            return inventoryResource.getSalesReport(start,end,filter)
        }else{
            return null
        }
    }

    @GraphQLQuery(name = "salesChartsGross", description = "salesCharts")
    SalesChartsDto salesReport(
            @GraphQLArgument(name = "date") String date
    ) {
        if(date){
            return inventoryResource.getSaleChartsGross(date)
        }else{
            return null
        }
    }

    @GraphQLQuery(name = "salesChartsDeduct", description = "salesCharts")
    SalesChartsDto salesChartsDeduct(
            @GraphQLArgument(name = "date") String date
    ) {
        if(date){
            return inventoryResource.getSaleChartsDeduct(date)
        }else{
            return null
        }
    }

    @GraphQLQuery(name = "salesChartsNet", description = "salesCharts")
    SalesChartsDto salesChartsNet(
            @GraphQLArgument(name = "date") String date
    ) {
        if(date){
            return inventoryResource.getSaleChartsNet(date)
        }else{
            return null
        }
    }

    @GraphQLQuery(name = "salesChartsRevenue", description = "salesCharts")
    SalesChartsDto salesChartsRevenue(
            @GraphQLArgument(name = "date") String date
    ) {
        if(date){
            return inventoryResource.getSaleChartsRevenue(date)
        }else{
            return null
        }
    }

    @GraphQLQuery(name = "salesChartsExpense", description = "salesCharts")
    SalesChartsDto salesChartsExpense(
            @GraphQLArgument(name = "date") String date
    ) {
        if(date){
            return inventoryResource.getSaleChartsExpense(date)
        }else{
            return null
        }
    }

    @GraphQLQuery(name = "salesChartsProfit", description = "salesCharts")
    SalesChartsDto salesChartsProfit(
            @GraphQLArgument(name = "date") String date
    ) {
        if(date){
            return inventoryResource.getSaleChartsProfit(date)
        }else{
            return null
        }
    }

    @GraphQLQuery(name = "totalGross", description = "totalGross")
    BigDecimal totalGross(
            @GraphQLArgument(name = "start") String start,
            @GraphQLArgument(name = "end") String end,
            @GraphQLArgument(name = "filter") String filter
    ) {
        if(start && end){
            return inventoryResource.total_gross(start,end,filter)
        }else{
            return null
        }

    }

    @GraphQLQuery(name = "totalDeduction", description = "totalDeduction")
    BigDecimal totalDeduction(
            @GraphQLArgument(name = "start") String start,
            @GraphQLArgument(name = "end") String end,
            @GraphQLArgument(name = "filter") String filter
    ) {
        if(start && end){
            return inventoryResource.total_discount(start,end,filter)
        }else{
            return null
        }

    }


    @GraphQLQuery(name = "netSales", description = "netSales")
    BigDecimal netSales(
            @GraphQLArgument(name = "start") String start,
            @GraphQLArgument(name = "end") String end,
            @GraphQLArgument(name = "filter") String filter
    ) {
        if(start && end){
            return inventoryResource.net_sales(start,end,filter)
        }else{
            return null
        }

    }

}
