package com.backend.gbp.domain.accounting.dto

import groovy.transform.Canonical

// START OF GLOBAL DTO ----------------------------------------


// END OF GLOBAL DTO ------------------------------------------
@Canonical
class GuarantorDto implements Serializable {
    UUID id
    String recordNo
    String name
    String address
    String type
}

@Canonical
class GuarantorBillingDto implements  Serializable {
    UUID id
    String billingNo
    String finalSoa
}


@Canonical
class AttendingPhysicianDto implements Serializable {
    UUID id
    String employeeNo
    String firstName
    String middleName
    String lastName
    String PhysNo
    String titleInit
    Boolean vatOrNon
    BigDecimal pfVatRate
    BigDecimal expandedWTaxRate
}


@Canonical
class GuarantorBillingItemDto implements  Serializable {
    UUID id
    String recordNo
    String description
    String itemType
    String transactionDate
    AttendingPhysicianDto attendingPhysician
    BigDecimal amount
}

@Canonical
class GuarantorPatientDto implements  Serializable {
    UUID id
    String patientNo
    String firstName
    String middleName
    String lastName
    String suffix
    String address
    String gender
}


@Canonical
class GuarantorPatientCaseDto implements  Serializable {
    UUID id
    String caseNo
    String registryType
    String admissionDatetime
    String dischargedDatetime
}

// START OF CUSTOMER DTO -----------------------------------------
@Canonical
class PeriodWithUOT implements Serializable{
    Integer period
    String unitOfTime
    String description
}

@Canonical
class PaymentPromptField implements Serializable{
    BigDecimal rate
    Integer maximumDays
}

@Canonical
class CompanyDiscountAndPenalties {
    String salesAccountCode
    BigDecimal creditLimit
    Integer creditPeriod
    Boolean blockOnCreditLimit
    Boolean autoDiscountInPayment
    PaymentPromptField[] paymentDiscounts
    PaymentPromptField[] overduePenalties

}

enum ContactType {
    HOME,
    WORK,
    BILLING
}

@Canonical
class CustomerContact {
    String street
    String barangay
    String city
    String province
    String country
    Integer zipcode
    String phoneNo
    String email
    ContactType type
}

@Canonical
class CustomerOtherDetails {
    CustomerContact[] contacts
    CustomerContact billingContact
    String color
}

@Canonical
class CustomerInfo {
    String firstName
    String middleName
    String lastName
    String birthday
    String gender
    String govId
    String govIdType
}




// END OF CUSTOMER DTO -----------------------------------------------