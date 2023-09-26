package com.backend.gbp.services.requestscope

import com.backend.gbp.domain.accounting.AccountType
import com.backend.gbp.domain.accounting.DomainEnum
import com.backend.gbp.domain.accounting.ParentAccount
import com.backend.gbp.domain.billing.Discount
import com.backend.gbp.domain.types.Subaccountable
import com.backend.gbp.graphqlservices.accounting.ChartOfAccountGenerate
import com.backend.gbp.graphqlservices.accounting.CoaComponentContainer
import com.backend.gbp.graphqlservices.accounting.ParentAccountServices
import com.backend.gbp.graphqlservices.accounting.SubAccountSetupService
import com.backend.gbp.memoization.Memoize
import org.apache.commons.lang3.BooleanUtils
import org.apache.commons.lang3.StringUtils
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.stereotype.Component
import org.springframework.web.context.annotation.RequestScope

import javax.persistence.EntityManager

@Component
@RequestScope
class ChartofAccountGenerator {

    @Autowired
    ParentAccountServices parentAccountServices

    @Autowired
    EntityManager entityManager

    @Autowired
    SubAccountSetupService subAccountSetupService


    @Memoize
    List<ChartOfAccountGenerate> getAllChartOfAccountGenerate(
             String accountType,
             String motherAccountCode,
             String accountName,
             String subaccountType,
             String department,
             String accountCategory,
             Boolean excludeMotherAccount=false
    ) {

        List<ChartOfAccountGenerate> results = []
        def coaList = parentAccountServices.findAll().findAll {
            BooleanUtils.isNotTrue(it.deprecated)
        }.toSorted {a,b ->
            a.accountCode <=> b.accountCode
        }

        def subAccounts = subAccountSetupService.getActiveSubAccount()

        if(subaccountType){
            subAccounts = subAccounts.findAll { it.subaccountType == AccountType.valueOf(subaccountType)}
        }

        // Just Add Reference to Mother Account
        Set<String> motherAccountsWithSubAccount = []
        subAccounts.each {
            it.parentAccount.each {
                motherAccountsWithSubAccount << it.accountCode
            }
        }

        Map<DomainEnum,List<Subaccountable>> entityListMap = [:]

        coaList.each {coa->
            ChartOfAccountGenerate coaNew
            if(!subaccountType) {
                coaNew = new ChartOfAccountGenerate(motherAccount: new CoaComponentContainer(coa.accountCode, coa.id, coa.accountName,
                        coa.class.name, coa.normalSide.name()), accountType: coa.accountType.name(),accountCategory: coa.accountCategory.name(), fromGenerator: true)


                results << coaNew
            }

//            List<Subaccountable> departments = departmentService.findAllSortedByCodeAndFlatten(null)
            // Rule no. 1 .. Check if it is a parent of a subaccount or not

            subAccounts.each {subAccount->

                def match =  subAccount.parentAccount.findAll {
                    it.accountCode ==  coa.accountCode
                }

                if(match){

                    // Check if sourceDomain is applied
                    if(subAccount.sourceDomain.name() != 'NO_DOMAIN'){
                        // load this entity
                        Map<UUID,String> domainExcludes = [:]
                        if(subAccount.domainExcludes.size() > 0){
                            subAccount.domainExcludes.each {
                                de ->
                                domainExcludes.put(UUID.fromString(de.key),de.label)
                            }
                        }

                        if(!entityListMap.containsKey(subAccount.sourceDomain)){
                            //prevent duplicate loading
                            List<Subaccountable> entities=  entityManager.createQuery("from ${subAccount.sourceDomain.path}",
                                    Class.forName(subAccount.sourceDomain.path as String)).resultList.
                                    findAll {
                                        // filter Discounts to exclude VAT Discounts
                                        if(it instanceof Discount){
                                            if(it.active)
                                                return true
                                            else
                                                return false
                                        }
                                        else {
                                            return true
                                        }
                                    } as List<Subaccountable>
                            entityListMap.put(subAccount.sourceDomain.name(),entities.toSorted { a,b ->
                                a.code <=> b.code
                            })
                        }

                        if(subAccount.subaccountParent){
                            entityListMap.get(subAccount.sourceDomain.name()).each {
//                                def m = it.config.motherAccounts ?: []
//                                if(it.config.show) { // show sub account
//                                    if (it.config.motherAccounts == null || m.contains(coa.id)) {
                                      if(!domainExcludes[it.id]) {
                                          coaNew = new ChartOfAccountGenerate(motherAccount: new CoaComponentContainer(coa.accountCode, coa.id, coa.accountName,
                                                  coa.class.name, coa.normalSide.name()), accountType: coa.accountType.name(),accountCategory:coa.accountCategory.name(),  fromGenerator: true)

                                          coaNew.subAccount = new CoaComponentContainer(
                                                  subAccount.subaccountParent.subaccountCode,
                                                  subAccount.subaccountParent.id,
                                                  subAccount.subaccountParent.accountName,
                                                  subAccount.subaccountParent.class.name,
                                                  coa.normalSide.name(),
                                                  coa.accountType.name(),
                                                  coa.accountCategory.name()
                                          )

                                          coaNew.subSubAccount = new CoaComponentContainer(
                                                  it.code,
                                                  it.id,
                                                  it.accountName,
                                                  it.domain,
                                                  coa.normalSide.name(),
                                                  coa.accountType.name(),
                                                  coa.accountCategory.name()
                                          )

                                          results << coaNew
                                      }
//                                    }
//                                }
                            }


                        }
                        else {
                            //if coa is dependent on source domain
                            //with department
//                            if(subAccount.includeDepartment){
//                                //wilson update
//                                entityListMap.get(subAccount.sourceDomain).each { entity->
//                                    //filter department
//                                    def m = entity.config.motherAccounts ?: []
//                                    if(entity.config.show){ //show active only
//                                        if(entity.config.motherAccounts == null || m.contains(coa.id)){
//                                            if(entity.config.showDepartments){ //show departments
//                                                def depIds = entity.department
//                                                departments = departmentService.findAllSortedByCodeAndFlatten(depIds)
//                                                // has a department
//                                                departments.each { dept ->
//                                                    coaNew = new ChartOfAccountGenerate(motherAccount: new CoaComponentContainer(coa.accountCode, coa.id, coa.description,
//                                                            coa.class.name, coa.normalSide.name()), accountType: coa.accountType.name(), fromGenerator: true)
//
//                                                    coaNew.subAccount = new CoaComponentContainer(
//                                                            dept.code,
//                                                            dept.id,
//                                                            dept.description,
//                                                            dept.domain
//                                                    )
//
//                                                    coaNew.subSubAccount = new CoaComponentContainer(
//                                                            entity.code,
//                                                            entity.id,
//                                                            entity.description,
//                                                            entity.domain
//                                                    )
//
//                                                    results << coaNew
//                                                }
//                                            }else{ //dont show departments
//                                                coaNew =  new ChartOfAccountGenerate(motherAccount: new CoaComponentContainer(coa.accountCode,coa.id,coa.description,
//                                                        coa.class.name,coa.normalSide.name()),accountType:coa.accountType.name(),fromGenerator: true)
//
//                                                coaNew.subAccount = new CoaComponentContainer(
//                                                        entity.code,
//                                                        entity.id,
//                                                        entity.description,
//                                                        entity.domain
//                                                )
//
//                                                results << coaNew
//                                            }
//                                        }
//                                    }
//
//                                }
//                                //departments.each { dept ->
//
//                                //    entityListMap.get(subAccount.sourceDomain).each { entity->
//
//                                //        coaNew =  new ChartOfAccountGenerate(motherAccount: new CoaComponentContainer(coa.accountCode,coa.id,coa.description,
//                                //               coa.class.name,coa.normalSide.name()),accountType:coa.accountType.name(),fromGenerator: true)
//
//                                //        coaNew.subAccount = new CoaComponentContainer(
//                                //                dept.code,
//                                //                dept.id,
//                                //                dept.description,
//                                //                dept.domain
//                                //        )
//
//                                //        coaNew.subSubAccount = new CoaComponentContainer(
//                                //                entity.code,
//                                //                entity.id,
//                                //                entity.description,
//                                //                entity.domain
//                                //        )
//
//                                //        results << coaNew
//
//                                //    }
//                                //}
//
//                            }
                            //no department
//                            else {
                                // process entity here no parent
//                                entityListMap.get(subAccount.sourceDomain).each {
//                                    def m = it.config.motherAccounts ?: []
//                                    if(it.config.show) {
//                                        if (it.config.motherAccounts == null || m.contains(coa.id)) {
//                                            coaNew = new ChartOfAccountGenerate(motherAccount: new CoaComponentContainer(coa.accountCode, coa.id, coa.description,
//                                                    coa.class.name, coa.normalSide.name()), accountType: coa.accountType.name(), fromGenerator: true)
//
//                                            coaNew.subAccount = new CoaComponentContainer(
//                                                    it.code,
//                                                    it.id,
//                                                    it.description,
//                                                    it.domain
//                                            )
//
//                                            results << coaNew
//                                        }
//                                    }
//                                }

//                            }
                            // end: if coa is dependent on source domain

                        }

                    }
                    else {
                        // check if it has a parent SubAccount
                        // This will become the next SubAccount
                        if(!subAccount.subaccountParent){

//                            if(subAccount.includeDepartment){
//                                if(subAccount.departmentIncludes){ //show only those selected departments
//                                    def depIds = subAccount.selectedDepartments
//                                    departments = departmentService.findAllSortedByCodeAndFlatten(depIds)
//                                }
//                                // has a department
//                                departments.each { dept ->
//
//                                    coaNew =  new ChartOfAccountGenerate(motherAccount: new CoaComponentContainer(coa.accountCode,coa.id,coa.description,
//                                            coa.class.name,coa.normalSide.name()),accountType:coa.accountType.name(),fromGenerator: true)
//
//
//                                    coaNew.subAccount = new CoaComponentContainer(
//                                            dept.code,
//                                            dept.id,
//                                            dept.description,
//                                            dept.domain
//                                    )
//
//
//
//                                    coaNew.subSubAccount = new CoaComponentContainer(
//                                            subAccount.subaccountCode,
//                                            subAccount.id,
//                                            subAccount.description,
//                                            subAccount.class.name
//                                    )
//
//                                    results << coaNew
//
//
//                                }
//
//                            }
//                            else {

                                coaNew =  new ChartOfAccountGenerate(motherAccount: new CoaComponentContainer(coa.accountCode,coa.id,coa.accountName,
                                        coa.class.name,coa.normalSide.name()),accountType:coa.accountType.name(),accountCategory:coa.accountCategory.name(), fromGenerator: true)

                                coaNew.subAccount = new CoaComponentContainer(
                                        subAccount.subaccountCode,
                                        subAccount.id,
                                        subAccount.accountName,
                                        subAccount.class.name,
                                        coa.normalSide.name(),
                                        coa.accountType.name(),
                                        coa.accountCategory.name()
                                )

                                results << coaNew


//                            }



                        }else {

                            coaNew =  new ChartOfAccountGenerate(motherAccount: new CoaComponentContainer(coa.accountCode,coa.id,coa.accountName,
                                    coa.class.name,coa.normalSide.name()),accountType:coa.accountType.name(),accountCategory:coa.accountCategory.name(), fromGenerator: true)

                            coaNew.subAccount = new CoaComponentContainer(
                                    subAccount.subaccountParent.subaccountCode,
                                    subAccount.subaccountParent.id,
                                    subAccount.subaccountParent.accountName,
                                    subAccount.subaccountParent.class.name,
                                    coa.normalSide.name(),
                                    coa.accountType.name(),
                                    coa.accountCategory.name()
                            )

                            coaNew.subSubAccount = new CoaComponentContainer(
                                    subAccount.subaccountCode,
                                    subAccount.id,
                                    subAccount.accountName,
                                    subAccount.class.name,
                                    coa.normalSide.name(),
                                    coa.accountType.name(),
                                    coa.accountCategory.name()
                            )

                            results << coaNew
                        }

                    }


                }
            }


        }




        def sorted = results.toSorted {
            a,b ->
                a.code <=> b.code
        }


        Map<String,String> filterValue = [:]


        if(accountType)
            filterValue["accountType"] = accountType

        if(accountCategory)
            filterValue["accountCategory"] = accountCategory

        if(motherAccountCode)
            filterValue["motherAccountCode"] = motherAccountCode


        if(department)
            filterValue["departmentId"] = department


        if(accountName)
            filterValue["accountName"] = accountName




        def forProcess =   sorted.findAll {  gen->

            boolean  filter = true




            if(filterValue.size() == 0 && !excludeMotherAccount)
                return true


            if(excludeMotherAccount){

                // but only those who have no subaccount reference

                if(motherAccountsWithSubAccount.contains(gen.motherAccount.code))
                {
                    if(!(gen.subAccount || gen.subSubAccount))
                        filter = false
                }



            }

            filterValue.each { key,value ->

                if(key == "accountCategory"){
                    if(!StringUtils.equalsIgnoreCase(value,gen.accountCategory))
                        filter = false
                }

                if(key == "accountType"){
                    if(!StringUtils.equalsIgnoreCase(value,gen.accountType))
                        filter = false
                }

                if(key == "motherAccountCode"){
                    String mAccount = value


                    if(!StringUtils.equalsIgnoreCase(gen.motherAccount.code,mAccount))
                        filter = false
                }


                if(key == "subAccountCode"){


                   // this is actually not used
                    /*      CoaComponentContainer subAccount = gen.subAccount
                         CoaComponentContainer subSubAccount = gen.subSubAccount

                         if(!subAccount)
                             filter = false

                         if(setup.subaccountType == SubAccountType.OTHERENTITIES){
                             String hasDomain = setup.sourceDomain

                             if(!hasDomain){
                                 // subAccountOnly



                                 if(setup.subaccountParent){
                                     if(subSubAccount == null)
                                         filter = false

                                     if(!StringUtils.equalsIgnoreCase(subAccount?.code,setup.subaccountParent?.subaccountCode))
                                         filter = false

                                     if(StringUtils.equalsIgnoreCase(subSubAccount?.domain ,SubAccountSetup.class.name)){
                                         if(!StringUtils.equalsIgnoreCase(subSubAccount?.code,subAccountCode))
                                             filter = false
                                     }
                                     else
                                         filter = false
                                 }
                                 else {
                                     // println("${subAccount.domain} ${subAccount.code} ${subAccountCode}")
                                     if(StringUtils.equalsIgnoreCase(subAccount?.domain ,SubAccountSetup.class.name)){
                                         if(!StringUtils.equalsIgnoreCase(subAccount?.code,subAccountCode))
                                             filter = false
                                     }
                                     else
                                         filter = false
                                 }




                             }
                             else {


                                 if(setup.subaccountParent){
                                     // domain entities with parents
                                     if(subSubAccount == null)
                                         filter = false

                                     if(!StringUtils.equalsIgnoreCase(subAccount?.code,setup.subaccountParent?.subaccountCode))
                                         filter = false


                                     if(!StringUtils.equalsIgnoreCase(subSubAccount?.domain ,hasDomain)){
                                         filter = false
                                     }
                                 }
                                 else{
                                     if(subAccount)
                                     {
                                         if(!StringUtils.equalsIgnoreCase(subAccount.domain ,hasDomain)){
                                             filter = false
                                         }
                                     }
                                 }




                             }

                         }
                         else {
                             //==============================Non Entities==============================================
                             SubAccountSetup parent =  setup.subaccountParent

                             if(parent){
                                 if(subSubAccount)
                                 {
                                     if(StringUtils.equalsIgnoreCase(subSubAccount.domain ,SubAccountSetup.class.name)){
                                         if(!StringUtils.equalsIgnoreCase(subSubAccount.code,subAccountCode))
                                             filter = false
                                     }else {
                                         filter = false
                                     }
                                 }else {
                                     filter = false
                                 }
                             }
                             else  if(setup.includeDepartment){


                                 if(subSubAccount)
                                 {

                                     if(StringUtils.equalsIgnoreCase(subSubAccount.domain ,SubAccountSetup.class.name)){

                                         if(!StringUtils.equalsIgnoreCase(subSubAccount.code,subAccountCode))
                                             filter = false

                                     }else {
                                         filter = false
                                     }
                                 }
                                 else {
                                     filter = false
                                 }
                             }
                             else {
                                 if(subAccount)
                                 {

                                     if(StringUtils.equalsIgnoreCase(subAccount.domain ,SubAccountSetup.class.name)){


                                         if(!StringUtils.equalsIgnoreCase(subAccount.code,subAccountCode))
                                         {
                                             filter = false

                                         }
                                     }else {
                                         filter = false
                                     }
                                 }
                             }

                         }*/

                }


                if(key == "accountName"){

                    String filterDesc= value


                    if(!(StringUtils.containsIgnoreCase(gen.accountName,filterDesc) || StringUtils.containsIgnoreCase(gen.code,filterDesc)))
                    {
                        filter = false
                    }

                }

//                if(key == "departmentId"){
//
//
//                    if(gen.subAccount?.domain == Department.class.name){
//                        if(!StringUtils.equalsIgnoreCase(gen.subAccount.code,value)){
//                            filter = false
//                        }
//                    }
//                    else
//                        filter = false
//
//                }

            }




            return filter
        }




        forProcess
    }



    @Memoize
    List<ChartOfAccountGenerate> getAccountBalanceChartOfAccount(
            List<String> motherAccountCode
    ) {

        List<ChartOfAccountGenerate> results = []
        def coaList = chartOfAccountServices.findAll().findAll {
            BooleanUtils.isNotTrue(it.deprecated)
        }.toSorted {a,b ->
            a.accountCode <=> b.accountCode
        }

        def subAccounts = subAccountSetupService.getActiveSubAccount()

        // Just Add Reference to Mother Account
        Set<String> motherAccountsWithSubAccount = []
        subAccounts.each {
            it.motherAccounts.each {
                motherAccountsWithSubAccount << it.chartOfAccount.accountCode
            }
        }

        Map<String,List<Subaccountable>> entityListMap = [:]

        coaList.each {coa->
            ChartOfAccountGenerate coaNew
            coaNew = new ChartOfAccountGenerate(motherAccount: new CoaComponentContainer(coa.accountCode, coa.id, coa.description,
                    coa.class.name, coa.normalSide.name()), accountType: coa.accountType.name(), fromGenerator: true)

            results << coaNew
            List<Subaccountable> departments = departmentService.findAllSortedByCodeAndFlatten(null)
            // Rule no. 1 .. Check if it is a parent of a subaccount or not

            subAccounts.each {subAccount->

                def match =  subAccount.motherAccounts.findAll {
                    it.chartOfAccount.accountCode ==  coa.accountCode
                }

                if(match){
                    // Check if sourceDomain is applied
                    // When SourceDomain is set No Department or Parent Subaccount below it
                    if(subAccount.sourceDomain){
                        // load this entity
                        if(!entityListMap.containsKey(subAccount.sourceDomain)){
                            //prevent duplicate loading
                            List<Subaccountable> entities=  entityManager.createQuery("from ${subAccount.sourceDomain}",
                                    Class.forName(subAccount.sourceDomain)).resultList.
                                    findAll {
                                        // filter Discounts to exclude VAT Discounts
                                        if(it instanceof Discount){
                                            if(it.active)
                                                return true
                                            else
                                                return false
                                        }
                                        else {
                                            return true
                                        }
                                    }
                            entityListMap.put(subAccount.sourceDomain,entities.toSorted { a,b ->
                                a.code <=> b.code
                            })
                        }


                        if(subAccount.subaccountParent){

                            entityListMap.get(subAccount.sourceDomain).each {
                                if(it.config.show){ // show sub account
                                    coaNew =  new ChartOfAccountGenerate(motherAccount: new CoaComponentContainer(coa.accountCode,coa.id,coa.description,
                                            coa.class.name,coa.normalSide.name()),accountType:coa.accountType.name(),fromGenerator: true)

                                    coaNew.subAccount = new CoaComponentContainer(
                                            subAccount.subaccountParent.subaccountCode,
                                            subAccount.subaccountParent.id,
                                            subAccount.subaccountParent.description,
                                            subAccount.subaccountParent.class.name
                                    )

                                    coaNew.subSubAccount = new CoaComponentContainer(
                                            it.code,
                                            it.id,
                                            it.description,
                                            it.domain
                                    )

                                    results << coaNew
                                }
                            }

                        }
                        else {
                            //if coa is dependent on source domain
                            //with department
                            if(subAccount.includeDepartment){
                                //wilson update
                                entityListMap.get(subAccount.sourceDomain).each { entity->
                                    //filter department
                                    if(entity.config.show){ //show active only
                                        if(entity.config.showDepartments){ //show departments
                                            def depIds = entity.department
                                            departments = departmentService.findAllSortedByCodeAndFlatten(depIds)
                                            // has a department
                                            departments.each { dept ->
                                                coaNew = new ChartOfAccountGenerate(motherAccount: new CoaComponentContainer(coa.accountCode, coa.id, coa.description,
                                                        coa.class.name, coa.normalSide.name()), accountType: coa.accountType.name(), fromGenerator: true)

                                                coaNew.subAccount = new CoaComponentContainer(
                                                        dept.code,
                                                        dept.id,
                                                        dept.description,
                                                        dept.domain
                                                )

                                                coaNew.subSubAccount = new CoaComponentContainer(
                                                        entity.code,
                                                        entity.id,
                                                        entity.description,
                                                        entity.domain
                                                )

                                                results << coaNew
                                            }
                                        }else{ //dont show departments
                                            coaNew =  new ChartOfAccountGenerate(motherAccount: new CoaComponentContainer(coa.accountCode,coa.id,coa.description,
                                                    coa.class.name,coa.normalSide.name()),accountType:coa.accountType.name(),fromGenerator: true)

                                            coaNew.subAccount = new CoaComponentContainer(
                                                    entity.code,
                                                    entity.id,
                                                    entity.description,
                                                    entity.domain
                                            )

                                            results << coaNew
                                        }

                                    }

                                }
                            }
                            //no department
                            else {
                                // process entity here no parent
                                entityListMap.get(subAccount.sourceDomain).each {
                                    if(it.config.show){
                                        coaNew =  new ChartOfAccountGenerate(motherAccount: new CoaComponentContainer(coa.accountCode,coa.id,coa.description,
                                                coa.class.name,coa.normalSide.name()),accountType:coa.accountType.name(),fromGenerator: true)

                                        coaNew.subAccount = new CoaComponentContainer(
                                                it.code,
                                                it.id,
                                                it.description,
                                                it.domain
                                        )

                                        results << coaNew
                                    }
                                }

                            }
                            // end: if coa is dependent on source domain
                        }
                    }
                    else {
                        // check if it has a parent SubAccount
                        // This will become the next SubAccount
                        if(!subAccount.subaccountParent){

                            if(subAccount.includeDepartment){
                                if(subAccount.departmentIncludes){ //show only those selected departments
                                    def depIds = subAccount.selectedDepartments
                                    departments = departmentService.findAllSortedByCodeAndFlatten(depIds)
                                }
                                // has a department
                                departments.each { dept ->

                                    coaNew =  new ChartOfAccountGenerate(motherAccount: new CoaComponentContainer(coa.accountCode,coa.id,coa.description,
                                            coa.class.name,coa.normalSide.name()),accountType:coa.accountType.name(),fromGenerator: true)

                                    coaNew.subAccount = new CoaComponentContainer(
                                            dept.code,
                                            dept.id,
                                            dept.description,
                                            dept.domain
                                    )

                                    coaNew.subSubAccount = new CoaComponentContainer(
                                            subAccount.subaccountCode,
                                            subAccount.id,
                                            subAccount.description,
                                            subAccount.class.name
                                    )

                                    results << coaNew

                                }
                            }
                            else {
                                coaNew =  new ChartOfAccountGenerate(motherAccount: new CoaComponentContainer(coa.accountCode,coa.id,coa.description,
                                        coa.class.name,coa.normalSide.name()),accountType:coa.accountType.name(),fromGenerator: true)

                                coaNew.subAccount = new CoaComponentContainer(
                                        subAccount.subaccountCode,
                                        subAccount.id,
                                        subAccount.description,
                                        subAccount.class.name
                                )
                                results << coaNew
                            }

                        }else {

                            coaNew =  new ChartOfAccountGenerate(motherAccount: new CoaComponentContainer(coa.accountCode,coa.id,coa.description,
                                    coa.class.name,coa.normalSide.name()),accountType:coa.accountType.name(), fromGenerator: true)

                            coaNew.subAccount = new CoaComponentContainer(
                                    subAccount.subaccountParent.subaccountCode,
                                    subAccount.subaccountParent.id,
                                    subAccount.subaccountParent.description,
                                    subAccount.subaccountParent.class.name
                            )

                            coaNew.subSubAccount = new CoaComponentContainer(
                                    subAccount.subaccountCode,
                                    subAccount.id,
                                    subAccount.description,
                                    subAccount.class.name
                            )

                            results << coaNew
                        }

                    }

                }
            }

        }

        def sorted = results.toSorted {
            a,b ->
                a.code <=> b.code
        }

        def forProcess =   sorted.findAll {  gen->
            Boolean filter = true

            if(motherAccountCode.size() > 0) {
                if (!motherAccountCode.contains(gen.motherAccount.code))
                    filter = false
            }

            if(filter) {
                if (motherAccountsWithSubAccount.contains(gen.motherAccount.code)) {
                    if (gen.subAccount)
                        return true
                    else return false
                } else {
                    return true
                }
            }
        }

        forProcess
    }

}
