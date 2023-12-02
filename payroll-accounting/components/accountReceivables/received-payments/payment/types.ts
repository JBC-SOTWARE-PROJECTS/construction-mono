import { ArInvoiceItems, Bank } from '@/graphql/gql/graphql'
import { Table } from 'antd'

export type EditableTableProps = Parameters<typeof Table>[0]

export interface EditableRowProps {
  index: number
}

export interface EditableCellProps {
  title: React.ReactNode
  editable: boolean
  children: React.ReactNode
  dataIndex: keyof ClientTransactionI
  record: ClientTransactionI
  handleSave: (record: ClientTransactionI) => void
}

export type ReceiptType = 'OR' | 'AR'

export type ColumnTypes = Exclude<EditableTableProps['columns'], undefined>

export interface ClientTransactionI {
  id: string
  invoiceId: string
  customerId: string
  invoiceNo: string
  docNo: string
  particular: string
  reference: string
  itemType: string
  arInvoiceItem?: ArInvoiceItems
  dueDate: string
  amount: number
  balance: number
  amountToApply: number
  quantity?: number
  totalAmountDue?: number
  unitPrice?: number
}

export type PaymentMethodType =
  | 'CARD'
  | 'CHECK'
  | 'BANKDEPOSIT'
  | 'CASH'
  | 'EWALLET'

export type PaymentMethodCard = {
  id?: string
  type: 'CARD'
  reference: string
  nameOfCard: string
  bank: string
  checkdate: string
  approvalCode: string
  posTerminalId: string
  acquiringBank: Bank
  cardType: string
  otherType: string
  amount: number
}

export type PaymentMethodCheck = {
  id?: string
  type: 'CHECK'
  reference: string
  checkdate: string
  bank: string
  amount: number
}

export type PaymentMethodBankDeposit = {
  id?: string
  type: 'BANKDEPOSIT'
  bankEntity: Bank
  reference: string
  checkdate: string
  amount: number
}

export type PaymentMethodEWallet = {
  id?: string
  type: 'EWALLET'
  terminalId: string
  invoiceNo: string
  traceNo: string
  reference: string
  acquiringBank: Bank
  approvalCode: string
  eWalletType: string
  otherType: string
  amount: number
}

export type PaymentMethodCash = {
  id?: string
  type: 'CASH'
  amount: number
}

export type PaymentMethodFields =
  | PaymentMethodCard
  | PaymentMethodCheck
  | PaymentMethodBankDeposit
  | PaymentMethodCash
  | PaymentMethodEWallet

export type PaymentTransactionType = 'INVOICE' | 'PROMISSORY_NOTE'
export interface StateI {
  customerId: string | null
  paymentMethod: PaymentMethodFields[]
  amountToApply: number
  invoiceType: string
  transactions: ClientTransactionI[]
  selectedRowKeys: React.Key[]
}
export type ActionI =
  | { type: 'set-invoiceType'; payload: string }
  | { type: 'set-customerId'; payload: string }
  | { type: 'set-amountToApply'; payload: number }
  | { type: 'set-paymentMethod'; payload: PaymentMethodFields[] }
  | { type: 'set-transactions'; payload: ClientTransactionI[] }
  | { type: 'set-selectedRowKeys'; payload: React.Key[] }
export type Reducer = (state: StateI, action: ActionI) => StateI

export type DispatchI = (value: ActionI) => void

export interface LazyQueryI {}
export interface MutationI {}
export interface RefetchI {}
export interface LoadingI {}
