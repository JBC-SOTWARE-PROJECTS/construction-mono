package com.backend.gbp.domain.hrm.dto


enum PaymentTerm {
    MONTHLY, SEMI_MONTHLY
}

class EmployeeLoanConfig {

    PaymentTerm cashAdvanceTerm
    BigDecimal cashAdvanceAmount

    PaymentTerm equipmentLoanTerm
    BigDecimal equipmentLoanAmount
}

