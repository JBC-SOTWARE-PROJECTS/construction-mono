package com.backend.gbp.domain.hrm.dto


enum LoanPaymentTerm {
    MONTHLY, SEMI_MONTHLY
}

class EmployeeLoanConfig {

    LoanPaymentTerm cashAdvanceTerm
    BigDecimal cashAdvanceAmount

    LoanPaymentTerm equipmentLoanTerm
    BigDecimal equipmentLoanAmount
}

