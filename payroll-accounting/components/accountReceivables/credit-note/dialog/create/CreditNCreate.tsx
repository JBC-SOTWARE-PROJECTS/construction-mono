import { FormInstance } from 'antd'
import { MessageInstance } from 'antd/lib/message/interface'
import { ReactNode, createContext, useContext } from 'react'
import {
  CnAction,
  CreditNoteTypeT,
  InvoiceTypeT,
  StateI,
  TotalSummaryI,
} from '.'
import CNBodyContainer from './Body'
import CNHeader from './Header'
import CNSummary from './Summary'
import CNFooter from './Footer'
import {
  LazyQueryType,
  MutationType,
  RefetchType,
} from '@/components/accountReceivables/common/types'

export interface CnLazyQuery {
  lazyQueryItemParticular: LazyQueryType
}
export interface CnMutation {
  createCreditNote: MutationType
  postingCreditNote: MutationType
  generateTax: MutationType
  generateVat: MutationType

  createCreditNoteItem: MutationType
  removeCreditNoteItem: MutationType
}
export interface CnRefetchI {
  creditNote: RefetchType
  creditNoteItem: RefetchType
}

export interface CnLoadingI {
  creditNote: boolean
  creditNoteItem: boolean

  lazyQueryItemParticular: boolean

  createCreditNote: boolean
  generateTax: boolean
  generateVat: boolean
  createCreditNoteItem: boolean
  creditNotePosting: boolean
}

export type CnDispatch = (value: CnAction) => void

export interface CreditNCreateContextProps {
  state: StateI
  dispatch: CnDispatch
  hide: (values: any) => void
  form?: FormInstance<any>
  messageApi?: MessageInstance
  lazyQuery?: CnLazyQuery
  mutation?: CnMutation
  refetch?: CnRefetchI
  loading?: CnLoadingI
  totalSummary: TotalSummaryI
}

interface CreditNCreateProps extends CreditNCreateContextProps {
  children: ReactNode
}

const initialProps: CreditNCreateContextProps | undefined = {
  state: {
    dataSource: [],
    invoiceType: 'REGULAR' as InvoiceTypeT,
    creditNoteType: 'INVOICE' as CreditNoteTypeT,
  },
  dispatch: (value: CnAction) => null,
  totalSummary: {
    total: 0,
    subTotal: 0,
    subTotalHCI: 0,
    subTotalPF: 0,
    cwtAmount: 0,
    vatAmount: 0,
  },
  hide: (values: any) => null,
}

export const CreditNCreateContext =
  createContext<CreditNCreateContextProps>(initialProps)

function CreditNCreate(props: CreditNCreateProps) {
  const { children, state, form, dispatch, ...restProps } = props
  return (
    <CreditNCreateContext.Provider
      value={{ state, form, dispatch, ...restProps }}
    >
      {children}
    </CreditNCreateContext.Provider>
  )
}

const Header = () => {
  const context = useContext(CreditNCreateContext)

  return <CNHeader {...context} />
}

const Body = () => {
  const context = useContext(CreditNCreateContext)

  return <CNBodyContainer {...context} />
}

const Summary = () => {
  const context = useContext(CreditNCreateContext)

  return <CNSummary {...context} />
}

const Footer = () => {
  const context = useContext(CreditNCreateContext)

  return <CNFooter {...context} />
}
CreditNCreate.Header = Header
CreditNCreate.Body = Body
CreditNCreate.Summary = Summary
CreditNCreate.Footer = Footer

export default CreditNCreate
