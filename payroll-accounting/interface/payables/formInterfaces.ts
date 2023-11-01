import {
  AccountsPayable,
  AccountsPayableDetails,
  ApAccountsTemplateItems,
  DebitMemoDetails,
  DisbursementAp,
  DisbursementCheck,
  DisbursementExpense,
  DisbursementWtx,
  PettyCashItem,
  PettyCashOther,
} from "@/graphql/gql/graphql";
import { Dayjs } from "dayjs";
import { OptionsValue } from "@/utility/interfaces";

export interface IFormAPTransactionDetails {
  transType?: any;
  office?: any;
  project?: any;
  amount: number;
  discRate: number;
  discAmount: number;
  vatAmount: number;
  vatInclusive: boolean;
  taxDesc?: any;
  ewtRate: number;
  ewtAmount: number;
  netAmount: number;
  refNo: string | null | undefined;
  remarksNotes: string | null | undefined;
}

export interface IFormAccountsPayableApplication {
  appliedAmount: number;
  vatRate: number;
  vatInclusive: boolean;
  vatAmount: number;
  ewtDesc: string;
  ewtRate: number;
  ewtAmount: number;
  grossAmount: number;
  discount: number;
  netAmount: number;
}

export interface IFormAPTransactionDetailsBulk {
  transType?: any;
  office?: any;
  project?: any;
  discAmount: number;
  vatInclusive: boolean;
  taxDesc?: any;
  ewtRate?: number;
  vatRate?: number;
}

export interface IFormDataCheckDetails {
  bank?: OptionsValue;
  bankBranch?: string;
  checkNo?: string;
  checkDate?: Dayjs;
  amount?: number;
}

export interface IFormDisbursementExpense {
  transType: OptionsValue;
  office: OptionsValue;
  project: OptionsValue;
  amount: number;
  remarks: string;
}

export interface IFormDisbursementWTX {
  appliedAmount: number;
  vatRate: number;
  vatInclusive: boolean;
  vatAmount: number;
  ewtDesc: OptionsValue;
  ewtRate: number;
  ewtAmount: number;
  grossAmount: number;
  netAmount: number;
}

export interface IFormDebitMemoDetails {
  transType: OptionsValue;
  office: OptionsValue;
  project: OptionsValue;
  type: string;
  percent: number;
  amount: number;
  remarks: string;
}

export interface IPayloadValues {
  discount: number;
  ewtAmount: number;
  appliedAmount: number;
}

export interface IDisbursementApplication {
  payable?: AccountsPayable;
  isNew?: boolean;
}

export interface ConfigVat {
  vatRate: number;
  vatInclusive: boolean;
}

export interface IFormPettyCashOthers {
  transType: OptionsValue;
  office: OptionsValue;
  project: OptionsValue;
  amount: number;
  remarks: string;
}

export interface ExtendedAPTransactionDto extends AccountsPayableDetails {
  vatRate?: number | undefined | null;
  isNew?: boolean;
}
export interface ICheckDetails extends DisbursementCheck {
  isNew?: boolean;
}

export interface IDisbursementApplication extends DisbursementAp {
  isNew?: boolean;
}
export interface IDisbursementExpense extends DisbursementExpense {
  isNew?: boolean;
}
export interface IDisbursementWTX extends DisbursementWtx {
  isNew?: boolean;
}

export interface IDebitMemoDetails extends DebitMemoDetails {
  isNew?: boolean;
}
export interface AccountsTemplateItemDto extends ApAccountsTemplateItems {
  isNew?: boolean;
}

export interface PettyCashItemDto extends PettyCashItem {
  isNew?: boolean;
}

export interface PettyCashOthersDto extends PettyCashOther {
  isNew?: boolean;
}