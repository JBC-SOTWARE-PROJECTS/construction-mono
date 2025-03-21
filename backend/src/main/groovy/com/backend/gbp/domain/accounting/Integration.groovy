package com.backend.gbp.domain.accounting

import com.backend.gbp.domain.AbstractAuditingEntity
import com.backend.gbp.domain.CompanySettings
import com.backend.gbp.domain.annotations.UpperCase
import io.leangen.graphql.annotations.GraphQLQuery
import org.hibernate.annotations.GenericGenerator
import org.hibernate.annotations.NotFound
import org.hibernate.annotations.NotFoundAction
import org.hibernate.annotations.Type

import javax.persistence.*


enum IntegrationDomainEnum {
    NO_DOMAIN("NO DOMAIN", ""),
    INVOICE("Invoice", "com.backend.gbp.domain.accounting.ArInvoice"),
    CREDIT_NOTE("Credit Note", "com.backend.gbp.domain.accounting.ArCreditNote"),
    PAYMENT("Payment", "com.backend.gbp.domain.cashier.Payment"),
    BILLING_ITEM("Billing Item", "com.backend.gbp.domain.billing.BillingItem"),
    ACCOUNTS_PAYABLE("Accounts Payable", "com.backend.gbp.domain.accounting.AccountsPayable"),
    DISBURSEMENT("Disbursement", "com.backend.gbp.domain.accounting.Disbursement"),
    REAPPLICATION("Disbursement Reapplication", "com.backend.gbp.domain.accounting.Reapplication"),
    DEBIT_MEMO("Debit Memo", "com.backend.gbp.domain.accounting.DebitMemo"),
    PETTY_CASH("Petty Cash", "com.backend.gbp.domain.accounting.PettyCashAccounting"),
    PAYROLL("Payroll", "com.backend.gbp.domain.payroll.Payroll"),
    EMPLOYEE_LOAN("Employee Loan", "com.backend.gbp.domain.payroll.EmployeeLoan"),
    FIXED_ASSET_ITEM("Fixed Asset Item", "com.backend.gbp.domain.fixed_asset.FixedAssetItems"),
    LOAN_AMORTIZATION("Loan Amortization", "com.backend.gbp.domain.accounting.LoanAmortization"),
    LOAN("Loan", "com.backend.gbp.domain.accounting.Loan"),
    PROJECT_WORK_ACCOMPLISH("Project Work Accomplish", "com.backend.gbp.domain.accounting.ProjectWorkAccomplish"),
    //inventory
    QUANTITY_ADJUSTMENT("Quantity Adjustment", "com.backend.gbp.domain.inventory.QuantityAdjustment"),
    BEGINNING_BALANCE("Beginning Balance", "com.backend.gbp.domain.inventory.BeginningBalance"),
    RECEIVING_REPORT("Receiving Report", "com.backend.gbp.domain.inventory.ReceivingReport"),
    RETURN_SUPPLIER("Return Supplier", "com.backend.gbp.domain.inventory.ReturnSupplier"),
    ISSUE_EXPENSE("Item Issuance/Expense", "com.backend.gbp.domain.inventory.StockIssue")

    String displayName
    String path

    IntegrationDomainEnum(String displayName, String path) {
        this.displayName = displayName
        this.path = path
    }

    String toString() {
        return displayName
    }

    String getPath() {
        return path
    }
}


@Entity
@Table(name = "integration", schema = "accounting")
class Integration extends AbstractAuditingEntity implements Serializable {

    @GraphQLQuery
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid", strategy = "uuid2")
    @Column(name = "id", columnDefinition = "uuid")
    @Type(type = "pg-uuid")
    UUID id


    @GraphQLQuery
    @Column(name = "description", columnDefinition = "varchar")
    @UpperCase
    String description

    @ManyToOne(fetch = FetchType.LAZY)
    @NotFound(action = NotFoundAction.IGNORE)
    @JoinColumn(name = "integration_group", referencedColumnName = "id")
    IntegrationGroup integrationGroup

    @GraphQLQuery
    @Column(name = "flag_value", columnDefinition = "varchar")
    String flagValue

    @GraphQLQuery
    @Enumerated(EnumType.STRING)
    @Column(name = "domain", columnDefinition = "varchar")
    IntegrationDomainEnum domain

    @GraphQLQuery
    @Column(name = "order_priority", columnDefinition = "int")
    Integer orderPriority

    @GraphQLQuery
    @OrderBy("createdDate")
    @OneToMany(fetch = FetchType.EAGER, mappedBy = "integration", cascade = [CascadeType.ALL], orphanRemoval = true)
    List<IntegrationItem> integrationItems  = []

    @GraphQLQuery
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "company_id", referencedColumnName = "id")
    CompanySettings company

    @GraphQLQuery
    @Column(name = "auto_post", columnDefinition = "varchar")
    Boolean autoPost
}
