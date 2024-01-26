package com.backend.gbp.graphqlservices.payroll

import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.accounting.HeaderLedgerGroup
import com.backend.gbp.domain.accounting.JournalType
import com.backend.gbp.domain.accounting.LedgerDocType
import com.backend.gbp.domain.hrm.Employee
import com.backend.gbp.domain.payroll.EmployeeLoanLedgerItem
import com.backend.gbp.domain.payroll.Payroll
import com.backend.gbp.domain.payroll.PayrollEmployee
import com.backend.gbp.domain.payroll.enums.AccountingEntryType
import com.backend.gbp.domain.payroll.enums.PayrollEmployeeStatus
import com.backend.gbp.domain.payroll.enums.PayrollStatus
import com.backend.gbp.domain.payroll.enums.PayrollType
import com.backend.gbp.graphqlservices.accounting.ArInvoiceServices
import com.backend.gbp.graphqlservices.accounting.HeaderGroupServices
import com.backend.gbp.graphqlservices.accounting.IntegrationServices
import com.backend.gbp.graphqlservices.accounting.LedgerServices
import com.backend.gbp.graphqlservices.payroll.common.AbstractPayrollStatusService
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.repository.hrm.EmployeeRepository
import com.backend.gbp.repository.payroll.EmployeeLoanLedgerItemRepository
import com.backend.gbp.repository.payroll.PayrollEmployeeRepository
import com.backend.gbp.repository.payroll.PayrollRepository
import com.backend.gbp.security.SecurityUtils
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.GeneratorType
import com.fasterxml.jackson.databind.ObjectMapper
import groovy.transform.TypeChecked
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.data.domain.PageRequest
import org.springframework.data.domain.Sort
import org.springframework.stereotype.Component
import org.springframework.transaction.annotation.Transactional

import java.text.SimpleDateFormat
import java.time.Instant
import java.time.Year
import java.time.ZoneId
import java.time.format.DateTimeFormatter

@TypeChecked
@Component
@GraphQLApi
class PayrollService extends AbstractPayrollStatusService<Payroll> {

    private final EmployeeRepository employeeRepository

    @Autowired
    PayrollRepository payrollRepository

    @Autowired
    PayrollEmployeeRepository payrollEmployeeRepository

    @Autowired
    List<IPayrollModuleBaseOperations> payrollOperations

    @Autowired
    List<IPayrollEmployeeBaseOperation> payrollEmployeeOperations

    @Autowired
    EmployeeLoanLedgerItemRepository employeeLoanLedgerItemRepository

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    IntegrationServices integrationServices

    @Autowired
    ArInvoiceServices arInvoiceServices

    @Autowired
    LedgerServices ledgerServices

    @Autowired
    HeaderGroupServices headerGroupServices

    @Autowired
    GeneratorService generatorService


    @Autowired
    PayrollService(EmployeeRepository employeeRepository) {
        super(Payroll.class, employeeRepository)
        this.employeeRepository = employeeRepository
    }

    //=================================QUERY=================================\\
    @GraphQLQuery(name = "payrolls", description = "Get All payroll")
    List<Payroll> findAll() {
        payrollRepository.findAll().sort { it.createdDate }
    }

    @GraphQLQuery(name = "getPayrollById", description = "Get payroll by ID")
    Payroll findById(@GraphQLArgument(name = "id") UUID id) {
        if (id) {
            return payrollRepository.findById(id).get()
        } else {
            return null
        }

    }

    @GraphQLQuery(name = 'getPayrollByPagination', description = 'list of all allowances with pagination')
    Page<Payroll> getPayrollByPagination(
            @GraphQLArgument(name = "size") Integer size,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "filter") String filter
    ) {
        return payrollRepository.getPayrollByFilterPageable(filter, PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, 'createdDate')))
    }


    //=================================QUERY=================================\\


    //================================MUTATION================================\\

    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation
    GraphQLResVal<Payroll> upsertPayroll(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "employeeList") List<UUID> employeeList
    ) {

        CompanySettings companySettings = SecurityUtils.currentCompany()
        if (id) {
            Payroll payroll = payrollRepository.findById(id).get()
            if (fields) {
                payroll = objectMapper.updateValue(payroll, fields)
                payroll.code = """${payroll.type == PayrollType.SEMI_MONTHLY ? 'S' : 'W'}""" +
                        """${Year.from(payroll.dateStart.atZone(ZoneId.systemDefault())).toString()}""" +
                        """${payroll.dateStart.atZone(ZoneId.systemDefault()).getMonthValue().toString()}""" +
                        """${payroll.cycle.toString()}"""
            }

            List<PayrollEmployee> employeesToRemove = []


            payroll.payrollEmployees.each { PayrollEmployee pe ->
                int index = employeeList.indexOf(pe.employee.id)
                if (index < 0) {
                    employeesToRemove.add(pe)
                } else {
                    employeeList.remove(index)
                }
            }
            List<PayrollEmployee> employeesToAdd = []

            if (employeeList.size() > 0) {
                List<Employee> employees = employeeRepository.getEmployees(employeeList)
                employeesToAdd = createPayrollEmployees(employees, payroll)
                payrollEmployeeRepository.saveAll(employeesToAdd)
            }

            payroll.payrollEmployees.removeAll(employeesToRemove)
            payroll.company = companySettings
            payrollRepository.save(payroll)

            if (payroll.status == PayrollStatus.ACTIVE && employeesToAdd.size() > 0) {
//                timekeepingEmployeeService.addEmployees(employeesToAdd, payroll) //TODO: Temporary only, use the code below in the future
//                payrollEmployeeAllowanceService.addEmployees(employeesToAdd, payroll) //TODO: Temporary only, use the code below in the future

                payrollEmployeeOperations.each {
                    it.addEmployees(employeesToAdd, payroll)
                }
            }

            return new GraphQLResVal<Payroll>(payroll, true, "Successfully updated Payroll")
        } else {
            Payroll payroll = objectMapper.convertValue(fields, Payroll)
            payroll.status = PayrollStatus.DRAFT

            List<Employee> employees = employeeRepository.getEmployees(employeeList)
            payroll.payrollEmployees.addAll(createPayrollEmployees(employees, payroll))
            payroll.company = companySettings
            payroll = payrollRepository.save(payroll)

            return new GraphQLResVal<Payroll>(payroll, true, "Successfully created new Payroll")
        }
    }

    static List<PayrollEmployee> createPayrollEmployees(List<Employee> employees, Payroll payroll) {

        CompanySettings companySettings = SecurityUtils.currentCompany()
        List<PayrollEmployee> payrollEmployees = new ArrayList<PayrollEmployee>()
        employees.each {
            PayrollEmployee payrollEmployee = new PayrollEmployee()
            payrollEmployee.status = PayrollEmployeeStatus.DRAFT
            payrollEmployee.employee = it
            payrollEmployee.payroll = payroll
            payrollEmployee.company = companySettings
            payrollEmployees.add(payrollEmployee)
        }
        return payrollEmployees
    }


    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation
    GraphQLResVal<Payroll> updatePayrollStatus(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "status") String status

    ) {
        Payroll payroll = updateStatus(id, PayrollStatus.valueOf(status))

        if (status == 'ACTIVE') {
            payrollOperations.each {
                it.startPayroll(payroll)
            }

        } else if (status == 'FINALIZED') {
            payroll.status = PayrollStatus.FINALIZED
            postToLedgerAccounting(payroll)
        }
        payrollRepository.save(payroll)

        return new GraphQLResVal<Payroll>(payroll, true, status == 'FINALIZED' ? "Successfully finalized payroll" : "Successfully updated payroll")
    }

    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation
    GraphQLResVal<String> updatePayrollDetails(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "fields") Map<String, Object> fields
    ) {

        Payroll payroll = payrollRepository.findById(id).get()

        payroll = objectMapper.updateValue(payroll, fields)
        payrollRepository.save(payroll)

        return new GraphQLResVal<String>("OK", true, "Successfully updated payroll details")

    }

    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation
    GraphQLResVal<String> deletePayroll(
            @GraphQLArgument(name = "id") UUID id
    ) {
        if (!id) return new GraphQLResVal<String>("ERROR", false, "Failed to delete payroll")
        Payroll timekeeping = payrollRepository.findById(id).get()
        payrollRepository.delete(timekeeping)

        return new GraphQLResVal<String>("OK", true, "Successfully deleted payroll")
    }

    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation
    GraphQLResVal<String> testPayrollAccounting(
            @GraphQLArgument(name = "id") UUID id
    ) {
        Payroll payroll = payrollRepository.findById(id).get()
        postToLedgerAccounting(payroll)
        return new GraphQLResVal<String>("OK", true, "Successfully posted payroll entries to accounting")
    }

    @Transactional(rollbackFor = Exception.class)
    Payroll postToLedgerAccounting(Payroll payroll) {
        def yearFormat = DateTimeFormatter.ofPattern("yyyy")
        def actPay = super.save(payroll) as Payroll
        HeaderLedgerGroup headerLedgerGroup = new HeaderLedgerGroup()
        headerLedgerGroup.recordNo = generatorService.getNextValue(GeneratorType.HEADER_GROUP) {
            StringUtils.leftPad(it.toString(), 5, "0")
        }
        headerLedgerGroup.entity_name = 'MEGATAM PAYROLL'
        headerLedgerGroup.particulars = 'TEST PAYROLL'
        def newSave = headerGroupServices.save(headerLedgerGroup)

        Map<String, Map<String, Object>> entryMap = new HashMap<>()
        List<Map<String, Object>> entries = []
        BigDecimal totalAllowance = 0


        payroll.allowance.totalsBreakdown.each {
            Map<String, Object> itemsAccount = generateEntry(it, entryMap)

            totalAllowance += it.amount
//            entries.push(itemsAccount)
        }

        BigDecimal totalAdjustmentDebit = 0
        BigDecimal totalAdjustmentCredit = 0
        payroll.adjustment.totalsBreakdown.each {
            Map<String, Object> itemsAccount = generateEntry(it, entryMap)
            if (it.entryType == AccountingEntryType.DEBIT)
                totalAdjustmentCredit += it.amount
            else if (it.entryType == AccountingEntryType.CREDIT)
                totalAdjustmentDebit += it.amount
//            entries.push(itemsAccount)
        }

        BigDecimal totalOtherDeduction = 0
        payroll.otherDeduction.totalsBreakdown.each {
            Map<String, Object> itemsAccount = generateEntry(it, entryMap)
            totalOtherDeduction += it.amount
//            entries.push(itemsAccount)
        }

//        BigDecimal totalLoan = 0
//        payroll.loan.totalsBreakdown.each {
//            Map<String, Object> itemsAccount = generateEntry(it, entryMap)
//            totalLoan += it.amount
//            entries.push(itemsAccount)
//        }


        BigDecimal totalLoan = 0
        payroll.advancesToEmployees = 0
        payroll.loan.totalsBreakdown.each {
            payroll.advancesToEmployees -= it.amount
            totalLoan += it.amount
        }

        BigDecimal totalContributions = 0
        BigDecimal dueToSss = 0
        BigDecimal dueToHdmf = 0
        BigDecimal dueToPhic = 0
        payroll.contribution.totalsBreakdown.each {
            switch (it.description) {
                case 'SSS EE': ''
                    totalContributions += it.amount;
                    payroll.sssEe = it.amount; break;
                case 'HDMF EE':
                    totalContributions += it.amount;
                    payroll.hdmfEe = it.amount; break;
                case 'PHIC EE':
                    totalContributions += it.amount;
                    payroll.phicEe = it.amount; break;
                case 'SSS ER':
                    dueToSss = it.amount; break;
                case 'HDMF ER':
                    dueToHdmf = it.amount; break;
                case 'PHIC ER':
                    dueToPhic = it.amount; break;
            }
        }

        BigDecimal totalSalary = 0
        BigDecimal totalLateAmount = 0
        payroll.timekeeping.salaryBreakdown.each {
            Map<String, Object> itemsAccount = [:]
            itemsAccount['code'] = it.subAccountCode
            itemsAccount['debit'] = it.total
            itemsAccount['credit'] = it.late
            totalLateAmount += it.late
            totalSalary += it.total

            entries.push(itemsAccount)
        }
        totalSalary = totalSalary - totalOtherDeduction - totalLoan - totalContributions
        Instant now = Instant.now()

        BigDecimal totalWithholdingTax = 0
        payroll.payrollEmployees.each {
            totalWithholdingTax += it.withholdingTax
        }

        def headerLedger = integrationServices.generateAutoEntries(payroll) { it, mul ->
            it.flagValue = "PAYROLL_PROCESSING"
            it.salariesPayableTotalCredit = totalAllowance + totalAdjustmentCredit + totalSalary - totalAdjustmentDebit - totalLateAmount - totalWithholdingTax
            it.salariesPayableTotalDebit = 0
            it.withholdingTax = totalWithholdingTax
        }

        entryMap.keySet().each { key ->
            Map<String, Object> item = entryMap.get(key.toString())
            Boolean foundDuplicate = false
            headerLedger.ledger.each {
                if (it.journalAccount.code == key) {
                    it.credit += item['credit'] as BigDecimal
                    it.debit += item['debit'] as BigDecimal
                    foundDuplicate = true
                }
            }
            if (!foundDuplicate) entries.push(item)
            foundDuplicate = false
        }

//        entryMap.keySet().each { key ->
//            Map<String, Object> item = entryMap.get(key.toString())
//            entries.push(item)
//        }


        headerLedger = arInvoiceServices.addHeaderManualEntries(headerLedger, entries)
        Map<String, String> details = [:]

        actPay.details.each { k, v ->
            details[k] = v
        }

        details["PAYROLL_ID"] = actPay.id.toString()
        details["PAYROLL_CODE"] = payroll.code

        headerLedger.transactionNo = ''
        headerLedger.transactionType = ''
        headerLedger.referenceType = ''
        headerLedger.referenceNo = ''
        headerLedger.headerLedgerGroup = newSave.id

        def dateFormat = new SimpleDateFormat("MM/dd/yyyy")
        def startDate = dateFormat.format(Date.from(payroll.dateStart))
        def endDate = dateFormat.format(Date.from(payroll.dateEnd))

        def pHeader = ledgerServices.persistHeaderLedger(headerLedger,
                "${now.atZone(ZoneId.systemDefault()).format(yearFormat)}-${'PAYROLL_CODE'}",
                payroll.company.companyName + 'Payroll',
                "To record the payroll for period ${startDate} - ${endDate}",
                LedgerDocType.PRL,
                JournalType.GENERAL,
                now,
                details)


        def headerLedgerContribution = integrationServices.generateAutoEntries(payroll) { it, mul ->
            it.flagValue = "ER_CONTRIBUTIONS_PROCESSING"
            it.salariesPayableTotalCredit = 0
            it.salariesPayableTotalDebit = 0
            it.sssEe = 0
            it.hdmfEe = 0
            it.phicEe = 0
            it.advancesToEmployees = 0
            it.sssEr = dueToSss
            it.hdmfEr = dueToHdmf
            it.phicEr = dueToPhic
            it.sssPremium = dueToSss
            it.hdmfPremium = dueToHdmf
            it.phicPrmemium = dueToPhic
        }
        headerLedgerContribution.transactionNo = ''
        headerLedgerContribution.transactionType = ''
        headerLedgerContribution.referenceType = ''
        headerLedgerContribution.referenceNo = ''
        headerLedgerContribution.headerLedgerGroup = newSave.id

        def pHeaderContribution = ledgerServices.persistHeaderLedger(headerLedgerContribution,
                "${now.atZone(ZoneId.systemDefault()).format(yearFormat)}-${'PAYROLL_CODE'}",
                payroll.company.companyName + 'Contributions',
                "To record the employer counterpart of the mandatory contributions for payroll period ${startDate} - ${endDate}",
                LedgerDocType.PRL,
                JournalType.GENERAL,
                now,
                details)


        actPay.postedLedger = newSave.id
        actPay.status = PayrollStatus.FINALIZED
        actPay.posted = true
        actPay.postedBy = SecurityUtils.currentLogin()

        generateLoanLedgerItems(payroll)
        save(actPay)

    }

    void generateLoanLedgerItems(Payroll payroll) {

        List<EmployeeLoanLedgerItem> ledgerItems = []
        payroll.payrollEmployees.each { PayrollEmployee payrollEmployee ->

            payrollEmployee.payrollEmployeeLoan.loanItems.each {
                EmployeeLoanLedgerItem ledgerItem = new EmployeeLoanLedgerItem()
                ledgerItem.employeeLoan = null
                ledgerItem.employee = payrollEmployee.employee
                ledgerItem.debit = 0
                ledgerItem.credit = it.amount
                ledgerItem.category = it.category
                ledgerItem.company = payrollEmployee.company
                ledgerItem.description = payroll.code + ' - Loan Repayment'
                ledgerItem.status = true
                ledgerItems.push(ledgerItem)
            }
        }
        employeeLoanLedgerItemRepository.saveAll(ledgerItems)
    }

    private static Map<String, Object> generateEntry(SubAccountBreakdownDto it, Map<String, Map<String, Object>> entryMap) {

        Map<String, Object> itemsAccount = entryMap.get(it.subaccountCode)
        if (!itemsAccount)
            itemsAccount = new HashMap<>()
        itemsAccount['code'] = it.subaccountCode

        if (it.entryType == AccountingEntryType.DEBIT) {
            itemsAccount['debit'] = (itemsAccount['debit'] ? (itemsAccount['debit'] as BigDecimal) : 0) + it.amount
        } else if (it.entryType == AccountingEntryType.CREDIT) {
            itemsAccount['credit'] = (itemsAccount['credit'] ? (itemsAccount['credit'] as BigDecimal) : 0) + it.amount
        }

        if (!itemsAccount['debit'])
            itemsAccount['debit'] = 0

        if (!itemsAccount['credit'])
            itemsAccount['credit'] = 0
        entryMap.put(it.subaccountCode, itemsAccount)
        return itemsAccount
    }


//    private static Map<String, Object> generateEntry(SubAccountBreakdownDto it, Map<String, Map<String, Object>> entryMap) {
//        Map<String, Object> itemsAccount = [:]
//        itemsAccount['code'] = it.subaccountCode
//
//        if (it.entryType == AccountingEntryType.DEBIT) {
//            itemsAccount['debit'] = it.amount
//            itemsAccount['credit'] = 0.00
//        } else if (it.entryType == AccountingEntryType.CREDIT) {
//            itemsAccount['debit'] = 0.00
//            itemsAccount['credit'] = it.amount
//        }
//        return itemsAccount
//    }

}






