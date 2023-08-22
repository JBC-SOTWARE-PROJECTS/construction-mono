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
  Instant: { input: any; output: any; }
  /** Built-in scalar representing a local date */
  LocalDate: { input: any; output: any; }
  /** Built-in scalar representing a local date-time */
  LocalDateTime: { input: any; output: any; }
  /** Long type */
  Long: { input: any; output: any; }
  /** Built-in scalar for map-like structures */
  Map_String_ObjectScalar: { input: any; output: any; }
  /** Unrepresentable type */
  UNREPRESENTABLE: { input: any; output: any; }
  /** UUID String */
  UUID: { input: any; output: any; }
};

export type Assets = {
  __typename?: 'Assets';
  assetCode?: Maybe<Scalars['String']['output']>;
  brand?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  model?: Maybe<Scalars['String']['output']>;
  plateNo?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

export type Authority = {
  __typename?: 'Authority';
  name: Scalars['String']['output'];
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
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  customer?: Maybe<Customer>;
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
  customer?: InputMaybe<CustomerInput>;
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
  qty?: Maybe<Scalars['BigDecimal']['output']>;
  recordNo?: Maybe<Scalars['String']['output']>;
  refId?: Maybe<Scalars['UUID']['output']>;
  service?: Maybe<ServiceManagement>;
  status?: Maybe<Scalars['Boolean']['output']>;
  subTotal?: Maybe<Scalars['BigDecimal']['output']>;
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

export type City = {
  __typename?: 'City';
  cityName?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  name?: Maybe<Scalars['String']['output']>;
  province?: Maybe<Province>;
  region?: Maybe<Region>;
};

export type CompanySettings = {
  __typename?: 'CompanySettings';
  companyCode?: Maybe<Scalars['String']['output']>;
  companyName?: Maybe<Scalars['String']['output']>;
  govMarkup?: Maybe<Scalars['BigDecimal']['output']>;
  hideInSelection?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
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
  markup?: InputMaybe<Scalars['BigDecimal']['input']>;
  vatRate?: InputMaybe<Scalars['BigDecimal']['input']>;
};

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

export type CustomerInput = {
  address?: InputMaybe<Scalars['String']['input']>;
  contactPerson?: InputMaybe<Scalars['String']['input']>;
  contactPersonNum?: InputMaybe<Scalars['String']['input']>;
  customerType?: InputMaybe<Scalars['String']['input']>;
  emailAdd?: InputMaybe<Scalars['String']['input']>;
  fullName?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  isAssetsCustomer?: InputMaybe<Scalars['Boolean']['input']>;
  telNo?: InputMaybe<Scalars['String']['input']>;
};

export type DashboardDto = {
  __typename?: 'DashboardDto';
  status?: Maybe<Scalars['String']['output']>;
  value?: Maybe<Scalars['Int']['output']>;
};

export enum Direction {
  Asc = 'ASC',
  Desc = 'DESC'
}

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

export type Employee = {
  __typename?: 'Employee';
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
  employeeNo?: Maybe<Scalars['String']['output']>;
  employeeTelNo?: Maybe<Scalars['String']['output']>;
  employeeType?: Maybe<Scalars['String']['output']>;
  firstName?: Maybe<Scalars['String']['output']>;
  fullAddress?: Maybe<Scalars['String']['output']>;
  fullInitialName?: Maybe<Scalars['String']['output']>;
  fullName?: Maybe<Scalars['String']['output']>;
  fullnameWithTitle?: Maybe<Scalars['String']['output']>;
  gender?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  initialName?: Maybe<Scalars['String']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  lastName?: Maybe<Scalars['String']['output']>;
  middleName?: Maybe<Scalars['String']['output']>;
  nameSuffix?: Maybe<Scalars['String']['output']>;
  nationality?: Maybe<Scalars['String']['output']>;
  office?: Maybe<Office>;
  pagIbigId?: Maybe<Scalars['String']['output']>;
  philhealthNo?: Maybe<Scalars['String']['output']>;
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

export type EmployeeInput = {
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
  employeeNo?: InputMaybe<Scalars['String']['input']>;
  employeeTelNo?: InputMaybe<Scalars['String']['input']>;
  employeeType?: InputMaybe<Scalars['String']['input']>;
  firstName?: InputMaybe<Scalars['String']['input']>;
  fullAddress?: InputMaybe<Scalars['String']['input']>;
  fullInitialName?: InputMaybe<Scalars['String']['input']>;
  fullName?: InputMaybe<Scalars['String']['input']>;
  fullnameWithTitle?: InputMaybe<Scalars['String']['input']>;
  gender?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  initialName?: InputMaybe<Scalars['String']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  lastName?: InputMaybe<Scalars['String']['input']>;
  middleName?: InputMaybe<Scalars['String']['input']>;
  nameSuffix?: InputMaybe<Scalars['String']['input']>;
  nationality?: InputMaybe<Scalars['String']['input']>;
  office?: InputMaybe<OfficeInput>;
  pagIbigId?: InputMaybe<Scalars['String']['input']>;
  philhealthNo?: InputMaybe<Scalars['String']['input']>;
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

export type Fiscal = {
  __typename?: 'Fiscal';
  active?: Maybe<Scalars['Boolean']['output']>;
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

export type Generic = {
  __typename?: 'Generic';
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
  genericCode?: InputMaybe<Scalars['String']['input']>;
  genericDescription?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
};

export type GraphQlRetVal_Boolean = {
  __typename?: 'GraphQLRetVal_Boolean';
  message?: Maybe<Scalars['String']['output']>;
  payload?: Maybe<Scalars['Boolean']['output']>;
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

export type Inventory = {
  __typename?: 'Inventory';
  active?: Maybe<Scalars['Boolean']['output']>;
  actualCost?: Maybe<Scalars['BigDecimal']['output']>;
  allowTrade?: Maybe<Scalars['Boolean']['output']>;
  brand?: Maybe<Scalars['String']['output']>;
  descLong?: Maybe<Scalars['String']['output']>;
  expiration_date?: Maybe<Scalars['LocalDateTime']['output']>;
  govMarkup?: Maybe<Scalars['BigDecimal']['output']>;
  govOutputTax?: Maybe<Scalars['BigDecimal']['output']>;
  govPrice?: Maybe<Scalars['BigDecimal']['output']>;
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
  vatRate?: Maybe<Scalars['BigDecimal']['output']>;
  vatable?: Maybe<Scalars['Boolean']['output']>;
};

export type InventoryLedger = {
  __typename?: 'InventoryLedger';
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
  brand?: Maybe<Scalars['String']['output']>;
  consignment?: Maybe<Scalars['Boolean']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  descLong?: Maybe<Scalars['String']['output']>;
  discountable?: Maybe<Scalars['Boolean']['output']>;
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
  unitMeasurement?: Maybe<Scalars['String']['output']>;
  unitOfUsage?: Maybe<Scalars['String']['output']>;
  unit_of_purchase?: Maybe<UnitMeasurement>;
  unit_of_usage?: Maybe<UnitMeasurement>;
  vatable?: Maybe<Scalars['Boolean']['output']>;
};

export type ItemCategory = {
  __typename?: 'ItemCategory';
  categoryCode?: Maybe<Scalars['String']['output']>;
  categoryDescription?: Maybe<Scalars['String']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  isActive?: Maybe<Scalars['Boolean']['output']>;
  itemGroup?: Maybe<ItemGroup>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
};

export type ItemCategoryInput = {
  categoryCode?: InputMaybe<Scalars['String']['input']>;
  categoryDescription?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  itemGroup?: InputMaybe<ItemGroupInput>;
};

export type ItemGroup = {
  __typename?: 'ItemGroup';
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
  id?: InputMaybe<Scalars['UUID']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  itemCode?: InputMaybe<Scalars['String']['input']>;
  itemDescription?: InputMaybe<Scalars['String']['input']>;
};

export type ItemInput = {
  active?: InputMaybe<Scalars['Boolean']['input']>;
  actualUnitCost?: InputMaybe<Scalars['BigDecimal']['input']>;
  brand?: InputMaybe<Scalars['String']['input']>;
  consignment?: InputMaybe<Scalars['Boolean']['input']>;
  descLong?: InputMaybe<Scalars['String']['input']>;
  discountable?: InputMaybe<Scalars['Boolean']['input']>;
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
  unit_of_purchase?: InputMaybe<UnitMeasurementInput>;
  unit_of_usage?: InputMaybe<UnitMeasurementInput>;
  vatable?: InputMaybe<Scalars['Boolean']['input']>;
};

export type ItemJobsDto = {
  __typename?: 'ItemJobsDto';
  types?: Maybe<Array<Maybe<JobItemType>>>;
  units?: Maybe<Array<Maybe<JobItemUnit>>>;
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
  customer?: Maybe<Customer>;
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
  customer?: InputMaybe<CustomerInput>;
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
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  disabledEditing?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  is_active?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
};

export type MaterialProduction = {
  __typename?: 'MaterialProduction';
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
  addDiscounts?: Maybe<BillingItem>;
  /** Add Items to bill */
  addItems?: Maybe<BillingItem>;
  /** Add Services to bill */
  addNewService?: Maybe<BillingItem>;
  addOTC?: Maybe<Billing>;
  /** add Payment */
  addPayment?: Maybe<Payment>;
  /** add remarks in shift */
  addRemarks?: Maybe<Shift>;
  addService?: Maybe<BillingItem>;
  /** add shift */
  addShift?: Maybe<Shift>;
  /** add Terminal */
  addTerminal?: Maybe<Terminal>;
  applyDefaultsPrice?: Maybe<OfficeItem>;
  /** insert BEG */
  beginningBalanceInsert?: Maybe<BeginningBalance>;
  /** Cancel Item */
  cancelItem?: Maybe<BillingItem>;
  changeCompany?: Maybe<Employee>;
  changePassword?: Maybe<Scalars['String']['output']>;
  closeBilling?: Maybe<Billing>;
  /** close shift */
  closeShift?: Maybe<Shift>;
  createBillingProject?: Maybe<Billing>;
  delPOMonitoring?: Maybe<PoDeliveryMonitoring>;
  deleteBillingItem?: Maybe<BillingItem>;
  directExpenseMaterials?: Maybe<GraphQlRetVal_Boolean>;
  employeeUpdateStatus?: Maybe<Employee>;
  expenseItemFromProjects?: Maybe<InventoryLedger>;
  linkPOItemRec?: Maybe<PurchaseOrderItems>;
  lockBilling?: Maybe<Billing>;
  overrideRecItems?: Maybe<ReceivingReport>;
  pettyCashPostVoid?: Maybe<PettyCash>;
  postInventoryLedgerBegBalance?: Maybe<InventoryLedger>;
  postInventoryLedgerIssuance?: Maybe<InventoryLedger>;
  postInventoryLedgerMaterial?: Maybe<InventoryLedger>;
  postInventoryLedgerQtyAdjustment?: Maybe<InventoryLedger>;
  postInventoryLedgerRec?: Maybe<InventoryLedger>;
  postInventoryLedgerReturn?: Maybe<InventoryLedger>;
  pushToBill?: Maybe<Billing>;
  pushToBillProject?: Maybe<Billing>;
  /** insert adj */
  quantityAdjustmentInsert?: Maybe<QuantityAdjustment>;
  /** Remove */
  removeItemSupplier?: Maybe<SupplierItem>;
  removeJobItem?: Maybe<JobItems>;
  removeMpItem?: Maybe<MaterialProductionItem>;
  removePoItem?: Maybe<PurchaseOrderItems>;
  removePrItem?: Maybe<PurchaseRequestItem>;
  removeRecItem?: Maybe<ReceivingReportItem>;
  removeRecItemNoQuery?: Maybe<ReceivingReportItem>;
  removeRtsItem?: Maybe<ReturnSupplierItem>;
  removeServiceItem?: Maybe<ServiceItems>;
  removeStiItem?: Maybe<StockIssueItems>;
  removedMaterial?: Maybe<ProjectUpdatesMaterials>;
  removedMaterialDirectExpense?: Maybe<ProjectUpdatesMaterials>;
  resetPassword?: Maybe<User>;
  setCounter?: Maybe<Counter>;
  setToCompleted?: Maybe<PurchaseOrder>;
  updateBegBalStatus?: Maybe<BeginningBalance>;
  updateBilled?: Maybe<JobItems>;
  updateJobAssetStatus?: Maybe<JobOrder>;
  updateJobBilled?: Maybe<Job>;
  updateJobStatus?: Maybe<Job>;
  updateMPStatus?: Maybe<MaterialProduction>;
  updateMpItemStatus?: Maybe<MaterialProductionItem>;
  updatePOStatus?: Maybe<PurchaseOrder>;
  updatePRItemPO?: Maybe<PurchaseRequestItem>;
  updatePRStatus?: Maybe<PurchaseRequest>;
  updatePrices?: Maybe<OfficeItem>;
  updateQtyAdjStatus?: Maybe<QuantityAdjustment>;
  updateRECStatus?: Maybe<ReceivingReport>;
  updateRTSStatus?: Maybe<ReturnSupplier>;
  updateReOrderQty?: Maybe<OfficeItem>;
  updateRecItemStatus?: Maybe<ReceivingReportItem>;
  updateReorder?: Maybe<OfficeItem>;
  updateRtsItemStatus?: Maybe<ReturnSupplierItem>;
  updateSTIStatus?: Maybe<StockIssue>;
  updateStatusCost?: Maybe<ProjectCost>;
  updateStiItemStatus?: Maybe<StockIssueItems>;
  upsertAddress?: Maybe<GraphQlRetVal_Boolean>;
  upsertAsset?: Maybe<Assets>;
  upsertBegQty?: Maybe<BeginningBalance>;
  upsertBillingItemByJob?: Maybe<BillingItem>;
  upsertBillingItemByMisc?: Maybe<BillingItem>;
  upsertBillingItemByProject?: Maybe<BillingItem>;
  upsertChargeInvoice?: Maybe<ChargeInvoice>;
  upsertCompany?: Maybe<CompanySettings>;
  upsertCustomer?: Maybe<Customer>;
  upsertEmployee?: Maybe<Employee>;
  upsertFiscal?: Maybe<Fiscal>;
  upsertGenerics?: Maybe<Generic>;
  upsertGroupPolicy?: Maybe<GroupPolicy>;
  upsertInsurance?: Maybe<Insurances>;
  upsertItem?: Maybe<GraphQlRetVal_Boolean>;
  upsertItemCategory?: Maybe<ItemCategory>;
  upsertItemGroup?: Maybe<ItemGroup>;
  upsertJob?: Maybe<Job>;
  upsertJobItem?: Maybe<JobItems>;
  upsertJobItemFormBilling?: Maybe<JobItems>;
  upsertJobItemsByParent?: Maybe<Job>;
  upsertJobOrder?: Maybe<JobOrder>;
  upsertJobOrderItems?: Maybe<JobOrderItems>;
  upsertJobStatus?: Maybe<JobStatus>;
  upsertMP?: Maybe<MaterialProduction>;
  upsertManyMaterials?: Maybe<GraphQlRetVal_Boolean>;
  upsertMpItem?: Maybe<MaterialProductionItem>;
  upsertOffice?: Maybe<Office>;
  upsertOfficeItem?: Maybe<OfficeItem>;
  upsertPO?: Maybe<PurchaseOrder>;
  upsertPOItem?: Maybe<PurchaseOrderItems>;
  upsertPOMonitoring?: Maybe<PoDeliveryMonitoring>;
  upsertPR?: Maybe<PurchaseRequest>;
  upsertPRItem?: Maybe<PurchaseRequestItem>;
  upsertPaymentTerms?: Maybe<PaymentTerm>;
  upsertPettyCash?: Maybe<PettyCash>;
  upsertPettyType?: Maybe<PettyType>;
  upsertPosition?: Maybe<Position>;
  upsertProject?: Maybe<Projects>;
  upsertProjectCost?: Maybe<GraphQlRetVal_Boolean>;
  upsertProjectMaterials?: Maybe<ProjectUpdatesMaterials>;
  upsertProjectNotes?: Maybe<ProjectUpdatesNotes>;
  upsertProjectUpdates?: Maybe<ProjectUpdates>;
  upsertQty?: Maybe<QuantityAdjustment>;
  /** Insert/Update QuantityAdjustmentType */
  upsertQuantityAdjustmentType?: Maybe<QuantityAdjustmentType>;
  upsertRTS?: Maybe<ReturnSupplier>;
  upsertRec?: Maybe<ReceivingReport>;
  upsertRecItem?: Maybe<ReceivingReportItem>;
  upsertRepairType?: Maybe<RepairType>;
  upsertRtsItem?: Maybe<ReturnSupplierItem>;
  upsertSTI?: Maybe<StockIssue>;
  upsertService?: Maybe<ServiceManagement>;
  upsertServiceCategory?: Maybe<ServiceCategory>;
  upsertServiceItem?: Maybe<ServiceItems>;
  /** Insert/Update Signature */
  upsertSignature?: Maybe<Signature>;
  upsertStiItem?: Maybe<StockIssueItems>;
  upsertSupplier?: Maybe<Supplier>;
  upsertSupplierItem?: Maybe<SupplierItem>;
  upsertSupplierType?: Maybe<SupplierType>;
  /** insert TransType */
  upsertTransType?: Maybe<TransactionType>;
  upsertUnitMeasurement?: Maybe<UnitMeasurement>;
  voidLedgerById?: Maybe<InventoryLedger>;
  voidLedgerByRef?: Maybe<InventoryLedger>;
  voidLedgerByRefExpense?: Maybe<InventoryLedger>;
  /** void Payment */
  voidOr?: Maybe<Payment>;
};


/** Mutation root */
export type MutationAddDiscountsArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationAddItemsArgs = {
  billing?: InputMaybe<Scalars['UUID']['input']>;
  items?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
  office?: InputMaybe<Scalars['UUID']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
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
export type MutationAddTerminalArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationApplyDefaultsPriceArgs = {
  office?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationBeginningBalanceInsertArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
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
export type MutationCloseBillingArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationCreateBillingProjectArgs = {
  project?: InputMaybe<ProjectsInput>;
};


/** Mutation root */
export type MutationDelPoMonitoringArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationDeleteBillingItemArgs = {
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
export type MutationLinkPoItemRecArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  rec?: InputMaybe<ReceivingReportInput>;
};


/** Mutation root */
export type MutationLockBillingArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
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
export type MutationPettyCashPostVoidArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
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
export type MutationRemovePoItemArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationRemovePrItemArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
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
export type MutationSetCounterArgs = {
  seqName?: InputMaybe<Scalars['String']['input']>;
  value?: InputMaybe<Scalars['Long']['input']>;
};


/** Mutation root */
export type MutationSetToCompletedArgs = {
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
export type MutationUpdateMpItemStatusArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
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
export type MutationUpdateStatusCostArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpdateStiItemStatusArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Mutation root */
export type MutationUpsertAddressArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};


/** Mutation root */
export type MutationUpsertAssetArgs = {
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
export type MutationUpsertCompanyArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertCustomerArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertEmployeeArgs = {
  authorities?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  officeId?: InputMaybe<Scalars['UUID']['input']>;
  permissions?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
  position?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertFiscalArgs = {
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
export type MutationUpsertInsuranceArgs = {
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
export type MutationUpsertPaymentTermsArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertPettyCashArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
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
export type MutationUpsertProjectNotesArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Mutation root */
export type MutationUpsertProjectUpdatesArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
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
export type MutationUpsertStiArgs = {
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  items?: InputMaybe<Array<InputMaybe<Scalars['Map_String_ObjectScalar']['input']>>>;
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
  officeStreet?: Maybe<Scalars['String']['output']>;
  officeType?: Maybe<Scalars['String']['output']>;
  officeZipcode?: Maybe<Scalars['String']['output']>;
  phoneNo?: Maybe<Scalars['String']['output']>;
  provinceId?: Maybe<Scalars['UUID']['output']>;
  status?: Maybe<Scalars['Boolean']['output']>;
  telNo?: Maybe<Scalars['String']['output']>;
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
  officeStreet?: InputMaybe<Scalars['String']['input']>;
  officeType?: InputMaybe<Scalars['String']['input']>;
  officeZipcode?: InputMaybe<Scalars['String']['input']>;
  phoneNo?: InputMaybe<Scalars['String']['input']>;
  provinceId?: InputMaybe<Scalars['UUID']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
  telNo?: InputMaybe<Scalars['String']['input']>;
};

export type OfficeItem = {
  __typename?: 'OfficeItem';
  actualCost?: Maybe<Scalars['BigDecimal']['output']>;
  allow_trade?: Maybe<Scalars['Boolean']['output']>;
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

export type Order = {
  __typename?: 'Order';
  direction?: Maybe<Direction>;
  ignoreCase?: Maybe<Scalars['Boolean']['output']>;
  nullHandlingHint?: Maybe<NullHandling>;
  property: Scalars['String']['output'];
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

export type Pagination = {
  __typename?: 'Pagination';
  pageNumber: Scalars['Int']['output'];
  pageSize: Scalars['Int']['output'];
  sort?: Maybe<Sort>;
};

export type Payment = {
  __typename?: 'Payment';
  billing?: Maybe<Billing>;
  billingItem?: Maybe<BillingItem>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  inWords?: Maybe<Scalars['String']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  orNumber?: Maybe<Scalars['String']['output']>;
  paymentDetails?: Maybe<Array<Maybe<PaymentDetial>>>;
  receiptType?: Maybe<Scalars['String']['output']>;
  remarks?: Maybe<Scalars['String']['output']>;
  shift?: Maybe<Shift>;
  totalCard?: Maybe<Scalars['BigDecimal']['output']>;
  totalCash?: Maybe<Scalars['BigDecimal']['output']>;
  totalCheck?: Maybe<Scalars['BigDecimal']['output']>;
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

export type PaymentTerm = {
  __typename?: 'PaymentTerm';
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
  id?: InputMaybe<Scalars['UUID']['input']>;
  isActive?: InputMaybe<Scalars['Boolean']['input']>;
  paymentCode?: InputMaybe<Scalars['String']['input']>;
  paymentDesc?: InputMaybe<Scalars['String']['input']>;
  paymentNoDays?: InputMaybe<Scalars['Int']['input']>;
};

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

export type ProjectCost = {
  __typename?: 'ProjectCost';
  category?: Maybe<Scalars['String']['output']>;
  cost?: Maybe<Scalars['BigDecimal']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  dateTransact?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  project?: Maybe<Projects>;
  qty?: Maybe<Scalars['BigDecimal']['output']>;
  refNo?: Maybe<Scalars['String']['output']>;
  status?: Maybe<Scalars['Boolean']['output']>;
  totalCost?: Maybe<Scalars['BigDecimal']['output']>;
  unit?: Maybe<Scalars['String']['output']>;
};

export type ProjectCostInput = {
  category?: InputMaybe<Scalars['String']['input']>;
  cost?: InputMaybe<Scalars['BigDecimal']['input']>;
  dateTransact?: InputMaybe<Scalars['Instant']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  project?: InputMaybe<ProjectsInput>;
  qty?: InputMaybe<Scalars['BigDecimal']['input']>;
  refNo?: InputMaybe<Scalars['String']['input']>;
  status?: InputMaybe<Scalars['Boolean']['input']>;
  unit?: InputMaybe<Scalars['String']['input']>;
};

export type ProjectUpdates = {
  __typename?: 'ProjectUpdates';
  completedDate?: Maybe<Scalars['Instant']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  dateTransact?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  estimateEndDate?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  materials?: Maybe<Array<Maybe<ProjectUpdatesMaterials>>>;
  notes?: Maybe<Array<Maybe<ProjectUpdatesNotes>>>;
  project?: Maybe<Projects>;
  startDate?: Maybe<Scalars['Instant']['output']>;
  status?: Maybe<Scalars['String']['output']>;
};

export type ProjectUpdatesMaterials = {
  __typename?: 'ProjectUpdatesMaterials';
  cost?: Maybe<Scalars['BigDecimal']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  dateTransact?: Maybe<Scalars['Instant']['output']>;
  descLong?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  item?: Maybe<Item>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  project?: Maybe<Projects>;
  projectUpdates?: Maybe<ProjectUpdates>;
  qty?: Maybe<Scalars['Int']['output']>;
  stockCardRefId?: Maybe<Scalars['UUID']['output']>;
  subTotal?: Maybe<Scalars['BigDecimal']['output']>;
  uou?: Maybe<Scalars['String']['output']>;
};

export type ProjectUpdatesNotes = {
  __typename?: 'ProjectUpdatesNotes';
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  dateTransact?: Maybe<Scalars['Instant']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  projectUpdates?: Maybe<ProjectUpdates>;
  remarks?: Maybe<Scalars['String']['output']>;
  user?: Maybe<Employee>;
};

export type Projects = {
  __typename?: 'Projects';
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  customer?: Maybe<Customer>;
  description?: Maybe<Scalars['String']['output']>;
  disabledEditing?: Maybe<Scalars['Boolean']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  image?: Maybe<Scalars['String']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
  location?: Maybe<Office>;
  projectCode?: Maybe<Scalars['String']['output']>;
  projectEnded?: Maybe<Scalars['Instant']['output']>;
  projectStarted?: Maybe<Scalars['Instant']['output']>;
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
  customer?: InputMaybe<CustomerInput>;
  description?: InputMaybe<Scalars['String']['input']>;
  disabledEditing?: InputMaybe<Scalars['Boolean']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  image?: InputMaybe<Scalars['String']['input']>;
  location?: InputMaybe<OfficeInput>;
  projectCode?: InputMaybe<Scalars['String']['input']>;
  projectEnded?: InputMaybe<Scalars['Instant']['input']>;
  projectStarted?: InputMaybe<Scalars['Instant']['input']>;
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
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
  flagValue?: Maybe<Scalars['String']['output']>;
  id?: Maybe<Scalars['UUID']['output']>;
  is_active?: Maybe<Scalars['Boolean']['output']>;
  lastModifiedBy?: Maybe<Scalars['String']['output']>;
  lastModifiedDate?: Maybe<Scalars['Instant']['output']>;
};

export type QuantityAdjustmentTypeInput = {
  code?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  flagValue?: InputMaybe<Scalars['String']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
};

/** Query root */
export type Query = {
  __typename?: 'Query';
  /** List of item expense */
  ItemExpense?: Maybe<Array<Maybe<StockIssueItems>>>;
  /** Get User by login */
  account?: Maybe<Employee>;
  /** Get All Offices Active */
  activeOffices?: Maybe<Array<Maybe<Office>>>;
  /** Search Positions Active */
  activePositions?: Maybe<Array<Maybe<Position>>>;
  /** List of Shift Per emp */
  activeShift?: Maybe<Shift>;
  allItemBySupplier?: Maybe<Array<Maybe<SupplierItem>>>;
  allSupplierByItem?: Maybe<Array<Maybe<SupplierItem>>>;
  assetById?: Maybe<Assets>;
  assetList?: Maybe<Array<Maybe<Assets>>>;
  assetListPageable?: Maybe<Page_Assets>;
  /** Get all Authorities */
  authorities?: Maybe<Array<Maybe<Authority>>>;
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
  cityByProvince?: Maybe<Array<Maybe<City>>>;
  cityFilter?: Maybe<Array<Maybe<City>>>;
  comById?: Maybe<CompanySettings>;
  companyList?: Maybe<Array<Maybe<CompanySettings>>>;
  companyListSelection?: Maybe<Array<Maybe<CompanySettings>>>;
  companyPage?: Maybe<Page_CompanySettings>;
  counters?: Maybe<Array<Maybe<Counter>>>;
  /** Search all countries */
  countries?: Maybe<Array<Maybe<Country>>>;
  /** Search all countries */
  countriesByFilter?: Maybe<Array<Maybe<Country>>>;
  customerAll?: Maybe<Array<Maybe<Customer>>>;
  customerAssets?: Maybe<Array<Maybe<Customer>>>;
  customerList?: Maybe<Array<Maybe<Customer>>>;
  customerListAssets?: Maybe<Array<Maybe<Customer>>>;
  /** List of Document Type */
  documentTypeList?: Maybe<Array<Maybe<DocumentTypes>>>;
  /** Get Employee By Id */
  employee?: Maybe<Employee>;
  employeeByFilter?: Maybe<Array<Maybe<Employee>>>;
  /** get employee by id */
  employeeById?: Maybe<Employee>;
  /** Get All Employees */
  employees?: Maybe<Array<Maybe<Employee>>>;
  /** List of filtered quantity adjustment type */
  filterAdjustmentType?: Maybe<Array<Maybe<QuantityAdjustmentType>>>;
  findAllAssets?: Maybe<Array<Maybe<Assets>>>;
  findByItemOffice?: Maybe<OfficeItem>;
  findDuplicate?: Maybe<SupplierItem>;
  /** Find Fiscal By id */
  findFiscalActive?: Maybe<Fiscal>;
  /** find Adjustment Type */
  findOneAdjustmentType?: Maybe<QuantityAdjustmentType>;
  /** find signature by id */
  findOneSignature?: Maybe<Signature>;
  fiscalById?: Maybe<Fiscal>;
  fiscals?: Maybe<Page_Fiscal>;
  genericActive?: Maybe<Array<Maybe<Generic>>>;
  genericList?: Maybe<Array<Maybe<Generic>>>;
  getAllAmounts?: Maybe<Scalars['BigDecimal']['output']>;
  getAmounts?: Maybe<Scalars['BigDecimal']['output']>;
  getAmountsDeduct?: Maybe<Scalars['BigDecimal']['output']>;
  getBalance?: Maybe<Scalars['BigDecimal']['output']>;
  getBillingItemFilterActive?: Maybe<Array<Maybe<BillingItem>>>;
  getBrands?: Maybe<Array<Maybe<BrandDto>>>;
  getCategoryProjects?: Maybe<Array<Maybe<CategoryDto>>>;
  getDocTypeById?: Maybe<DocumentTypes>;
  /** Get Group Policy by name */
  getGroupPolicyById?: Maybe<GroupPolicy>;
  getItemByName?: Maybe<Array<Maybe<Item>>>;
  getItemDiscountable?: Maybe<Array<Maybe<BillingItem>>>;
  getJobByPlateNo?: Maybe<Job>;
  getLedgerByRef?: Maybe<Array<Maybe<InventoryLedger>>>;
  getLegerByDoc?: Maybe<Array<Maybe<InventoryLedger>>>;
  getMaterialByRefStockCard?: Maybe<ProjectUpdatesMaterials>;
  getOnHandByItem?: Maybe<Inventory>;
  getPOMonitoringByPoItemFilter?: Maybe<Array<Maybe<PoDeliveryMonitoring>>>;
  getPOMonitoringByRec?: Maybe<Array<Maybe<PoDeliveryMonitoring>>>;
  getPlateNo?: Maybe<Array<Maybe<PlateNumberDto>>>;
  getPrItemByPoId?: Maybe<Array<Maybe<PurchaseRequestItem>>>;
  getPrItemInPO?: Maybe<Array<Maybe<PurchaseRequestItem>>>;
  getProjectMaterialsByMilestone?: Maybe<Array<Maybe<ProjectUpdatesMaterials>>>;
  getSrrByDateRange?: Maybe<Array<Maybe<ReceivingReport>>>;
  /** List of receiving report list per date range */
  getSrrItemByDateRange?: Maybe<Array<Maybe<ReceivingReportItem>>>;
  getTotalMaterials?: Maybe<Scalars['BigDecimal']['output']>;
  getTotals?: Maybe<Scalars['BigDecimal']['output']>;
  getUnitProjects?: Maybe<Array<Maybe<UnitDto>>>;
  /** Get all Group Policies */
  groupPolicies?: Maybe<Array<Maybe<GroupPolicy>>>;
  insuranceActive?: Maybe<Array<Maybe<Insurances>>>;
  insuranceAll?: Maybe<Array<Maybe<Insurances>>>;
  insuranceList?: Maybe<Array<Maybe<Insurances>>>;
  inventoryListPageable?: Maybe<Page_Inventory>;
  inventoryListPageableByDep?: Maybe<Page_Inventory>;
  inventoryOutputPageable?: Maybe<Page_Inventory>;
  inventorySourcePageable?: Maybe<Page_Inventory>;
  inventorySupplierListPageable?: Maybe<Page_SupplierInventory>;
  /** Check if username exists */
  isLoginUnique?: Maybe<Scalars['Boolean']['output']>;
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
  /** Get All Offices */
  officesList?: Maybe<Array<Maybe<Office>>>;
  onHandReport?: Maybe<Array<Maybe<OnHandReport>>>;
  /** List of Payments By shift ID */
  outputTax?: Maybe<Scalars['BigDecimal']['output']>;
  pCostById?: Maybe<ProjectCost>;
  pCostByList?: Maybe<Array<Maybe<ProjectCost>>>;
  pMaterialById?: Maybe<ProjectUpdatesMaterials>;
  pMaterialByList?: Maybe<Array<Maybe<ProjectUpdatesMaterials>>>;
  pUpdatesById?: Maybe<ProjectUpdates>;
  pUpdatesByList?: Maybe<Array<Maybe<ProjectUpdates>>>;
  pUpdatesNotesById?: Maybe<ProjectUpdatesNotes>;
  pUpdatesNotesList?: Maybe<Array<Maybe<ProjectUpdatesNotes>>>;
  /** List of Payments By Billing ID */
  paymentByBillingId?: Maybe<Array<Maybe<Payment>>>;
  /** List of Payments By shift ID */
  paymentItems?: Maybe<Array<Maybe<PaymentItems>>>;
  paymentTermActive?: Maybe<Array<Maybe<PaymentTerm>>>;
  paymentTermList?: Maybe<Array<Maybe<PaymentTerm>>>;
  /** List of Payments By shift ID */
  paymentsByShift?: Maybe<Array<Maybe<Payment>>>;
  /** Get all Permissions */
  permissions?: Maybe<Array<Maybe<Permission>>>;
  pettyCashAll?: Maybe<Array<Maybe<PettyCash>>>;
  pettyCashById?: Maybe<PettyCash>;
  pettyCashList?: Maybe<Array<Maybe<PettyCash>>>;
  pettyCashListByDate?: Maybe<Array<Maybe<PettyCash>>>;
  pettyCashListByProject?: Maybe<Array<Maybe<PettyCash>>>;
  pettyCashListPosted?: Maybe<Array<Maybe<PettyCash>>>;
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
  projectById?: Maybe<Projects>;
  projectByOffice?: Maybe<Array<Maybe<Projects>>>;
  projectByStatusCount?: Maybe<Array<Maybe<DashboardDto>>>;
  projectList?: Maybe<Array<Maybe<Projects>>>;
  projectListPageable?: Maybe<Page_Projects>;
  provinceByRegion?: Maybe<Array<Maybe<Province>>>;
  provinceFilter?: Maybe<Array<Maybe<Province>>>;
  provinces?: Maybe<Array<Maybe<Province>>>;
  /** List of quantity adjustment type */
  quantityAdjustmentTypeFilter?: Maybe<Array<Maybe<QuantityAdjustmentType>>>;
  /** List of quantity adjustment type */
  quantityAdjustmentTypeList?: Maybe<Array<Maybe<QuantityAdjustmentType>>>;
  /** List of Quantity Adjustment by Item */
  quantityListByItem?: Maybe<Array<Maybe<QuantityAdjustment>>>;
  recByFiltersPage?: Maybe<Page_ReceivingReport>;
  recById?: Maybe<ReceivingReport>;
  recItemById?: Maybe<ReceivingReportItem>;
  recItemByParent?: Maybe<Array<Maybe<ReceivingReportItem>>>;
  regionFilter?: Maybe<Array<Maybe<Region>>>;
  /** Search all countries */
  regions?: Maybe<Array<Maybe<Region>>>;
  repairTypeActive?: Maybe<Array<Maybe<RepairType>>>;
  repairTypeAll?: Maybe<Array<Maybe<RepairType>>>;
  repairTypeList?: Maybe<Array<Maybe<RepairType>>>;
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
  srrList?: Maybe<Array<Maybe<ReceivingReport>>>;
  stiByFiltersPage?: Maybe<Page_StockIssue>;
  stiById?: Maybe<StockIssue>;
  stiItemById?: Maybe<StockIssueItems>;
  stiItemByParent?: Maybe<Array<Maybe<StockIssueItems>>>;
  /** List of Stock Card */
  stockCard?: Maybe<Array<Maybe<StockCard>>>;
  supById?: Maybe<Supplier>;
  supItemById?: Maybe<SupplierItem>;
  supplierActive?: Maybe<Array<Maybe<Supplier>>>;
  supplierList?: Maybe<Array<Maybe<Supplier>>>;
  supplierTypeActive?: Maybe<Array<Maybe<SupplierType>>>;
  supplierTypeList?: Maybe<Array<Maybe<SupplierType>>>;
  terminalFilter?: Maybe<Array<Maybe<Terminal>>>;
  /** List of Terminal */
  terminals?: Maybe<Array<Maybe<Terminal>>>;
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
  /** transaction type by tag */
  transTypeByTag?: Maybe<Array<Maybe<TransactionType>>>;
  /** transaction type by tag */
  transTypeByTagFilter?: Maybe<Array<Maybe<TransactionType>>>;
  /** Transaction List */
  transactionList?: Maybe<Array<Maybe<TransactionType>>>;
  unitMeasurementActive?: Maybe<Array<Maybe<UnitMeasurement>>>;
  unitMeasurementList?: Maybe<Array<Maybe<UnitMeasurement>>>;
  uopList?: Maybe<Array<Maybe<UnitMeasurement>>>;
  uouList?: Maybe<Array<Maybe<UnitMeasurement>>>;
  /** List of Payments By shift ID */
  vatable_non?: Maybe<Scalars['BigDecimal']['output']>;
  version?: Maybe<Scalars['String']['output']>;
};


/** Query root */
export type QueryItemExpenseArgs = {
  end?: InputMaybe<Scalars['Instant']['input']>;
  expenseFrom?: InputMaybe<Scalars['UUID']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  start?: InputMaybe<Scalars['Instant']['input']>;
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
  status?: InputMaybe<Scalars['String']['input']>;
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
export type QueryCustomerListArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryCustomerListAssetsArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
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
export type QueryFilterAdjustmentTypeArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  is_active?: InputMaybe<Scalars['Boolean']['input']>;
};


/** Query root */
export type QueryFindByItemOfficeArgs = {
  depId?: InputMaybe<Scalars['UUID']['input']>;
  itemId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryFindDuplicateArgs = {
  itemId?: InputMaybe<Scalars['UUID']['input']>;
  supId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryFindOneAdjustmentTypeArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryFindOneSignatureArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
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
export type QueryGenericListArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryGetAllAmountsArgs = {
  type?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
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
export type QueryGetBalanceArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetBillingItemFilterActiveArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  type?: InputMaybe<Array<InputMaybe<Scalars['String']['input']>>>;
};


/** Query root */
export type QueryGetDocTypeByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetGroupPolicyByIdArgs = {
  groupPolicyId?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetItemByNameArgs = {
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
export type QueryGetMaterialByRefStockCardArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetOnHandByItemArgs = {
  itemId?: InputMaybe<Scalars['UUID']['input']>;
  office?: InputMaybe<Scalars['UUID']['input']>;
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
export type QueryGetTotalMaterialsArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryGetTotalsArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryInsuranceListArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryInventoryListPageableArgs = {
  category?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>;
  filter?: InputMaybe<Scalars['String']['input']>;
  group?: InputMaybe<Scalars['UUID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
};


/** Query root */
export type QueryInventoryListPageableByDepArgs = {
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
export type QueryIsLoginUniqueArgs = {
  login?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryItemByFiltersPageArgs = {
  category?: InputMaybe<Array<InputMaybe<Scalars['UUID']['input']>>>;
  filter?: InputMaybe<Scalars['String']['input']>;
  group?: InputMaybe<Scalars['UUID']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  size?: InputMaybe<Scalars['Int']['input']>;
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
export type QueryOnHandReportArgs = {
  date?: InputMaybe<Scalars['String']['input']>;
  filter?: InputMaybe<Scalars['String']['input']>;
  office?: InputMaybe<Scalars['UUID']['input']>;
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
export type QueryPMaterialByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryPMaterialByListArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
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
export type QueryPUpdatesNotesByIdArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
};


/** Query root */
export type QueryPUpdatesNotesListArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
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
export type QueryPettyCashByIdArgs = {
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
export type QueryQuantityAdjustmentTypeFilterArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryQuantityListByItemArgs = {
  item?: InputMaybe<Scalars['UUID']['input']>;
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
export type QueryTerminalFilterArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
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
export type QueryTransTypeByTagArgs = {
  tag?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryTransTypeByTagFilterArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
  tag?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryUnitMeasurementListArgs = {
  filter?: InputMaybe<Scalars['String']['input']>;
};


/** Query root */
export type QueryVatable_NonArgs = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  type?: InputMaybe<Scalars['String']['input']>;
};

export type ReceivingReport = {
  __typename?: 'ReceivingReport';
  account?: Maybe<Scalars['UUID']['output']>;
  amount?: Maybe<Scalars['BigDecimal']['output']>;
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  dateCreated?: Maybe<Scalars['Instant']['output']>;
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
  project?: Maybe<Projects>;
  purchaseOrder?: Maybe<PurchaseOrder>;
  receiveDate?: Maybe<Scalars['Instant']['output']>;
  receivedOffice?: Maybe<Office>;
  receivedRefDate?: Maybe<Scalars['Instant']['output']>;
  receivedRefNo?: Maybe<Scalars['String']['output']>;
  receivedRemarks?: Maybe<Scalars['String']['output']>;
  receivedType?: Maybe<Scalars['String']['output']>;
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
  fixDiscount?: InputMaybe<Scalars['BigDecimal']['input']>;
  grossAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  id?: InputMaybe<Scalars['UUID']['input']>;
  inputTax?: InputMaybe<Scalars['BigDecimal']['input']>;
  isPosted?: InputMaybe<Scalars['Boolean']['input']>;
  isVoid?: InputMaybe<Scalars['Boolean']['input']>;
  netAmount?: InputMaybe<Scalars['BigDecimal']['input']>;
  netDiscount?: InputMaybe<Scalars['BigDecimal']['input']>;
  paymentTerms?: InputMaybe<PaymentTermInput>;
  project?: InputMaybe<ProjectsInput>;
  purchaseOrder?: InputMaybe<PurchaseOrderInput>;
  receiveDate?: InputMaybe<Scalars['Instant']['input']>;
  receivedOffice?: InputMaybe<OfficeInput>;
  receivedRefDate?: InputMaybe<Scalars['Instant']['input']>;
  receivedRefNo?: InputMaybe<Scalars['String']['input']>;
  receivedRemarks?: InputMaybe<Scalars['String']['input']>;
  receivedType?: InputMaybe<Scalars['String']['input']>;
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
  returnBy?: Maybe<Scalars['String']['output']>;
  returnDate?: Maybe<Scalars['Instant']['output']>;
  returnUser?: Maybe<Scalars['UUID']['output']>;
  rtsNo?: Maybe<Scalars['String']['output']>;
  supplier?: Maybe<Supplier>;
};

export type ReturnSupplierInput = {
  id?: InputMaybe<Scalars['UUID']['input']>;
  isPosted?: InputMaybe<Scalars['Boolean']['input']>;
  isVoid?: InputMaybe<Scalars['Boolean']['input']>;
  office?: InputMaybe<OfficeInput>;
  receivedRefDate?: InputMaybe<Scalars['Instant']['input']>;
  receivedRefNo?: InputMaybe<Scalars['String']['input']>;
  received_by?: InputMaybe<Scalars['String']['input']>;
  refSrr?: InputMaybe<Scalars['String']['input']>;
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

export type Supplier = {
  __typename?: 'Supplier';
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  creditLimit?: Maybe<Scalars['BigDecimal']['output']>;
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
  cost?: Maybe<Scalars['BigDecimal']['output']>;
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

export type TransactionType = {
  __typename?: 'TransactionType';
  createdBy?: Maybe<Scalars['String']['output']>;
  createdDate?: Maybe<Scalars['Instant']['output']>;
  description?: Maybe<Scalars['String']['output']>;
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

export type UpdateItemMutationVariables = Exact<{
  id?: InputMaybe<Scalars['UUID']['input']>;
  fields?: InputMaybe<Scalars['Map_String_ObjectScalar']['input']>;
}>;


export type UpdateItemMutation = { __typename?: 'Mutation', upsertFiscal?: { __typename?: 'Fiscal', id?: any | null } | null };

export type ChangePasswordMutationVariables = Exact<{
  username?: InputMaybe<Scalars['String']['input']>;
}>;


export type ChangePasswordMutation = { __typename?: 'Mutation', newPassword?: string | null };


export const UpdateItemDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"UpdateItem"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"id"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"UUID"}}},{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"fields"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"Map_String_ObjectScalar"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"upsertFiscal"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"id"},"value":{"kind":"Variable","name":{"kind":"Name","value":"id"}}},{"kind":"Argument","name":{"kind":"Name","value":"fields"},"value":{"kind":"Variable","name":{"kind":"Name","value":"fields"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","name":{"kind":"Name","value":"id"}}]}}]}}]} as unknown as DocumentNode<UpdateItemMutation, UpdateItemMutationVariables>;
export const ChangePasswordDocument = {"kind":"Document","definitions":[{"kind":"OperationDefinition","operation":"mutation","name":{"kind":"Name","value":"ChangePassword"},"variableDefinitions":[{"kind":"VariableDefinition","variable":{"kind":"Variable","name":{"kind":"Name","value":"username"}},"type":{"kind":"NamedType","name":{"kind":"Name","value":"String"}}}],"selectionSet":{"kind":"SelectionSet","selections":[{"kind":"Field","alias":{"kind":"Name","value":"newPassword"},"name":{"kind":"Name","value":"changePassword"},"arguments":[{"kind":"Argument","name":{"kind":"Name","value":"username"},"value":{"kind":"Variable","name":{"kind":"Name","value":"username"}}}]}]}}]} as unknown as DocumentNode<ChangePasswordMutation, ChangePasswordMutationVariables>;