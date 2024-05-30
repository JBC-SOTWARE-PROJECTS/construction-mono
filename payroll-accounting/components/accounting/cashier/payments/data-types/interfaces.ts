import { Billing, BillingItem, PaymentItem } from "@/graphql/gql/graphql"
import { FormInstance } from "antd"
import { MessageInstance } from "antd/lib/message/interface"
import { Dispatch, ReactNode } from "react"
import { GenderType, PaymentType, Payor, PayorType } from "./types"

export interface MiscPaymentItemI {}
export interface TerminalWindowsState {
  paymentType: PaymentType
  paymentItems: PaymentItem[]
  folioItems: FolioItemsI
  payor?: Payor | null
  billing?: Billing | null
  randomGender: GenderType
  paymentMethods: PaymentMethod[]
}

export interface FolioItemsI {
  ROOMBOARD: BillingItem[]
  MEDICINES: BillingItem[]
  SUPPLIES: BillingItem[]
  DIAGNOSTICS: BillingItem[]
  CATHLAB: BillingItem[]
  ORFEE: BillingItem[]
  PF: BillingItem[]
  OTHERS: BillingItem[]
}

export interface AmountSummaryI {
  ROOMBOARD: number
  MEDICINES: number
  SUPPLIES: number
  DIAGNOSTICS: number
  CATHLAB: number
  ORFEE: number
  PF: number
  OTHERS: number
  HOSPITAL: number
  TOTAL_SALES: number
  LESS_VAT: number
  AMOUNT_NET_VAT: number
  LESS_DISC: number
  LESS_WITHOLDING_TAX: number
  AMOUNT_DUE: number
}

export type TerminalWindowsAction =
  | { type: "set-payor"; payload: Payor }
  | { type: "set-billing"; payload: Billing }
  | { type: "set-payment-methods"; payload: PaymentMethod[] }
  | { type: "add-payment-items"; payload: PaymentItem }
  | { type: "set-payment-items"; payload: PaymentItem[] }
  | { type: "set-random-gender"; payload: GenderType }
  | { type: "set-folio-items"; payload: FolioItemsI }
  | { type: "set-folio-items-by-type"; payload: { [x: string]: BillingItem[] } }
export interface TerminalDetails {
  macAddress?: string | null
  shift?: string | null
  shiftId?: string | null
  batchReceiptId?: string | null
  nextAR?: string | null
  nextOR?: string | null
  terminalCode?: string | null
  terminalId?: string | null
  terminalName?: string | null
  type?: string | null
}
export interface PaymentMethod {
  id: string
  type: string
  amount: number
}

export interface PaymentQuickOptions {
  login: string
  billing: Billing | undefined | null
  paymentType: PaymentType
  state: TerminalWindowsState
  dispatch: Dispatch<TerminalWindowsAction>
  onAddItems: (paymentType: PaymentType) => void
  payorType: PayorType
}
export interface TerminalWindowsHeaderProps {
  nextOR: string
  type: string
  userName: string
  paymentType: PaymentType
  randomGender: GenderType
}

export interface TerminalWindowsContentProps {
  folioItems: FolioItemsI
}

export interface TerminalWindowsPayor {
  billing?: Billing | null
  payorType: PayorType
  paymentType: PaymentType
  payor?: Payor | null
  randomGender: GenderType
  dispatch: Dispatch<TerminalWindowsAction>
}
export interface TerminalWindowsPaymentMethod
  extends Pick<
    TerminalWindowProps,
    "dispatch" | "totalAmountTendered" | "form"
  > {
  paymentMethods?: PaymentMethod[]
}
export interface TerminalWindowsFooterProps extends TerminalDetails {}

export interface TerminalWindowProps {
  id: string
  onAddItems: (paymentType: PaymentType) => void
  cashierRefetch: () => Promise<void>
  paymentType: PaymentType
  payorType: PayorType
  login: string
  form: FormInstance<{ amountTendered: number }>

  state: TerminalWindowsState
  dispatch: Dispatch<TerminalWindowsAction>

  terminalDetails: TerminalDetails
  messageApi: MessageInstance
  totalAmountTendered: number
  amountSummary: AmountSummaryI
}
export interface TerminalWindowPageProps
  extends Omit<TerminalWindowProps, "messageApi"> {
  children: ReactNode
}
