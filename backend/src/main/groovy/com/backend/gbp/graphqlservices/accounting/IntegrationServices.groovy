package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.SubAccountHolder
import com.backend.gbp.domain.accounting.CoaPattern
import com.backend.gbp.domain.accounting.DomainEnum
import com.backend.gbp.domain.accounting.HeaderLedger
import com.backend.gbp.domain.accounting.Integration
import com.backend.gbp.domain.accounting.IntegrationDomainEnum
import com.backend.gbp.domain.accounting.IntegrationItem
import com.backend.gbp.domain.accounting.JournalType
import com.backend.gbp.domain.accounting.Ledger
import com.backend.gbp.domain.accounting.LedgerDocType
import com.backend.gbp.domain.accounting.ParentAccount
import com.backend.gbp.domain.types.AutoIntegrateable
import com.backend.gbp.domain.types.Subaccountable
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.repository.UserRepository
import com.backend.gbp.security.SecurityUtils
import com.backend.gbp.services.EntityObjectMapperService
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.BooleanUtils
import org.apache.commons.lang3.StringUtils
import org.reflections.ReflectionUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

import javax.persistence.EntityManager
import javax.persistence.PersistenceContext
import java.lang.reflect.Field
import java.time.Instant
import java.time.ZoneOffset

interface AutoIntegrateableInitilizer<T extends AutoIntegrateable> {

    def void init(T autoIntegrateable,List<List<T>> multiple)

}
@Service
@GraphQLApi
class IntegrationServices extends AbstractDaoService<Integration> {


    IntegrationServices() {
        super(Integration.class)
    }


    @Autowired
    SubAccountSetupService subAccountSetupService

    @Autowired
    EntityObjectMapperService entityObjectMapperService

    @Autowired
    UserRepository userRepository

    @PersistenceContext
    EntityManager entityManager

    @Autowired
    ParentAccountServices parentAccountServices



   def  <T extends AutoIntegrateable>  HeaderLedger generateAutoEntries(T autoIntegrateable, AutoIntegrateableInitilizer<T> init){


        List<List<T>> multipleData= []
        init.init(autoIntegrateable,multipleData)

        String tagValue = autoIntegrateable.flagValue


        if(StringUtils.isBlank(tagValue))
            throw  new Exception("TagValue is not found")


//        List<Integration> matchList = getIntegrationByDomainAndTagValueList(autoIntegrateable.domain,autoIntegrateable.flagValue)
       Integration match = getIntegrationByDomainAndTagValue(IntegrationDomainEnum.valueOf(autoIntegrateable.domain),autoIntegrateable.flagValue)
        if(!match)
            throw  new Exception("No Integration Rules for ${autoIntegrateable.domain} and ${autoIntegrateable.flagValue}")


        //validating entries

        match.integrationItems.findAll { BooleanUtils.isNotTrue(it.multiple) }. each { item->


            // validate sourceColumn
            if(StringUtils.isBlank(item.sourceColumn)){
                throw new Exception("Source Column not specified for ${item.journalAccount.subAccountName}")
            }


            // validate if source column is not null
            Object srcColValue = autoIntegrateable[item.sourceColumn]
            if(srcColValue==null){
                throw new Exception("Source Column Value for ${item.journalAccount.subAccountName} is null")
            }


            String subAccountCode =  item.journalAccount?.subAccount?.code
             if(StringUtils.equalsIgnoreCase(subAccountCode,"####")){
                 // needs parameter
                 String domain = item.journalAccount.subAccount.domain
                 String param = item.details[domain]
                 if(StringUtils.isBlank(param))
                 {
                     throw new Exception("Parameter required for ${domain}")
                 }

                 Object paramValue = autoIntegrateable[param]

                 if(!paramValue){
                     throw new Exception("Parameter ${param} needs a Value")
                 }

             }

            String subSubAccountCode = item.journalAccount?.subSubAccount?.code
            if(StringUtils.equalsIgnoreCase(subSubAccountCode,"####")){
                // needs parameter
                String domain = item.journalAccount.subSubAccount.domain
                String param = item.details[domain]
                if(StringUtils.isBlank(param))
                {
                    throw new Exception("Parameter required for ${domain}")
                }

                Object paramValue = autoIntegrateable[param]

                if(!paramValue){
                    throw new Exception("Parameter ${param} needs a Value")
                }

            }
        }

        // Generate the entries

        HeaderLedger header = new HeaderLedger()
        header.transactionDate = Instant.now()
        header.transactionDateOnly = header.transactionDate.atOffset(ZoneOffset.UTC).plusHours(8).toLocalDate()

        // Values correspond to Temporary Entry
        header.docType = LedgerDocType.XX
        header.journalType = JournalType.XXXX
        header.docnum = "AUTO"

        autoIntegrateable.details.each { k,v ->
            header.details.put(k,v)
        }

        match.integrationItems.findAll { BooleanUtils.isNotTrue(it.multiple) }.each { item ->
            Ledger ledger = new Ledger()
            ledger.company = SecurityUtils.currentCompany()
            ledger.transactionDateOnly = header.transactionDateOnly
            def coa =   createCoaFromItem(autoIntegrateable,item)

            ledger.debit = 0.0
            ledger.credit = 0.0

            String normalSide = item.journalAccount.motherAccount.normalSide
            BigDecimal value = (BigDecimal)autoIntegrateable[item.sourceColumn]
            if(normalSide == "DEBIT"){
                 if(value >= 0){
                     ledger.debit = value
                 }
                else {
                     ledger.credit = value.abs()
                 }
            }
            else {
                if(value >= 0){
                    ledger.credit = value
                }
                else {
                    ledger.debit = value.abs()
                }
            }

            ledger.journalAccount = coa

            ledger.header = header

            if(!(ledger.debit == 0.0 && ledger.credit == 0.0))
            header.ledger << ledger
        }

       match.integrationItems.findAll { BooleanUtils.isTrue(it.multiple) }.eachWithIndex { IntegrationItem entry, int i ->

           if(i < multipleData.size()){

                 def dataForItem = multipleData.get(i)


                 dataForItem.each {tmpAutoIntegrateable ->

                     Ledger ledger = new Ledger()
                     ledger.transactionDateOnly = header.transactionDateOnly
                     def coa =   createCoaFromItem(tmpAutoIntegrateable,entry)

                     ledger.debit = 0.0
                     ledger.credit = 0.0

                     String normalSide = entry.journalAccount.motherAccount.normalSide
                     BigDecimal value = (BigDecimal)tmpAutoIntegrateable[entry.sourceColumn]
                     //println(coa.code + " : => " + value.toPlainString() + " : " + normalSide + " - " + entry.sourceColumn)
                     if(normalSide == "DEBIT"){
                         if(value >= 0){
                             ledger.debit = value
                         }
                         else {
                             ledger.credit = value.abs()
                         }
                     }
                     else {
                         if(value >= 0){
                             ledger.credit = value
                         }
                         else {
                             ledger.debit = value.abs()
                         }
                     }

                     ledger.journalAccount = coa

                     ledger.header = header

                     if(!(ledger.debit == 0.0 && ledger.credit == 0.0))
                         header.ledger << ledger

                 }

             }
       }

        return  header
    }

      ChartOfAccountGenerate  createCoaFromItem(AutoIntegrateable autoIntegrateable,IntegrationItem item) {


        ChartOfAccountGenerate coa = new ChartOfAccountGenerate()
        coa.motherAccount = item.journalAccount.motherAccount

        // Testing for SubAccount

        String subAccountCode =  item.journalAccount?.subAccount?.code

        if(StringUtils.equalsIgnoreCase(subAccountCode,"####")){
            // needs parameter
            String domain = item.journalAccount.subAccount.domain

            // its not a department will look for a parameter
            String param = item.details[domain]
            Subaccountable paramValue = (Subaccountable) autoIntegrateable[param]


            if(paramValue instanceof SubAccountHolder)
            {
                // this is from a subaccountHolder

                String targetDomain = domain
                UUID targetId = paramValue.id

                if(!targetId)
                    throw new Exception("Subaccount holder id not found")

                Subaccountable realValue = entityManager.find(Class.forName(targetDomain),targetId)

                if(!realValue)
                    throw new Exception("Subaccount holder instance not found ${targetId.toString()} - ${targetDomain}")

                coa.subAccount = new CoaComponentContainer(realValue.code,
                        realValue.id,
                        realValue.accountName,
                        realValue.domain,
                        ""
                )

            }else {
                coa.subAccount = new CoaComponentContainer(paramValue.code,
                        paramValue.id,
                        paramValue.accountName,
                        paramValue.domain,
                        ""
                )
            }
        }
        else {

            // just copy
            coa.subAccount = new CoaComponentContainer( item.journalAccount.subAccount.code,
                    item.journalAccount.subAccount.id,
                    item.journalAccount.subAccount.accountName,
                    item.journalAccount.subAccount.domain,
                    ""
            )
        }



        String subSubAccountCode =  item.journalAccount?.subSubAccount?.code

        if(StringUtils.equalsIgnoreCase(subSubAccountCode,"####")){
            // needs parameter
            String domain = item.journalAccount.subSubAccount.domain
            String param = item.details[domain]
            Subaccountable paramValue = (Subaccountable) autoIntegrateable[param]

            if(paramValue instanceof SubAccountHolder)
            {
                // this is from a subaccountHolder

                String targetDomain = domain
                UUID targetId = paramValue.id

                if(!targetId)
                    throw new Exception("Subaccount holder id not found")

                Subaccountable realValue = entityManager.find(Class.forName(targetDomain),targetId)

                if(!realValue)
                    throw new Exception("Subaccount holder instance not found ${targetId.toString()} - ${targetDomain}")

                coa.subSubAccount = new CoaComponentContainer(realValue.code,
                        realValue.id,
                        realValue.accountName,
                        realValue.domain,
                        ""
                )

            }else {
                coa.subSubAccount = new CoaComponentContainer(paramValue.code,
                        paramValue.id,
                        paramValue.accountName,
                        paramValue.domain,
                        ""
                )
            }

        }else {

            // just copy
            coa.subSubAccount = new CoaComponentContainer( item.journalAccount.subSubAccount.code,
                    item.journalAccount.subSubAccount.id,
                    item.journalAccount.subSubAccount.accountName,
                    item.journalAccount.subSubAccount.domain,
                    ""
            )
        }
        return coa
    }



    Integration getIntegrationByDomainAndTagValue(IntegrationDomainEnum domain,String tagValue){
        createQuery("from Integration i where i.domain = :domain and i.flagValue=:flagValue order by i.orderPriority ",
        [flagValue:tagValue,
         domain: domain])
        .setMaxResults(1)
        .resultList.find()
    }

    List<Integration> getIntegrationByDomainAndTagValueList(String domain,String tagValue){
        createQuery("from Integration i where i.domain=:domain and i.flagValue=:flagValue order by i.orderPriority ",
                [flagValue:tagValue,
                 domain:domain])
                .resultList
    }

    @GraphQLQuery(name = "getStringFieldsFromDomain")
    static List<String> getStringFieldsFromDomain(
            @GraphQLArgument(name = "domain") IntegrationDomainEnum domain
    ) {
        def classType = Class.forName(domain.path)
        Set<Field> fields = ReflectionUtils.getAllFields(classType,ReflectionUtils.withTypeAssignableTo(String.class))

        fields.collect {
              it.name
        }.toSorted {
            a,b ->
                a <=> b
        }

    }

    @GraphQLQuery(name = "getBigDecimalFieldsFromDomain")
    static List<String> getBigDecimalFieldsFromDomain(
            @GraphQLArgument(name = "domain") IntegrationDomainEnum domain
    ) {
        def classType = Class.forName(domain.path)
        Set<Field> fields = ReflectionUtils.getAllFields(classType,ReflectionUtils.withTypeAssignableTo(BigDecimal.class))

        fields.collect {
            it.name
        }.toSorted {
            a,b ->
                a <=> b
        }

    }


    @GraphQLQuery(name = "getSpecificFieldsFromDomain")
    static List<String> getSpecificFieldsFromDomain(
            @GraphQLArgument(name = "domain") IntegrationDomainEnum domain,
            @GraphQLArgument(name = "target") String target
    ) {
        def classType = Class.forName(domain.path)

        Set<Field> fields = ReflectionUtils.getAllFields(classType,ReflectionUtils.withTypeAssignableTo(Subaccountable))
        fields.findAll {it.type.name == target}.collect {
             it.name
        }.toSorted {
            a,b ->
                a <=> b
        }

    }



    @GraphQLQuery(name = "integrationList", description = "Integration List")
    List<Integration> integrationList() {
        findAll().sort { it.orderPriority }
    }

    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation(name = "addSubAccountToIntegration")
    Boolean addSubAccountToIntegration(
            @GraphQLArgument(name = "id") UUID id,
            @GraphQLArgument(name = "accountId") UUID accountId

    ) {
        def parentAccount = null
        def subAccountSetup = subAccountSetupService.findOne(accountId)
        if(!subAccountSetup)
            parentAccount = parentAccountServices.findOne(accountId)

        def integration =  findOne(id)
        CoaPattern pattern = new CoaPattern()
        if(parentAccount){
            pattern.motherAccount.normalSide = parentAccount.normalSide.name()
            pattern.motherAccount.id = parentAccount.id
            pattern.motherAccount.code= parentAccount.accountCode
            pattern.motherAccount.accountName =parentAccount.accountName
            pattern.motherAccount.domain = parentAccount.class.name.split("\\\$")[0]

        }else {
            pattern.subAccountSetupId = subAccountSetup.id
            pattern.subAccountName = subAccountSetup.accountName
            pattern.motherAccount.normalSide = subAccountSetup.parentAccount.normalSide.name()
            pattern.motherAccount.id = subAccountSetup.parentAccount.id
            pattern.motherAccount.code = subAccountSetup.parentAccount.accountCode
            pattern.motherAccount.accountName = subAccountSetup.parentAccount.accountName
            pattern.motherAccount.domain = subAccountSetup.parentAccount.class.name.split("\\\$")[0]



            if (StringUtils.isNotBlank(subAccountSetup.sourceDomain.path)) {

                if (!(subAccountSetup.subaccountParent)) {
                    pattern.subAccount.id = UUID.randomUUID()
                    pattern.subAccount.code = "####"
                    pattern.subAccount.accountName = subAccountSetup.accountName
                    pattern.subAccount.domain = subAccountSetup.sourceDomain.path
                } else {
                    if (subAccountSetup.subaccountParent) {

                        pattern.subAccount.id = subAccountSetup.subaccountParent.id
                        pattern.subAccount.code = subAccountSetup.subaccountParent.subaccountCode
                        pattern.subAccount.accountName = subAccountSetup.subaccountParent.accountName
                        pattern.subAccount.domain = subAccountSetup.subaccountParent.sourceDomain.path

                        pattern.subSubAccount.id = UUID.randomUUID()
                        pattern.subSubAccount.code = "####"
                        pattern.subSubAccount.accountName = subAccountSetup.accountName
                        pattern.subSubAccount.domain = subAccountSetup.sourceDomain.path
                    }
                }

            } else {
                if (!(subAccountSetup.subaccountParent)) {
                    // not 3rd level
                    pattern.subAccount.id = subAccountSetup.id
                    pattern.subAccount.code = subAccountSetup.subaccountCode
                    pattern.subAccount.accountName = subAccountSetup.accountName
                    pattern.subAccount.domain = subAccountSetup.sourceDomain.path
                } else {
                    if (subAccountSetup.subaccountParent) {
                        pattern.subAccount.id = subAccountSetup.subaccountParent.id
                        pattern.subAccount.code = subAccountSetup.subaccountParent.subaccountCode
                        pattern.subAccount.accountName = subAccountSetup.subaccountParent.accountName
                        pattern.subAccount.domain = subAccountSetup.subaccountParent.sourceDomain.path


                        pattern.subSubAccount.id = subAccountSetup.id
                        pattern.subSubAccount.code = subAccountSetup.subaccountCode
                        pattern.subSubAccount.accountName = subAccountSetup.accountName
                        pattern.subSubAccount.domain = subAccountSetup.sourceDomain.path
                    }
                }
            }
        }
        IntegrationItem integrationItem = new IntegrationItem()
        integrationItem.integration = integration
        integrationItem.journalAccount = pattern
        integrationItem.company = SecurityUtils.currentCompany()
        integration.integrationItems << integrationItem
        save(integration)
        true
    }

    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation(name = "upsertIntegration", description = "insert Integrations")
    Boolean upsertIntegration(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ) {
        upsertFromMap(id, fields, { Integration entity, boolean forInsert ->

            if(forInsert) {
                entity.orderPriority = 0
                entity.company = SecurityUtils.currentCompany()
            }

        })

        if(fields.containsKey("reload"))
            return true


        return false
    }

    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation(name = "deleteIntegration", description = "insert Integrations")
    Boolean deleteIntegration(  @GraphQLArgument(name = "integrationId") UUID integrationId){
        def integration = findOne(integrationId)
        delete(integration)
        true
    }

    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation(name = "deleteIntegrationItem", description = "insert Integrations")
    Boolean deleteIntegrationItem(
            @GraphQLArgument(name = "integrationId") UUID integrationId,
            @GraphQLArgument(name = "integrationItemId") UUID integrationItemId
    ) {
        def integration = findOne(integrationId)

       integration.integrationItems.removeAll { IntegrationItem item->
            item.id == integrationItemId
        }

        save(integration)
         return true
    }
    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation(name = "updateIntegrationItem", description = "insert Integrations")
    Boolean upsertIntegrationItem(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "integrationId") UUID integrationId,
            @GraphQLArgument(name = "integrationItemId") UUID integrationItemId
    ) {

        def integration = findOne(integrationId)

        def item = integration.integrationItems.find { IntegrationItem item->
             item.id == integrationItemId
        }

        if(item){
            Map<String,String> tmp = [:]

            item.details.each {k,v ->
                tmp.put(k,v)
            }
            updateFromMap(item,fields)

            tmp.each { k,v ->
                     if(!item.details.containsKey(k))
                         item.details[k] = v
             }

        }

        save(integration)

        if(fields.containsKey("reload"))
            return true


        return false
    }


    @GraphQLQuery(name="integrationById")
    Integration integrationById(
            @GraphQLArgument(name="id") UUID id
    ){
        try{
            findOne(id)
        }
        catch (ignored){
            return null
        }
    }

    @GraphQLMutation(name="transferIntegration")
    Boolean transferIntegration(
            @GraphQLArgument(name="id") UUID id,
            @GraphQLArgument(name="fields") Map<String,Object> fields
    ){
        if(id && fields){
            upsertIntegration(fields,id)
            return true
        }
        return false
    }


    @GraphQLQuery(name='integrationDomains')
    static List<DomainOptionDto> integrationDomains(){
        return IntegrationDomainEnum.values().findAll { it != IntegrationDomainEnum.NO_DOMAIN } .collect { [label: it.displayName, value: it.name()] as DomainOptionDto }
    }

}
