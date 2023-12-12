package com.backend.gbp.domain.accounting.dto;


import groovy.transform.Canonical;


@Canonical
class AccountsPayableProfessionalFeeDTO {
    UUID id
    String transactionDate
    String billingNo
    String soaNo
    UUID billing
    String caseNo
    String patientName
    String recordNo
    String description
    BigDecimal pfFee
    String orNumber
    UUID pfEmployeeId
    UUID paymentTrackerId
    UUID supplierId
    String supplierFullname
    Boolean apProcess
    UUID apRefId
    String apRefNo
}

@Canonical
class AccountsPayableReadersFeeDTO {
    UUID id
    String transactionDate
    String billingNo
    String soaNo
    UUID billing
    String caseNo
    String patientName
    String recordNo
    String description
    UUID department
    String departmentName
    String parentDepartment
    BigDecimal price
    UUID pricingTier
    String priceTierDescription
    BigDecimal rfFee
    UUID supplierId
    String supplierFullname
    BigDecimal percentage
    String registryTypeCharged
    Boolean apProcess
    UUID apRefId
    String apRefNo
}