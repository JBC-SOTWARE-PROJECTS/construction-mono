export const GenderOptions = [
  { value: 'MALE', label: 'Male' },
  { value: 'FEMALE', label: 'Female' },
]

export const GovernmentIDOptions = [
  { value: 'SSS', label: 'SSS (Social Security System)' },
  { value: 'TIN', label: 'TIN (Tax Identification Number)' },
  {
    value: 'PhilHealth',
    label: 'PhilHealth (Philippine Health Insurance Corporation)',
  },
  { value: 'GSIS', label: 'GSIS (Government Service Insurance System)' },
  { value: 'PRC', label: 'PRC (Professional Regulation Commission ID)' },
  { value: 'Passport', label: 'Passport' },

  { value: 'VotersID', label: 'Voters ID' },
  { value: 'SeniorCitizenID', label: 'Senior Citizen ID' },
  { value: 'PWDID', label: 'PWD ID' },
  { value: 'PostalID', label: 'Postal ID' },

  // Add more options as needed
]

export const CustomerTypeOptions = [
  { value: 'PRIVATE', label: 'Private' },
  { value: 'GOVERNMENT', label: 'Government' },
]

export const CustomerTypeOptionsFilter = [
  { value: 'ALL', label: 'All customers' },
  { value: 'PRIVATE', label: 'Private Accounts' },
  { value: 'GOVERNMENT', label: 'Government Accounts' },
]

export const InvoiceTransactionModeOptions = [
  { value: 'property_rent_and_energy', label: 'Property Rent and Energy' },
  { value: 'claims', label: 'Project' },
]

export const InvoiceItemsTypeOptions = [
  { value: 'electricity', label: 'Electricity Bill' },
  { value: 'affiliation', label: 'Affiliation Fee' },
  { value: 'rental', label: 'Hospital Space Rental' },
  // { value: 'custom', label: 'Custom Item' },
]

export const InvoiceItemsTaxOptions = [
  {
    value: 'yes',
    label: 'Yes',
  },
  {
    value: 'no',
    label: 'No',
  },
]

export const InvoiceItemsTaxTypeOptions = [
  {
    value: true,
    label: 'vatable',
  },
  {
    value: false,
    label: 'non-vatable',
  },
]

export const InvoiceInputFilterOpt = [
  { text: 'All', value: 'all' },
  { text: 'HCI', value: 'HCI' },
  { text: 'PF', value: 'PF' },
  { text: 'Regular Items', value: 'regular' },
]

export const CreditNoteItemTypeOptions = [
  { value: 'discount', label: 'Discount' },
  {
    value: 'transfer-erroneous',
    label: 'Transfer Account Erroneous Transaction',
  },
  {
    value: 'transfer-financial-assistance',
    label: 'Transfer Account Financial Assistance',
  },
  { value: 'custom', label: 'Custom' },
]

export const CreditNoteItemDiscountOptions = [
  { key: 'percentage', text: 'Generate Discount', value: 'percentage' },
  { key: 'amount', text: 'Amount', value: 'amount' },
]

export const CWTRates = [
  { label: '0%', value: 0 },
  { label: '1%', value: 0.01 },
  { label: '2%', value: 0.02 },
  { label: '3%', value: 0.03 },
  { label: '4%', value: 0.04 },
  { label: '5%', value: 0.05 },
  { label: '6%', value: 0.06 },
  { label: '7%', value: 0.07 },
  { label: '8%', value: 0.08 },
  { label: '9%', value: 0.09 },
  { label: '10%', value: 0.1 },
  { label: '11%', value: 0.11 },
  { label: '12%', value: 0.12 },
  { label: '13%', value: 0.13 },
  { label: '14%', value: 0.14 },
  { label: '15%', value: 0.15 },
]

export const IsVatable = [
  { label: 'Yes', value: true },
  { label: 'No', value: false },
]

export const InvoiceActionSaveItems = [
  {
    key: 'save&add',
    label: 'Save & add another',
  },
  {
    key: 'submitForApproval',
    label: 'Submit for approval',
  },
]

export const InvoiceActionApproveItems = [
  {
    key: 'approve&add',
    label: 'Approve & add another',
  },
]

export const GuarantorBillingItemSearchFilter = [
  {
    value: 'FOLIO_NO',
    label: 'Folio No',
  },
  {
    value: 'RECORD_NO',
    label: 'Record No',
  },
  {
    value: 'PATIENT_NAME',
    label: 'Patient Name',
  },
  {
    value: 'DESCRIPTION',
    label: 'Description',
  },
  {
    value: 'APPROVAL_CODE',
    label: 'Project Reference',
  },
]

export const ClaimsType = [
  {
    value: 'HCI',
    label: 'HCI',
  },
  {
    value: 'PF',
    label: 'PF',
  },
]
// ======================================= ENUM ==============]
export enum CustomerTypeColorEnum {
  HMO = 'geekblue',
  CORPORATE = 'green',
  PERSONAL = 'volcano',
  PROMISSORY_NOTE = 'Borrower',
}

export enum CustomerTypeEnum {
  HMO = 'Third-Party Payer Accounts',
  CORPORATE = 'Corporate Client Accounts',
  PERSONAL = 'Lessee Accounts',
  PROMISSORY_NOTE = 'Borrower',
}

export enum CustomerTypeIconEnum {
  HMO = 'hospital outline',
  CORPORATE = 'building outline',
  PERSONAL = 'user',
  PROMISSORY_NOTE = 'user',
}

export enum CustomerTypeDomainEnum {
  HMO = 'company',
  CORPORATE = 'company',
  PERSONAL = 'supplier',
  PROMISSORY_NOTE = 'patient',
}

export const InvoiceTypeOptEnum = {
  regular: { value: 'regular', label: 'Regular Invoice' },
  claims: { value: 'claims', label: 'Project Invoice' },
}

export enum InvoiceItemsTypeEnum {
  electricity = 'Electricity Bill',
  affiliation = 'Affiliation Fee',
  rental = 'Hospital Space Rental',
  custom = 'Custom Item',
}

export const InvoiceItemsTypeOptEnum = {
  electricity: { value: 'electricity', label: 'Electricity bill' },
  affiliation: { value: 'affiliation', label: 'Affiliation Fee' },
  rental: { value: 'rental', label: 'Hospital Space Rental' },
  custom: { value: 'custom', label: 'Custom Item' },
}

export enum CreditNoteItemDiscountOptionsEnum {
  percentage = 'percent',
  amount = 'hashtag',
}

export enum CreditNoteItemTotalAmountDueLabel {
  DISCOUNT = 'Generated Discount Amount',
  'TRANSFER-ERRONEOUS' = 'Transfer',
  'TRANSFER-FINANCIAL-ASSISTANCE' = 'Transfer',
}

export const CreditNoteItemTypeEnum = {
  DISCOUNT: { value: 'discount', label: 'Discount' },
  'TRANSFER-ERRONEOUS': {
    value: 'transfer-erroneous',
    label: 'Transfer Account Erroneous Transaction',
  },
  'TRANSFER-FINANCIAL-ASSISTANCE': {
    value: 'transfer-financial-assistance',
    label: 'Transfer Account Financial Assistance',
  },
}

export enum InvoiceStatusEnum {
  DRAFT = 'DRAFT',
  APPROVAL_IN_PROGRESS = 'APPROVAL_IN_PROGRESS',
  PENDING = 'PENDING',
}

export enum CreditNoteStatusEnum {
  DRAFT = 'DRAFT',
  APPROVAL_IN_PROGRESS = 'APPROVAL_IN_PROGRESS',
  UNAPPLIED = 'UNAPPLIED',
  POSTED = 'POSTED',
}

export enum InvoiceStatusLabelEnum {
  DRAFT = 'Draft',
  APPROVAL_IN_PROGRESS = 'Approval in progress',
  PENDING = 'Payment in progress',
  PAID = 'Paid',
  PARTIALLY_PAID = 'Partially Paid',
  POSTED = 'Posted',
}

export enum InvoiceStatusColorEnum {
  APPROVAL_IN_PROGRESS = '#3b5998',
  DRAFT = 'orange',
  PENDING = 'teal',
  PAID = '#3b5998',
  PARTIALLY_PAID = '#3b5998',
}

export enum CreditNoteStatusColorEnum {
  DRAFT = 'orange',
  POSTED = 'teal',
  APPROVAL_IN_PROGRESS = '#3b5998',
  UNAPPLIED = 'red',
}

export enum CreditNoteStatusLabelEnum {
  DRAFT = 'Draft',
  APPROVAL_IN_PROGRESS = 'Approval in progress',
  UNAPPLIED = 'Unapplied',
  POSTED = 'Posted',
}

export enum PaymentPostingStatusLabelEnum {
  DRAFT = 'Draft',
  APPROVAL_IN_PROGRESS = 'Approval in progress',
  PENDING = 'Payment in progress',
  PAID = 'Paid',
}

export enum PaymentPostingStatusColorEnum {
  APPROVAL_IN_PROGRESS = '#7cb305',
  DRAFT = 'orange',
  POSTED = 'geekblue',
  PAID = '#3b5998',
}

export enum PaymentPostingStatusEnum {
  DRAFT = 'DRAFT',
  APPROVAL_IN_PROGRESS = 'APPROVAL_IN_PROGRESS',
  POSTED = 'POSTED',
}

export const arReportsGroup = [
  {
    groupTitle: 'Aging Report',
    data: [
      {
        title: 'Accounts Receivable Aging Summary',
        path: '/',
      },
      { title: 'Accounts Receivable Aging Detail', path: '/' },
    ],
  },

  {
    groupTitle: 'Customer Activity Report',
    data: [
      {
        title: 'Customer Statement of Account',
        path: '/receivables-collections/accounts-receivable/reports/statement-of-account',
      },
      {
        title: 'Customer Transaction History',
        path: '/',
      },
    ],
  },

  // {
  //   groupTitle: 'Invoice, Credit Note and Payment Reports',
  //   data: [
  //     {
  //       title: 'Invoices Report',
  //       path: '/',
  //     },
  //     {
  //       title: 'Credit Note Report',
  //       path: '/',
  //     },
  //     {
  //       title: 'Invoice Reconciliation Report',
  //       path: '/',
  //     },
  //     {
  //       title: 'Cash Receipts Journal',
  //       path: '/',
  //     },
  //   ],
  // },
  // {
  //   groupTitle: 'Executive Reports',
  //   data: [
  //     {
  //       title: 'Receivable Summary Report',
  //       path: '/',
  //     },
  //   ],
  // },
  // {
  //   groupTitle: 'Billing Folio Reports',
  //   data: [
  //     {
  //       title: 'In-patient Aging Report',
  //       path: '/',
  //     },
  //     {
  //       title: 'Out-patient Aging Report',
  //       path: '/',
  //     },
  //     {
  //       title: 'ERD-patient Aging Report',
  //       path: '/',
  //     },
  //     {
  //       title: 'OTC Aging Report',
  //       path: '/',
  //     },
  //   ],
  // },
]

export const InvoiceItemCategory = [
  { value: 'SERVICES', label: 'Services' },
  {
    value: 'PRODUCT',
    label: 'Product',
  },
  { value: 'OTHERS', label: 'Others' },
]

export const PaymentMethodType = [
  { value: 'CASH', label: 'Cash' },
  { value: 'CARD', label: 'Card' },
  { value: 'CHECK', label: 'Check' },
  { value: 'BANKDEPOSIT', label: 'Bank Deposit' },
  { value: 'EWALLET', label: 'E-Wallet' },
]

export const MiscCardType = [
  { label: 'VISA', value: 'VISA' },
  { label: 'MASTERCARD', value: 'MASTERCARD' },
  { label: 'JCB', value: 'JCB' },
  { label: 'UNIONPAY', value: 'UNIONPAY' },
  { label: 'AMEX', value: 'AMEX' },
  { label: 'OTHERS', value: 'OTHERS' },
]

export const MiscEWalletType = [
  { label: 'MAYA', value: 'MAYA' },
  { label: 'GCASH', value: 'GCASH' },
  { label: 'QRPH', value: 'QRPH' },
  { label: 'OTHERS', value: 'OTHERS' },
]

export const InvoiceTypeOption = [
  { label: 'Project Invoice', value: 'PROJECT' },
  { label: 'Regular Invoice', value: 'REGULAR' },
]

export enum PaymentMethodStatusLabelEnum {
  CASH = 'Cash',
  CARD = 'Card',
  BANKDEPOSIT = 'Bank Deposit',
  CHECK = 'Check',
  EWALLET = 'E-Wallet',
}

export enum PaymentMethodStatusColorEnum {
  CASH = 'purple',
  CARD = 'orange',
  BANKDEPOSIT = 'cyan',
  CHECK = 'yellow',
  EWALLET = 'pink',
}
