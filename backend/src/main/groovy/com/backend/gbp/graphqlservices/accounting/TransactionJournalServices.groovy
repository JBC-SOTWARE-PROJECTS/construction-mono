package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.HeaderLedger
import com.backend.gbp.domain.accounting.HeaderLedgerGroup
import com.backend.gbp.domain.accounting.Ledger
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.repository.accounting.LedgerRepository
import com.backend.gbp.security.SecurityUtils
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.GeneratorType
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service

import javax.transaction.Transactional
import java.time.Instant
import java.time.LocalDate
import java.time.ZoneOffset

@Service
@GraphQLApi
class TransactionJournalServices  {

    @Autowired
    LedgerServices ledgerServices

    @Autowired
    GeneratorService generatorService

    @Autowired
    FiscalServices fiscalServices

    @Autowired
    SubAccountSetupService subAccountSetupService

    @Autowired
    HeaderGroupServices headerGroupServices

    @Autowired
    LedgerRepository ledgerRepository

    @Transactional
    @GraphQLMutation
    GraphQLRetVal<Boolean> editJournalEntry(
            @GraphQLArgument(name = "headerGroupId") UUID headerGroupId,
            @GraphQLArgument(name = "headerId") UUID headerId,
            @GraphQLArgument(name = "status") String status,
            @GraphQLArgument(name = "fields") Map<String,Object> fields,
            @GraphQLArgument(name = "entries")  List<Map<String,Object>>  entries) {

        def header = new HeaderLedger()
        if(headerId)
            header = ledgerServices.findOne(headerId)

        if(fields['custom']){
            Instant instant = Instant.parse(fields['transactionDate'])
            fields['transactionDateOnly'] = instant.atOffset(ZoneOffset.UTC).plusHours(8).toLocalDate()
            header = ledgerServices.upsertFromMap(headerId,fields)
            header.docnum = generatorService.getNextValue(GeneratorType.JOURNAL_VOUCHER){
                StringUtils.leftPad(it.toString(),5,"0")
            }
            header.fiscal = fiscalServices.findFiscalForTransactionDate(header.transactionDate)
        }

        if(!headerGroupId){
            HeaderLedgerGroup headerLedgerGroup = new HeaderLedgerGroup()
            headerLedgerGroup.recordNo = generatorService.getNextValue( GeneratorType.HEADER_GROUP){
                StringUtils.leftPad(it.toString(),5,"0")
            }
            headerLedgerGroup.docNo = header.invoiceSoaReference
            headerLedgerGroup.entity_name = header.entityName
            headerLedgerGroup.particulars = header.particulars
            headerLedgerGroup.company = SecurityUtils.currentCompany()
            def newSave = headerGroupServices.save(headerLedgerGroup)
            header.headerLedgerGroup = newSave.id
        }
        else header.headerLedgerGroup = headerGroupId

        if(status.equalsIgnoreCase("POSTED")){
            def login =  SecurityUtils.currentLogin()
            header.approvedBy = login
            header.approvedDatetime = Instant.now()
        }

        def coa =  subAccountSetupService.getAllChartOfAccountGenerate("","","","","","")
        List<EntryFull> entriesTarget = []

        for (Map<String,Object> entry in entries ){
            String code = entry.get("code")
            String description = entry.get("description")
            BigDecimal debit = new BigDecimal((entry.get("debit") ?: '0') as String)
            BigDecimal credit =  new BigDecimal((entry.get("credit") ?: '0') as String)
            def match =  coa.find {
                it.code == code
            }
            if(!match){
                return   new GraphQLRetVal<Boolean>(false,false,"${code}-${description} is not found in Chart of accounts")
            }

            entriesTarget << new EntryFull(match,debit,credit)
        }

        BigDecimal totalDebit = 0.0
        BigDecimal totalCredit = 0.0

        entriesTarget.each {
            totalDebit += it.debit
            totalCredit += it.credit
        }

        if(Math.abs(totalDebit - totalCredit) > 0.5 ){
            // throw new Exception("Entries not Balanced. Debit [${totalDebit.toPlainString()}] Credit [${totalCredit.toPlainString()}]")
            return new GraphQLRetVal<Boolean>(false,false,"Entries not Balanced. Debit [${totalDebit.toPlainString()}] Credit [${totalCredit.toPlainString()}]")
        }

        def headerLedger  =  ledgerServices.createDraftHeaderLedgerFull(entriesTarget, header.transactionDate)

        Map<String, Ledger> ledgerMap = [:]
        headerLedger.ledger.each {
            ledgerMap[it.journalAccount.code] = it
        }

        List<Ledger> removed = []

        header.ledger.each {
            def ledgerItem  = ledgerMap[it.journalAccount.code] ?: null
            if(ledgerItem){
                if(status.equalsIgnoreCase("POSTED")){
                    def login =  SecurityUtils.currentLogin()
                    it.approvedBy = login
                    it.approvedDatetime = Instant.now()
                }
                it.debit = (ledgerItem['debit'] ?: 0.00) as BigDecimal
                it.credit = (ledgerItem['credit']  ?: 0.00) as BigDecimal
                ledgerItem.added = true
            }else{
                removed << it
            }
        }

        removed.each {
            if(!it.header.approvedBy) {
                header.ledger.remove(it)
                ledgerRepository.deleteLedger(it.id)
            }
        }

        ledgerMap.findAll { key, l ->
            if(!l.added){
                l.header = header
                header.ledger.add(l)
            }
        }

        ledgerServices.save(header)

        new GraphQLRetVal<Boolean>(true,true,"OK")
    }


    @GraphQLQuery(name="findOneHeaderLedgerWithDate")
    HeaderLedger findOneHeaderLedgerWithDate(
            @GraphQLArgument(name='id') UUID id,
            @GraphQLArgument(name='transactionDateOnly') LocalDate transactionDateOnly
    ){
        ledgerServices.createQuery(""" Select h from  HeaderLedger h where h.transactionDateOnly = :transactionDateOnly and h.id = :id""")
                .setParameter('id',id)
                .setParameter('transactionDateOnly',transactionDateOnly)
                .singleResult
    }
}
