package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.AccountsPayable
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.inventory.SupplierService
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.rest.dto.journal.JournalEntryViewDto
import com.backend.gbp.rest.dto.payables.AccountPayableDetialsDto
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.GeneratorType
import com.fasterxml.jackson.databind.ObjectMapper
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.jdbc.core.BeanPropertyRowMapper
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

import java.math.RoundingMode
import java.time.Duration
import java.time.Instant
import java.time.ZoneId
import java.time.format.DateTimeFormatter

@Service
@GraphQLApi
class AccountsPayableServices extends AbstractDaoService<AccountsPayable> {

    @Autowired
    GeneratorService generatorService

    @Autowired
    ObjectMapper objectMapper

    @Autowired
    AccountsPayableDetialServices accountsPayableDetialServices


    @Autowired
    JdbcTemplate jdbcTemplate

    @Autowired
    SupplierService supplierService




	AccountsPayableServices() {
		super(AccountsPayable.class)
	}
	
	@GraphQLQuery(name = "apById")
	AccountsPayable apById(
			@GraphQLArgument(name = "id") UUID id
	) {
		findOne(id)
	}
	
	@GraphQLQuery(name = "apListPosted", description = "Find Ap posted")
	List<AccountsPayable> apListPosted() {
		createQuery("Select ap from AccountsPayable ap where ap.posted = true").resultList
	}

	@GraphQLQuery(name = "apListBySupplierFilter", description = "List of AP Pageable By Supplier")
	Page<AccountsPayable> apListBySupplierFilter(
			@GraphQLArgument(name = "filter") String filter,
			@GraphQLArgument(name = "supplier") UUID supplier,
			@GraphQLArgument(name = "page") Integer page,
			@GraphQLArgument(name = "size") Integer size
	) {

        String query = '''Select ap from AccountsPayable ap where
							ap.posted = true and
						( lower(ap.apNo) like lower(concat('%',:filter,'%')) or
						lower(ap.invoiceNo) like lower(concat('%',:filter,'%')) )'''

        String countQuery = '''Select count(ap) from AccountsPayable ap where
							ap.posted = true and
							( lower(ap.apNo) like lower(concat('%',:filter,'%')) or
						lower(ap.invoiceNo) like lower(concat('%',:filter,'%')) ) '''

        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)

        if (supplier) {
            query += ''' and (ap.supplier.id = :supplier) '''
            countQuery += ''' and (ap.supplier.id = :supplier) '''
            params.put("supplier", supplier)
        }

        query += ''' ORDER BY ap.apvDate DESC'''

        getPageable(query, countQuery, page, size, params)
    }

    @GraphQLQuery(name = "apListBySupplier", description = "List of AP Pageable By Supplier")
    List<AccountsPayable> apListBySupplier(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "supplier") UUID supplier
    ) {

        String query = '''Select ap from AccountsPayable ap where ap.posted = true and
						( lower(ap.apNo) like lower(concat('%',:filter,'%')) or
						lower(ap.invoiceNo) like lower(concat('%',:filter,'%')) )'''

        Map<String, Object> params = new HashMap<>()
        params.put('filter', filter)

        if (supplier) {
            query += ''' and (ap.supplier.id = :supplier) '''
            params.put("supplier", supplier)
        }

        query += ''' ORDER BY ap.apvDate DESC'''

        def result = createQuery(query, params).resultList
        return result.findAll({it.balance > BigDecimal.ZERO })
    }

    @GraphQLQuery(name = "apListFilter", description = "List of AP Pageable")
    Page<AccountsPayable> apListFilter(
            @GraphQLArgument(name = "filter") String filter,
            @GraphQLArgument(name = "supplier") UUID supplier,
            @GraphQLArgument(name = "status") Boolean status,
            @GraphQLArgument(name = "start") String start,
            @GraphQLArgument(name = "end") String end,
            @GraphQLArgument(name = "page") Integer page,
            @GraphQLArgument(name = "size") Integer size
    ) {

        String query = '''Select ap from AccountsPayable ap where
                        to_date(to_char(ap.apvDate, 'YYYY-MM-DD'),'YYYY-MM-DD')
             			between to_date(:start,'YYYY-MM-DD') and  to_date(:end,'YYYY-MM-DD')'''

        String countQuery = '''Select count(ap) from AccountsPayable ap where
						to_date(to_char(ap.apvDate, 'YYYY-MM-DD'),'YYYY-MM-DD')
             			between to_date(:start,'YYYY-MM-DD') and  to_date(:end,'YYYY-MM-DD')'''

        Map<String, Object> params = new HashMap<>()
        params.put('start', start)
        params.put('end', end)


        if(filter) {
            query += ''' and ( lower(ap.apNo) like lower(concat('%',:filter,'%')) or
						lower(ap.invoiceNo) like lower(concat('%',:filter,'%'))) '''
            countQuery += ''' and ( lower(ap.apNo) like lower(concat('%',:filter,'%')) or
						lower(ap.invoiceNo) like lower(concat('%',:filter,'%'))) '''
            params.put('filter', filter)
        }

        if (supplier) {
            query += ''' and (ap.supplier.id = :supplier) '''
            countQuery += ''' and (ap.supplier.id = :supplier) '''
            params.put("supplier", supplier)
        }

        if (status) {
            query += ''' and (ap.posted = :status or ap.posted is null) '''
            countQuery += ''' and (ap.posted = :status or ap.posted is null) '''
            params.put("status", !status)
        }

        query += ''' ORDER BY ap.apvDate DESC'''

        getPageable(query, countQuery, page, size, params)
    }

    //mutations
    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation(name = "upsertPayables")
    AccountsPayable upsertPayables(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "items") ArrayList<Map<String, Object>> items,
            @GraphQLArgument(name = "id") UUID id
    ) {
        def apCat = 'AP'
        def ap = upsertFromMap(id, fields, { AccountsPayable entity, boolean forInsert ->
            if (forInsert) {
                entity.apNo = generatorService.getNextValue(GeneratorType.APNO, {
                    return "${apCat}-" + StringUtils.leftPad(it.toString(), 6, "0")
                })
                entity.appliedAmount = 0
                entity.status = "DRAFT"
                entity.posted = false

                //round numbers to 2 decimal
                entity.grossAmount = entity.grossAmount.setScale(2, RoundingMode.HALF_EVEN)
                entity.discountAmount = entity.discountAmount.setScale(2, RoundingMode.HALF_EVEN)
                entity.netOfDiscount = entity.netOfDiscount.setScale(2, RoundingMode.HALF_EVEN)
                entity.vatAmount = entity.vatAmount.setScale(2, RoundingMode.HALF_EVEN)
                entity.netOfVat = entity.netOfVat.setScale(2, RoundingMode.HALF_EVEN)
                entity.ewtAmount = entity.ewtAmount.setScale(2, RoundingMode.HALF_EVEN)
                entity.netAmount = entity.netAmount.setScale(2, RoundingMode.HALF_EVEN)
                //
                entity.daAmount = BigDecimal.ZERO
                entity.dmAmount = BigDecimal.ZERO
            } else {
                //round numbers to 2 decimal
                entity.grossAmount = entity.grossAmount.setScale(2, RoundingMode.HALF_EVEN)
                entity.discountAmount = entity.discountAmount.setScale(2, RoundingMode.HALF_EVEN)
                entity.netOfDiscount = entity.netOfDiscount.setScale(2, RoundingMode.HALF_EVEN)
                entity.vatAmount = entity.vatAmount.setScale(2, RoundingMode.HALF_EVEN)
                entity.netOfVat = entity.netOfVat.setScale(2, RoundingMode.HALF_EVEN)
                entity.ewtAmount = entity.ewtAmount.setScale(2, RoundingMode.HALF_EVEN)
                entity.netAmount = entity.netAmount.setScale(2, RoundingMode.HALF_EVEN)
            }
        })

        def apDetails = items as ArrayList<AccountPayableDetialsDto>
        apDetails.each {
            it ->
                def trans = objectMapper.convertValue(it.transType, TransTypeDto.class)
                def apDto = objectMapper.convertValue(it, AccountPayableDetialsDto.class)
                def dep = null
                if (it.department) {
                    dep = objectMapper.convertValue(it.department, DepDto.class)
                }
                accountsPayableDetialServices.upsertPayablesDetails(apDto, ap, trans?.id, dep?.id)
        }

        return ap
    }

    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation(name = "upsertPayablesByRec")
    AccountsPayable upsertPayablesByRec(
            @GraphQLArgument(name = "id") UUID id
    ) {
        def apCat = 'AP'
        def rec = receivingReportRepository.findById(id).get()

		AccountsPayable ap = new AccountsPayable()
		if(rec.refAp){
			ap = findOne(rec.refAp)
		}
		//upsert only if not posted
		if(!ap.posted){
			if(!rec.refAp) {
				ap.apNo = generatorService.getNextValue(GeneratorType.APNO, {
					return "${apCat}-" + StringUtils.leftPad(it.toString(), 6, "0")
				})
				ap.apvDate = Instant.now().plus(Duration.ofHours(8))
				ap.dueDate = Instant.now().plus(Duration.ofHours(8))
				ap.apCategory = "ACCOUNTS PAYABLE"
				ap.ewtAmount = BigDecimal.ZERO
				ap.daAmount = BigDecimal.ZERO
				ap.dmAmount = BigDecimal.ZERO
				ap.appliedAmount = BigDecimal.ZERO
				ap.status = "DRAFT"
				ap.remarksNotes = rec.rrNo
				ap.posted = false
			}
            def grossAmount = rec.grossAmount.setScale(2, RoundingMode.HALF_EVEN)
            def discountAmount = rec.totalDiscount.setScale(2, RoundingMode.HALF_EVEN)
            def netOfDiscount = rec.netDiscount.setScale(2, RoundingMode.HALF_EVEN)
            def vatAmount = rec.inputTax.setScale(2, RoundingMode.HALF_EVEN)
            def amount = rec.amount.setScale(2, RoundingMode.HALF_EVEN)
			ap.receiving = rec
			ap.supplier = rec.supplier
			ap.paymentTerms = rec.paymentTerms
			ap.invoiceNo = rec.receivedRefNo
			ap.grossAmount = grossAmount
			ap.discountAmount = discountAmount
			ap.netOfDiscount = netOfDiscount
			ap.vatRate = rec.vatRate
			ap.vatAmount = vatAmount
			ap.netOfVat = rec.vatInclusive ? netOfDiscount : amount
			ap.netAmount = amount

			def afterSave = save(ap)

			if(!rec.refAp){
				//ap details
				accountsPayableDetialServices.upsertPayablesDetailsByRec(rec, afterSave)

				//update receiving has ap
				rec.refAp = afterSave.id
				receivingReportRepository.save(rec)
			}
		}

		return ap
	}


//
    @GraphQLQuery(name = "apAccountView")
    List<JournalEntryViewDto> apAccountView(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "status") Boolean status
    ) {
        def result = new ArrayList<JournalEntryViewDto>()
        //ewt rate
//        if (id) {
//            def actPay = findOne(id)
//            def ewt1 = BigDecimal.ZERO; def ewt2 = BigDecimal.ZERO; def ewt3 = BigDecimal.ZERO
//            def ewt4 = BigDecimal.ZERO; def ewt5 = BigDecimal.ZERO; def ewt7 = BigDecimal.ZERO
//            def ewt10 = BigDecimal.ZERO; def ewt15 = BigDecimal.ZERO; def ewt18 = BigDecimal.ZERO
//            def ewt30 = BigDecimal.ZERO
//
//            def actPayDetials = accountsPayableDetialServices.detailsByAp(actPay.id)
//            actPayDetials.each {
//                switch (it.ewtRate) {
//                    case 1:
//                        ewt1 += it.ewtAmount
//                        break
//                    case 2:
//                        ewt2 += it.ewtAmount
//                        break
//                    case 3:
//                        ewt3 += it.ewtAmount
//                        break
//                    case 4:
//                        ewt4 += it.ewtAmount
//                        break
//                    case 5:
//                        ewt5 += it.ewtAmount
//                        break
//                    case 7:
//                        ewt7 += it.ewtAmount
//                        break
//                    case 10:
//                        ewt10 += it.ewtAmount
//                        break
//                    case 15:
//                        ewt15 += it.ewtAmount
//                        break
//                    case 18:
//                        ewt18 += it.ewtAmount
//                        break
//                    case 30:
//                        ewt30 += it.ewtAmount
//                        break
//                }
//            }
//            //ewt rate
//            if (actPay.transType?.flagValue) {
//                def headerLedger = integrationServices.generateAutoEntries(actPay) { it, mul ->
//                    it.flagValue = actPay.transType?.flagValue
//                    //initialize
//                    if (actPay.apCategory.equalsIgnoreCase("ACCOUNTS PAYABLE")) {
//                        def netOfVat = (actPay.netOfVat + actPay.vatAmount).setScale(2, RoundingMode.HALF_EVEN)
//                        def discountAmount = actPay.discountAmount.setScale(2, RoundingMode.HALF_EVEN)
//                        def netAmount = actPay.netAmount.setScale(2, RoundingMode.HALF_EVEN)
//
//                        BigDecimal clearing = netOfVat + discountAmount
//                        it.clearingAmount = status ? (clearing * -1) : clearing
//
//                        // credit normal side make it negative to debit
//                        it.discAmount = status ? discountAmount : discountAmount * -1
//                        it.supplierAmount = status ? netAmount : netAmount * -1
//                    } else {
//                        def netOfVat = (actPay.netOfVat + actPay.vatAmount).setScale(2, RoundingMode.HALF_EVEN)
//                        def netAmount = actPay.netAmount.setScale(2, RoundingMode.HALF_EVEN)
//
//                        it.doctorFee = status ? (netOfVat * -1) : netOfVat
//                        //debit (normal side credit)
//                        it.readersFee = status ? netOfVat : (netOfVat * -1)
//                        //debit normal side
//                        it.dueToDoctors = status ? netAmount : (netAmount * -1)//credit
//                    }
//
//                    //ewt
//                    it.ewt1Percent = status ? ewt1.setScale(2, RoundingMode.HALF_EVEN) : ewt1.setScale(2, RoundingMode.HALF_EVEN) * -1
//                    it.ewt2Percent = status ? ewt2.setScale(2, RoundingMode.HALF_EVEN) : ewt2.setScale(2, RoundingMode.HALF_EVEN) * -1
//                    it.ewt3Percent = status ? ewt3.setScale(2, RoundingMode.HALF_EVEN) : ewt3.setScale(2, RoundingMode.HALF_EVEN) * -1
//                    it.ewt4Percent = status ? ewt4.setScale(2, RoundingMode.HALF_EVEN) : ewt4.setScale(2, RoundingMode.HALF_EVEN) * -1
//                    it.ewt5Percent = status ? ewt5.setScale(2, RoundingMode.HALF_EVEN) : ewt5.setScale(2, RoundingMode.HALF_EVEN) * -1
//                    it.ewt7Percent = status ? ewt7.setScale(2, RoundingMode.HALF_EVEN) : ewt7.setScale(2, RoundingMode.HALF_EVEN) * -1
//                    it.ewt10Percent = status ? ewt10.setScale(2, RoundingMode.HALF_EVEN) : ewt10.setScale(2, RoundingMode.HALF_EVEN) * -1
//                    it.ewt15Percent = status ? ewt15.setScale(2, RoundingMode.HALF_EVEN) : ewt15.setScale(2, RoundingMode.HALF_EVEN) * -1
//                    it.ewt18Percent = status ? ewt18.setScale(2, RoundingMode.HALF_EVEN) : ewt18.setScale(2, RoundingMode.HALF_EVEN) * -1
//                    it.ewt30Percent = status ? ewt30.setScale(2, RoundingMode.HALF_EVEN) : ewt30.setScale(2, RoundingMode.HALF_EVEN) * -1
//                }
//
//                Set<Ledger> ledger = new HashSet<Ledger>(headerLedger.ledger);
//                ledger.each {
//                    def list = new JournalEntryViewDto(
//                            code: it.journalAccount.code,
//                            desc: it.journalAccount.description,
//                            debit: it.debit,
//                            credit: it.credit
//                    )
//                    result.add(list)
//                }
//            } else {
//                if (actPay.postedLedger) {
//                    def header = ledgerServices.findOne(actPay.postedLedger)
//                    Set<Ledger> ledger = new HashSet<Ledger>(header.ledger);
//                    ledger.each {
//                        def list = new JournalEntryViewDto(
//                                code: it.journalAccount.code,
//                                desc: it.journalAccount.description,
//                                debit: it.credit,
//                                credit: it.debit
//                        )
//                        result.add(list)
//                    }
//                }
//            }
//        }
        return result.sort { it.credit }
    }


    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation(name = "postAp")
    AccountsPayable postAp(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "status") Boolean status
    ) {
        def apCat = 'AP'
        def ap = findOne(id)
        if (ap.apCategory.equalsIgnoreCase("PROFESSIONAL FEE")) {
            apCat = 'PF'
        }
        if (ap.apCategory.equalsIgnoreCase("READER'S FEE")) {
            apCat = 'RF'
        }
        if (status) {
            def header = ledgerServices.findOne(ap.postedLedger)
            ledgerServices.reverseEntriesCustom(header, ap.apvDate)
            //update AP
            ap.postedLedger = null
            ap.status = "VOIDED"
            ap.posted = false
            ap.postedBy = null
            save(ap)
            //remove ap ledger
            apLedgerServices.removeApLedger(ap.apNo)
            if (ap.ewtAmount > BigDecimal.ZERO) {
                wtx2307Service.remove2307(ap.id)
            }
            //end remover ap ledger
        } else {
            postToLedgerAccounting(ap)

            //add to ap ledger
            Map<String, Object> ledger = new HashMap<>()
            ledger.put('ledgerType', apCat)
            ledger.put('refNo', ap?.apNo)
            ledger.put('refId', ap?.id)
            ledger.put('debit', 0.00)
            ledger.put('credit', ap?.netAmount)
            apLedgerServices.upsertApLedger(ledger, ap?.supplier?.id, null)
            //end to ap ledger

            //insert if ewt is not zero
            if (ap.ewtAmount > BigDecimal.ZERO) {
                Map<String, Object> ewt = new HashMap<>()
                ewt.put('refId', ap.id)
                ewt.put('sourceDoc', ap.apNo)
                ewt.put('refNo', ap.apNo)
                ewt.put('wtxDate', ap.apvDate)
                ewt.put('type', 'AP') //AP, DIS, RP, AROTHERS, DM, DA
                ewt.put('gross', ap.grossAmount) //net of discount
                ewt.put('vatAmount', ap.vatAmount) // 0
                ewt.put('netVat', ap.netOfVat) // same by gross
                ewt.put('ewtAmount', ap.ewtAmount) //ewt amount
                wtx2307Service.upsert2307(ewt, null, ap.supplier.id)
            }
        }
        return ap
    }

    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation(name = "postApManual")
    GraphQLRetVal<Boolean> postApManual(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "header") Map<String, Object> header,
            @GraphQLArgument(name = "entries") List<Map<String, Object>> entries
    ) {
        def ap = findOne(id)
        def apCat = 'AP'
        if (ap.apCategory.equalsIgnoreCase("PROFESSIONAL FEE")) {
            apCat = 'PF'
        }
        if (ap.apCategory.equalsIgnoreCase("READER'S FEE")) {
            apCat = 'RF'
        }

        Map<String, String> details = [:]

        ap.details.each { k, v ->
            details[k] = v
        }

        details["ACC_PAYABLE_ID"] = ap.id.toString()
        details["SUPPLIER_ID"] = ap.supplier.id.toString()

        def result = ledgerServices.addManualJVDynamic(header, entries, LedgerDocType.AP,
                JournalType.PURCHASES_PAYABLES, ap.apvDate, details)

        //update parent
        ap.postedLedger = result.returnId
        ap.status = "POSTED"
        ap.posted = true
        ap.postedBy = SecurityUtils.currentLogin()
        save(ap)

        //add to ap ledger
        Map<String, Object> ledger = new HashMap<>()
        ledger.put('ledgerType', apCat)
        ledger.put('refNo', ap?.apNo)
        ledger.put('refId', ap?.id)
        ledger.put('debit', 0.00)
        ledger.put('credit', ap?.netAmount)
        apLedgerServices.upsertApLedger(ledger, ap?.supplier?.id, null)
        //end to ap ledger

        //insert if ewt is not zero
        if (ap.ewtAmount > BigDecimal.ZERO) {
            Map<String, Object> ewt = new HashMap<>()
            ewt.put('refId', ap.id)
            ewt.put('sourceDoc', ap.apNo)
            ewt.put('refNo', ap.apNo)
            ewt.put('wtxDate', ap.apvDate)
            ewt.put('type', 'AP') //AP, DIS, RP, AROTHERS
            ewt.put('gross', ap.grossAmount) //net of discount
            ewt.put('vatAmount', ap.vatAmount) // 0
            ewt.put('netVat', ap.netOfVat) // same by gross
            ewt.put('ewtAmount', ap.ewtAmount) //ewt amounnt
            wtx2307Service.upsert2307(ewt, null, ap.supplier.id)
        }

        return result
    }


    //save to accounting in post
    @Transactional(rollbackFor = Exception.class)
    AccountsPayable postToLedgerAccounting(AccountsPayable accountsPayable) {
//        def yearFormat = DateTimeFormatter.ofPattern("yyyy")
//        def actPay = super.save(accountsPayable) as AccountsPayable
//        //ewt rate
//        def ewt1 = BigDecimal.ZERO; def ewt2 = BigDecimal.ZERO; def ewt3 = BigDecimal.ZERO
//        def ewt4 = BigDecimal.ZERO; def ewt5 = BigDecimal.ZERO; def ewt7 = BigDecimal.ZERO
//        def ewt10 = BigDecimal.ZERO; def ewt15 = BigDecimal.ZERO; def ewt18 = BigDecimal.ZERO
//        def ewt30 = BigDecimal.ZERO
//        def actPayDetials = accountsPayableDetialServices.detailsByAp(actPay.id)
//        actPayDetials.each {
//            switch (it.ewtRate) {
//                case 1:
//                    ewt1 += it.ewtAmount
//                    break
//                case 2:
//                    ewt2 += it.ewtAmount
//                    break
//                case 3:
//                    ewt3 += it.ewtAmount
//                    break
//                case 4:
//                    ewt4 += it.ewtAmount
//                    break
//                case 5:
//                    ewt5 += it.ewtAmount
//                    break
//                case 7:
//                    ewt7 += it.ewtAmount
//                    break
//                case 10:
//                    ewt10 += it.ewtAmount
//                    break
//                case 15:
//                    ewt15 += it.ewtAmount
//                    break
//                case 18:
//                    ewt18 += it.ewtAmount
//                    break
//                case 30:
//                    ewt30 += it.ewtAmount
//                    break
//            }
//        }
//        //ewt rate
//
//        def headerLedger = integrationServices.generateAutoEntries(accountsPayable) { it, mul ->
//            it.flagValue = actPay.transType?.flagValue
//            //initialize
//
//            if (actPay.apCategory.equalsIgnoreCase("ACCOUNTS PAYABLE")) {
//                def netOfVat = (actPay.netOfVat + actPay.vatAmount).setScale(2, RoundingMode.HALF_EVEN)
//                def discountAmount = actPay.discountAmount.setScale(2, RoundingMode.HALF_EVEN)
//                def netAmount = actPay.netAmount.setScale(2, RoundingMode.HALF_EVEN)
//
//                BigDecimal clearing = netOfVat + discountAmount
//                it.clearingAmount = clearing * -1 // credit normal side make it negative to debit
//                it.discAmount = discountAmount
//                it.supplierAmount = netAmount
//            } else {
//                def netOfVat = (actPay.netOfVat + actPay.vatAmount).setScale(2, RoundingMode.HALF_EVEN)
//                def netAmount = actPay.netAmount.setScale(2, RoundingMode.HALF_EVEN)
//
//                it.doctorFee = netOfVat * -1 //debit (credit normal side)
//                it.readersFee = netOfVat //debit normal side
//                it.dueToDoctors = netAmount //credit
//            }
//
//            //ewt
//            it.ewt1Percent = ewt1.setScale(2, RoundingMode.HALF_EVEN)
//            it.ewt2Percent = ewt2.setScale(2, RoundingMode.HALF_EVEN)
//            it.ewt3Percent = ewt3.setScale(2, RoundingMode.HALF_EVEN)
//            it.ewt4Percent = ewt4.setScale(2, RoundingMode.HALF_EVEN)
//            it.ewt5Percent = ewt5.setScale(2, RoundingMode.HALF_EVEN)
//            it.ewt7Percent = ewt7.setScale(2, RoundingMode.HALF_EVEN)
//            it.ewt10Percent = ewt10.setScale(2, RoundingMode.HALF_EVEN)
//            it.ewt15Percent = ewt15.setScale(2, RoundingMode.HALF_EVEN)
//            it.ewt18Percent = ewt18.setScale(2, RoundingMode.HALF_EVEN)
//            it.ewt30Percent = ewt30.setScale(2, RoundingMode.HALF_EVEN)
//        }
//        Map<String, String> details = [:]
//
//        actPay.details.each { k, v ->
//            details[k] = v
//        }
//
//        details["ACC_PAYABLE_ID"] = actPay.id.toString()
//        details["SUPPLIER_ID"] = actPay.supplier.id.toString()
//
//        def pHeader = ledgerServices.persistHeaderLedger(headerLedger,
//                "${actPay.apvDate.atZone(ZoneId.systemDefault()).format(yearFormat)}-${actPay.apNo}",
//                "${actPay.apNo}-${actPay.supplier.supplierFullname}",
//                "${actPay.apNo}-${actPay.remarksNotes}",
//                LedgerDocType.AP,
//                JournalType.PURCHASES_PAYABLES,
//                actPay.apvDate,
//                details)
//
//        actPay.postedLedger = pHeader.id
//        actPay.status = "POSTED"
//        actPay.posted = true
//        actPay.postedBy = SecurityUtils.currentLogin()
//
//        save(actPay)

    }

    //update Ap
    @Transactional(rollbackFor = Exception.class)
    AccountsPayable updateAp(UUID id, String disNo, BigDecimal applied) {
        def ap = findOne(id)
        //ap.disbursement = ap.disbursement ? ap.disbursement + ',' + disNo : disNo
        if(ap.disbursement){
            ArrayList<String> originalArray = ap.disbursement.split(",") as ArrayList<String>
            originalArray.add(disNo)
            if(originalArray.size()){
                def resultString = originalArray.join(",")
                ap.disbursement = resultString.toString()
            }
        }else{
            ap.disbursement = disNo
        }
        ap.appliedAmount = ap.appliedAmount + applied
        save(ap)
    }


    @Transactional(rollbackFor = Exception.class)
    AccountsPayable updateApForRemove(UUID id, String disNo, BigDecimal applied, Boolean posted) {
        def ap = findOne(id)
        if (posted) {
            //remove
            if(ap.disbursement){
                ArrayList<String> originalArray = ap.disbursement.split(",") as ArrayList<String>
                def valueToRemove = disNo

                def newArray = originalArray.findAll { it != valueToRemove }
                if(newArray.size()){
                    def resultString = newArray.join(",")
                    ap.disbursement = resultString.toString()
                }else{
                    ap.disbursement = null
                }
            }

            if(ap.appliedAmount > BigDecimal.ZERO){
                ap.appliedAmount = ap.appliedAmount - applied
            }
            save(ap)
        }
        return ap
    }

    @Transactional(rollbackFor = Exception.class)
    AccountsPayable updateApFromDM(UUID id, String dmNo, BigDecimal applied, String type) {
        def ap = findOne(id)
        //ap.dmRefNo = ap.dmRefNo ? ap.dmRefNo + ',' + dmNo : dmNo
        //updated
        if(ap.dmRefNo){
            ArrayList<String> originalArray = ap.dmRefNo.split(",") as ArrayList<String>
            originalArray.add(dmNo)
            if(originalArray.size()){
                def resultString = originalArray.join(",")
                ap.dmRefNo = resultString.toString()
            }
        }else{
            ap.dmRefNo = dmNo
        }

        if (type.equalsIgnoreCase("DA")) {
            ap.daAmount = ap.daAmount + applied
        } else {
            ap.dmAmount = ap.dmAmount + applied
        }
        save(ap)
    }

    @Transactional(rollbackFor = Exception.class)
    AccountsPayable updateApForRemoveDM(UUID id, String dmNo, BigDecimal applied, Boolean posted, String type) {
        def ap = findOne(id)
        //def str = ap.dmRefNo ? ap.dmRefNo.split(",") : null
        //def dm = null
        //if (str) {
        //    List<String> al = Arrays.asList(str) //initialize list
        //    al.indexOf(dmNo)
        //    def count = al.size()
        //    if (count > 1) {
        //        al.each {
        //            ap.dmRefNo = dm ? dm + ',' + it : it
        //        }
        //    } else {
        //        ap.dmRefNo = null
        //    }
        //}
        //end remove
        if (posted) {
            //remove
            if(ap.dmRefNo){
                ArrayList<String> originalArray = ap.dmRefNo.split(",") as ArrayList<String>
                def valueToRemove = dmNo

                def newArray = originalArray.findAll { it != valueToRemove }
                if(newArray.size()){
                    def resultString = newArray.join(",")
                    ap.dmRefNo = resultString.toString()
                }else{
                    ap.dmRefNo = null
                }

            }

            if (type.equalsIgnoreCase("DA")) {
                if(ap.daAmount > BigDecimal.ZERO){
                    ap.daAmount = ap.daAmount - applied
                }
            } else {
                if(ap.dmAmount > BigDecimal.ZERO){
                    ap.dmAmount = ap.dmAmount - applied
                }
            }
        }
        save(ap)
        return ap
    }



    //calculate
    static BigDecimal calculateVat(Boolean vatInclusive,
                                   BigDecimal amount,
                                   BigDecimal vatRate) {

        def vat = (amount) / (vatRate + 1)
        def vatAmount = vatInclusive ?
                vat.round(2) * vatRate :
                (amount) * vatRate

        return vatAmount.round(2)
    }

    static calculateEwt(Boolean vatInclusive, BigDecimal amount, BigDecimal vatRate, BigDecimal ewtRate) {
        def netOfdiscount = amount;
        def vat = netOfdiscount / (vatRate + 1)
        def ewt = 0;
        if (vatRate <= 0) {
            ewt = netOfdiscount * ewtRate;
        } else {
            ewt = vatInclusive ?
                    vat.round(2) * ewtRate :
                    netOfdiscount * ewtRate;
        }

        return ewt.round(2);
    }

    //ledger view general
    @GraphQLQuery(name = "ledgerView")
    List<JournalEntryViewDto> ledgerView(
            @GraphQLArgument(name = "id") UUID id
    ) {
        def result = new ArrayList<JournalEntryViewDto>()
//        def header = ledgerServices.findOne(id)
//        if (header) {
//            Set<Ledger> ledger = new HashSet<Ledger>(header.ledger);
//            ledger.each {
                def list = new JournalEntryViewDto(
                        code: "",
                        desc: "",
                        debit: 0,
                        credit: 0
                )
                result.add(list)
//            }
//        }
        return result.sort { it.credit }
    }


    //update Ap status to draft
    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation(name = "updateAPStatus")
    AccountsPayable updateAPStatus(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "status") String status
    ) {
        def ap = findOne(id)
        ap.status = status
        save(ap)
    }

    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation(name = "updatePayableForRemove")
    AccountsPayable updatePayableForRemove(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "amount") BigDecimal amount,
            @GraphQLArgument(name = "discAmount") BigDecimal discAmount,
            @GraphQLArgument(name = "vatAmount") BigDecimal vatAmount,
            @GraphQLArgument(name = "ewtAmount") BigDecimal ewtAmount,
            @GraphQLArgument(name = "netAmount") BigDecimal netAmount
    ) {
        def ap = findOne(id)
        BigDecimal gross = ap.grossAmount - amount
        BigDecimal discount = ap.discountAmount - discAmount
        BigDecimal netDis = (amount - discAmount)

        BigDecimal netDiscount = ap.netOfDiscount - netDis
        BigDecimal vat = ap.vatAmount - vatAmount
        BigDecimal netVat = ap.netOfVat - (netDis - vatAmount)
        BigDecimal ewt = ap.ewtAmount - ewtAmount
        BigDecimal net = ap.netAmount - netAmount

        if(ap.grossAmount > BigDecimal.ZERO){
            ap.grossAmount = gross
        }
        if(ap.discountAmount > BigDecimal.ZERO){
            ap.discountAmount = discount
        }
        if(ap.netOfDiscount > BigDecimal.ZERO){
            ap.netOfDiscount = netDiscount
        }
        if(ap.vatAmount > BigDecimal.ZERO){
            ap.vatAmount = vat
        }
        if(ap.netOfVat > BigDecimal.ZERO){
            ap.netOfVat = netVat
        }
        if(ap.ewtAmount > BigDecimal.ZERO){
            ap.ewtAmount = ewt
        }
        if(ap.netAmount > BigDecimal.ZERO){
            ap.netAmount = net
        }
        save(ap)
    }

}