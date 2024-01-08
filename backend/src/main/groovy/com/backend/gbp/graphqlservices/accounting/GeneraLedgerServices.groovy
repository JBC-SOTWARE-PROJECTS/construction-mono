package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.Fiscal
import com.backend.gbp.domain.accounting.Ledger
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import groovy.json.JsonSlurper
import groovy.transform.Canonical
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.hibernate.query.NativeQuery
import org.hibernate.transform.Transformers
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.jdbc.core.JdbcTemplate
import org.springframework.stereotype.Component
import org.springframework.stereotype.Service

import javax.persistence.EntityManager
import java.time.Instant
import java.time.LocalDateTime
import java.time.ZoneOffset
import java.time.format.DateTimeFormatter

@Canonical
class  LedgerViewContainer {
    Page<Ledger> ledgerPage

    BigDecimal totalDebit = 0.0
    BigDecimal totalCredit = 0.0
}


@Canonical
class  LedgerView {
    List<Map<String,Object>> ledgerPage
    BigDecimal totalDebit = 0.0
    BigDecimal totalCredit = 0.0
}

@Canonical
class LedgerDownloadItem{
   String accountCode
   String accountTitle
   String journal
   String docNum
   String dateTime
   String reference
   String entity
   String particulars
   String created
   String approved
   String approvedDatetime
   BigDecimal debit
   BigDecimal credit

}

@Canonical
class GeneralLedgerListDto {
    String id
    String motherAccount
    String code
    String accountName
    BigDecimal debit
    BigDecimal credit
    BigDecimal netAmount
}


@Canonical
class GeneralLedgerDetailsParentDto{
    String id
    String code
    String account
    String content
}

@Canonical
class GeneralLedgerDetailsChildDto{
    String transaction_date
    String description
    BigDecimal debit
    BigDecimal credit
    BigDecimal running_balance
}

@Canonical
class GeneralLedgerDetailsListDto {
    String id
    String code
    String account
    List<Map<String,Object>> content
}

@Canonical
class LedgerListDto {
    String motherCode
    String motherAccountName
    String code
    String accountName
    String accountType
    String begDebit
    String begCredit
    String debit
    String credit
}

@Component
@Service
@GraphQLApi
class GeneralLedgerServices extends AbstractDaoService<Ledger> {
    GeneralLedgerServices( ) {
        super(Ledger.class)
    }
    @Autowired
    FiscalServices fiscalServices

    @Autowired
    JdbcTemplate jdbcTemplate

    @Autowired
    EntityManager entityManager

    List<Ledger> ledgerAllDownload(
            @GraphQLArgument(name ="journalType") String journalType,
            @GraphQLArgument(name = "fromDate")  Instant fromDate,
            @GraphQLArgument(name = "toDate")  Instant  toDate,
            @GraphQLArgument(name = "posted")  Boolean  posted
    ){

        if(posted){

            createQuery("""
      Select l   from Ledger l left join fetch l.header header where  header.transactionDate >= :fromDate and header.transactionDate <= :toDate  and
            ( header.journalType = :journalType or :journalType = 'ALL') and header.approvedBy is not null
         order by header.transactionDate ASC 
         """,
                    [
                            journalType: JournalType.valueOf(journalType),
                            fromDate: fromDate,
                            toDate: toDate
                    ]).resultList
        }
        else {
            createQuery("""
      Select l   from Ledger l left join fetch l.header header where  header.transactionDate >= :fromDate and header.transactionDate <= :toDate  and
            ( header.journalType = :journalType or :journalType = 'ALL')
         order by header.transactionDate ASC 
         """,
                    [
                            journalType: JournalType.valueOf(journalType),
                            fromDate: fromDate,
                            toDate: toDate
                    ]).resultList
        }

    }

    List<Ledger> ledgerViewListForDownload(
            @GraphQLArgument(name ="fiscalId") UUID fiscalId,
            @GraphQLArgument(name = "code")  String code,
            @GraphQLArgument(name = "monthNo")  Integer  monthNo,
            @GraphQLArgument(name = "filter")  String  filter
    ){

        Fiscal fiscal =  fiscalServices.findOne(fiscalId)

        LocalDateTime currentTargetStart = LocalDateTime.of(fiscal.toDate.getYear() ,monthNo,1,0,0,0,0)
        LocalDateTime currentTargetEnd = currentTargetStart.plusMonths(1).minusSeconds(1)



        createQuery("""
         from Ledger l  where function('jsonb_extract_path_text',l.journalAccount,'code') = :code and 
           l.header.transactionDate >= :fromDate and l.header.transactionDate <= :toDate and l.header.approvedDatetime is not null and
           l.header.fiscal = :fiscal and
            (
                lower(l.header.entityName) like lower(concat('%',:filter,'%')) or 
                lower(l.header.docnum) like lower(concat('%',:filter,'%'))  or  
                lower(l.header.particulars) like lower(concat('%',:filter,'%')) or  
                lower(l.header.invoiceSoaReference) like lower(concat('%',:filter,'%'))
           )
         order by l.header.transactionDate DESC 
         """,
                 [
                         fiscal:fiscal,
                         code:code,
                         filter:filter,
                         fromDate: currentTargetStart.toInstant(ZoneOffset.UTC),
                         toDate: currentTargetEnd.toInstant(ZoneOffset.UTC)
                 ]).resultList


    }

    @GraphQLQuery(name = "ledgerViewList", description = "Ledger View Listing")
    LedgerViewContainer ledgerViewList(
            @GraphQLArgument(name="fiscalId") UUID fiscalId,
            @GraphQLArgument(name = "code")  String code,
            @GraphQLArgument(name = "monthNo")  Integer  monthNo,
            @GraphQLArgument(name = "filter")  String  filter,
            @GraphQLArgument(name = "page")  Integer  page,
            @GraphQLArgument(name = "size")  Integer  size
    ){

        Fiscal fiscal =  fiscalServices.findOne(fiscalId)

        LocalDateTime currentTargetStart = LocalDateTime.of(fiscal.toDate.getYear() ,monthNo,1,0,0,0,0)
        LocalDateTime currentTargetEnd = currentTargetStart.plusMonths(1).minusSeconds(1)

        def pageable =   getPageable(
                """ from Ledger l  where function('jsonb_extract_path_text',l.journalAccount,'code') = :code and 
           l.header.transactionDate >= :fromDate and l.header.transactionDate <= :toDate and l.header.approvedDatetime is not null and
           l.header.fiscal = :fiscal and
            (
                lower(l.header.entityName) like lower(concat('%',:filter,'%')) or 
                lower(l.header.docnum) like lower(concat('%',:filter,'%'))  or  
                lower(l.header.particulars) like lower(concat('%',:filter,'%')) or  
                lower(l.header.invoiceSoaReference) like lower(concat('%',:filter,'%'))
           )
         order by l.header.transactionDate DESC 
""",
                """
           Select count(l)  from Ledger l  where function('jsonb_extract_path_text',l.journalAccount,'code') = :code and 
           l.header.transactionDate >= :fromDate and l.header.transactionDate <= :toDate and l.header.approvedDatetime is not null and
           l.header.fiscal = :fiscal and
            (
                lower(l.header.entityName) like lower(concat('%',:filter,'%')) or 
                lower(l.header.docnum) like lower(concat('%',:filter,'%'))  or  
                lower(l.header.particulars) like lower(concat('%',:filter,'%')) or  
                lower(l.header.invoiceSoaReference) like lower(concat('%',:filter,'%'))
           )
""",
                page,
                size,
                [
                        fiscal:fiscal,
                        code:code,
                        filter:filter,
                        fromDate: currentTargetStart.toInstant(ZoneOffset.UTC),
                        toDate: currentTargetEnd.toInstant(ZoneOffset.UTC)
                ]
        )



        BigDecimal totalDebit = 0.0
        BigDecimal totalCredit = 0.0


        def sumTotal= jdbcTemplate.queryForList("""
                select sum(l.debit) as totalDebit, sum(l.credit) as totalCredit from  accounting.ledger l 
                left join accounting.header_ledger hl  on hl.id = l."header" 
                where hl.transaction_date >= ? and  hl.transaction_date <= ? and hl.fiscal = ? and l.journal_account ->>'code' = ? and hl.approved_datetime is not null
                and (
                  hl.entity_name ilike concat('%',?,'%')  or 
                  hl.docnum  ilike concat('%',?,'%')   or 
                  hl.particulars ilike concat('%',?,'%') or 
                  hl.docnum  ilike concat('%',?,'%')
                )
""",                 java.sql.Timestamp.from(currentTargetStart.toInstant(ZoneOffset.UTC)),
                java.sql.Timestamp.from(currentTargetEnd.toInstant(ZoneOffset.UTC)),
                fiscal.id,code,
                filter,
                filter,
                filter,
                filter
        ).find()

        if(sumTotal){

            totalDebit = (BigDecimal)(sumTotal.get("totalDebit")?:0.0)
            totalCredit =  (BigDecimal)(sumTotal.get("totalCredit")?:0.0)

        }


        return new LedgerViewContainer(
                pageable,
                totalDebit,
                totalCredit
        )


    }


    @GraphQLQuery(name = "ledgerViewListV2", description = "Ledger View Listing")
    LedgerView ledgerViewListV2(
            @GraphQLArgument(name="fiscalId") UUID fiscalId,
            @GraphQLArgument(name = "code")  String code,
            @GraphQLArgument(name = "monthNo")  Integer  monthNo,
            @GraphQLArgument(name = "filter")  String  filter,
            @GraphQLArgument(name = "page")  Integer  page,
            @GraphQLArgument(name = "debitBegBal")  BigDecimal  debitBegBal,
            @GraphQLArgument(name = "creditBegBal")  BigDecimal  creditBegBal
    ) {
        Fiscal fiscal = fiscalServices.findOne(fiscalId)
        LocalDateTime currentTargetStart = LocalDateTime.of(fiscal.toDate.getYear(), monthNo, 1, 0, 0, 0, 0)
        LocalDateTime currentTargetEnd = currentTargetStart.plusMonths(1).minusSeconds(1)
        String strStart = DateTimeFormatter.ofPattern("yyyy-MM-dd").format(currentTargetStart)
        String strEnd = DateTimeFormatter.ofPattern("yyyy-MM-dd").format(currentTargetEnd)

        def list = jdbcTemplate.queryForList("""
                            select 
                                "rowNum",
                                "transactionDate",
                                "journalType",
                                "docType",
                                "invoiceSoaReference",
                                "entityName",
                                particulars,
                                debit,
                                credit,
                                balance
                            from 
                            (
                               select 
                                   "rowNum",
                                   "journalType",
                                   "docType",
                                   "invoiceSoaReference",
                                   "entityName",
                                   particulars,
                                   cast(? as date) as "transactionDate",
                                   debit,
                                   credit,
                                   sum(debit-credit) over (partition by code order by "rowNum") as balance
                               from 
                               (
                                   select 
                                   1 as "rowNum",
                                   '' as "journalType",
                                   '' as "docType",
                                   cast(? as date) as "transactionDate",
                                   '' as "invoiceSoaReference",
                                   'BEGINNING BALANCE' as "entityName",
                                   '' as particulars,
                                   cast(?::numeric as numeric) as "debit" , cast(?::numeric as numeric) as credit , ?::varchar as code 
                                   union all
                                   select 
                                    *
                                    from 
                                   (
                                       select 
                                           1+ row_number() over (order by hl.transaction_date asc) as "rowNum",
                                           hl.journal_type as "journalType",
                                           concat(hl.doctype,'-',hl.docnum) as "docType",
                                           hl.transaction_date::date as "transactionDate",
                                           hl.docnum  as "invoiceSoaReference",
                                           hl.entity_name as "entityName",
                                           hl.particulars as "particulars",
                                           l.debit ,
                                           l.credit ,
                                           l.journal_account->>'code' as code
                                       from accounting.ledger l 
                                       left join accounting.header_ledger hl on hl.id  = l."header" 
                                       where 
                                        l.journal_account->>'code' =  ?::varchar
                                       and 
                                        to_char(date(hl.transaction_date),'YYYY-MM-DD') between 
                                            cast(? as varchar)
                                        and 
                                            cast(? as varchar) 
                                        and
                                        hl.approved_datetime  is not null
                                        and
                                        hl.fiscal = ?
                                       order by hl.transaction_date
                                   ) as ledger_details
                               ) as ledger
                                union 
                               select 
                                   999999 as "rowNum",
                                   '' as "journalType",
                                   '' as "docType",
                                   '' as "invoiceSoaReference",
                                   'ENDING BALANCE' as "entityName",
                                   '' as particulars,
                                   cast(? as date) as transaction_date,
                                   '0' as debit,
                                   '0' as credit,
                                   (?::numeric-?::numeric)+sum(debit-credit) as balance
                               from accounting.ledger l 
                               left join accounting.header_ledger hl on hl.id  = l."header" 
                               where 
                                l.journal_account->>'code' = ?::varchar
                               and 
                               to_char(date(hl.transaction_date),'YYYY-MM-DD') between 
                                    cast(? as varchar)
                               and 
                                    cast(? as varchar)
                               and
                                hl.approved_datetime  is not null
                                and
                                hl.fiscal = ?
                               group by l.journal_account->>'code'
                            ) as sample
                            order by "rowNum" 
        """,
                strStart,
                strStart,
                debitBegBal,
                creditBegBal,
                code,
                code,
                strStart,
                strEnd,
                fiscalId,
                strEnd,
                debitBegBal,
                creditBegBal,
                code,
                strStart,
                strEnd,
                fiscalId)

        BigDecimal totalDebit = debitBegBal ?: 0.0
        BigDecimal totalCredit = creditBegBal ?: 0.0

        def sumTotal= jdbcTemplate.queryForList("""
                select sum(l.debit) as totalDebit, sum(l.credit) as totalCredit from  accounting.ledger l
                left join accounting.header_ledger hl  on hl.id = l."header"
                where hl.transaction_date >= ? and  hl.transaction_date <= ? and hl.fiscal = ? and l.journal_account ->>'code' = ? and hl.approved_datetime is not null
                and (
                  hl.entity_name ilike concat('%',?,'%')  or
                  hl.docnum  ilike concat('%',?,'%')   or
                  hl.particulars ilike concat('%',?,'%') or
                  hl.docnum  ilike concat('%',?,'%')
                )
            """,                 java.sql.Timestamp.from(currentTargetStart.toInstant(ZoneOffset.UTC)),
                java.sql.Timestamp.from(currentTargetEnd.toInstant(ZoneOffset.UTC)),
                fiscal.id,code,
                filter,
                filter,
                filter,
                filter
        ).find()

        if(sumTotal){
            totalDebit += (BigDecimal)(sumTotal.get("totalDebit")?:0.0)
            totalCredit +=  (BigDecimal)(sumTotal.get("totalCredit")?:0.0)
        }

        return new LedgerView(
                list,
                totalDebit,
                totalCredit
        )


    }

    @GraphQLQuery(name="getLedgerByHeaderId")
    List<Ledger> getLedgerByHeaderId(
            @GraphQLArgument(name="id") UUID id
    ){
        createQuery("""select l from Ledger l where l.header.id = :id """)
                .setParameter("id",id).resultList.sort{it.journalAccount.code}
    }

    @GraphQLQuery(name='generateGeneralLedgerSummary')
    List<GeneralLedgerListDto> generateGeneralLedgerSummary(
            @GraphQLArgument(name="accounts") List<String> accounts,
            @GraphQLArgument(name="startDate") String startDate,
            @GraphQLArgument(name="endDate") String endDate
    ){
        String query = """ select 
            CAST(uuid_generate_v4() AS TEXT) AS "id",
            TRIM(BOTH ' ' FROM l.journal_account -> 'motherAccount'->>'accountName')  as "accountName",
            TRIM(BOTH ' ' FROM l.journal_account -> 'motherAccount' ->> 'code') as "code",
            sum(l.debit) as "debit",
            sum(l.credit) as "credit",
            sum(l.debit) - sum(l.credit) as "netAmount"
            from accounting.ledger l 
            where
            l.transaction_date_only >= cast(:startDate as date) 
            and 
            l.transaction_date_only <= cast(:endDate as date)
            and l.approved_datetime  is not null
        """

        if(accounts) {
            def accountsStr = '(' + accounts.collect { "'$it'" }.join(', ') + ')'
            query += """ and TRIM(BOTH ' ' FROM l.journal_account -> 'motherAccount'->>'accountName') in ${accountsStr} """
        }

        List<GeneralLedgerListDto> ledger = entityManager.createNativeQuery("""
            ${query}
            group by TRIM(BOTH ' ' FROM l.journal_account -> 'motherAccount' ->> 'code'), TRIM(BOTH ' ' FROM l.journal_account -> 'motherAccount'->>'accountName')
            order by TRIM(BOTH ' ' FROM l.journal_account -> 'motherAccount'->>'accountName'),TRIM(BOTH ' ' FROM l.journal_account -> 'motherAccount' ->> 'code') asc 
        """)
                .setParameter('startDate',startDate)
                .setParameter('endDate',endDate)
                .unwrap(NativeQuery.class)
                .setResultTransformer(Transformers.aliasToBean(GeneralLedgerListDto.class))
                .getResultList();
        return ledger
    }

    @GraphQLQuery(name='generateGeneralLedgerDetailedSummary')
    List<GeneralLedgerListDto> generateGeneralLedgerDetailedSummary(
            @GraphQLArgument(name="account") String account,
            @GraphQLArgument(name="startDate") String startDate,
            @GraphQLArgument(name="endDate") String endDate
    ){
        List<GeneralLedgerListDto> ledger = entityManager.createNativeQuery("""
            select 
            CAST(uuid_generate_v4() AS TEXT) AS "id",
            TRIM(BOTH ' ' FROM l.journal_account -> 'motherAccount'->>'accountName')  as "motherAccount",
            l.journal_account ->> 'code' as "code",
            TRIM(BOTH ' ' FROM l.journal_account ->> 'accountName') as "accountName",
            sum(l.debit) as "debit",
            sum(l.credit) as "credit",
            sum(l.debit) - sum(l.credit) as "netAmount"
            from accounting.ledger l 
            where
            l.transaction_date_only >= cast(:startDate as date) 
            and 
            l.transaction_date_only <= cast(:endDate as date)
            and l.approved_datetime  is not null
            and TRIM(BOTH ' ' FROM l.journal_account -> 'motherAccount'->>'code') = :account
            group by l.journal_account ->> 'code',TRIM(BOTH ' ' FROM l.journal_account ->> 'accountName'), l.journal_account -> 'motherAccount'->>'accountName'
            order by TRIM(BOTH ' ' FROM l.journal_account ->> 'accountName') asc 
        """)
                .setParameter('startDate',startDate)
                .setParameter('endDate',endDate)
                .setParameter('account',account)
                .unwrap(NativeQuery.class)
                .setResultTransformer(Transformers.aliasToBean(GeneralLedgerListDto.class))
                .getResultList();
        return ledger
    }

    @GraphQLQuery(name='generateGeneralLedgerDetails')
    List<GeneralLedgerDetailsListDto> generateGeneralLedgerDetails(
            @GraphQLArgument(name="filter") String filter,
            @GraphQLArgument(name="account") String account,
            @GraphQLArgument(name="startDate") String startDate,
            @GraphQLArgument(name="endDate") String endDate
    ){

        List<GeneralLedgerDetailsListDto> ledger = entityManager.createNativeQuery("""
            WITH RunningBalances AS (
                SELECT
                    l.id,
                    TRIM(BOTH ' ' FROM l.journal_account ->> 'code') as "code",
                    TRIM(BOTH ' ' FROM l.journal_account ->> 'accountName') AS account,
                    hl.particulars AS description,
                    hl.docnum AS "reference",
                    CAST(hl.transaction_date_only AS VARCHAR) AS transaction_date,
                    l.debit,
                    l.credit,
                    l.created_date,
                    SUM(l.debit - l.credit) OVER (
                        PARTITION BY TRIM(BOTH ' ' FROM l.journal_account ->> 'accountName'),l.journal_account ->> 'code'
                        ORDER BY l.created_date
                    ) AS running_balance
                FROM accounting.ledger l
                LEFT JOIN accounting.header_ledger hl ON l."header" = hl.id
                WHERE
                    (hl.transaction_date_only >= CAST(:startDate AS DATE)
                    AND
                    hl.transaction_date_only <= CAST(:endDate AS DATE))
                    AND
                    (l.transaction_date_only >= CAST(:startDate AS DATE)
                    AND
                    l.transaction_date_only <= CAST(:endDate AS DATE))
                    AND TRIM(BOTH ' ' FROM l.journal_account ->> 'code') = :account
                    AND 
                    (lower(hl.particulars) like lower(concat('%',:filter,'%')) 
                    or lower(hl.docnum) like lower(concat('%',:filter,'%')))
            )
            SELECT
                CAST(uuid_generate_v4() AS TEXT) AS "id",
                code AS "code",
                account AS "account",
                CAST(
                    CAST(json_agg(
                        jsonb_build_object(
                            'id', CAST(id AS TEXT),
                            'description', description,
                            'reference',reference,
                            'transaction_date', transaction_date,
                            'debit', debit,
                            'credit', credit,
                            'running_balance', running_balance
                        ) ORDER BY created_date
                    ) AS jsonb) ||
                    CAST(
                        jsonb_build_object(
                            'id', CAST(uuid_generate_v4() AS TEXT),
                            'description', 'TOTAL',
                            'transaction_date', CONCAT('TOTAL ACCOUNTS ',account),
                            'debit',sum(debit),
                            'credit',sum(credit),
                            'running_balance', sum(debit) - sum(credit)
                        )
                    AS jsonb)
                    AS TEXT
                ) AS "content"
            FROM RunningBalances
            GROUP BY account, code
            ORDER BY account, code DESC;
        """)
                .setParameter('startDate',startDate)
                .setParameter('endDate',endDate)
                .setParameter('account',account)
                .setParameter('filter',filter)
                .unwrap(NativeQuery.class)
                .setResultTransformer(Transformers.aliasToBean(GeneralLedgerDetailsParentDto.class))
                .getResultList()

        List<GeneralLedgerDetailsListDto> listDto = []
        ledger.each {
            it ->
                listDto.push(new GeneralLedgerDetailsListDto(it.id, it.code, it.account, new JsonSlurper().parseText(it.content) as List<Map<String, Object>>))
        }

        return listDto
    }

}
