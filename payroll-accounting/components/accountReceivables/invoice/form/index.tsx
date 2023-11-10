import {
  CREATE_INVOICE,
  FIND_ALL_INVOICE_ITEMS,
  FIND_ONE_INVOICE,
} from '@/graphql/accountReceivables/invoices'
import { useDialog } from '@/hooks'
import { FieldTimeOutlined } from '@ant-design/icons'
import { useLazyQuery, useMutation } from '@apollo/client'
import { Avatar, Badge, Form, Modal, Space, Tag, Typography } from 'antd'
import { useReducer, useEffect, useMemo } from 'react'
import CustomerClaims from '../../customers/claims'
import FormBody from './body'
import FormFooter from './footer'
import InvoiceFooterActions from './footer/actions'
import FormHeader from './header'
import { assignFormValues, invoiceTypeDetails, textStatus } from './helper'
import Decimal from 'decimal.js'
import { CustomModalTitle } from '../../common/modalPageHeader'
import { ArInvoiceItems } from '@/graphql/gql/graphql'

export interface AmountSummaryDetailI {
  total: number
  subTotal: number
  subTotalHCI: number
  subTotalPF: number
  cwtAmount: number
  vatAmount: number
}
interface InvoiceFormI {
  hide: (value: any) => void
  invoiceType: string
  id?: string
}

export interface StateI {
  id?: string
  status?: string
  isCWT?: boolean
  isVatable?: boolean
  customerRefId?: string
  dataSource: ArInvoiceItems[]
}

export type Action =
  | { type: 'toggleCWT' }
  | { type: 'toggleVat' }
  | { type: 'invoice-id'; payload: string }
  | { type: 'status'; payload: string }
  | { type: 'customer-reference-id'; payload: string }
  | { type: 'add-item'; payload: ArInvoiceItems }
  | { type: 'add-items'; payload: ArInvoiceItems[] }
  | { type: 'new-set-item'; payload: ArInvoiceItems[] }
  | { type: 'customer-reference-id'; payload: string }
  | { type: 'set-CWT'; payload: boolean }
  | { type: 'set-Vat'; payload: boolean }

type Reducer = (state: StateI, action: Action) => StateI

const initialState: StateI = { isCWT: false, isVatable: false, dataSource: [] }

const reducer: Reducer = (state, action) => {
  switch (action.type) {
    case 'toggleCWT':
      return { ...state, isCWT: !state.isCWT }
    case 'toggleVat':
      return { ...state, isVatable: !state.isVatable }
    case 'set-CWT':
      return { ...state, isCWT: action.payload }
    case 'set-Vat':
      return { ...state, isVatable: action.payload }
    case 'toggleVat':
      return { ...state, isVatable: !state.isVatable }
    case 'invoice-id':
      return { ...state, id: action.payload }
    case 'status':
      return { ...state, status: action.payload }
    case 'customer-reference-id':
      return { ...state, customerRefId: action.payload }
    case 'add-item':
      return { ...state, dataSource: [...state.dataSource, action.payload] }
    case 'add-items':
      return { ...state, dataSource: [...state.dataSource, ...action.payload] }
    case 'new-set-item':
      return { ...state, dataSource: [...action.payload] }
    default:
      throw new Error()
  }
}

export default function InvoiceForm(props: InvoiceFormI) {
  const { id, invoiceType, hide } = props
  const [form] = Form.useForm()

  const claimsDialog = useDialog(CustomerClaims)

  const [state, dispatch] = useReducer(reducer, { ...initialState, id })

  const [onMutateInvoice, { loading: loadingCreateInvoice }] =
    useMutation(CREATE_INVOICE)

  const [
    onFindOneInvoice,
    { loading: findOneInvLoading, refetch: invoiceRefetch },
  ] = useLazyQuery(FIND_ONE_INVOICE, {
    onCompleted: ({ findOne }) => assignFormValues(findOne, form, dispatch),
  })

  const [
    onFindAllInvoiceItems,
    { loading: findAllInvItemLoading, refetch: invoiceItemRefetch },
  ] = useLazyQuery(FIND_ALL_INVOICE_ITEMS)

  const seeMoreDialog = () => {
    claimsDialog({}, () => {})
  }

  const handleFindInvoice = (id: string) => {
    onFindOneInvoice({
      variables: { id },
      onCompleted: ({ findOne }) => assignFormValues(findOne, form, dispatch),
    })
  }

  const handleFindInvoiceItems = (id: string) => {
    onFindAllInvoiceItems({
      variables: { invoiceId: id },
      onCompleted: ({ invoiceItems }) =>
        dispatch({ type: 'new-set-item', payload: invoiceItems }),
    })
  }

  useEffect(() => {
    if (id) {
      onFindOneInvoice({
        variables: { id },
        onCompleted: ({ findOne }) => assignFormValues(findOne, form, dispatch),
      })
      onFindAllInvoiceItems({
        variables: { invoiceId: id },
        onCompleted: ({ invoiceItems }) =>
          dispatch({ type: 'new-set-item', payload: invoiceItems }),
      })
    }
  }, [id, form, onFindOneInvoice, onFindAllInvoiceItems])

  const tableLoader =
    loadingCreateInvoice || findOneInvLoading || findAllInvItemLoading
  const editable = !!state?.id

  const invoiceTypeLabel =
    invoiceTypeDetails[invoiceType as keyof typeof invoiceTypeDetails]

  const totalAmountSummary = useMemo(
    () =>
      (state.dataSource ?? []).reduce(
        (summary, { itemType, unitPrice, quantity, cwtAmount, vatAmount }) => {
          const unitPriceDec = new Decimal(unitPrice ?? 0)
          const quantityDec = new Decimal(quantity ?? 0)
          const cwtAmountDec = new Decimal(cwtAmount ?? 0)
          const vatAmountDec = new Decimal(vatAmount ?? 0)
          const amount = unitPriceDec.times(quantityDec)
          const netTotal = amount.minus(cwtAmountDec.plus(vatAmountDec))

          if (itemType == 'HCI') {
            summary.subTotalHCI = parseFloat(
              new Decimal(summary.subTotalHCI).plus(netTotal).toString()
            )
          }
          if (itemType == 'PF') {
            summary.subTotalPF = parseFloat(
              new Decimal(summary.subTotalPF).plus(netTotal).toString()
            )
          }

          summary.total = parseFloat(
            new Decimal(summary.total).plus(netTotal).toString()
          )
          summary.subTotal = parseFloat(
            new Decimal(summary.subTotal).plus(netTotal).toString()
          )
          summary.cwtAmount = parseFloat(
            new Decimal(summary.cwtAmount).plus(cwtAmountDec).toString()
          )
          summary.vatAmount = parseFloat(
            new Decimal(summary.vatAmount).plus(vatAmountDec).toString()
          )

          return summary
        },
        {
          total: 0,
          subTotal: 0,
          subTotalHCI: 0,
          subTotalPF: 0,
          cwtAmount: 0,
          vatAmount: 0,
        } as AmountSummaryDetailI
      ),
    [state.dataSource]
  )

  return (
    <Modal
      title={
        <CustomModalTitle
          editing={editable}
          title={{
            onNew: 'New Invoice',
            onEdit: 'Edit Invoice',
          }}
          subTitle={{
            onNew: 'Add a contact to start saving the invoice.',
            onEdit: 'Changes have been saved in the draft',
          }}
        />
      }
      open={true}
      onOk={() => props?.hide(false)}
      closable={false}
      width={'100%'}
      style={{
        top: 20,
        border: 'none',
        boxShadow: 'none',
        marginBottom: 100,
      }}
      maskStyle={{ background: '#f2f3f4' }}
      className='full-page-modal'
      footer={<></>}
    >
      <Space direction='vertical' style={{ width: '100%', marginBottom: 30 }}>
        <FormHeader
          {...{
            id,
            form,
            editable,
            state,
            dispatch,
            invoiceType,
            onMutateInvoice,
            invoiceRefetch,
            invoiceItemRefetch,
            handleFindInvoice,
            handleFindInvoiceItems,
          }}
        />
        <FormBody
          {...{
            id,
            seeMoreDialog,
            tableLoader,
            invoiceType,
            editable,
            state,
            dispatch,
          }}
        />
        <FormFooter {...{ form, invoiceType, totalAmountSummary }} />
      </Space>
      <InvoiceFooterActions {...{ state, hide, form }} />
    </Modal>
  )
}
