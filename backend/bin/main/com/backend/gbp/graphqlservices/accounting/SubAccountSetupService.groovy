package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.AccountCategory
import com.backend.gbp.domain.accounting.DomainEnum
import com.backend.gbp.domain.accounting.ParentAccount
import com.backend.gbp.domain.accounting.SubAccountSetup
import com.backend.gbp.domain.types.AutoIntegrateable
import com.backend.gbp.domain.types.Subaccountable
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.graphqlservices.types.GraphQLRetVal
import com.backend.gbp.security.SecurityUtils
import com.backend.gbp.services.requestscope.ChartofAccountGenerator
import groovy.transform.Canonical
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLContext
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import org.apache.commons.lang3.BooleanUtils
import org.apache.commons.lang3.StringUtils
import org.reflections.Reflections
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

import javax.persistence.EntityManager

@Canonical
class DomainOptionDto {
    String label
    String value
}

@Canonical
class CoaComponentContainer implements Serializable{

    @GraphQLQuery
    String code

    @GraphQLQuery
    UUID id

    @GraphQLQuery
    String description

    @GraphQLQuery
    String domain

    @GraphQLQuery
    String normalSide // DEBIT/CREDIT applicable to Mother account only
}

@Canonical
class ChartOfAccountGenerate implements Serializable{

    CoaComponentContainer motherAccount
    CoaComponentContainer subAccount
    CoaComponentContainer subSubAccount

    String accountType
    String accountCategory

    Boolean fromGenerator

    String code
    String getCode(){

        String concat = ""
            concat = StringUtils.defaultIfEmpty(motherAccount?.code,"0000")
            concat += "-" + StringUtils.defaultIfEmpty(subAccount?.code,"0000")
            concat += "-" + StringUtils.defaultIfEmpty(subSubAccount?.code,"0000")
        return concat
    }

    String description
    String getDescription(){

        String concat = ""
        concat = StringUtils.defaultIfEmpty(motherAccount?.description,"")

        if(subAccount?.description)
        concat += "-" + subAccount?.description?:""

        if(subSubAccount?.description)
        concat += "-" + subSubAccount?.description?:""

        return concat
    }

}

@Service
@GraphQLApi
class SubAccountSetupService extends AbstractDaoService<SubAccountSetup> {

    @Autowired
    ParentAccountServices parentAccountServices

    @Autowired
    EntityManager entityManager

    @Autowired
    ChartofAccountGenerator chartofAccountGenerator

    SubAccountSetupService( ) {
        super(SubAccountSetup.class)

    }



    @GraphQLQuery(name = "getAllChartOfAccountGenerate")
    List<ChartOfAccountGenerate> getAllChartOfAccountGenerate(
            @GraphQLArgument(name = "accountType")    String accountType,
            @GraphQLArgument(name = "motherAccountCode")  String motherAccountCode,
            @GraphQLArgument(name = "description") String description,
            @GraphQLArgument(name = "subaccountType") String subaccountType,
            @GraphQLArgument(name = "department") String department,
            @GraphQLArgument(name = "excludeMotherAccount") Boolean excludeMotherAccount=false
    ) { // department flatten code

       def a =  chartofAccountGenerator.getAllChartOfAccountGenerate(accountType,
        motherAccountCode,
        description,
        subaccountType,
        department,
        excludeMotherAccount)

        /*
         Yaw lang kay sagbot sa logs hehehe
        a =  chartofAccountGenerator.getAllChartOfAccountGenerate(accountType,
                motherAccountCode,
                description,
                subaccountType,
                department,
                excludeMotherAccount)

        a =  chartofAccountGenerator.getAllChartOfAccountGenerate(accountType,
                motherAccountCode,
                description,
                subaccountType,
                department,
                excludeMotherAccount)

        a =  chartofAccountGenerator.getAllChartOfAccountGenerate(accountType,
                motherAccountCode,
                description,
                subaccountType,
                department,
                excludeMotherAccount)
        */
        a

    }


    @GraphQLQuery(name = "motherAccountsListWithNoSetup")
    List<ParentAccount> motherAccountsListWithNoSetup(){
        List<ParentAccount> result = []
        Set<String> usedMotherAccount = []
        def subaccountSetups = getSetupBySubAccountTypeAll()

        subaccountSetups.each {

            it.motherAccounts.each {
                usedMotherAccount.add(it.chartOfAccount.accountCode)
            }
        }




        chartOfAccountServices.findAll().findAll {BooleanUtils.isNotTrue(it.deprecated)  }.each {
            if(!usedMotherAccount.contains(it.accountCode))
                result << it
        }

        result
    }

    @GraphQLQuery(name = "motherAccountsList")
    List<String> motherAccountsList(
            @GraphQLContext  SubAccountSetup subAccountSetup
    ) {

        List<String> ms = []

        subAccountSetup.motherAccounts.each {
            ms << it.chartOfAccount.accountCode + "-" + it.chartOfAccount.description
        }

        ms
    }


    SubAccountSetup getSetupBySubAccountByCode(
            String code
    ) {

        createQuery("Select sub from SubAccountSetup sub  where sub.subaccountCode=:code order by sub.subaccountCode, sub.createdDate",
                [code: code])
                .resultList.find()
    }

    @GraphQLQuery(name = "subAccountByAccountType")
    List<SubAccountSetup> getSetupBySubAccountType(
            @GraphQLArgument(name = "accountCategory") AccountCategory accountCategory,
            @GraphQLArgument(name = "filter") String filter = ''

    ) {
        String query = """ Select sub from SubAccountSetup sub  where 
            (
                lower(sub.accountName) like lower(concat('%',:filter,'%'))
                or lower(sub.subaccountCode) like lower(concat('%',:filter,'%'))
            )  """
        Map<String,Object> params = [:]
        params['filter'] = filter

        if(accountCategory){
            query += """and sub.accountCategory = :accountCategory """
            params['accountCategory'] = accountCategory
        }

        createQuery("""
            ${query}
            order by sub.subaccountCode, sub.createdDate
        """, params).resultList
    }

    @GraphQLQuery(name = "getSetupBySubAccountTypeAll")
    List<SubAccountSetup> getSetupBySubAccountTypeAll() {
        createQuery("Select sub from SubAccountSetup sub  where coalesce(sub.attrInactive,false) = false   order by sub.description, sub.createdDate",
                [:])
                .resultList
    }

    @GraphQLQuery(name = "subaccountTypeAll")
    List<Map<String,String>> subaccountTypeAll() {
       return SubAccountType.values().collect {
             ["name":getDescSubaccountType(it),
              "value":it.name()]
       }
    }


    @GraphQLQuery(name = "subaccountTypeDesc")
    String subaccountTypeDesc(@GraphQLContext SubAccountSetup subAccountSetup ) {
        return getDescSubaccountType(subAccountSetup.subaccountType)
    }

    @GraphQLQuery(name = "getSubAccountForParent")
    List<SubAccountSetup> getSubAccountForParent(
            @GraphQLArgument(name = "parentAccountId") UUID parentAccountId
    ) {
        createQuery("""Select sub from SubAccountSetup sub  
            where sub.parentAccount.id = :parentAccountId and sub.subaccountParent is null order by sub.subaccountCode, sub.createdDate""",
                [parentAccountId:parentAccountId])
                .resultList
    }

    List<SubAccountSetup> getActiveSubAccount( ) {
        createQuery("Select sub from SubAccountSetup sub  where (sub.attrInactive is null or sub.attrInactive=false)  order by sub.subaccountCode, sub.createdDate",[:])
                .resultList
    }


    @GraphQLQuery(name = "getAutoIntegrateableFromDomain")
    static List<String> getAutoIntegrateableFromDomain(

    ) {

        Reflections reflections = new Reflections("com.hisd3.hismk2.domain")
        Set<Class<? extends AutoIntegrateable>> subTypes = reflections.getSubTypesOf(AutoIntegrateable.class)

        subTypes.collect {
            it.name
        }

    }

    @GraphQLQuery(name = "getFlattenDepartment")
    List<Subaccountable> getFlattenDepartment(){
          departmentService.findAllSortedByCodeAndFlatten(null)
    }




    @Transactional(rollbackFor = Exception.class)
    @GraphQLMutation(name = "upsertSubAccount")
    GraphQLRetVal<SubAccountSetup> upsertSubAccount(
            @GraphQLArgument(name = "fields") Map<String, Object> fields,
            @GraphQLArgument(name = "id") UUID id
    ) {
        try{
           def entity = upsertFromMap(id, fields, { SubAccountSetup entity, boolean forInsert ->
                if(forInsert){
                    entity.company = SecurityUtils.currentCompany()
                }
                entity.accountName = (entity?.accountName ?: '').toUpperCase()
                entity.subaccountCode = (entity?.subaccountCode ?: '').toUpperCase()
                entity.subaccountType = entity.parentAccount.accountType
                entity.accountCategory = entity.parentAccount.accountCategory
                if(entity.sourceDomain != DomainEnum.NO_DOMAIN){

                    if(entity.subaccountParent){
                        entity.subaccountCode = entity.subaccountParent.subaccountCode+" - "+("${entity.sourceDomain.displayName} Code").toUpperCase()
                        entity.accountName = entity.subaccountParent.accountName+" - "+(entity.sourceDomain.displayName).toUpperCase()
                    }
                    else {
                        entity.subaccountCode = ("${entity.sourceDomain.displayName} Code").toUpperCase()
                        entity.accountName = (entity.sourceDomain.displayName).toUpperCase()
                    }

                }
            })

            save(entity)

            return  new GraphQLRetVal<SubAccountSetup>(entity,true,'Your changes have been saved.')
        }catch (e){
            if(e?.cause['constraintName'] == 'constraint_code_unique')
                return  new GraphQLRetVal<SubAccountSetup>(new SubAccountSetup(),false,'Code Duplication Detected.')
            else
                return  new GraphQLRetVal<SubAccountSetup>(new SubAccountSetup(),false,'An error occurred while attempting to save the record.')
        }
    }

    @GraphQLQuery(name='subAccountDomains')
    static List<DomainOptionDto> subAccountDomains(){
        return DomainEnum.values().findAll { it != DomainEnum.NO_DOMAIN } .collect { [label: it.displayName, value: it.name()] as DomainOptionDto }
    }
}
