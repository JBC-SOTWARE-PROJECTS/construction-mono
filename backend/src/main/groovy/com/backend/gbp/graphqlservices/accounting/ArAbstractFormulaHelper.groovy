package com.backend.gbp.graphqlservices.accounting

import com.backend.gbp.domain.accounting.ArInvoice
import com.backend.gbp.graphqlservices.base.AbstractDaoCompanyService
import com.backend.gbp.graphqlservices.base.AbstractDaoService
import com.backend.gbp.security.SecurityUtils
import groovy.transform.Canonical
import org.springframework.beans.factory.annotation.Autowired

import java.text.SimpleDateFormat
import java.time.Instant

@Canonical
class ArAmountSummaryVariable {

}


abstract class ArAbstractFormulaHelper <T extends  Serializable> extends AbstractDaoCompanyService<T> {


    ArAbstractFormulaHelper(Class<T> domain){
        super(domain)
    }

    @Autowired
    ArInvoiceServices invoiceServices

    T applyCWT(UUID id, Boolean isCWT= false, BigDecimal withholdingTaxPercentage){
        def result = findOne(id)

        if(!result)
            return  null

        BigDecimal unitPrice = (result['unitPrice'] ?: 0.00) as BigDecimal
        BigDecimal quantity = (result['quantity'] ?: 0.00) as BigDecimal
        BigDecimal totalAmount = (unitPrice * quantity)
        String itemType = (result['itemType']?:'') as String
        BigDecimal discountPercentage = (result['discountPercentage'] ?: 0.00) as BigDecimal
        if(discountPercentage > 0)
            totalAmount = totalAmount * (discountPercentage/100)

        if(itemType.equalsIgnoreCase('transfer-erroneous') || itemType.equalsIgnoreCase('transfer-financial-assistance'))
            return  null

        if(!isCWT){
            result['isCWT'] = false
            result['cwtAmount'] = 0.00
            result['cwtRate'] = 0

            result['totalAmountDue']  = totalAmount
            def newSave = save(result)
            return  newSave
        }

        BigDecimal cwt = (totalAmount * (withholdingTaxPercentage ?:  0.05)).round(2)
        result['isCWT'] = true
        result['cwtAmount'] = cwt
        result['cwtRate'] = withholdingTaxPercentage
        result['isVatable'] = false
        result['vatAmount'] = 0.00
        result['totalAmountDue']  = totalAmount - cwt
        def newSave = save(result)
        return newSave
    }

    T applyVat(UUID id, Boolean isVatable= false, BigDecimal vatPercentage){
        def result = findOne(id)

        if(!result)
            return  null

        BigDecimal unitPrice = (result['unitPrice'] ?: 0.00) as BigDecimal
        BigDecimal quantity = (result['quantity'] ?: 0.00) as BigDecimal
        BigDecimal totalAmount = (unitPrice * quantity)
        String itemType = (result['itemType']?:'') as String
        BigDecimal discountPercentage = (result['discountPercentage'] ?: 0.00) as BigDecimal
        if(discountPercentage > 0)
            totalAmount = totalAmount * (discountPercentage/100)

        if(itemType.equalsIgnoreCase('transfer-erroneous') || itemType.equalsIgnoreCase('transfer-financial-assistance'))
            return  null

        if(!isVatable){
            result['isVatable'] = false
            result['vatAmount'] = 0.00

            result['totalAmountDue'] = totalAmount
            def newSave = save(result)
            return  newSave
        }

        BigDecimal vatActual = ((vatPercentage ?: 12) / 100) + 1
        BigDecimal totalAmountDue = (totalAmount / vatActual).round(2)
        BigDecimal vat = (totalAmountDue * 0.12).round(2)
        result['isVatable'] = true
        result['vatAmount'] = vat
        result['totalAmountDue'] = totalAmountDue
        def newSave = save(result)
        return newSave
    }

    T applyVatLocal(T entity, BigDecimal vatPercentage){
        if(!entity)
            return  null

        BigDecimal unitPrice = entity['unitPrice'] as BigDecimal
        BigDecimal quantity = entity['quantity'] as BigDecimal
        BigDecimal totalAmount = (unitPrice * quantity)
        String itemType = (entity['itemType']?:'') as String
        BigDecimal discountPercentage = (entity['discountPercentage'] ?: 0.00) as BigDecimal
        if(discountPercentage > 0)
            totalAmount = totalAmount * (discountPercentage/100)

        if(itemType.equalsIgnoreCase('transfer-erroneous') || itemType.equalsIgnoreCase('transfer-financial-assistance'))
            return  null

        BigDecimal vatActual = ((vatPercentage ?: 12) / 100) + 1
        BigDecimal totalAmountDue = (totalAmount / vatActual).round(2)
        BigDecimal vat = (totalAmountDue * 0.12).round(2)
        entity['isVatable'] = true
        entity['vatAmount'] = vat
        entity['totalAmountDue'] = totalAmountDue
        return entity
    }

    T applyCWTLocal(T entity, BigDecimal withholdingTaxPercentage){
        if(!entity)
            return  null

        String itemType = (entity['itemType']?:'') as String

        if(itemType.equalsIgnoreCase('transfer-erroneous') || itemType.equalsIgnoreCase('transfer-financial-assistance'))
            return  null

        BigDecimal totalAmountDue = entity['totalAmountDue'] as BigDecimal
        BigDecimal discountPercentage = (entity['discountPercentage'] ?: 0.00) as BigDecimal
        if(discountPercentage > 0)
            totalAmountDue = totalAmountDue * (discountPercentage/100)
        BigDecimal cwt = (totalAmountDue * (withholdingTaxPercentage ?:  0.05)).round(2)
        entity['isCWT'] = true
        entity['cwtAmount'] = cwt
        entity['cwtRate'] = withholdingTaxPercentage
        entity['totalAmountDue']  = totalAmountDue - cwt
        return entity
    }

    T applyVatCWT(UUID id, Boolean isVatable= false,Boolean isCWT=false, BigDecimal vatPercentage,BigDecimal withholdingTaxPercentage){
        def result = findOne(id)

        if(!result)
            return  null

        BigDecimal unitPrice = (result['unitPrice'] ?: 0.00) as BigDecimal
        BigDecimal quantity = (result['quantity'] ?: 0.00) as BigDecimal
        BigDecimal totalAmount = (unitPrice * quantity)
        String itemType = (result['itemType']?:'') as String
        BigDecimal discountPercentage = (result['discountPercentage'] ?: 0.00) as BigDecimal
        if(discountPercentage > 0)
            totalAmount = totalAmount * (discountPercentage/100)

        if(itemType.equalsIgnoreCase('transfer-erroneous') || itemType.equalsIgnoreCase('transfer-financial-assistance'))
            return  null

        if(!isVatable){
            if(isCWT)
               return applyCWT(id,isCWT,withholdingTaxPercentage)

            result['isCWT'] = false
            result['isVatable'] = false
            result['vatAmount'] = 0.00
            result['cwtAmount'] = 0.00
            result['cwtRate'] = 0
            result['totalAmountDue'] = totalAmount
            def newSave = save(result)
            return  newSave
        }

        BigDecimal cwt = 0.00
        BigDecimal vatActual = ((vatPercentage ?: 12) / 100) + 1
        BigDecimal amountWithVat = (totalAmount / vatActual ).round(2)
        BigDecimal vat = (amountWithVat * 0.12).round(2)
        if(isCWT)
            cwt  =( amountWithVat  *  (withholdingTaxPercentage ?:  0.05)).round(2)

        result['isVatable'] = true
        result['isCWT'] = true
        result['vatAmount'] = vat
        result['cwtAmount'] = cwt
        result['cwtRate'] = withholdingTaxPercentage

        result['totalAmountDue']  = amountWithVat - cwt
        def newSave = save(result)
        return newSave
    }

    static Instant dateToInstantConverter(Date dateTime){
        SimpleDateFormat yr = new SimpleDateFormat("yyyy")
        SimpleDateFormat mth = new SimpleDateFormat("MM")
        SimpleDateFormat dy = new SimpleDateFormat("dd")

        int year = Integer.parseInt(yr.format(dateTime).toString())
        int month = Integer.parseInt(mth.format(dateTime).toString())
        int date = Integer.parseInt(dy.format(dateTime).toString())
        Calendar cl = Calendar.getInstance()
        cl.set(year,month-1,date)
        TimeZone philZone = TimeZone.getTimeZone('UTC')
        cl.setTimeZone(philZone)
        return cl.getTime().toInstant()
    }


    Boolean updateArInvoicePayment(UUID invoiceID, BigDecimal amount){
        ArInvoice invoice = invoiceServices.findOne(invoiceID)
        if(!invoice)
            return  false

        invoice.totalPayments = (invoice.totalPayments?:0.00) + amount
        invoiceServices.save(invoice)
        return  true
    }

    Boolean updateArInvoiceCreditNote(UUID invoiceID, BigDecimal amount){
        ArInvoice invoice = invoiceServices.findOne(invoiceID)
        if(!invoice)
            return  false

        invoice.totalCreditNote = (invoice.totalCreditNote?:0.00) + amount
        invoiceServices.save(invoice)
        return  true
    }

}
