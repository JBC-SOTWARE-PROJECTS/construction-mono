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
    String key = ''
}

@Canonical
class CoaComponentContainer implements Serializable{

    @GraphQLQuery
    String code

    @GraphQLQuery
    UUID id

    @GraphQLQuery
    String accountName

    @GraphQLQuery
    String domain

    @GraphQLQuery
    String normalSide // DEBIT/CREDIT applicable to Mother account only

    @GraphQLQuery
    String accountType

    @GraphQLQuery
    String accountCategory
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

    String accountName
    String getAccountName(){

        String concat = ""
        concat = StringUtils.defaultIfEmpty(motherAccount?.accountName,"")

        if(subAccount?.accountName)
        concat += "-" + subAccount?.accountName?:""

        if(subSubAccount?.accountName)
        concat += "-" + subSubAccount?.accountName?:""

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


    // [USED]
    @GraphQLQuery(name = "getAllChartOfAccountGenerate")
    List<ChartOfAccountGenerate> getAllChartOfAccountGenerate(
            @GraphQLArgument(name = "accountType")    String accountType,
            @GraphQLArgument(name = "motherAccountCode")  String motherAccountCode,
            @GraphQLArgument(name = "accountName") String accountName,
            @GraphQLArgument(name = "subaccountType") String subaccountType,
            @GraphQLArgument(name = "department") String department,
            @GraphQLArgument(name = "accountCategory") String accountCategory,
            @GraphQLArgument(name = "excludeMotherAccount") Boolean excludeMotherAccount=false
    ) {

       return chartofAccountGenerator.getAllChartOfAccountGenerate(accountType,
        motherAccountCode,
        accountName,
        subaccountType,
        department,
        accountCategory,
        excludeMotherAccount)
    }


    // [USED]
    @GraphQLQuery(name = "subAccountByAccountType")
    List<SubAccountSetup> getSetupBySubAccountType(
            @GraphQLArgument(name = "accountCategory") AccountCategory accountCategory,
            @GraphQLArgument(name = "filter") String filter = ''

    ) {
        UUID companyID = SecurityUtils.currentCompanyId()
        String query = """ Select sub from SubAccountSetup sub  where 
            sub.company.id = :companyID and
            (
                lower(sub.accountName) like lower(concat('%',:filter,'%'))
                or lower(sub.subaccountCode) like lower(concat('%',:filter,'%'))
            )  """
        Map<String,Object> params = [:]
        params['filter'] = filter
        params['companyID'] = companyID

        if(accountCategory){
            query += """and sub.accountCategory = :accountCategory """
            params['accountCategory'] = accountCategory
        }

        createQuery("""
            ${query}
            order by sub.subaccountCode, sub.createdDate
        """, params).resultList
    }

    // [USED]
    @GraphQLQuery(name = "getSetupBySubAccountTypeAll")
    List<SubAccountSetup> getSetupBySubAccountTypeAll() {
        UUID companyID = SecurityUtils.currentCompanyId()
        createQuery("""
            Select sub from SubAccountSetup sub  
            left join fetch sub.subaccountParent
            left join fetch sub.company
            where 
            sub.company.id = :companyID and 
            coalesce(sub.isInactive,false) = false   
            order by sub.description, sub.createdDate""",
                [
                    companyID:companyID
                ])
                .resultList
    }

    @GraphQLQuery(name = "getAllCOAParent")
    List<DomainOptionDto> getAllCOAParent() {
        List<DomainOptionDto> dtoList = []
        List<SubAccountSetup> setupList = getSetupBySubAccountTypeAll()
        List<ParentAccount> parentAccounts = parentAccountServices.getParentAccountList()

        Map<UUID,UUID> parentHasChild = [:]
        Map<UUID,UUID> subHasChild = [:]
        setupList.each {
            if(!parentHasChild[it?.parentAccount?.id])
                parentHasChild[it.parentAccount.id] = it.parentAccount.id
            if(!subHasChild[it?.subaccountParent?.id]  && it?.subaccountParent?.id)
                subHasChild[it.subaccountParent.id] = it.subaccountParent.id
        }

        parentAccounts.each {
            if(!parentHasChild[it.id])
                dtoList << new DomainOptionDto(it.accountName,it.id.toString(),it.id.toString())
        }

        setupList.each {
            if(!subHasChild[it.id]) {
                dtoList << new DomainOptionDto("${it.parentAccount.accountName}-${it.accountName}", it.id.toString(),it.id.toString())
            }
        }

        return dtoList.sort {it.label}

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

    // [USED]
    @GraphQLQuery(name = "getSubAccountForParent")
    List<SubAccountSetup> getSubAccountForParent(
            @GraphQLArgument(name = "parentAccountId") UUID parentAccountId
    ) {
        UUID companyID = SecurityUtils.currentCompanyId()
        createQuery("""
            Select sub from SubAccountSetup sub  
            where
            sub.company.id = :companyID and 
            sub.parentAccount.id = :parentAccountId and 
            sub.subaccountParent is null 
            order by sub.subaccountCode, sub.createdDate""",
            [
                    parentAccountId:parentAccountId,
                    companyID:companyID
            ])
                .resultList
    }

    // [USED]
    List<SubAccountSetup> getActiveSubAccount( ) {
        UUID companyID = SecurityUtils.currentCompanyId()
        createQuery("""
                Select sub from SubAccountSetup sub  
                where
                sub.company.id = :companyID and
                (sub.isInactive is null or sub.isInactive=false)  
                order by sub.subaccountCode, sub.createdDate
        """,[
                companyID:companyID
            ])
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


    // [USED]
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
                        entity.subaccountCode = 'AUTO GENERATED'
                        entity.accountName = entity.subaccountParent.accountName+" - "+(entity.sourceDomain.displayName).toUpperCase()
                    }
                    else {
                        entity.subaccountCode = 'AUTO GENERATED'
                        entity.accountName = (entity.sourceDomain.displayName).toUpperCase()
                        entity.setSubaccountParent(null)
                    }
                }
                else {
                    entity.sourceDomain = DomainEnum.NO_DOMAIN
                }

               if(!fields['subaccountParent']){
                   entity.setSubaccountParent(null)
               }

                if((fields['domainExcludes'] as List<DomainOptionDto> ?: []).size() > 0){
                    entity.domainExcludes = fields['domainExcludes'] as List<DomainOptionDto>
                }
               else{
                    entity.domainExcludes = []
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

    // [USED]
    @GraphQLQuery(name='subAccountDomains')
    static List<DomainOptionDto> subAccountDomains(){
        return DomainEnum.values().findAll { it != DomainEnum.NO_DOMAIN } .collect { [label: it.displayName, value: it.name()] as DomainOptionDto }
    }

    // [USED]
    @GraphQLQuery(name='subAccountDomainsRecords')
    List<DomainOptionDto> subAccountDomainsRecords(
            @GraphQLArgument(name = "domain") DomainEnum domain
    ) {
        //UUID companyID = SecurityUtils.currentCompanyId()
        String query = "from ${domain.path as String} "
        if(domain.flagColumn) {
            query = "from ${domain.path as String} where ${domain.flagColumn as String} = true "
        }
        return entityManager.createQuery(query,
                Class.forName(domain.path as String)).resultList
               .collect { [label: it['accountName'], value: it['id']] as DomainOptionDto }

    }
}
