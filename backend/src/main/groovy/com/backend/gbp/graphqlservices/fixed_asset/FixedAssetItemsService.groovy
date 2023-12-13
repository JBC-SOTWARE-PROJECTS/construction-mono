package com.backend.gbp.graphqlservices.fixed_asset

import com.backend.gbp.domain.accounting.HeaderLedgerGroup
import com.backend.gbp.domain.accounting.JournalType
import com.backend.gbp.domain.accounting.LedgerDocType
import com.backend.gbp.domain.cashier.Payment
import com.backend.gbp.domain.cashier.PaymentType
import com.backend.gbp.domain.cashier.ReceiptType
import com.backend.gbp.domain.fixed_asset.FixedAssetItems
import com.backend.gbp.domain.inventory.ItemSubAccount
import com.backend.gbp.graphqlservices.accounting.Entry
import com.backend.gbp.graphqlservices.accounting.HeaderGroupServices
import com.backend.gbp.graphqlservices.accounting.IntegrationServices
import com.backend.gbp.graphqlservices.accounting.LedgerServices
import com.backend.gbp.graphqlservices.base.AbstractDaoCompanyService
import com.backend.gbp.graphqlservices.inventory.ItemService
import com.backend.gbp.graphqlservices.inventory.ItemSubAccountService
import com.backend.gbp.graphqlservices.types.GraphQLResVal
import com.backend.gbp.security.SecurityUtils
import com.backend.gbp.services.GeneratorService
import com.backend.gbp.services.GeneratorType
import io.leangen.graphql.annotations.GraphQLArgument
import io.leangen.graphql.annotations.GraphQLMutation
import io.leangen.graphql.annotations.GraphQLQuery
import io.leangen.graphql.spqr.spring.annotations.GraphQLApi
import javafx.scene.Group
import org.apache.commons.lang3.StringUtils
import org.apache.http.message.HeaderGroup
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.data.domain.Page
import org.springframework.stereotype.Service

import javax.transaction.Transactional

@Service
@GraphQLApi
@Transactional(rollbackOn = Exception.class)
class FixedAssetItemsService extends AbstractDaoCompanyService<FixedAssetItems> {
    FixedAssetItemsService(){
        super(FixedAssetItems.class)
    }

    @Autowired
    GeneratorService generatorService

    @Autowired
    HeaderGroupServices headerGroupServices

    @Autowired
    IntegrationServices integrationServices

    @Autowired
    ItemService itemService

    @Autowired
    LedgerServices ledgerServices

    @Transactional
    @GraphQLMutation(name='upsertFixedAssetItems')
    GraphQLResVal<FixedAssetItems> upsertFixedAssetItems(
            @GraphQLArgument(name='id') UUID id,
            @GraphQLArgument(name='fields') Map<String,Object> fields
    ){
        def fixeAssetItem = upsertFromMap(id,fields, { fa, isInsert ->
                if(isInsert){
                    fa.assetNo = generatorService.getNextValue(GeneratorType.FIXED_ASSET_ITEMS) {
                        it -> return "FA-${StringUtils.leftPad(it.toString(), 6, "0")}"
                    }
                }
            }
        )
        return  new GraphQLResVal<FixedAssetItems>(fixeAssetItem,true,'Successfully saved.')
    }

    FixedAssetItems fixedAssetPosting(FixedAssetItems fixedAssetItems){
        HeaderLedgerGroup group = new HeaderLedgerGroup()
        group.recordNo = generatorService.getNextValue(GeneratorType.HEADER_GROUP) {
            it -> return "${StringUtils.leftPad(it.toString(), 6, "0")}"
        }
        group.docNo = fixedAssetItems.assetNo
        group.entity_name = fixedAssetItems.itemName
        def newGroup = headerGroupServices.save(group)

        def headerLedger = integrationServices.generateAutoEntries(fixedAssetItems) { FixedAssetItems faItem, multipleData ->
            faItem.flagValue = 'REGISTER_FIXED_ASSET'
            faItem.negativeAmount = faItem.purchasePrice.negate()
            def item = itemService.findOne(faItem.itemId)
            faItem.subAccount = item.assetSubAccount
        }

        Map<String,String> details = [:]
        fixedAssetItems.details.each { k,v ->
            details[k] = v
        }

        details["FIXED_ASSET_ITEM_ID"] = fixedAssetItems.id.toString()

        headerLedger.headerLedgerGroup = newGroup.id
        headerLedger.transactionType =  "FIXED ASSET"
        headerLedger.transactionNo = fixedAssetItems.assetNo
		headerLedger.referenceType = 'DELIVERY RECEIVING'
		headerLedger.referenceNo = fixedAssetItems?.deliveryReceiving?.receivedRefNo ?: ''

        ledgerServices.persistHeaderLedger(headerLedger,
                fixedAssetItems.assetNo,
                fixedAssetItems.itemName,
                'REGISTER ASSET',
                LedgerDocType.FA,
                JournalType.RECEIPTS,
                fixedAssetItems.createdDate,
                [:]
        )
        fixedAssetItems.ledgerGroupId = newGroup.id
        return  fixedAssetItems
    }

    @Transactional
    @GraphQLMutation(name='upsertMultiFixedAssetItems')
    GraphQLResVal<Boolean> upsertMultiFixedAssetItems(
            @GraphQLArgument(name='fields') List<Map<String,Object>> fields
    ){
        if(fields) {
            fields.each {
                field ->
                def fixedAssetItems = upsertFromMap(null,field, { fa, isInsert ->
                        fa.assetNo = generatorService.getNextValue(GeneratorType.FIXED_ASSET_ITEMS) {
                            it -> return "FA-${StringUtils.leftPad(it.toString(), 6, "0")}"
                        }
                        fa.status = 'ACTIVE'
                    }
                )
                if(!fixedAssetItems.isBeginningBalance) {
                    def posted = fixedAssetPosting(fixedAssetItems)
                    save(posted)
                }
            }

        }
        return  new GraphQLResVal<FixedAssetItems>(true,true,'Successfully saved.')
    }


    @GraphQLQuery(name='getFixedAssetPageable')
    Page<FixedAssetItems> getFixedAssetPageable(
            @GraphQLArgument(name='filter') String filter,
            @GraphQLArgument(name='page') Integer page,
            @GraphQLArgument(name='size') Integer size
    ){
        def companyId = SecurityUtils.currentCompanyId()
        Map<String,Object> params = [:]
        params['companyId'] = companyId
        params['filter'] = filter

        getPageable(
                """ Select f from FixedAssetItems f where 
                            f.companyId = :companyId 
                            and (upper(f.assetNo) like upper(concat('%',:filter,'%')) or upper(f.itemName) like upper(concat('%',:filter,'%'))) 
                            and f.status != 'VOIDED'
                            order by f.assetNo desc """,
                """ Select count(f) from FixedAssetItems f where f.companyId = :companyId 
                            and (upper(f.assetNo) like upper(concat('%',:filter,'%')) or upper(f.itemName) like upper(concat('%',:filter,'%'))) 
                            and f.status != 'VOIDED' """,
                page,
                size,
                params
        )
    }
}
