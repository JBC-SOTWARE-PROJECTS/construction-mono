/* eslint-disable */
import { TypedDocumentNode as DocumentNode } from '@graphql-typed-document-node/core';
export type Maybe<T> = T | null;
export type InputMaybe<T> = Maybe<T>;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  /** Built-in java.math.BigDecimal */
  BigDecimal: { input: any; output: any; }
  /** Built-in scalar representing an instant in time */
  Date: { input: any; output: any; }
  /** Built-in scalar representing an instant in time */
  Instant: { input: any; output: any; }
  /** Built-in scalar representing a local date */
  LocalDate: { input: any; output: any; }
  /** Built-in scalar representing a local date-time */
  LocalDateTime: { input: any; output: any; }
  /** Long type */
  Long: { input: any; output: any; }
  /** Built-in scalar for map-like structures */
  Map_String_BigDecimalScalar: { input: any; output: any; }
  /** Built-in scalar for map-like structures */
  Map_String_List_EventCalendarScalar: { input: any; output: any; }
  /** Built-in scalar for map-like structures */
  Map_String_List_ScheduleDtoScalar: { input: any; output: any; }
  /** Built-in scalar for map-like structures */
  Map_String_ObjectScalar: { input: any; output: any; }
  /** Built-in scalar for map-like structures */
  Map_String_ScheduleLockScalar: { input: any; output: any; }
  /** Built-in scalar for map-like structures */
  Map_String_StringScalar: { input: any; output: any; }
  /** Unrepresentable type */
  UNREPRESENTABLE: { input: any; output: any; }
  /** UUID String */
  UUID: { input: any; output: any; }
};

export type ArInvoiceDto = {
  __typename?: 'ARInvoiceDto';
  amount?: Maybe<Scalars['BigDecimal']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  itemName?: Maybe<Scalars['String']['output']>;
  qty?: Maybe<Scalars['Int']['output']>;
  unit_price?: Maybe<Scalars['BigDecimal']['output']>;
};

export type ArPaymentPosting = {
  __typename?: 'ARPaymentPosting';
  arCustomerId?: Maybe<Scalars['UUID']['output']>;
  companyId?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  customerName?: Maybe<Scalars['String']['output']>;
  discountAmount?: Maybe<Scalars['BigDecimal']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  invoiceId?: Maybe<Scalars['UUID']['output']>;
  invoiceNo?: Maybe<Scalars['String']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  orNumber?: Maybe<Scalars['String']['output']>;
  paymentAmount?: Maybe<Scalars['BigDecimal']['output']>;
  paymentDatetime?: Maybe<Scalars['Instant']['output']>;
  paymentTrackerId?: Maybe<Scalars['UUID']['output']>;
  receiptType?: Maybe<Scalars['String']['output']>;
  recordNo?: Maybe<Scalars['String']['output']>;
  referenceCn?: Maybe<Scalars['UUID']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

export type ArPaymentPostingItems = {
  __typename?: 'ARPaymentPostingItems';
  amountPaid?: Maybe<Scalars['BigDecimal']['output']>;
  appliedDiscount?: Maybe<Scalars['BigDecimal']['output']>;
  arPaymentPosting?: Maybe<ArPaymentPosting>;
  companyId?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  customerId?: Maybe<Scalars['UUID']['output']>;
  customerName?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  invoiceDueDate?: Maybe<Scalars['Date']['output']>;
  invoiceId?: Maybe<Scalars['UUID']['output']>;
  invoiceItemId?: Maybe<Scalars['UUID']['output']>;
  invoiceNo?: Maybe<Scalars['String']['output']>;
  itemName?: Maybe<Scalars['String']['output']>;
  itemType?: Maybe<Scalars['String']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  orNumber?: Maybe<Scalars['String']['output']>;
  paymentDatetime?: Maybe<Scalars['Instant']['output']>;
  paymentTrackerId?: Maybe<Scalars['UUID']['output']>;
  recordNo?: Maybe<Scalars['String']['output']>;
  reference?: Maybe<Scalars['String']['output']>;
  totalAmountDue?: Maybe<Scalars['BigDecimal']['output']>;
};

export enum AccountCategory {
  Asset = 'ASSET',
  Equity = 'EQUITY',
  Expense = 'EXPENSE',
  Liability = 'LIABILITY',
  Revenue = 'REVENUE'
}

export type AccountOpt = {
  __typename?: 'AccountOpt';
  label?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type AccountPayableDetialsDtoInput = {
  amount?: InputMaybe<Scalars['BigDecimal']['input']>;
  discAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  discRate?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewtAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewtRate?: InputMaybe<Scalars['BigDecimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  isNew?: InputMaybe<Scalars['Boolean']['input']>;
  netAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  office?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  project?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  refNo?: InputMaybe<Scalars['String']['input']>;
  remarksNotes?: InputMaybe<Scalars['String']['input']>;
  taxDesc?: InputMaybe<Scalars['String']['input']>;
  transType?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  vatAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  vatInclusive?: InputMaybe<Scalars['Boolean']['input']>;
};

export enum AccountType {
  CurrentAssets = 'CURRENT_ASSETS',
  CurrentLiabilities = 'CURRENT_LIABILITIES',
  Equity = 'EQUITY',
  Expenses = 'EXPENSES',
  LongTermAssets = 'LONG_TERM_ASSETS',
  LongTermLiabilities = 'LONG_TERM_LIABILITIES',
  Revenue = 'REVENUE'
}

export type AccountTypeDto = {
  __typename?: 'AccountTypeDto';
  label?: Maybe<Scalars['String']['output']>;
  options?: Maybe<Array<Maybe<OptionDto>>>;
};

export enum AccountingEntryType {
  Credit = 'CREDIT',
  Debit = 'DEBIT'
}

export type AccountsPayable = {
  __typename?: 'AccountsPayable';
  apCategory?: Maybe<Scalars['String']['output']>;
  apNo?: Maybe<Scalars['String']['output']>;
  appliedAmount?: Maybe<Scalars['BigDecimal']['output']>;
  apvDate?: Maybe<Scalars['Instant']['output']>;
  balance?: Maybe<Scalars['BigDecimal']['output']>;
  clearingAmount?: Maybe<Scalars['BigDecimal']['output']>;
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  cwt?: Maybe<Scalars['BigDecimal']['output']>;
  daAmount?: Maybe<Scalars['BigDecimal']['output']>;
  debitAmount?: Maybe<Scalars['BigDecimal']['output']>;
  details?: Maybe<Scalars['Map_String_StringScalar']['output']>;
  disbursement?: Maybe<Scalars['String']['output']>;
  discAmount?: Maybe<Scalars['BigDecimal']['output']>;
  discountAmount?: Maybe<Scalars['BigDecimal']['output']>;
  dmAmount?: Maybe<Scalars['BigDecimal']['output']>;
  dmRefNo?: Maybe<Scalars['String']['output']>;
  domain?: Maybe<Scalars['String']['output']>;
  dueDate?: Maybe<Scalars['Instant']['output']>;
  ewt1Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewt2Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewt3Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewt4Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewt5Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewt7Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewt10Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewt15Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewt18Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewt30Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewtAmount?: Maybe<Scalars['BigDecimal']['output']>;
  flagValue?: Maybe<Scalars['String']['output']>;
  grossAmount?: Maybe<Scalars['BigDecimal']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  invoiceNo?: Maybe<Scalars['String']['output']>;
  isBeginningBalance?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  netAmount?: Maybe<Scalars['BigDecimal']['output']>;
  netOfDiscount?: Maybe<Scalars['BigDecimal']['output']>;
  netOfVat?: Maybe<Scalars['BigDecimal']['output']>;
  paymentTerms?: Maybe<PaymentTerm>;
  posted?: Maybe<Scalars['Boolean']['output']>;
  postedBy?: Maybe<Scalars['String']['output']>;
  postedLedger?: Maybe<Scalars['UUID']['output']>;
  receiving?: Maybe<ReceivingReport>;
  referenceType?: Maybe<Scalars['String']['output']>;
  remarksNotes?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  supplier?: Maybe<Supplier>;
  supplierAmount?: Maybe<Scalars['BigDecimal']['output']>;
  transType?: Maybe<ApTransaction>;
  vatAmount?: Maybe<Scalars['BigDecimal']['output']>;
  vatInclusive?: Maybe<Scalars['Boolean']['output']>;
  vatRate?: Maybe<Scalars['BigDecimal']['output']>;
};

export type AccountsPayableDetails = {
  __typename?: 'AccountsPayableDetails';
  accountsPayable?: Maybe<AccountsPayable>;
  amount?: Maybe<Scalars['BigDecimal']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  discAmount?: Maybe<Scalars['BigDecimal']['output']>;
  discRate?: Maybe<Scalars['BigDecimal']['output']>;
  ewtAmount?: Maybe<Scalars['BigDecimal']['output']>;
  ewtRate?: Maybe<Scalars['BigDecimal']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  netAmount?: Maybe<Scalars['BigDecimal']['output']>;
  office?: Maybe<Office>;
  project?: Maybe<Projects>;
  refId?: Maybe<Scalars['UUID']['output']>;
  refNo?: Maybe<Scalars['String']['output']>;
  remarksNotes?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  taxDesc?: Maybe<Scalars['String']['output']>;
  transType?: Maybe<ApTransaction>;
  vatAmount?: Maybe<Scalars['BigDecimal']['output']>;
  vatInclusive?: Maybe<Scalars['Boolean']['output']>;
};

export type AccountsPayableInput = {
  apCategory?: InputMaybe<Scalars['String']['input']>;
  apNo?: InputMaybe<Scalars['String']['input']>;
  appliedAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  apvDate?: InputMaybe<Scalars['Instant']['input']>;
  balance?: InputMaybe<Scalars['BigDecimal']['input']>;
  clearingAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  company?: InputMaybe<Scalars['UUID']['input']>;
  cwt?: InputMaybe<Scalars['BigDecimal']['input']>;
  daAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  debitAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  disbursement?: InputMaybe<Scalars['String']['input']>;
  discAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  discountAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  dmAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  dmRefNo?: InputMaybe<Scalars['String']['input']>;
  dueDate?: InputMaybe<Scalars['Instant']['input']>;
  ewt1Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt2Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt3Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt4Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt5Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt7Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt10Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt15Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt18Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt30Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewtAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  flagValue?: InputMaybe<Scalars['String']['input']>;
  grossAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  invoiceNo?: InputMaybe<Scalars['String']['input']>;
  isBeginningBalance?: InputMaybe<Scalars['Boolean']['input']>;
  netAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  netOfDiscount?: InputMaybe<Scalars['BigDecimal']['input']>;
  netOfVat?: InputMaybe<Scalars['BigDecimal']['input']>;
  paymentTerms?: InputMaybe<PaymentTermInput>;
  posted?: InputMaybe<Scalars['Boolean']['input']>;
  postedBy?: InputMaybe<Scalars['String']['input']>;
  postedLedger?: InputMaybe<Scalars['UUID']['input']>;
  receiving?: InputMaybe<ReceivingReportInput>;
  referenceType?: InputMaybe<Scalars['String']['input']>;
  remarksNotes?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  supplier?: InputMaybe<SupplierInput>;
  supplierAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  transType?: InputMaybe<ApTransactionInput>;
  vatAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  vatInclusive?: InputMaybe<Scalars['Boolean']['input']>;
  vatRate?: InputMaybe<Scalars['BigDecimal']['input']>;
};

export type AccumulatedLogs = {
  __typename?: 'AccumulatedLogs';
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  date?: Maybe<Scalars['Instant']['output']>;
  employeeId?: Maybe<Scalars['UUID']['output']>;
  hours?: Maybe<HoursLog>;
  id?: Maybe<Scalars['UUID']['output']>;
  inTime?: Maybe<Scalars['Instant']['output']>;
  isError?: Maybe<Scalars['Boolean']['output']>;
  isLeave?: Maybe<Scalars['Boolean']['output']>;
  isRestDay?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  message?: Maybe<AccumulatedLogsMessage>;
  outTime?: Maybe<Scalars['Instant']['output']>;
  projectBreakdown?: Maybe<Array<Maybe<HoursLog>>>;
  scheduleEnd?: Maybe<Scalars['Instant']['output']>;
  scheduleStart?: Maybe<Scalars['Instant']['output']>;
  scheduleTitle?: Maybe<Scalars['String']['output']>;
  timekeepingEmployee?: Maybe<TimekeepingEmployee>;
};

export enum AccumulatedLogsMessage {
  Absent = 'ABSENT',
  Holiday = 'HOLIDAY',
  Leave = 'LEAVE',
  NoSchedule = 'NO_SCHEDULE'
}

export type AdjustmentCategory = {
  __typename?: 'AdjustmentCategory';
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isDefault?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  operation?: Maybe<AdjustmentOperation>;
  status?: Maybe<Scalars['Boolean']['output']>;
  subaccountCode?: Maybe<Scalars['String']['output']>;
};

export enum AdjustmentOperation {
  Addition = 'ADDITION',
  Subtraction = 'SUBTRACTION'
}

export type Allowance = {
  __typename?: 'Allowance';
  allowanceType?: Maybe<AllowanceType>;
  amount?: Maybe<Scalars['Float']['output']>;
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isAttendanceBased?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  subaccountCode?: Maybe<Scalars['String']['output']>;
};

export type AllowanceInput = {
  allowanceType?: InputMaybe<AllowanceType>;
  amount?: InputMaybe<Scalars['Float']['input']>;
  company?: InputMaybe<CompanySettingsInput>;
  createdDate?: InputMaybe<Scalars['Instant']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  isAttendanceBased?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  subaccountCode?: InputMaybe<Scalars['String']['input']>;
};

export type AllowanceItem = {
  __typename?: 'AllowanceItem';
  allowance?: Maybe<Allowance>;
  allowanceId?: Maybe<Scalars['UUID']['output']>;
  allowancePackage?: Maybe<AllowancePackage>;
  allowanceType?: Maybe<AllowanceType>;
  amount?: Maybe<Scalars['BigDecimal']['output']>;
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type AllowancePackage = {
  __typename?: 'AllowancePackage';
  allowanceItems?: Maybe<Array<Maybe<AllowanceItem>>>;
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['Boolean']['output']>;
};

export enum AllowanceType {
  Daily = 'DAILY',
  SemiMonthly = 'SEMI_MONTHLY'
}

export type ApAccountsTemplate = {
  __typename?: 'ApAccountsTemplate';
  category?: Maybe<Scalars['String']['output']>;
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  status?: Maybe<Scalars['Boolean']['output']>;
  supplierType?: Maybe<SupplierType>;
};

export type ApAccountsTemplateItems = {
  __typename?: 'ApAccountsTemplateItems';
  accountType?: Maybe<Scalars['String']['output']>;
  apAccountsTemplate?: Maybe<ApAccountsTemplate>;
  code?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  desc?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
};

export type ApAgingDetailedDto = {
  __typename?: 'ApAgingDetailedDto';
  ap_category?: Maybe<Scalars['String']['output']>;
  ap_no?: Maybe<Scalars['String']['output']>;
  apv_date?: Maybe<Scalars['String']['output']>;
  current_amount?: Maybe<Scalars['BigDecimal']['output']>;
  day_1_to_31?: Maybe<Scalars['BigDecimal']['output']>;
  day_31_to_60?: Maybe<Scalars['BigDecimal']['output']>;
  day_61_to_90?: Maybe<Scalars['BigDecimal']['output']>;
  day_91_to_120?: Maybe<Scalars['BigDecimal']['output']>;
  due_date?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  invoice_date?: Maybe<Scalars['String']['output']>;
  invoice_no?: Maybe<Scalars['String']['output']>;
  older?: Maybe<Scalars['BigDecimal']['output']>;
  posted?: Maybe<Scalars['Boolean']['output']>;
  remarks_notes?: Maybe<Scalars['String']['output']>;
  supplier?: Maybe<Scalars['String']['output']>;
  supplier_id?: Maybe<Scalars['UUID']['output']>;
  supplier_type?: Maybe<Scalars['String']['output']>;
  supplier_type_id?: Maybe<Scalars['UUID']['output']>;
  total?: Maybe<Scalars['BigDecimal']['output']>;
};

export type ApAgingSummaryDto = {
  __typename?: 'ApAgingSummaryDto';
  current_amount?: Maybe<Scalars['BigDecimal']['output']>;
  day_1_to_31?: Maybe<Scalars['BigDecimal']['output']>;
  day_31_to_60?: Maybe<Scalars['BigDecimal']['output']>;
  day_61_to_90?: Maybe<Scalars['BigDecimal']['output']>;
  day_91_to_120?: Maybe<Scalars['BigDecimal']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  older?: Maybe<Scalars['BigDecimal']['output']>;
  supplier?: Maybe<Scalars['String']['output']>;
  supplier_type?: Maybe<Scalars['String']['output']>;
  supplier_type_id?: Maybe<Scalars['String']['output']>;
  total?: Maybe<Scalars['BigDecimal']['output']>;
};

export type ApLedger = {
  __typename?: 'ApLedger';
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  credit?: Maybe<Scalars['BigDecimal']['output']>;
  debit?: Maybe<Scalars['BigDecimal']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isInclude?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  ledgerDate?: Maybe<Scalars['Instant']['output']>;
  ledgerType?: Maybe<Scalars['String']['output']>;
  refId?: Maybe<Scalars['UUID']['output']>;
  refNo?: Maybe<Scalars['String']['output']>;
  supplier?: Maybe<Supplier>;
};

export type ApLedgerDto = {
  __typename?: 'ApLedgerDto';
  beg_balance?: Maybe<Scalars['BigDecimal']['output']>;
  credit?: Maybe<Scalars['BigDecimal']['output']>;
  debit?: Maybe<Scalars['BigDecimal']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  is_include?: Maybe<Scalars['Boolean']['output']>;
  ledger_date?: Maybe<Scalars['Instant']['output']>;
  ledger_type?: Maybe<Scalars['String']['output']>;
  out_balance?: Maybe<Scalars['BigDecimal']['output']>;
  ref_id?: Maybe<Scalars['UUID']['output']>;
  ref_no?: Maybe<Scalars['String']['output']>;
  running_balance?: Maybe<Scalars['BigDecimal']['output']>;
  supplier?: Maybe<Scalars['UUID']['output']>;
  supplier_fullname?: Maybe<Scalars['String']['output']>;
};

export type ApReferenceDto = {
  __typename?: 'ApReferenceDto';
  referenceType?: Maybe<Scalars['String']['output']>;
};

export type ApTransaction = {
  __typename?: 'ApTransaction';
  category?: Maybe<Scalars['String']['output']>;
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  flagValue?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  status?: Maybe<Scalars['Boolean']['output']>;
  supplierType?: Maybe<SupplierType>;
};

export type ApTransactionInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  company?: InputMaybe<Scalars['UUID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  flagValue?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
  supplierType?: InputMaybe<SupplierTypeInput>;
};

export type ArAllocatedCreditNote = {
  __typename?: 'ArAllocatedCreditNote';
  amountAllocate?: Maybe<Scalars['BigDecimal']['output']>;
  arCreditNote?: Maybe<ArCreditNote>;
  arCustomer?: Maybe<ArCustomers>;
  companyId?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  creditNoteDate?: Maybe<Scalars['Date']['output']>;
  creditNoteNo?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  invoice?: Maybe<ArInvoice>;
  invoiceAmountDue?: Maybe<Scalars['BigDecimal']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  pnId?: Maybe<Scalars['UUID']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

export type ArCreditNote = {
  __typename?: 'ArCreditNote';
  arCustomer?: Maybe<ArCustomers>;
  billingAddress?: Maybe<Scalars['String']['output']>;
  companyId?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  creditNoteDate?: Maybe<Scalars['Date']['output']>;
  creditNoteNo?: Maybe<Scalars['String']['output']>;
  creditNoteType?: Maybe<Scalars['String']['output']>;
  cwtAmount?: Maybe<Scalars['BigDecimal']['output']>;
  cwtRate?: Maybe<Scalars['BigDecimal']['output']>;
  details?: Maybe<Scalars['Map_String_StringScalar']['output']>;
  discountAmount?: Maybe<Scalars['BigDecimal']['output']>;
  discountPercentage?: Maybe<Scalars['BigDecimal']['output']>;
  domain?: Maybe<Scalars['String']['output']>;
  flagValue?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  invoiceType?: Maybe<Scalars['String']['output']>;
  isCWT?: Maybe<Scalars['Boolean']['output']>;
  isVatable?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  ledgerId?: Maybe<Scalars['UUID']['output']>;
  negativeCWTAmount?: Maybe<Scalars['BigDecimal']['output']>;
  negativeCwtAmount?: Maybe<Scalars['BigDecimal']['output']>;
  negativeTotalAmount?: Maybe<Scalars['BigDecimal']['output']>;
  negativeTotalAmountDue?: Maybe<Scalars['BigDecimal']['output']>;
  negativeVatAmount?: Maybe<Scalars['BigDecimal']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  reference?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  totalAmountDue?: Maybe<Scalars['BigDecimal']['output']>;
  totalDiscount?: Maybe<Scalars['BigDecimal']['output']>;
  totalHCICreditNote?: Maybe<Scalars['BigDecimal']['output']>;
  totalPFCreditNote?: Maybe<Scalars['BigDecimal']['output']>;
  totalTransfer?: Maybe<Scalars['BigDecimal']['output']>;
  vatAmount?: Maybe<Scalars['BigDecimal']['output']>;
};

export type ArCreditNoteItems = {
  __typename?: 'ArCreditNoteItems';
  accountCode?: Maybe<AccountOpt>;
  arCreditNote?: Maybe<ArCreditNote>;
  arCustomer?: Maybe<ArCustomers>;
  arInvoiceId?: Maybe<Scalars['UUID']['output']>;
  arInvoiceItem?: Maybe<ArInvoiceItems>;
  arInvoiceItemRecordNo?: Maybe<Scalars['String']['output']>;
  arInvoiceNo?: Maybe<Scalars['String']['output']>;
  companyId?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  creditNoteNo?: Maybe<Scalars['String']['output']>;
  cwtAmount?: Maybe<Scalars['BigDecimal']['output']>;
  cwtRate?: Maybe<Scalars['BigDecimal']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  discountAmount?: Maybe<Scalars['BigDecimal']['output']>;
  discountPercentage?: Maybe<Scalars['BigDecimal']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  invoiceParticulars?: Maybe<ArInvoiceParticulars>;
  isCWT?: Maybe<Scalars['Boolean']['output']>;
  isVatable?: Maybe<Scalars['Boolean']['output']>;
  itemName?: Maybe<Scalars['String']['output']>;
  itemType?: Maybe<Scalars['String']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  recipientCustomer?: Maybe<ArCustomers>;
  recipientInvoice?: Maybe<Scalars['UUID']['output']>;
  recordNo?: Maybe<Scalars['String']['output']>;
  reference?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  totalAmountDue?: Maybe<Scalars['BigDecimal']['output']>;
  unitPrice?: Maybe<Scalars['BigDecimal']['output']>;
  vatAmount?: Maybe<Scalars['BigDecimal']['output']>;
};

export type ArCustomers = {
  __typename?: 'ArCustomers';
  accountName?: Maybe<Scalars['String']['output']>;
  accountNo?: Maybe<Scalars['String']['output']>;
  accountPrefix?: Maybe<Scalars['String']['output']>;
  address?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  companyId?: Maybe<Scalars['UUID']['output']>;
  contactEmail?: Maybe<Scalars['String']['output']>;
  contactNo?: Maybe<Scalars['String']['output']>;
  contactPerson?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  customerInfo?: Maybe<CustomerInfo>;
  customerName?: Maybe<Scalars['String']['output']>;
  customerType?: Maybe<CustomerType>;
  discountAndPenalties?: Maybe<CompanyDiscountAndPenalties>;
  domain?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  otherDetails?: Maybe<CustomerOtherDetails>;
};

export type ArCustomersInput = {
  accountNo?: InputMaybe<Scalars['String']['input']>;
  accountPrefix?: InputMaybe<Scalars['String']['input']>;
  address?: InputMaybe<Scalars['String']['input']>;
  companyId?: InputMaybe<Scalars['UUID']['input']>;
  contactEmail?: InputMaybe<Scalars['String']['input']>;
  contactNo?: InputMaybe<Scalars['String']['input']>;
  contactPerson?: InputMaybe<Scalars['String']['input']>;
  customerInfo?: InputMaybe<CustomerInfoInput>;
  customerName?: InputMaybe<Scalars['String']['input']>;
  customerType?: InputMaybe<CustomerType>;
  discountAndPenalties?: InputMaybe<CompanyDiscountAndPenaltiesInput>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  otherDetails?: InputMaybe<CustomerOtherDetailsInput>;
};

export type ArInvoice = {
  __typename?: 'ArInvoice';
  approvedBy?: Maybe<Scalars['UUID']['output']>;
  approvedDate?: Maybe<Scalars['Instant']['output']>;
  arCustomer?: Maybe<ArCustomers>;
  billingAddress?: Maybe<Scalars['String']['output']>;
  companyId?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  cwtAmount?: Maybe<Scalars['BigDecimal']['output']>;
  cwtRate?: Maybe<Scalars['BigDecimal']['output']>;
  details?: Maybe<Scalars['Map_String_StringScalar']['output']>;
  discountAmount?: Maybe<Scalars['BigDecimal']['output']>;
  domain?: Maybe<Scalars['String']['output']>;
  dueDate?: Maybe<Scalars['Date']['output']>;
  electricity?: Maybe<Scalars['BigDecimal']['output']>;
  flagValue?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  invoiceDate?: Maybe<Scalars['Date']['output']>;
  invoiceNo?: Maybe<Scalars['String']['output']>;
  invoiceType?: Maybe<Scalars['String']['output']>;
  isCWT?: Maybe<Scalars['Boolean']['output']>;
  isVatable?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  ledgerId?: Maybe<Scalars['UUID']['output']>;
  negativeCWTAmount?: Maybe<Scalars['BigDecimal']['output']>;
  negativeTotalAmount?: Maybe<Scalars['BigDecimal']['output']>;
  negativeTotalAmountDue?: Maybe<Scalars['BigDecimal']['output']>;
  negativeVATAmount?: Maybe<Scalars['BigDecimal']['output']>;
  netTotalAmount?: Maybe<Scalars['BigDecimal']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  others?: Maybe<Scalars['BigDecimal']['output']>;
  payment?: Maybe<Scalars['BigDecimal']['output']>;
  quantity?: Maybe<Scalars['BigDecimal']['output']>;
  reference?: Maybe<Scalars['String']['output']>;
  rental?: Maybe<Scalars['BigDecimal']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  totalAmount?: Maybe<Scalars['BigDecimal']['output']>;
  totalAmountDue?: Maybe<Scalars['BigDecimal']['output']>;
  totalCreditNote?: Maybe<Scalars['BigDecimal']['output']>;
  totalHCITax?: Maybe<Scalars['BigDecimal']['output']>;
  totalHCIVat?: Maybe<Scalars['BigDecimal']['output']>;
  totalPayments?: Maybe<Scalars['BigDecimal']['output']>;
  unitPrice?: Maybe<Scalars['BigDecimal']['output']>;
  vatAmount?: Maybe<Scalars['BigDecimal']['output']>;
};

export type ArInvoiceItems = {
  __typename?: 'ArInvoiceItems';
  amountToApply?: Maybe<Scalars['BigDecimal']['output']>;
  arCustomer?: Maybe<ArCustomers>;
  arInvoice?: Maybe<ArInvoice>;
  companyId?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  creditNote?: Maybe<Scalars['BigDecimal']['output']>;
  cwtAmount?: Maybe<Scalars['BigDecimal']['output']>;
  cwtRate?: Maybe<Scalars['BigDecimal']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  discount?: Maybe<Scalars['BigDecimal']['output']>;
  discountAmount?: Maybe<Scalars['BigDecimal']['output']>;
  discountPercentage?: Maybe<Scalars['BigDecimal']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  invoiceNo?: Maybe<Scalars['String']['output']>;
  invoiceParticulars?: Maybe<ArInvoiceParticulars>;
  isCWT?: Maybe<Scalars['Boolean']['output']>;
  isVatable?: Maybe<Scalars['Boolean']['output']>;
  itemName?: Maybe<Scalars['String']['output']>;
  itemType?: Maybe<Scalars['String']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  netTotalAmount?: Maybe<Scalars['BigDecimal']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  recordNo?: Maybe<Scalars['String']['output']>;
  reference_transfer_id?: Maybe<Scalars['UUID']['output']>;
  soa_no?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  totalAmountDue?: Maybe<Scalars['BigDecimal']['output']>;
  totalPayments?: Maybe<Scalars['BigDecimal']['output']>;
  transactionDate?: Maybe<Scalars['Date']['output']>;
  unitPrice?: Maybe<Scalars['BigDecimal']['output']>;
  vatAmount?: Maybe<Scalars['BigDecimal']['output']>;
};

export type ArInvoiceParticulars = {
  __typename?: 'ArInvoiceParticulars';
  companyId?: Maybe<Scalars['UUID']['output']>;
  costPrice?: Maybe<Scalars['BigDecimal']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  itemCategory?: Maybe<Scalars['String']['output']>;
  itemCode?: Maybe<Scalars['String']['output']>;
  itemName?: Maybe<Scalars['String']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  salePrice?: Maybe<Scalars['BigDecimal']['output']>;
  salesAccountCode?: Maybe<Scalars['String']['output']>;
};

export type ArInvoiceWithOutstandingBal = {
  __typename?: 'ArInvoiceWithOutstandingBal';
  amount?: Maybe<Scalars['BigDecimal']['output']>;
  balance?: Maybe<Scalars['BigDecimal']['output']>;
  customerId?: Maybe<Scalars['String']['output']>;
  docNo?: Maybe<Scalars['String']['output']>;
  dueDate?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  invoiceId?: Maybe<Scalars['String']['output']>;
  invoiceNo?: Maybe<Scalars['String']['output']>;
  itemType?: Maybe<Scalars['String']['output']>;
  particular?: Maybe<Scalars['String']['output']>;
  payment?: Maybe<Scalars['BigDecimal']['output']>;
  reference?: Maybe<Scalars['String']['output']>;
};

export type ArInvoiceWithOutstandingBalForCreditNote = {
  __typename?: 'ArInvoiceWithOutstandingBalForCreditNote';
  allocatedAmount?: Maybe<Scalars['BigDecimal']['output']>;
  dueDate?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  invoiceDate?: Maybe<Scalars['String']['output']>;
  invoiceNo?: Maybe<Scalars['String']['output']>;
  totalAmount?: Maybe<Scalars['BigDecimal']['output']>;
  totalAmountDue?: Maybe<Scalars['BigDecimal']['output']>;
};

export type ArTransactionLedger = {
  __typename?: 'ArTransactionLedger';
  arCreditNoteId?: Maybe<Scalars['UUID']['output']>;
  arCustomerId?: Maybe<Scalars['UUID']['output']>;
  arInvoiceId?: Maybe<Scalars['UUID']['output']>;
  arPaymentId?: Maybe<Scalars['UUID']['output']>;
  companyId?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  docDate?: Maybe<Scalars['Date']['output']>;
  docNo?: Maybe<Scalars['String']['output']>;
  docType?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  ledgerDate?: Maybe<Scalars['Instant']['output']>;
  recordNo?: Maybe<Scalars['String']['output']>;
  referenceNo?: Maybe<Scalars['String']['output']>;
  referenceType?: Maybe<Scalars['String']['output']>;
  remainingBalance?: Maybe<Scalars['BigDecimal']['output']>;
  totalAmountDue?: Maybe<Scalars['BigDecimal']['output']>;
  totalCwtAmount?: Maybe<Scalars['BigDecimal']['output']>;
  totalVatAmount?: Maybe<Scalars['BigDecimal']['output']>;
};

export type ArTransactionLedgerRemainingBalanceDto = {
  __typename?: 'ArTransactionLedgerRemainingBalanceDto';
  remainingBalanceSum?: Maybe<Scalars['BigDecimal']['output']>;
};

export type AssetMaintenanceTypes = {
  __typename?: 'AssetMaintenanceTypes';
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type AssetPreventiveMaintenance = {
  __typename?: 'AssetPreventiveMaintenance';
  asset?: Maybe<Assets>;
  assetMaintenanceType?: Maybe<AssetMaintenanceTypes>;
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  occurrence?: Maybe<Scalars['String']['output']>;
  reminderSchedule?: Maybe<Scalars['String']['output']>;
  scheduleType?: Maybe<PreventiveScheduleType>;
};

export type AssetRepairMaintenance = {
  __typename?: 'AssetRepairMaintenance';
  asset?: Maybe<Assets>;
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  findings?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  inspectionRemarks?: Maybe<Scalars['String']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  project?: Maybe<Projects>;
  rmImage?: Maybe<Scalars['String']['output']>;
  serviceClassification?: Maybe<RepairServiceClassification>;
  serviceDatetimeFinished?: Maybe<Scalars['Instant']['output']>;
  serviceDatetimeStart?: Maybe<Scalars['Instant']['output']>;
  serviceType?: Maybe<RepairServiceType>;
  status?: Maybe<RepairMaintenanceStatus>;
  workDescription?: Maybe<Scalars['String']['output']>;
  workedByEmployees?: Maybe<Scalars['String']['output']>;
};

export type AssetRepairMaintenanceItems = {
  __typename?: 'AssetRepairMaintenanceItems';
  assetRepairMaintenance?: Maybe<AssetRepairMaintenance>;
  basePrice?: Maybe<Scalars['BigDecimal']['output']>;
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  item?: Maybe<Item>;
  itemType?: Maybe<RepairMaintenanceItemType>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  supplier?: Maybe<Supplier>;
};

export enum AssetStatus {
  Active = 'ACTIVE',
  Disposed = 'DISPOSED',
  Idle = 'IDLE',
  InRepair = 'IN_REPAIR',
  InService = 'IN_SERVICE',
  InTransit = 'IN_TRANSIT',
  NoService = 'NO_SERVICE',
  OnService = 'ON_SERVICE',
  OutOfService = 'OUT_OF_SERVICE',
  Reserved = 'RESERVED',
  Retired = 'RETIRED',
  UnderInspection = 'UNDER_INSPECTION',
  UnderMaintenance = 'UNDER_MAINTENANCE'
}

export enum AssetType {
  ConstructionEquipment = 'CONSTRUCTION_EQUIPMENT',
  OfficeEquipment = 'OFFICE_EQUIPMENT',
  PersonalProtectiveEquipment = 'PERSONAL_PROTECTIVE_EQUIPMENT',
  RealEstate = 'REAL_ESTATE',
  SoftwareAndLicenses = 'SOFTWARE_AND_LICENSES',
  Tool = 'TOOL',
  Vehicle = 'VEHICLE'
}

export type AssetUpcomingPreventiveMaintenance = {
  __typename?: 'AssetUpcomingPreventiveMaintenance';
  asset?: Maybe<Assets>;
  assetMaintenanceType?: Maybe<AssetMaintenanceTypes>;
  company?: Maybe<Scalars['UUID']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  note?: Maybe<Scalars['String']['output']>;
  occurrence?: Maybe<Scalars['String']['output']>;
  occurrenceDate?: Maybe<Scalars['Instant']['output']>;
  reminderDate?: Maybe<Scalars['Instant']['output']>;
  reminderSchedule?: Maybe<Scalars['String']['output']>;
  scheduleType?: Maybe<PreventiveScheduleType>;
};

export type Assets = {
  __typename?: 'Assets';
  assetCode?: Maybe<Scalars['String']['output']>;
  brand?: Maybe<Scalars['String']['output']>;
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  fixedAssetItem?: Maybe<FixedAssetItems>;
  id?: Maybe<Scalars['UUID']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  item?: Maybe<Item>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  plateNo?: Maybe<Scalars['String']['output']>;
  prefix?: Maybe<Scalars['String']['output']>;
  status?: Maybe<AssetStatus>;
  type?: Maybe<AssetType>;
};

export type AssetsInput = {
  assetCode?: InputMaybe<Scalars['String']['input']>;
  brand?: InputMaybe<Scalars['String']['input']>;
  company?: InputMaybe<Scalars['UUID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  fixedAssetItem?: InputMaybe<FixedAssetItemsInput>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  item?: InputMaybe<ItemInput>;
  model?: InputMaybe<Scalars['String']['input']>;
  plateNo?: InputMaybe<Scalars['String']['input']>;
  prefix?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<AssetStatus>;
  type?: InputMaybe<AssetType>;
};

export type Authority = {
  __typename?: 'Authority';
  name: Scalars['String']['output'];
};

export type Bank = {
  __typename?: 'Bank';
  accountName?: Maybe<Scalars['String']['output']>;
  accountNumber?: Maybe<Scalars['String']['output']>;
  acquiringBank?: Maybe<Scalars['Boolean']['output']>;
  bankAddress?: Maybe<Scalars['String']['output']>;
  bankaccountId?: Maybe<Scalars['String']['output']>;
  bankname?: Maybe<Scalars['String']['output']>;
  branch?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  companyId?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  domain?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
};

export type BankInput = {
  accountName?: InputMaybe<Scalars['String']['input']>;
  accountNumber?: InputMaybe<Scalars['String']['input']>;
  acquiringBank?: InputMaybe<Scalars['Boolean']['input']>;
  bankAddress?: InputMaybe<Scalars['String']['input']>;
  bankaccountId?: InputMaybe<Scalars['String']['input']>;
  bankname?: InputMaybe<Scalars['String']['input']>;
  branch?: InputMaybe<Scalars['String']['input']>;
  companyId?: InputMaybe<Scalars['UUID']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};

export type Barangay = {
  __typename?: 'Barangay';
  barangayName?: Maybe<Scalars['String']['output']>;
  city?: Maybe<City>;
  id?: Maybe<Scalars['UUID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  province?: Maybe<Province>;
  region?: Maybe<Region>;
};

export type BeginningBalance = {
  __typename?: 'BeginningBalance';
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  dateTrans?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isCancel?: Maybe<Scalars['Boolean']['output']>;
  isPosted?: Maybe<Scalars['Boolean']['output']>;
  item?: Maybe<Item>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  office?: Maybe<Office>;
  quantity?: Maybe<Scalars['Int']['output']>;
  refNum?: Maybe<Scalars['String']['output']>;
  unitCost?: Maybe<Scalars['BigDecimal']['output']>;
  unitMeasurement?: Maybe<Scalars['String']['output']>;
  uou?: Maybe<Scalars['String']['output']>;
};

export type BeginningBalanceInput = {
  company?: InputMaybe<Scalars['UUID']['input']>;
  dateTrans?: InputMaybe<Scalars['Instant']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  isCancel?: InputMaybe<Scalars['Boolean']['input']>;
  isPosted?: InputMaybe<Scalars['Boolean']['input']>;
  item?: InputMaybe<ItemInput>;
  office?: InputMaybe<OfficeInput>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  refNum?: InputMaybe<Scalars['String']['input']>;
  unitCost?: InputMaybe<Scalars['BigDecimal']['input']>;
};

export type Billing = {
  __typename?: 'Billing';
  /** balance */
  balance?: Maybe<Scalars['BigDecimal']['output']>;
  billNo?: Maybe<Scalars['String']['output']>;
  companyId?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  customer?: Maybe<ArCustomers>;
  dateTrans?: Maybe<Scalars['Instant']['output']>;
  /** deductions */
  deductions?: Maybe<Scalars['BigDecimal']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  job?: Maybe<Job>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  locked?: Maybe<Scalars['Boolean']['output']>;
  lockedBy?: Maybe<Scalars['String']['output']>;
  otcName?: Maybe<Scalars['String']['output']>;
  /** payments */
  payments?: Maybe<Scalars['BigDecimal']['output']>;
  project?: Maybe<Projects>;
  status?: Maybe<Scalars['Boolean']['output']>;
  /** totals */
  totals?: Maybe<Scalars['BigDecimal']['output']>;
};

export type BillingInput = {
  billNo?: InputMaybe<Scalars['String']['input']>;
  companyId?: InputMaybe<Scalars['UUID']['input']>;
  customer?: InputMaybe<ArCustomersInput>;
  dateTrans?: InputMaybe<Scalars['Instant']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  job?: InputMaybe<JobInput>;
  locked?: InputMaybe<Scalars['Boolean']['input']>;
  lockedBy?: InputMaybe<Scalars['String']['input']>;
  otcName?: InputMaybe<Scalars['String']['input']>;
  project?: InputMaybe<ProjectsInput>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};

export type BillingItem = {
  __typename?: 'BillingItem';
  billing?: Maybe<Billing>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  credit?: Maybe<Scalars['BigDecimal']['output']>;
  debit?: Maybe<Scalars['BigDecimal']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  discountDetails?: Maybe<Array<Maybe<DiscountDetails>>>;
  id?: Maybe<Scalars['UUID']['output']>;
  item?: Maybe<Item>;
  itemType?: Maybe<Scalars['String']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  orNum?: Maybe<Scalars['String']['output']>;
  outputTax?: Maybe<Scalars['BigDecimal']['output']>;
  postedLedger?: Maybe<Scalars['UUID']['output']>;
  qty?: Maybe<Scalars['BigDecimal']['output']>;
  recalculationDate?: Maybe<Scalars['Instant']['output']>;
  recordNo?: Maybe<Scalars['String']['output']>;
  refId?: Maybe<Scalars['UUID']['output']>;
  service?: Maybe<ServiceManagement>;
  status?: Maybe<Scalars['Boolean']['output']>;
  subTotal?: Maybe<Scalars['BigDecimal']['output']>;
  tagNo?: Maybe<Scalars['String']['output']>;
  transDate?: Maybe<Scalars['Instant']['output']>;
  transType?: Maybe<Scalars['String']['output']>;
  wcost?: Maybe<Scalars['BigDecimal']['output']>;
};

export type Blob = {
  __typename?: 'Blob';
  binaryStream?: Maybe<InputStream>;
};

export type BrandDto = {
  __typename?: 'BrandDto';
  brand?: Maybe<Scalars['String']['output']>;
};

export type CashFlowDto = {
  __typename?: 'CashFlowDto';
  amount?: Maybe<Scalars['BigDecimal']['output']>;
  date?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  refNo?: Maybe<Scalars['String']['output']>;
  remarks?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type CategoryDto = {
  __typename?: 'CategoryDto';
  category?: Maybe<Scalars['String']['output']>;
};

export type ChargeInvoice = {
  __typename?: 'ChargeInvoice';
  billing?: Maybe<Billing>;
  content?: Maybe<Blob>;
  content_type?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
};

export type ChargeItemsDto = {
  __typename?: 'ChargeItemsDto';
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  qty?: Maybe<Scalars['Int']['output']>;
  refNo?: Maybe<Scalars['String']['output']>;
  totalAmount?: Maybe<Scalars['BigDecimal']['output']>;
  transDate?: Maybe<Scalars['Instant']['output']>;
  transType?: Maybe<Scalars['String']['output']>;
  unitCost?: Maybe<Scalars['BigDecimal']['output']>;
};

export type ChartOfAccountGenerate = {
  __typename?: 'ChartOfAccountGenerate';
  accountCategory?: Maybe<Scalars['String']['output']>;
  accountName?: Maybe<Scalars['String']['output']>;
  accountType?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  fromGenerator?: Maybe<Scalars['Boolean']['output']>;
  motherAccount?: Maybe<CoaComponentContainer>;
  subAccount?: Maybe<CoaComponentContainer>;
  subSubAccount?: Maybe<CoaComponentContainer>;
};

export type City = {
  __typename?: 'City';
  cityName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  province?: Maybe<Province>;
  region?: Maybe<Region>;
};

export type CoaComponentContainer = {
  __typename?: 'CoaComponentContainer';
  accountCategory?: Maybe<Scalars['String']['output']>;
  accountName?: Maybe<Scalars['String']['output']>;
  accountType?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  domain?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  normalSide?: Maybe<Scalars['String']['output']>;
};

export type CoaPattern = {
  __typename?: 'CoaPattern';
  accountName?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  motherAccount?: Maybe<CoaComponentContainer>;
  subAccount?: Maybe<CoaComponentContainer>;
  subAccountName?: Maybe<Scalars['String']['output']>;
  subAccountSetupId?: Maybe<Scalars['UUID']['output']>;
  subSubAccount?: Maybe<CoaComponentContainer>;
};

export type CompanyDiscountAndPenalties = {
  __typename?: 'CompanyDiscountAndPenalties';
  autoDiscountInPayment?: Maybe<Scalars['Boolean']['output']>;
  blockOnCreditLimit?: Maybe<Scalars['Boolean']['output']>;
  creditLimit?: Maybe<Scalars['BigDecimal']['output']>;
  creditPeriod?: Maybe<Scalars['Int']['output']>;
  overduePenalties?: Maybe<Array<Maybe<PaymentPromptField>>>;
  paymentDiscounts?: Maybe<Array<Maybe<PaymentPromptField>>>;
  salesAccountCode?: Maybe<Scalars['String']['output']>;
};

export type CompanyDiscountAndPenaltiesInput = {
  autoDiscountInPayment?: InputMaybe<Scalars['Boolean']['input']>;
  blockOnCreditLimit?: InputMaybe<Scalars['Boolean']['input']>;
  creditLimit?: InputMaybe<Scalars['BigDecimal']['input']>;
  creditPeriod?: InputMaybe<Scalars['Int']['input']>;
  overduePenalties?: InputMaybe<Array<InputMaybe<PaymentPromptFieldInput>>>;
  paymentDiscounts?: InputMaybe<Array<InputMaybe<PaymentPromptFieldInput>>>;
  salesAccountCode?: InputMaybe<Scalars['String']['input']>;
};

export type CompanySettings = {
  __typename?: 'CompanySettings';
  companyCode?: Maybe<Scalars['String']['output']>;
  companyName?: Maybe<Scalars['String']['output']>;
  govMarkup?: Maybe<Scalars['BigDecimal']['output']>;
  hideInSelection?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  logoFileName?: Maybe<Scalars['String']['output']>;
  markup?: Maybe<Scalars['BigDecimal']['output']>;
  vatRate?: Maybe<Scalars['BigDecimal']['output']>;
};

export type CompanySettingsInput = {
  companyCode?: InputMaybe<Scalars['String']['input']>;
  companyName?: InputMaybe<Scalars['String']['input']>;
  govMarkup?: InputMaybe<Scalars['BigDecimal']['input']>;
  hideInSelection?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  logoFileName?: InputMaybe<Scalars['String']['input']>;
  markup?: InputMaybe<Scalars['BigDecimal']['input']>;
  vatRate?: InputMaybe<Scalars['BigDecimal']['input']>;
};

export enum ContactType {
  Billing = 'BILLING',
  Home = 'HOME',
  Work = 'WORK'
}

export enum ContributionTypes {
  Hdmf = 'HDMF',
  Phic = 'PHIC',
  Sss = 'SSS'
}

export type Counter = {
  __typename?: 'Counter';
  name?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['Long']['output']>;
};

export type Country = {
  __typename?: 'Country';
  country?: Maybe<Scalars['String']['output']>;
  countryName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
};

export type Customer = {
  __typename?: 'Customer';
  address?: Maybe<Scalars['String']['output']>;
  contactPerson?: Maybe<Scalars['String']['output']>;
  contactPersonNum?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  customerType?: Maybe<Scalars['String']['output']>;
  emailAdd?: Maybe<Scalars['String']['output']>;
  fullName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isAssetsCustomer?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  telNo?: Maybe<Scalars['String']['output']>;
};

export type CustomerContact = {
  __typename?: 'CustomerContact';
  barangay?: Maybe<Scalars['String']['output']>;
  city?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  phoneNo?: Maybe<Scalars['String']['output']>;
  province?: Maybe<Scalars['String']['output']>;
  street?: Maybe<Scalars['String']['output']>;
  type?: Maybe<ContactType>;
  zipcode?: Maybe<Scalars['Int']['output']>;
};

export type CustomerContactInput = {
  barangay?: InputMaybe<Scalars['String']['input']>;
  city?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  phoneNo?: InputMaybe<Scalars['String']['input']>;
  province?: InputMaybe<Scalars['String']['input']>;
  street?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<ContactType>;
  zipcode?: InputMaybe<Scalars['Int']['input']>;
};

export type CustomerInfo = {
  __typename?: 'CustomerInfo';
  birthday?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Scalars['String']['output']>;
  govId?: Maybe<Scalars['String']['output']>;
  govIdType?: Maybe<Scalars['String']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  middleName?: Maybe<Scalars['String']['output']>;
};

export type CustomerInfoInput = {
  birthday?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  govId?: InputMaybe<Scalars['String']['input']>;
  govIdType?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  middleName?: InputMaybe<Scalars['String']['input']>;
};

export type CustomerOtherDetails = {
  __typename?: 'CustomerOtherDetails';
  billingContact?: Maybe<CustomerContact>;
  color?: Maybe<Scalars['String']['output']>;
  contacts?: Maybe<Array<Maybe<CustomerContact>>>;
};

export type CustomerOtherDetailsInput = {
  billingContact?: InputMaybe<CustomerContactInput>;
  color?: InputMaybe<Scalars['String']['input']>;
  contacts?: InputMaybe<Array<InputMaybe<CustomerContactInput>>>;
};

export enum CustomerType {
  Government = 'GOVERNMENT',
  Private = 'PRIVATE'
}

export type DashboardDto = {
  __typename?: 'DashboardDto';
  status?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['Int']['output']>;
};

export type DebitMemo = {
  __typename?: 'DebitMemo';
  appliedAmount?: Maybe<Scalars['BigDecimal']['output']>;
  bank?: Maybe<Bank>;
  cashOnBank?: Maybe<Scalars['BigDecimal']['output']>;
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  cwt?: Maybe<Scalars['BigDecimal']['output']>;
  debitCategory?: Maybe<Scalars['String']['output']>;
  debitDate?: Maybe<Scalars['Instant']['output']>;
  debitNo?: Maybe<Scalars['String']['output']>;
  debitType?: Maybe<Scalars['String']['output']>;
  details?: Maybe<Scalars['Map_String_StringScalar']['output']>;
  discAmount?: Maybe<Scalars['BigDecimal']['output']>;
  discount?: Maybe<Scalars['BigDecimal']['output']>;
  domain?: Maybe<Scalars['String']['output']>;
  ewt1Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewt2Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewt3Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewt4Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewt5Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewt7Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewt10Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewt15Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewt18Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewt30Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewtAmount?: Maybe<Scalars['BigDecimal']['output']>;
  flagValue?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  memoAmount?: Maybe<Scalars['BigDecimal']['output']>;
  office?: Maybe<Office>;
  posted?: Maybe<Scalars['Boolean']['output']>;
  postedBy?: Maybe<Scalars['String']['output']>;
  postedLedger?: Maybe<Scalars['UUID']['output']>;
  project?: Maybe<Projects>;
  referenceNo?: Maybe<Scalars['String']['output']>;
  referenceType?: Maybe<Scalars['String']['output']>;
  remarksNotes?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  supplier?: Maybe<Supplier>;
  supplierAmount?: Maybe<Scalars['BigDecimal']['output']>;
  transType?: Maybe<ApTransaction>;
  value_1?: Maybe<Scalars['BigDecimal']['output']>;
  value_2?: Maybe<Scalars['BigDecimal']['output']>;
  value_3?: Maybe<Scalars['BigDecimal']['output']>;
  value_4?: Maybe<Scalars['BigDecimal']['output']>;
  value_5?: Maybe<Scalars['BigDecimal']['output']>;
  value_6?: Maybe<Scalars['BigDecimal']['output']>;
  value_7?: Maybe<Scalars['BigDecimal']['output']>;
  value_8?: Maybe<Scalars['BigDecimal']['output']>;
  value_9?: Maybe<Scalars['BigDecimal']['output']>;
  value_10?: Maybe<Scalars['BigDecimal']['output']>;
  value_11?: Maybe<Scalars['BigDecimal']['output']>;
  value_12?: Maybe<Scalars['BigDecimal']['output']>;
  value_13?: Maybe<Scalars['BigDecimal']['output']>;
  value_14?: Maybe<Scalars['BigDecimal']['output']>;
  value_15?: Maybe<Scalars['BigDecimal']['output']>;
  value_16?: Maybe<Scalars['BigDecimal']['output']>;
  value_17?: Maybe<Scalars['BigDecimal']['output']>;
  value_18?: Maybe<Scalars['BigDecimal']['output']>;
  value_19?: Maybe<Scalars['BigDecimal']['output']>;
  value_20?: Maybe<Scalars['BigDecimal']['output']>;
  value_21?: Maybe<Scalars['BigDecimal']['output']>;
  value_22?: Maybe<Scalars['BigDecimal']['output']>;
  value_23?: Maybe<Scalars['BigDecimal']['output']>;
  value_24?: Maybe<Scalars['BigDecimal']['output']>;
  value_25?: Maybe<Scalars['BigDecimal']['output']>;
  value_26?: Maybe<Scalars['BigDecimal']['output']>;
  value_27?: Maybe<Scalars['BigDecimal']['output']>;
  value_28?: Maybe<Scalars['BigDecimal']['output']>;
  value_29?: Maybe<Scalars['BigDecimal']['output']>;
  value_30?: Maybe<Scalars['BigDecimal']['output']>;
  value_31?: Maybe<Scalars['BigDecimal']['output']>;
  value_32?: Maybe<Scalars['BigDecimal']['output']>;
  value_33?: Maybe<Scalars['BigDecimal']['output']>;
  value_34?: Maybe<Scalars['BigDecimal']['output']>;
  value_35?: Maybe<Scalars['BigDecimal']['output']>;
  value_36?: Maybe<Scalars['BigDecimal']['output']>;
  value_37?: Maybe<Scalars['BigDecimal']['output']>;
  value_38?: Maybe<Scalars['BigDecimal']['output']>;
  value_39?: Maybe<Scalars['BigDecimal']['output']>;
  value_40?: Maybe<Scalars['BigDecimal']['output']>;
  value_41?: Maybe<Scalars['BigDecimal']['output']>;
  value_42?: Maybe<Scalars['BigDecimal']['output']>;
  value_43?: Maybe<Scalars['BigDecimal']['output']>;
  value_44?: Maybe<Scalars['BigDecimal']['output']>;
  value_45?: Maybe<Scalars['BigDecimal']['output']>;
  value_46?: Maybe<Scalars['BigDecimal']['output']>;
  value_47?: Maybe<Scalars['BigDecimal']['output']>;
  value_48?: Maybe<Scalars['BigDecimal']['output']>;
  value_49?: Maybe<Scalars['BigDecimal']['output']>;
  value_50?: Maybe<Scalars['BigDecimal']['output']>;
  value_51?: Maybe<Scalars['BigDecimal']['output']>;
  value_52?: Maybe<Scalars['BigDecimal']['output']>;
  value_53?: Maybe<Scalars['BigDecimal']['output']>;
  value_54?: Maybe<Scalars['BigDecimal']['output']>;
  value_55?: Maybe<Scalars['BigDecimal']['output']>;
  value_56?: Maybe<Scalars['BigDecimal']['output']>;
  value_57?: Maybe<Scalars['BigDecimal']['output']>;
  value_58?: Maybe<Scalars['BigDecimal']['output']>;
  value_59?: Maybe<Scalars['BigDecimal']['output']>;
  value_60?: Maybe<Scalars['BigDecimal']['output']>;
  value_61?: Maybe<Scalars['BigDecimal']['output']>;
  value_62?: Maybe<Scalars['BigDecimal']['output']>;
  value_63?: Maybe<Scalars['BigDecimal']['output']>;
  value_64?: Maybe<Scalars['BigDecimal']['output']>;
  value_65?: Maybe<Scalars['BigDecimal']['output']>;
  value_66?: Maybe<Scalars['BigDecimal']['output']>;
  value_67?: Maybe<Scalars['BigDecimal']['output']>;
  value_68?: Maybe<Scalars['BigDecimal']['output']>;
  value_69?: Maybe<Scalars['BigDecimal']['output']>;
  value_70?: Maybe<Scalars['BigDecimal']['output']>;
  value_71?: Maybe<Scalars['BigDecimal']['output']>;
  value_72?: Maybe<Scalars['BigDecimal']['output']>;
  value_73?: Maybe<Scalars['BigDecimal']['output']>;
  value_74?: Maybe<Scalars['BigDecimal']['output']>;
  value_75?: Maybe<Scalars['BigDecimal']['output']>;
  value_76?: Maybe<Scalars['BigDecimal']['output']>;
  value_77?: Maybe<Scalars['BigDecimal']['output']>;
  value_78?: Maybe<Scalars['BigDecimal']['output']>;
  value_79?: Maybe<Scalars['BigDecimal']['output']>;
  value_80?: Maybe<Scalars['BigDecimal']['output']>;
  value_81?: Maybe<Scalars['BigDecimal']['output']>;
  value_82?: Maybe<Scalars['BigDecimal']['output']>;
  value_83?: Maybe<Scalars['BigDecimal']['output']>;
  value_84?: Maybe<Scalars['BigDecimal']['output']>;
  value_85?: Maybe<Scalars['BigDecimal']['output']>;
  value_86?: Maybe<Scalars['BigDecimal']['output']>;
  value_87?: Maybe<Scalars['BigDecimal']['output']>;
  value_88?: Maybe<Scalars['BigDecimal']['output']>;
  value_89?: Maybe<Scalars['BigDecimal']['output']>;
  value_90?: Maybe<Scalars['BigDecimal']['output']>;
  value_91?: Maybe<Scalars['BigDecimal']['output']>;
  value_92?: Maybe<Scalars['BigDecimal']['output']>;
  value_93?: Maybe<Scalars['BigDecimal']['output']>;
  value_94?: Maybe<Scalars['BigDecimal']['output']>;
  value_95?: Maybe<Scalars['BigDecimal']['output']>;
  value_96?: Maybe<Scalars['BigDecimal']['output']>;
  value_97?: Maybe<Scalars['BigDecimal']['output']>;
  value_98?: Maybe<Scalars['BigDecimal']['output']>;
  value_99?: Maybe<Scalars['BigDecimal']['output']>;
  value_100?: Maybe<Scalars['BigDecimal']['output']>;
};

export type DebitMemoDetails = {
  __typename?: 'DebitMemoDetails';
  amount?: Maybe<Scalars['BigDecimal']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  debitMemo?: Maybe<DebitMemo>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  office?: Maybe<Office>;
  percent?: Maybe<Scalars['BigDecimal']['output']>;
  project?: Maybe<Projects>;
  remarks?: Maybe<Scalars['String']['output']>;
  transType?: Maybe<ExpenseTransaction>;
  type?: Maybe<Scalars['String']['output']>;
};

export type DebitMemoInput = {
  appliedAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  bank?: InputMaybe<BankInput>;
  cashOnBank?: InputMaybe<Scalars['BigDecimal']['input']>;
  company?: InputMaybe<Scalars['UUID']['input']>;
  cwt?: InputMaybe<Scalars['BigDecimal']['input']>;
  debitCategory?: InputMaybe<Scalars['String']['input']>;
  debitDate?: InputMaybe<Scalars['Instant']['input']>;
  debitNo?: InputMaybe<Scalars['String']['input']>;
  debitType?: InputMaybe<Scalars['String']['input']>;
  discAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  discount?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt1Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt2Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt3Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt4Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt5Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt7Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt10Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt15Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt18Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt30Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewtAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  flagValue?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  memoAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  office?: InputMaybe<OfficeInput>;
  posted?: InputMaybe<Scalars['Boolean']['input']>;
  postedBy?: InputMaybe<Scalars['String']['input']>;
  postedLedger?: InputMaybe<Scalars['UUID']['input']>;
  project?: InputMaybe<ProjectsInput>;
  referenceNo?: InputMaybe<Scalars['String']['input']>;
  referenceType?: InputMaybe<Scalars['String']['input']>;
  remarksNotes?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  supplier?: InputMaybe<SupplierInput>;
  supplierAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  transType?: InputMaybe<ApTransactionInput>;
  value_1?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_2?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_3?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_4?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_5?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_6?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_7?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_8?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_9?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_10?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_11?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_12?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_13?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_14?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_15?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_16?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_17?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_18?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_19?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_20?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_21?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_22?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_23?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_24?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_25?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_26?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_27?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_28?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_29?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_30?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_31?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_32?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_33?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_34?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_35?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_36?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_37?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_38?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_39?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_40?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_41?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_42?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_43?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_44?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_45?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_46?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_47?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_48?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_49?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_50?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_51?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_52?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_53?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_54?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_55?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_56?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_57?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_58?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_59?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_60?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_61?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_62?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_63?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_64?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_65?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_66?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_67?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_68?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_69?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_70?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_71?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_72?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_73?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_74?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_75?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_76?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_77?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_78?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_79?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_80?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_81?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_82?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_83?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_84?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_85?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_86?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_87?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_88?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_89?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_90?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_91?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_92?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_93?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_94?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_95?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_96?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_97?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_98?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_99?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_100?: InputMaybe<Scalars['BigDecimal']['input']>;
};

export enum DepreciationMethod {
  NoDepreciation = 'NO_DEPRECIATION',
  StraightLine = 'STRAIGHT_LINE'
}

export enum Direction {
  Asc = 'ASC',
  Desc = 'DESC'
}

export type Disbursement = {
  __typename?: 'Disbursement';
  advancesSupplier?: Maybe<Scalars['BigDecimal']['output']>;
  appliedAmount?: Maybe<Scalars['BigDecimal']['output']>;
  bank?: Maybe<Bank>;
  cash?: Maybe<Scalars['BigDecimal']['output']>;
  cashOnBank?: Maybe<Scalars['BigDecimal']['output']>;
  cashOnHand?: Maybe<Scalars['BigDecimal']['output']>;
  checks?: Maybe<Scalars['BigDecimal']['output']>;
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  cwt?: Maybe<Scalars['BigDecimal']['output']>;
  details?: Maybe<Scalars['Map_String_StringScalar']['output']>;
  disDate?: Maybe<Scalars['Instant']['output']>;
  disNo?: Maybe<Scalars['String']['output']>;
  disType?: Maybe<Scalars['String']['output']>;
  discAmount?: Maybe<Scalars['BigDecimal']['output']>;
  discountAmount?: Maybe<Scalars['BigDecimal']['output']>;
  domain?: Maybe<Scalars['String']['output']>;
  ewt1Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewt2Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewt3Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewt4Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewt5Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewt7Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewt10Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewt15Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewt18Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewt30Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewtAmount?: Maybe<Scalars['BigDecimal']['output']>;
  flagValue?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isAdvance?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  office?: Maybe<Office>;
  payeeName?: Maybe<Scalars['String']['output']>;
  paymentCategory?: Maybe<Scalars['String']['output']>;
  posted?: Maybe<Scalars['Boolean']['output']>;
  postedBy?: Maybe<Scalars['String']['output']>;
  postedLedger?: Maybe<Scalars['UUID']['output']>;
  project?: Maybe<Projects>;
  referenceNo?: Maybe<Scalars['String']['output']>;
  referenceType?: Maybe<Scalars['String']['output']>;
  remarksNotes?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  supplier?: Maybe<Supplier>;
  supplierAmount?: Maybe<Scalars['BigDecimal']['output']>;
  transType?: Maybe<ApTransaction>;
  value_1?: Maybe<Scalars['BigDecimal']['output']>;
  value_2?: Maybe<Scalars['BigDecimal']['output']>;
  value_3?: Maybe<Scalars['BigDecimal']['output']>;
  value_4?: Maybe<Scalars['BigDecimal']['output']>;
  value_5?: Maybe<Scalars['BigDecimal']['output']>;
  value_6?: Maybe<Scalars['BigDecimal']['output']>;
  value_7?: Maybe<Scalars['BigDecimal']['output']>;
  value_8?: Maybe<Scalars['BigDecimal']['output']>;
  value_9?: Maybe<Scalars['BigDecimal']['output']>;
  value_10?: Maybe<Scalars['BigDecimal']['output']>;
  value_11?: Maybe<Scalars['BigDecimal']['output']>;
  value_12?: Maybe<Scalars['BigDecimal']['output']>;
  value_13?: Maybe<Scalars['BigDecimal']['output']>;
  value_14?: Maybe<Scalars['BigDecimal']['output']>;
  value_15?: Maybe<Scalars['BigDecimal']['output']>;
  value_16?: Maybe<Scalars['BigDecimal']['output']>;
  value_17?: Maybe<Scalars['BigDecimal']['output']>;
  value_18?: Maybe<Scalars['BigDecimal']['output']>;
  value_19?: Maybe<Scalars['BigDecimal']['output']>;
  value_20?: Maybe<Scalars['BigDecimal']['output']>;
  value_21?: Maybe<Scalars['BigDecimal']['output']>;
  value_22?: Maybe<Scalars['BigDecimal']['output']>;
  value_23?: Maybe<Scalars['BigDecimal']['output']>;
  value_24?: Maybe<Scalars['BigDecimal']['output']>;
  value_25?: Maybe<Scalars['BigDecimal']['output']>;
  value_26?: Maybe<Scalars['BigDecimal']['output']>;
  value_27?: Maybe<Scalars['BigDecimal']['output']>;
  value_28?: Maybe<Scalars['BigDecimal']['output']>;
  value_29?: Maybe<Scalars['BigDecimal']['output']>;
  value_30?: Maybe<Scalars['BigDecimal']['output']>;
  value_31?: Maybe<Scalars['BigDecimal']['output']>;
  value_32?: Maybe<Scalars['BigDecimal']['output']>;
  value_33?: Maybe<Scalars['BigDecimal']['output']>;
  value_34?: Maybe<Scalars['BigDecimal']['output']>;
  value_35?: Maybe<Scalars['BigDecimal']['output']>;
  value_36?: Maybe<Scalars['BigDecimal']['output']>;
  value_37?: Maybe<Scalars['BigDecimal']['output']>;
  value_38?: Maybe<Scalars['BigDecimal']['output']>;
  value_39?: Maybe<Scalars['BigDecimal']['output']>;
  value_40?: Maybe<Scalars['BigDecimal']['output']>;
  value_41?: Maybe<Scalars['BigDecimal']['output']>;
  value_42?: Maybe<Scalars['BigDecimal']['output']>;
  value_43?: Maybe<Scalars['BigDecimal']['output']>;
  value_44?: Maybe<Scalars['BigDecimal']['output']>;
  value_45?: Maybe<Scalars['BigDecimal']['output']>;
  value_46?: Maybe<Scalars['BigDecimal']['output']>;
  value_47?: Maybe<Scalars['BigDecimal']['output']>;
  value_48?: Maybe<Scalars['BigDecimal']['output']>;
  value_49?: Maybe<Scalars['BigDecimal']['output']>;
  value_50?: Maybe<Scalars['BigDecimal']['output']>;
  value_51?: Maybe<Scalars['BigDecimal']['output']>;
  value_52?: Maybe<Scalars['BigDecimal']['output']>;
  value_53?: Maybe<Scalars['BigDecimal']['output']>;
  value_54?: Maybe<Scalars['BigDecimal']['output']>;
  value_55?: Maybe<Scalars['BigDecimal']['output']>;
  value_56?: Maybe<Scalars['BigDecimal']['output']>;
  value_57?: Maybe<Scalars['BigDecimal']['output']>;
  value_58?: Maybe<Scalars['BigDecimal']['output']>;
  value_59?: Maybe<Scalars['BigDecimal']['output']>;
  value_60?: Maybe<Scalars['BigDecimal']['output']>;
  value_61?: Maybe<Scalars['BigDecimal']['output']>;
  value_62?: Maybe<Scalars['BigDecimal']['output']>;
  value_63?: Maybe<Scalars['BigDecimal']['output']>;
  value_64?: Maybe<Scalars['BigDecimal']['output']>;
  value_65?: Maybe<Scalars['BigDecimal']['output']>;
  value_66?: Maybe<Scalars['BigDecimal']['output']>;
  value_67?: Maybe<Scalars['BigDecimal']['output']>;
  value_68?: Maybe<Scalars['BigDecimal']['output']>;
  value_69?: Maybe<Scalars['BigDecimal']['output']>;
  value_70?: Maybe<Scalars['BigDecimal']['output']>;
  value_71?: Maybe<Scalars['BigDecimal']['output']>;
  value_72?: Maybe<Scalars['BigDecimal']['output']>;
  value_73?: Maybe<Scalars['BigDecimal']['output']>;
  value_74?: Maybe<Scalars['BigDecimal']['output']>;
  value_75?: Maybe<Scalars['BigDecimal']['output']>;
  value_76?: Maybe<Scalars['BigDecimal']['output']>;
  value_77?: Maybe<Scalars['BigDecimal']['output']>;
  value_78?: Maybe<Scalars['BigDecimal']['output']>;
  value_79?: Maybe<Scalars['BigDecimal']['output']>;
  value_80?: Maybe<Scalars['BigDecimal']['output']>;
  value_81?: Maybe<Scalars['BigDecimal']['output']>;
  value_82?: Maybe<Scalars['BigDecimal']['output']>;
  value_83?: Maybe<Scalars['BigDecimal']['output']>;
  value_84?: Maybe<Scalars['BigDecimal']['output']>;
  value_85?: Maybe<Scalars['BigDecimal']['output']>;
  value_86?: Maybe<Scalars['BigDecimal']['output']>;
  value_87?: Maybe<Scalars['BigDecimal']['output']>;
  value_88?: Maybe<Scalars['BigDecimal']['output']>;
  value_89?: Maybe<Scalars['BigDecimal']['output']>;
  value_90?: Maybe<Scalars['BigDecimal']['output']>;
  value_91?: Maybe<Scalars['BigDecimal']['output']>;
  value_92?: Maybe<Scalars['BigDecimal']['output']>;
  value_93?: Maybe<Scalars['BigDecimal']['output']>;
  value_94?: Maybe<Scalars['BigDecimal']['output']>;
  value_95?: Maybe<Scalars['BigDecimal']['output']>;
  value_96?: Maybe<Scalars['BigDecimal']['output']>;
  value_97?: Maybe<Scalars['BigDecimal']['output']>;
  value_98?: Maybe<Scalars['BigDecimal']['output']>;
  value_99?: Maybe<Scalars['BigDecimal']['output']>;
  value_100?: Maybe<Scalars['BigDecimal']['output']>;
  voucherAmount?: Maybe<Scalars['BigDecimal']['output']>;
};

export type DisbursementAp = {
  __typename?: 'DisbursementAp';
  appliedAmount?: Maybe<Scalars['BigDecimal']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  debitMemo?: Maybe<DebitMemo>;
  disbursement?: Maybe<Disbursement>;
  discount?: Maybe<Scalars['BigDecimal']['output']>;
  ewtAmount?: Maybe<Scalars['BigDecimal']['output']>;
  ewtDesc?: Maybe<Scalars['String']['output']>;
  ewtRate?: Maybe<Scalars['BigDecimal']['output']>;
  grossAmount?: Maybe<Scalars['BigDecimal']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  netAmount?: Maybe<Scalars['BigDecimal']['output']>;
  office?: Maybe<Office>;
  payable?: Maybe<AccountsPayable>;
  posted?: Maybe<Scalars['Boolean']['output']>;
  project?: Maybe<Projects>;
  reapplication?: Maybe<Scalars['UUID']['output']>;
  vatAmount?: Maybe<Scalars['BigDecimal']['output']>;
  vatInclusive?: Maybe<Scalars['Boolean']['output']>;
  vatRate?: Maybe<Scalars['BigDecimal']['output']>;
};

export type DisbursementApDtoInput = {
  appliedAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  discount?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewtAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewtDesc?: InputMaybe<Scalars['String']['input']>;
  ewtRate?: InputMaybe<Scalars['BigDecimal']['input']>;
  grossAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  isNew?: InputMaybe<Scalars['Boolean']['input']>;
  netAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  payable?: InputMaybe<AccountsPayableInput>;
  vatAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  vatInclusive?: InputMaybe<Scalars['Boolean']['input']>;
  vatRate?: InputMaybe<Scalars['BigDecimal']['input']>;
};

export type DisbursementCheck = {
  __typename?: 'DisbursementCheck';
  amount?: Maybe<Scalars['BigDecimal']['output']>;
  bank?: Maybe<Bank>;
  bankBranch?: Maybe<Scalars['String']['output']>;
  checkDate?: Maybe<Scalars['Instant']['output']>;
  checkNo?: Maybe<Scalars['String']['output']>;
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  disbursement?: Maybe<Disbursement>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  releasing?: Maybe<Scalars['UUID']['output']>;
};

export type DisbursementDtoInput = {
  amount?: InputMaybe<Scalars['BigDecimal']['input']>;
  bank?: InputMaybe<BankInput>;
  bankBranch?: InputMaybe<Scalars['String']['input']>;
  checkDate?: InputMaybe<Scalars['Instant']['input']>;
  checkNo?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  isNew?: InputMaybe<Scalars['Boolean']['input']>;
};

export type DisbursementExpDtoInput = {
  amount?: InputMaybe<Scalars['BigDecimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  isNew?: InputMaybe<Scalars['Boolean']['input']>;
  office?: InputMaybe<OfficeInput>;
  project?: InputMaybe<ProjectsInput>;
  remarks?: InputMaybe<Scalars['String']['input']>;
  transType?: InputMaybe<ExpenseTransactionInput>;
};

export type DisbursementExpense = {
  __typename?: 'DisbursementExpense';
  amount?: Maybe<Scalars['BigDecimal']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  disbursement?: Maybe<Disbursement>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  office?: Maybe<Office>;
  project?: Maybe<Projects>;
  remarks?: Maybe<Scalars['String']['output']>;
  transType?: Maybe<ExpenseTransaction>;
};

export type DisbursementInput = {
  advancesSupplier?: InputMaybe<Scalars['BigDecimal']['input']>;
  appliedAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  bank?: InputMaybe<BankInput>;
  cash?: InputMaybe<Scalars['BigDecimal']['input']>;
  cashOnBank?: InputMaybe<Scalars['BigDecimal']['input']>;
  cashOnHand?: InputMaybe<Scalars['BigDecimal']['input']>;
  checks?: InputMaybe<Scalars['BigDecimal']['input']>;
  company?: InputMaybe<Scalars['UUID']['input']>;
  cwt?: InputMaybe<Scalars['BigDecimal']['input']>;
  disDate?: InputMaybe<Scalars['Instant']['input']>;
  disNo?: InputMaybe<Scalars['String']['input']>;
  disType?: InputMaybe<Scalars['String']['input']>;
  discAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  discountAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt1Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt2Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt3Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt4Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt5Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt7Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt10Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt15Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt18Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt30Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewtAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  flagValue?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  isAdvance?: InputMaybe<Scalars['Boolean']['input']>;
  office?: InputMaybe<OfficeInput>;
  payeeName?: InputMaybe<Scalars['String']['input']>;
  paymentCategory?: InputMaybe<Scalars['String']['input']>;
  posted?: InputMaybe<Scalars['Boolean']['input']>;
  postedBy?: InputMaybe<Scalars['String']['input']>;
  postedLedger?: InputMaybe<Scalars['UUID']['input']>;
  project?: InputMaybe<ProjectsInput>;
  referenceNo?: InputMaybe<Scalars['String']['input']>;
  referenceType?: InputMaybe<Scalars['String']['input']>;
  remarksNotes?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  supplier?: InputMaybe<SupplierInput>;
  supplierAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  transType?: InputMaybe<ApTransactionInput>;
  value_1?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_2?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_3?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_4?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_5?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_6?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_7?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_8?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_9?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_10?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_11?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_12?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_13?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_14?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_15?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_16?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_17?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_18?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_19?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_20?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_21?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_22?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_23?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_24?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_25?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_26?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_27?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_28?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_29?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_30?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_31?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_32?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_33?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_34?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_35?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_36?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_37?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_38?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_39?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_40?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_41?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_42?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_43?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_44?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_45?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_46?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_47?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_48?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_49?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_50?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_51?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_52?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_53?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_54?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_55?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_56?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_57?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_58?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_59?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_60?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_61?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_62?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_63?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_64?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_65?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_66?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_67?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_68?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_69?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_70?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_71?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_72?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_73?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_74?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_75?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_76?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_77?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_78?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_79?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_80?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_81?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_82?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_83?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_84?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_85?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_86?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_87?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_88?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_89?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_90?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_91?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_92?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_93?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_94?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_95?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_96?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_97?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_98?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_99?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_100?: InputMaybe<Scalars['BigDecimal']['input']>;
  voucherAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
};

export type DisbursementWtx = {
  __typename?: 'DisbursementWtx';
  appliedAmount?: Maybe<Scalars['BigDecimal']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  disbursement?: Maybe<Disbursement>;
  ewtAmount?: Maybe<Scalars['BigDecimal']['output']>;
  ewtDesc?: Maybe<Scalars['String']['output']>;
  ewtRate?: Maybe<Scalars['BigDecimal']['output']>;
  grossAmount?: Maybe<Scalars['BigDecimal']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  netAmount?: Maybe<Scalars['BigDecimal']['output']>;
  vatAmount?: Maybe<Scalars['BigDecimal']['output']>;
  vatInclusive?: Maybe<Scalars['Boolean']['output']>;
  vatRate?: Maybe<Scalars['BigDecimal']['output']>;
};

export type DisbursementWtxDtoInput = {
  appliedAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewtAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewtDesc?: InputMaybe<Scalars['String']['input']>;
  ewtRate?: InputMaybe<Scalars['BigDecimal']['input']>;
  grossAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  isNew?: InputMaybe<Scalars['Boolean']['input']>;
  netAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  vatAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  vatInclusive?: InputMaybe<Scalars['Boolean']['input']>;
  vatRate?: InputMaybe<Scalars['Int']['input']>;
};

export type DiscountDetails = {
  __typename?: 'DiscountDetails';
  amount?: Maybe<Scalars['BigDecimal']['output']>;
  billing?: Maybe<Billing>;
  billingItem?: Maybe<BillingItem>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  refBillItem?: Maybe<BillingItem>;
};

export type DmDetailsDtoInput = {
  amount?: InputMaybe<Scalars['BigDecimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  isNew?: InputMaybe<Scalars['Boolean']['input']>;
  office?: InputMaybe<OfficeInput>;
  percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  project?: InputMaybe<ProjectsInput>;
  remarks?: InputMaybe<Scalars['String']['input']>;
  transType?: InputMaybe<ExpenseTransactionInput>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type DocumentTypes = {
  __typename?: 'DocumentTypes';
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  documentCode?: Maybe<Scalars['String']['output']>;
  documentDescription?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
};

export enum DomainEnum {
  Bank = 'BANK',
  FixedAssetSubAccount = 'FIXED_ASSET_SUB_ACCOUNT',
  ItemCategory = 'ITEM_CATEGORY',
  NoDomain = 'NO_DOMAIN',
  Projects = 'PROJECTS',
  Supplier = 'SUPPLIER'
}

export type DomainOptionDto = {
  __typename?: 'DomainOptionDto';
  key?: Maybe<Scalars['String']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type Employee = {
  __typename?: 'Employee';
  allowanceItems?: Maybe<Array<Maybe<EmployeeAllowance>>>;
  allowancePackageId?: Maybe<Scalars['UUID']['output']>;
  barangay?: Maybe<Scalars['String']['output']>;
  basicSalary?: Maybe<Scalars['BigDecimal']['output']>;
  bloodType?: Maybe<Scalars['String']['output']>;
  cityMunicipality?: Maybe<Scalars['String']['output']>;
  civilStatus?: Maybe<Scalars['String']['output']>;
  country?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  currentCompany?: Maybe<CompanySettings>;
  dob?: Maybe<Scalars['LocalDateTime']['output']>;
  emailAddress?: Maybe<Scalars['String']['output']>;
  emergencyContactAddress?: Maybe<Scalars['String']['output']>;
  emergencyContactName?: Maybe<Scalars['String']['output']>;
  emergencyContactNo?: Maybe<Scalars['String']['output']>;
  emergencyContactRelationship?: Maybe<Scalars['String']['output']>;
  employeeCelNo?: Maybe<Scalars['String']['output']>;
  employeeLoanConfig?: Maybe<EmployeeLoanConfig>;
  employeeNo?: Maybe<Scalars['String']['output']>;
  employeeTelNo?: Maybe<Scalars['String']['output']>;
  employeeType?: Maybe<Scalars['String']['output']>;
  facialData?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  fullAddress?: Maybe<Scalars['String']['output']>;
  fullInitialName?: Maybe<Scalars['String']['output']>;
  fullName?: Maybe<Scalars['String']['output']>;
  fullnameWithTitle?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Scalars['String']['output']>;
  hourlyRate?: Maybe<Scalars['BigDecimal']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  initialName?: Maybe<Scalars['String']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  isActiveHDMF?: Maybe<Scalars['Boolean']['output']>;
  isActivePHIC?: Maybe<Scalars['Boolean']['output']>;
  isActiveSSS?: Maybe<Scalars['Boolean']['output']>;
  isExcludedFromAttendance?: Maybe<Scalars['Boolean']['output']>;
  isFixedRate?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  middleName?: Maybe<Scalars['String']['output']>;
  monthlyRate?: Maybe<Scalars['BigDecimal']['output']>;
  nameSuffix?: Maybe<Scalars['String']['output']>;
  nationality?: Maybe<Scalars['String']['output']>;
  office?: Maybe<Office>;
  pagIbigId?: Maybe<Scalars['String']['output']>;
  philhealthNo?: Maybe<Scalars['String']['output']>;
  pinCode?: Maybe<Scalars['String']['output']>;
  position?: Maybe<Position>;
  shortName?: Maybe<Scalars['String']['output']>;
  sssNo?: Maybe<Scalars['String']['output']>;
  stateProvince?: Maybe<Scalars['String']['output']>;
  street?: Maybe<Scalars['String']['output']>;
  tinNo?: Maybe<Scalars['String']['output']>;
  titleInitials?: Maybe<Scalars['String']['output']>;
  user?: Maybe<User>;
  zipCode?: Maybe<Scalars['String']['output']>;
};

export type EmployeeAllowance = {
  __typename?: 'EmployeeAllowance';
  allowance?: Maybe<Allowance>;
  allowanceId?: Maybe<Scalars['UUID']['output']>;
  allowanceType?: Maybe<AllowanceType>;
  amount?: Maybe<Scalars['BigDecimal']['output']>;
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  employee?: Maybe<Employee>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  name?: Maybe<Scalars['String']['output']>;
};

export type EmployeeAllowanceInput = {
  allowance?: InputMaybe<AllowanceInput>;
  allowanceType?: InputMaybe<AllowanceType>;
  amount?: InputMaybe<Scalars['BigDecimal']['input']>;
  company?: InputMaybe<CompanySettingsInput>;
  employee?: InputMaybe<EmployeeInput>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};

export type EmployeeAttendance = {
  __typename?: 'EmployeeAttendance';
  additionalNote?: Maybe<Scalars['String']['output']>;
  attendance_time?: Maybe<Scalars['Instant']['output']>;
  cameraCapture?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  dateString?: Maybe<Scalars['String']['output']>;
  employee?: Maybe<Employee>;
  id?: Maybe<Scalars['UUID']['output']>;
  isIgnored?: Maybe<Scalars['Boolean']['output']>;
  isManual?: Maybe<Scalars['Boolean']['output']>;
  isTransfer?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  originalType?: Maybe<Scalars['String']['output']>;
  original_attendance_time?: Maybe<Scalars['Instant']['output']>;
  project?: Maybe<Projects>;
  referenceId?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type EmployeeAttendanceInput = {
  additionalNote?: InputMaybe<Scalars['String']['input']>;
  attendance_time?: InputMaybe<Scalars['Instant']['input']>;
  cameraCapture?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  isIgnored?: InputMaybe<Scalars['Boolean']['input']>;
  isManual?: InputMaybe<Scalars['Boolean']['input']>;
  isTransfer?: InputMaybe<Scalars['Boolean']['input']>;
  originalType?: InputMaybe<Scalars['String']['input']>;
  original_attendance_time?: InputMaybe<Scalars['Instant']['input']>;
  project?: InputMaybe<ProjectsInput>;
  referenceId?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type EmployeeBasicDetails = {
  __typename?: 'EmployeeBasicDetails';
  fullName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  position?: Maybe<Scalars['String']['output']>;
};

export type EmployeeInput = {
  allowanceItems?: InputMaybe<Array<InputMaybe<EmployeeAllowanceInput>>>;
  allowancePackageId?: InputMaybe<Scalars['UUID']['input']>;
  barangay?: InputMaybe<Scalars['String']['input']>;
  basicSalary?: InputMaybe<Scalars['BigDecimal']['input']>;
  bloodType?: InputMaybe<Scalars['String']['input']>;
  cityMunicipality?: InputMaybe<Scalars['String']['input']>;
  civilStatus?: InputMaybe<Scalars['String']['input']>;
  country?: InputMaybe<Scalars['String']['input']>;
  currentCompany?: InputMaybe<CompanySettingsInput>;
  dob?: InputMaybe<Scalars['LocalDateTime']['input']>;
  emailAddress?: InputMaybe<Scalars['String']['input']>;
  emergencyContactAddress?: InputMaybe<Scalars['String']['input']>;
  emergencyContactName?: InputMaybe<Scalars['String']['input']>;
  emergencyContactNo?: InputMaybe<Scalars['String']['input']>;
  emergencyContactRelationship?: InputMaybe<Scalars['String']['input']>;
  employeeCelNo?: InputMaybe<Scalars['String']['input']>;
  employeeLoanConfig?: InputMaybe<EmployeeLoanConfigInput>;
  employeeNo?: InputMaybe<Scalars['String']['input']>;
  employeeTelNo?: InputMaybe<Scalars['String']['input']>;
  employeeType?: InputMaybe<Scalars['String']['input']>;
  facialData?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  fullAddress?: InputMaybe<Scalars['String']['input']>;
  fullInitialName?: InputMaybe<Scalars['String']['input']>;
  fullName?: InputMaybe<Scalars['String']['input']>;
  fullnameWithTitle?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  hourlyRate?: InputMaybe<Scalars['BigDecimal']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  initialName?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isActiveHDMF?: InputMaybe<Scalars['Boolean']['input']>;
  isActivePHIC?: InputMaybe<Scalars['Boolean']['input']>;
  isActiveSSS?: InputMaybe<Scalars['Boolean']['input']>;
  isExcludedFromAttendance?: InputMaybe<Scalars['Boolean']['input']>;
  isFixedRate?: InputMaybe<Scalars['Boolean']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  middleName?: InputMaybe<Scalars['String']['input']>;
  monthlyRate?: InputMaybe<Scalars['BigDecimal']['input']>;
  nameSuffix?: InputMaybe<Scalars['String']['input']>;
  nationality?: InputMaybe<Scalars['String']['input']>;
  office?: InputMaybe<OfficeInput>;
  pagIbigId?: InputMaybe<Scalars['String']['input']>;
  philhealthNo?: InputMaybe<Scalars['String']['input']>;
  pinCode?: InputMaybe<Scalars['String']['input']>;
  position?: InputMaybe<PositionInput>;
  shortName?: InputMaybe<Scalars['String']['input']>;
  sssNo?: InputMaybe<Scalars['String']['input']>;
  stateProvince?: InputMaybe<Scalars['String']['input']>;
  street?: InputMaybe<Scalars['String']['input']>;
  tinNo?: InputMaybe<Scalars['String']['input']>;
  titleInitials?: InputMaybe<Scalars['String']['input']>;
  user?: InputMaybe<UserInput>;
  zipCode?: InputMaybe<Scalars['String']['input']>;
};

export type EmployeeLeave = {
  __typename?: 'EmployeeLeave';
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  dates?: Maybe<Array<Maybe<SelectedDate>>>;
  employee?: Maybe<Employee>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
  status?: Maybe<LeaveStatus>;
  type?: Maybe<LeaveType>;
  withPay?: Maybe<Scalars['Boolean']['output']>;
};

export type EmployeeLeaveDto = {
  __typename?: 'EmployeeLeaveDto';
  createdDate?: Maybe<Scalars['Instant']['output']>;
  dates?: Maybe<Array<Maybe<SelectedDate>>>;
  employeeId?: Maybe<Scalars['String']['output']>;
  fullName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  reason?: Maybe<Scalars['String']['output']>;
  status?: Maybe<LeaveStatus>;
  type?: Maybe<LeaveType>;
  withPay?: Maybe<Scalars['Boolean']['output']>;
};

export type EmployeeLoan = {
  __typename?: 'EmployeeLoan';
  advanceToEmployees?: Maybe<Scalars['BigDecimal']['output']>;
  amount?: Maybe<Scalars['BigDecimal']['output']>;
  apClearingAccount?: Maybe<Scalars['BigDecimal']['output']>;
  cashOnHand?: Maybe<Scalars['BigDecimal']['output']>;
  category?: Maybe<EmployeeLoanCategory>;
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  details?: Maybe<Scalars['Map_String_StringScalar']['output']>;
  domain?: Maybe<Scalars['String']['output']>;
  employee?: Maybe<Employee>;
  flagValue?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isVoided?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  posted?: Maybe<Scalars['Boolean']['output']>;
  postedBy?: Maybe<Scalars['String']['output']>;
  postedLedger?: Maybe<Scalars['UUID']['output']>;
  status?: Maybe<Scalars['Boolean']['output']>;
};

export enum EmployeeLoanCategory {
  CashAdvance = 'CASH_ADVANCE',
  EquipmentLoan = 'EQUIPMENT_LOAN'
}

export type EmployeeLoanConfig = {
  __typename?: 'EmployeeLoanConfig';
  cashAdvanceAmount?: Maybe<Scalars['BigDecimal']['output']>;
  cashAdvanceTerm?: Maybe<LoanPaymentTerm>;
  equipmentLoanAmount?: Maybe<Scalars['BigDecimal']['output']>;
  equipmentLoanTerm?: Maybe<LoanPaymentTerm>;
};

export type EmployeeLoanConfigInput = {
  cashAdvanceAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  cashAdvanceTerm?: InputMaybe<LoanPaymentTerm>;
  equipmentLoanAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  equipmentLoanTerm?: InputMaybe<LoanPaymentTerm>;
};

export type EmployeeLoanLedgerDto = {
  __typename?: 'EmployeeLoanLedgerDto';
  category?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  credit?: Maybe<Scalars['BigDecimal']['output']>;
  debit?: Maybe<Scalars['BigDecimal']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  runningBalance?: Maybe<Scalars['BigDecimal']['output']>;
};

export type EmployeeSalaryDto = {
  __typename?: 'EmployeeSalaryDto';
  absent?: Maybe<Scalars['BigDecimal']['output']>;
  company?: Maybe<Scalars['UUID']['output']>;
  companyName?: Maybe<Scalars['String']['output']>;
  late?: Maybe<Scalars['BigDecimal']['output']>;
  overtime?: Maybe<Scalars['BigDecimal']['output']>;
  overtimeDoubleHoliday?: Maybe<Scalars['BigDecimal']['output']>;
  overtimeHoliday?: Maybe<Scalars['BigDecimal']['output']>;
  overtimeSpecialHoliday?: Maybe<Scalars['BigDecimal']['output']>;
  project?: Maybe<Scalars['UUID']['output']>;
  projectName?: Maybe<Scalars['String']['output']>;
  regular?: Maybe<Scalars['BigDecimal']['output']>;
  regularDoubleHoliday?: Maybe<Scalars['BigDecimal']['output']>;
  regularHoliday?: Maybe<Scalars['BigDecimal']['output']>;
  regularSpecialHoliday?: Maybe<Scalars['BigDecimal']['output']>;
  subAccountCode?: Maybe<Scalars['String']['output']>;
  total?: Maybe<Scalars['BigDecimal']['output']>;
  underTime?: Maybe<Scalars['BigDecimal']['output']>;
};

export type EmployeeSchedule = {
  __typename?: 'EmployeeSchedule';
  color?: Maybe<Scalars['String']['output']>;
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  dateString?: Maybe<Scalars['String']['output']>;
  dateTimeEnd?: Maybe<Scalars['Instant']['output']>;
  dateTimeStart?: Maybe<Scalars['Instant']['output']>;
  deleted?: Maybe<Scalars['Boolean']['output']>;
  employee?: Maybe<Employee>;
  id?: Maybe<Scalars['UUID']['output']>;
  isCustom?: Maybe<Scalars['Boolean']['output']>;
  isLeave?: Maybe<Scalars['Boolean']['output']>;
  isOvertime?: Maybe<Scalars['Boolean']['output']>;
  isRestDay?: Maybe<Scalars['Boolean']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  locked?: Maybe<Scalars['Boolean']['output']>;
  mealBreakEnd?: Maybe<Scalars['Instant']['output']>;
  mealBreakStart?: Maybe<Scalars['Instant']['output']>;
  project?: Maybe<Projects>;
  request?: Maybe<Scalars['UUID']['output']>;
  scheduleDuration?: Maybe<Scalars['BigDecimal']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  withPay?: Maybe<Scalars['Boolean']['output']>;
};

export type EmployeeScheduleDetailsDto = {
  __typename?: 'EmployeeScheduleDetailsDto';
  dateString?: Maybe<Scalars['String']['output']>;
  employeeId?: Maybe<Scalars['UUID']['output']>;
  fullName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  overtimeSchedule?: Maybe<EmployeeSchedule>;
  position?: Maybe<Scalars['String']['output']>;
  project?: Maybe<Projects>;
  regularSchedule?: Maybe<EmployeeSchedule>;
};

export type EmployeeScheduleDto = {
  __typename?: 'EmployeeScheduleDto';
  employeeId?: Maybe<Scalars['UUID']['output']>;
  fullName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  position?: Maybe<Scalars['String']['output']>;
  schedule?: Maybe<Scalars['Map_String_List_ScheduleDtoScalar']['output']>;
};

export type Endorsement = {
  __typename?: 'Endorsement';
  aircon?: Maybe<Scalars['String']['output']>;
  antenna?: Maybe<Scalars['String']['output']>;
  breakMaster?: Maybe<Scalars['String']['output']>;
  bumperFront?: Maybe<Scalars['Boolean']['output']>;
  bumperRear?: Maybe<Scalars['Boolean']['output']>;
  carStereo?: Maybe<Scalars['String']['output']>;
  carkey?: Maybe<Scalars['Boolean']['output']>;
  clutchCap?: Maybe<Scalars['String']['output']>;
  dipStick?: Maybe<Scalars['String']['output']>;
  domeLight?: Maybe<Scalars['String']['output']>;
  engineOilFilter?: Maybe<Scalars['String']['output']>;
  fieldFindings?: Maybe<Scalars['Boolean']['output']>;
  fuelGauge?: Maybe<Scalars['String']['output']>;
  headlightLH?: Maybe<Scalars['Boolean']['output']>;
  headlightRH?: Maybe<Scalars['Boolean']['output']>;
  headrest?: Maybe<Scalars['String']['output']>;
  headrestPcs?: Maybe<Scalars['String']['output']>;
  hoodStand?: Maybe<Scalars['String']['output']>;
  horn?: Maybe<Scalars['String']['output']>;
  hubCupLHRr?: Maybe<Scalars['Boolean']['output']>;
  hubCupLHft?: Maybe<Scalars['Boolean']['output']>;
  hubCupRHRr?: Maybe<Scalars['Boolean']['output']>;
  hubCupRHft?: Maybe<Scalars['Boolean']['output']>;
  jack?: Maybe<Scalars['String']['output']>;
  lighter?: Maybe<Scalars['String']['output']>;
  lighterPcs?: Maybe<Scalars['String']['output']>;
  logoFront?: Maybe<Scalars['Boolean']['output']>;
  logoRear?: Maybe<Scalars['Boolean']['output']>;
  mudGuardLHRr?: Maybe<Scalars['Boolean']['output']>;
  mudGuardLHft?: Maybe<Scalars['Boolean']['output']>;
  mudGuardRHRr?: Maybe<Scalars['Boolean']['output']>;
  mudGuardRHft?: Maybe<Scalars['Boolean']['output']>;
  oilCap?: Maybe<Scalars['String']['output']>;
  plateNumberFront?: Maybe<Scalars['Boolean']['output']>;
  plateNumberRear?: Maybe<Scalars['Boolean']['output']>;
  radiator?: Maybe<Scalars['String']['output']>;
  rearViewMirror?: Maybe<Scalars['String']['output']>;
  registrationPapers?: Maybe<Scalars['String']['output']>;
  runningBoardLH?: Maybe<Scalars['Boolean']['output']>;
  runningBoardRH?: Maybe<Scalars['Boolean']['output']>;
  shopFindings?: Maybe<Scalars['Boolean']['output']>;
  sideMirrorLH?: Maybe<Scalars['Boolean']['output']>;
  sideMirrorRH?: Maybe<Scalars['Boolean']['output']>;
  spareTire?: Maybe<Scalars['String']['output']>;
  speaker?: Maybe<Scalars['String']['output']>;
  speakerPcs?: Maybe<Scalars['String']['output']>;
  sunVisor?: Maybe<Scalars['String']['output']>;
  sunVisorPcs?: Maybe<Scalars['String']['output']>;
  tailLightLH?: Maybe<Scalars['Boolean']['output']>;
  tailLightRH?: Maybe<Scalars['Boolean']['output']>;
  tieWrench?: Maybe<Scalars['String']['output']>;
  washerTank?: Maybe<Scalars['String']['output']>;
  windShieldFront?: Maybe<Scalars['Boolean']['output']>;
  windShieldRear?: Maybe<Scalars['Boolean']['output']>;
  windowsLH?: Maybe<Scalars['Boolean']['output']>;
  windowsRH?: Maybe<Scalars['Boolean']['output']>;
  wiperLH?: Maybe<Scalars['Boolean']['output']>;
  wiperRH?: Maybe<Scalars['Boolean']['output']>;
};

export type EndorsementInput = {
  aircon?: InputMaybe<Scalars['String']['input']>;
  antenna?: InputMaybe<Scalars['String']['input']>;
  breakMaster?: InputMaybe<Scalars['String']['input']>;
  bumperFront?: InputMaybe<Scalars['Boolean']['input']>;
  bumperRear?: InputMaybe<Scalars['Boolean']['input']>;
  carStereo?: InputMaybe<Scalars['String']['input']>;
  carkey?: InputMaybe<Scalars['Boolean']['input']>;
  clutchCap?: InputMaybe<Scalars['String']['input']>;
  dipStick?: InputMaybe<Scalars['String']['input']>;
  domeLight?: InputMaybe<Scalars['String']['input']>;
  engineOilFilter?: InputMaybe<Scalars['String']['input']>;
  fieldFindings?: InputMaybe<Scalars['Boolean']['input']>;
  fuelGauge?: InputMaybe<Scalars['String']['input']>;
  headlightLH?: InputMaybe<Scalars['Boolean']['input']>;
  headlightRH?: InputMaybe<Scalars['Boolean']['input']>;
  headrest?: InputMaybe<Scalars['String']['input']>;
  headrestPcs?: InputMaybe<Scalars['String']['input']>;
  hoodStand?: InputMaybe<Scalars['String']['input']>;
  horn?: InputMaybe<Scalars['String']['input']>;
  hubCupLHRr?: InputMaybe<Scalars['Boolean']['input']>;
  hubCupLHft?: InputMaybe<Scalars['Boolean']['input']>;
  hubCupRHRr?: InputMaybe<Scalars['Boolean']['input']>;
  hubCupRHft?: InputMaybe<Scalars['Boolean']['input']>;
  jack?: InputMaybe<Scalars['String']['input']>;
  lighter?: InputMaybe<Scalars['String']['input']>;
  lighterPcs?: InputMaybe<Scalars['String']['input']>;
  logoFront?: InputMaybe<Scalars['Boolean']['input']>;
  logoRear?: InputMaybe<Scalars['Boolean']['input']>;
  mudGuardLHRr?: InputMaybe<Scalars['Boolean']['input']>;
  mudGuardLHft?: InputMaybe<Scalars['Boolean']['input']>;
  mudGuardRHRr?: InputMaybe<Scalars['Boolean']['input']>;
  mudGuardRHft?: InputMaybe<Scalars['Boolean']['input']>;
  oilCap?: InputMaybe<Scalars['String']['input']>;
  plateNumberFront?: InputMaybe<Scalars['Boolean']['input']>;
  plateNumberRear?: InputMaybe<Scalars['Boolean']['input']>;
  radiator?: InputMaybe<Scalars['String']['input']>;
  rearViewMirror?: InputMaybe<Scalars['String']['input']>;
  registrationPapers?: InputMaybe<Scalars['String']['input']>;
  runningBoardLH?: InputMaybe<Scalars['Boolean']['input']>;
  runningBoardRH?: InputMaybe<Scalars['Boolean']['input']>;
  shopFindings?: InputMaybe<Scalars['Boolean']['input']>;
  sideMirrorLH?: InputMaybe<Scalars['Boolean']['input']>;
  sideMirrorRH?: InputMaybe<Scalars['Boolean']['input']>;
  spareTire?: InputMaybe<Scalars['String']['input']>;
  speaker?: InputMaybe<Scalars['String']['input']>;
  speakerPcs?: InputMaybe<Scalars['String']['input']>;
  sunVisor?: InputMaybe<Scalars['String']['input']>;
  sunVisorPcs?: InputMaybe<Scalars['String']['input']>;
  tailLightLH?: InputMaybe<Scalars['Boolean']['input']>;
  tailLightRH?: InputMaybe<Scalars['Boolean']['input']>;
  tieWrench?: InputMaybe<Scalars['String']['input']>;
  washerTank?: InputMaybe<Scalars['String']['input']>;
  windShieldFront?: InputMaybe<Scalars['Boolean']['input']>;
  windShieldRear?: InputMaybe<Scalars['Boolean']['input']>;
  windowsLH?: InputMaybe<Scalars['Boolean']['input']>;
  windowsRH?: InputMaybe<Scalars['Boolean']['input']>;
  wiperLH?: InputMaybe<Scalars['Boolean']['input']>;
  wiperRH?: InputMaybe<Scalars['Boolean']['input']>;
};

export type EventCalendar = {
  __typename?: 'EventCalendar';
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  endDate?: Maybe<Scalars['Instant']['output']>;
  fixed?: Maybe<Scalars['String']['output']>;
  holidayType?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  startDate?: Maybe<Scalars['Instant']['output']>;
};

export type ExpenseTransaction = {
  __typename?: 'ExpenseTransaction';
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isReverse?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  remarks?: Maybe<Scalars['String']['output']>;
  source?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['Boolean']['output']>;
  type?: Maybe<Scalars['String']['output']>;
};

export type ExpenseTransactionInput = {
  company?: InputMaybe<Scalars['UUID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  isReverse?: InputMaybe<Scalars['Boolean']['input']>;
  remarks?: InputMaybe<Scalars['String']['input']>;
  source?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type Fiscal = {
  __typename?: 'Fiscal';
  active?: Maybe<Scalars['Boolean']['output']>;
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  fiscalId?: Maybe<Scalars['String']['output']>;
  fromDate?: Maybe<Scalars['LocalDate']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  lockApril?: Maybe<Scalars['Boolean']['output']>;
  lockAugust?: Maybe<Scalars['Boolean']['output']>;
  lockDecember?: Maybe<Scalars['Boolean']['output']>;
  lockFebruary?: Maybe<Scalars['Boolean']['output']>;
  lockJanuary?: Maybe<Scalars['Boolean']['output']>;
  lockJuly?: Maybe<Scalars['Boolean']['output']>;
  lockJune?: Maybe<Scalars['Boolean']['output']>;
  lockMarch?: Maybe<Scalars['Boolean']['output']>;
  lockMay?: Maybe<Scalars['Boolean']['output']>;
  lockNovember?: Maybe<Scalars['Boolean']['output']>;
  lockOctober?: Maybe<Scalars['Boolean']['output']>;
  lockSeptember?: Maybe<Scalars['Boolean']['output']>;
  remarks?: Maybe<Scalars['String']['output']>;
  toDate?: Maybe<Scalars['LocalDate']['output']>;
};

export type FixedAssetItems = {
  __typename?: 'FixedAssetItems';
  accumulatedDepreciation?: Maybe<Scalars['BigDecimal']['output']>;
  assetNo?: Maybe<Scalars['String']['output']>;
  bookValue?: Maybe<Scalars['BigDecimal']['output']>;
  companyId?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  deliveryReceiving?: Maybe<ReceivingReport>;
  deliveryReceivingDate?: Maybe<Scalars['Date']['output']>;
  deliveryReceivingItem?: Maybe<ReceivingReportItem>;
  depreciationMethod?: Maybe<DepreciationMethod>;
  depreciationStartDate?: Maybe<Scalars['Date']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  details?: Maybe<Scalars['Map_String_StringScalar']['output']>;
  domain?: Maybe<Scalars['String']['output']>;
  flagValue?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isBeginningBalance?: Maybe<Scalars['Boolean']['output']>;
  itemId?: Maybe<Scalars['UUID']['output']>;
  itemName?: Maybe<Scalars['String']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  ledgerGroupId?: Maybe<Scalars['UUID']['output']>;
  negativeAmount?: Maybe<Scalars['BigDecimal']['output']>;
  office?: Maybe<Office>;
  purchase?: Maybe<PurchaseOrder>;
  purchaseDate?: Maybe<Scalars['Date']['output']>;
  purchaseNo?: Maybe<Scalars['String']['output']>;
  purchasePrice?: Maybe<Scalars['BigDecimal']['output']>;
  reference?: Maybe<Scalars['String']['output']>;
  salvageValue?: Maybe<Scalars['BigDecimal']['output']>;
  serialNo?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  subAccount?: Maybe<ItemSubAccount>;
  usefulLife?: Maybe<Scalars['BigDecimal']['output']>;
};

export type FixedAssetItemsInput = {
  accumulatedDepreciation?: InputMaybe<Scalars['BigDecimal']['input']>;
  assetNo?: InputMaybe<Scalars['String']['input']>;
  bookValue?: InputMaybe<Scalars['BigDecimal']['input']>;
  companyId?: InputMaybe<Scalars['UUID']['input']>;
  deliveryReceiving?: InputMaybe<ReceivingReportInput>;
  deliveryReceivingDate?: InputMaybe<Scalars['Date']['input']>;
  deliveryReceivingItem?: InputMaybe<ReceivingReportItemInput>;
  depreciationMethod?: InputMaybe<DepreciationMethod>;
  depreciationStartDate?: InputMaybe<Scalars['Date']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  flagValue?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  isBeginningBalance?: InputMaybe<Scalars['Boolean']['input']>;
  itemId?: InputMaybe<Scalars['UUID']['input']>;
  itemName?: InputMaybe<Scalars['String']['input']>;
  ledgerGroupId?: InputMaybe<Scalars['UUID']['input']>;
  negativeAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  office?: InputMaybe<OfficeInput>;
  purchase?: InputMaybe<PurchaseOrderInput>;
  purchaseDate?: InputMaybe<Scalars['Date']['input']>;
  purchaseNo?: InputMaybe<Scalars['String']['input']>;
  purchasePrice?: InputMaybe<Scalars['BigDecimal']['input']>;
  reference?: InputMaybe<Scalars['String']['input']>;
  salvageValue?: InputMaybe<Scalars['BigDecimal']['input']>;
  serialNo?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  subAccount?: InputMaybe<ItemSubAccountInput>;
  usefulLife?: InputMaybe<Scalars['BigDecimal']['input']>;
};

export type GeneralLedgerDetailsListDto = {
  __typename?: 'GeneralLedgerDetailsListDto';
  account?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  content?: Maybe<Array<Maybe<Scalars['Map_String_ObjectScalar']['output']>>>;
  id?: Maybe<Scalars['String']['output']>;
};

export type GeneralLedgerDto = {
  __typename?: 'GeneralLedgerDto';
  accountType?: Maybe<Scalars['String']['output']>;
  beginningCredit?: Maybe<Scalars['BigDecimal']['output']>;
  beginningDebit?: Maybe<Scalars['BigDecimal']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  endingCredit?: Maybe<Scalars['BigDecimal']['output']>;
  endingDebit?: Maybe<Scalars['BigDecimal']['output']>;
  normalSide?: Maybe<Scalars['String']['output']>;
  periodicCredit?: Maybe<Scalars['BigDecimal']['output']>;
  periodicDebit?: Maybe<Scalars['BigDecimal']['output']>;
};

export type GeneralLedgerDtoContainer = {
  __typename?: 'GeneralLedgerDtoContainer';
  payload?: Maybe<Array<Maybe<GeneralLedgerDto>>>;
  totalbeginningCredit?: Maybe<Scalars['BigDecimal']['output']>;
  totalbeginningDebit?: Maybe<Scalars['BigDecimal']['output']>;
  totalendingCredit?: Maybe<Scalars['BigDecimal']['output']>;
  totalendingDebit?: Maybe<Scalars['BigDecimal']['output']>;
  totalperiodicCredit?: Maybe<Scalars['BigDecimal']['output']>;
  totalperiodicDebit?: Maybe<Scalars['BigDecimal']['output']>;
};

export type GeneralLedgerListDto = {
  __typename?: 'GeneralLedgerListDto';
  accountName?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  credit?: Maybe<Scalars['BigDecimal']['output']>;
  debit?: Maybe<Scalars['BigDecimal']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  motherAccount?: Maybe<Scalars['String']['output']>;
  netAmount?: Maybe<Scalars['BigDecimal']['output']>;
};

export type Generic = {
  __typename?: 'Generic';
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  genericCode?: Maybe<Scalars['String']['output']>;
  genericDescription?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
};

export type GenericInput = {
  company?: InputMaybe<Scalars['UUID']['input']>;
  genericCode?: InputMaybe<Scalars['String']['input']>;
  genericDescription?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
};

export type GraphQlResVal_ArPaymentPosting = {
  __typename?: 'GraphQLResVal_ARPaymentPosting';
  message?: Maybe<Scalars['String']['output']>;
  response?: Maybe<ArPaymentPosting>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlResVal_ArPaymentPostingItems = {
  __typename?: 'GraphQLResVal_ARPaymentPostingItems';
  message?: Maybe<Scalars['String']['output']>;
  response?: Maybe<ArPaymentPostingItems>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlResVal_AdjustmentCategory = {
  __typename?: 'GraphQLResVal_AdjustmentCategory';
  message?: Maybe<Scalars['String']['output']>;
  response?: Maybe<AdjustmentCategory>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlResVal_ArCreditNote = {
  __typename?: 'GraphQLResVal_ArCreditNote';
  message?: Maybe<Scalars['String']['output']>;
  response?: Maybe<ArCreditNote>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlResVal_ArCreditNoteItems = {
  __typename?: 'GraphQLResVal_ArCreditNoteItems';
  message?: Maybe<Scalars['String']['output']>;
  response?: Maybe<ArCreditNoteItems>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlResVal_ArCustomers = {
  __typename?: 'GraphQLResVal_ArCustomers';
  message?: Maybe<Scalars['String']['output']>;
  response?: Maybe<ArCustomers>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlResVal_ArInvoice = {
  __typename?: 'GraphQLResVal_ArInvoice';
  message?: Maybe<Scalars['String']['output']>;
  response?: Maybe<ArInvoice>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlResVal_ArInvoiceItems = {
  __typename?: 'GraphQLResVal_ArInvoiceItems';
  message?: Maybe<Scalars['String']['output']>;
  response?: Maybe<ArInvoiceItems>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlResVal_ArInvoiceParticulars = {
  __typename?: 'GraphQLResVal_ArInvoiceParticulars';
  message?: Maybe<Scalars['String']['output']>;
  response?: Maybe<ArInvoiceParticulars>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlResVal_Boolean = {
  __typename?: 'GraphQLResVal_Boolean';
  message?: Maybe<Scalars['String']['output']>;
  response?: Maybe<Scalars['Boolean']['output']>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlResVal_EmployeeAllowance = {
  __typename?: 'GraphQLResVal_EmployeeAllowance';
  message?: Maybe<Scalars['String']['output']>;
  response?: Maybe<EmployeeAllowance>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlResVal_EmployeeAttendance = {
  __typename?: 'GraphQLResVal_EmployeeAttendance';
  message?: Maybe<Scalars['String']['output']>;
  response?: Maybe<EmployeeAttendance>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlResVal_EmployeeLeave = {
  __typename?: 'GraphQLResVal_EmployeeLeave';
  message?: Maybe<Scalars['String']['output']>;
  response?: Maybe<EmployeeLeave>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlResVal_EmployeeLoan = {
  __typename?: 'GraphQLResVal_EmployeeLoan';
  message?: Maybe<Scalars['String']['output']>;
  response?: Maybe<EmployeeLoan>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlResVal_FixedAssetItems = {
  __typename?: 'GraphQLResVal_FixedAssetItems';
  message?: Maybe<Scalars['String']['output']>;
  response?: Maybe<FixedAssetItems>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlResVal_Page_PayrollEmployeeContributionDto = {
  __typename?: 'GraphQLResVal_Page_PayrollEmployeeContributionDto';
  message?: Maybe<Scalars['String']['output']>;
  response?: Maybe<Page_PayrollEmployeeContributionDto>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlResVal_Payment = {
  __typename?: 'GraphQLResVal_Payment';
  message?: Maybe<Scalars['String']['output']>;
  response?: Maybe<Payment>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlResVal_Payroll = {
  __typename?: 'GraphQLResVal_Payroll';
  message?: Maybe<Scalars['String']['output']>;
  response?: Maybe<Payroll>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlResVal_PayrollAdjustmentItem = {
  __typename?: 'GraphQLResVal_PayrollAdjustmentItem';
  message?: Maybe<Scalars['String']['output']>;
  response?: Maybe<PayrollAdjustmentItem>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlResVal_PayrollAllowance = {
  __typename?: 'GraphQLResVal_PayrollAllowance';
  message?: Maybe<Scalars['String']['output']>;
  response?: Maybe<PayrollAllowance>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlResVal_PayrollAllowanceItem = {
  __typename?: 'GraphQLResVal_PayrollAllowanceItem';
  message?: Maybe<Scalars['String']['output']>;
  response?: Maybe<PayrollAllowanceItem>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlResVal_PayrollContribution = {
  __typename?: 'GraphQLResVal_PayrollContribution';
  message?: Maybe<Scalars['String']['output']>;
  response?: Maybe<PayrollContribution>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlResVal_PayrollEmployeeAdjustment = {
  __typename?: 'GraphQLResVal_PayrollEmployeeAdjustment';
  message?: Maybe<Scalars['String']['output']>;
  response?: Maybe<PayrollEmployeeAdjustment>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlResVal_PayrollEmployeeAllowance = {
  __typename?: 'GraphQLResVal_PayrollEmployeeAllowance';
  message?: Maybe<Scalars['String']['output']>;
  response?: Maybe<PayrollEmployeeAllowance>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlResVal_PayrollEmployeeContribution = {
  __typename?: 'GraphQLResVal_PayrollEmployeeContribution';
  message?: Maybe<Scalars['String']['output']>;
  response?: Maybe<PayrollEmployeeContribution>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlResVal_PayrollEmployeeLoan = {
  __typename?: 'GraphQLResVal_PayrollEmployeeLoan';
  message?: Maybe<Scalars['String']['output']>;
  response?: Maybe<PayrollEmployeeLoan>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlResVal_PayrollEmployeeOtherDeduction = {
  __typename?: 'GraphQLResVal_PayrollEmployeeOtherDeduction';
  message?: Maybe<Scalars['String']['output']>;
  response?: Maybe<PayrollEmployeeOtherDeduction>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlResVal_PayrollLoanItem = {
  __typename?: 'GraphQLResVal_PayrollLoanItem';
  message?: Maybe<Scalars['String']['output']>;
  response?: Maybe<PayrollLoanItem>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlResVal_PayrollOtherDeductionItem = {
  __typename?: 'GraphQLResVal_PayrollOtherDeductionItem';
  message?: Maybe<Scalars['String']['output']>;
  response?: Maybe<PayrollOtherDeductionItem>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlResVal_ProjectWorkAccomplish = {
  __typename?: 'GraphQLResVal_ProjectWorkAccomplish';
  message?: Maybe<Scalars['String']['output']>;
  response?: Maybe<ProjectWorkAccomplish>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlResVal_Schedule = {
  __typename?: 'GraphQLResVal_Schedule';
  message?: Maybe<Scalars['String']['output']>;
  response?: Maybe<Schedule>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlResVal_String = {
  __typename?: 'GraphQLResVal_String';
  message?: Maybe<Scalars['String']['output']>;
  response?: Maybe<Scalars['String']['output']>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlResVal_Timekeeping = {
  __typename?: 'GraphQLResVal_Timekeeping';
  message?: Maybe<Scalars['String']['output']>;
  response?: Maybe<Timekeeping>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlResVal_TimekeepingEmployee = {
  __typename?: 'GraphQLResVal_TimekeepingEmployee';
  message?: Maybe<Scalars['String']['output']>;
  response?: Maybe<TimekeepingEmployee>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlRetVal_Allowance = {
  __typename?: 'GraphQLRetVal_Allowance';
  message?: Maybe<Scalars['String']['output']>;
  payload?: Maybe<Allowance>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlRetVal_AllowanceItem = {
  __typename?: 'GraphQLRetVal_AllowanceItem';
  message?: Maybe<Scalars['String']['output']>;
  payload?: Maybe<AllowanceItem>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlRetVal_AllowancePackage = {
  __typename?: 'GraphQLRetVal_AllowancePackage';
  message?: Maybe<Scalars['String']['output']>;
  payload?: Maybe<AllowancePackage>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlRetVal_Boolean = {
  __typename?: 'GraphQLRetVal_Boolean';
  message?: Maybe<Scalars['String']['output']>;
  payload?: Maybe<Scalars['Boolean']['output']>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlRetVal_EventCalendar = {
  __typename?: 'GraphQLRetVal_EventCalendar';
  message?: Maybe<Scalars['String']['output']>;
  payload?: Maybe<EventCalendar>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlRetVal_HdmfContribution = {
  __typename?: 'GraphQLRetVal_HDMFContribution';
  message?: Maybe<Scalars['String']['output']>;
  payload?: Maybe<HdmfContribution>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlRetVal_List_Map_String_Object = {
  __typename?: 'GraphQLRetVal_List_Map_String_Object';
  message?: Maybe<Scalars['String']['output']>;
  payload?: Maybe<Array<Maybe<Scalars['Map_String_ObjectScalar']['output']>>>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlRetVal_Loan = {
  __typename?: 'GraphQLRetVal_Loan';
  message?: Maybe<Scalars['String']['output']>;
  payload?: Maybe<Loan>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlRetVal_OtherDeductionTypes = {
  __typename?: 'GraphQLRetVal_OtherDeductionTypes';
  message?: Maybe<Scalars['String']['output']>;
  payload?: Maybe<OtherDeductionTypes>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlRetVal_PhicContribution = {
  __typename?: 'GraphQLRetVal_PHICContribution';
  message?: Maybe<Scalars['String']['output']>;
  payload?: Maybe<PhicContribution>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlRetVal_ParentAccount = {
  __typename?: 'GraphQLRetVal_ParentAccount';
  message?: Maybe<Scalars['String']['output']>;
  payload?: Maybe<ParentAccount>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlRetVal_SssContribution = {
  __typename?: 'GraphQLRetVal_SSSContribution';
  message?: Maybe<Scalars['String']['output']>;
  payload?: Maybe<SssContribution>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlRetVal_SalaryRateMultiplier = {
  __typename?: 'GraphQLRetVal_SalaryRateMultiplier';
  message?: Maybe<Scalars['String']['output']>;
  payload?: Maybe<SalaryRateMultiplier>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlRetVal_ScheduleLock = {
  __typename?: 'GraphQLRetVal_ScheduleLock';
  message?: Maybe<Scalars['String']['output']>;
  payload?: Maybe<ScheduleLock>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlRetVal_String = {
  __typename?: 'GraphQLRetVal_String';
  message?: Maybe<Scalars['String']['output']>;
  payload?: Maybe<Scalars['String']['output']>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlRetVal_SubAccountSetup = {
  __typename?: 'GraphQLRetVal_SubAccountSetup';
  message?: Maybe<Scalars['String']['output']>;
  payload?: Maybe<SubAccountSetup>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GraphQlRetVal_WithholdingTaxMatrix = {
  __typename?: 'GraphQLRetVal_WithholdingTaxMatrix';
  message?: Maybe<Scalars['String']['output']>;
  payload?: Maybe<WithholdingTaxMatrix>;
  returnId?: Maybe<Scalars['UUID']['output']>;
  success: Scalars['Boolean']['output'];
};

export type GroupPolicy = {
  __typename?: 'GroupPolicy';
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  name: Scalars['String']['output'];
  permissions?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  permissionsList?: Maybe<Array<Maybe<Permission>>>;
};

export type HdmfContribution = {
  __typename?: 'HDMFContribution';
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  eeRate?: Maybe<Scalars['BigDecimal']['output']>;
  erRate?: Maybe<Scalars['BigDecimal']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  maxAmount?: Maybe<Scalars['BigDecimal']['output']>;
  minAmount?: Maybe<Scalars['BigDecimal']['output']>;
};

export type HeaderLedger = {
  __typename?: 'HeaderLedger';
  approvedBy?: Maybe<Scalars['String']['output']>;
  approvedDatetime?: Maybe<Scalars['Instant']['output']>;
  beginningBalance?: Maybe<Scalars['Boolean']['output']>;
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  custom?: Maybe<Scalars['Boolean']['output']>;
  details?: Maybe<Scalars['Map_String_StringScalar']['output']>;
  docType?: Maybe<LedgerDocType>;
  docnum?: Maybe<Scalars['String']['output']>;
  entityName?: Maybe<Scalars['String']['output']>;
  fiscal?: Maybe<Fiscal>;
  headerLedgerGroup?: Maybe<Scalars['UUID']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  invoiceSoaReference?: Maybe<Scalars['String']['output']>;
  journalType?: Maybe<JournalType>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  ledger?: Maybe<Array<Maybe<Ledger>>>;
  ledgerValue?: Maybe<Scalars['BigDecimal']['output']>;
  parentLedger?: Maybe<Scalars['UUID']['output']>;
  particulars?: Maybe<Scalars['String']['output']>;
  reapplyPaymentTracker?: Maybe<Scalars['UUID']['output']>;
  referenceNo?: Maybe<Scalars['String']['output']>;
  referenceType?: Maybe<Scalars['String']['output']>;
  reversal?: Maybe<Scalars['Boolean']['output']>;
  transactionDate?: Maybe<Scalars['Instant']['output']>;
  transactionDateOnly?: Maybe<Scalars['LocalDate']['output']>;
  transactionNo?: Maybe<Scalars['String']['output']>;
  transactionType?: Maybe<Scalars['String']['output']>;
};

export type HeaderLedgerGroupDto = {
  __typename?: 'HeaderLedgerGroupDto';
  approved?: Maybe<Scalars['String']['output']>;
  entityName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  journalType?: Maybe<Scalars['String']['output']>;
  notApproved?: Maybe<Scalars['String']['output']>;
  otherDetail?: Maybe<Scalars['String']['output']>;
  referenceNo?: Maybe<Scalars['String']['output']>;
};

export type HeaderLedgerGroupItemsDto = {
  __typename?: 'HeaderLedgerGroupItemsDto';
  approvedBy?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  credit?: Maybe<Scalars['BigDecimal']['output']>;
  debit?: Maybe<Scalars['BigDecimal']['output']>;
  docNo?: Maybe<Scalars['String']['output']>;
  docType?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  journalType?: Maybe<Scalars['String']['output']>;
  particulars?: Maybe<Scalars['String']['output']>;
  refNo?: Maybe<Scalars['String']['output']>;
  refType?: Maybe<Scalars['String']['output']>;
  transactionDateOnly?: Maybe<Scalars['String']['output']>;
};

export type HoursLog = {
  __typename?: 'HoursLog';
  absent?: Maybe<Scalars['BigDecimal']['output']>;
  company?: Maybe<Scalars['UUID']['output']>;
  companyName?: Maybe<Scalars['String']['output']>;
  late?: Maybe<Scalars['BigDecimal']['output']>;
  overtime?: Maybe<Scalars['BigDecimal']['output']>;
  overtimeDoubleHoliday?: Maybe<Scalars['BigDecimal']['output']>;
  overtimeHoliday?: Maybe<Scalars['BigDecimal']['output']>;
  overtimeSpecialHoliday?: Maybe<Scalars['BigDecimal']['output']>;
  project?: Maybe<Scalars['UUID']['output']>;
  projectName?: Maybe<Scalars['String']['output']>;
  regular?: Maybe<Scalars['BigDecimal']['output']>;
  regularDoubleHoliday?: Maybe<Scalars['BigDecimal']['output']>;
  regularHoliday?: Maybe<Scalars['BigDecimal']['output']>;
  regularSpecialHoliday?: Maybe<Scalars['BigDecimal']['output']>;
  totalRegularHours?: Maybe<Scalars['BigDecimal']['output']>;
  underTime?: Maybe<Scalars['BigDecimal']['output']>;
};

export type InputStream = {
  __typename?: 'InputStream';
};

export type Insurances = {
  __typename?: 'Insurances';
  code?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  is_active?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
};

export type InsurancesInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
};

export type Integration = {
  __typename?: 'Integration';
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  domain?: Maybe<IntegrationDomainEnum>;
  flagValue?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  integrationGroup?: Maybe<IntegrationGroup>;
  integrationItems?: Maybe<Array<Maybe<IntegrationItem>>>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  orderPriority?: Maybe<Scalars['Int']['output']>;
};

export enum IntegrationDomainEnum {
  AccountsPayable = 'ACCOUNTS_PAYABLE',
  BillingItem = 'BILLING_ITEM',
  CreditNote = 'CREDIT_NOTE',
  DebitMemo = 'DEBIT_MEMO',
  Disbursement = 'DISBURSEMENT',
  EmployeeLoan = 'EMPLOYEE_LOAN',
  FixedAssetItem = 'FIXED_ASSET_ITEM',
  Invoice = 'INVOICE',
  Loan = 'LOAN',
  LoanAmortization = 'LOAN_AMORTIZATION',
  NoDomain = 'NO_DOMAIN',
  Payment = 'PAYMENT',
  Payroll = 'PAYROLL',
  PettyCash = 'PETTY_CASH',
  ProjectWorkAccomplish = 'PROJECT_WORK_ACCOMPLISH',
  Reapplication = 'REAPPLICATION'
}

export type IntegrationGroup = {
  __typename?: 'IntegrationGroup';
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
};

export type IntegrationItem = {
  __typename?: 'IntegrationItem';
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  details?: Maybe<Scalars['Map_String_StringScalar']['output']>;
  disabledProperty?: Maybe<Scalars['String']['output']>;
  disabledValue?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  integration?: Maybe<Integration>;
  journalAccount?: Maybe<CoaPattern>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  multiple?: Maybe<Scalars['Boolean']['output']>;
  sourceColumn?: Maybe<Scalars['String']['output']>;
  valueProperty?: Maybe<Scalars['String']['output']>;
};

export type Inventory = {
  __typename?: 'Inventory';
  active?: Maybe<Scalars['Boolean']['output']>;
  actualCost?: Maybe<Scalars['BigDecimal']['output']>;
  allowTrade?: Maybe<Scalars['Boolean']['output']>;
  brand?: Maybe<Scalars['String']['output']>;
  company?: Maybe<Scalars['UUID']['output']>;
  consignment?: Maybe<Scalars['Boolean']['output']>;
  descLong?: Maybe<Scalars['String']['output']>;
  fixAsset?: Maybe<Scalars['Boolean']['output']>;
  govMarkup?: Maybe<Scalars['BigDecimal']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isMedicine?: Maybe<Scalars['Boolean']['output']>;
  item?: Maybe<Item>;
  itemCode?: Maybe<Scalars['String']['output']>;
  itemId?: Maybe<Scalars['UUID']['output']>;
  item_category?: Maybe<Scalars['UUID']['output']>;
  item_group?: Maybe<Scalars['UUID']['output']>;
  lastUnitCost?: Maybe<Scalars['BigDecimal']['output']>;
  last_wcost?: Maybe<Scalars['BigDecimal']['output']>;
  markup?: Maybe<Scalars['BigDecimal']['output']>;
  office?: Maybe<Office>;
  officeId?: Maybe<Scalars['UUID']['output']>;
  onHand?: Maybe<Scalars['Int']['output']>;
  outputTax?: Maybe<Scalars['BigDecimal']['output']>;
  production?: Maybe<Scalars['Boolean']['output']>;
  reOrderQty?: Maybe<Scalars['Int']['output']>;
  sellingPrice?: Maybe<Scalars['BigDecimal']['output']>;
  sku?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  unitMeasurement?: Maybe<Scalars['String']['output']>;
  uou?: Maybe<Scalars['String']['output']>;
  vatRate?: Maybe<Scalars['BigDecimal']['output']>;
  vatable?: Maybe<Scalars['Boolean']['output']>;
};

export type InventoryInfoDto = {
  __typename?: 'InventoryInfoDto';
  cost?: Maybe<Scalars['BigDecimal']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  item?: Maybe<Item>;
  onHand?: Maybe<Scalars['Int']['output']>;
};

export type InventoryLedger = {
  __typename?: 'InventoryLedger';
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  destinationOffice?: Maybe<Office>;
  documentTypes?: Maybe<DocumentTypes>;
  id?: Maybe<Scalars['UUID']['output']>;
  isInclude?: Maybe<Scalars['Boolean']['output']>;
  item?: Maybe<Item>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  ledgerDate?: Maybe<Scalars['Instant']['output']>;
  ledgerPhysical?: Maybe<Scalars['Int']['output']>;
  ledgerQtyIn?: Maybe<Scalars['Int']['output']>;
  ledgerQtyOut?: Maybe<Scalars['Int']['output']>;
  ledgerUnitCost?: Maybe<Scalars['BigDecimal']['output']>;
  referenceNo?: Maybe<Scalars['String']['output']>;
  sourceOffice?: Maybe<Office>;
};

export type Item = {
  __typename?: 'Item';
  active?: Maybe<Scalars['Boolean']['output']>;
  actualUnitCost?: Maybe<Scalars['BigDecimal']['output']>;
  assetSubAccount?: Maybe<ItemSubAccount>;
  brand?: Maybe<Scalars['String']['output']>;
  company?: Maybe<Scalars['UUID']['output']>;
  consignment?: Maybe<Scalars['Boolean']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  descLong?: Maybe<Scalars['String']['output']>;
  discountable?: Maybe<Scalars['Boolean']['output']>;
  expenseSubAccount?: Maybe<ItemSubAccount>;
  fixAsset?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isMedicine?: Maybe<Scalars['Boolean']['output']>;
  itemCode?: Maybe<Scalars['String']['output']>;
  item_category?: Maybe<ItemCategory>;
  item_conversion?: Maybe<Scalars['Int']['output']>;
  item_demand_qty?: Maybe<Scalars['BigDecimal']['output']>;
  item_generics?: Maybe<Generic>;
  item_group?: Maybe<ItemGroup>;
  item_markup?: Maybe<Scalars['BigDecimal']['output']>;
  item_maximum?: Maybe<Scalars['BigDecimal']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  markupLock?: Maybe<Scalars['Boolean']['output']>;
  production?: Maybe<Scalars['Boolean']['output']>;
  sku?: Maybe<Scalars['String']['output']>;
  specification?: Maybe<Scalars['String']['output']>;
  unitMeasurement?: Maybe<Scalars['String']['output']>;
  unitOfUsage?: Maybe<Scalars['String']['output']>;
  unit_of_purchase?: Maybe<UnitMeasurement>;
  unit_of_usage?: Maybe<UnitMeasurement>;
  vatable?: Maybe<Scalars['Boolean']['output']>;
};

export type ItemCategory = {
  __typename?: 'ItemCategory';
  accountName?: Maybe<Scalars['String']['output']>;
  categoryCode?: Maybe<Scalars['String']['output']>;
  categoryDescription?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  domain?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  itemGroup?: Maybe<ItemGroup>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
};

export type ItemCategoryInput = {
  categoryCode?: InputMaybe<Scalars['String']['input']>;
  categoryDescription?: InputMaybe<Scalars['String']['input']>;
  company?: InputMaybe<Scalars['UUID']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  itemGroup?: InputMaybe<ItemGroupInput>;
};

export type ItemGroup = {
  __typename?: 'ItemGroup';
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  itemCode?: Maybe<Scalars['String']['output']>;
  itemDescription?: Maybe<Scalars['String']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
};

export type ItemGroupInput = {
  company?: InputMaybe<Scalars['UUID']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  itemCode?: InputMaybe<Scalars['String']['input']>;
  itemDescription?: InputMaybe<Scalars['String']['input']>;
};

export type ItemInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  actualUnitCost?: InputMaybe<Scalars['BigDecimal']['input']>;
  assetSubAccount?: InputMaybe<ItemSubAccountInput>;
  brand?: InputMaybe<Scalars['String']['input']>;
  company?: InputMaybe<Scalars['UUID']['input']>;
  consignment?: InputMaybe<Scalars['Boolean']['input']>;
  descLong?: InputMaybe<Scalars['String']['input']>;
  discountable?: InputMaybe<Scalars['Boolean']['input']>;
  expenseSubAccount?: InputMaybe<ItemSubAccountInput>;
  fixAsset?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  isMedicine?: InputMaybe<Scalars['Boolean']['input']>;
  itemCode?: InputMaybe<Scalars['String']['input']>;
  item_category?: InputMaybe<ItemCategoryInput>;
  item_conversion?: InputMaybe<Scalars['Int']['input']>;
  item_demand_qty?: InputMaybe<Scalars['BigDecimal']['input']>;
  item_generics?: InputMaybe<GenericInput>;
  item_group?: InputMaybe<ItemGroupInput>;
  item_markup?: InputMaybe<Scalars['BigDecimal']['input']>;
  item_maximum?: InputMaybe<Scalars['BigDecimal']['input']>;
  markupLock?: InputMaybe<Scalars['Boolean']['input']>;
  production?: InputMaybe<Scalars['Boolean']['input']>;
  sku?: InputMaybe<Scalars['String']['input']>;
  specification?: InputMaybe<Scalars['String']['input']>;
  unit_of_purchase?: InputMaybe<UnitMeasurementInput>;
  unit_of_usage?: InputMaybe<UnitMeasurementInput>;
  vatable?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ItemJobsDto = {
  __typename?: 'ItemJobsDto';
  types?: Maybe<Array<Maybe<JobItemType>>>;
  units?: Maybe<Array<Maybe<JobItemUnit>>>;
};

export type ItemSubAccount = {
  __typename?: 'ItemSubAccount';
  accountName?: Maybe<Scalars['String']['output']>;
  accountType?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  domain?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  isFixedAsset?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  sourceColumn?: Maybe<Scalars['String']['output']>;
  subAccountCode?: Maybe<Scalars['String']['output']>;
  subAccountDescription?: Maybe<Scalars['String']['output']>;
};

export type ItemSubAccountInput = {
  accountType?: InputMaybe<Scalars['String']['input']>;
  company?: InputMaybe<Scalars['UUID']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isFixedAsset?: InputMaybe<Scalars['Boolean']['input']>;
  sourceColumn?: InputMaybe<Scalars['String']['input']>;
  subAccountCode?: InputMaybe<Scalars['String']['input']>;
  subAccountDescription?: InputMaybe<Scalars['String']['input']>;
};

export type Job = {
  __typename?: 'Job';
  billed?: Maybe<Scalars['Boolean']['output']>;
  bodyColor?: Maybe<Scalars['String']['output']>;
  bodyNo?: Maybe<Scalars['String']['output']>;
  chassisNo?: Maybe<Scalars['String']['output']>;
  completed?: Maybe<Scalars['Boolean']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  customer?: Maybe<ArCustomers>;
  customerComplain?: Maybe<Scalars['String']['output']>;
  dateReleased?: Maybe<Scalars['Instant']['output']>;
  dateTrans?: Maybe<Scalars['Instant']['output']>;
  deadline?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  endorsement?: Maybe<Endorsement>;
  engineNo?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  insurance?: Maybe<Insurances>;
  jobNo?: Maybe<Scalars['String']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  make?: Maybe<Scalars['String']['output']>;
  odometerReading?: Maybe<Scalars['String']['output']>;
  office?: Maybe<Office>;
  otherFindings?: Maybe<Scalars['String']['output']>;
  pending?: Maybe<Scalars['Boolean']['output']>;
  plateNo?: Maybe<Scalars['String']['output']>;
  remarks?: Maybe<Scalars['String']['output']>;
  repair?: Maybe<RepairType>;
  repairHistory?: Maybe<Scalars['String']['output']>;
  series?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  totalCost?: Maybe<Scalars['BigDecimal']['output']>;
  yearModel?: Maybe<Scalars['String']['output']>;
};

export type JobInput = {
  billed?: InputMaybe<Scalars['Boolean']['input']>;
  bodyColor?: InputMaybe<Scalars['String']['input']>;
  bodyNo?: InputMaybe<Scalars['String']['input']>;
  chassisNo?: InputMaybe<Scalars['String']['input']>;
  completed?: InputMaybe<Scalars['Boolean']['input']>;
  customer?: InputMaybe<ArCustomersInput>;
  customerComplain?: InputMaybe<Scalars['String']['input']>;
  dateReleased?: InputMaybe<Scalars['Instant']['input']>;
  dateTrans?: InputMaybe<Scalars['Instant']['input']>;
  deadline?: InputMaybe<Scalars['Instant']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  endorsement?: InputMaybe<EndorsementInput>;
  engineNo?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  insurance?: InputMaybe<InsurancesInput>;
  jobNo?: InputMaybe<Scalars['String']['input']>;
  make?: InputMaybe<Scalars['String']['input']>;
  odometerReading?: InputMaybe<Scalars['String']['input']>;
  office?: InputMaybe<OfficeInput>;
  otherFindings?: InputMaybe<Scalars['String']['input']>;
  pending?: InputMaybe<Scalars['Boolean']['input']>;
  plateNo?: InputMaybe<Scalars['String']['input']>;
  remarks?: InputMaybe<Scalars['String']['input']>;
  repair?: InputMaybe<RepairTypeInput>;
  repairHistory?: InputMaybe<Scalars['String']['input']>;
  series?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  totalCost?: InputMaybe<Scalars['BigDecimal']['input']>;
  yearModel?: InputMaybe<Scalars['String']['input']>;
};

export type JobItemType = {
  __typename?: 'JobItemType';
  j_type?: Maybe<Scalars['String']['output']>;
};

export type JobItemUnit = {
  __typename?: 'JobItemUnit';
  unit?: Maybe<Scalars['String']['output']>;
};

export type JobItems = {
  __typename?: 'JobItems';
  billed?: Maybe<Scalars['Boolean']['output']>;
  cost?: Maybe<Scalars['BigDecimal']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  descriptions?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  item?: Maybe<Item>;
  job?: Maybe<Job>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  outputTax?: Maybe<Scalars['BigDecimal']['output']>;
  qty?: Maybe<Scalars['Int']['output']>;
  service?: Maybe<ServiceManagement>;
  serviceCategory?: Maybe<ServiceCategory>;
  subTotal?: Maybe<Scalars['BigDecimal']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  wcost?: Maybe<Scalars['BigDecimal']['output']>;
};

export type JobItemsDtoInput = {
  billed?: InputMaybe<Scalars['Boolean']['input']>;
  cost?: InputMaybe<Scalars['BigDecimal']['input']>;
  descriptions?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  isNew?: InputMaybe<Scalars['Boolean']['input']>;
  item?: InputMaybe<ItemInput>;
  outputTax?: InputMaybe<Scalars['BigDecimal']['input']>;
  qty?: InputMaybe<Scalars['Int']['input']>;
  service?: InputMaybe<Scalars['String']['input']>;
  serviceCategory?: InputMaybe<Scalars['String']['input']>;
  subTotal?: InputMaybe<Scalars['BigDecimal']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  wcost?: InputMaybe<Scalars['BigDecimal']['input']>;
};

export type JobItemsInput = {
  billed?: InputMaybe<Scalars['Boolean']['input']>;
  cost?: InputMaybe<Scalars['BigDecimal']['input']>;
  descriptions?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  item?: InputMaybe<ItemInput>;
  job?: InputMaybe<JobInput>;
  outputTax?: InputMaybe<Scalars['BigDecimal']['input']>;
  qty?: InputMaybe<Scalars['Int']['input']>;
  service?: InputMaybe<ServiceManagementInput>;
  serviceCategory?: InputMaybe<ServiceCategoryInput>;
  subTotal?: InputMaybe<Scalars['BigDecimal']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  wcost?: InputMaybe<Scalars['BigDecimal']['input']>;
};

export type JobOrder = {
  __typename?: 'JobOrder';
  assets?: Maybe<Assets>;
  code?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  customer?: Maybe<Customer>;
  dateTrans?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  durationEnd?: Maybe<Scalars['Instant']['output']>;
  durationStart?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  project?: Maybe<Projects>;
  remarks?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  /** totals */
  totals?: Maybe<Scalars['BigDecimal']['output']>;
};

export type JobOrderItems = {
  __typename?: 'JobOrderItems';
  active?: Maybe<Scalars['Boolean']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  cost?: Maybe<Scalars['BigDecimal']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  dateTrans?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  jobOrder?: Maybe<JobOrder>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  qty?: Maybe<Scalars['BigDecimal']['output']>;
  subTotal?: Maybe<Scalars['BigDecimal']['output']>;
  total?: Maybe<Scalars['BigDecimal']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  unit?: Maybe<Scalars['String']['output']>;
};

export type JobStatus = {
  __typename?: 'JobStatus';
  code?: Maybe<Scalars['String']['output']>;
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  disabledEditing?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  is_active?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  statusColor?: Maybe<Scalars['String']['output']>;
};

export type JournalEntryViewDto = {
  __typename?: 'JournalEntryViewDto';
  code?: Maybe<Scalars['String']['output']>;
  credit?: Maybe<Scalars['BigDecimal']['output']>;
  debit?: Maybe<Scalars['BigDecimal']['output']>;
  desc?: Maybe<Scalars['String']['output']>;
};

export enum JournalType {
  All = 'ALL',
  Disbursement = 'DISBURSEMENT',
  General = 'GENERAL',
  PurchasesPayables = 'PURCHASES_PAYABLES',
  Receipts = 'RECEIPTS',
  Sales = 'SALES',
  Xxxx = 'XXXX'
}

export enum LeaveStatus {
  Draft = 'DRAFT',
  Finalized = 'FINALIZED'
}

export enum LeaveType {
  InjuryRelated = 'INJURY_RELATED',
  Maternity = 'MATERNITY',
  Paternity = 'PATERNITY',
  Sick = 'SICK',
  Vacation = 'VACATION'
}

export type Ledger = {
  __typename?: 'Ledger';
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  credit?: Maybe<Scalars['BigDecimal']['output']>;
  debit?: Maybe<Scalars['BigDecimal']['output']>;
  header?: Maybe<HeaderLedger>;
  id?: Maybe<Scalars['UUID']['output']>;
  journalAccount?: Maybe<ChartOfAccountGenerate>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  particulars?: Maybe<Scalars['String']['output']>;
  totalAppliedOr?: Maybe<Scalars['BigDecimal']['output']>;
  transactionDateOnly?: Maybe<Scalars['LocalDate']['output']>;
};

export enum LedgerDocType {
  Aj = 'AJ',
  Am = 'AM',
  Ap = 'AP',
  Ar = 'AR',
  Bb = 'BB',
  Ca = 'CA',
  Ch = 'CH',
  Ck = 'CK',
  Cm = 'CM',
  Cn = 'CN',
  Cs = 'CS',
  Dm = 'DM',
  Ds = 'DS',
  Ei = 'EI',
  El = 'EL',
  Fa = 'FA',
  Inv = 'INV',
  Jv = 'JV',
  Or = 'OR',
  Pa = 'PA',
  Pc = 'PC',
  Prl = 'PRL',
  Qa = 'QA',
  Rm = 'RM',
  Rr = 'RR',
  Rt = 'RT',
  Si = 'SI',
  Xx = 'XX'
}

export type LedgerDtoInput = {
  destinationOffice?: InputMaybe<OfficeInput>;
  documentTypes?: InputMaybe<Scalars['UUID']['input']>;
  isInclude?: InputMaybe<Scalars['Boolean']['input']>;
  item?: InputMaybe<Scalars['UUID']['input']>;
  ledgerDate?: InputMaybe<Scalars['Instant']['input']>;
  ledgerPhysical?: InputMaybe<Scalars['Int']['input']>;
  ledgerQtyIn?: InputMaybe<Scalars['Int']['input']>;
  ledgerQtyOut?: InputMaybe<Scalars['Int']['input']>;
  ledgerUnitCost?: InputMaybe<Scalars['BigDecimal']['input']>;
  referenceNo?: InputMaybe<Scalars['String']['input']>;
  sourceOffice?: InputMaybe<OfficeInput>;
};

export type LedgerEntry = {
  __typename?: 'LedgerEntry';
  code?: Maybe<Scalars['String']['output']>;
  credit?: Maybe<Scalars['BigDecimal']['output']>;
  debit?: Maybe<Scalars['BigDecimal']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
};

export type LedgerTotalDebitCredit = {
  __typename?: 'LedgerTotalDebitCredit';
  id?: Maybe<Scalars['UUID']['output']>;
  totalCredit?: Maybe<Scalars['BigDecimal']['output']>;
  totalDebit?: Maybe<Scalars['BigDecimal']['output']>;
};

export type LedgerView = {
  __typename?: 'LedgerView';
  ledgerPage?: Maybe<Array<Maybe<Scalars['Map_String_ObjectScalar']['output']>>>;
  totalCredit?: Maybe<Scalars['BigDecimal']['output']>;
  totalDebit?: Maybe<Scalars['BigDecimal']['output']>;
};

export type LedgerViewContainer = {
  __typename?: 'LedgerViewContainer';
  ledgerPage?: Maybe<Page_Ledger>;
  totalCredit?: Maybe<Scalars['BigDecimal']['output']>;
  totalDebit?: Maybe<Scalars['BigDecimal']['output']>;
};

export type Loan = {
  __typename?: 'Loan';
  bankAccount?: Maybe<Bank>;
  companyId?: Maybe<Scalars['UUID']['output']>;
  compoundType?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  details?: Maybe<Scalars['Map_String_StringScalar']['output']>;
  domain?: Maybe<Scalars['String']['output']>;
  flagValue?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  interestRate?: Maybe<Scalars['BigDecimal']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  loanAmount?: Maybe<Scalars['BigDecimal']['output']>;
  loanNo?: Maybe<Scalars['String']['output']>;
  loanPayment?: Maybe<Scalars['BigDecimal']['output']>;
  loanPeriod?: Maybe<Scalars['Int']['output']>;
  negativeInterestRate?: Maybe<Scalars['BigDecimal']['output']>;
  negativeLoanAmount?: Maybe<Scalars['BigDecimal']['output']>;
  negativeLoanPayment?: Maybe<Scalars['BigDecimal']['output']>;
  numberOfPayments?: Maybe<Scalars['Int']['output']>;
  paidPayments?: Maybe<Scalars['BigDecimal']['output']>;
  postedLedger?: Maybe<Scalars['UUID']['output']>;
  referenceNo?: Maybe<Scalars['String']['output']>;
  remainingBalance?: Maybe<Scalars['BigDecimal']['output']>;
  startDate?: Maybe<Scalars['Date']['output']>;
  totalCostOfLoan?: Maybe<Scalars['BigDecimal']['output']>;
  totalInterest?: Maybe<Scalars['BigDecimal']['output']>;
};

export type LoanAmortization = {
  __typename?: 'LoanAmortization';
  bank?: Maybe<Bank>;
  beginningBalance?: Maybe<Scalars['BigDecimal']['output']>;
  companyId?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  details?: Maybe<Scalars['Map_String_StringScalar']['output']>;
  domain?: Maybe<Scalars['String']['output']>;
  endingBalance?: Maybe<Scalars['BigDecimal']['output']>;
  flagValue?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  interest?: Maybe<Scalars['BigDecimal']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  loan?: Maybe<Loan>;
  negativeInterest?: Maybe<Scalars['BigDecimal']['output']>;
  negativePayment?: Maybe<Scalars['BigDecimal']['output']>;
  negativePrincipal?: Maybe<Scalars['BigDecimal']['output']>;
  orderNo?: Maybe<Scalars['Int']['output']>;
  payment?: Maybe<Scalars['BigDecimal']['output']>;
  paymentDate?: Maybe<Scalars['Date']['output']>;
  postedLedger?: Maybe<Scalars['UUID']['output']>;
  principal?: Maybe<Scalars['BigDecimal']['output']>;
  recordNo?: Maybe<Scalars['String']['output']>;
  referenceNo?: Maybe<Scalars['String']['output']>;
};

export enum LoanPaymentTerm {
  Monthly = 'MONTHLY',
  SemiMonthly = 'SEMI_MONTHLY'
}

export type MaterialProduction = {
  __typename?: 'MaterialProduction';
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  dateTransaction?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isPosted?: Maybe<Scalars['Boolean']['output']>;
  isVoid?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  mpNo?: Maybe<Scalars['String']['output']>;
  office?: Maybe<Office>;
  producedBy?: Maybe<Employee>;
};

export type MaterialProductionInput = {
  company?: InputMaybe<Scalars['UUID']['input']>;
  dateTransaction?: InputMaybe<Scalars['Instant']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  isPosted?: InputMaybe<Scalars['Boolean']['input']>;
  isVoid?: InputMaybe<Scalars['Boolean']['input']>;
  mpNo?: InputMaybe<Scalars['String']['input']>;
  office?: InputMaybe<OfficeInput>;
  producedBy?: InputMaybe<EmployeeInput>;
};

export type MaterialProductionItem = {
  __typename?: 'MaterialProductionItem';
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isPosted?: Maybe<Scalars['Boolean']['output']>;
  item?: Maybe<Item>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  materialProduction?: Maybe<MaterialProduction>;
  qty?: Maybe<Scalars['Int']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  unitCost?: Maybe<Scalars['BigDecimal']['output']>;
  unitMeasurement?: Maybe<Scalars['String']['output']>;
  uou?: Maybe<Scalars['String']['output']>;
};

/** Mutation root */
export type Mutation = {
  __typename?: 'Mutation';
  add2307?: Maybe<Wtx2307Consolidated>;
  addArInvoiceParticulars?: Maybe<GraphQlResVal_ArInvoiceParticulars>;
  addCreditNoteClaimsItem?: Maybe<GraphQlResVal_ArCreditNoteItems>;
  addCustomJV?: Maybe<GraphQlRetVal_Boolean>;
  addDiscounts?: Maybe<BillingItem>;
  addInvoiceClaimsItem?: Maybe<GraphQlResVal_ArInvoiceItems>;
  addInvoiceItem?: Maybe<GraphQlResVal_ArInvoiceItems>;
  /** Add Items to bill */
  addItems?: Maybe<BillingItem>;
  addManualJVDynamic?: Maybe<GraphQlRetVal_Boolean>;
  /** Add Services to bill */
  addNewService?: Maybe<BillingItem>;
  addOTC?: Maybe<Billing>;
  /** add Payment */
  addPayment?: Maybe<Payment>;
  addReceivablePayment?: Maybe<GraphQlResVal_Payment>;
  /** add remarks in shift */
  addRemarks?: Maybe<Shift>;
  addService?: Maybe<BillingItem>;
  /** add shift */
  addShift?: Maybe<Shift>;
  addSubAccountToIntegration?: Maybe<Scalars['Boolean']['output']>;
  /** add Terminal */
  addTerminal?: Maybe<Terminal>;
  addTransferItem?: Maybe<GraphQlResVal_ArInvoiceItems>;
  adjustJV?: Maybe<GraphQlRetVal_Boolean>;
  allocateCreditNote?: Maybe<GraphQlResVal_ArCreditNote>;
  applyDefaultsPrice?: Maybe<OfficeItem>;
  approveLedger?: Maybe<Scalars['Boolean']['output']>;
  approveLedgerWithDate?: Maybe<Scalars['Boolean']['output']>;
  arCreditNotePosting?: Maybe<GraphQlResVal_ArCreditNote>;
  assetRepairMaintenanceItemDeletedById?: Maybe<AssetRepairMaintenanceItems>;
  /** insert BEG */
  beginningBalanceInsert?: Maybe<BeginningBalance>;
  calculateAllAccumulatedLogs?: Maybe<GraphQlResVal_Timekeeping>;
  calculateAllAllowances?: Maybe<GraphQlResVal_PayrollAllowance>;
  calculateAllContributions?: Maybe<GraphQlResVal_PayrollContribution>;
  calculateOneAllowanceEmployee?: Maybe<GraphQlResVal_String>;
  calculateOneContributionEmployee?: Maybe<GraphQlRetVal_String>;
  calculateOneTimekeepingEmployee?: Maybe<GraphQlResVal_String>;
  /** Cancel Item */
  cancelItem?: Maybe<BillingItem>;
  changeCompany?: Maybe<Employee>;
  changePassword?: Maybe<Scalars['String']['output']>;
  checkExistingCreditNoteForInvoice?: Maybe<GraphQlResVal_ArCreditNote>;
  clearSchedule?: Maybe<GraphQlRetVal_String>;
  closeBilling?: Maybe<Billing>;
  /** close shift */
  closeShift?: Maybe<Shift>;
  createARCustomer?: Maybe<GraphQlResVal_ArCustomers>;
  createBillingProject?: Maybe<Billing>;
  createCreditNote?: Maybe<GraphQlResVal_ArCreditNote>;
  createEmptyInvoice?: Maybe<GraphQlResVal_ArInvoice>;
  createInvoice?: Maybe<GraphQlResVal_ArInvoice>;
  delPOMonitoring?: Maybe<PoDeliveryMonitoring>;
  /** Delete deleteAllowance */
  deleteAllowance?: Maybe<GraphQlRetVal_String>;
  /** Delete delete Allowance Item */
  deleteAllowanceItem?: Maybe<GraphQlRetVal_String>;
  /** Delete delete Allowance Package */
  deleteAllowancePackage?: Maybe<GraphQlRetVal_String>;
  deleteBillingItem?: Maybe<BillingItem>;
  /** Delete one department schedule config. */
  deleteDepartmentSchedule?: Maybe<GraphQlRetVal_String>;
  deleteEmployeeAttendance?: Maybe<GraphQlRetVal_String>;
  /** Delete one event calender. */
  deleteEventCalendar?: Maybe<GraphQlRetVal_String>;
  /** insert Integrations */
  deleteIntegration?: Maybe<Scalars['Boolean']['output']>;
  /** insert Integrations */
  deleteIntegrationItem?: Maybe<Scalars['Boolean']['output']>;
  deleteOtherDeduction?: Maybe<GraphQlRetVal_String>;
  deletePayroll?: Maybe<GraphQlResVal_String>;
  deletePayrollAdjustmentItem?: Maybe<GraphQlResVal_String>;
  deletePayrollAllowanceItem?: Maybe<GraphQlResVal_Boolean>;
  deletePayrollOtherDeductionItem?: Maybe<GraphQlResVal_String>;
  directExpenseMaterials?: Maybe<GraphQlRetVal_Boolean>;
  disbursementUpsert?: Maybe<Disbursement>;
  editEmployeeAllowance?: Maybe<GraphQlResVal_EmployeeAllowance>;
  editExpenseItemFromProjects?: Maybe<InventoryLedger>;
  employeeUpdateStatus?: Maybe<Employee>;
  expenseItemFromProjects?: Maybe<InventoryLedger>;
  generateCreditNoteItemTaxByCreditNoteId?: Maybe<GraphQlResVal_Boolean>;
  generateCreditNoteTax?: Maybe<GraphQlResVal_Boolean>;
  generateCreditNoteVat?: Maybe<GraphQlResVal_Boolean>;
  generateDailyAllowances?: Maybe<GraphQlResVal_Boolean>;
  generateInvoiceTax?: Maybe<GraphQlResVal_Boolean>;
  generateInvoiceVat?: Maybe<GraphQlResVal_Boolean>;
  ignoreAttendance?: Maybe<GraphQlRetVal_String>;
  invoicePosting?: Maybe<GraphQlResVal_ArInvoice>;
  invoiceVoidPosting?: Maybe<GraphQlResVal_ArInvoice>;
  linkPOItemRec?: Maybe<PurchaseOrderItems>;
  loanMAddLoan?: Maybe<GraphQlRetVal_Loan>;
  loanMPaidLoan?: Maybe<GraphQlRetVal_Boolean>;
  loanMPostEntry?: Maybe<GraphQlRetVal_Boolean>;
  loanMVoidPaidLoan?: Maybe<GraphQlRetVal_Boolean>;
  lockBilling?: Maybe<Billing>;
  lockedOtherProgress?: Maybe<GraphQlRetVal_Boolean>;
  lockedOtherUpdates?: Maybe<GraphQlRetVal_Boolean>;
  onDeleteIntegrationGroup?: Maybe<Scalars['Boolean']['output']>;
  overrideRecItems?: Maybe<ReceivingReport>;
  paymentPostingApproval?: Maybe<GraphQlResVal_ArPaymentPosting>;
  pettyCashPostVoid?: Maybe<PettyCash>;
  postAp?: Maybe<AccountsPayable>;
  postApManual?: Maybe<GraphQlRetVal_Boolean>;
  postDM?: Maybe<DebitMemo>;
  postDManual?: Maybe<GraphQlRetVal_Boolean>;
  postDisbursement?: Maybe<Disbursement>;
  postDsManual?: Maybe<GraphQlRetVal_Boolean>;
  postInventoryGlobal?: Maybe<InventoryLedger>;
  postInventoryLedgerBegBalance?: Maybe<InventoryLedger>;
  postInventoryLedgerIssuance?: Maybe<InventoryLedger>;
  postInventoryLedgerMaterial?: Maybe<InventoryLedger>;
  postInventoryLedgerQtyAdjustment?: Maybe<InventoryLedger>;
  postInventoryLedgerRec?: Maybe<InventoryLedger>;
  postInventoryLedgerReturn?: Maybe<InventoryLedger>;
  postPettyCash?: Maybe<PettyCashAccounting>;
  postPettyCashManual?: Maybe<GraphQlRetVal_Boolean>;
  postReappManual?: Maybe<GraphQlRetVal_Boolean>;
  postReapplication?: Maybe<Reapplication>;
  projectWorkAccomplishToggleLock?: Maybe<ProjectWorkAccomplish>;
  pushToBill?: Maybe<Billing>;
  pushToBillProject?: Maybe<Billing>;
  /** insert adj */
  quantityAdjustmentInsert?: Maybe<QuantityAdjustment>;
  reapplicationUpsert?: Maybe<GraphQlRetVal_Boolean>;
  recalculateAllPayrollModuleEmployee?: Maybe<GraphQlResVal_String>;
  recalculateAllWithholdingTax?: Maybe<GraphQlResVal_String>;
  recalculateOneDay?: Maybe<GraphQlResVal_String>;
  recalculateOneWithholdingTax?: Maybe<GraphQlResVal_String>;
  /** A mutation to recalculate payroll module employee . */
  recalculatePayrollModuleEmployee?: Maybe<GraphQlResVal_String>;
  remove2307?: Maybe<Wtx2307>;
  removeAccountTemplateItem?: Maybe<ApAccountsTemplateItems>;
  removeApApp?: Maybe<DisbursementAp>;
  removeApAppList?: Maybe<DisbursementAp>;
  removeApDetails?: Maybe<AccountsPayableDetails>;
  removeApLedger?: Maybe<ApLedger>;
  removeCheck?: Maybe<DisbursementCheck>;
  removeCheckList?: Maybe<DisbursementCheck>;
  removeCreditNoteItem?: Maybe<GraphQlResVal_ArCreditNoteItems>;
  removeDMAPDetails?: Maybe<DisbursementAp>;
  removeDetailsDebitMemo?: Maybe<DebitMemoDetails>;
  removeDmDetails?: Maybe<DebitMemoDetails>;
  removeExpense?: Maybe<DisbursementExpense>;
  removeExpenseByList?: Maybe<DisbursementExpense>;
  removeInvoiceItem?: Maybe<GraphQlResVal_ArInvoiceItems>;
  /** Remove */
  removeItemSupplier?: Maybe<SupplierItem>;
  removeJobItem?: Maybe<JobItems>;
  removeMpItem?: Maybe<MaterialProductionItem>;
  removeOthersById?: Maybe<PettyCashOther>;
  removeOthersByParent?: Maybe<PettyCashOther>;
  removePaymentPostingItem?: Maybe<Scalars['Boolean']['output']>;
  removePettyCashItemById?: Maybe<PettyCashItem>;
  removePoItem?: Maybe<PurchaseOrderItems>;
  removePrItem?: Maybe<PurchaseRequestItem>;
  removeProjectProgressImage?: Maybe<GraphQlRetVal_Boolean>;
  removeProjectUpdateWorkers?: Maybe<GraphQlRetVal_Boolean>;
  removePurchaseItemsByParent?: Maybe<PettyCashItem>;
  removeRecItem?: Maybe<ReceivingReportItem>;
  removeRecItemNoQuery?: Maybe<ReceivingReportItem>;
  removeRtsItem?: Maybe<ReturnSupplierItem>;
  removeServiceItem?: Maybe<ServiceItems>;
  removeStiItem?: Maybe<StockIssueItems>;
  removeWtx?: Maybe<DisbursementWtx>;
  removeWtxList?: Maybe<DisbursementWtx>;
  removedMaterial?: Maybe<ProjectUpdatesMaterials>;
  removedMaterialDirectExpense?: Maybe<ProjectUpdatesMaterials>;
  resetPassword?: Maybe<User>;
  reverseHeader?: Maybe<GraphQlRetVal_Boolean>;
  reviseProjectCost?: Maybe<ProjectCost>;
  setCounter?: Maybe<Counter>;
  setToCompleted?: Maybe<PurchaseOrder>;
  syncAttendance?: Maybe<Array<Maybe<EmployeeAttendance>>>;
  testPayrollAccounting?: Maybe<GraphQlResVal_String>;
  transferIntegration?: Maybe<Scalars['Boolean']['output']>;
  update2307?: Maybe<Wtx2307>;
  updateAPStatus?: Maybe<AccountsPayable>;
  updateAllowanceItemAmount?: Maybe<GraphQlResVal_PayrollAllowanceItem>;
  updateBegBalStatus?: Maybe<BeginningBalance>;
  updateBilled?: Maybe<JobItems>;
  updateBillingItemForRevisions?: Maybe<BillingItem>;
  updateCKStatus?: Maybe<Disbursement>;
  updateContributionTypeStatus?: Maybe<GraphQlResVal_PayrollContribution>;
  updateCreditNoteTotals?: Maybe<ArCreditNote>;
  updateDmStatus?: Maybe<DebitMemo>;
  updateEmployeeContributionStatus?: Maybe<GraphQlResVal_PayrollEmployeeContribution>;
  /** insert chartsOfAccounts */
  updateInsertParentAccount?: Maybe<GraphQlRetVal_ParentAccount>;
  /** insert Integrations */
  updateIntegrationItem?: Maybe<Scalars['Boolean']['output']>;
  updateInvoiceTotals?: Maybe<ArInvoice>;
  updateJobAssetStatus?: Maybe<JobOrder>;
  updateJobBilled?: Maybe<Job>;
  updateJobStatus?: Maybe<Job>;
  updateMPStatus?: Maybe<MaterialProduction>;
  updateMemoAmount?: Maybe<DebitMemo>;
  updateMpItemStatus?: Maybe<MaterialProductionItem>;
  updateMultipleCreditNoteItem?: Maybe<Scalars['Boolean']['output']>;
  updatePOStatus?: Maybe<PurchaseOrder>;
  updatePRItemPO?: Maybe<PurchaseRequestItem>;
  updatePRStatus?: Maybe<PurchaseRequest>;
  updatePayableForRemove?: Maybe<AccountsPayable>;
  updatePayrollAdjustmentStatus?: Maybe<GraphQlResVal_String>;
  updatePayrollAllowanceStatus?: Maybe<GraphQlResVal_String>;
  updatePayrollContributionStatus?: Maybe<GraphQlResVal_String>;
  updatePayrollDetails?: Maybe<GraphQlResVal_String>;
  updatePayrollEmployeeAdjustmentStatus?: Maybe<GraphQlResVal_PayrollEmployeeAdjustment>;
  updatePayrollEmployeeAllowanceStatus?: Maybe<GraphQlResVal_PayrollEmployeeAllowance>;
  updatePayrollEmployeeContributionStatus?: Maybe<GraphQlResVal_PayrollEmployeeContribution>;
  updatePayrollEmployeeLoanStatus?: Maybe<GraphQlResVal_PayrollEmployeeLoan>;
  updatePayrollEmployeeOtherDeductionStatus?: Maybe<GraphQlResVal_PayrollEmployeeOtherDeduction>;
  updatePayrollEmployeeStatus?: Maybe<GraphQlResVal_String>;
  updatePayrollLoanItemAmount?: Maybe<GraphQlResVal_PayrollLoanItem>;
  updatePayrollLoanStatus?: Maybe<GraphQlResVal_String>;
  /** A mutation for updating the status of module employee status. */
  updatePayrollModuleEmployeeStatus?: Maybe<GraphQlResVal_String>;
  updatePayrollOtherDeductionStatus?: Maybe<GraphQlResVal_String>;
  updatePayrollStatus?: Maybe<GraphQlResVal_Payroll>;
  updatePercent?: Maybe<Projects>;
  updatePettyCashStatus?: Maybe<PettyCashAccounting>;
  updatePrices?: Maybe<OfficeItem>;
  updateQtyAdjStatus?: Maybe<QuantityAdjustment>;
  updateRECStatus?: Maybe<ReceivingReport>;
  updateRPStatus?: Maybe<Reapplication>;
  updateRTSStatus?: Maybe<ReturnSupplier>;
  updateReOrderQty?: Maybe<OfficeItem>;
  updateReapply?: Maybe<Reapplication>;
  updateRecItemStatus?: Maybe<ReceivingReportItem>;
  updateReorder?: Maybe<OfficeItem>;
  updateRtsItemStatus?: Maybe<ReturnSupplierItem>;
  updateSTIStatus?: Maybe<StockIssue>;
  /** Update the salary rate multiplier */
  updateSalaryRateMultiplier?: Maybe<GraphQlRetVal_SalaryRateMultiplier>;
  updateStatusCost?: Maybe<ProjectCost>;
  updateStiItemStatus?: Maybe<StockIssueItems>;
  updateTimekeepingEmployeeStatus?: Maybe<GraphQlResVal_TimekeepingEmployee>;
  updateTimekeepingStatus?: Maybe<GraphQlResVal_String>;
  upsert2307?: Maybe<Wtx2307>;
  upsertAccountTemplateItem?: Maybe<ApAccountsTemplateItems>;
  upsertAddress?: Maybe<GraphQlRetVal_Boolean>;
  upsertAdjustmentCategory?: Maybe<GraphQlResVal_AdjustmentCategory>;
  upsertAdjustmentItem?: Maybe<GraphQlResVal_PayrollAdjustmentItem>;
  /** add allowance item */
  upsertAllAllowanceItem?: Maybe<GraphQlRetVal_String>;
  /** add allowance package */
  upsertAllowanceItem?: Maybe<GraphQlRetVal_AllowanceItem>;
  upsertAllowancePackage?: Maybe<GraphQlRetVal_AllowancePackage>;
  /**  Add allowance type  */
  upsertAllowanceType?: Maybe<GraphQlRetVal_Allowance>;
  upsertApAccountsTemplate?: Maybe<ApAccountsTemplate>;
  upsertApLedger?: Maybe<ApLedger>;
  upsertApTransaction?: Maybe<ApTransaction>;
  upsertAsset?: Maybe<Assets>;
  upsertAssetMaintenanceType?: Maybe<AssetMaintenanceTypes>;
  upsertAssetPreventiveMaintenance?: Maybe<AssetPreventiveMaintenance>;
  upsertAssetRepairMaintenance?: Maybe<AssetRepairMaintenance>;
  upsertAssetRepairMaintenanceItem?: Maybe<AssetRepairMaintenanceItems>;
  upsertBanks?: Maybe<Bank>;
  upsertBegQty?: Maybe<BeginningBalance>;
  upsertBillingItemByJob?: Maybe<BillingItem>;
  upsertBillingItemByMisc?: Maybe<BillingItem>;
  upsertBillingItemByProject?: Maybe<BillingItem>;
  upsertChargeInvoice?: Maybe<ChargeInvoice>;
  upsertCheck?: Maybe<DisbursementCheck>;
  upsertCompany?: Maybe<CompanySettings>;
  upsertConsolidated?: Maybe<Wtx2307Consolidated>;
  upsertCreditNoteItem?: Maybe<GraphQlResVal_ArCreditNoteItems>;
  upsertCustomer?: Maybe<Customer>;
  upsertDM?: Maybe<DebitMemo>;
  upsertDebitMemo?: Maybe<DebitMemo>;
  upsertDisAp?: Maybe<DisbursementAp>;
  upsertDisDM?: Maybe<DisbursementAp>;
  upsertDisReap?: Maybe<DisbursementAp>;
  upsertDmDetials?: Maybe<DebitMemoDetails>;
  upsertEmployee?: Maybe<Employee>;
  upsertEmployeeAllowances?: Maybe<GraphQlResVal_String>;
  upsertEmployeeAttendance?: Maybe<GraphQlResVal_EmployeeAttendance>;
  upsertEmployeeLeave?: Maybe<GraphQlResVal_EmployeeLeave>;
  upsertEmployeeLoan?: Maybe<GraphQlResVal_EmployeeLoan>;
  upsertEmployeeLoanConfig?: Maybe<GraphQlResVal_String>;
  /** create or update schedule config. */
  upsertEmployeeSchedule?: Maybe<GraphQlResVal_String>;
  /** Create or edit event calendar. */
  upsertEventCalendar?: Maybe<GraphQlRetVal_EventCalendar>;
  /** insert TransType */
  upsertExTransType?: Maybe<GraphQlRetVal_Boolean>;
  upsertExp?: Maybe<DisbursementExpense>;
  upsertFiscal?: Maybe<Fiscal>;
  upsertFixedAssetItems?: Maybe<GraphQlResVal_FixedAssetItems>;
  upsertGenerics?: Maybe<Generic>;
  upsertGroupPolicy?: Maybe<GroupPolicy>;
  upsertHDMFContribution?: Maybe<GraphQlRetVal_HdmfContribution>;
  upsertInsurance?: Maybe<Insurances>;
  /** insert Integrations */
  upsertIntegration?: Maybe<Scalars['Boolean']['output']>;
  upsertIntegrationGroup?: Maybe<Scalars['Boolean']['output']>;
  upsertItem?: Maybe<GraphQlRetVal_Boolean>;
  upsertItemCategory?: Maybe<ItemCategory>;
  upsertItemGroup?: Maybe<ItemGroup>;
  upsertItemSubAccount?: Maybe<ItemSubAccount>;
  upsertJob?: Maybe<Job>;
  upsertJobItem?: Maybe<JobItems>;
  upsertJobItemFormBilling?: Maybe<JobItems>;
  upsertJobItemsByParent?: Maybe<Job>;
  upsertJobOrder?: Maybe<JobOrder>;
  upsertJobOrderItems?: Maybe<JobOrderItems>;
  upsertJobStatus?: Maybe<JobStatus>;
  upsertMP?: Maybe<MaterialProduction>;
  upsertMPAssetRepairMaintenanceItem?: Maybe<AssetRepairMaintenanceItems>;
  upsertManyMaterials?: Maybe<GraphQlRetVal_Boolean>;
  upsertMpItem?: Maybe<MaterialProductionItem>;
  upsertMultiFixedAssetItems?: Maybe<GraphQlResVal_Boolean>;
  upsertOffice?: Maybe<Office>;
  upsertOfficeItem?: Maybe<OfficeItem>;
  upsertOtherDeductionItem?: Maybe<GraphQlResVal_PayrollOtherDeductionItem>;
  upsertOtherDeductionType?: Maybe<GraphQlRetVal_OtherDeductionTypes>;
  upsertOthers?: Maybe<PettyCashOther>;
  upsertPHICContribution?: Maybe<GraphQlRetVal_PhicContribution>;
  upsertPO?: Maybe<PurchaseOrder>;
  upsertPOItem?: Maybe<PurchaseOrderItems>;
  upsertPOMonitoring?: Maybe<PoDeliveryMonitoring>;
  upsertPR?: Maybe<PurchaseRequest>;
  upsertPRItem?: Maybe<PurchaseRequestItem>;
  upsertPayables?: Maybe<AccountsPayable>;
  upsertPayablesByRec?: Maybe<AccountsPayable>;
  upsertPayablesDetails?: Maybe<AccountsPayableDetails>;
  upsertPayablesDetailsByRec?: Maybe<AccountsPayableDetails>;
  upsertPaymentTerms?: Maybe<PaymentTerm>;
  upsertPayroll?: Maybe<GraphQlResVal_Payroll>;
  upsertPayrollAllowanceItem?: Maybe<GraphQlResVal_Boolean>;
  upsertPettyCash?: Maybe<PettyCash>;
  upsertPettyCashAccounting?: Maybe<PettyCashAccounting>;
  upsertPettyType?: Maybe<PettyType>;
  upsertPosition?: Maybe<Position>;
  upsertProject?: Maybe<Projects>;
  upsertProjectCost?: Maybe<GraphQlRetVal_Boolean>;
  upsertProjectMaterials?: Maybe<GraphQlRetVal_Boolean>;
  upsertProjectProgress?: Maybe<GraphQlRetVal_Boolean>;
  upsertProjectRevCost?: Maybe<ProjectCostRevisions>;
  upsertProjectUpdates?: Maybe<GraphQlRetVal_Boolean>;
  upsertProjectUpdatesWorkers?: Maybe<GraphQlRetVal_Boolean>;
  upsertProjectWorkAccomplish?: Maybe<GraphQlResVal_ProjectWorkAccomplish>;
  upsertPurchaseItems?: Maybe<PettyCashItem>;
  upsertQty?: Maybe<QuantityAdjustment>;
  /** Insert/Update QuantityAdjustmentType */
  upsertQuantityAdjustmentType?: Maybe<QuantityAdjustmentType>;
  upsertRTS?: Maybe<ReturnSupplier>;
  upsertReapplication?: Maybe<Reapplication>;
  upsertRec?: Maybe<ReceivingReport>;
  upsertRecItem?: Maybe<ReceivingReportItem>;
  upsertReleaseCheck?: Maybe<ReleaseCheck>;
  upsertRepairType?: Maybe<RepairType>;
  upsertRtsItem?: Maybe<ReturnSupplierItem>;
  upsertSSSContribution?: Maybe<GraphQlRetVal_SssContribution>;
  upsertSTI?: Maybe<StockIssue>;
  upsertScheduleLock?: Maybe<GraphQlRetVal_ScheduleLock>;
  /** create or update schedule config. */
  upsertScheduleType?: Maybe<GraphQlResVal_Schedule>;
  upsertService?: Maybe<ServiceManagement>;
  upsertServiceCategory?: Maybe<ServiceCategory>;
  upsertServiceItem?: Maybe<ServiceItems>;
  /** Insert/Update Signature */
  upsertSignature?: Maybe<Signature>;
  upsertStiItem?: Maybe<StockIssueItems>;
  upsertSubAccount?: Maybe<GraphQlRetVal_SubAccountSetup>;
  upsertSupplier?: Maybe<Supplier>;
  upsertSupplierItem?: Maybe<SupplierItem>;
  upsertSupplierType?: Maybe<SupplierType>;
  upsertTableARPaymentPosting?: Maybe<GraphQlResVal_ArPaymentPosting>;
  upsertTableARPaymentPostingItem?: Maybe<GraphQlResVal_ArPaymentPostingItems>;
  /** insert TransType */
  upsertTransType?: Maybe<TransactionType>;
  upsertUnitMeasurement?: Maybe<UnitMeasurement>;
  upsertVehicleUsageDocs?: Maybe<VehicleUsageDocs>;
  upsertVehicleUsageMonitoring?: Maybe<VehicleUsageMonitoring>;
  upsertWithholdingTaxMatrix?: Maybe<GraphQlRetVal_WithholdingTaxMatrix>;
  upsertWtx?: Maybe<DisbursementWtx>;
  voidLedgerById?: Maybe<InventoryLedger>;
  voidLedgerByRef?: Maybe<InventoryLedger>;
  voidLedgerByRefExpense?: Maybe<InventoryLedger>;
  /** void Payment */
  voidOr?: Maybe<Payment>;
};


/** Mutation root */
export type MutationAdd2307Args = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  items?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
};


/** Mutation root */
export type MutationAddArInvoiceParticularsArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationAddCreditNoteClaimsItemArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationAddCustomJvArgs = {
  entries?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
  header?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  transactionDate?: InputMaybe<Scalars['Instant']['input']>;
};


/** Mutation root */
export type MutationAddDiscountsArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationAddInvoiceClaimsItemArgs = {
  billingItemId?: InputMaybe<Scalars['UUID']['input']>;
  invoiceId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationAddInvoiceItemArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationAddItemsArgs = {
  billing?: InputMaybe<Scalars['UUID']['input']>;
  items?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
  office?: InputMaybe<Scalars['UUID']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationAddManualJvDynamicArgs = {
  details?: InputMaybe<Scalars['Map_String_StringScalar']['input']>;
  docType?: InputMaybe<LedgerDocType>;
  entries?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
  header?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  journalType?: InputMaybe<JournalType>;
  ledgerDate?: InputMaybe<Scalars['Instant']['input']>;
};


/** Mutation root */
export type MutationAddNewServiceArgs = {
  billing?: InputMaybe<Scalars['UUID']['input']>;
  items?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
  type?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationAddOtcArgs = {
  customer?: InputMaybe<Scalars['String']['input']>;
  dateTrans?: InputMaybe<Scalars['Instant']['input']>;
};


/** Mutation root */
export type MutationAddPaymentArgs = {
  billing?: InputMaybe<Scalars['UUID']['input']>;
  payment?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  payment_details?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
  shift?: InputMaybe<Scalars['UUID']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationAddReceivablePaymentArgs = {
  customerId?: InputMaybe<Scalars['UUID']['input']>;
  orNumber?: InputMaybe<Scalars['BigDecimal']['input']>;
  paymentMethod?: InputMaybe<Scalars['String']['input']>;
  shiftId?: InputMaybe<Scalars['UUID']['input']>;
  tendered?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
  transactionType?: InputMaybe<Scalars['String']['input']>;
  transactions?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
};


/** Mutation root */
export type MutationAddRemarksArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  remarks?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationAddServiceArgs = {
  amount?: InputMaybe<Scalars['BigDecimal']['input']>;
  billing?: InputMaybe<Scalars['UUID']['input']>;
  desc?: InputMaybe<Scalars['String']['input']>;
  itemtype?: InputMaybe<Scalars['String']['input']>;
  qty?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationAddSubAccountToIntegrationArgs = {
  accountId?: InputMaybe<Scalars['UUID']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationAddTerminalArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationAddTransferItemArgs = {
  creditNoteItemId?: InputMaybe<Scalars['UUID']['input']>;
  invoiceId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationAdjustJvArgs = {
  entries?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
  headerId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationAllocateCreditNoteArgs = {
  creditNoteId?: InputMaybe<Scalars['UUID']['input']>;
  fields?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
};


/** Mutation root */
export type MutationApplyDefaultsPriceArgs = {
  office?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationApproveLedgerArgs = {
  ids?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>;
};


/** Mutation root */
export type MutationApproveLedgerWithDateArgs = {
  fields?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
};


/** Mutation root */
export type MutationArCreditNotePostingArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationAssetRepairMaintenanceItemDeletedByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationBeginningBalanceInsertArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
};


/** Mutation root */
export type MutationCalculateAllAccumulatedLogsArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationCalculateAllAllowancesArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationCalculateAllContributionsArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationCalculateOneAllowanceEmployeeArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationCalculateOneContributionEmployeeArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationCalculateOneTimekeepingEmployeeArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationCancelItemArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  office?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationChangeCompanyArgs = {
  company?: InputMaybe<Scalars['UUID']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationChangePasswordArgs = {
  username?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationCheckExistingCreditNoteForInvoiceArgs = {
  invoiceId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationClearScheduleArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationCloseBillingArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationCreateArCustomerArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationCreateBillingProjectArgs = {
  project?: InputMaybe<ProjectsInput>;
};


/** Mutation root */
export type MutationCreateCreditNoteArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationCreateEmptyInvoiceArgs = {
  customerId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationCreateInvoiceArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationDelPoMonitoringArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationDeleteAllowanceArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationDeleteAllowanceItemArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationDeleteAllowancePackageArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationDeleteBillingItemArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationDeleteDepartmentScheduleArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationDeleteEmployeeAttendanceArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationDeleteEventCalendarArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationDeleteIntegrationArgs = {
  integrationId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationDeleteIntegrationItemArgs = {
  integrationId?: InputMaybe<Scalars['UUID']['input']>;
  integrationItemId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationDeleteOtherDeductionArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationDeletePayrollArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationDeletePayrollAdjustmentItemArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationDeletePayrollAllowanceItemArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationDeletePayrollOtherDeductionItemArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationDirectExpenseMaterialsArgs = {
  cost?: InputMaybe<Scalars['BigDecimal']['input']>;
  item?: InputMaybe<ItemInput>;
  project?: InputMaybe<ProjectsInput>;
  qty?: InputMaybe<Scalars['Int']['input']>;
  refId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationDisbursementUpsertArgs = {
  ap?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
  checks?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
  expense?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  wtx?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
};


/** Mutation root */
export type MutationEditEmployeeAllowanceArgs = {
  amount?: InputMaybe<Scalars['BigDecimal']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationEditExpenseItemFromProjectsArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  qty?: InputMaybe<Scalars['Int']['input']>;
};


/** Mutation root */
export type MutationEmployeeUpdateStatusArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Mutation root */
export type MutationExpenseItemFromProjectsArgs = {
  cost?: InputMaybe<Scalars['BigDecimal']['input']>;
  it?: InputMaybe<ProjectsInput>;
  item?: InputMaybe<ItemInput>;
  qty?: InputMaybe<Scalars['Int']['input']>;
};


/** Mutation root */
export type MutationGenerateCreditNoteItemTaxByCreditNoteIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  remove?: InputMaybe<Scalars['Boolean']['input']>;
  taxType?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationGenerateCreditNoteTaxArgs = {
  creditNoteId?: InputMaybe<Scalars['UUID']['input']>;
  isApply?: InputMaybe<Scalars['Boolean']['input']>;
  rate?: InputMaybe<Scalars['BigDecimal']['input']>;
  taxType?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationGenerateCreditNoteVatArgs = {
  creditNoteId?: InputMaybe<Scalars['UUID']['input']>;
  isVatable?: InputMaybe<Scalars['Boolean']['input']>;
  vatValue?: InputMaybe<Scalars['BigDecimal']['input']>;
};


/** Mutation root */
export type MutationGenerateDailyAllowancesArgs = {
  payrollEmployeeId?: InputMaybe<Scalars['UUID']['input']>;
  payrollId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationGenerateInvoiceTaxArgs = {
  invoiceId?: InputMaybe<Scalars['UUID']['input']>;
  isApply?: InputMaybe<Scalars['Boolean']['input']>;
  rate?: InputMaybe<Scalars['BigDecimal']['input']>;
  taxType?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationGenerateInvoiceVatArgs = {
  invoiceId?: InputMaybe<Scalars['UUID']['input']>;
  isVatable?: InputMaybe<Scalars['Boolean']['input']>;
  vatValue?: InputMaybe<Scalars['BigDecimal']['input']>;
};


/** Mutation root */
export type MutationIgnoreAttendanceArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationInvoicePostingArgs = {
  entryPosting?: InputMaybe<Scalars['Boolean']['input']>;
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationInvoiceVoidPostingArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationLinkPoItemRecArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  rec?: InputMaybe<ReceivingReportInput>;
};


/** Mutation root */
export type MutationLoanMAddLoanArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
};


/** Mutation root */
export type MutationLoanMPaidLoanArgs = {
  entries?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationLoanMPostEntryArgs = {
  entries?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationLoanMVoidPaidLoanArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationLockBillingArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationLockedOtherProgressArgs = {
  projectId?: InputMaybe<Scalars['UUID']['input']>;
  projectProgressId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationLockedOtherUpdatesArgs = {
  projectId?: InputMaybe<Scalars['UUID']['input']>;
  projectUpdateId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationOnDeleteIntegrationGroupArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationOverrideRecItemsArgs = {
  amount?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  po?: InputMaybe<Scalars['UUID']['input']>;
  toDelete?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
  toInsert?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
};


/** Mutation root */
export type MutationPaymentPostingApprovalArgs = {
  entryPosting?: InputMaybe<Scalars['Boolean']['input']>;
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationPettyCashPostVoidArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Mutation root */
export type MutationPostApArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Mutation root */
export type MutationPostApManualArgs = {
  entries?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
  header?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationPostDmArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Mutation root */
export type MutationPostDManualArgs = {
  entries?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
  header?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationPostDisbursementArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Mutation root */
export type MutationPostDsManualArgs = {
  entries?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
  header?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationPostInventoryGlobalArgs = {
  items?: InputMaybe<LedgerDtoInput>;
};


/** Mutation root */
export type MutationPostInventoryLedgerBegBalanceArgs = {
  it?: InputMaybe<BeginningBalanceInput>;
};


/** Mutation root */
export type MutationPostInventoryLedgerIssuanceArgs = {
  items?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
  parentId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationPostInventoryLedgerMaterialArgs = {
  items?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
  parentId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationPostInventoryLedgerQtyAdjustmentArgs = {
  it?: InputMaybe<QuantityAdjustmentInput>;
};


/** Mutation root */
export type MutationPostInventoryLedgerRecArgs = {
  items?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
  parentId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationPostInventoryLedgerReturnArgs = {
  items?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
  parentId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationPostPettyCashArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Mutation root */
export type MutationPostPettyCashManualArgs = {
  entries?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
  header?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationPostReappManualArgs = {
  entries?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
  header?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationPostReapplicationArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Mutation root */
export type MutationProjectWorkAccomplishToggleLockArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationPushToBillArgs = {
  jobId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationPushToBillProjectArgs = {
  projectId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationQuantityAdjustmentInsertArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
};


/** Mutation root */
export type MutationReapplicationUpsertArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationRecalculateAllPayrollModuleEmployeeArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  module?: InputMaybe<PayrollModule>;
};


/** Mutation root */
export type MutationRecalculateAllWithholdingTaxArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationRecalculateOneDayArgs = {
  employeeId?: InputMaybe<Scalars['UUID']['input']>;
  endDate?: InputMaybe<Scalars['Instant']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  startDate?: InputMaybe<Scalars['Instant']['input']>;
};


/** Mutation root */
export type MutationRecalculateOneWithholdingTaxArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationRecalculatePayrollModuleEmployeeArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  module?: InputMaybe<PayrollModule>;
};


/** Mutation root */
export type MutationRemove2307Args = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationRemoveAccountTemplateItemArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationRemoveApAppArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  parent?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationRemoveApAppListArgs = {
  parent?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationRemoveApDetailsArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationRemoveApLedgerArgs = {
  ref?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationRemoveCheckArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationRemoveCheckListArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationRemoveCreditNoteItemArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationRemoveDmapDetailsArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  parent?: InputMaybe<Scalars['UUID']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationRemoveDetailsDebitMemoArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationRemoveDmDetailsArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  parent?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationRemoveExpenseArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationRemoveExpenseByListArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationRemoveInvoiceItemArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationRemoveItemSupplierArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationRemoveJobItemArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationRemoveMpItemArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationRemoveOthersByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationRemoveOthersByParentArgs = {
  parent?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationRemovePaymentPostingItemArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationRemovePettyCashItemByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationRemovePoItemArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationRemovePrItemArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationRemoveProjectProgressImageArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationRemoveProjectUpdateWorkersArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationRemovePurchaseItemsByParentArgs = {
  parent?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationRemoveRecItemArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationRemoveRecItemNoQueryArgs = {
  rr?: InputMaybe<ReceivingReportItemInput>;
};


/** Mutation root */
export type MutationRemoveRtsItemArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationRemoveServiceItemArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationRemoveStiItemArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationRemoveWtxArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationRemoveWtxListArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationRemovedMaterialArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationRemovedMaterialDirectExpenseArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationResetPasswordArgs = {
  newPassword?: InputMaybe<Scalars['String']['input']>;
  username?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationReverseHeaderArgs = {
  headerId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationReviseProjectCostArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  tag?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationSetCounterArgs = {
  seqName?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['Long']['input']>;
};


/** Mutation root */
export type MutationSetToCompletedArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationSyncAttendanceArgs = {
  employeeAttendanceList?: InputMaybe<Array<InputMaybe<EmployeeAttendanceInput>>>;
};


/** Mutation root */
export type MutationTestPayrollAccountingArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationTransferIntegrationArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpdate2307Args = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  ref?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Mutation root */
export type MutationUpdateApStatusArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationUpdateAllowanceItemAmountArgs = {
  amount?: InputMaybe<Scalars['BigDecimal']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpdateBegBalStatusArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Mutation root */
export type MutationUpdateBilledArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Mutation root */
export type MutationUpdateBillingItemForRevisionsArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  it?: InputMaybe<ProjectCostInput>;
};


/** Mutation root */
export type MutationUpdateCkStatusArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationUpdateContributionTypeStatusArgs = {
  contributionType?: InputMaybe<ContributionTypes>;
  payrollId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpdateCreditNoteTotalsArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpdateDmStatusArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationUpdateEmployeeContributionStatusArgs = {
  contributionType?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpdateInsertParentAccountArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpdateIntegrationItemArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  integrationId?: InputMaybe<Scalars['UUID']['input']>;
  integrationItemId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpdateInvoiceTotalsArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpdateJobAssetStatusArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationUpdateJobBilledArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpdateJobStatusArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationUpdateMpStatusArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Mutation root */
export type MutationUpdateMemoAmountArgs = {
  amount?: InputMaybe<Scalars['BigDecimal']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationUpdateMpItemStatusArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Mutation root */
export type MutationUpdateMultipleCreditNoteItemArgs = {
  fields?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpdatePoStatusArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Mutation root */
export type MutationUpdatePrItemPoArgs = {
  prItem?: InputMaybe<PurchaseRequestItemInput>;
  refPo?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpdatePrStatusArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Mutation root */
export type MutationUpdatePayableForRemoveArgs = {
  amount?: InputMaybe<Scalars['BigDecimal']['input']>;
  discAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewtAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  netAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  vatAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
};


/** Mutation root */
export type MutationUpdatePayrollAdjustmentStatusArgs = {
  payrollId?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<PayrollStatus>;
};


/** Mutation root */
export type MutationUpdatePayrollAllowanceStatusArgs = {
  payrollId?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<PayrollStatus>;
};


/** Mutation root */
export type MutationUpdatePayrollContributionStatusArgs = {
  payrollId?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<PayrollStatus>;
};


/** Mutation root */
export type MutationUpdatePayrollDetailsArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpdatePayrollEmployeeAdjustmentStatusArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<PayrollEmployeeStatus>;
};


/** Mutation root */
export type MutationUpdatePayrollEmployeeAllowanceStatusArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<PayrollEmployeeStatus>;
};


/** Mutation root */
export type MutationUpdatePayrollEmployeeContributionStatusArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<PayrollEmployeeStatus>;
};


/** Mutation root */
export type MutationUpdatePayrollEmployeeLoanStatusArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<PayrollEmployeeStatus>;
};


/** Mutation root */
export type MutationUpdatePayrollEmployeeOtherDeductionStatusArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<PayrollEmployeeStatus>;
};


/** Mutation root */
export type MutationUpdatePayrollEmployeeStatusArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<PayrollEmployeeStatus>;
};


/** Mutation root */
export type MutationUpdatePayrollLoanItemAmountArgs = {
  amount?: InputMaybe<Scalars['BigDecimal']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpdatePayrollLoanStatusArgs = {
  payrollId?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<PayrollStatus>;
};


/** Mutation root */
export type MutationUpdatePayrollModuleEmployeeStatusArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  module?: InputMaybe<PayrollModule>;
  status?: InputMaybe<PayrollEmployeeStatus>;
};


/** Mutation root */
export type MutationUpdatePayrollOtherDeductionStatusArgs = {
  payrollId?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<PayrollStatus>;
};


/** Mutation root */
export type MutationUpdatePayrollStatusArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationUpdatePercentArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  percent?: InputMaybe<Scalars['BigDecimal']['input']>;
};


/** Mutation root */
export type MutationUpdatePettyCashStatusArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationUpdatePricesArgs = {
  el?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  value?: InputMaybe<Scalars['BigDecimal']['input']>;
};


/** Mutation root */
export type MutationUpdateQtyAdjStatusArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Mutation root */
export type MutationUpdateRecStatusArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Mutation root */
export type MutationUpdateRpStatusArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationUpdateRtsStatusArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Mutation root */
export type MutationUpdateReOrderQtyArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  value?: InputMaybe<Scalars['Int']['input']>;
};


/** Mutation root */
export type MutationUpdateReapplyArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  items?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
};


/** Mutation root */
export type MutationUpdateRecItemStatusArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Mutation root */
export type MutationUpdateReorderArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  qty?: InputMaybe<Scalars['Int']['input']>;
};


/** Mutation root */
export type MutationUpdateRtsItemStatusArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Mutation root */
export type MutationUpdateStiStatusArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Mutation root */
export type MutationUpdateSalaryRateMultiplierArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
};


/** Mutation root */
export type MutationUpdateStatusCostArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpdateStiItemStatusArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Mutation root */
export type MutationUpdateTimekeepingEmployeeStatusArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<PayrollEmployeeStatus>;
};


/** Mutation root */
export type MutationUpdateTimekeepingStatusArgs = {
  payrollId?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<PayrollStatus>;
};


/** Mutation root */
export type MutationUpsert2307Args = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  supplier?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertAccountTemplateItemArgs = {
  entries?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertAddressArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationUpsertAdjustmentCategoryArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertAdjustmentItemArgs = {
  amount?: InputMaybe<Scalars['BigDecimal']['input']>;
  category?: InputMaybe<Scalars['UUID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  employee?: InputMaybe<Scalars['UUID']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  subaccountCode?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationUpsertAllAllowanceItemArgs = {
  allowanceList?: InputMaybe<Array<InputMaybe<AllowanceInput>>>;
  allowancePackage?: InputMaybe<Scalars['UUID']['input']>;
  toDelete?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>;
};


/** Mutation root */
export type MutationUpsertAllowanceItemArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertAllowancePackageArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertAllowanceTypeArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertApAccountsTemplateArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertApLedgerArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  supplier?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertApTransactionArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertAssetArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertAssetMaintenanceTypeArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertAssetPreventiveMaintenanceArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertAssetRepairMaintenanceArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertAssetRepairMaintenanceItemArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertBanksArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertBegQtyArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  qty?: InputMaybe<Scalars['Int']['input']>;
};


/** Mutation root */
export type MutationUpsertBillingItemByJobArgs = {
  billing?: InputMaybe<BillingInput>;
  it?: InputMaybe<JobItemsInput>;
  recordNo?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationUpsertBillingItemByMiscArgs = {
  billing?: InputMaybe<BillingInput>;
  desc?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['BigDecimal']['input']>;
};


/** Mutation root */
export type MutationUpsertBillingItemByProjectArgs = {
  billing?: InputMaybe<BillingInput>;
  it?: InputMaybe<ProjectCostInput>;
};


/** Mutation root */
export type MutationUpsertChargeInvoiceArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertCheckArgs = {
  it?: InputMaybe<DisbursementDtoInput>;
  parent?: InputMaybe<DisbursementInput>;
};


/** Mutation root */
export type MutationUpsertCompanyArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertConsolidatedArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  items?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
  supplier?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertCreditNoteItemArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertCustomerArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertDmArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  items?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
};


/** Mutation root */
export type MutationUpsertDebitMemoArgs = {
  details?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  items?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
};


/** Mutation root */
export type MutationUpsertDisApArgs = {
  it?: InputMaybe<DisbursementApDtoInput>;
  parent?: InputMaybe<DisbursementInput>;
};


/** Mutation root */
export type MutationUpsertDisDmArgs = {
  it?: InputMaybe<DisbursementApDtoInput>;
  parent?: InputMaybe<DebitMemoInput>;
};


/** Mutation root */
export type MutationUpsertDisReapArgs = {
  it?: InputMaybe<DisbursementApDtoInput>;
  parent?: InputMaybe<ReapplicationInput>;
};


/** Mutation root */
export type MutationUpsertDmDetialsArgs = {
  it?: InputMaybe<DmDetailsDtoInput>;
  parent?: InputMaybe<DebitMemoInput>;
};


/** Mutation root */
export type MutationUpsertEmployeeArgs = {
  authorities?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  company?: InputMaybe<Scalars['UUID']['input']>;
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  officeId?: InputMaybe<Scalars['UUID']['input']>;
  permissions?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  position?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertEmployeeAllowancesArgs = {
  allowancePackageId?: InputMaybe<Scalars['UUID']['input']>;
  employeeId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertEmployeeAttendanceArgs = {
  employee?: InputMaybe<Scalars['UUID']['input']>;
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  project_id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertEmployeeLeaveArgs = {
  dates?: InputMaybe<Array<InputMaybe<SelectedDateInput>>>;
  employeeId?: InputMaybe<Scalars['UUID']['input']>;
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertEmployeeLoanArgs = {
  amount?: InputMaybe<Scalars['BigDecimal']['input']>;
  category?: InputMaybe<EmployeeLoanCategory>;
  description?: InputMaybe<Scalars['String']['input']>;
  employeeId?: InputMaybe<Scalars['UUID']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertEmployeeLoanConfigArgs = {
  config?: InputMaybe<EmployeeLoanConfigInput>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertEmployeeScheduleArgs = {
  dates?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  employeeId?: InputMaybe<Scalars['UUID']['input']>;
  employeeIdList?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>;
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  isOverTime?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Mutation root */
export type MutationUpsertEventCalendarArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertExTransTypeArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertExpArgs = {
  it?: InputMaybe<DisbursementExpDtoInput>;
  parent?: InputMaybe<DisbursementInput>;
};


/** Mutation root */
export type MutationUpsertFiscalArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertFixedAssetItemsArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertGenericsArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertGroupPolicyArgs = {
  deletedPermissions?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  permissions?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** Mutation root */
export type MutationUpsertHdmfContributionArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertInsuranceArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertIntegrationArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertIntegrationGroupArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertItemArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertItemCategoryArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertItemGroupArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertItemSubAccountArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertJobArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertJobItemArgs = {
  dto?: InputMaybe<JobItemsDtoInput>;
  item?: InputMaybe<Scalars['UUID']['input']>;
  job?: InputMaybe<JobInput>;
};


/** Mutation root */
export type MutationUpsertJobItemFormBillingArgs = {
  cost?: InputMaybe<Scalars['BigDecimal']['input']>;
  descriptions?: InputMaybe<Scalars['String']['input']>;
  item?: InputMaybe<Scalars['UUID']['input']>;
  job?: InputMaybe<JobInput>;
  outputTax?: InputMaybe<Scalars['BigDecimal']['input']>;
  qty?: InputMaybe<Scalars['Int']['input']>;
  serviceCategory?: InputMaybe<Scalars['UUID']['input']>;
  subTotal?: InputMaybe<Scalars['BigDecimal']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  wcost?: InputMaybe<Scalars['BigDecimal']['input']>;
};


/** Mutation root */
export type MutationUpsertJobItemsByParentArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  items?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
};


/** Mutation root */
export type MutationUpsertJobOrderArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertJobOrderItemsArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  items?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
};


/** Mutation root */
export type MutationUpsertJobStatusArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertMpArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  items?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
};


/** Mutation root */
export type MutationUpsertMpAssetRepairMaintenanceItemArgs = {
  items?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
};


/** Mutation root */
export type MutationUpsertManyMaterialsArgs = {
  items?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
  projectId?: InputMaybe<Scalars['UUID']['input']>;
  projectUpdatesId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertMpItemArgs = {
  dto?: InputMaybe<PurchaseMpDtoInput>;
  item?: InputMaybe<ItemInput>;
  mp?: InputMaybe<MaterialProductionInput>;
};


/** Mutation root */
export type MutationUpsertMultiFixedAssetItemsArgs = {
  fields?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
};


/** Mutation root */
export type MutationUpsertOfficeArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertOfficeItemArgs = {
  assign?: InputMaybe<Scalars['Boolean']['input']>;
  depId?: InputMaybe<Scalars['UUID']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  itemId?: InputMaybe<Scalars['UUID']['input']>;
  trade?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Mutation root */
export type MutationUpsertOtherDeductionItemArgs = {
  amount?: InputMaybe<Scalars['BigDecimal']['input']>;
  deductionType?: InputMaybe<Scalars['UUID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  employee?: InputMaybe<Scalars['UUID']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  subaccountCode?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationUpsertOtherDeductionTypeArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
  subaccountCode?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationUpsertOthersArgs = {
  it?: InputMaybe<PcvOthersDtoInput>;
  parent?: InputMaybe<PettyCashAccountingInput>;
};


/** Mutation root */
export type MutationUpsertPhicContributionArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertPoArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  forRemove?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  items?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
};


/** Mutation root */
export type MutationUpsertPoItemArgs = {
  dto?: InputMaybe<PurchasePoDtoInput>;
  item?: InputMaybe<ItemInput>;
  pr?: InputMaybe<PurchaseOrderInput>;
};


/** Mutation root */
export type MutationUpsertPoMonitoringArgs = {
  fields?: InputMaybe<PoMonitoringDtoInput>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertPrArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  items?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
};


/** Mutation root */
export type MutationUpsertPrItemArgs = {
  dto?: InputMaybe<PurchaseDtoInput>;
  item?: InputMaybe<ItemInput>;
  pr?: InputMaybe<PurchaseRequestInput>;
};


/** Mutation root */
export type MutationUpsertPayablesArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  items?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
};


/** Mutation root */
export type MutationUpsertPayablesByRecArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertPayablesDetailsArgs = {
  ap?: InputMaybe<AccountsPayableInput>;
  it?: InputMaybe<AccountPayableDetialsDtoInput>;
  office?: InputMaybe<Scalars['UUID']['input']>;
  project?: InputMaybe<Scalars['UUID']['input']>;
  trans?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertPayablesDetailsByRecArgs = {
  ap?: InputMaybe<AccountsPayableInput>;
  it?: InputMaybe<ReceivingReportInput>;
};


/** Mutation root */
export type MutationUpsertPaymentTermsArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertPayrollArgs = {
  employeeList?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>;
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertPayrollAllowanceItemArgs = {
  allowanceId?: InputMaybe<Scalars['UUID']['input']>;
  amount?: InputMaybe<Scalars['BigDecimal']['input']>;
  employeeId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertPettyCashArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertPettyCashAccountingArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  items?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
  others?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
};


/** Mutation root */
export type MutationUpsertPettyTypeArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertPositionArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertProjectArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertProjectCostArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertProjectMaterialsArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertProjectProgressArgs = {
  date?: InputMaybe<Scalars['String']['input']>;
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertProjectRevCostArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  projectCost?: InputMaybe<ProjectCostInput>;
  tag?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationUpsertProjectUpdatesArgs = {
  date?: InputMaybe<Scalars['String']['input']>;
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertProjectUpdatesWorkersArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  position?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationUpsertProjectWorkAccomplishArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  itemFields?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
};


/** Mutation root */
export type MutationUpsertPurchaseItemsArgs = {
  it?: InputMaybe<PcvItemsDtoInput>;
  parent?: InputMaybe<PettyCashAccountingInput>;
};


/** Mutation root */
export type MutationUpsertQtyArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  qty?: InputMaybe<Scalars['Int']['input']>;
};


/** Mutation root */
export type MutationUpsertQuantityAdjustmentTypeArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertRtsArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  items?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
};


/** Mutation root */
export type MutationUpsertReapplicationArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertRecArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  items?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
};


/** Mutation root */
export type MutationUpsertRecItemArgs = {
  dto?: InputMaybe<PurchaseRecDtoInput>;
  item?: InputMaybe<ItemInput>;
  refPoItem?: InputMaybe<PurchaseOrderItemsInput>;
  rr?: InputMaybe<ReceivingReportInput>;
};


/** Mutation root */
export type MutationUpsertReleaseCheckArgs = {
  date?: InputMaybe<Scalars['Instant']['input']>;
  fields?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertRepairTypeArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertRtsItemArgs = {
  dto?: InputMaybe<PurchaseRtsDtoInput>;
  item?: InputMaybe<ItemInput>;
  pr?: InputMaybe<ReturnSupplierInput>;
};


/** Mutation root */
export type MutationUpsertSssContributionArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertStiArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  items?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
};


/** Mutation root */
export type MutationUpsertScheduleLockArgs = {
  fields: Scalars['Map_String_ObjectScalar']['input'];
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertScheduleTypeArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertServiceArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertServiceCategoryArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertServiceItemArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  items?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
};


/** Mutation root */
export type MutationUpsertSignatureArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertStiItemArgs = {
  dto?: InputMaybe<PurchaseIssuanceDtoInput>;
  item?: InputMaybe<ItemInput>;
  pr?: InputMaybe<StockIssueInput>;
};


/** Mutation root */
export type MutationUpsertSubAccountArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertSupplierArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertSupplierItemArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  itemId?: InputMaybe<Scalars['UUID']['input']>;
  supId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertSupplierTypeArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertTableArPaymentPostingArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertTableArPaymentPostingItemArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertTransTypeArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertUnitMeasurementArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertVehicleUsageDocsArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertVehicleUsageMonitoringArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertWithholdingTaxMatrixArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertWtxArgs = {
  it?: InputMaybe<DisbursementWtxDtoInput>;
  parent?: InputMaybe<DisbursementInput>;
};


/** Mutation root */
export type MutationVoidLedgerByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationVoidLedgerByRefArgs = {
  ref?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationVoidLedgerByRefExpenseArgs = {
  ref?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationVoidOrArgs = {
  paymentId?: InputMaybe<Scalars['UUID']['input']>;
};

export enum NormalSide {
  Credit = 'CREDIT',
  Debit = 'DEBIT'
}

export type Notification = {
  __typename?: 'Notification';
  date_notified_string?: Maybe<Scalars['String']['output']>;
  date_seen?: Maybe<Scalars['Instant']['output']>;
  datenotified?: Maybe<Scalars['Instant']['output']>;
  department?: Maybe<Scalars['UUID']['output']>;
  from?: Maybe<Scalars['UUID']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  message?: Maybe<Scalars['String']['output']>;
  title?: Maybe<Scalars['String']['output']>;
  to?: Maybe<Scalars['UUID']['output']>;
  url?: Maybe<Scalars['String']['output']>;
};

export enum NullHandling {
  Native = 'NATIVE',
  NullsFirst = 'NULLS_FIRST',
  NullsLast = 'NULLS_LAST'
}

export type Office = {
  __typename?: 'Office';
  cityId?: Maybe<Scalars['UUID']['output']>;
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  emailAdd?: Maybe<Scalars['String']['output']>;
  fullAddress?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  officeBarangay?: Maybe<Scalars['String']['output']>;
  officeCode?: Maybe<Scalars['String']['output']>;
  officeCountry?: Maybe<Scalars['String']['output']>;
  officeDescription?: Maybe<Scalars['String']['output']>;
  officeMunicipality?: Maybe<Scalars['String']['output']>;
  officeProvince?: Maybe<Scalars['String']['output']>;
  officeSecretary?: Maybe<Scalars['String']['output']>;
  officeStreet?: Maybe<Scalars['String']['output']>;
  officeType?: Maybe<Scalars['String']['output']>;
  officeZipcode?: Maybe<Scalars['String']['output']>;
  phoneNo?: Maybe<Scalars['String']['output']>;
  provinceId?: Maybe<Scalars['UUID']['output']>;
  status?: Maybe<Scalars['Boolean']['output']>;
  telNo?: Maybe<Scalars['String']['output']>;
  tinNumber?: Maybe<Scalars['String']['output']>;
};

export type OfficeInput = {
  cityId?: InputMaybe<Scalars['UUID']['input']>;
  company?: InputMaybe<CompanySettingsInput>;
  createdDate?: InputMaybe<Scalars['Instant']['input']>;
  emailAdd?: InputMaybe<Scalars['String']['input']>;
  fullAddress?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  officeBarangay?: InputMaybe<Scalars['String']['input']>;
  officeCode?: InputMaybe<Scalars['String']['input']>;
  officeCountry?: InputMaybe<Scalars['String']['input']>;
  officeDescription?: InputMaybe<Scalars['String']['input']>;
  officeMunicipality?: InputMaybe<Scalars['String']['input']>;
  officeProvince?: InputMaybe<Scalars['String']['input']>;
  officeSecretary?: InputMaybe<Scalars['String']['input']>;
  officeStreet?: InputMaybe<Scalars['String']['input']>;
  officeType?: InputMaybe<Scalars['String']['input']>;
  officeZipcode?: InputMaybe<Scalars['String']['input']>;
  phoneNo?: InputMaybe<Scalars['String']['input']>;
  provinceId?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
  telNo?: InputMaybe<Scalars['String']['input']>;
  tinNumber?: InputMaybe<Scalars['String']['input']>;
};

export type OfficeItem = {
  __typename?: 'OfficeItem';
  actualCost?: Maybe<Scalars['BigDecimal']['output']>;
  allow_trade?: Maybe<Scalars['Boolean']['output']>;
  company?: Maybe<Scalars['UUID']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  is_assign?: Maybe<Scalars['Boolean']['output']>;
  item?: Maybe<Item>;
  office?: Maybe<Office>;
  outputTax?: Maybe<Scalars['BigDecimal']['output']>;
  reorder_quantity?: Maybe<Scalars['Int']['output']>;
  sellingPrice?: Maybe<Scalars['BigDecimal']['output']>;
};

export type OnHandReport = {
  __typename?: 'OnHandReport';
  category_description?: Maybe<Scalars['String']['output']>;
  department?: Maybe<Scalars['UUID']['output']>;
  department_name?: Maybe<Scalars['String']['output']>;
  desc_long?: Maybe<Scalars['String']['output']>;
  expiration_date?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  item?: Maybe<Scalars['UUID']['output']>;
  last_unit_cost?: Maybe<Scalars['BigDecimal']['output']>;
  last_wcost?: Maybe<Scalars['BigDecimal']['output']>;
  onhand?: Maybe<Scalars['Int']['output']>;
  unit_of_purchase?: Maybe<Scalars['String']['output']>;
  unit_of_usage?: Maybe<Scalars['String']['output']>;
};

export type OptionDto = {
  __typename?: 'OptionDto';
  label?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['String']['output']>;
};

export type Order = {
  __typename?: 'Order';
  direction?: Maybe<Direction>;
  ignoreCase?: Maybe<Scalars['Boolean']['output']>;
  nullHandlingHint?: Maybe<NullHandling>;
  property: Scalars['String']['output'];
};

export type OtherDeductionTypes = {
  __typename?: 'OtherDeductionTypes';
  code?: Maybe<Scalars['String']['output']>;
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['Boolean']['output']>;
  subaccountCode?: Maybe<Scalars['String']['output']>;
};

export type PcvItemsDtoInput = {
  discAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  discRate?: InputMaybe<Scalars['BigDecimal']['input']>;
  expirationDate?: InputMaybe<Scalars['String']['input']>;
  grossAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  inventoryCost?: InputMaybe<Scalars['BigDecimal']['input']>;
  isNew?: InputMaybe<Scalars['Boolean']['input']>;
  isPosted?: InputMaybe<Scalars['Boolean']['input']>;
  isVat?: InputMaybe<Scalars['Boolean']['input']>;
  item?: InputMaybe<ItemInput>;
  lotNo?: InputMaybe<Scalars['String']['input']>;
  netAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  netDiscount?: InputMaybe<Scalars['BigDecimal']['input']>;
  office?: InputMaybe<OfficeInput>;
  qty?: InputMaybe<Scalars['Int']['input']>;
  unitCost?: InputMaybe<Scalars['BigDecimal']['input']>;
  vatAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
};

export type PcvOthersDtoInput = {
  amount?: InputMaybe<Scalars['BigDecimal']['input']>;
  id?: InputMaybe<Scalars['String']['input']>;
  isNew?: InputMaybe<Scalars['Boolean']['input']>;
  office?: InputMaybe<OfficeInput>;
  project?: InputMaybe<ProjectsInput>;
  remarks?: InputMaybe<Scalars['String']['input']>;
  transType?: InputMaybe<ExpenseTransactionInput>;
};

export type PhicContribution = {
  __typename?: 'PHICContribution';
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  eeRate?: Maybe<Scalars['BigDecimal']['output']>;
  erRate?: Maybe<Scalars['BigDecimal']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  maxAmount?: Maybe<Scalars['BigDecimal']['output']>;
  minAmount?: Maybe<Scalars['BigDecimal']['output']>;
  premiumRate?: Maybe<Scalars['BigDecimal']['output']>;
};

export type PoDeliveryMonitoring = {
  __typename?: 'PODeliveryMonitoring';
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  purchaseOrderItem?: Maybe<PurchaseOrderItems>;
  quantity?: Maybe<Scalars['Int']['output']>;
  receivingReport?: Maybe<ReceivingReport>;
  receivingReportItem?: Maybe<ReceivingReportItem>;
  status?: Maybe<Scalars['String']['output']>;
};

export type PoMonitoringDtoInput = {
  purchaseOrderItem?: InputMaybe<Scalars['UUID']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  receivingReport?: InputMaybe<Scalars['UUID']['input']>;
  receivingReportItem?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};

export type Page_ArPaymentPosting = {
  __typename?: 'Page_ARPaymentPosting';
  content?: Maybe<Array<Maybe<ArPaymentPosting>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_AccountsPayable = {
  __typename?: 'Page_AccountsPayable';
  content?: Maybe<Array<Maybe<AccountsPayable>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_Allowance = {
  __typename?: 'Page_Allowance';
  content?: Maybe<Array<Maybe<Allowance>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_AllowanceItem = {
  __typename?: 'Page_AllowanceItem';
  content?: Maybe<Array<Maybe<AllowanceItem>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_AllowancePackage = {
  __typename?: 'Page_AllowancePackage';
  content?: Maybe<Array<Maybe<AllowancePackage>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_ApAccountsTemplate = {
  __typename?: 'Page_ApAccountsTemplate';
  content?: Maybe<Array<Maybe<ApAccountsTemplate>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_ApTransaction = {
  __typename?: 'Page_ApTransaction';
  content?: Maybe<Array<Maybe<ApTransaction>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_ArCreditNote = {
  __typename?: 'Page_ArCreditNote';
  content?: Maybe<Array<Maybe<ArCreditNote>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_ArCreditNoteItems = {
  __typename?: 'Page_ArCreditNoteItems';
  content?: Maybe<Array<Maybe<ArCreditNoteItems>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_ArCustomers = {
  __typename?: 'Page_ArCustomers';
  content?: Maybe<Array<Maybe<ArCustomers>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_ArInvoice = {
  __typename?: 'Page_ArInvoice';
  content?: Maybe<Array<Maybe<ArInvoice>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_ArInvoiceItems = {
  __typename?: 'Page_ArInvoiceItems';
  content?: Maybe<Array<Maybe<ArInvoiceItems>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_ArInvoiceParticulars = {
  __typename?: 'Page_ArInvoiceParticulars';
  content?: Maybe<Array<Maybe<ArInvoiceParticulars>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_ArTransactionLedger = {
  __typename?: 'Page_ArTransactionLedger';
  content?: Maybe<Array<Maybe<ArTransactionLedger>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_AssetMaintenanceTypes = {
  __typename?: 'Page_AssetMaintenanceTypes';
  content?: Maybe<Array<Maybe<AssetMaintenanceTypes>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_AssetPreventiveMaintenance = {
  __typename?: 'Page_AssetPreventiveMaintenance';
  content?: Maybe<Array<Maybe<AssetPreventiveMaintenance>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_AssetRepairMaintenance = {
  __typename?: 'Page_AssetRepairMaintenance';
  content?: Maybe<Array<Maybe<AssetRepairMaintenance>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_AssetRepairMaintenanceItems = {
  __typename?: 'Page_AssetRepairMaintenanceItems';
  content?: Maybe<Array<Maybe<AssetRepairMaintenanceItems>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_AssetUpcomingPreventiveMaintenance = {
  __typename?: 'Page_AssetUpcomingPreventiveMaintenance';
  content?: Maybe<Array<Maybe<AssetUpcomingPreventiveMaintenance>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_Assets = {
  __typename?: 'Page_Assets';
  content?: Maybe<Array<Maybe<Assets>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_Bank = {
  __typename?: 'Page_Bank';
  content?: Maybe<Array<Maybe<Bank>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_Billing = {
  __typename?: 'Page_Billing';
  content?: Maybe<Array<Maybe<Billing>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_CompanySettings = {
  __typename?: 'Page_CompanySettings';
  content?: Maybe<Array<Maybe<CompanySettings>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_DebitMemo = {
  __typename?: 'Page_DebitMemo';
  content?: Maybe<Array<Maybe<DebitMemo>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_Disbursement = {
  __typename?: 'Page_Disbursement';
  content?: Maybe<Array<Maybe<Disbursement>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_DisbursementCheck = {
  __typename?: 'Page_DisbursementCheck';
  content?: Maybe<Array<Maybe<DisbursementCheck>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_EmployeeAttendance = {
  __typename?: 'Page_EmployeeAttendance';
  content?: Maybe<Array<Maybe<EmployeeAttendance>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_EmployeeLeaveDto = {
  __typename?: 'Page_EmployeeLeaveDto';
  content?: Maybe<Array<Maybe<EmployeeLeaveDto>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_EmployeeLoan = {
  __typename?: 'Page_EmployeeLoan';
  content?: Maybe<Array<Maybe<EmployeeLoan>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_EmployeeLoanLedgerDto = {
  __typename?: 'Page_EmployeeLoanLedgerDto';
  content?: Maybe<Array<Maybe<EmployeeLoanLedgerDto>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_Fiscal = {
  __typename?: 'Page_Fiscal';
  content?: Maybe<Array<Maybe<Fiscal>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_FixedAssetItems = {
  __typename?: 'Page_FixedAssetItems';
  content?: Maybe<Array<Maybe<FixedAssetItems>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_HeaderLedger = {
  __typename?: 'Page_HeaderLedger';
  content?: Maybe<Array<Maybe<HeaderLedger>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_Integration = {
  __typename?: 'Page_Integration';
  content?: Maybe<Array<Maybe<Integration>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_IntegrationItem = {
  __typename?: 'Page_IntegrationItem';
  content?: Maybe<Array<Maybe<IntegrationItem>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_Inventory = {
  __typename?: 'Page_Inventory';
  content?: Maybe<Array<Maybe<Inventory>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_Item = {
  __typename?: 'Page_Item';
  content?: Maybe<Array<Maybe<Item>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_Job = {
  __typename?: 'Page_Job';
  content?: Maybe<Array<Maybe<Job>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_JobOrder = {
  __typename?: 'Page_JobOrder';
  content?: Maybe<Array<Maybe<JobOrder>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_Ledger = {
  __typename?: 'Page_Ledger';
  content?: Maybe<Array<Maybe<Ledger>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_Loan = {
  __typename?: 'Page_Loan';
  content?: Maybe<Array<Maybe<Loan>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_LoanAmortization = {
  __typename?: 'Page_LoanAmortization';
  content?: Maybe<Array<Maybe<LoanAmortization>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_MaterialProduction = {
  __typename?: 'Page_MaterialProduction';
  content?: Maybe<Array<Maybe<MaterialProduction>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_Office = {
  __typename?: 'Page_Office';
  content?: Maybe<Array<Maybe<Office>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_OtherDeductionTypes = {
  __typename?: 'Page_OtherDeductionTypes';
  content?: Maybe<Array<Maybe<OtherDeductionTypes>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_ParentAccount = {
  __typename?: 'Page_ParentAccount';
  content?: Maybe<Array<Maybe<ParentAccount>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_Payroll = {
  __typename?: 'Page_Payroll';
  content?: Maybe<Array<Maybe<Payroll>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_PayrollEmployeeAdjustmentDto = {
  __typename?: 'Page_PayrollEmployeeAdjustmentDto';
  content?: Maybe<Array<Maybe<PayrollEmployeeAdjustmentDto>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_PayrollEmployeeAllowanceDto = {
  __typename?: 'Page_PayrollEmployeeAllowanceDto';
  content?: Maybe<Array<Maybe<PayrollEmployeeAllowanceDto>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_PayrollEmployeeContributionDto = {
  __typename?: 'Page_PayrollEmployeeContributionDto';
  content?: Maybe<Array<Maybe<PayrollEmployeeContributionDto>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_PayrollEmployeeLoanDto = {
  __typename?: 'Page_PayrollEmployeeLoanDto';
  content?: Maybe<Array<Maybe<PayrollEmployeeLoanDto>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_PayrollEmployeeOtherDeductionDto = {
  __typename?: 'Page_PayrollEmployeeOtherDeductionDto';
  content?: Maybe<Array<Maybe<PayrollEmployeeOtherDeductionDto>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_PettyCashAccounting = {
  __typename?: 'Page_PettyCashAccounting';
  content?: Maybe<Array<Maybe<PettyCashAccounting>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_Position = {
  __typename?: 'Page_Position';
  content?: Maybe<Array<Maybe<Position>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_ProjectProgress = {
  __typename?: 'Page_ProjectProgress';
  content?: Maybe<Array<Maybe<ProjectProgress>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_ProjectUpdates = {
  __typename?: 'Page_ProjectUpdates';
  content?: Maybe<Array<Maybe<ProjectUpdates>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_ProjectUpdatesMaterials = {
  __typename?: 'Page_ProjectUpdatesMaterials';
  content?: Maybe<Array<Maybe<ProjectUpdatesMaterials>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_Projects = {
  __typename?: 'Page_Projects';
  content?: Maybe<Array<Maybe<Projects>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_PurchaseOrder = {
  __typename?: 'Page_PurchaseOrder';
  content?: Maybe<Array<Maybe<PurchaseOrder>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_PurchaseRequest = {
  __typename?: 'Page_PurchaseRequest';
  content?: Maybe<Array<Maybe<PurchaseRequest>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_Reapplication = {
  __typename?: 'Page_Reapplication';
  content?: Maybe<Array<Maybe<Reapplication>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_ReceivingReport = {
  __typename?: 'Page_ReceivingReport';
  content?: Maybe<Array<Maybe<ReceivingReport>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_ReleaseCheck = {
  __typename?: 'Page_ReleaseCheck';
  content?: Maybe<Array<Maybe<ReleaseCheck>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_ReturnSupplier = {
  __typename?: 'Page_ReturnSupplier';
  content?: Maybe<Array<Maybe<ReturnSupplier>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_ServiceManagement = {
  __typename?: 'Page_ServiceManagement';
  content?: Maybe<Array<Maybe<ServiceManagement>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_StockIssue = {
  __typename?: 'Page_StockIssue';
  content?: Maybe<Array<Maybe<StockIssue>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_Supplier = {
  __typename?: 'Page_Supplier';
  content?: Maybe<Array<Maybe<Supplier>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_SupplierInventory = {
  __typename?: 'Page_SupplierInventory';
  content?: Maybe<Array<Maybe<SupplierInventory>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_TransactionJournalDto = {
  __typename?: 'Page_TransactionJournalDto';
  content?: Maybe<Array<Maybe<TransactionJournalDto>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_VehicleUsageDocs = {
  __typename?: 'Page_VehicleUsageDocs';
  content?: Maybe<Array<Maybe<VehicleUsageDocs>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_VehicleUsageMonitoring = {
  __typename?: 'Page_VehicleUsageMonitoring';
  content?: Maybe<Array<Maybe<VehicleUsageMonitoring>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_Wtx2307 = {
  __typename?: 'Page_Wtx2307';
  content?: Maybe<Array<Maybe<Wtx2307>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Page_Wtx2307Consolidated = {
  __typename?: 'Page_Wtx2307Consolidated';
  content?: Maybe<Array<Maybe<Wtx2307Consolidated>>>;
  first: Scalars['Boolean']['output'];
  hasContent: Scalars['Boolean']['output'];
  hasNext: Scalars['Boolean']['output'];
  hasPrevious: Scalars['Boolean']['output'];
  last: Scalars['Boolean']['output'];
  nextPageable?: Maybe<Pagination>;
  number: Scalars['Int']['output'];
  numberOfElements: Scalars['Int']['output'];
  pageable?: Maybe<Pagination>;
  previousPageable?: Maybe<Pagination>;
  size: Scalars['Int']['output'];
  sort?: Maybe<Sorting>;
  totalElements: Scalars['Long']['output'];
  totalPages: Scalars['Int']['output'];
};

export type Pagination = {
  __typename?: 'Pagination';
  pageNumber: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  sort?: Maybe<Sort>;
};

export type ParentAccount = {
  __typename?: 'ParentAccount';
  accountCategory?: Maybe<AccountCategory>;
  accountCode?: Maybe<Scalars['String']['output']>;
  accountName?: Maybe<Scalars['String']['output']>;
  accountTrace?: Maybe<Scalars['String']['output']>;
  accountType?: Maybe<AccountType>;
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  dateCreated?: Maybe<Scalars['Instant']['output']>;
  deprecated?: Maybe<Scalars['Boolean']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isContra?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  normalSide?: Maybe<NormalSide>;
};

export type Payment = {
  __typename?: 'Payment';
  additionalPaidInCapital?: Maybe<Scalars['BigDecimal']['output']>;
  advancesFromInvestors?: Maybe<Scalars['BigDecimal']['output']>;
  advancesFromPatients?: Maybe<Scalars['BigDecimal']['output']>;
  amountForCashDeposit?: Maybe<Scalars['BigDecimal']['output']>;
  amountForCreditCard?: Maybe<Scalars['BigDecimal']['output']>;
  arCustomerId?: Maybe<Scalars['UUID']['output']>;
  bankForCashDeposit?: Maybe<Bank>;
  bankForCreditCard?: Maybe<Bank>;
  billing?: Maybe<Billing>;
  billingItem?: Maybe<BillingItem>;
  cashierTerminal?: Maybe<Terminal>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  details?: Maybe<Scalars['Map_String_StringScalar']['output']>;
  discountOnShareCapital?: Maybe<Scalars['BigDecimal']['output']>;
  domain?: Maybe<Scalars['String']['output']>;
  erPayments?: Maybe<Scalars['BigDecimal']['output']>;
  flagValue?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  inWords?: Maybe<Scalars['String']['output']>;
  investorNo?: Maybe<Scalars['String']['output']>;
  ipdPayments?: Maybe<Scalars['BigDecimal']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  opdPayments?: Maybe<Scalars['BigDecimal']['output']>;
  orNumber?: Maybe<Scalars['String']['output']>;
  otcPayments?: Maybe<Scalars['BigDecimal']['output']>;
  payableToInvestor?: Maybe<Scalars['BigDecimal']['output']>;
  paymentDetails?: Maybe<Array<Maybe<PaymentDetial>>>;
  paymentTargets?: Maybe<Array<Maybe<PaymentTarget>>>;
  payorName?: Maybe<Scalars['String']['output']>;
  pfPaymentsAll?: Maybe<Scalars['BigDecimal']['output']>;
  postedLedgerId?: Maybe<Scalars['UUID']['output']>;
  receiptType?: Maybe<Scalars['String']['output']>;
  remarks?: Maybe<Scalars['String']['output']>;
  shareCapital?: Maybe<Scalars['BigDecimal']['output']>;
  shift?: Maybe<Shift>;
  subscribedShareCapital?: Maybe<Scalars['BigDecimal']['output']>;
  subscriptionReceivable?: Maybe<Scalars['BigDecimal']['output']>;
  totalCard?: Maybe<Scalars['BigDecimal']['output']>;
  totalCash?: Maybe<Scalars['BigDecimal']['output']>;
  totalCheck?: Maybe<Scalars['BigDecimal']['output']>;
  totalDeposit?: Maybe<Scalars['BigDecimal']['output']>;
  totalEWallet?: Maybe<Scalars['BigDecimal']['output']>;
  totalPayments?: Maybe<Scalars['BigDecimal']['output']>;
  voidBy?: Maybe<Scalars['String']['output']>;
  voidDate?: Maybe<Scalars['Instant']['output']>;
  voided?: Maybe<Scalars['Boolean']['output']>;
};

export type PaymentDetial = {
  __typename?: 'PaymentDetial';
  amount?: Maybe<Scalars['BigDecimal']['output']>;
  approvalCode?: Maybe<Scalars['String']['output']>;
  bank?: Maybe<Scalars['String']['output']>;
  bankEntity?: Maybe<Bank>;
  cardName?: Maybe<Scalars['String']['output']>;
  cardType?: Maybe<Scalars['String']['output']>;
  checkDate?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  expiry?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  payment?: Maybe<Payment>;
  posTerminalId?: Maybe<Scalars['String']['output']>;
  reference?: Maybe<Scalars['String']['output']>;
  type?: Maybe<Scalars['String']['output']>;
  voided?: Maybe<Scalars['Boolean']['output']>;
};

export type PaymentItems = {
  __typename?: 'PaymentItems';
  amount?: Maybe<Scalars['BigDecimal']['output']>;
  billingid?: Maybe<Scalars['UUID']['output']>;
  billingitemid?: Maybe<Scalars['UUID']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  itemType?: Maybe<Scalars['String']['output']>;
  outputTax?: Maybe<Scalars['BigDecimal']['output']>;
  paymentDate?: Maybe<Scalars['Instant']['output']>;
  paymentid?: Maybe<Scalars['UUID']['output']>;
  transDate?: Maybe<Scalars['Instant']['output']>;
};

export type PaymentPromptField = {
  __typename?: 'PaymentPromptField';
  maximumDays?: Maybe<Scalars['Int']['output']>;
  rate?: Maybe<Scalars['BigDecimal']['output']>;
};

export type PaymentPromptFieldInput = {
  maximumDays?: InputMaybe<Scalars['Int']['input']>;
  rate?: InputMaybe<Scalars['BigDecimal']['input']>;
};

export type PaymentTarget = {
  __typename?: 'PaymentTarget';
  amount?: Maybe<Scalars['BigDecimal']['output']>;
  journalCode?: Maybe<Scalars['String']['output']>;
};

export type PaymentTerm = {
  __typename?: 'PaymentTerm';
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  paymentCode?: Maybe<Scalars['String']['output']>;
  paymentDesc?: Maybe<Scalars['String']['output']>;
  paymentNoDays?: Maybe<Scalars['Int']['output']>;
};

export type PaymentTermInput = {
  company?: InputMaybe<Scalars['UUID']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  paymentCode?: InputMaybe<Scalars['String']['input']>;
  paymentDesc?: InputMaybe<Scalars['String']['input']>;
  paymentNoDays?: InputMaybe<Scalars['Int']['input']>;
};

export type Payroll = {
  __typename?: 'Payroll';
  adjustment?: Maybe<PayrollAdjustment>;
  advancesToEmployees?: Maybe<Scalars['BigDecimal']['output']>;
  allowance?: Maybe<PayrollAllowance>;
  code?: Maybe<Scalars['String']['output']>;
  company?: Maybe<CompanySettings>;
  contribution?: Maybe<PayrollContribution>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  cycle?: Maybe<Scalars['Int']['output']>;
  dateEnd?: Maybe<Scalars['Instant']['output']>;
  dateStart?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  details?: Maybe<Scalars['Map_String_StringScalar']['output']>;
  domain?: Maybe<Scalars['String']['output']>;
  finalizedBy?: Maybe<Employee>;
  finalizedDate?: Maybe<Scalars['Instant']['output']>;
  flagValue?: Maybe<Scalars['String']['output']>;
  hdmfEe?: Maybe<Scalars['BigDecimal']['output']>;
  hdmfEr?: Maybe<Scalars['BigDecimal']['output']>;
  hdmfPremium?: Maybe<Scalars['BigDecimal']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  loan?: Maybe<PayrollLoan>;
  otherDeduction?: Maybe<PayrollOtherDeduction>;
  payrollEmployees?: Maybe<Array<Maybe<PayrollEmployee>>>;
  phicEe?: Maybe<Scalars['BigDecimal']['output']>;
  phicEr?: Maybe<Scalars['BigDecimal']['output']>;
  phicPrmemium?: Maybe<Scalars['BigDecimal']['output']>;
  posted?: Maybe<Scalars['Boolean']['output']>;
  postedBy?: Maybe<Scalars['String']['output']>;
  postedLedger?: Maybe<Scalars['UUID']['output']>;
  salariesPayableTotalCredit?: Maybe<Scalars['BigDecimal']['output']>;
  salariesPayableTotalDebit?: Maybe<Scalars['BigDecimal']['output']>;
  sssEe?: Maybe<Scalars['BigDecimal']['output']>;
  sssEr?: Maybe<Scalars['BigDecimal']['output']>;
  sssPremium?: Maybe<Scalars['BigDecimal']['output']>;
  status?: Maybe<PayrollStatus>;
  timekeeping?: Maybe<Timekeeping>;
  title?: Maybe<Scalars['String']['output']>;
  type?: Maybe<PayrollType>;
  withholdingTax?: Maybe<Scalars['BigDecimal']['output']>;
};

export type PayrollAdjustment = {
  __typename?: 'PayrollAdjustment';
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  deleted?: Maybe<Scalars['Boolean']['output']>;
  deletedEnd?: Maybe<Scalars['Instant']['output']>;
  employees?: Maybe<Array<Maybe<PayrollEmployeeAdjustment>>>;
  finalizedBy?: Maybe<Employee>;
  finalizedDate?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  payroll?: Maybe<Payroll>;
  status?: Maybe<PayrollStatus>;
  totalsBreakdown?: Maybe<Array<Maybe<SubAccountBreakdownDto>>>;
};

export type PayrollAdjustmentItem = {
  __typename?: 'PayrollAdjustmentItem';
  amount?: Maybe<Scalars['BigDecimal']['output']>;
  category?: Maybe<AdjustmentCategory>;
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  employeeAdjustment?: Maybe<PayrollEmployeeAdjustment>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  operation?: Maybe<AdjustmentOperation>;
  subaccountCode?: Maybe<Scalars['String']['output']>;
};

export type PayrollAllowance = {
  __typename?: 'PayrollAllowance';
  allowanceEmployees?: Maybe<Array<Maybe<PayrollEmployeeAllowance>>>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  finalizedBy?: Maybe<Employee>;
  finalizedDate?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  payroll?: Maybe<Payroll>;
  status?: Maybe<PayrollStatus>;
  total?: Maybe<Scalars['BigDecimal']['output']>;
  totalsBreakdown?: Maybe<Array<Maybe<SubAccountBreakdownDto>>>;
};

export type PayrollAllowanceItem = {
  __typename?: 'PayrollAllowanceItem';
  allowance?: Maybe<Allowance>;
  amount?: Maybe<Scalars['BigDecimal']['output']>;
  deleted?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  originalAmount?: Maybe<Scalars['BigDecimal']['output']>;
  payrollEmployeeAllowance?: Maybe<PayrollEmployeeAllowance>;
};

export type PayrollContribution = {
  __typename?: 'PayrollContribution';
  company?: Maybe<CompanySettings>;
  contributionEmployees?: Maybe<Array<Maybe<PayrollEmployeeContribution>>>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  finalizedBy?: Maybe<Employee>;
  finalizedDate?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isActiveHDMF?: Maybe<Scalars['Boolean']['output']>;
  isActivePHIC?: Maybe<Scalars['Boolean']['output']>;
  isActiveSSS?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  payroll?: Maybe<Payroll>;
  status?: Maybe<PayrollStatus>;
  totalsBreakdown?: Maybe<Array<Maybe<SubAccountBreakdownDto>>>;
};

export type PayrollEmployee = {
  __typename?: 'PayrollEmployee';
  allowanceEmployee?: Maybe<PayrollEmployeeAllowance>;
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  employee?: Maybe<Employee>;
  employeeAdjustment?: Maybe<PayrollEmployeeAdjustment>;
  employeeOtherDeduction?: Maybe<PayrollEmployeeOtherDeduction>;
  id?: Maybe<Scalars['UUID']['output']>;
  isOld?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  payroll?: Maybe<Payroll>;
  payrollEmployeeContribution?: Maybe<PayrollEmployeeContribution>;
  payrollEmployeeLoan?: Maybe<PayrollEmployeeLoan>;
  status?: Maybe<PayrollEmployeeStatus>;
  timekeepingEmployee?: Maybe<TimekeepingEmployee>;
  withholdingTax?: Maybe<Scalars['BigDecimal']['output']>;
};

export type PayrollEmployeeAdjustment = {
  __typename?: 'PayrollEmployeeAdjustment';
  adjustmentItems?: Maybe<Array<Maybe<PayrollAdjustmentItem>>>;
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  finalizedBy?: Maybe<Employee>;
  finalizedDate?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  payrollAdjustment?: Maybe<PayrollAdjustment>;
  payrollEmployee?: Maybe<PayrollEmployee>;
  status?: Maybe<PayrollEmployeeStatus>;
};

export type PayrollEmployeeAdjustmentDto = {
  __typename?: 'PayrollEmployeeAdjustmentDto';
  employee?: Maybe<PayrollEmployeeAdjustment>;
  employeeName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  total?: Maybe<Scalars['BigDecimal']['output']>;
};

export type PayrollEmployeeAllowance = {
  __typename?: 'PayrollEmployeeAllowance';
  allowance?: Maybe<PayrollAllowance>;
  allowanceItems?: Maybe<Array<Maybe<PayrollAllowanceItem>>>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  finalizedBy?: Maybe<Employee>;
  finalizedDate?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  payrollEmployee?: Maybe<PayrollEmployee>;
  status?: Maybe<PayrollEmployeeStatus>;
  total?: Maybe<Scalars['BigDecimal']['output']>;
};

export type PayrollEmployeeAllowanceDto = {
  __typename?: 'PayrollEmployeeAllowanceDto';
  department?: Maybe<Scalars['String']['output']>;
  employee?: Maybe<PayrollEmployeeAllowance>;
  employeeName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  payrollEmployeeId?: Maybe<Scalars['String']['output']>;
  position?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  total?: Maybe<Scalars['BigDecimal']['output']>;
};

export type PayrollEmployeeContribution = {
  __typename?: 'PayrollEmployeeContribution';
  basicSalary?: Maybe<Scalars['BigDecimal']['output']>;
  company?: Maybe<CompanySettings>;
  contribution?: Maybe<PayrollContribution>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  finalizedBy?: Maybe<Employee>;
  finalizedDate?: Maybe<Scalars['Instant']['output']>;
  hdmfEE?: Maybe<Scalars['BigDecimal']['output']>;
  hdmfER?: Maybe<Scalars['BigDecimal']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isActiveHDMF?: Maybe<Scalars['Boolean']['output']>;
  isActivePHIC?: Maybe<Scalars['Boolean']['output']>;
  isActiveSSS?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  payrollEmployee?: Maybe<PayrollEmployee>;
  phicEE?: Maybe<Scalars['BigDecimal']['output']>;
  phicER?: Maybe<Scalars['BigDecimal']['output']>;
  sssEE?: Maybe<Scalars['BigDecimal']['output']>;
  sssER?: Maybe<Scalars['BigDecimal']['output']>;
  sssWispEE?: Maybe<Scalars['BigDecimal']['output']>;
  sssWispER?: Maybe<Scalars['BigDecimal']['output']>;
  status?: Maybe<PayrollEmployeeStatus>;
  total?: Maybe<Scalars['BigDecimal']['output']>;
};

export type PayrollEmployeeContributionDto = {
  __typename?: 'PayrollEmployeeContributionDto';
  basicSalary?: Maybe<Scalars['BigDecimal']['output']>;
  department?: Maybe<Scalars['String']['output']>;
  employee?: Maybe<PayrollEmployeeContribution>;
  employeeName?: Maybe<Scalars['String']['output']>;
  hdmfEE?: Maybe<Scalars['BigDecimal']['output']>;
  hdmfER?: Maybe<Scalars['BigDecimal']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  isActiveHDMF?: Maybe<Scalars['Boolean']['output']>;
  isActivePHIC?: Maybe<Scalars['Boolean']['output']>;
  isActiveSSS?: Maybe<Scalars['Boolean']['output']>;
  phicEE?: Maybe<Scalars['BigDecimal']['output']>;
  phicER?: Maybe<Scalars['BigDecimal']['output']>;
  sssEE?: Maybe<Scalars['BigDecimal']['output']>;
  sssEETotal?: Maybe<Scalars['BigDecimal']['output']>;
  sssER?: Maybe<Scalars['BigDecimal']['output']>;
  sssERTotal?: Maybe<Scalars['BigDecimal']['output']>;
  sssWispEE?: Maybe<Scalars['BigDecimal']['output']>;
  sssWispER?: Maybe<Scalars['BigDecimal']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  total?: Maybe<Scalars['BigDecimal']['output']>;
};

export type PayrollEmployeeListDto = {
  __typename?: 'PayrollEmployeeListDto';
  contributionStatus?: Maybe<PayrollEmployeeStatus>;
  fullName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  position?: Maybe<Scalars['String']['output']>;
  status?: Maybe<PayrollEmployeeStatus>;
  timekeepingStatus?: Maybe<PayrollEmployeeStatus>;
  withholdingTax?: Maybe<Scalars['BigDecimal']['output']>;
};

export type PayrollEmployeeLoan = {
  __typename?: 'PayrollEmployeeLoan';
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  finalizedBy?: Maybe<Employee>;
  finalizedDate?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  loanItems?: Maybe<Array<Maybe<PayrollLoanItem>>>;
  payrollEmployee?: Maybe<PayrollEmployee>;
  payrollLoan?: Maybe<PayrollLoan>;
  status?: Maybe<PayrollEmployeeStatus>;
};

export type PayrollEmployeeLoanDto = {
  __typename?: 'PayrollEmployeeLoanDto';
  employee?: Maybe<PayrollEmployeeLoan>;
  employeeName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  loanItems?: Maybe<Array<Maybe<PayrollLoanItem>>>;
  status?: Maybe<Scalars['String']['output']>;
};

export type PayrollEmployeeOtherDeduction = {
  __typename?: 'PayrollEmployeeOtherDeduction';
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  deductionItems?: Maybe<Array<Maybe<PayrollOtherDeductionItem>>>;
  finalizedBy?: Maybe<Employee>;
  finalizedDate?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  payrollEmployee?: Maybe<PayrollEmployee>;
  payrollOtherDeduction?: Maybe<PayrollOtherDeduction>;
  status?: Maybe<PayrollEmployeeStatus>;
};

export type PayrollEmployeeOtherDeductionDto = {
  __typename?: 'PayrollEmployeeOtherDeductionDto';
  employee?: Maybe<PayrollEmployeeOtherDeduction>;
  employeeName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  total?: Maybe<Scalars['BigDecimal']['output']>;
};

export enum PayrollEmployeeStatus {
  Approved = 'APPROVED',
  Draft = 'DRAFT',
  Finalized = 'FINALIZED',
  Rejected = 'REJECTED'
}

export type PayrollLoan = {
  __typename?: 'PayrollLoan';
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  deleted?: Maybe<Scalars['Boolean']['output']>;
  deletedEnd?: Maybe<Scalars['Instant']['output']>;
  employees?: Maybe<Array<Maybe<PayrollEmployeeLoan>>>;
  finalizedBy?: Maybe<Employee>;
  finalizedDate?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  payroll?: Maybe<Payroll>;
  status?: Maybe<PayrollStatus>;
  totalsBreakdown?: Maybe<Array<Maybe<SubAccountBreakdownDto>>>;
};

export type PayrollLoanItem = {
  __typename?: 'PayrollLoanItem';
  amount?: Maybe<Scalars['BigDecimal']['output']>;
  category?: Maybe<EmployeeLoanCategory>;
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  employeeLoan?: Maybe<PayrollEmployeeLoan>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  status?: Maybe<Scalars['Boolean']['output']>;
};

export enum PayrollModule {
  Adjustment = 'ADJUSTMENT',
  Allowance = 'ALLOWANCE',
  Contribution = 'CONTRIBUTION',
  Loans = 'LOANS',
  OtherDeduction = 'OTHER_DEDUCTION',
  Timekeeping = 'TIMEKEEPING',
  WithholdingTax = 'WITHHOLDING_TAX'
}

export type PayrollOtherDeduction = {
  __typename?: 'PayrollOtherDeduction';
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  deleted?: Maybe<Scalars['Boolean']['output']>;
  deletedEnd?: Maybe<Scalars['Instant']['output']>;
  employees?: Maybe<Array<Maybe<PayrollEmployeeOtherDeduction>>>;
  finalizedBy?: Maybe<Employee>;
  finalizedDate?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  payroll?: Maybe<Payroll>;
  status?: Maybe<PayrollStatus>;
  totalsBreakdown?: Maybe<Array<Maybe<SubAccountBreakdownDto>>>;
};

export type PayrollOtherDeductionItem = {
  __typename?: 'PayrollOtherDeductionItem';
  amount?: Maybe<Scalars['BigDecimal']['output']>;
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  employeeOtherDeduction?: Maybe<PayrollEmployeeOtherDeduction>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  subaccountCode?: Maybe<Scalars['String']['output']>;
  type?: Maybe<OtherDeductionTypes>;
};

export enum PayrollStatus {
  Active = 'ACTIVE',
  Cancelled = 'CANCELLED',
  Draft = 'DRAFT',
  Finalized = 'FINALIZED'
}

export enum PayrollType {
  SemiMonthly = 'SEMI_MONTHLY',
  Weekly = 'WEEKLY'
}

export type Permission = {
  __typename?: 'Permission';
  description?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
};

export type PersistentToken = {
  __typename?: 'PersistentToken';
  MAX_USER_AGENT_LEN: Scalars['Int']['output'];
  ipAddress?: Maybe<Scalars['String']['output']>;
  series?: Maybe<Scalars['String']['output']>;
  tokenDate?: Maybe<Scalars['LocalDate']['output']>;
  tokenValue: Scalars['String']['output'];
  user?: Maybe<User>;
  userAgent?: Maybe<Scalars['String']['output']>;
};

export type PettyCash = {
  __typename?: 'PettyCash';
  amount?: Maybe<Scalars['BigDecimal']['output']>;
  cashType?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  dateTrans?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isPosted?: Maybe<Scalars['Boolean']['output']>;
  isVoid?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  notes?: Maybe<Scalars['String']['output']>;
  pettyType?: Maybe<PettyType>;
  project?: Maybe<Projects>;
  receivedBy?: Maybe<Employee>;
  receivedFrom?: Maybe<Scalars['String']['output']>;
  remarks?: Maybe<Scalars['String']['output']>;
  shift?: Maybe<Shift>;
};

export type PettyCashAccounting = {
  __typename?: 'PettyCashAccounting';
  amountIssued?: Maybe<Scalars['BigDecimal']['output']>;
  amountUnused?: Maybe<Scalars['BigDecimal']['output']>;
  amountUsed?: Maybe<Scalars['BigDecimal']['output']>;
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  details?: Maybe<Scalars['Map_String_StringScalar']['output']>;
  domain?: Maybe<Scalars['String']['output']>;
  flagValue?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  office?: Maybe<Office>;
  payeeName?: Maybe<Scalars['String']['output']>;
  pcvCategory?: Maybe<Scalars['String']['output']>;
  pcvDate?: Maybe<Scalars['Instant']['output']>;
  pcvNo?: Maybe<Scalars['String']['output']>;
  posted?: Maybe<Scalars['Boolean']['output']>;
  postedLedger?: Maybe<Scalars['UUID']['output']>;
  posted_by?: Maybe<Scalars['String']['output']>;
  project?: Maybe<Projects>;
  referenceNo?: Maybe<Scalars['String']['output']>;
  referenceType?: Maybe<Scalars['String']['output']>;
  remarks?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  transType?: Maybe<ApTransaction>;
  value_1?: Maybe<Scalars['BigDecimal']['output']>;
  value_2?: Maybe<Scalars['BigDecimal']['output']>;
  value_3?: Maybe<Scalars['BigDecimal']['output']>;
  value_4?: Maybe<Scalars['BigDecimal']['output']>;
  value_5?: Maybe<Scalars['BigDecimal']['output']>;
  value_6?: Maybe<Scalars['BigDecimal']['output']>;
  value_7?: Maybe<Scalars['BigDecimal']['output']>;
  value_8?: Maybe<Scalars['BigDecimal']['output']>;
  value_9?: Maybe<Scalars['BigDecimal']['output']>;
  value_10?: Maybe<Scalars['BigDecimal']['output']>;
  value_11?: Maybe<Scalars['BigDecimal']['output']>;
  value_12?: Maybe<Scalars['BigDecimal']['output']>;
  value_13?: Maybe<Scalars['BigDecimal']['output']>;
  value_14?: Maybe<Scalars['BigDecimal']['output']>;
  value_15?: Maybe<Scalars['BigDecimal']['output']>;
  value_16?: Maybe<Scalars['BigDecimal']['output']>;
  value_17?: Maybe<Scalars['BigDecimal']['output']>;
  value_18?: Maybe<Scalars['BigDecimal']['output']>;
  value_19?: Maybe<Scalars['BigDecimal']['output']>;
  value_20?: Maybe<Scalars['BigDecimal']['output']>;
  value_21?: Maybe<Scalars['BigDecimal']['output']>;
  value_22?: Maybe<Scalars['BigDecimal']['output']>;
  value_23?: Maybe<Scalars['BigDecimal']['output']>;
  value_24?: Maybe<Scalars['BigDecimal']['output']>;
  value_25?: Maybe<Scalars['BigDecimal']['output']>;
  value_26?: Maybe<Scalars['BigDecimal']['output']>;
  value_27?: Maybe<Scalars['BigDecimal']['output']>;
  value_28?: Maybe<Scalars['BigDecimal']['output']>;
  value_29?: Maybe<Scalars['BigDecimal']['output']>;
  value_30?: Maybe<Scalars['BigDecimal']['output']>;
  value_31?: Maybe<Scalars['BigDecimal']['output']>;
  value_32?: Maybe<Scalars['BigDecimal']['output']>;
  value_33?: Maybe<Scalars['BigDecimal']['output']>;
  value_34?: Maybe<Scalars['BigDecimal']['output']>;
  value_35?: Maybe<Scalars['BigDecimal']['output']>;
  value_36?: Maybe<Scalars['BigDecimal']['output']>;
  value_37?: Maybe<Scalars['BigDecimal']['output']>;
  value_38?: Maybe<Scalars['BigDecimal']['output']>;
  value_39?: Maybe<Scalars['BigDecimal']['output']>;
  value_40?: Maybe<Scalars['BigDecimal']['output']>;
  value_41?: Maybe<Scalars['BigDecimal']['output']>;
  value_42?: Maybe<Scalars['BigDecimal']['output']>;
  value_43?: Maybe<Scalars['BigDecimal']['output']>;
  value_44?: Maybe<Scalars['BigDecimal']['output']>;
  value_45?: Maybe<Scalars['BigDecimal']['output']>;
  value_46?: Maybe<Scalars['BigDecimal']['output']>;
  value_47?: Maybe<Scalars['BigDecimal']['output']>;
  value_48?: Maybe<Scalars['BigDecimal']['output']>;
  value_49?: Maybe<Scalars['BigDecimal']['output']>;
  value_50?: Maybe<Scalars['BigDecimal']['output']>;
  value_51?: Maybe<Scalars['BigDecimal']['output']>;
  value_52?: Maybe<Scalars['BigDecimal']['output']>;
  value_53?: Maybe<Scalars['BigDecimal']['output']>;
  value_54?: Maybe<Scalars['BigDecimal']['output']>;
  value_55?: Maybe<Scalars['BigDecimal']['output']>;
  value_56?: Maybe<Scalars['BigDecimal']['output']>;
  value_57?: Maybe<Scalars['BigDecimal']['output']>;
  value_58?: Maybe<Scalars['BigDecimal']['output']>;
  value_59?: Maybe<Scalars['BigDecimal']['output']>;
  value_60?: Maybe<Scalars['BigDecimal']['output']>;
  value_61?: Maybe<Scalars['BigDecimal']['output']>;
  value_62?: Maybe<Scalars['BigDecimal']['output']>;
  value_63?: Maybe<Scalars['BigDecimal']['output']>;
  value_64?: Maybe<Scalars['BigDecimal']['output']>;
  value_65?: Maybe<Scalars['BigDecimal']['output']>;
  value_66?: Maybe<Scalars['BigDecimal']['output']>;
  value_67?: Maybe<Scalars['BigDecimal']['output']>;
  value_68?: Maybe<Scalars['BigDecimal']['output']>;
  value_69?: Maybe<Scalars['BigDecimal']['output']>;
  value_70?: Maybe<Scalars['BigDecimal']['output']>;
  value_71?: Maybe<Scalars['BigDecimal']['output']>;
  value_72?: Maybe<Scalars['BigDecimal']['output']>;
  value_73?: Maybe<Scalars['BigDecimal']['output']>;
  value_74?: Maybe<Scalars['BigDecimal']['output']>;
  value_75?: Maybe<Scalars['BigDecimal']['output']>;
  value_76?: Maybe<Scalars['BigDecimal']['output']>;
  value_77?: Maybe<Scalars['BigDecimal']['output']>;
  value_78?: Maybe<Scalars['BigDecimal']['output']>;
  value_79?: Maybe<Scalars['BigDecimal']['output']>;
  value_80?: Maybe<Scalars['BigDecimal']['output']>;
  value_81?: Maybe<Scalars['BigDecimal']['output']>;
  value_82?: Maybe<Scalars['BigDecimal']['output']>;
  value_83?: Maybe<Scalars['BigDecimal']['output']>;
  value_84?: Maybe<Scalars['BigDecimal']['output']>;
  value_85?: Maybe<Scalars['BigDecimal']['output']>;
  value_86?: Maybe<Scalars['BigDecimal']['output']>;
  value_87?: Maybe<Scalars['BigDecimal']['output']>;
  value_88?: Maybe<Scalars['BigDecimal']['output']>;
  value_89?: Maybe<Scalars['BigDecimal']['output']>;
  value_90?: Maybe<Scalars['BigDecimal']['output']>;
  value_91?: Maybe<Scalars['BigDecimal']['output']>;
  value_92?: Maybe<Scalars['BigDecimal']['output']>;
  value_93?: Maybe<Scalars['BigDecimal']['output']>;
  value_94?: Maybe<Scalars['BigDecimal']['output']>;
  value_95?: Maybe<Scalars['BigDecimal']['output']>;
  value_96?: Maybe<Scalars['BigDecimal']['output']>;
  value_97?: Maybe<Scalars['BigDecimal']['output']>;
  value_98?: Maybe<Scalars['BigDecimal']['output']>;
  value_99?: Maybe<Scalars['BigDecimal']['output']>;
  value_100?: Maybe<Scalars['BigDecimal']['output']>;
  vatInclusive?: Maybe<Scalars['Boolean']['output']>;
  vatRate?: Maybe<Scalars['BigDecimal']['output']>;
};

export type PettyCashAccountingInput = {
  amountIssued?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUnused?: InputMaybe<Scalars['BigDecimal']['input']>;
  amountUsed?: InputMaybe<Scalars['BigDecimal']['input']>;
  company?: InputMaybe<Scalars['UUID']['input']>;
  flagValue?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  office?: InputMaybe<OfficeInput>;
  payeeName?: InputMaybe<Scalars['String']['input']>;
  pcvCategory?: InputMaybe<Scalars['String']['input']>;
  pcvDate?: InputMaybe<Scalars['Instant']['input']>;
  pcvNo?: InputMaybe<Scalars['String']['input']>;
  posted?: InputMaybe<Scalars['Boolean']['input']>;
  postedLedger?: InputMaybe<Scalars['UUID']['input']>;
  posted_by?: InputMaybe<Scalars['String']['input']>;
  project?: InputMaybe<ProjectsInput>;
  referenceNo?: InputMaybe<Scalars['String']['input']>;
  referenceType?: InputMaybe<Scalars['String']['input']>;
  remarks?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  transType?: InputMaybe<ApTransactionInput>;
  value_1?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_2?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_3?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_4?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_5?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_6?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_7?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_8?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_9?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_10?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_11?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_12?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_13?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_14?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_15?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_16?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_17?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_18?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_19?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_20?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_21?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_22?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_23?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_24?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_25?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_26?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_27?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_28?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_29?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_30?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_31?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_32?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_33?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_34?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_35?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_36?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_37?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_38?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_39?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_40?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_41?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_42?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_43?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_44?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_45?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_46?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_47?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_48?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_49?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_50?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_51?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_52?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_53?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_54?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_55?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_56?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_57?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_58?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_59?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_60?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_61?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_62?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_63?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_64?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_65?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_66?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_67?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_68?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_69?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_70?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_71?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_72?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_73?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_74?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_75?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_76?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_77?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_78?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_79?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_80?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_81?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_82?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_83?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_84?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_85?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_86?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_87?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_88?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_89?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_90?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_91?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_92?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_93?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_94?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_95?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_96?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_97?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_98?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_99?: InputMaybe<Scalars['BigDecimal']['input']>;
  value_100?: InputMaybe<Scalars['BigDecimal']['input']>;
  vatInclusive?: InputMaybe<Scalars['Boolean']['input']>;
  vatRate?: InputMaybe<Scalars['BigDecimal']['input']>;
};

export type PettyCashItem = {
  __typename?: 'PettyCashItem';
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  descLong?: Maybe<Scalars['String']['output']>;
  discAmount?: Maybe<Scalars['BigDecimal']['output']>;
  discRate?: Maybe<Scalars['BigDecimal']['output']>;
  expirationDate?: Maybe<Scalars['Instant']['output']>;
  grossAmount?: Maybe<Scalars['BigDecimal']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  inventoryCost?: Maybe<Scalars['BigDecimal']['output']>;
  isPosted?: Maybe<Scalars['Boolean']['output']>;
  isVat?: Maybe<Scalars['Boolean']['output']>;
  item?: Maybe<Item>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  lotNo?: Maybe<Scalars['String']['output']>;
  netAmount?: Maybe<Scalars['BigDecimal']['output']>;
  netDiscount?: Maybe<Scalars['BigDecimal']['output']>;
  office?: Maybe<Office>;
  pettyCash?: Maybe<PettyCashAccounting>;
  project?: Maybe<Projects>;
  qty?: Maybe<Scalars['Int']['output']>;
  unitCost?: Maybe<Scalars['BigDecimal']['output']>;
  unitMeasurement?: Maybe<Scalars['String']['output']>;
  uou?: Maybe<Scalars['String']['output']>;
  vatAmount?: Maybe<Scalars['BigDecimal']['output']>;
};

export type PettyCashName = {
  __typename?: 'PettyCashName';
  name?: Maybe<Scalars['String']['output']>;
};

export type PettyCashOther = {
  __typename?: 'PettyCashOther';
  amount?: Maybe<Scalars['BigDecimal']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  office?: Maybe<Office>;
  pettyCash?: Maybe<PettyCashAccounting>;
  project?: Maybe<Projects>;
  remarks?: Maybe<Scalars['String']['output']>;
  transType?: Maybe<ExpenseTransaction>;
};

export type PettyType = {
  __typename?: 'PettyType';
  code?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  is_active?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
};

export type PlateNumberDto = {
  __typename?: 'PlateNumberDto';
  plate_no?: Maybe<Scalars['String']['output']>;
};

export type Position = {
  __typename?: 'Position';
  code?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  status?: Maybe<Scalars['Boolean']['output']>;
};

export type PositionInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  createdDate?: InputMaybe<Scalars['Instant']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};

export enum PreventiveScheduleType {
  Daily = 'DAILY',
  Monthly = 'MONTHLY',
  Weekly = 'WEEKLY',
  Yearly = 'YEARLY'
}

export type ProjectCost = {
  __typename?: 'ProjectCost';
  billedQty?: Maybe<Scalars['BigDecimal']['output']>;
  category?: Maybe<Scalars['String']['output']>;
  cost?: Maybe<Scalars['BigDecimal']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  dateTransact?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  itemNo?: Maybe<Scalars['String']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  project?: Maybe<Projects>;
  qty?: Maybe<Scalars['BigDecimal']['output']>;
  refNo?: Maybe<Scalars['String']['output']>;
  relativeWeight?: Maybe<Scalars['BigDecimal']['output']>;
  status?: Maybe<Scalars['Boolean']['output']>;
  tagNo?: Maybe<Scalars['String']['output']>;
  totalCost?: Maybe<Scalars['BigDecimal']['output']>;
  unit?: Maybe<Scalars['String']['output']>;
};

export type ProjectCostInput = {
  billedQty?: InputMaybe<Scalars['BigDecimal']['input']>;
  category?: InputMaybe<Scalars['String']['input']>;
  cost?: InputMaybe<Scalars['BigDecimal']['input']>;
  dateTransact?: InputMaybe<Scalars['Instant']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  itemNo?: InputMaybe<Scalars['String']['input']>;
  project?: InputMaybe<ProjectsInput>;
  qty?: InputMaybe<Scalars['BigDecimal']['input']>;
  refNo?: InputMaybe<Scalars['String']['input']>;
  relativeWeight?: InputMaybe<Scalars['BigDecimal']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
  tagNo?: InputMaybe<Scalars['String']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
};

export type ProjectCostRevisions = {
  __typename?: 'ProjectCostRevisions';
  cost?: Maybe<Scalars['BigDecimal']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  prevDate?: Maybe<Scalars['Instant']['output']>;
  project?: Maybe<Scalars['UUID']['output']>;
  projectCostId?: Maybe<Scalars['UUID']['output']>;
  qty?: Maybe<Scalars['BigDecimal']['output']>;
  tagNo?: Maybe<Scalars['String']['output']>;
  totalCost?: Maybe<Scalars['BigDecimal']['output']>;
  unit?: Maybe<Scalars['String']['output']>;
};

export type ProjectProgress = {
  __typename?: 'ProjectProgress';
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  dateTransact?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  progress?: Maybe<Scalars['String']['output']>;
  progressPercent?: Maybe<Scalars['BigDecimal']['output']>;
  project?: Maybe<Projects>;
  status?: Maybe<Scalars['String']['output']>;
  transNo?: Maybe<Scalars['String']['output']>;
};

export type ProjectProgressImages = {
  __typename?: 'ProjectProgressImages';
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  dateTransact?: Maybe<Scalars['Instant']['output']>;
  fileName?: Maybe<Scalars['String']['output']>;
  folderName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  imageUrl?: Maybe<Scalars['String']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  mimetype?: Maybe<Scalars['String']['output']>;
  project?: Maybe<Projects>;
  projectProgress?: Maybe<ProjectProgress>;
};

export type ProjectUpdates = {
  __typename?: 'ProjectUpdates';
  accomplishment?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  dateTransact?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  project?: Maybe<Projects>;
  status?: Maybe<Scalars['String']['output']>;
  transNo?: Maybe<Scalars['String']['output']>;
  weather?: Maybe<Scalars['String']['output']>;
};

export type ProjectUpdatesMaterials = {
  __typename?: 'ProjectUpdatesMaterials';
  balance?: Maybe<Scalars['Int']['output']>;
  cost?: Maybe<Scalars['BigDecimal']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  dateTransact?: Maybe<Scalars['Instant']['output']>;
  descLong?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  item?: Maybe<Item>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  onHand?: Maybe<Scalars['Int']['output']>;
  project?: Maybe<Projects>;
  projectUpdates?: Maybe<ProjectUpdates>;
  qty?: Maybe<Scalars['Int']['output']>;
  remarks?: Maybe<Scalars['String']['output']>;
  stockCardRefId?: Maybe<Scalars['UUID']['output']>;
  subTotal?: Maybe<Scalars['BigDecimal']['output']>;
  uou?: Maybe<Scalars['String']['output']>;
};

export type ProjectUpdatesWorkers = {
  __typename?: 'ProjectUpdatesWorkers';
  amShift?: Maybe<Scalars['Int']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  dateTransact?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  pmShift?: Maybe<Scalars['Int']['output']>;
  position?: Maybe<Scalars['String']['output']>;
  project?: Maybe<Projects>;
  projectUpdates?: Maybe<ProjectUpdates>;
  remarks?: Maybe<Scalars['String']['output']>;
};

export type ProjectWorkAccomplish = {
  __typename?: 'ProjectWorkAccomplish';
  approvedForPayment?: Maybe<Scalars['String']['output']>;
  checkedBy?: Maybe<Scalars['String']['output']>;
  companyId?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  details?: Maybe<Scalars['Map_String_StringScalar']['output']>;
  domain?: Maybe<Scalars['String']['output']>;
  flagValue?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  periodEnd?: Maybe<Scalars['String']['output']>;
  periodStart?: Maybe<Scalars['String']['output']>;
  preparedBy?: Maybe<Scalars['String']['output']>;
  project?: Maybe<Scalars['UUID']['output']>;
  recommendingApproval?: Maybe<Scalars['String']['output']>;
  recordNo?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  totalAmount?: Maybe<Scalars['BigDecimal']['output']>;
  totalBalanceAmount?: Maybe<Scalars['BigDecimal']['output']>;
  totalPayments?: Maybe<Scalars['BigDecimal']['output']>;
  totalPercentage?: Maybe<Scalars['BigDecimal']['output']>;
  totalPeriodAmount?: Maybe<Scalars['BigDecimal']['output']>;
  totalPrevAmount?: Maybe<Scalars['BigDecimal']['output']>;
  totalToDateAmount?: Maybe<Scalars['BigDecimal']['output']>;
  verifiedBy?: Maybe<Scalars['String']['output']>;
};

export type ProjectWorkAccomplishItems = {
  __typename?: 'ProjectWorkAccomplishItems';
  amount?: Maybe<Scalars['BigDecimal']['output']>;
  balanceAmount?: Maybe<Scalars['BigDecimal']['output']>;
  balanceQty?: Maybe<Scalars['BigDecimal']['output']>;
  companyId?: Maybe<Scalars['UUID']['output']>;
  cost?: Maybe<Scalars['BigDecimal']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  itemNo?: Maybe<Scalars['String']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  payments?: Maybe<Scalars['BigDecimal']['output']>;
  percentage?: Maybe<Scalars['BigDecimal']['output']>;
  periodEnd?: Maybe<Scalars['String']['output']>;
  periodStart?: Maybe<Scalars['String']['output']>;
  prevAmount?: Maybe<Scalars['BigDecimal']['output']>;
  prevQty?: Maybe<Scalars['BigDecimal']['output']>;
  project?: Maybe<Scalars['UUID']['output']>;
  projectCost?: Maybe<Scalars['UUID']['output']>;
  projectWorkAccomplishId?: Maybe<Scalars['UUID']['output']>;
  qty?: Maybe<Scalars['BigDecimal']['output']>;
  relativeWeight?: Maybe<Scalars['BigDecimal']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  thisPeriodAmount?: Maybe<Scalars['BigDecimal']['output']>;
  thisPeriodQty?: Maybe<Scalars['BigDecimal']['output']>;
  toDateAmount?: Maybe<Scalars['BigDecimal']['output']>;
  toDateQty?: Maybe<Scalars['BigDecimal']['output']>;
  unit?: Maybe<Scalars['String']['output']>;
};

export type Projects = {
  __typename?: 'Projects';
  accountName?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  company?: Maybe<Scalars['UUID']['output']>;
  contractId?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  customer?: Maybe<ArCustomers>;
  description?: Maybe<Scalars['String']['output']>;
  disabledEditing?: Maybe<Scalars['Boolean']['output']>;
  domain?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  location?: Maybe<Office>;
  prefixShortName?: Maybe<Scalars['String']['output']>;
  projectCode?: Maybe<Scalars['String']['output']>;
  projectColor?: Maybe<Scalars['String']['output']>;
  projectEnded?: Maybe<Scalars['Instant']['output']>;
  projectPercent?: Maybe<Scalars['BigDecimal']['output']>;
  projectStarted?: Maybe<Scalars['Instant']['output']>;
  projectStatusColor?: Maybe<Scalars['String']['output']>;
  remarks?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  /** totalExpenses */
  totalExpenses?: Maybe<Scalars['BigDecimal']['output']>;
  total_cost?: Maybe<Scalars['BigDecimal']['output']>;
  /** totals */
  totals?: Maybe<Scalars['BigDecimal']['output']>;
  /** totalsMaterials */
  totalsMaterials?: Maybe<Scalars['BigDecimal']['output']>;
};

export type ProjectsInput = {
  company?: InputMaybe<Scalars['UUID']['input']>;
  contractId?: InputMaybe<Scalars['String']['input']>;
  customer?: InputMaybe<ArCustomersInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  disabledEditing?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<OfficeInput>;
  prefixShortName?: InputMaybe<Scalars['String']['input']>;
  projectCode?: InputMaybe<Scalars['String']['input']>;
  projectColor?: InputMaybe<Scalars['String']['input']>;
  projectEnded?: InputMaybe<Scalars['Instant']['input']>;
  projectPercent?: InputMaybe<Scalars['BigDecimal']['input']>;
  projectStarted?: InputMaybe<Scalars['Instant']['input']>;
  projectStatusColor?: InputMaybe<Scalars['String']['input']>;
  remarks?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  total_cost?: InputMaybe<Scalars['BigDecimal']['input']>;
};

export type Province = {
  __typename?: 'Province';
  id?: Maybe<Scalars['UUID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  provinceName?: Maybe<Scalars['String']['output']>;
  region?: Maybe<Region>;
};

export type PurchaseDtoInput = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  isNew?: InputMaybe<Scalars['Boolean']['input']>;
  item?: InputMaybe<ItemInput>;
  onHandQty?: InputMaybe<Scalars['Int']['input']>;
  remarks?: InputMaybe<Scalars['String']['input']>;
  requestedQty?: InputMaybe<Scalars['Int']['input']>;
  unitMeasurement?: InputMaybe<Scalars['String']['input']>;
};

export type PurchaseIssuanceDtoInput = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  isNew?: InputMaybe<Scalars['Boolean']['input']>;
  isPosted?: InputMaybe<Scalars['Boolean']['input']>;
  issueQty?: InputMaybe<Scalars['Int']['input']>;
  item?: InputMaybe<ItemInput>;
  remarks?: InputMaybe<Scalars['String']['input']>;
  unitCost?: InputMaybe<Scalars['BigDecimal']['input']>;
};

export type PurchaseMpDtoInput = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  isNew?: InputMaybe<Scalars['Boolean']['input']>;
  isPosted?: InputMaybe<Scalars['Boolean']['input']>;
  item?: InputMaybe<ItemInput>;
  qty?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  unitCost?: InputMaybe<Scalars['BigDecimal']['input']>;
};

export type PurchaseOrder = {
  __typename?: 'PurchaseOrder';
  assets?: Maybe<Assets>;
  category?: Maybe<Scalars['String']['output']>;
  company?: Maybe<Scalars['UUID']['output']>;
  created?: Maybe<Scalars['Instant']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  etaDate?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isApprove?: Maybe<Scalars['Boolean']['output']>;
  isCompleted?: Maybe<Scalars['Boolean']['output']>;
  isVoided?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  noPr?: Maybe<Scalars['Boolean']['output']>;
  office?: Maybe<Office>;
  paymentTerms?: Maybe<PaymentTerm>;
  poNumber?: Maybe<Scalars['String']['output']>;
  prNos?: Maybe<Scalars['String']['output']>;
  preparedBy?: Maybe<Scalars['String']['output']>;
  preparedDate?: Maybe<Scalars['Instant']['output']>;
  project?: Maybe<Projects>;
  remarks?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  supplier?: Maybe<Supplier>;
  userId?: Maybe<Scalars['UUID']['output']>;
};

export type PurchaseOrderInput = {
  assets?: InputMaybe<AssetsInput>;
  category?: InputMaybe<Scalars['String']['input']>;
  company?: InputMaybe<Scalars['UUID']['input']>;
  etaDate?: InputMaybe<Scalars['Instant']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  isApprove?: InputMaybe<Scalars['Boolean']['input']>;
  isCompleted?: InputMaybe<Scalars['Boolean']['input']>;
  isVoided?: InputMaybe<Scalars['Boolean']['input']>;
  noPr?: InputMaybe<Scalars['Boolean']['input']>;
  office?: InputMaybe<OfficeInput>;
  paymentTerms?: InputMaybe<PaymentTermInput>;
  poNumber?: InputMaybe<Scalars['String']['input']>;
  prNos?: InputMaybe<Scalars['String']['input']>;
  preparedBy?: InputMaybe<Scalars['String']['input']>;
  preparedDate?: InputMaybe<Scalars['Instant']['input']>;
  project?: InputMaybe<ProjectsInput>;
  remarks?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  supplier?: InputMaybe<SupplierInput>;
  userId?: InputMaybe<Scalars['UUID']['input']>;
};

export type PurchaseOrderItems = {
  __typename?: 'PurchaseOrderItems';
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  deliveredQty?: Maybe<Scalars['Int']['output']>;
  deliveryBalance?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  item?: Maybe<Item>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  prNos?: Maybe<Scalars['String']['output']>;
  purchaseOrder?: Maybe<PurchaseOrder>;
  qtyInSmall?: Maybe<Scalars['Int']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  receivingReport?: Maybe<ReceivingReport>;
  type?: Maybe<Scalars['String']['output']>;
  type_text?: Maybe<Scalars['String']['output']>;
  unitCost?: Maybe<Scalars['BigDecimal']['output']>;
  unitMeasurement?: Maybe<Scalars['String']['output']>;
};

export type PurchaseOrderItemsInput = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  item?: InputMaybe<ItemInput>;
  prNos?: InputMaybe<Scalars['String']['input']>;
  purchaseOrder?: InputMaybe<PurchaseOrderInput>;
  qtyInSmall?: InputMaybe<Scalars['Int']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  receivingReport?: InputMaybe<ReceivingReportInput>;
  type?: InputMaybe<Scalars['String']['input']>;
  type_text?: InputMaybe<Scalars['String']['input']>;
  unitCost?: InputMaybe<Scalars['BigDecimal']['input']>;
};

export type PurchaseOrderItemsMonitoring = {
  __typename?: 'PurchaseOrderItemsMonitoring';
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  deliveredQty?: Maybe<Scalars['Int']['output']>;
  deliveryBalance?: Maybe<Scalars['Int']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  item?: Maybe<Item>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  prNos?: Maybe<Scalars['String']['output']>;
  purchaseOrder?: Maybe<PurchaseOrder>;
  qtyInSmall?: Maybe<Scalars['Int']['output']>;
  quantity?: Maybe<Scalars['Int']['output']>;
  receivingReport?: Maybe<ReceivingReport>;
  type?: Maybe<Scalars['String']['output']>;
  type_text?: Maybe<Scalars['String']['output']>;
  unitCost?: Maybe<Scalars['BigDecimal']['output']>;
  unitMeasurement?: Maybe<Scalars['String']['output']>;
};

export type PurchasePoDtoInput = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  isNew?: InputMaybe<Scalars['Boolean']['input']>;
  item?: InputMaybe<ItemInput>;
  prNos?: InputMaybe<Scalars['String']['input']>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
  type_text?: InputMaybe<Scalars['String']['input']>;
  unitCost?: InputMaybe<Scalars['BigDecimal']['input']>;
  unitMeasurement?: InputMaybe<Scalars['String']['input']>;
};

export type PurchaseRecDtoInput = {
  expirationDate?: InputMaybe<Scalars['Instant']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  inputTax?: InputMaybe<Scalars['BigDecimal']['input']>;
  isCompleted?: InputMaybe<Scalars['Boolean']['input']>;
  isDiscount?: InputMaybe<Scalars['Boolean']['input']>;
  isFg?: InputMaybe<Scalars['Boolean']['input']>;
  isNew?: InputMaybe<Scalars['Boolean']['input']>;
  isPartial?: InputMaybe<Scalars['Boolean']['input']>;
  isPosted?: InputMaybe<Scalars['Boolean']['input']>;
  isTax?: InputMaybe<Scalars['Boolean']['input']>;
  item?: InputMaybe<ItemInput>;
  netAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  receiveDiscountCost?: InputMaybe<Scalars['BigDecimal']['input']>;
  receiveQty?: InputMaybe<Scalars['Int']['input']>;
  receiveUnitCost?: InputMaybe<Scalars['BigDecimal']['input']>;
  refPoItem?: InputMaybe<PurchaseOrderItemsInput>;
  totalAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  unitMeasurement?: InputMaybe<Scalars['String']['input']>;
};

export type PurchaseRequest = {
  __typename?: 'PurchaseRequest';
  assets?: Maybe<Assets>;
  category?: Maybe<Scalars['String']['output']>;
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isApprove?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  prDateNeeded?: Maybe<Scalars['Instant']['output']>;
  prDateRequested?: Maybe<Scalars['Instant']['output']>;
  prNo?: Maybe<Scalars['String']['output']>;
  prType?: Maybe<Scalars['String']['output']>;
  project?: Maybe<Projects>;
  remarks?: Maybe<Scalars['String']['output']>;
  requestedOffice?: Maybe<Office>;
  requestingOffice?: Maybe<Office>;
  status?: Maybe<Scalars['String']['output']>;
  supplier?: Maybe<Supplier>;
  userFullname?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['UUID']['output']>;
};

export type PurchaseRequestInput = {
  assets?: InputMaybe<AssetsInput>;
  category?: InputMaybe<Scalars['String']['input']>;
  company?: InputMaybe<Scalars['UUID']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  isApprove?: InputMaybe<Scalars['Boolean']['input']>;
  prDateNeeded?: InputMaybe<Scalars['Instant']['input']>;
  prDateRequested?: InputMaybe<Scalars['Instant']['input']>;
  prNo?: InputMaybe<Scalars['String']['input']>;
  prType?: InputMaybe<Scalars['String']['input']>;
  project?: InputMaybe<ProjectsInput>;
  remarks?: InputMaybe<Scalars['String']['input']>;
  requestedOffice?: InputMaybe<OfficeInput>;
  requestingOffice?: InputMaybe<OfficeInput>;
  status?: InputMaybe<Scalars['String']['input']>;
  supplier?: InputMaybe<SupplierInput>;
  userFullname?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['UUID']['input']>;
};

export type PurchaseRequestItem = {
  __typename?: 'PurchaseRequestItem';
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  item?: Maybe<Item>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  onHandQty?: Maybe<Scalars['Int']['output']>;
  purchaseRequest?: Maybe<PurchaseRequest>;
  refPo?: Maybe<Scalars['UUID']['output']>;
  remarks?: Maybe<Scalars['String']['output']>;
  requestedQty?: Maybe<Scalars['Int']['output']>;
  unitMeasurement?: Maybe<Scalars['String']['output']>;
};

export type PurchaseRequestItemInput = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  item?: InputMaybe<ItemInput>;
  onHandQty?: InputMaybe<Scalars['Int']['input']>;
  purchaseRequest?: InputMaybe<PurchaseRequestInput>;
  refPo?: InputMaybe<Scalars['UUID']['input']>;
  remarks?: InputMaybe<Scalars['String']['input']>;
  requestedQty?: InputMaybe<Scalars['Int']['input']>;
};

export type PurchaseRtsDtoInput = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  isNew?: InputMaybe<Scalars['Boolean']['input']>;
  isPosted?: InputMaybe<Scalars['Boolean']['input']>;
  item?: InputMaybe<ItemInput>;
  returnQty?: InputMaybe<Scalars['Int']['input']>;
  returnUnitCost?: InputMaybe<Scalars['BigDecimal']['input']>;
  return_remarks?: InputMaybe<Scalars['String']['input']>;
};

export type QuantityAdjustment = {
  __typename?: 'QuantityAdjustment';
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  dateTrans?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isCancel?: Maybe<Scalars['Boolean']['output']>;
  isPosted?: Maybe<Scalars['Boolean']['output']>;
  item?: Maybe<Item>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  office?: Maybe<Office>;
  quantity?: Maybe<Scalars['Int']['output']>;
  quantityAdjustmentType?: Maybe<QuantityAdjustmentType>;
  refNum?: Maybe<Scalars['String']['output']>;
  remarks?: Maybe<Scalars['String']['output']>;
  unitMeasurement?: Maybe<Scalars['String']['output']>;
  unit_cost?: Maybe<Scalars['BigDecimal']['output']>;
  uou?: Maybe<Scalars['String']['output']>;
};

export type QuantityAdjustmentInput = {
  company?: InputMaybe<Scalars['UUID']['input']>;
  dateTrans?: InputMaybe<Scalars['Instant']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  isCancel?: InputMaybe<Scalars['Boolean']['input']>;
  isPosted?: InputMaybe<Scalars['Boolean']['input']>;
  item?: InputMaybe<ItemInput>;
  office?: InputMaybe<OfficeInput>;
  quantity?: InputMaybe<Scalars['Int']['input']>;
  quantityAdjustmentType?: InputMaybe<QuantityAdjustmentTypeInput>;
  refNum?: InputMaybe<Scalars['String']['input']>;
  remarks?: InputMaybe<Scalars['String']['input']>;
  unit_cost?: InputMaybe<Scalars['BigDecimal']['input']>;
};

export type QuantityAdjustmentType = {
  __typename?: 'QuantityAdjustmentType';
  code?: Maybe<Scalars['String']['output']>;
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  flagValue?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  is_active?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  sourceColumn?: Maybe<Scalars['String']['output']>;
};

export type QuantityAdjustmentTypeInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  company?: InputMaybe<Scalars['UUID']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  flagValue?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
  sourceColumn?: InputMaybe<Scalars['String']['input']>;
};

/** Query root */
export type Query = {
  __typename?: 'Query';
  /** List of item expense */
  ItemExpense?: Maybe<Array<Maybe<StockIssueItems>>>;
  /** Get User by login */
  account?: Maybe<Employee>;
  /** Find Ap Accounts Template Items By Parent */
  accountsItemsByParent?: Maybe<Array<Maybe<ApAccountsTemplateItems>>>;
  /** Get All Offices Active */
  activeOffices?: Maybe<Array<Maybe<Office>>>;
  /** Search Positions Active */
  activePositions?: Maybe<Array<Maybe<Position>>>;
  /** List of Shift Per emp */
  activeShift?: Maybe<Shift>;
  allItemBySupplier?: Maybe<Array<Maybe<SupplierItem>>>;
  allSupplierByItem?: Maybe<Array<Maybe<SupplierItem>>>;
  apAccountView?: Maybe<Array<Maybe<JournalEntryViewDto>>>;
  /** Find Ap Accounts Template Active */
  apAccountsTemplateActive?: Maybe<Array<Maybe<ApAccountsTemplate>>>;
  apAccountsTemplateById?: Maybe<ApAccountsTemplate>;
  /** Find Ap Accounts Template By Type */
  apAccountsTemplateByType?: Maybe<Array<Maybe<ApAccountsTemplate>>>;
  apAccountsTemplateItemById?: Maybe<ApAccountsTemplateItems>;
  /** Accounts Template List */
  apAccountsTemplateList?: Maybe<Array<Maybe<ApAccountsTemplate>>>;
  /** Find Ap Accounts Template Others */
  apAccountsTemplateOthers?: Maybe<Array<Maybe<ApAccountsTemplate>>>;
  /** Transaction List */
  apAccountsTemplatePage?: Maybe<Page_ApAccountsTemplate>;
  apAgingDetailed?: Maybe<Array<Maybe<ApAgingDetailedDto>>>;
  apAgingSummary?: Maybe<Array<Maybe<ApAgingSummaryDto>>>;
  apAppByDis?: Maybe<Array<Maybe<DisbursementAp>>>;
  apApplicationById?: Maybe<DisbursementAp>;
  /** Find Ap that has beginning */
  apBeginning?: Maybe<Scalars['Boolean']['output']>;
  apByDis?: Maybe<Array<Maybe<DisbursementAp>>>;
  apById?: Maybe<AccountsPayable>;
  apDebitMemo?: Maybe<Array<Maybe<DisbursementAp>>>;
  apDetailsById?: Maybe<AccountsPayableDetails>;
  apLedger?: Maybe<Array<Maybe<ApLedgerDto>>>;
  apLedgerById?: Maybe<ApLedger>;
  /** Find Ap Ledger Include */
  apLedgerByRef?: Maybe<ApLedger>;
  /** Find Ap Transaction Active */
  apLedgerBySupplier?: Maybe<Array<Maybe<ApLedger>>>;
  /** Transaction List */
  apLedgerFilter?: Maybe<Array<Maybe<ApLedger>>>;
  /** Find Ap Ledger Include */
  apLedgerInclude?: Maybe<Array<Maybe<ApLedger>>>;
  /** List of AP Pageable By Supplier */
  apListBySupplier?: Maybe<Array<Maybe<AccountsPayable>>>;
  /** List of AP Pageable By Supplier */
  apListBySupplierFilter?: Maybe<Page_AccountsPayable>;
  /** List of AP Pageable */
  apListFilter?: Maybe<Page_AccountsPayable>;
  /** Find Ap posted */
  apListPosted?: Maybe<Array<Maybe<AccountsPayable>>>;
  apReapplication?: Maybe<Array<Maybe<DisbursementAp>>>;
  /** Find Ap reference Type */
  apReferenceType?: Maybe<Array<Maybe<ApReferenceDto>>>;
  /** Find Ap Transaction Active */
  apTransactionActive?: Maybe<Array<Maybe<ApTransaction>>>;
  apTransactionById?: Maybe<ApTransaction>;
  /** Find Ap Transaction Active */
  apTransactionByType?: Maybe<Array<Maybe<ApTransaction>>>;
  /** Transaction List */
  apTransactionList?: Maybe<Array<Maybe<ApTransaction>>>;
  /** Find Ap Transaction Active */
  apTransactionOthers?: Maybe<Array<Maybe<ApTransaction>>>;
  /** Transaction List */
  apTransactionPage?: Maybe<Page_ApTransaction>;
  arInvoiceItemUUIDList?: Maybe<Array<Maybe<Scalars['UUID']['output']>>>;
  arTransactionLedgerPage?: Maybe<Page_ArTransactionLedger>;
  assetById?: Maybe<Assets>;
  assetList?: Maybe<Array<Maybe<Assets>>>;
  assetListPageable?: Maybe<Page_Assets>;
  assetMaintenanceTypeListPageable?: Maybe<Page_AssetMaintenanceTypes>;
  assetPreventiveMaintenanceById?: Maybe<AssetPreventiveMaintenance>;
  assetRepairMaintenanceById?: Maybe<AssetRepairMaintenance>;
  assetRepairMaintenanceItemById?: Maybe<AssetRepairMaintenanceItems>;
  assetRepairMaintenanceItemListPageable?: Maybe<Page_AssetRepairMaintenanceItems>;
  assetRepairMaintenanceListPageable?: Maybe<Page_AssetRepairMaintenance>;
  /** Get all Authorities */
  authorities?: Maybe<Array<Maybe<Authority>>>;
  bankById?: Maybe<Bank>;
  bankList?: Maybe<Array<Maybe<Bank>>>;
  banks?: Maybe<Page_Bank>;
  barangayByCity?: Maybe<Array<Maybe<Barangay>>>;
  barangayFilter?: Maybe<Array<Maybe<Barangay>>>;
  /** List of Beginning Balance by Item */
  beginningListByItem?: Maybe<Array<Maybe<BeginningBalance>>>;
  billingAllByFiltersPage?: Maybe<Page_Billing>;
  billingByFiltersPage?: Maybe<Page_Billing>;
  billingByFiltersPageProjects?: Maybe<Page_Billing>;
  billingById?: Maybe<Billing>;
  billingByProject?: Maybe<Billing>;
  billingByRef?: Maybe<BillingItem>;
  billingItemByDateType?: Maybe<Array<Maybe<BillingItem>>>;
  billingItemById?: Maybe<BillingItem>;
  billingItemByParent?: Maybe<Array<Maybe<BillingItem>>>;
  billingItemByParentType?: Maybe<Array<Maybe<BillingItem>>>;
  billingOTCByFiltersPage?: Maybe<Page_Billing>;
  cashFlowReport?: Maybe<Array<Maybe<CashFlowDto>>>;
  chargeInvoiceAll?: Maybe<Array<Maybe<ChargeInvoice>>>;
  chargeInvoiceList?: Maybe<Array<Maybe<ChargeInvoice>>>;
  /** List of Charged Items */
  chargedItems?: Maybe<Array<Maybe<ChargeItemsDto>>>;
  checkBalancesByPO?: Maybe<Array<Maybe<PurchaseOrderItemsMonitoring>>>;
  /** Filter Checks */
  checksFilter?: Maybe<Page_DisbursementCheck>;
  cityByProvince?: Maybe<Array<Maybe<City>>>;
  cityFilter?: Maybe<Array<Maybe<City>>>;
  comById?: Maybe<CompanySettings>;
  /** Get All Active Company Offices  */
  companyActiveOffices?: Maybe<Array<Maybe<Office>>>;
  companyList?: Maybe<Array<Maybe<CompanySettings>>>;
  companyListSelection?: Maybe<Array<Maybe<CompanySettings>>>;
  companyPage?: Maybe<Page_CompanySettings>;
  counters?: Maybe<Array<Maybe<Counter>>>;
  /** Search all countries */
  countries?: Maybe<Array<Maybe<Country>>>;
  /** Search all countries */
  countriesByFilter?: Maybe<Array<Maybe<Country>>>;
  creditNoteItemUUIDList?: Maybe<Array<Maybe<Scalars['UUID']['output']>>>;
  customerAll?: Maybe<Array<Maybe<Customer>>>;
  customerAssets?: Maybe<Array<Maybe<Customer>>>;
  customerBalance?: Maybe<Scalars['BigDecimal']['output']>;
  customerList?: Maybe<Array<Maybe<Customer>>>;
  customerListAssets?: Maybe<Array<Maybe<Customer>>>;
  customerRemainingBalance?: Maybe<ArTransactionLedgerRemainingBalanceDto>;
  debitMemoById?: Maybe<DebitMemo>;
  /** List of DM Pageable */
  debitMemoFilter?: Maybe<Page_DebitMemo>;
  /** Find Ap posted */
  detailsByAp?: Maybe<Array<Maybe<AccountsPayableDetails>>>;
  disAccountView?: Maybe<Array<Maybe<JournalEntryViewDto>>>;
  disCheckById?: Maybe<DisbursementCheck>;
  /** Find DisbursementCheck by Parent */
  disCheckByParent?: Maybe<Array<Maybe<DisbursementCheck>>>;
  disExpById?: Maybe<DisbursementExpense>;
  /** Find DisbursementExpense by Parent */
  disExpByParent?: Maybe<Array<Maybe<DisbursementExpense>>>;
  /** Find Ap reference Type */
  disReferenceType?: Maybe<Array<Maybe<ApReferenceDto>>>;
  disWtxById?: Maybe<DisbursementWtx>;
  /** Find DisbursementWtx by Parent */
  disWtxByParent?: Maybe<Array<Maybe<DisbursementWtx>>>;
  disbursementById?: Maybe<Disbursement>;
  /** List of Disbursement Pageable */
  disbursementFilter?: Maybe<Page_Disbursement>;
  /** List of AP Pageable By Supplier */
  disbursementFilterPosted?: Maybe<Page_Disbursement>;
  dmAccountView?: Maybe<Array<Maybe<JournalEntryViewDto>>>;
  dmDetailsById?: Maybe<DebitMemoDetails>;
  dmDetials?: Maybe<Array<Maybe<DebitMemoDetails>>>;
  /** Find Ap reference Type */
  dmReferenceType?: Maybe<Array<Maybe<ApReferenceDto>>>;
  /** List of Document Type */
  documentTypeList?: Maybe<Array<Maybe<DocumentTypes>>>;
  /** Get Employee By Id */
  employee?: Maybe<Employee>;
  employeeByFilter?: Maybe<Array<Maybe<Employee>>>;
  /** get employee by id */
  employeeById?: Maybe<Employee>;
  /** Get Employee By Pin Code */
  employeeByPinCode?: Maybe<Employee>;
  /** Get All Employees */
  employees?: Maybe<Array<Maybe<Employee>>>;
  /** Transaction List */
  exTransList?: Maybe<Array<Maybe<ExpenseTransaction>>>;
  expenseTypeById?: Maybe<ExpenseTransaction>;
  /** get all fetch allowance */
  fetchAllAllowance?: Maybe<Array<Maybe<Allowance>>>;
  /** get all fetch allowance package */
  fetchAllAllowancePackage?: Maybe<Array<Maybe<AllowancePackage>>>;
  fetchAllOtherDeduction?: Maybe<Array<Maybe<OtherDeductionTypes>>>;
  /** fetch all allowance Item */
  fetchAllowanceItemByPackagePageable?: Maybe<Page_AllowanceItem>;
  /** fetch all allowance Item */
  fetchAllowanceItemPageable?: Maybe<Page_AllowanceItem>;
  /** fetch all allowance package */
  fetchAllowancePackagePageable?: Maybe<Page_AllowancePackage>;
  /** get all allowance */
  fetchAllowancePageable?: Maybe<Page_Allowance>;
  /** List of filtered quantity adjustment type */
  filterAdjustmentType?: Maybe<Array<Maybe<QuantityAdjustmentType>>>;
  findAllARPaymentPosting?: Maybe<Page_ArPaymentPosting>;
  findAllAssetPreventiveMaintenance?: Maybe<Array<Maybe<AssetPreventiveMaintenance>>>;
  findAllAssetRepairMaintenance?: Maybe<Array<Maybe<AssetRepairMaintenance>>>;
  findAllAssetRepairMaintenanceItems?: Maybe<Array<Maybe<AssetRepairMaintenanceItems>>>;
  findAllAssets?: Maybe<Array<Maybe<Assets>>>;
  findAllCreditNote?: Maybe<Page_ArCreditNote>;
  findAllCustomerList?: Maybe<Array<Maybe<ArCustomers>>>;
  findAllCustomers?: Maybe<Page_ArCustomers>;
  findAllInvoice?: Maybe<Page_ArInvoice>;
  findAllInvoiceItemUUIDById?: Maybe<Array<Maybe<Scalars['UUID']['output']>>>;
  findAllInvoiceItemsByInvoice?: Maybe<Array<Maybe<ArInvoiceItems>>>;
  findAllInvoiceOutstandingBal?: Maybe<Array<Maybe<ArInvoiceWithOutstandingBal>>>;
  findAllInvoiceOutstandingBalForCreditNote?: Maybe<Array<Maybe<ArInvoiceWithOutstandingBalForCreditNote>>>;
  findAllInvoiceParticulars?: Maybe<Page_ArInvoiceParticulars>;
  findAllPaymentPostingItemByPaymentPostingId?: Maybe<Array<Maybe<ArPaymentPostingItems>>>;
  findAllPaymentPostingItemDiscByPaymentPostingId?: Maybe<Array<Maybe<ArPaymentPostingItems>>>;
  findAllPromissoryOutstandingBal?: Maybe<Array<Maybe<ArInvoiceWithOutstandingBal>>>;
  findByItemOffice?: Maybe<OfficeItem>;
  findByPaymentTracker?: Maybe<Array<Maybe<ArPaymentPosting>>>;
  findCreditNoteItems?: Maybe<Page_ArCreditNoteItems>;
  findCreditNoteItemsByCNId?: Maybe<Array<Maybe<ArCreditNoteItems>>>;
  findCreditNoteItemsByCNIdByItemType?: Maybe<Array<Maybe<ArCreditNoteItems>>>;
  findCreditNoteItemsByCustomer?: Maybe<Page_ArCreditNoteItems>;
  findDuplicate?: Maybe<SupplierItem>;
  /** Find Fiscal By id */
  findFiscalActive?: Maybe<Fiscal>;
  findHeaderLedgerLedger?: Maybe<Array<Maybe<LedgerEntry>>>;
  findInvoiceCreditNote?: Maybe<Array<Maybe<ArAllocatedCreditNote>>>;
  findInvoiceItemsByCustomer?: Maybe<Page_ArInvoiceItems>;
  findInvoiceItemsByInvoice?: Maybe<Page_ArInvoiceItems>;
  findInvoicePayments?: Maybe<Array<Maybe<ArPaymentPosting>>>;
  findOneARPaymentPosting?: Maybe<ArPaymentPosting>;
  findOneARPaymentPostingItems?: Maybe<ArPaymentPostingItems>;
  /** find Adjustment Type */
  findOneAdjustmentType?: Maybe<QuantityAdjustmentType>;
  findOneArAllocatedCN?: Maybe<ArAllocatedCreditNote>;
  findOneArInvoiceParticulars?: Maybe<ArInvoiceParticulars>;
  findOneByRefId?: Maybe<Wtx2307>;
  findOneCreditNote?: Maybe<ArCreditNote>;
  findOneCustomer?: Maybe<ArCustomers>;
  findOneHeaderLedger?: Maybe<HeaderLedger>;
  findOneInvoice?: Maybe<ArInvoice>;
  findOneInvoiceItems?: Maybe<ArInvoiceItems>;
  findOneProjectWorkAccomplish?: Maybe<ProjectWorkAccomplish>;
  findOneProjectWorkAccomplishItems?: Maybe<ProjectWorkAccomplishItems>;
  /** find signature by id */
  findOneSignature?: Maybe<Signature>;
  findPNCreditNote?: Maybe<Array<Maybe<ArAllocatedCreditNote>>>;
  findPNPayments?: Maybe<Array<Maybe<ArPaymentPosting>>>;
  findPendingCNPerInvoice?: Maybe<ArCreditNote>;
  findPostedCNPerInvoice?: Maybe<Array<Maybe<ArCreditNote>>>;
  fiscalById?: Maybe<Fiscal>;
  fiscals?: Maybe<Page_Fiscal>;
  fixedAssetItemList?: Maybe<Array<Maybe<Item>>>;
  generateGeneralLedgerDetailedSummary?: Maybe<Array<Maybe<GeneralLedgerListDto>>>;
  generateGeneralLedgerDetails?: Maybe<Array<Maybe<GeneralLedgerDetailsListDto>>>;
  generateGeneralLedgerSummary?: Maybe<Array<Maybe<GeneralLedgerListDto>>>;
  genericActive?: Maybe<Array<Maybe<Generic>>>;
  genericList?: Maybe<Array<Maybe<Generic>>>;
  getARInvoiceItemPerId?: Maybe<Array<Maybe<ArInvoiceDto>>>;
  getAccumulatedLogs?: Maybe<Array<Maybe<AccumulatedLogs>>>;
  getActiveProjects?: Maybe<Array<Maybe<Projects>>>;
  getAdjustmentCategories?: Maybe<Array<Maybe<AdjustmentCategory>>>;
  getAdjustmentEmployees?: Maybe<Page_PayrollEmployeeAdjustmentDto>;
  getAdjustmentEmployeesList?: Maybe<Array<Maybe<PayrollEmployeeAdjustmentDto>>>;
  getAllAmounts?: Maybe<Scalars['BigDecimal']['output']>;
  getAllCOAParent?: Maybe<Array<Maybe<DomainOptionDto>>>;
  getAllChartOfAccountGenerate?: Maybe<Array<Maybe<ChartOfAccountGenerate>>>;
  /** Get All Employees */
  getAllEmployeesBasic?: Maybe<Array<Maybe<EmployeeBasicDetails>>>;
  getAllOpenProjectWorkAccomplishPageByProject?: Maybe<Array<Maybe<ProjectWorkAccomplish>>>;
  /** Get allowance by ID */
  getAllowanceByPayrollId?: Maybe<PayrollAllowance>;
  getAllowancePackageById?: Maybe<AllowancePackage>;
  getAmounts?: Maybe<Scalars['BigDecimal']['output']>;
  getAmountsDeduct?: Maybe<Scalars['BigDecimal']['output']>;
  getAttTypeByDate?: Maybe<Array<Maybe<EmployeeAttendance>>>;
  getAutoIntegrateableFromDomain?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  getBalance?: Maybe<Scalars['BigDecimal']['output']>;
  getBigDecimalFieldsFromDomain?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  getBillingItemFilterActive?: Maybe<Array<Maybe<BillingItem>>>;
  getBrands?: Maybe<Array<Maybe<BrandDto>>>;
  /** Get all calendar events */
  getCalendarEvents?: Maybe<Array<Maybe<EventCalendar>>>;
  getCategoryProjects?: Maybe<Array<Maybe<CategoryDto>>>;
  /** Get getCoaById */
  getCoaById?: Maybe<ParentAccount>;
  /** Get contribution by ID */
  getContributionByPayrollId?: Maybe<GraphQlResVal_PayrollContribution>;
  /** Get contribution by ID, this query is pagable */
  getContributionEmployeesByPayrollId?: Maybe<GraphQlResVal_Page_PayrollEmployeeContributionDto>;
  getDocTypeById?: Maybe<DocumentTypes>;
  getEmployeeAllowance?: Maybe<Array<Maybe<EmployeeAllowance>>>;
  getEmployeeAllowanceItemsInIds?: Maybe<Array<Maybe<Employee>>>;
  getEmployeeLeaveByEmp?: Maybe<Array<Maybe<EmployeeLeave>>>;
  getEmployeeLeavePageable?: Maybe<Page_EmployeeLeaveDto>;
  getEmployeeLoanConfig?: Maybe<EmployeeLoanConfig>;
  getEmployeeLoanLedger?: Maybe<Page_EmployeeLoanLedgerDto>;
  getEmployeeLoansByEmployee?: Maybe<Page_EmployeeLoan>;
  /** Search employees */
  getEmployeeScheduleByFilter?: Maybe<Array<Maybe<EmployeeScheduleDto>>>;
  /** Search employees */
  getEmployeeScheduleDetails?: Maybe<EmployeeScheduleDetailsDto>;
  /** Filter Event Calendar between two dates. */
  getEventsBetweenTwoDates?: Maybe<Array<Maybe<EventCalendar>>>;
  getFixedAssetPageable?: Maybe<Page_FixedAssetItems>;
  getGeneralLedger?: Maybe<GeneralLedgerDtoContainer>;
  /** Get Group Policy by name */
  getGroupPolicyById?: Maybe<GroupPolicy>;
  /** Get allowance by ID */
  getHDMFContributions?: Maybe<Array<Maybe<HdmfContribution>>>;
  getInventoryInfo?: Maybe<InventoryInfoDto>;
  getItemByName?: Maybe<Array<Maybe<Item>>>;
  getItemDiscountable?: Maybe<Array<Maybe<BillingItem>>>;
  getJobByPlateNo?: Maybe<Job>;
  getLedgerByHeaderId?: Maybe<Array<Maybe<Ledger>>>;
  getLedgerByRef?: Maybe<Array<Maybe<InventoryLedger>>>;
  getLegerByDoc?: Maybe<Array<Maybe<InventoryLedger>>>;
  getLoanScheduleById?: Maybe<Page_LoanAmortization>;
  getMaterialByRefStockCard?: Maybe<ProjectUpdatesMaterials>;
  getOnHandByItem?: Maybe<Inventory>;
  getOneRawLog?: Maybe<EmployeeAttendance>;
  getOpenProjectWorkAccomplishPageByProject?: Maybe<Array<Maybe<ProjectWorkAccomplish>>>;
  getOtherDeduction?: Maybe<Array<Maybe<OtherDeductionTypes>>>;
  getOtherDeductionEmployees?: Maybe<Page_PayrollEmployeeOtherDeductionDto>;
  getOtherDeductionEmployeesList?: Maybe<Array<Maybe<PayrollEmployeeOtherDeductionDto>>>;
  getOtherDeductionPageable?: Maybe<Page_OtherDeductionTypes>;
  /** Get allowance by ID */
  getPHICContributions?: Maybe<Array<Maybe<PhicContribution>>>;
  getPOMonitoringByPoItemFilter?: Maybe<Array<Maybe<PoDeliveryMonitoring>>>;
  getPOMonitoringByRec?: Maybe<Array<Maybe<PoDeliveryMonitoring>>>;
  /** Get getCoaById */
  getParentAccountList?: Maybe<Array<Maybe<ParentAccount>>>;
  getPayrollAdjustmentById?: Maybe<PayrollAdjustment>;
  /** Get payroll by ID */
  getPayrollById?: Maybe<Payroll>;
  /** list of all allowances with pagination */
  getPayrollByPagination?: Maybe<Page_Payroll>;
  getPayrollEmployeeAllowance?: Maybe<Page_PayrollEmployeeAllowanceDto>;
  /** Gets all the ids of the employees of the Payroll */
  getPayrollEmployeeIds?: Maybe<Array<Maybe<Scalars['UUID']['output']>>>;
  /** Gets the loan employees by payroll id */
  getPayrollEmployeeLoan?: Maybe<Page_PayrollEmployeeLoanDto>;
  /** Gets all the employees by payroll id */
  getPayrollEmployees?: Maybe<Array<Maybe<PayrollEmployeeListDto>>>;
  /** Gets all the employees by payroll id */
  getPayrollHRMEmployees?: Maybe<Array<Maybe<Employee>>>;
  /** Get loan by ID */
  getPayrollLoanById?: Maybe<PayrollLoan>;
  /** Get loan by ID */
  getPayrollLoanByPayrollId?: Maybe<PayrollLoan>;
  getPayrollOtherDeductionById?: Maybe<PayrollOtherDeduction>;
  /** Get otherDeduction by ID */
  getPayrollOtherDeductionByPayrollId?: Maybe<PayrollOtherDeduction>;
  getPlateNo?: Maybe<Array<Maybe<PlateNumberDto>>>;
  getPrItemByPoId?: Maybe<Array<Maybe<PurchaseRequestItem>>>;
  getPrItemInPO?: Maybe<Array<Maybe<PurchaseRequestItem>>>;
  getProjectMaterialsByMilestone?: Maybe<Array<Maybe<ProjectUpdatesMaterials>>>;
  getProjectWorkAccomplishItemsByGroupId?: Maybe<Array<Maybe<ProjectWorkAccomplishItems>>>;
  getProjectWorkAccomplishPageByProject?: Maybe<Array<Maybe<ProjectWorkAccomplish>>>;
  /** Find Ap posted */
  getReapplicationStatus?: Maybe<Array<Maybe<Reapplication>>>;
  /** get sss contributions */
  getSSSContributions?: Maybe<Array<Maybe<SssContribution>>>;
  /** Get the values of salary rate multiplier. */
  getSalaryRateMultiplier?: Maybe<SalaryRateMultiplier>;
  /** Get employee Attendance saved from database. */
  getSavedEmployeeAttendance?: Maybe<Page_EmployeeAttendance>;
  getScheduleLock?: Maybe<Scalars['Map_String_ScheduleLockScalar']['output']>;
  /** get all schedule type config */
  getScheduleTypes?: Maybe<Array<Maybe<Schedule>>>;
  getSetupBySubAccountTypeAll?: Maybe<Array<Maybe<SubAccountSetup>>>;
  getSpecificFieldsFromDomain?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  getSrrByDateRange?: Maybe<Array<Maybe<ReceivingReport>>>;
  /** List of receiving report list per date range */
  getSrrItemByDateRange?: Maybe<Array<Maybe<ReceivingReportItem>>>;
  getStringFieldsFromDomain?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  getSubAccountForParent?: Maybe<Array<Maybe<SubAccountSetup>>>;
  /** Get All timekeepings */
  getTimekeepingAndEmployees?: Maybe<Timekeeping>;
  /** Get timekeeping by ID */
  getTimekeepingById?: Maybe<Timekeeping>;
  /** Get timekeeping by ID */
  getTimekeepingByPayrollId?: Maybe<Timekeeping>;
  /** Gets all the ids of the employees of the timekeeping */
  getTimekeepingEmployeeLogs?: Maybe<Array<Maybe<AccumulatedLogs>>>;
  /** Gets the timekeeping employees by payroll id */
  getTimekeepingEmployees?: Maybe<Array<Maybe<TimekeepingEmployeeDto>>>;
  /** Gets all the ids of the employees of the timekeeping */
  getTimekeepingEmployeesV2?: Maybe<Array<Maybe<TimekeepingEmployee>>>;
  getTotalMaterials?: Maybe<Scalars['BigDecimal']['output']>;
  getTotals?: Maybe<Scalars['BigDecimal']['output']>;
  getUnitProjects?: Maybe<Array<Maybe<UnitDto>>>;
  getWithholdingTaxMatrix?: Maybe<Array<Maybe<WithholdingTaxMatrix>>>;
  /** Get all Group Policies */
  groupPolicies?: Maybe<Array<Maybe<GroupPolicy>>>;
  /** List of  grouped account types */
  groupedAccountTypes?: Maybe<Array<Maybe<AccountTypeDto>>>;
  hciInvoiceItemTotalCWT?: Maybe<Scalars['BigDecimal']['output']>;
  hciInvoiceItemTotalVat?: Maybe<Scalars['BigDecimal']['output']>;
  headerLedgerTotal?: Maybe<LedgerTotalDebitCredit>;
  insuranceActive?: Maybe<Array<Maybe<Insurances>>>;
  insuranceAll?: Maybe<Array<Maybe<Insurances>>>;
  insuranceList?: Maybe<Array<Maybe<Insurances>>>;
  integrationById?: Maybe<Integration>;
  integrationDomains?: Maybe<Array<Maybe<DomainOptionDto>>>;
  integrationGroupItemList?: Maybe<Page_Integration>;
  integrationGroupList?: Maybe<Array<Maybe<IntegrationGroup>>>;
  integrationItemsByIntegrationId?: Maybe<Page_IntegrationItem>;
  /** Integration List */
  integrationList?: Maybe<Array<Maybe<Integration>>>;
  inventoryListPageable?: Maybe<Page_Inventory>;
  inventoryListPageableByDep?: Maybe<Page_Inventory>;
  inventoryOutputPageable?: Maybe<Page_Inventory>;
  inventorySourcePageable?: Maybe<Page_Inventory>;
  inventorySupplierListPageable?: Maybe<Page_SupplierInventory>;
  invoiceItemAmountSum?: Maybe<Scalars['BigDecimal']['output']>;
  /** Check if username exists */
  isLoginUnique?: Maybe<Scalars['Boolean']['output']>;
  /** Check if pincode exists */
  isPinCodeUnique?: Maybe<Scalars['Boolean']['output']>;
  itemActive?: Maybe<Array<Maybe<Item>>>;
  itemByFiltersPage?: Maybe<Page_Item>;
  itemById?: Maybe<Item>;
  itemCategoryActive?: Maybe<Array<Maybe<ItemCategory>>>;
  itemCategoryList?: Maybe<Array<Maybe<ItemCategory>>>;
  itemGroupActive?: Maybe<Array<Maybe<ItemGroup>>>;
  itemGroupList?: Maybe<Array<Maybe<ItemGroup>>>;
  itemList?: Maybe<Array<Maybe<Item>>>;
  itemListActive?: Maybe<Array<Maybe<Item>>>;
  itemListByOffice?: Maybe<Array<Maybe<Inventory>>>;
  itemSubAccountActive?: Maybe<Array<Maybe<ItemSubAccount>>>;
  itemSubAccountList?: Maybe<Array<Maybe<ItemSubAccount>>>;
  itemsActivePage?: Maybe<Page_Item>;
  itemsByFilterOnly?: Maybe<Page_Item>;
  jobByFiltersPage?: Maybe<Page_Job>;
  jobById?: Maybe<Job>;
  jobCountStatus?: Maybe<Scalars['BigDecimal']['output']>;
  jobItemById?: Maybe<JobItems>;
  jobItemByItems?: Maybe<Array<Maybe<JobItems>>>;
  jobItemByParent?: Maybe<Array<Maybe<JobItems>>>;
  jobItemByServiceCategory?: Maybe<Array<Maybe<JobItems>>>;
  jobList?: Maybe<Array<Maybe<Job>>>;
  jobOrderByAssetList?: Maybe<Array<Maybe<JobOrder>>>;
  jobOrderById?: Maybe<JobOrder>;
  jobOrderItemById?: Maybe<JobOrderItems>;
  jobOrderItemByParent?: Maybe<Array<Maybe<JobOrderItems>>>;
  jobOrderList?: Maybe<Array<Maybe<JobOrder>>>;
  jobOrderListFilterPageable?: Maybe<Page_JobOrder>;
  jobOrderListPageable?: Maybe<Page_JobOrder>;
  jobStatusActive?: Maybe<Array<Maybe<JobStatus>>>;
  jobStatusAll?: Maybe<Array<Maybe<JobStatus>>>;
  jobStatusList?: Maybe<Array<Maybe<JobStatus>>>;
  jobTypeUnits?: Maybe<ItemJobsDto>;
  ledgerView?: Maybe<Array<Maybe<JournalEntryViewDto>>>;
  /** Ledger View Listing */
  ledgerViewList?: Maybe<LedgerViewContainer>;
  /** Ledger View Listing */
  ledgerViewListV2?: Maybe<LedgerView>;
  loanMCostOFLoan?: Maybe<Scalars['BigDecimal']['output']>;
  loanMFV?: Maybe<Scalars['BigDecimal']['output']>;
  loanMIPMT?: Maybe<Scalars['BigDecimal']['output']>;
  loanMInterestRate?: Maybe<Scalars['BigDecimal']['output']>;
  loanMLoanAmortization?: Maybe<Array<Maybe<Scalars['Map_String_ObjectScalar']['output']>>>;
  loanMLoanPayments?: Maybe<Scalars['Map_String_ObjectScalar']['output']>;
  loanMNumberOfPayments?: Maybe<Scalars['Int']['output']>;
  /** One of the financial functions, calculates the payment for a loan based on constant payments and a constant interest rate. */
  loanMPMT?: Maybe<Scalars['Map_String_BigDecimalScalar']['output']>;
  loanMViewPaidLoan?: Maybe<GraphQlRetVal_List_Map_String_Object>;
  loanMViewPostingEntry?: Maybe<GraphQlRetVal_List_Map_String_Object>;
  loanManagementById?: Maybe<GraphQlRetVal_Loan>;
  loanManagements?: Maybe<Page_Loan>;
  /** Filter Event Calendar between two dates. */
  mapEventsToDates?: Maybe<Scalars['Map_String_List_EventCalendarScalar']['output']>;
  monById?: Maybe<PurchaseOrderItemsMonitoring>;
  mpByFiltersPage?: Maybe<Page_MaterialProduction>;
  mpById?: Maybe<MaterialProduction>;
  mpItemById?: Maybe<MaterialProductionItem>;
  mpItemByParent?: Maybe<Array<Maybe<MaterialProductionItem>>>;
  /** Get All My Notifications */
  mynotifications?: Maybe<Array<Maybe<Notification>>>;
  /** Get All My Notifications */
  myownnotifications?: Maybe<Array<Maybe<Notification>>>;
  /** netSales */
  netSales?: Maybe<Scalars['BigDecimal']['output']>;
  /** Get Office By Id */
  officeById?: Maybe<Office>;
  /** Search Offices */
  officeListByFilter?: Maybe<Array<Maybe<Office>>>;
  officeListByItem?: Maybe<Array<Maybe<OfficeItem>>>;
  /** Search Offices */
  officePage?: Maybe<Page_Office>;
  /** Search Offices */
  officePageList?: Maybe<Page_Office>;
  /** Get All Offices */
  officesList?: Maybe<Array<Maybe<Office>>>;
  onHandReport?: Maybe<Array<Maybe<OnHandReport>>>;
  othersById?: Maybe<PettyCashOther>;
  othersByPetty?: Maybe<Array<Maybe<PettyCashOther>>>;
  /** List of Payments By shift ID */
  outputTax?: Maybe<Scalars['BigDecimal']['output']>;
  pCostById?: Maybe<ProjectCost>;
  pCostByList?: Maybe<Array<Maybe<ProjectCost>>>;
  pCostRevById?: Maybe<ProjectCostRevisions>;
  pCostRevByList?: Maybe<Array<Maybe<ProjectCostRevisions>>>;
  pMaterialById?: Maybe<ProjectUpdatesMaterials>;
  pMaterialByList?: Maybe<Array<Maybe<ProjectUpdatesMaterials>>>;
  pMaterialByPage?: Maybe<Page_ProjectUpdatesMaterials>;
  pProgressById?: Maybe<ProjectProgress>;
  pProgressByList?: Maybe<Array<Maybe<ProjectProgress>>>;
  pProgressByListNotIn?: Maybe<Array<Maybe<ProjectProgress>>>;
  pProgressByPage?: Maybe<Page_ProjectProgress>;
  pProgressImageById?: Maybe<ProjectProgressImages>;
  pProgressImagesByList?: Maybe<Array<Maybe<ProjectProgressImages>>>;
  pUpdatesById?: Maybe<ProjectUpdates>;
  pUpdatesByList?: Maybe<Array<Maybe<ProjectUpdates>>>;
  pUpdatesByListNotIn?: Maybe<Array<Maybe<ProjectUpdates>>>;
  pUpdatesByPage?: Maybe<Page_ProjectUpdates>;
  pUpdatesWorkerById?: Maybe<ProjectUpdatesWorkers>;
  pUpdatesWorkersByList?: Maybe<Array<Maybe<ProjectUpdatesWorkers>>>;
  /** List of Mother Accounts */
  parentAccountPageable?: Maybe<Page_ParentAccount>;
  /** List of parents account */
  parentAccountsPerCategory?: Maybe<Array<Maybe<AccountTypeDto>>>;
  /** List of Payments By Billing ID */
  paymentByBillingId?: Maybe<Array<Maybe<Payment>>>;
  /** List of Payments By shift ID */
  paymentItems?: Maybe<Array<Maybe<PaymentItems>>>;
  paymentTermActive?: Maybe<Array<Maybe<PaymentTerm>>>;
  paymentTermList?: Maybe<Array<Maybe<PaymentTerm>>>;
  /** List of Payments By shift ID */
  paymentsByShift?: Maybe<Array<Maybe<Payment>>>;
  /** Get All payroll */
  payrolls?: Maybe<Array<Maybe<Payroll>>>;
  /** Find Ap reference Type */
  pcReferenceType?: Maybe<Array<Maybe<ApReferenceDto>>>;
  /** Get all Permissions */
  permissions?: Maybe<Array<Maybe<Permission>>>;
  pettyCashAccountView?: Maybe<Array<Maybe<JournalEntryViewDto>>>;
  pettyCashAccountingById?: Maybe<PettyCashAccounting>;
  pettyCashAll?: Maybe<Array<Maybe<PettyCash>>>;
  pettyCashById?: Maybe<PettyCash>;
  pettyCashItemById?: Maybe<PettyCashItem>;
  pettyCashList?: Maybe<Array<Maybe<PettyCash>>>;
  pettyCashListByDate?: Maybe<Array<Maybe<PettyCash>>>;
  pettyCashListByProject?: Maybe<Array<Maybe<PettyCash>>>;
  pettyCashListPosted?: Maybe<Array<Maybe<PettyCash>>>;
  /** Find Distinct Payee Name */
  pettyCashName?: Maybe<Array<Maybe<PettyCashName>>>;
  pettyCashPage?: Maybe<Page_PettyCashAccounting>;
  pettyTypeActive?: Maybe<Array<Maybe<PettyType>>>;
  pettyTypeAll?: Maybe<Array<Maybe<PettyType>>>;
  pettyTypeList?: Maybe<Array<Maybe<PettyType>>>;
  poByFiltersPage?: Maybe<Page_PurchaseOrder>;
  poById?: Maybe<PurchaseOrder>;
  poItemById?: Maybe<PurchaseOrderItems>;
  poItemByParent?: Maybe<Array<Maybe<PurchaseOrderItems>>>;
  poItemMonitoringByParentFilter?: Maybe<Array<Maybe<PurchaseOrderItemsMonitoring>>>;
  poItemNotReceive?: Maybe<Array<Maybe<PurchaseOrderItems>>>;
  poItemNotReceiveMonitoring?: Maybe<Array<Maybe<PurchaseOrderItemsMonitoring>>>;
  poList?: Maybe<Array<Maybe<PurchaseOrder>>>;
  poNotYetCompleted?: Maybe<Array<Maybe<PurchaseOrder>>>;
  /** Search Positions */
  positionByFilter?: Maybe<Array<Maybe<Position>>>;
  /** Get Position By Id */
  positionById?: Maybe<Position>;
  /** Get All Positions */
  positionList?: Maybe<Array<Maybe<Position>>>;
  /** Search Positions */
  positionPage?: Maybe<Page_Position>;
  prByFiltersPage?: Maybe<Page_PurchaseRequest>;
  prById?: Maybe<PurchaseRequest>;
  prItemById?: Maybe<PurchaseRequestItem>;
  prItemByParent?: Maybe<Array<Maybe<PurchaseRequestItem>>>;
  prItemNoPo?: Maybe<Array<Maybe<PurchaseRequest>>>;
  preventiveByAsset?: Maybe<Page_AssetPreventiveMaintenance>;
  /** Filter Checks */
  printChecks?: Maybe<Page_DisbursementCheck>;
  projectById?: Maybe<Projects>;
  projectByOffice?: Maybe<Array<Maybe<Projects>>>;
  projectByStatusCount?: Maybe<Array<Maybe<DashboardDto>>>;
  projectList?: Maybe<Array<Maybe<Projects>>>;
  projectListPageable?: Maybe<Page_Projects>;
  projectLists?: Maybe<Array<Maybe<Projects>>>;
  provinceByRegion?: Maybe<Array<Maybe<Province>>>;
  provinceFilter?: Maybe<Array<Maybe<Province>>>;
  provinces?: Maybe<Array<Maybe<Province>>>;
  purchaseItemsByPetty?: Maybe<Array<Maybe<PettyCashItem>>>;
  /** List of quantity adjustment type */
  quantityAdjustmentTypeFilter?: Maybe<Array<Maybe<QuantityAdjustmentType>>>;
  /** List of quantity adjustment type */
  quantityAdjustmentTypeList?: Maybe<Array<Maybe<QuantityAdjustmentType>>>;
  /** List of Quantity Adjustment by Item */
  quantityListByItem?: Maybe<Array<Maybe<QuantityAdjustment>>>;
  reapplicationById?: Maybe<Reapplication>;
  reapplicationPage?: Maybe<Page_Reapplication>;
  reapplicationPageFilter?: Maybe<Page_Reapplication>;
  reapplyAccountView?: Maybe<Array<Maybe<JournalEntryViewDto>>>;
  recByFiltersPage?: Maybe<Page_ReceivingReport>;
  recById?: Maybe<ReceivingReport>;
  recItemById?: Maybe<ReceivingReportItem>;
  recItemByParent?: Maybe<Array<Maybe<ReceivingReportItem>>>;
  regionFilter?: Maybe<Array<Maybe<Region>>>;
  /** Search all countries */
  regions?: Maybe<Array<Maybe<Region>>>;
  releaseCheckById?: Maybe<ReleaseCheck>;
  /** Filter Checks */
  releaseChecksFilter?: Maybe<Page_ReleaseCheck>;
  repairTypeActive?: Maybe<Array<Maybe<RepairType>>>;
  repairTypeAll?: Maybe<Array<Maybe<RepairType>>>;
  repairTypeList?: Maybe<Array<Maybe<RepairType>>>;
  returnGetReferenceType?: Maybe<Array<Maybe<ApReferenceDto>>>;
  rtsByFiltersPage?: Maybe<Page_ReturnSupplier>;
  rtsById?: Maybe<ReturnSupplier>;
  rtsItemById?: Maybe<ReturnSupplierItem>;
  rtsItemByParent?: Maybe<Array<Maybe<ReturnSupplierItem>>>;
  /** salesCharts */
  salesChartsDeduct?: Maybe<SalesChartsDto>;
  /** salesCharts */
  salesChartsExpense?: Maybe<SalesChartsDto>;
  /** salesCharts */
  salesChartsGross?: Maybe<SalesChartsDto>;
  /** salesCharts */
  salesChartsNet?: Maybe<SalesChartsDto>;
  /** salesCharts */
  salesChartsProfit?: Maybe<SalesChartsDto>;
  /** salesCharts */
  salesChartsRevenue?: Maybe<SalesChartsDto>;
  /** salesReport */
  salesReport?: Maybe<Array<Maybe<SalesReportDto>>>;
  /** Search employees */
  searchEmployees?: Maybe<Array<Maybe<Employee>>>;
  /** Search employees by role */
  searchEmployeesByRole?: Maybe<Array<Maybe<Employee>>>;
  serviceById?: Maybe<ServiceManagement>;
  serviceCategoryActive?: Maybe<Array<Maybe<ServiceCategory>>>;
  serviceCategoryAll?: Maybe<Array<Maybe<ServiceCategory>>>;
  serviceCategoryById?: Maybe<ServiceCategory>;
  serviceCategoryList?: Maybe<Array<Maybe<ServiceCategory>>>;
  serviceItemById?: Maybe<ServiceItems>;
  serviceItemByParent?: Maybe<Array<Maybe<ServiceItems>>>;
  serviceItemByParentId?: Maybe<Array<Maybe<ServiceItems>>>;
  serviceList?: Maybe<Array<Maybe<ServiceManagement>>>;
  servicePageAll?: Maybe<Page_ServiceManagement>;
  servicePageByOffice?: Maybe<Page_ServiceManagement>;
  /** List of Shift Per emp */
  shiftList?: Maybe<Array<Maybe<Shift>>>;
  /** List of Shift Per emp */
  shiftPerEmp?: Maybe<Array<Maybe<Shift>>>;
  /** List of Signature per type */
  signatureList?: Maybe<Array<Maybe<Signature>>>;
  /** List of Signature per type */
  signatureListFilter?: Maybe<Array<Maybe<Signature>>>;
  srrGetReferenceType?: Maybe<Array<Maybe<ApReferenceDto>>>;
  srrList?: Maybe<Array<Maybe<ReceivingReport>>>;
  stiByFiltersPage?: Maybe<Page_StockIssue>;
  stiById?: Maybe<StockIssue>;
  stiItemById?: Maybe<StockIssueItems>;
  stiItemByParent?: Maybe<Array<Maybe<StockIssueItems>>>;
  /** List of Stock Card */
  stockCard?: Maybe<Array<Maybe<StockCard>>>;
  subAccountByAccountType?: Maybe<Array<Maybe<SubAccountSetup>>>;
  subAccountDomains?: Maybe<Array<Maybe<DomainOptionDto>>>;
  subAccountDomainsRecords?: Maybe<Array<Maybe<DomainOptionDto>>>;
  subaccountTypeAll?: Maybe<Array<Maybe<Scalars['Map_String_StringScalar']['output']>>>;
  supById?: Maybe<Supplier>;
  supItemById?: Maybe<SupplierItem>;
  supplierActive?: Maybe<Array<Maybe<Supplier>>>;
  supplierList?: Maybe<Array<Maybe<Supplier>>>;
  supplierTypeActive?: Maybe<Array<Maybe<SupplierType>>>;
  supplierTypeList?: Maybe<Array<Maybe<SupplierType>>>;
  /** List of Suppliers */
  supplier_list_pageable?: Maybe<Page_Supplier>;
  /** List of Suppliers */
  supplier_list_pageable_active?: Maybe<Page_Supplier>;
  terminalFilter?: Maybe<Array<Maybe<Terminal>>>;
  /** List of Terminal */
  terminals?: Maybe<Array<Maybe<Terminal>>>;
  /** Gets the loan employees by payroll id */
  testGetPayrollEmployeeLoan?: Maybe<Array<Maybe<PayrollEmployeeLoanDto>>>;
  /** Get All timekeepings */
  timekeepings?: Maybe<Array<Maybe<Timekeeping>>>;
  totalBalances?: Maybe<Scalars['BigDecimal']['output']>;
  totalCashBalance?: Maybe<Scalars['BigDecimal']['output']>;
  totalCashIn?: Maybe<Scalars['BigDecimal']['output']>;
  /** totalDeduction */
  totalDeduction?: Maybe<Scalars['BigDecimal']['output']>;
  totalExpense?: Maybe<Scalars['BigDecimal']['output']>;
  totalExpenseProject?: Maybe<Scalars['BigDecimal']['output']>;
  /** totalGross */
  totalGross?: Maybe<Scalars['BigDecimal']['output']>;
  totalPayments?: Maybe<Scalars['BigDecimal']['output']>;
  totalRevenue?: Maybe<Scalars['BigDecimal']['output']>;
  transTypeById?: Maybe<TransactionType>;
  /** transaction type by type */
  transTypeBySource?: Maybe<ExpenseTransaction>;
  /** transaction type by tag */
  transTypeByTag?: Maybe<Array<Maybe<TransactionType>>>;
  /** transaction type by tag */
  transTypeByTagFilter?: Maybe<Array<Maybe<TransactionType>>>;
  /** transaction type by type */
  transTypeByType?: Maybe<Array<Maybe<ExpenseTransaction>>>;
  /** Transaction Journals */
  transactionJournal2?: Maybe<Page_TransactionJournalDto>;
  /** Transaction Journals */
  transactionJournalGroupItemQuery?: Maybe<Array<Maybe<HeaderLedgerGroupItemsDto>>>;
  /** Transaction Journals */
  transactionJournalGroupQuery?: Maybe<Array<Maybe<HeaderLedgerGroupDto>>>;
  /** Transaction Journals Total */
  transactionJournalGroupQueryTotalPage?: Maybe<Scalars['Long']['output']>;
  /** Transaction Journals */
  transactionJournalReferenceEntity?: Maybe<Page_HeaderLedger>;
  /** Transaction Journals */
  transactionJournalReferenceEntityWithPartition?: Maybe<Page_HeaderLedger>;
  /** Transaction Journals */
  transactionJournalWithPartition?: Maybe<Page_TransactionJournalDto>;
  /** Transaction List */
  transactionList?: Maybe<Array<Maybe<TransactionType>>>;
  unitMeasurementActive?: Maybe<Array<Maybe<UnitMeasurement>>>;
  unitMeasurementList?: Maybe<Array<Maybe<UnitMeasurement>>>;
  uopList?: Maybe<Array<Maybe<UnitMeasurement>>>;
  uouList?: Maybe<Array<Maybe<UnitMeasurement>>>;
  upcomingMaintenance?: Maybe<Page_AssetUpcomingPreventiveMaintenance>;
  useGetLoanBalance?: Maybe<Scalars['BigDecimal']['output']>;
  /** List of Payments By shift ID */
  vatable_non?: Maybe<Scalars['BigDecimal']['output']>;
  vehicleUsageDocsListPageable?: Maybe<Page_VehicleUsageDocs>;
  vehicleUsageMonitoringPageable?: Maybe<Page_VehicleUsageMonitoring>;
  version?: Maybe<Scalars['String']['output']>;
  weatherList?: Maybe<Array<Maybe<Weather>>>;
  wtxById?: Maybe<Wtx2307>;
  wtxConById?: Maybe<Wtx2307Consolidated>;
  /** Transaction List */
  wtxConList?: Maybe<Array<Maybe<Wtx2307Consolidated>>>;
  wtxConListPage?: Maybe<Page_Wtx2307Consolidated>;
  /** Transaction List */
  wtxList?: Maybe<Array<Maybe<Wtx2307>>>;
  wtxListByRef?: Maybe<Array<Maybe<Wtx2307>>>;
  wtxListPage?: Maybe<Page_Wtx2307>;
};


/** Query root */
export type QueryItemExpenseArgs = {
  end?: InputMaybe<Scalars['Instant']['input']>;
  expenseFrom?: InputMaybe<Scalars['UUID']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['Instant']['input']>;
};


/** Query root */
export type QueryAccountsItemsByParentArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryAllItemBySupplierArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryAllSupplierByItemArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryApAccountViewArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Query root */
export type QueryApAccountsTemplateByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryApAccountsTemplateByTypeArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryApAccountsTemplateItemByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryApAccountsTemplateListArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  desc?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryApAccountsTemplateOthersArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryApAccountsTemplatePageArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  desc?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryApAgingDetailedArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  posted?: InputMaybe<Scalars['Boolean']['input']>;
  supplier?: InputMaybe<Scalars['UUID']['input']>;
  supplierTypes?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryApAgingSummaryArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  posted?: InputMaybe<Scalars['Boolean']['input']>;
  supplierTypes?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryApAppByDisArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryApApplicationByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryApBeginningArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  supplier?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryApByDisArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryApByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryApDebitMemoArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryApDetailsByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryApLedgerArgs = {
  end?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['String']['input']>;
  supplier?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryApLedgerByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryApLedgerByRefArgs = {
  refNo?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryApLedgerBySupplierArgs = {
  supplier?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryApLedgerFilterArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  supplier?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryApListBySupplierArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  supplier?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryApListBySupplierFilterArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  supplier?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryApListFilterArgs = {
  end?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  start?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
  supplier?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryApReapplicationArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryApTransactionByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryApTransactionByTypeArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryApTransactionListArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  desc?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryApTransactionOthersArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryApTransactionPageArgs = {
  category?: InputMaybe<Scalars['String']['input']>;
  desc?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryArInvoiceItemUuidListArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryArTransactionLedgerPageArgs = {
  customerId?: InputMaybe<Scalars['UUID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryAssetByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryAssetListArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryAssetListPageableArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<AssetStatus>;
  type?: InputMaybe<AssetType>;
};


/** Query root */
export type QueryAssetMaintenanceTypeListPageableArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryAssetPreventiveMaintenanceByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryAssetRepairMaintenanceByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryAssetRepairMaintenanceItemByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryAssetRepairMaintenanceItemListPageableArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  rmId?: InputMaybe<Scalars['UUID']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryAssetRepairMaintenanceListPageableArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryBankByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryBanksArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryBarangayByCityArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryBarangayFilterArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryBeginningListByItemArgs = {
  item?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryBillingAllByFiltersPageArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Query root */
export type QueryBillingByFiltersPageArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Query root */
export type QueryBillingByFiltersPageProjectsArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Query root */
export type QueryBillingByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryBillingByProjectArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryBillingByRefArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryBillingItemByDateTypeArgs = {
  end?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** Query root */
export type QueryBillingItemByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryBillingItemByParentArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryBillingItemByParentTypeArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  type?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** Query root */
export type QueryBillingOtcByFiltersPageArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Query root */
export type QueryCashFlowReportArgs = {
  end?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryChargeInvoiceListArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryChargedItemsArgs = {
  end?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryCheckBalancesByPoArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryChecksFilterArgs = {
  bank?: InputMaybe<Scalars['UUID']['input']>;
  end?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  start?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryCityByProvinceArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryCityFilterArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryComByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryCompanyListArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryCompanyPageArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryCountriesByFilterArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryCreditNoteItemUuidListArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryCustomerBalanceArgs = {
  customerId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryCustomerListArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryCustomerListAssetsArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryCustomerRemainingBalanceArgs = {
  customerId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryDebitMemoByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryDebitMemoFilterArgs = {
  end?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  start?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
  supplier?: InputMaybe<Scalars['UUID']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryDetailsByApArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryDisAccountViewArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Query root */
export type QueryDisCheckByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryDisCheckByParentArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryDisExpByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryDisExpByParentArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryDisWtxByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryDisWtxByParentArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryDisbursementByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryDisbursementFilterArgs = {
  end?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  start?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
  supplier?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryDisbursementFilterPostedArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  supplier?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryDmAccountViewArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Query root */
export type QueryDmDetailsByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryDmDetialsArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryEmployeeArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryEmployeeByFilterArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  office?: InputMaybe<Scalars['UUID']['input']>;
  position?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Query root */
export type QueryEmployeeByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryEmployeeByPinCodeArgs = {
  pinCode?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryExpenseTypeByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryFetchAllowanceItemByPackagePageableArgs = {
  allowancePackage?: InputMaybe<Scalars['UUID']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryFetchAllowanceItemPageableArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryFetchAllowancePackagePageableArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryFetchAllowancePageableArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryFilterAdjustmentTypeArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Query root */
export type QueryFindAllArPaymentPostingArgs = {
  customerId?: InputMaybe<Scalars['UUID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryFindAllCreditNoteArgs = {
  customerId?: InputMaybe<Scalars['UUID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryFindAllCustomerListArgs = {
  search?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryFindAllCustomersArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** Query root */
export type QueryFindAllInvoiceArgs = {
  customerId?: InputMaybe<Scalars['UUID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryFindAllInvoiceItemUuidByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryFindAllInvoiceItemsByInvoiceArgs = {
  invoiceId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryFindAllInvoiceOutstandingBalArgs = {
  customerId?: InputMaybe<Scalars['UUID']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  filterType?: InputMaybe<Scalars['String']['input']>;
  hasBalance?: InputMaybe<Scalars['Boolean']['input']>;
  invoiceType?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryFindAllInvoiceOutstandingBalForCreditNoteArgs = {
  customerId?: InputMaybe<Scalars['UUID']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  filterType?: InputMaybe<Scalars['String']['input']>;
  hasBalance?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Query root */
export type QueryFindAllInvoiceParticularsArgs = {
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryFindAllPaymentPostingItemByPaymentPostingIdArgs = {
  paymentPostingId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryFindAllPaymentPostingItemDiscByPaymentPostingIdArgs = {
  paymentPostingId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryFindAllPromissoryOutstandingBalArgs = {
  customerId?: InputMaybe<Scalars['UUID']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryFindByItemOfficeArgs = {
  depId?: InputMaybe<Scalars['UUID']['input']>;
  itemId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryFindByPaymentTrackerArgs = {
  paymentTrackerId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryFindCreditNoteItemsArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryFindCreditNoteItemsByCnIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryFindCreditNoteItemsByCnIdByItemTypeArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryFindCreditNoteItemsByCustomerArgs = {
  arCustomerId?: InputMaybe<Scalars['UUID']['input']>;
  itemType?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryFindDuplicateArgs = {
  itemId?: InputMaybe<Scalars['UUID']['input']>;
  supId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryFindHeaderLedgerLedgerArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  transactionDateOnly?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryFindInvoiceCreditNoteArgs = {
  invoiceId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryFindInvoiceItemsByCustomerArgs = {
  customerId?: InputMaybe<Scalars['UUID']['input']>;
  invoiceId?: InputMaybe<Scalars['UUID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryFindInvoiceItemsByInvoiceArgs = {
  invoiceId?: InputMaybe<Scalars['UUID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryFindInvoicePaymentsArgs = {
  invoiceId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryFindOneArPaymentPostingArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryFindOneArPaymentPostingItemsArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryFindOneAdjustmentTypeArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryFindOneArAllocatedCnArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryFindOneArInvoiceParticularsArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryFindOneByRefIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryFindOneCreditNoteArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryFindOneCustomerArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryFindOneHeaderLedgerArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryFindOneInvoiceArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryFindOneInvoiceItemsArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryFindOneProjectWorkAccomplishArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryFindOneProjectWorkAccomplishItemsArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryFindOneSignatureArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryFindPnCreditNoteArgs = {
  pnId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryFindPnPaymentsArgs = {
  pnId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryFindPendingCnPerInvoiceArgs = {
  invoiceId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryFindPostedCnPerInvoiceArgs = {
  invoiceId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryFiscalByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryFiscalsArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryFixedAssetItemListArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryGenerateGeneralLedgerDetailedSummaryArgs = {
  account?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryGenerateGeneralLedgerDetailsArgs = {
  account?: InputMaybe<Scalars['String']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryGenerateGeneralLedgerSummaryArgs = {
  accounts?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryGenericListArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryGetArInvoiceItemPerIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetAccumulatedLogsArgs = {
  endDate?: InputMaybe<Scalars['Instant']['input']>;
  generateBreakdown?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  startDate?: InputMaybe<Scalars['Instant']['input']>;
};


/** Query root */
export type QueryGetAdjustmentCategoriesArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryGetAdjustmentEmployeesArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  payroll?: InputMaybe<Scalars['UUID']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Array<InputMaybe<PayrollEmployeeStatus>>>;
};


/** Query root */
export type QueryGetAdjustmentEmployeesListArgs = {
  payroll?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetAllAmountsArgs = {
  type?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** Query root */
export type QueryGetAllChartOfAccountGenerateArgs = {
  accountCategory?: InputMaybe<Scalars['String']['input']>;
  accountName?: InputMaybe<Scalars['String']['input']>;
  accountType?: InputMaybe<Scalars['String']['input']>;
  department?: InputMaybe<Scalars['String']['input']>;
  excludeMotherAccount?: InputMaybe<Scalars['Boolean']['input']>;
  motherAccountCode?: InputMaybe<Scalars['String']['input']>;
  subaccountType?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryGetAllOpenProjectWorkAccomplishPageByProjectArgs = {
  projectId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetAllowanceByPayrollIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetAllowancePackageByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetAmountsArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  type?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** Query root */
export type QueryGetAmountsDeductArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  type?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** Query root */
export type QueryGetAttTypeByDateArgs = {
  employee?: InputMaybe<Scalars['UUID']['input']>;
  specificDate?: InputMaybe<Scalars['Instant']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryGetBalanceArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetBigDecimalFieldsFromDomainArgs = {
  domain?: InputMaybe<IntegrationDomainEnum>;
};


/** Query root */
export type QueryGetBillingItemFilterActiveArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  type?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** Query root */
export type QueryGetCoaByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetContributionByPayrollIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetContributionEmployeesByPayrollIdArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  payroll?: InputMaybe<Scalars['UUID']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Array<InputMaybe<PayrollEmployeeStatus>>>;
};


/** Query root */
export type QueryGetDocTypeByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetEmployeeAllowanceArgs = {
  employeeId?: InputMaybe<Scalars['UUID']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryGetEmployeeAllowanceItemsInIdsArgs = {
  idList?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>;
};


/** Query root */
export type QueryGetEmployeeLeaveByEmpArgs = {
  employeeId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetEmployeeLeavePageableArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  leaveTypes?: InputMaybe<Array<InputMaybe<LeaveType>>>;
  office?: InputMaybe<Scalars['UUID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  position?: InputMaybe<Scalars['UUID']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Array<InputMaybe<LeaveStatus>>>;
};


/** Query root */
export type QueryGetEmployeeLoanConfigArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetEmployeeLoanLedgerArgs = {
  employeeId?: InputMaybe<Scalars['UUID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryGetEmployeeLoansByEmployeeArgs = {
  category?: InputMaybe<EmployeeLoanCategory>;
  employeeId?: InputMaybe<Scalars['UUID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryGetEmployeeScheduleByFilterArgs = {
  endDate?: InputMaybe<Scalars['Instant']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  office?: InputMaybe<Scalars['UUID']['input']>;
  position?: InputMaybe<Scalars['UUID']['input']>;
  startDate?: InputMaybe<Scalars['Instant']['input']>;
};


/** Query root */
export type QueryGetEmployeeScheduleDetailsArgs = {
  date?: InputMaybe<Scalars['String']['input']>;
  employeeId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetEventsBetweenTwoDatesArgs = {
  endDate?: InputMaybe<Scalars['Instant']['input']>;
  startDate?: InputMaybe<Scalars['Instant']['input']>;
};


/** Query root */
export type QueryGetFixedAssetPageableArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryGetGeneralLedgerArgs = {
  accountType?: InputMaybe<Scalars['String']['input']>;
  department?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  fiscalId?: InputMaybe<Scalars['UUID']['input']>;
  monthNo?: InputMaybe<Scalars['Int']['input']>;
  motherAccountCode?: InputMaybe<Scalars['String']['input']>;
  subaccountType?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryGetGroupPolicyByIdArgs = {
  groupPolicyId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetHdmfContributionsArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetInventoryInfoArgs = {
  itemId?: InputMaybe<Scalars['UUID']['input']>;
  office?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetItemByNameArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryGetItemDiscountableArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  type?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** Query root */
export type QueryGetJobByPlateNoArgs = {
  plateNo?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryGetLedgerByHeaderIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetLedgerByRefArgs = {
  ref?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryGetLegerByDocArgs = {
  dateEnd?: InputMaybe<Scalars['String']['input']>;
  dateStart?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>;
};


/** Query root */
export type QueryGetLoanScheduleByIdArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryGetMaterialByRefStockCardArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetOnHandByItemArgs = {
  itemId?: InputMaybe<Scalars['UUID']['input']>;
  office?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetOneRawLogArgs = {
  id: Scalars['UUID']['input'];
};


/** Query root */
export type QueryGetOpenProjectWorkAccomplishPageByProjectArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  projectId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetOtherDeductionArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryGetOtherDeductionEmployeesArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  payroll?: InputMaybe<Scalars['UUID']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Array<InputMaybe<PayrollEmployeeStatus>>>;
};


/** Query root */
export type QueryGetOtherDeductionEmployeesListArgs = {
  payroll?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetOtherDeductionPageableArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryGetPhicContributionsArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetPoMonitoringByPoItemFilterArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetPoMonitoringByRecArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetPayrollAdjustmentByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetPayrollByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetPayrollByPaginationArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryGetPayrollEmployeeAllowanceArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  payroll?: InputMaybe<Scalars['UUID']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Array<InputMaybe<PayrollEmployeeStatus>>>;
  withItems?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Query root */
export type QueryGetPayrollEmployeeIdsArgs = {
  PayrollId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetPayrollEmployeeLoanArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  payroll?: InputMaybe<Scalars['UUID']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Array<InputMaybe<PayrollEmployeeStatus>>>;
};


/** Query root */
export type QueryGetPayrollEmployeesArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetPayrollHrmEmployeesArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetPayrollLoanByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetPayrollLoanByPayrollIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetPayrollOtherDeductionByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetPayrollOtherDeductionByPayrollIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetPlateNoArgs = {
  status?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryGetPrItemByPoIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetPrItemInPoArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  prNos?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Query root */
export type QueryGetProjectMaterialsByMilestoneArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetProjectWorkAccomplishItemsByGroupIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetProjectWorkAccomplishPageByProjectArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetReapplicationStatusArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryGetSssContributionsArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetSavedEmployeeAttendanceArgs = {
  endDate?: InputMaybe<Scalars['Instant']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  startDate?: InputMaybe<Scalars['Instant']['input']>;
};


/** Query root */
export type QueryGetScheduleLockArgs = {
  endDate?: InputMaybe<Scalars['Instant']['input']>;
  startDate?: InputMaybe<Scalars['Instant']['input']>;
};


/** Query root */
export type QueryGetSpecificFieldsFromDomainArgs = {
  domain?: InputMaybe<IntegrationDomainEnum>;
  target?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryGetSrrByDateRangeArgs = {
  end?: InputMaybe<Scalars['Instant']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['Instant']['input']>;
};


/** Query root */
export type QueryGetSrrItemByDateRangeArgs = {
  end?: InputMaybe<Scalars['Instant']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['Instant']['input']>;
};


/** Query root */
export type QueryGetStringFieldsFromDomainArgs = {
  domain?: InputMaybe<IntegrationDomainEnum>;
};


/** Query root */
export type QueryGetSubAccountForParentArgs = {
  parentAccountId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetTimekeepingAndEmployeesArgs = {
  timekeepingId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetTimekeepingByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetTimekeepingByPayrollIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetTimekeepingEmployeeLogsArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetTimekeepingEmployeesArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetTimekeepingEmployeesV2Args = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetTotalMaterialsArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetTotalsArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryHciInvoiceItemTotalCwtArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryHciInvoiceItemTotalVatArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryHeaderLedgerTotalArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryInsuranceListArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryIntegrationByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryIntegrationGroupItemListArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryIntegrationItemsByIntegrationIdArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryInventoryListPageableArgs = {
  brand?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>;
  filter?: InputMaybe<Scalars['String']['input']>;
  group?: InputMaybe<Scalars['UUID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryInventoryListPageableByDepArgs = {
  brand?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>;
  filter?: InputMaybe<Scalars['String']['input']>;
  group?: InputMaybe<Scalars['UUID']['input']>;
  office?: InputMaybe<Scalars['UUID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryInventoryOutputPageableArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  office?: InputMaybe<Scalars['UUID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryInventorySourcePageableArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  office?: InputMaybe<Scalars['UUID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryInventorySupplierListPageableArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  supplier?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryInvoiceItemAmountSumArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  itemType?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** Query root */
export type QueryIsLoginUniqueArgs = {
  login?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryIsPinCodeUniqueArgs = {
  pinCode?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryItemByFiltersPageArgs = {
  brand?: InputMaybe<Scalars['String']['input']>;
  category?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>;
  filter?: InputMaybe<Scalars['String']['input']>;
  group?: InputMaybe<Scalars['UUID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryItemByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryItemCategoryActiveArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryItemCategoryListArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryItemGroupListArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryItemListArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryItemListByOfficeArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryItemSubAccountActiveArgs = {
  type?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** Query root */
export type QueryItemSubAccountListArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryItemsActivePageArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryItemsByFilterOnlyArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryJobByFiltersPageArgs = {
  customer?: InputMaybe<Scalars['UUID']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  insurance?: InputMaybe<Scalars['UUID']['input']>;
  office?: InputMaybe<Scalars['UUID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortType?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryJobByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryJobCountStatusArgs = {
  status?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryJobItemByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryJobItemByItemsArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryJobItemByParentArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryJobItemByServiceCategoryArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryJobListArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryJobOrderByAssetListArgs = {
  end?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  start?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryJobOrderByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryJobOrderItemByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryJobOrderItemByParentArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryJobOrderListArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryJobOrderListFilterPageableArgs = {
  asset?: InputMaybe<Scalars['UUID']['input']>;
  customer?: InputMaybe<Scalars['UUID']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  project?: InputMaybe<Scalars['UUID']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  sortType?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryJobOrderListPageableArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryJobStatusListArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryLedgerViewArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryLedgerViewListArgs = {
  code?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  fiscalId?: InputMaybe<Scalars['UUID']['input']>;
  monthNo?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryLedgerViewListV2Args = {
  code?: InputMaybe<Scalars['String']['input']>;
  creditBegBal?: InputMaybe<Scalars['BigDecimal']['input']>;
  debitBegBal?: InputMaybe<Scalars['BigDecimal']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  fiscalId?: InputMaybe<Scalars['UUID']['input']>;
  monthNo?: InputMaybe<Scalars['Int']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryLoanMCostOfLoanArgs = {
  numOfPayments?: InputMaybe<Scalars['BigDecimal']['input']>;
  payment?: InputMaybe<Scalars['BigDecimal']['input']>;
};


/** Query root */
export type QueryLoanMfvArgs = {
  nPer?: InputMaybe<Scalars['Int']['input']>;
  pmt?: InputMaybe<Scalars['BigDecimal']['input']>;
  pv?: InputMaybe<Scalars['BigDecimal']['input']>;
  rate?: InputMaybe<Scalars['BigDecimal']['input']>;
};


/** Query root */
export type QueryLoanMipmtArgs = {
  nPer?: InputMaybe<Scalars['Int']['input']>;
  per?: InputMaybe<Scalars['Int']['input']>;
  pv?: InputMaybe<Scalars['BigDecimal']['input']>;
  rate?: InputMaybe<Scalars['BigDecimal']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryLoanMInterestRateArgs = {
  annualInterest?: InputMaybe<Scalars['BigDecimal']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryLoanMLoanAmortizationArgs = {
  annualInterest?: InputMaybe<Scalars['BigDecimal']['input']>;
  compoundType?: InputMaybe<Scalars['String']['input']>;
  numOfPayments?: InputMaybe<Scalars['Int']['input']>;
  principalAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryLoanMLoanPaymentsArgs = {
  annualInterest?: InputMaybe<Scalars['BigDecimal']['input']>;
  compoundType?: InputMaybe<Scalars['String']['input']>;
  numberOfPeriod?: InputMaybe<Scalars['Int']['input']>;
  principalAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryLoanMNumberOfPaymentsArgs = {
  numOFYears?: InputMaybe<Scalars['Int']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryLoanMpmtArgs = {
  nPer?: InputMaybe<Scalars['Int']['input']>;
  pv?: InputMaybe<Scalars['BigDecimal']['input']>;
  rate?: InputMaybe<Scalars['BigDecimal']['input']>;
};


/** Query root */
export type QueryLoanMViewPaidLoanArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryLoanMViewPostingEntryArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryLoanManagementByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryLoanManagementsArgs = {
  accountNo?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryMapEventsToDatesArgs = {
  endDate?: InputMaybe<Scalars['Instant']['input']>;
  startDate?: InputMaybe<Scalars['Instant']['input']>;
};


/** Query root */
export type QueryMonByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryMpByFiltersPageArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  office?: InputMaybe<Scalars['UUID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryMpByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryMpItemByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryMpItemByParentArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryMynotificationsArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryNetSalesArgs = {
  end?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryOfficeByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryOfficeListByFilterArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Query root */
export type QueryOfficeListByItemArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryOfficePageArgs = {
  company?: InputMaybe<Scalars['UUID']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryOfficePageListArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  pageSize?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryOnHandReportArgs = {
  date?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  office?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryOthersByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryOthersByPettyArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryOutputTaxArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryPCostByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryPCostByListArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryPCostRevByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryPCostRevByListArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryPMaterialByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryPMaterialByListArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryPMaterialByPageArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryPProgressByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryPProgressByListArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryPProgressByListNotInArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  projectUpdateId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryPProgressByPageArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryPProgressImageByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryPProgressImagesByListArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryPUpdatesByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryPUpdatesByListArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryPUpdatesByListNotInArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  projectUpdateId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryPUpdatesByPageArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryPUpdatesWorkerByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryPUpdatesWorkersByListArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryParentAccountPageableArgs = {
  accountCategory?: InputMaybe<AccountCategory>;
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryPaymentByBillingIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryPaymentItemsArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryPaymentTermListArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryPaymentsByShiftArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryPettyCashAccountViewArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Query root */
export type QueryPettyCashAccountingByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryPettyCashByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryPettyCashItemByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryPettyCashListArgs = {
  cashType?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  project?: InputMaybe<Scalars['UUID']['input']>;
  shift?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryPettyCashListByDateArgs = {
  end?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryPettyCashListByProjectArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  project?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryPettyCashListPostedArgs = {
  shift?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryPettyCashPageArgs = {
  end?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  payee?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  start?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Query root */
export type QueryPettyTypeListArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryPoByFiltersPageArgs = {
  end?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  office?: InputMaybe<Scalars['UUID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  start?: InputMaybe<Scalars['String']['input']>;
  supplier?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryPoByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryPoItemByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryPoItemByParentArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryPoItemMonitoringByParentFilterArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryPoItemNotReceiveArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryPoItemNotReceiveMonitoringArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryPositionByFilterArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Query root */
export type QueryPositionByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryPositionPageArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryPrByFiltersPageArgs = {
  end?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  office?: InputMaybe<Scalars['UUID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  start?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryPrByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryPrItemByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryPrItemByParentArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryPreventiveByAssetArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryPrintChecksArgs = {
  bank?: InputMaybe<Scalars['UUID']['input']>;
  end?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  start?: InputMaybe<Scalars['String']['input']>;
  supplier?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryProjectByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryProjectByOfficeArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryProjectListArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryProjectListPageableArgs = {
  customer?: InputMaybe<Scalars['UUID']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<Scalars['UUID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryProvinceByRegionArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryProvinceFilterArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryPurchaseItemsByPettyArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryQuantityAdjustmentTypeFilterArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryQuantityListByItemArgs = {
  item?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryReapplicationByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryReapplicationPageArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryReapplicationPageFilterArgs = {
  end?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  start?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
  supplier?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryReapplyAccountViewArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Query root */
export type QueryRecByFiltersPageArgs = {
  end?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  office?: InputMaybe<Scalars['UUID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  start?: InputMaybe<Scalars['String']['input']>;
  supplier?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryRecByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryRecItemByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryRecItemByParentArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryRegionFilterArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryReleaseCheckByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryReleaseChecksFilterArgs = {
  bank?: InputMaybe<Scalars['UUID']['input']>;
  end?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  start?: InputMaybe<Scalars['String']['input']>;
  supplier?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryRepairTypeListArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryRtsByFiltersPageArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  office?: InputMaybe<Scalars['UUID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryRtsByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryRtsItemByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryRtsItemByParentArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QuerySalesChartsDeductArgs = {
  date?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QuerySalesChartsExpenseArgs = {
  date?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QuerySalesChartsGrossArgs = {
  date?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QuerySalesChartsNetArgs = {
  date?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QuerySalesChartsProfitArgs = {
  date?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QuerySalesChartsRevenueArgs = {
  date?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QuerySalesReportArgs = {
  end?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QuerySearchEmployeesArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QuerySearchEmployeesByRoleArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  role?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryServiceByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryServiceCategoryByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryServiceCategoryListArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryServiceItemByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryServiceItemByParentArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryServiceItemByParentIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryServiceListArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryServicePageAllArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryServicePageByOfficeArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  office?: InputMaybe<Scalars['UUID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QuerySignatureListArgs = {
  type?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QuerySignatureListFilterArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryStiByFiltersPageArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  office?: InputMaybe<Scalars['UUID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryStiByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryStiItemByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryStiItemByParentArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryStockCardArgs = {
  itemId?: InputMaybe<Scalars['String']['input']>;
  office?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QuerySubAccountByAccountTypeArgs = {
  accountCategory?: InputMaybe<AccountCategory>;
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QuerySubAccountDomainsRecordsArgs = {
  domain?: InputMaybe<DomainEnum>;
};


/** Query root */
export type QuerySupByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QuerySupItemByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QuerySupplierListArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QuerySupplierTypeListArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QuerySupplier_List_PageableArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QuerySupplier_List_Pageable_ActiveArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryTerminalFilterArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryTestGetPayrollEmployeeLoanArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  payroll?: InputMaybe<Scalars['UUID']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  status?: InputMaybe<Array<InputMaybe<PayrollEmployeeStatus>>>;
};


/** Query root */
export type QueryTotalCashBalanceArgs = {
  end?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryTotalCashInArgs = {
  end?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryTotalDeductionArgs = {
  end?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryTotalExpenseArgs = {
  end?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryTotalExpenseProjectArgs = {
  project?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryTotalGrossArgs = {
  end?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryTotalRevenueArgs = {
  end?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryTransTypeByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryTransTypeBySourceArgs = {
  source?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryTransTypeByTagArgs = {
  tag?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryTransTypeByTagFilterArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  tag?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryTransTypeByTypeArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryTransactionJournal2Args = {
  beginningBalance?: InputMaybe<Scalars['Boolean']['input']>;
  endDateTime?: InputMaybe<Scalars['Instant']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  journalType?: InputMaybe<JournalType>;
  page?: InputMaybe<Scalars['Int']['input']>;
  showAll?: InputMaybe<Scalars['Boolean']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  startDateTime?: InputMaybe<Scalars['Instant']['input']>;
};


/** Query root */
export type QueryTransactionJournalGroupItemQueryArgs = {
  endDate?: InputMaybe<Scalars['Instant']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  fiscalId?: InputMaybe<Scalars['UUID']['input']>;
  groupId?: InputMaybe<Scalars['UUID']['input']>;
  journalType?: InputMaybe<Scalars['String']['input']>;
  startDate?: InputMaybe<Scalars['Instant']['input']>;
};


/** Query root */
export type QueryTransactionJournalGroupQueryArgs = {
  endDate?: InputMaybe<Scalars['Instant']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  fiscalId?: InputMaybe<Scalars['UUID']['input']>;
  journalType?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  showAll?: InputMaybe<Scalars['Boolean']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  startDate?: InputMaybe<Scalars['Instant']['input']>;
};


/** Query root */
export type QueryTransactionJournalGroupQueryTotalPageArgs = {
  endDate?: InputMaybe<Scalars['Instant']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  fiscalId?: InputMaybe<Scalars['UUID']['input']>;
  journalType?: InputMaybe<Scalars['String']['input']>;
  showAll?: InputMaybe<Scalars['Boolean']['input']>;
  startDate?: InputMaybe<Scalars['Instant']['input']>;
};


/** Query root */
export type QueryTransactionJournalReferenceEntityArgs = {
  beginningBalance?: InputMaybe<Scalars['Boolean']['input']>;
  endDateTime?: InputMaybe<Scalars['Instant']['input']>;
  entityName?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  fiscalId?: InputMaybe<Scalars['UUID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  referenceNo?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  startDateTime?: InputMaybe<Scalars['Instant']['input']>;
};


/** Query root */
export type QueryTransactionJournalReferenceEntityWithPartitionArgs = {
  beginningBalance?: InputMaybe<Scalars['Boolean']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  entityName?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  fiscalId?: InputMaybe<Scalars['UUID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  referenceNo?: InputMaybe<Scalars['String']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryTransactionJournalWithPartitionArgs = {
  beginningBalance?: InputMaybe<Scalars['Boolean']['input']>;
  endDate?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  journalType?: InputMaybe<JournalType>;
  page?: InputMaybe<Scalars['Int']['input']>;
  showAll?: InputMaybe<Scalars['Boolean']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  startDate?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryUnitMeasurementListArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryUpcomingMaintenanceArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryUseGetLoanBalanceArgs = {
  category?: InputMaybe<EmployeeLoanCategory>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryVatable_NonArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryVehicleUsageDocsListPageableArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  vehicleUsageId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryVehicleUsageMonitoringPageableArgs = {
  asset?: InputMaybe<Scalars['UUID']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryWtxByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryWtxConByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryWtxConListPageArgs = {
  end?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  start?: InputMaybe<Scalars['String']['input']>;
  supplier?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryWtxListByRefArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryWtxListPageArgs = {
  end?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
  start?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
  supplier?: InputMaybe<Scalars['UUID']['input']>;
};

export type Reapplication = {
  __typename?: 'Reapplication';
  advanceAmount?: Maybe<Scalars['BigDecimal']['output']>;
  appliedAmount?: Maybe<Scalars['BigDecimal']['output']>;
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  cwt?: Maybe<Scalars['BigDecimal']['output']>;
  details?: Maybe<Scalars['Map_String_StringScalar']['output']>;
  disbursement?: Maybe<Disbursement>;
  disbursementAmount?: Maybe<Scalars['BigDecimal']['output']>;
  discAmount?: Maybe<Scalars['BigDecimal']['output']>;
  discountAmount?: Maybe<Scalars['BigDecimal']['output']>;
  domain?: Maybe<Scalars['String']['output']>;
  ewt1Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewt2Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewt3Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewt4Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewt5Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewt7Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewt10Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewt15Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewt18Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewt30Percent?: Maybe<Scalars['BigDecimal']['output']>;
  ewtAmount?: Maybe<Scalars['BigDecimal']['output']>;
  flagValue?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  posted?: Maybe<Scalars['Boolean']['output']>;
  postedLedger?: Maybe<Scalars['UUID']['output']>;
  prevApplied?: Maybe<Scalars['BigDecimal']['output']>;
  referenceNo?: Maybe<Scalars['String']['output']>;
  remarks?: Maybe<Scalars['String']['output']>;
  rounding?: Maybe<Scalars['Int']['output']>;
  rpNo?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
  supplier?: Maybe<Supplier>;
  transType?: Maybe<ApTransaction>;
};

export type ReapplicationInput = {
  advanceAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  appliedAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  company?: InputMaybe<Scalars['UUID']['input']>;
  cwt?: InputMaybe<Scalars['BigDecimal']['input']>;
  disbursement?: InputMaybe<DisbursementInput>;
  disbursementAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  discAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  discountAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt1Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt2Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt3Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt4Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt5Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt7Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt10Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt15Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt18Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewt30Percent?: InputMaybe<Scalars['BigDecimal']['input']>;
  ewtAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  flagValue?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  posted?: InputMaybe<Scalars['Boolean']['input']>;
  postedLedger?: InputMaybe<Scalars['UUID']['input']>;
  prevApplied?: InputMaybe<Scalars['BigDecimal']['input']>;
  referenceNo?: InputMaybe<Scalars['String']['input']>;
  remarks?: InputMaybe<Scalars['String']['input']>;
  rounding?: InputMaybe<Scalars['Int']['input']>;
  rpNo?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['String']['input']>;
  supplier?: InputMaybe<SupplierInput>;
  transType?: InputMaybe<ApTransactionInput>;
};

export type ReceivingReport = {
  __typename?: 'ReceivingReport';
  account?: Maybe<Scalars['UUID']['output']>;
  amount?: Maybe<Scalars['BigDecimal']['output']>;
  assets?: Maybe<Assets>;
  category?: Maybe<Scalars['String']['output']>;
  company?: Maybe<Scalars['UUID']['output']>;
  consignment?: Maybe<Scalars['Boolean']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  dateCreated?: Maybe<Scalars['Instant']['output']>;
  fixAsset?: Maybe<Scalars['Boolean']['output']>;
  fixDiscount?: Maybe<Scalars['BigDecimal']['output']>;
  grossAmount?: Maybe<Scalars['BigDecimal']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  inputTax?: Maybe<Scalars['BigDecimal']['output']>;
  isPosted?: Maybe<Scalars['Boolean']['output']>;
  isVoid?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  netAmount?: Maybe<Scalars['BigDecimal']['output']>;
  netDiscount?: Maybe<Scalars['BigDecimal']['output']>;
  paymentTerms?: Maybe<PaymentTerm>;
  postedLedger?: Maybe<Scalars['UUID']['output']>;
  project?: Maybe<Projects>;
  purchaseOrder?: Maybe<PurchaseOrder>;
  receiveDate?: Maybe<Scalars['Instant']['output']>;
  receivedOffice?: Maybe<Office>;
  receivedRefDate?: Maybe<Scalars['Instant']['output']>;
  receivedRefNo?: Maybe<Scalars['String']['output']>;
  receivedRemarks?: Maybe<Scalars['String']['output']>;
  receivedType?: Maybe<Scalars['String']['output']>;
  refAp?: Maybe<Scalars['UUID']['output']>;
  referenceType?: Maybe<Scalars['String']['output']>;
  rrNo?: Maybe<Scalars['String']['output']>;
  supplier?: Maybe<Supplier>;
  totalDiscount?: Maybe<Scalars['BigDecimal']['output']>;
  userFullname?: Maybe<Scalars['String']['output']>;
  userId?: Maybe<Scalars['UUID']['output']>;
  vatInclusive?: Maybe<Scalars['Boolean']['output']>;
  vatRate?: Maybe<Scalars['BigDecimal']['output']>;
};

export type ReceivingReportInput = {
  account?: InputMaybe<Scalars['UUID']['input']>;
  amount?: InputMaybe<Scalars['BigDecimal']['input']>;
  assets?: InputMaybe<AssetsInput>;
  category?: InputMaybe<Scalars['String']['input']>;
  company?: InputMaybe<Scalars['UUID']['input']>;
  consignment?: InputMaybe<Scalars['Boolean']['input']>;
  fixAsset?: InputMaybe<Scalars['Boolean']['input']>;
  fixDiscount?: InputMaybe<Scalars['BigDecimal']['input']>;
  grossAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  inputTax?: InputMaybe<Scalars['BigDecimal']['input']>;
  isPosted?: InputMaybe<Scalars['Boolean']['input']>;
  isVoid?: InputMaybe<Scalars['Boolean']['input']>;
  netAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  netDiscount?: InputMaybe<Scalars['BigDecimal']['input']>;
  paymentTerms?: InputMaybe<PaymentTermInput>;
  postedLedger?: InputMaybe<Scalars['UUID']['input']>;
  project?: InputMaybe<ProjectsInput>;
  purchaseOrder?: InputMaybe<PurchaseOrderInput>;
  receiveDate?: InputMaybe<Scalars['Instant']['input']>;
  receivedOffice?: InputMaybe<OfficeInput>;
  receivedRefDate?: InputMaybe<Scalars['Instant']['input']>;
  receivedRefNo?: InputMaybe<Scalars['String']['input']>;
  receivedRemarks?: InputMaybe<Scalars['String']['input']>;
  receivedType?: InputMaybe<Scalars['String']['input']>;
  refAp?: InputMaybe<Scalars['UUID']['input']>;
  referenceType?: InputMaybe<Scalars['String']['input']>;
  rrNo?: InputMaybe<Scalars['String']['input']>;
  supplier?: InputMaybe<SupplierInput>;
  totalDiscount?: InputMaybe<Scalars['BigDecimal']['input']>;
  userFullname?: InputMaybe<Scalars['String']['input']>;
  userId?: InputMaybe<Scalars['UUID']['input']>;
  vatInclusive?: InputMaybe<Scalars['Boolean']['input']>;
  vatRate?: InputMaybe<Scalars['BigDecimal']['input']>;
};

export type ReceivingReportItem = {
  __typename?: 'ReceivingReportItem';
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  discountRate?: Maybe<Scalars['BigDecimal']['output']>;
  expirationDate?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  inputTax?: Maybe<Scalars['BigDecimal']['output']>;
  isCompleted?: Maybe<Scalars['Boolean']['output']>;
  isDiscount?: Maybe<Scalars['Boolean']['output']>;
  isFg?: Maybe<Scalars['Boolean']['output']>;
  isPartial?: Maybe<Scalars['Boolean']['output']>;
  isPosted?: Maybe<Scalars['Boolean']['output']>;
  isTax?: Maybe<Scalars['Boolean']['output']>;
  item?: Maybe<Item>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  netAmount?: Maybe<Scalars['BigDecimal']['output']>;
  receiveDiscountCost?: Maybe<Scalars['BigDecimal']['output']>;
  receiveQty?: Maybe<Scalars['Int']['output']>;
  receiveUnitCost?: Maybe<Scalars['BigDecimal']['output']>;
  receivingReport?: Maybe<ReceivingReport>;
  refPoItem?: Maybe<PurchaseOrderItems>;
  totalAmount?: Maybe<Scalars['BigDecimal']['output']>;
  unitMeasurement?: Maybe<Scalars['String']['output']>;
  uou?: Maybe<Scalars['String']['output']>;
};

export type ReceivingReportItemInput = {
  discountRate?: InputMaybe<Scalars['BigDecimal']['input']>;
  expirationDate?: InputMaybe<Scalars['Instant']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  inputTax?: InputMaybe<Scalars['BigDecimal']['input']>;
  isCompleted?: InputMaybe<Scalars['Boolean']['input']>;
  isDiscount?: InputMaybe<Scalars['Boolean']['input']>;
  isFg?: InputMaybe<Scalars['Boolean']['input']>;
  isPartial?: InputMaybe<Scalars['Boolean']['input']>;
  isPosted?: InputMaybe<Scalars['Boolean']['input']>;
  isTax?: InputMaybe<Scalars['Boolean']['input']>;
  item?: InputMaybe<ItemInput>;
  netAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  receiveDiscountCost?: InputMaybe<Scalars['BigDecimal']['input']>;
  receiveQty?: InputMaybe<Scalars['Int']['input']>;
  receiveUnitCost?: InputMaybe<Scalars['BigDecimal']['input']>;
  receivingReport?: InputMaybe<ReceivingReportInput>;
  refPoItem?: InputMaybe<PurchaseOrderItemsInput>;
  totalAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
};

export type Region = {
  __typename?: 'Region';
  id?: Maybe<Scalars['UUID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  regionName?: Maybe<Scalars['String']['output']>;
};

export type ReleaseCheck = {
  __typename?: 'ReleaseCheck';
  bank?: Maybe<Bank>;
  check?: Maybe<DisbursementCheck>;
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  disbursement?: Maybe<Disbursement>;
  id?: Maybe<Scalars['UUID']['output']>;
  isPosted?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  releaseDate?: Maybe<Scalars['Instant']['output']>;
  release_by?: Maybe<Scalars['String']['output']>;
};

export enum RepairMaintenanceItemType {
  Material = 'MATERIAL',
  Service = 'SERVICE'
}

export enum RepairMaintenanceStatus {
  Completed = 'COMPLETED',
  Draft = 'DRAFT',
  Pending = 'PENDING'
}

export enum RepairServiceClassification {
  Maintenance = 'MAINTENANCE',
  Repair = 'REPAIR'
}

export enum RepairServiceType {
  InhouseServiceOnly = 'INHOUSE_SERVICE_ONLY',
  InhouseWithMaterials = 'INHOUSE_WITH_MATERIALS',
  OutsourcedServiceAndMaterials = 'OUTSOURCED_SERVICE_AND_MATERIALS',
  OutsourcedServiceWithInhouseMaterials = 'OUTSOURCED_SERVICE_WITH_INHOUSE_MATERIALS'
}

export type RepairType = {
  __typename?: 'RepairType';
  code?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  is_active?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
};

export type RepairTypeInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ReturnSupplier = {
  __typename?: 'ReturnSupplier';
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isPosted?: Maybe<Scalars['Boolean']['output']>;
  isVoid?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  office?: Maybe<Office>;
  receivedRefDate?: Maybe<Scalars['Instant']['output']>;
  receivedRefNo?: Maybe<Scalars['String']['output']>;
  received_by?: Maybe<Scalars['String']['output']>;
  refSrr?: Maybe<Scalars['String']['output']>;
  referenceType?: Maybe<Scalars['String']['output']>;
  returnBy?: Maybe<Scalars['String']['output']>;
  returnDate?: Maybe<Scalars['Instant']['output']>;
  returnUser?: Maybe<Scalars['UUID']['output']>;
  rtsNo?: Maybe<Scalars['String']['output']>;
  supplier?: Maybe<Supplier>;
};

export type ReturnSupplierInput = {
  company?: InputMaybe<Scalars['UUID']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  isPosted?: InputMaybe<Scalars['Boolean']['input']>;
  isVoid?: InputMaybe<Scalars['Boolean']['input']>;
  office?: InputMaybe<OfficeInput>;
  receivedRefDate?: InputMaybe<Scalars['Instant']['input']>;
  receivedRefNo?: InputMaybe<Scalars['String']['input']>;
  received_by?: InputMaybe<Scalars['String']['input']>;
  refSrr?: InputMaybe<Scalars['String']['input']>;
  referenceType?: InputMaybe<Scalars['String']['input']>;
  returnBy?: InputMaybe<Scalars['String']['input']>;
  returnDate?: InputMaybe<Scalars['Instant']['input']>;
  returnUser?: InputMaybe<Scalars['UUID']['input']>;
  rtsNo?: InputMaybe<Scalars['String']['input']>;
  supplier?: InputMaybe<SupplierInput>;
};

export type ReturnSupplierItem = {
  __typename?: 'ReturnSupplierItem';
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isPosted?: Maybe<Scalars['Boolean']['output']>;
  item?: Maybe<Item>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  returnQty?: Maybe<Scalars['Int']['output']>;
  returnSupplier?: Maybe<ReturnSupplier>;
  returnUnitCost?: Maybe<Scalars['BigDecimal']['output']>;
  return_remarks?: Maybe<Scalars['String']['output']>;
  unitMeasurement?: Maybe<Scalars['String']['output']>;
  uou?: Maybe<Scalars['String']['output']>;
};

export type SssContribution = {
  __typename?: 'SSSContribution';
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  eeContribution?: Maybe<Scalars['BigDecimal']['output']>;
  erContribution?: Maybe<Scalars['BigDecimal']['output']>;
  er_ec_Contribution?: Maybe<Scalars['BigDecimal']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  maxAmount?: Maybe<Scalars['BigDecimal']['output']>;
  minAmount?: Maybe<Scalars['BigDecimal']['output']>;
  monthlySalaryCredit?: Maybe<Scalars['BigDecimal']['output']>;
  wispEeContribution?: Maybe<Scalars['BigDecimal']['output']>;
  wispErContribution?: Maybe<Scalars['BigDecimal']['output']>;
};

export type SalaryRateMultiplier = {
  __typename?: 'SalaryRateMultiplier';
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  doubleHoliday?: Maybe<Scalars['Float']['output']>;
  doubleHolidayAndRestDay?: Maybe<Scalars['Float']['output']>;
  doubleHolidayAndRestDayOvertime?: Maybe<Scalars['Float']['output']>;
  doubleHolidayOvertime?: Maybe<Scalars['Float']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  nightDifferential?: Maybe<Scalars['Float']['output']>;
  regular?: Maybe<Scalars['Float']['output']>;
  regularHoliday?: Maybe<Scalars['Float']['output']>;
  regularHolidayAndRestDay?: Maybe<Scalars['Float']['output']>;
  regularHolidayAndRestDayOvertime?: Maybe<Scalars['Float']['output']>;
  regularHolidayOvertime?: Maybe<Scalars['Float']['output']>;
  regularOvertime?: Maybe<Scalars['Float']['output']>;
  restday?: Maybe<Scalars['Float']['output']>;
  restdayOvertime?: Maybe<Scalars['Float']['output']>;
  specialHoliday?: Maybe<Scalars['Float']['output']>;
  specialHolidayAndRestDay?: Maybe<Scalars['Float']['output']>;
  specialHolidayAndRestDayOvertime?: Maybe<Scalars['Float']['output']>;
  specialHolidayOvertime?: Maybe<Scalars['Float']['output']>;
};

export type SalesChartsDto = {
  __typename?: 'SalesChartsDto';
  apr?: Maybe<Scalars['BigDecimal']['output']>;
  aug?: Maybe<Scalars['BigDecimal']['output']>;
  dece?: Maybe<Scalars['BigDecimal']['output']>;
  feb?: Maybe<Scalars['BigDecimal']['output']>;
  jan?: Maybe<Scalars['BigDecimal']['output']>;
  jul?: Maybe<Scalars['BigDecimal']['output']>;
  jun?: Maybe<Scalars['BigDecimal']['output']>;
  mar?: Maybe<Scalars['BigDecimal']['output']>;
  may?: Maybe<Scalars['BigDecimal']['output']>;
  nov?: Maybe<Scalars['BigDecimal']['output']>;
  oct?: Maybe<Scalars['BigDecimal']['output']>;
  sep?: Maybe<Scalars['BigDecimal']['output']>;
};

export type SalesReportDto = {
  __typename?: 'SalesReportDto';
  bill?: Maybe<Scalars['String']['output']>;
  category?: Maybe<Scalars['String']['output']>;
  commission?: Maybe<Scalars['BigDecimal']['output']>;
  date_trans?: Maybe<Scalars['String']['output']>;
  deductions?: Maybe<Scalars['String']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  disc_amount?: Maybe<Scalars['BigDecimal']['output']>;
  gross?: Maybe<Scalars['BigDecimal']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  netsales?: Maybe<Scalars['BigDecimal']['output']>;
  ornumber?: Maybe<Scalars['String']['output']>;
  ref_no?: Maybe<Scalars['String']['output']>;
  trans_date?: Maybe<Scalars['Instant']['output']>;
  trans_type?: Maybe<Scalars['String']['output']>;
};

export type Schedule = {
  __typename?: 'Schedule';
  color?: Maybe<Scalars['String']['output']>;
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  dateTimeEnd?: Maybe<Scalars['String']['output']>;
  dateTimeEndRaw?: Maybe<Scalars['Instant']['output']>;
  dateTimeStart?: Maybe<Scalars['String']['output']>;
  dateTimeStartRaw?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  label?: Maybe<Scalars['String']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  mealBreakEnd?: Maybe<Scalars['Instant']['output']>;
  mealBreakStart?: Maybe<Scalars['Instant']['output']>;
  project?: Maybe<Projects>;
  title?: Maybe<Scalars['String']['output']>;
};

export type ScheduleLock = {
  __typename?: 'ScheduleLock';
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  date?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isLocked?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
};

export type SelectedDate = {
  __typename?: 'SelectedDate';
  endDatetime?: Maybe<Scalars['Instant']['output']>;
  startDatetime?: Maybe<Scalars['Instant']['output']>;
};

export type SelectedDateInput = {
  endDatetime?: InputMaybe<Scalars['Instant']['input']>;
  startDatetime?: InputMaybe<Scalars['Instant']['input']>;
};

export type ServiceCategory = {
  __typename?: 'ServiceCategory';
  code?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  is_active?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
};

export type ServiceCategoryInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ServiceItems = {
  __typename?: 'ServiceItems';
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  item?: Maybe<Item>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  qty?: Maybe<Scalars['Int']['output']>;
  service?: Maybe<ServiceManagement>;
  unitMeasurement?: Maybe<Scalars['String']['output']>;
  uou?: Maybe<Scalars['String']['output']>;
  wcost?: Maybe<Scalars['BigDecimal']['output']>;
};

export type ServiceManagement = {
  __typename?: 'ServiceManagement';
  available?: Maybe<Scalars['Boolean']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  cost?: Maybe<Scalars['BigDecimal']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  govCost?: Maybe<Scalars['BigDecimal']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  office?: Maybe<Office>;
  type?: Maybe<Scalars['String']['output']>;
};

export type ServiceManagementInput = {
  available?: InputMaybe<Scalars['Boolean']['input']>;
  code?: InputMaybe<Scalars['String']['input']>;
  cost?: InputMaybe<Scalars['BigDecimal']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  govCost?: InputMaybe<Scalars['BigDecimal']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  office?: InputMaybe<OfficeInput>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type Shift = {
  __typename?: 'Shift';
  active?: Maybe<Scalars['Boolean']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  employee?: Maybe<Employee>;
  endShift?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  payments?: Maybe<Array<Maybe<Payment>>>;
  remarks?: Maybe<Scalars['String']['output']>;
  shiftNo?: Maybe<Scalars['String']['output']>;
  startShift?: Maybe<Scalars['Instant']['output']>;
  terminal?: Maybe<Terminal>;
};

export type Signature = {
  __typename?: 'Signature';
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  currentUsers?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  office?: Maybe<Office>;
  sequence?: Maybe<Scalars['Int']['output']>;
  signatureHeader?: Maybe<Scalars['String']['output']>;
  signaturePerson?: Maybe<Scalars['String']['output']>;
  signaturePosition?: Maybe<Scalars['String']['output']>;
  signatureType?: Maybe<Scalars['String']['output']>;
};

export type Sort = {
  __typename?: 'Sort';
  orders: Array<Order>;
};

export type Sorting = {
  __typename?: 'Sorting';
  orders: Array<Order>;
};

export type StockCard = {
  __typename?: 'StockCard';
  adjustment?: Maybe<Scalars['Int']['output']>;
  desc_long?: Maybe<Scalars['String']['output']>;
  destination_office?: Maybe<Scalars['String']['output']>;
  destination_officename?: Maybe<Scalars['String']['output']>;
  document_code?: Maybe<Scalars['String']['output']>;
  document_desc?: Maybe<Scalars['String']['output']>;
  document_types?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['String']['output']>;
  item?: Maybe<Scalars['String']['output']>;
  item_code?: Maybe<Scalars['String']['output']>;
  ledger_date?: Maybe<Scalars['String']['output']>;
  ledger_qty_out?: Maybe<Scalars['Int']['output']>;
  ledger_qtyin?: Maybe<Scalars['Int']['output']>;
  reference_no?: Maybe<Scalars['String']['output']>;
  runningbalance?: Maybe<Scalars['BigDecimal']['output']>;
  runningqty?: Maybe<Scalars['Int']['output']>;
  sku?: Maybe<Scalars['String']['output']>;
  source_office?: Maybe<Scalars['String']['output']>;
  source_officename?: Maybe<Scalars['String']['output']>;
  unitcost?: Maybe<Scalars['BigDecimal']['output']>;
  wcost?: Maybe<Scalars['BigDecimal']['output']>;
};

export type StockIssue = {
  __typename?: 'StockIssue';
  company?: Maybe<Scalars['UUID']['output']>;
  created?: Maybe<Scalars['Instant']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isCancel?: Maybe<Scalars['Boolean']['output']>;
  isPosted?: Maybe<Scalars['Boolean']['output']>;
  issueDate?: Maybe<Scalars['Instant']['output']>;
  issueFrom?: Maybe<Office>;
  issueNo?: Maybe<Scalars['String']['output']>;
  issueTo?: Maybe<Office>;
  issueType?: Maybe<Scalars['String']['output']>;
  issued_by?: Maybe<Employee>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  project?: Maybe<Projects>;
};

export type StockIssueInput = {
  company?: InputMaybe<Scalars['UUID']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  isCancel?: InputMaybe<Scalars['Boolean']['input']>;
  isPosted?: InputMaybe<Scalars['Boolean']['input']>;
  issueDate?: InputMaybe<Scalars['Instant']['input']>;
  issueFrom?: InputMaybe<OfficeInput>;
  issueNo?: InputMaybe<Scalars['String']['input']>;
  issueTo?: InputMaybe<OfficeInput>;
  issueType?: InputMaybe<Scalars['String']['input']>;
  issued_by?: InputMaybe<EmployeeInput>;
  project?: InputMaybe<ProjectsInput>;
};

export type StockIssueItems = {
  __typename?: 'StockIssueItems';
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isPosted?: Maybe<Scalars['Boolean']['output']>;
  issueQty?: Maybe<Scalars['Int']['output']>;
  item?: Maybe<Item>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  remarks?: Maybe<Scalars['String']['output']>;
  stockIssue?: Maybe<StockIssue>;
  unitCost?: Maybe<Scalars['BigDecimal']['output']>;
  unitMeasurement?: Maybe<Scalars['String']['output']>;
  uou?: Maybe<Scalars['String']['output']>;
};

export type SubAccountBreakdownDto = {
  __typename?: 'SubAccountBreakdownDto';
  amount?: Maybe<Scalars['BigDecimal']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  entryType?: Maybe<AccountingEntryType>;
  subaccountCode?: Maybe<Scalars['String']['output']>;
};

export type SubAccountSetup = {
  __typename?: 'SubAccountSetup';
  accountCategory?: Maybe<AccountCategory>;
  accountName?: Maybe<Scalars['String']['output']>;
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  domainExcludes?: Maybe<Array<Maybe<DomainOptionDto>>>;
  domainName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isInactive?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  parentAccount?: Maybe<ParentAccount>;
  sourceDomain?: Maybe<DomainEnum>;
  subaccountCode?: Maybe<Scalars['String']['output']>;
  subaccountParent?: Maybe<SubAccountSetup>;
  subaccountType?: Maybe<AccountType>;
  subaccountTypeDesc?: Maybe<Scalars['String']['output']>;
};

export type Supplier = {
  __typename?: 'Supplier';
  accountName?: Maybe<Scalars['String']['output']>;
  atcNo?: Maybe<Scalars['String']['output']>;
  code?: Maybe<Scalars['String']['output']>;
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  creditLimit?: Maybe<Scalars['BigDecimal']['output']>;
  domain?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  isVatInclusive?: Maybe<Scalars['Boolean']['output']>;
  isVatable?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  leadTime?: Maybe<Scalars['Int']['output']>;
  paymentTerms?: Maybe<PaymentTerm>;
  primaryAddress?: Maybe<Scalars['String']['output']>;
  primaryContactPerson?: Maybe<Scalars['String']['output']>;
  primaryFax?: Maybe<Scalars['String']['output']>;
  primaryTelphone?: Maybe<Scalars['String']['output']>;
  remarks?: Maybe<Scalars['String']['output']>;
  secondaryAddress?: Maybe<Scalars['String']['output']>;
  secondaryContactPerson?: Maybe<Scalars['String']['output']>;
  secondaryFax?: Maybe<Scalars['String']['output']>;
  secondaryTelphone?: Maybe<Scalars['String']['output']>;
  supplierCode?: Maybe<Scalars['String']['output']>;
  supplierEmail?: Maybe<Scalars['String']['output']>;
  supplierEntity?: Maybe<Scalars['String']['output']>;
  supplierFullname?: Maybe<Scalars['String']['output']>;
  supplierTin?: Maybe<Scalars['String']['output']>;
  supplierTypes?: Maybe<SupplierType>;
};

export type SupplierInput = {
  atcNo?: InputMaybe<Scalars['String']['input']>;
  company?: InputMaybe<Scalars['UUID']['input']>;
  creditLimit?: InputMaybe<Scalars['BigDecimal']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isVatInclusive?: InputMaybe<Scalars['Boolean']['input']>;
  isVatable?: InputMaybe<Scalars['Boolean']['input']>;
  leadTime?: InputMaybe<Scalars['Int']['input']>;
  paymentTerms?: InputMaybe<PaymentTermInput>;
  primaryAddress?: InputMaybe<Scalars['String']['input']>;
  primaryContactPerson?: InputMaybe<Scalars['String']['input']>;
  primaryFax?: InputMaybe<Scalars['String']['input']>;
  primaryTelphone?: InputMaybe<Scalars['String']['input']>;
  remarks?: InputMaybe<Scalars['String']['input']>;
  secondaryAddress?: InputMaybe<Scalars['String']['input']>;
  secondaryContactPerson?: InputMaybe<Scalars['String']['input']>;
  secondaryFax?: InputMaybe<Scalars['String']['input']>;
  secondaryTelphone?: InputMaybe<Scalars['String']['input']>;
  supplierCode?: InputMaybe<Scalars['String']['input']>;
  supplierEmail?: InputMaybe<Scalars['String']['input']>;
  supplierEntity?: InputMaybe<Scalars['String']['input']>;
  supplierFullname?: InputMaybe<Scalars['String']['input']>;
  supplierTin?: InputMaybe<Scalars['String']['input']>;
  supplierTypes?: InputMaybe<SupplierTypeInput>;
};

export type SupplierInventory = {
  __typename?: 'SupplierInventory';
  brand?: Maybe<Scalars['String']['output']>;
  company?: Maybe<Scalars['UUID']['output']>;
  descLong?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  item?: Maybe<Item>;
  itemCode?: Maybe<Scalars['String']['output']>;
  last_wcost?: Maybe<Scalars['BigDecimal']['output']>;
  office?: Maybe<Office>;
  onHand?: Maybe<Scalars['Int']['output']>;
  sku?: Maybe<Scalars['String']['output']>;
  supplier?: Maybe<Supplier>;
  unitCost?: Maybe<Scalars['BigDecimal']['output']>;
  unitMeasurement?: Maybe<Scalars['String']['output']>;
};

export type SupplierItem = {
  __typename?: 'SupplierItem';
  brand?: Maybe<Scalars['String']['output']>;
  company?: Maybe<Scalars['UUID']['output']>;
  cost?: Maybe<Scalars['BigDecimal']['output']>;
  costPurchase?: Maybe<Scalars['BigDecimal']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  descLong?: Maybe<Scalars['String']['output']>;
  genericName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  item?: Maybe<Item>;
  itemId?: Maybe<Scalars['String']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  supplier?: Maybe<Supplier>;
  unitMeasurement?: Maybe<Scalars['String']['output']>;
};

export type SupplierType = {
  __typename?: 'SupplierType';
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  supplierTypeCode?: Maybe<Scalars['String']['output']>;
  supplierTypeDesc?: Maybe<Scalars['String']['output']>;
};

export type SupplierTypeInput = {
  company?: InputMaybe<Scalars['UUID']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  supplierTypeCode?: InputMaybe<Scalars['String']['input']>;
  supplierTypeDesc?: InputMaybe<Scalars['String']['input']>;
};

export type Terminal = {
  __typename?: 'Terminal';
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  employee?: Maybe<Employee>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  mac_address?: Maybe<Scalars['String']['output']>;
  terminal_no?: Maybe<Scalars['String']['output']>;
};

export type Timekeeping = {
  __typename?: 'Timekeeping';
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  deleted?: Maybe<Scalars['Boolean']['output']>;
  deletedEnd?: Maybe<Scalars['Instant']['output']>;
  finalizedBy?: Maybe<Employee>;
  finalizedDate?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  payroll?: Maybe<Payroll>;
  projectBreakdown?: Maybe<Array<Maybe<HoursLog>>>;
  salaryBreakdown?: Maybe<Array<Maybe<EmployeeSalaryDto>>>;
  status?: Maybe<PayrollStatus>;
  timekeepingEmployees?: Maybe<Array<Maybe<TimekeepingEmployee>>>;
};

export type TimekeepingEmployee = {
  __typename?: 'TimekeepingEmployee';
  accumulatedLogs?: Maybe<Array<Maybe<AccumulatedLogs>>>;
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  finalizedBy?: Maybe<Employee>;
  finalizedDate?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  payrollEmployee?: Maybe<PayrollEmployee>;
  projectBreakdown?: Maybe<Array<Maybe<HoursLog>>>;
  salaryBreakdown?: Maybe<Array<Maybe<EmployeeSalaryDto>>>;
  status?: Maybe<PayrollEmployeeStatus>;
  timekeeping?: Maybe<Timekeeping>;
  totalHours?: Maybe<HoursLog>;
  totalSalary?: Maybe<EmployeeSalaryDto>;
};

export type TimekeepingEmployeeDto = {
  __typename?: 'TimekeepingEmployeeDto';
  employeeId?: Maybe<Scalars['UUID']['output']>;
  fullName?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isExcludedFromAttendance?: Maybe<Scalars['Boolean']['output']>;
  position?: Maybe<Position>;
  projectBreakdown?: Maybe<Array<Maybe<HoursLog>>>;
  salaryBreakdown?: Maybe<Array<Maybe<EmployeeSalaryDto>>>;
  status?: Maybe<Scalars['String']['output']>;
};

export type TransactionJournalDto = {
  __typename?: 'TransactionJournalDto';
  approved?: Maybe<Scalars['Long']['output']>;
  entityName?: Maybe<Scalars['String']['output']>;
  journalType?: Maybe<Scalars['String']['output']>;
  notApproved?: Maybe<Scalars['Long']['output']>;
  otherDetail?: Maybe<Scalars['String']['output']>;
  referenceNo?: Maybe<Scalars['String']['output']>;
};

export type TransactionType = {
  __typename?: 'TransactionType';
  company?: Maybe<Scalars['UUID']['output']>;
  consignment?: Maybe<Scalars['Boolean']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  fixAsset?: Maybe<Scalars['Boolean']['output']>;
  flagValue?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  status?: Maybe<Scalars['Boolean']['output']>;
  tag?: Maybe<Scalars['String']['output']>;
};

export type UnitDto = {
  __typename?: 'UnitDto';
  unit?: Maybe<Scalars['String']['output']>;
};

export type UnitMeasurement = {
  __typename?: 'UnitMeasurement';
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  isBig?: Maybe<Scalars['Boolean']['output']>;
  isSmall?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  unitCode?: Maybe<Scalars['String']['output']>;
  unitDescription?: Maybe<Scalars['String']['output']>;
};

export type UnitMeasurementInput = {
  company?: InputMaybe<Scalars['UUID']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  isBig?: InputMaybe<Scalars['Boolean']['input']>;
  isSmall?: InputMaybe<Scalars['Boolean']['input']>;
  unitCode?: InputMaybe<Scalars['String']['input']>;
  unitDescription?: InputMaybe<Scalars['String']['input']>;
};

export type User = {
  __typename?: 'User';
  /** Get all User access */
  access?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  /** Get all User access */
  accessNames?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
  activated: Scalars['Boolean']['output'];
  activationKey?: Maybe<Scalars['String']['output']>;
  authorities?: Maybe<Array<Maybe<Authority>>>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  email?: Maybe<Scalars['String']['output']>;
  employee?: Maybe<Employee>;
  firstName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['Long']['output']>;
  langKey?: Maybe<Scalars['String']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  login: Scalars['String']['output'];
  password: Scalars['String']['output'];
  permissions?: Maybe<Array<Maybe<Permission>>>;
  /** Get all User persistentTokens */
  persistentTokens?: Maybe<Array<Maybe<PersistentToken>>>;
  resetDate?: Maybe<Scalars['LocalDateTime']['output']>;
  resetKey?: Maybe<Scalars['String']['output']>;
  /** Get all User roles */
  roles?: Maybe<Array<Maybe<Scalars['String']['output']>>>;
};

export type UserInput = {
  activated: Scalars['Boolean']['input'];
  createdDate?: InputMaybe<Scalars['Instant']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  employee?: InputMaybe<EmployeeInput>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['Long']['input']>;
  langKey?: InputMaybe<Scalars['String']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  login: Scalars['String']['input'];
  resetDate?: InputMaybe<Scalars['LocalDateTime']['input']>;
  resetKey?: InputMaybe<Scalars['String']['input']>;
};

export type VehicleUsageDocs = {
  __typename?: 'VehicleUsageDocs';
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  docType?: Maybe<Scalars['String']['output']>;
  file?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  item?: Maybe<Item>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  vehicleUsage?: Maybe<VehicleUsageMonitoring>;
};

export type VehicleUsageMonitoring = {
  __typename?: 'VehicleUsageMonitoring';
  asset?: Maybe<Assets>;
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  endDatetime?: Maybe<Scalars['Instant']['output']>;
  endFuelReading?: Maybe<Scalars['String']['output']>;
  endOdometerReading?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  item?: Maybe<Item>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  project?: Maybe<Projects>;
  route?: Maybe<Scalars['String']['output']>;
  startDatetime?: Maybe<Scalars['Instant']['output']>;
  startFuelReading?: Maybe<Scalars['String']['output']>;
  startOdometerReading?: Maybe<Scalars['String']['output']>;
  usagePurpose?: Maybe<Scalars['String']['output']>;
};

export type Weather = {
  __typename?: 'Weather';
  weather?: Maybe<Scalars['String']['output']>;
};

export type WithholdingTaxMatrix = {
  __typename?: 'WithholdingTaxMatrix';
  baseAmount?: Maybe<Scalars['BigDecimal']['output']>;
  company?: Maybe<CompanySettings>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  maxAmount?: Maybe<Scalars['BigDecimal']['output']>;
  minAmount?: Maybe<Scalars['BigDecimal']['output']>;
  percentage?: Maybe<Scalars['BigDecimal']['output']>;
  thresholdAmount?: Maybe<Scalars['BigDecimal']['output']>;
  type?: Maybe<PayrollType>;
};

export type Wtx2307 = {
  __typename?: 'Wtx2307';
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  ewtAmount?: Maybe<Scalars['BigDecimal']['output']>;
  gross?: Maybe<Scalars['BigDecimal']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  netVat?: Maybe<Scalars['BigDecimal']['output']>;
  process?: Maybe<Scalars['Boolean']['output']>;
  refId?: Maybe<Scalars['UUID']['output']>;
  refNo?: Maybe<Scalars['String']['output']>;
  sourceDoc?: Maybe<Scalars['String']['output']>;
  supplier?: Maybe<Supplier>;
  type?: Maybe<Scalars['String']['output']>;
  vatAmount?: Maybe<Scalars['BigDecimal']['output']>;
  wtxConsolidated?: Maybe<Scalars['UUID']['output']>;
  wtxDate?: Maybe<Scalars['Instant']['output']>;
};

export type Wtx2307Consolidated = {
  __typename?: 'Wtx2307Consolidated';
  company?: Maybe<Scalars['UUID']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  dateFrom?: Maybe<Scalars['Instant']['output']>;
  dateTo?: Maybe<Scalars['Instant']['output']>;
  ewtAmount?: Maybe<Scalars['BigDecimal']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  refNo?: Maybe<Scalars['String']['output']>;
  remarks?: Maybe<Scalars['String']['output']>;
  supplier?: Maybe<Supplier>;
};

export type DeleteIntegrationMutationVariables = Exact<{
  integrationId?: InputMaybe<Scalars['UUID']['input']>;
}>;


export type DeleteIntegrationMutation = { __typename?: 'Mutation', deleteIntegration?: boolean | null };

export type DeleteIntegrationItemMutationVariables = Exact<{
  integrationId?: InputMaybe<Scalars['UUID']['input']>;
  integrationItemId?: InputMaybe<Scalars['UUID']['input']>;
}>;


export type DeleteIntegrationItemMutation = { __typename?: 'Mutation', deleteIntegrationItem?: boolean | null };

export type AddSubAccountMutationVariables = Exact<{
  id?: InputMaybe<Scalars['UUID']['input']>;
  accountId?: InputMaybe<Scalars['UUID']['input']>;
}>;


export type AddSubAccountMutation = { __typename?: 'Mutation', addSubAccountToIntegration?: boolean | null };

export type UpdateIntegrationItemMutationVariables = Exact<{
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  integrationId?: InputMaybe<Scalars['UUID']['input']>;
  integrationItemId?: InputMaybe<Scalars['UUID']['input']>;
}>;


export type UpdateIntegrationItemMutation = { __typename?: 'Mutation', updateIntegrationItem?: boolean | null };

export type TransferIntegrationMutationVariables = Exact<{
  id?: InputMaybe<Scalars['UUID']['input']>;
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
}>;


export type TransferIntegrationMutation = { __typename?: 'Mutation', transferIntegration?: boolean | null };

export type UpdatePayrollAllowanceStatusMutationVariables = Exact<{
  payrollId?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<PayrollStatus>;
}>;


export type UpdatePayrollAllowanceStatusMutation = { __typename?: 'Mutation', data?: { __typename?: 'GraphQLResVal_String', success: boolean, message?: string | null, response?: string | null } | null };

export type UpdatePayrollContributionStatusMutationVariables = Exact<{
  payrollId?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<PayrollStatus>;
}>;


export type UpdatePayrollContributionStatusMutation = { __typename?: 'Mutation', data?: { __typename?: 'GraphQLResVal_String', success: boolean, message?: string | null, response?: string | null } | null };

export type ChangePasswordMutationVariables = Exact<{
  username?: InputMaybe<Scalars['String']['input']>;
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', newPassword?: string | null };


export const DeleteIntegrationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteIntegration"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"integrationId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteIntegration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"integrationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"integrationId"}}}]}]}}]} as unknown as DocumentNode<DeleteIntegrationMutation, DeleteIntegrationMutationVariables>;
export const DeleteIntegrationItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"DeleteIntegrationItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"integrationId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"integrationItemId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"deleteIntegrationItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"integrationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"integrationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"integrationItemId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"integrationItemId"}}}]}]}}]} as unknown as DocumentNode<DeleteIntegrationItemMutation, DeleteIntegrationItemMutationVariables>;
export const AddSubAccountDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"AddSubAccount"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"addSubAccountToIntegration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"accountId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"accountId"}}}]}]}}]} as unknown as DocumentNode<AddSubAccountMutation, AddSubAccountMutationVariables>;
export const UpdateIntegrationItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateIntegrationItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fields"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Map_String_ObjectScalar"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"integrationId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"integrationItemId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"updateIntegrationItem"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"fields"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fields"}}},{"kind":"Argument","name":{"kind":"Name","value":"integrationId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"integrationId"}}},{"kind":"Argument","name":{"kind":"Name","value":"integrationItemId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"integrationItemId"}}}]}]}}]} as unknown as DocumentNode<UpdateIntegrationItemMutation, UpdateIntegrationItemMutationVariables>;
export const TransferIntegrationDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"TransferIntegration"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fields"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Map_String_ObjectScalar"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"transferIntegration"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"fields"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fields"}}}]}]}}]} as unknown as DocumentNode<TransferIntegrationMutation, TransferIntegrationMutationVariables>;
export const UpdatePayrollAllowanceStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updatePayrollAllowanceStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"payrollId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PayrollStatus"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"data"},"name":{"kind":"Name","value":"updatePayrollAllowanceStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"payrollId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"payrollId"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"response"}}]}}]}}]} as unknown as DocumentNode<UpdatePayrollAllowanceStatusMutation, UpdatePayrollAllowanceStatusMutationVariables>;
export const UpdatePayrollContributionStatusDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"updatePayrollContributionStatus"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"payrollId"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"status"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"PayrollStatus"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"data"},"name":{"kind":"Name","value":"updatePayrollContributionStatus"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"payrollId"},"value":{"kind":"Variable","name":{"kind":"Name","value":"payrollId"}}},{"kind":"Argument","name":{"kind":"Name","value":"status"},"value":{"kind":"Variable","name":{"kind":"Name","value":"status"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"success"}},{"kind":"Field","name":{"kind":"Name","value":"message"}},{"kind":"Field","name":{"kind":"Name","value":"response"}}]}}]}}]} as unknown as DocumentNode<UpdatePayrollContributionStatusMutation, UpdatePayrollContributionStatusMutationVariables>;
export const ChangePasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangePassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"newPassword"},"name":{"kind":"Name","value":"changePassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}]}]}}]} as unknown as DocumentNode<ChangePasswordMutation, ChangePasswordMutationVariables>;