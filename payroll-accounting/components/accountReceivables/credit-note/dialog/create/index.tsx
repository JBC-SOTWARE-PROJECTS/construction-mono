import { CustomModalTitle } from '@/components/accountReceivables/common/modalPageHeader'
import {
  ACCOUNT_OPTIONS_GQL,
  ADD_CREDIT_NOTE_ITEMS,
  CREATE_CREDIT_NOTE,
  CREDIT_NOTE_POSTING,
  FIND_ALL_CREDIT_NOTE_ITEMS_BY_CNID,
  FIND_ONE_CREDIT_NOTE,
  GENERATE_CREDIT_NOTE_TAX,
  GENERATE_CREDIT_NOTE_VAT,
  INVOICE_PARTICULAR_OPTIONS_GQL,
  REMOVE_CREDIT_NOTE_ITEM,
} from '@/graphql/accountReceivables/creditNote'
import { ArCreditNoteItems } from '@/graphql/gql/graphql'
import { useLazyQuery, useMutation, useQuery } from '@apollo/client'
import { Modal, message } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import Decimal from 'decimal.js'
import { useMemo, useReducer } from 'react'
import CreditNCreate from './CreditNCreate'
import { assignCnFormValues } from './functions'
import { CnCreateModalProps } from './props'

export interface TotalSummaryI {
  total: number
  subTotal: number
  subTotalHCI: number
  subTotalPF: number
  cwtAmount: number
  vatAmount: number
}

export type CreditNoteTypeT = 'INVOICE' | 'PROMISSORY'

interface CreditNCreateProps {
  hide: (value: any) => void
  id?: string
  creditNoteType: CreditNoteTypeT
}

export type InvoiceTypeT = 'CLAIMS' | 'REGULAR'
export interface StateI {
  id?: string
  status?: string
  isCWT?: boolean
  isVatable?: boolean
  customerId?: string
  dataSource: ArCreditNoteItems[]
  invoiceType: InvoiceTypeT
  creditNoteType: CreditNoteTypeT
}

export type CnAction =
  | { type: 'toggleCWT' }
  | { type: 'toggleVat' }
  | { type: 'set-invoiceType'; payload: InvoiceTypeT }
  | { type: 'set-creditNoteType'; payload: CreditNoteTypeT }
  | { type: 'set-CWT'; payload: boolean }
  | { type: 'set-Vat'; payload: boolean }
  | { type: 'creditNote-id'; payload: string }
  | { type: 'customer-id'; payload: string }
  | { type: 'status'; payload: string }
  | { type: 'add-item'; payload: ArCreditNoteItems }
  | { type: 'add-items'; payload: ArCreditNoteItems[] }
  | { type: 'new-set-item'; payload: ArCreditNoteItems[] }

type Reducer = (state: StateI, action: CnAction) => StateI

const initialState: StateI = {
  isCWT: false,
  isVatable: false,
  dataSource: [],
  invoiceType: 'REGULAR' as InvoiceTypeT,
  creditNoteType: 'INVOICE' as CreditNoteTypeT,
}

const reducer: Reducer = (state, action) => {
  switch (action.type) {
    case 'creditNote-id':
      return { ...state, id: action.payload }
    case 'customer-id':
      return { ...state, customerId: action.payload }
    case 'toggleCWT':
      return { ...state, isCWT: !state.isCWT }
    case 'set-CWT':
      return { ...state, isCWT: action.payload }
    case 'set-Vat':
      return { ...state, isVatable: action.payload }
    case 'toggleVat':
      return { ...state, isVatable: !state.isVatable }
    case 'set-invoiceType':
      return { ...state, invoiceType: action.payload }
    case 'status':
      return { ...state, status: action.payload }
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

export default function CreditNCreateDialog(props: CreditNCreateProps) {
  const [messageApi, contextHolder] = message.useMessage()
  const [state, dispatch] = useReducer(reducer, {
    ...initialState,
    id: props?.id,
  })
  const [form] = useForm()

  // Query

  const { loading: creditNoteRecordLoading, refetch: creditNoteRecordFetch } =
    useQuery(FIND_ONE_CREDIT_NOTE, {
      variables: {
        id: state?.id,
      },
      skip: !state?.id,
      onCompleted: ({ creditNote }) =>
        assignCnFormValues(creditNote, form, dispatch),
    })

  const {
    loading: creditNoteRecordItemLoading,
    refetch: creditNoteRecordItemFetch,
  } = useQuery(FIND_ALL_CREDIT_NOTE_ITEMS_BY_CNID, {
    variables: {
      id: state?.id,
    },
    skip: !state?.id,
    onCompleted: ({ creditNoteItems }) => {
      dispatch({ type: 'new-set-item', payload: creditNoteItems })
    },
  })

  // LazyQuery

  const [lazyQueryItemParticular, { loading: lazyQueryItemParticularLoading }] =
    useLazyQuery(INVOICE_PARTICULAR_OPTIONS_GQL)

  const [lazyQueryAccountList, { loading: lazyQueryAccountListLoading }] =
    useLazyQuery(ACCOUNT_OPTIONS_GQL)

  // Mutation

  const [mutateCreateCreditNote, { loading: creditNoteCreateLoading }] =
    useMutation(CREATE_CREDIT_NOTE)

  const [onGenerateTax, { loading: generateTaxLoading }] = useMutation(
    GENERATE_CREDIT_NOTE_TAX
  )

  const [onGenerateVat, { loading: generateVatLoading }] = useMutation(
    GENERATE_CREDIT_NOTE_VAT
  )

  const [mutateCreateCreditNoteItem, { loading: creditNoteCreateItemLoading }] =
    useMutation(ADD_CREDIT_NOTE_ITEMS)

  const [mutateRemoveCreditNoteItem, { loading: removeCreditNoteItemLoading }] =
    useMutation(REMOVE_CREDIT_NOTE_ITEM, {
      onCompleted: ({ creditNoteItem: { response, success } }) => {
        if (!success) {
          dispatch({ type: 'add-item', payload: response })
          message.error(
            'An error occurred while deleting the item. Please try again later.'
          )
        } else {
          message.success('Successfully deleted.')
        }
      },
    })

  const [mutateCreditNotePosting, { loading: creditNotePostingLoading }] =
    useMutation(CREDIT_NOTE_POSTING)

  // Regroup
  const lazyQuery = {
    lazyQueryItemParticular,
    lazyQueryAccountList,
  }

  const mutation = {
    createCreditNote: mutateCreateCreditNote,
    postingCreditNote: mutateCreditNotePosting,
    generateTax: onGenerateTax,
    generateVat: onGenerateVat,

    createCreditNoteItem: mutateCreateCreditNoteItem,
    removeCreditNoteItem: mutateRemoveCreditNoteItem,
  }

  const refetch = {
    creditNote: creditNoteRecordFetch,
    creditNoteItem: creditNoteRecordItemFetch,
  }

  const loading = {
    creditNote: creditNoteRecordLoading,
    creditNoteItem: creditNoteRecordItemLoading,

    lazyQueryItemParticular: lazyQueryItemParticularLoading,
    lazyQueryAccountList: lazyQueryAccountListLoading,

    createCreditNote: creditNoteCreateLoading,
    generateTax: generateTaxLoading,
    generateVat: generateVatLoading,
    createCreditNoteItem: creditNoteCreateItemLoading,
    creditNotePosting: creditNotePostingLoading,
  }

  const totalSummary = useMemo(
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
        } as TotalSummaryI
      ),
    [state.dataSource]
  )

  return (
    <Modal
      title={
        <CustomModalTitle
          editing={props?.id ? true : false}
          title={{
            onNew: 'New Credit Note',
            onEdit: 'Edit Credit Note',
          }}
          subTitle={{
            onNew: 'Add a contact to start saving the Credit Note.',
            onEdit: 'Changes have been saved in the draft',
          }}
        />
      }
      onOk={() => props?.hide(false)}
      footer={<></>}
      {...CnCreateModalProps}
    >
      {contextHolder}
      <CreditNCreate
        {...{
          state,
          dispatch,
          form,
          lazyQuery,
          mutation,
          refetch,
          loading,
          messageApi,
          totalSummary,
          hide: props.hide,
        }}
      >
        <CreditNCreate.Header />
        <CreditNCreate.Body />
        <CreditNCreate.Summary />
        <CreditNCreate.Footer />
      </CreditNCreate>
    </Modal>
  )
}
