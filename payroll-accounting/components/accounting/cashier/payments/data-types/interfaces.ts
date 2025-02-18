import {
  Billing,
  BillingItem,
  PaymentItem,
  ReceiptType,
} from "@/graphql/gql/graphql";
import { FormInstance } from "antd";
import { MessageInstance } from "antd/lib/message/interface";
import { Dispatch, ReactNode } from "react";
import { GenderType, PaymentType, Payor, PayorType } from "./types";

export interface MiscPaymentItemI {}
export interface TerminalWindowsState {
  receiptType: "OR" | "AR";
  paymentType: PaymentType;
  paymentItems: PaymentItem[];
  payor?: Payor | null;
  billing?: Billing | null;
  randomGender: GenderType;
  paymentMethods: PaymentMethod[];
}

export interface FolioItemsI {
  ROOMBOARD: BillingItem[];
  MEDICINES: BillingItem[];
  SUPPLIES: BillingItem[];
  DIAGNOSTICS: BillingItem[];
  CATHLAB: BillingItem[];
  ORFEE: BillingItem[];
  PF: BillingItem[];
  OTHERS: BillingItem[];
}

export interface AmountSummaryI {
  RECOUPMENT: number;
  RETENTION: number;
  TOTAL_SALES: number;
  LESS_VAT: number;
  AMOUNT_NET_VAT: number;
  LESS_DISC: number;
  LESS_WITHOLDING_TAX: number;
  AMOUNT_DUE: number;
}

export type TerminalWindowsAction =
  | { type: "set-receipt-type"; payload: "OR" | "AR" }
  | { type: "set-payor"; payload: Payor }
  | { type: "set-billing"; payload: Billing }
  | { type: "set-payment-methods"; payload: PaymentMethod[] }
  | { type: "add-payment-items"; payload: PaymentItem }
  | { type: "set-payment-items"; payload: PaymentItem[] }
  | { type: "set-random-gender"; payload: GenderType };
export interface TerminalDetails {
  macAddress?: string | null;
  shift?: string | null;
  shiftId?: string | null;
  batchReceiptId?: string | null;
  nextReceiptNo?: string | null;
  terminalCode?: string | null;
  terminalId?: string | null;
  terminalName?: string | null;
  receiptType?: ReceiptType | null;
}
export interface PaymentMethod {
  id: string;
  type: string;
  tenderedType: string;
  amount: number;
}

export interface PaymentQuickOptions {
  login: string;
  billing: Billing | undefined | null;
  paymentType?: PaymentType;
  state: TerminalWindowsState;
  dispatch: Dispatch<TerminalWindowsAction>;
  onAddItems: (paymentType: PaymentType) => void;
  payorType: PayorType | null;
}
export interface TerminalWindowsHeaderProps {
  type?: string;
  nextReceiptNo: string;
  receiptType: ReceiptType | null;
  userName: string;
  paymentType: PaymentType;
  randomGender: GenderType;
}

export interface TerminalWindowsContentProps {
  folioItems: FolioItemsI;
}

export interface TerminalWindowsPayor {
  id: string;
  billing?: Billing | null;
  payorType: PayorType | null;
  paymentType: PaymentType;
  payor?: Payor | null;
  randomGender: GenderType;
  dispatch: Dispatch<TerminalWindowsAction>;
}
export interface TerminalWindowsPaymentMethod
  extends Pick<
    TerminalWindowProps,
    "dispatch" | "totalAmountTendered" | "form"
  > {
  paymentMethods?: PaymentMethod[];
}
export interface TerminalWindowsFooterProps extends TerminalDetails {}

export interface TerminalWindowProps {
  id: string;
  onAddItems: (paymentType: PaymentType) => void;
  cashierRefetch: () => Promise<void>;
  paymentType: PaymentType;
  payorType: PayorType | null;
  login: string;
  form: FormInstance<{ amountTendered: number }>;

  state: TerminalWindowsState;
  dispatch: Dispatch<TerminalWindowsAction>;

  terminalDetails: TerminalDetails;
  messageApi: MessageInstance;
  totalAmountTendered: number;
  amountSummary: AmountSummaryI;
}
export interface TerminalWindowPageProps
  extends Omit<TerminalWindowProps, "messageApi"> {
  children: ReactNode;
}
