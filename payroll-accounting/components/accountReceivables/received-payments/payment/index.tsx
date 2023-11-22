import { ReactNode, createContext, useContext, useMemo } from 'react'
import {
  ActionI,
  DispatchI,
  LazyQueryI,
  LoadingI,
  MutationI,
  PaymentTransactionType,
  ReceiptType,
  RefetchI,
  StateI,
} from './types'
import { FormInstance, message } from 'antd'
import { MessageInstance } from 'antd/lib/message/interface'
import ReceivePayHeader from './Header'
import ReceivePayBody from './Body'
import ReceivePayFooter from './Footer'
import Decimal from 'decimal.js'
import ReceivePaySummary from './Summary'
import { CashierDataPropsI } from '@/components/accounting/cashier/terminal'

export interface ReceivePayCreateContextProps {
  type: ReceiptType
  transactionType: PaymentTransactionType
  cashierData?: CashierDataPropsI
  state: StateI
  dispatch: DispatchI
  hide: (values: any) => void
  form?: FormInstance<any>
  messageApi?: MessageInstance
  contextHolder?: any
  lazyQuery?: LazyQueryI
  mutation?: MutationI
  refetch?: RefetchI
  loading?: LoadingI
  totalTransactions?: number
  totalPayment?: number
}

const initialProps: ReceivePayCreateContextProps | undefined = {
  type: 'OR',
  cashierData: {
    batchReceiptId: '',
    shiftId: '',
    nextAR: '',
    nextOR: '',
    notFound: true,
    shiftPk: '',
    terminalCode: '',
    terminalId: '',
    terminalName: '',
  },
  state: {
    customerId: null,
    paymentMethod: [],
    transactions: [],
    selectedRowKeys: [],
    invoiceType: 'REGULAR',
    amountToApply: 0,
  },
  transactionType: 'INVOICE',
  totalTransactions: 0,
  totalPayment: 0,
  dispatch: (value: ActionI) => null,
  hide: (values: any) => null,
}

export const ReceivePayCreateContext =
  createContext<ReceivePayCreateContextProps>(initialProps)

interface PaymentI extends ReceivePayCreateContextProps {
  children: ReactNode
}

function Payment(props: PaymentI) {
  console.log(props, 'props')
  const { children, state, form, dispatch, ...restProps } = props
  const [messageApi, contextHolder] = message.useMessage()

  const totalTransactions = useMemo(
    () =>
      (state.transactions ?? []).reduce((summary, { amountToApply }) => {
        const paymentApplied = new Decimal(amountToApply ?? 0)
        summary = parseFloat(
          new Decimal(summary).plus(paymentApplied).toString()
        )
        return summary
      }, 0),
    [state.transactions]
  )

  const totalPayment = useMemo(
    () =>
      (state.paymentMethod ?? []).reduce((summary, { amount }) => {
        const paid = new Decimal(amount ?? 0)
        summary = parseFloat(new Decimal(summary).plus(paid).toString())
        return summary
      }, 0),
    [state.paymentMethod]
  )

  return (
    <ReceivePayCreateContext.Provider
      value={{
        ...restProps,
        state,
        form,
        dispatch,
        totalTransactions,
        totalPayment,
        messageApi,
        contextHolder,
      }}
    >
      {children}
      {contextHolder}
    </ReceivePayCreateContext.Provider>
  )
}

const Header = () => {
  const context = useContext(ReceivePayCreateContext)

  return <ReceivePayHeader {...context} />
}

const Body = () => {
  const context = useContext(ReceivePayCreateContext)

  return <ReceivePayBody {...context} />
}

const Summary = () => {
  const context = useContext(ReceivePayCreateContext)

  return <ReceivePaySummary {...context} />
}

const Footer = () => {
  const context = useContext(ReceivePayCreateContext)

  return <ReceivePayFooter {...context} />
}

Payment.Header = Header
Payment.Body = Body
Payment.Footer = Footer
Payment.Summary = Summary

export default Payment
