import { MutationType } from '@/components/accountReceivables/common/types'
import { CreditNoteStatusEnum } from '@/constant/accountReceivables'
import { ArCreditNote, ArCreditNoteItems } from '@/graphql/gql/graphql'
import { apiUrlPrefix } from '@/shared/settings'
import { FormInstance, message } from 'antd'
import { CheckboxChangeEvent } from 'antd/lib/checkbox'
import { MessageInstance } from 'antd/lib/message/interface'
import dayjs from 'dayjs'
import Decimal from 'decimal.js'
import { InvoiceTypeT, StateI } from '.'
import { CnDispatch, CnMutation, CnRefetchI } from './CreditNCreate'
import { CnTableHandleSaveI } from './components'

interface AsyncMutationWithLoaderI {
  variables: any
  messageApi?: MessageInstance
  refetch?: CnRefetchI
  mutationFunc?: MutationType
  refetchCnOnly?: boolean
}

function onAsyncMutationWithLoader(props: AsyncMutationWithLoaderI) {
  const { messageApi, variables, refetch, mutationFunc, refetchCnOnly } = props
  messageApi?.open({
    type: 'loading',
    content: 'Action in progress..',
    duration: 0,
  })

  if (mutationFunc)
    mutationFunc({
      variables,
      onCompleted: () => {
        messageApi?.destroy()
        refetch?.creditNote()
        if (!refetchCnOnly) refetch?.creditNoteItem()
      },
    })
}

interface SelectCustomerFuncI {
  state: StateI
  value: string
  mutation?: CnMutation
  dispatch: CnDispatch
}

export const onSelectCustomer = (props: SelectCustomerFuncI) => {
  const { state, mutation, dispatch } = props
  mutation?.createCreditNote({
    variables: {
      id: state?.id,
      fields: {
        arCustomer: { id: props.value },
        status: CreditNoteStatusEnum.DRAFT,
        creditNoteDate: dayjs().startOf('day').add(8, 'hour'),
        invoiceType: state.invoiceType,
      },
    },
    onCompleted: ({ creditNote: { response } }: any) => {
      dispatch({ type: 'creditNote-id', payload: response?.id })
    },
  })
}

interface ChangeCnCwtI {
  value: CheckboxChangeEvent
  state: StateI
  form?: FormInstance<any>
  dispatch: CnDispatch
  mutation?: CnMutation
  refetch?: CnRefetchI
  messageApi?: MessageInstance
}

export const onChangeCnCWT = (props: ChangeCnCwtI) => {
  const {
    state,
    form,
    value: { target },
    mutation,
    refetch,
    dispatch,
    messageApi,
  } = props

  if (dispatch) dispatch({ type: 'toggleCWT' })

  if (!target.checked) {
    const rate = form?.getFieldValue('cwtRate')
    const variables = {
      creditNoteId: state?.id,
      taxType: 'CWT',
      rate,
      isApply: false,
    }
    onAsyncMutationWithLoader({
      mutationFunc: mutation?.generateTax,
      variables,
      refetch,
      messageApi,
    })
  }
}

interface HandleChangeCnCwtI {
  state: StateI
  form?: FormInstance<any>
  mutation?: CnMutation
  refetch?: CnRefetchI
  messageApi?: MessageInstance
}

export const onHandleClickCWT = (props: HandleChangeCnCwtI) => {
  const { form, mutation, state, refetch, messageApi } = props
  const rate = form?.getFieldValue('cwtRate')
  const isApply = rate > 0 ? true : false

  const variables = {
    creditNoteId: state?.id,
    taxType: 'CWT',
    rate,
    isApply,
  }

  onAsyncMutationWithLoader({
    mutationFunc: mutation?.generateTax,
    variables,
    refetch,
    messageApi,
  })
}

interface ChangeCnVatI {
  value: CheckboxChangeEvent
  state: StateI
  form?: FormInstance<any>
  dispatch: CnDispatch
  mutation?: CnMutation
  refetch?: CnRefetchI
  messageApi?: MessageInstance
}

export const onChangeCnVat = (props: ChangeCnVatI) => {
  const {
    state,
    form,
    value: { target },
    mutation,
    refetch,
    dispatch,
    messageApi,
  } = props

  if (dispatch) dispatch({ type: 'toggleVat' })

  if (!target.checked) {
    const vat = form?.getFieldValue('vat')
    const variables = {
      creditNoteId: state?.id,
      vatValue: vat,
      isVatable: false,
    }
    onAsyncMutationWithLoader({
      mutationFunc: mutation?.generateVat,
      variables,
      refetch,
      messageApi,
    })
  }
}

interface HandleClickCnVatI {
  state: StateI
  form?: FormInstance<any>
  mutation?: CnMutation
  refetch?: CnRefetchI
  messageApi?: MessageInstance
}

export const onHandleClickVat = (props: HandleClickCnVatI) => {
  const { form, mutation, state, refetch, messageApi } = props

  const vat = form?.getFieldValue('vat')
  const isVatable = vat > 0 ? true : false
  const variables = {
    creditNoteId: state?.id,
    vatValue: vat,
    isVatable,
  }
  onAsyncMutationWithLoader({
    mutationFunc: mutation?.generateVat,
    variables,
    refetch,
    messageApi,
  })
}

interface HandleRefreshAddressI {
  state: StateI
  mutation?: CnMutation
  refetch?: CnRefetchI
  messageApi?: MessageInstance
}

export const onHandleRefreshAddress = (props: HandleRefreshAddressI) => {
  const { mutation, state, refetch, messageApi } = props

  const variables = {
    id: state?.id,
    fields: { billingAddress: null },
  }
  onAsyncMutationWithLoader({
    mutationFunc: mutation?.createCreditNote,
    variables,
    refetch,
    messageApi,
    refetchCnOnly: true,
  })
}

export const assignCnFormValues = (
  values: ArCreditNote,
  form: FormInstance<any>,
  dispatch: CnDispatch
) => {
  const defaultFormValue = { ...values }
  defaultFormValue.creditNoteDate = dayjs(values?.creditNoteDate ?? dayjs())
  form.setFieldsValue({
    ...defaultFormValue,
    customerId: values?.arCustomer?.id ?? null,
  })

  const { isCWT, isVatable, id, arCustomer, status } = values
  const { street, barangay, city, province, country, zipcode } = arCustomer
    ?.otherDetails?.billingContact ?? {
    street: '',
    barangay: '',
    city: '',
    province: '',
    country: '',
    zipcode: '',
  }

  if (!values?.billingAddress) {
    form.setFieldValue(
      'billingAddress',
      street +
        ' ' +
        barangay +
        ', ' +
        city +
        ', ' +
        province +
        ', ' +
        country +
        ' ' +
        zipcode
    )
  }

  if (isCWT) dispatch({ type: 'set-CWT', payload: isCWT })
  if (isVatable) dispatch({ type: 'set-Vat', payload: isVatable })
  dispatch({ type: 'customer-id', payload: values?.arCustomer?.id ?? '' })
  dispatch({
    type: 'set-invoiceType',
    payload: (values?.invoiceType ?? 'CLAIMS') as InvoiceTypeT,
  })
  dispatch({ type: 'creditNote-id', payload: id })
  dispatch({ type: 'status', payload: status ?? '' })
}

export const getFieldArrayValue = (dataIndex: any, value: any) => {
  let actualValue: any = value[dataIndex]
  const isArray = Array.isArray(dataIndex)
  if (isArray) {
    let remap = dataIndex.map((da, index) => {
      if (index == 0) actualValue = value[da]
      else actualValue[da]
    })
  }

  return actualValue
}

export interface extendARItems extends ArCreditNoteItems {
  [key: string]: any // Adjust this to the appropriate type if possible
}

export const onHandleCnSave = (values: CnTableHandleSaveI) => {
  const {
    record,
    fields: fieldsValues,
    dataIndex,
    state,
    dispatch,
    mutation,
  } = values
  var row = { ...record }
  var fields = { ...fieldsValues }

  const { dataSource } = state
  const newData = [...dataSource]
  const index = newData.findIndex((item) => row.id === item.id)
  const item = newData[index]

  const actualValue = getFieldArrayValue(dataIndex, fields)
  let totalAmountDue = 0
  switch (dataIndex) {
    case 'quantity':
      let fieldValueQty = new Decimal(actualValue)
      totalAmountDue = parseFloat(
        new Decimal(item?.unitPrice ?? 0).times(fieldValueQty).toString()
      )
      fields.totalHCIAmount = totalAmountDue
      row.totalHCIAmount = totalAmountDue
      fields.totalAmountDue = totalAmountDue
      row.totalAmountDue = totalAmountDue

      break
    case 'unitPrice':
      let fieldValuePrice = new Decimal(actualValue)
      totalAmountDue = parseFloat(
        new Decimal(item?.quantity ?? 0).times(fieldValuePrice).toString()
      )
      fields.totalHCIAmount = totalAmountDue
      row.totalHCIAmount = totalAmountDue
      fields.totalAmountDue = totalAmountDue
      row.totalAmountDue = totalAmountDue
      break
    case 'totalAmountDue':
      let fieldValueTotal = new Decimal(actualValue)
      const quantity = new Decimal(item?.quantity ?? 0)
      const unitPrice = fieldValueTotal.dividedBy(quantity)
      fields.totalHCIAmount = totalAmountDue
      row.totalHCIAmount = totalAmountDue
      fields.unitPrice = unitPrice
      row.unitPrice = unitPrice
      fields.totalHCIAmount = totalAmountDue
      row.totalHCIAmount = totalAmountDue
    default:
      break
  }

  const isArray = Array.isArray(dataIndex)
  if (isArray) {
    let latestCol: extendARItems = { ...fields }
    let buildCol: any = {}

    if (dataIndex)
      dataIndex.map((da, index) => {
        const length = dataIndex.length
        if (index === length - 1) {
          dataIndex.reverse().map((ra, reverseIndex) => {
            const last = {
              id: latestCol[da].value,
              [da]: latestCol[da].label,
            }
            if (reverseIndex > 0) {
              if (reverseIndex == 1) {
                buildCol[ra] = last
              } else buildCol[ra] = buildCol
            }
          })
        }
        latestCol = latestCol[da]
      })
    fields = buildCol
    row = { ...row, ...buildCol }
  }

  newData.splice(index, 1, {
    ...item,
    ...row,
  })
  dispatch({ type: 'new-set-item', payload: newData })

  mutation?.createCreditNoteItem({
    variables: {
      id: row?.id,
      fields,
    },
    onCompleted: ({
      creditNote,
    }: {
      creditNote: {
        success: boolean
        response: ArCreditNoteItems
        message: string
      }
    }) => {
      const { success, response, message: messageText } = creditNote
      if (!success) {
        const oldData = [...dataSource]
        const index = oldData.findIndex((item) => row.id === item.id)
        const item = oldData[index]

        if (response) {
          oldData.splice(index, 1, {
            ...item,
            ...response,
          })
        }

        dispatch({
          type: 'new-set-item',
          payload: oldData,
        })
        message.error(messageText)
      } else {
        const isArray = Array.isArray(dataIndex)
        if (isArray) {
          if (dataIndex.includes('itemName')) {
            fields = {}
            row.unitPrice = response?.invoiceParticulars?.salePrice
            row.description = response?.invoiceParticulars?.description
            row.quantity = 1
            const totalAmountDue = parseFloat(
              new Decimal(row.unitPrice ?? 0)
                .times(new Decimal(row?.quantity ?? 0))
                .toString()
            )

            fields.unitPrice = row.unitPrice
            fields.description = row.description
            fields.quantity = 1
            row.totalHCIAmount = totalAmountDue
            row.totalAmountDue = totalAmountDue

            console.log(fields, 'fields')
            newData.splice(index, 1, {
              ...item,
              ...row,
            })
            dispatch({ type: 'new-set-item', payload: newData })
            mutation?.createCreditNoteItem({
              variables: {
                id: row?.id,
                fields,
              },
            })
          }
        }
      }
    },
  })
}

interface HandleCnAddI {
  state: StateI
  mutation?: CnMutation
  dispatch: CnDispatch
}

export const onHandleCnAdd = (props: HandleCnAddI) => {
  const { state, mutation, dispatch } = props
  const { id } = state
  mutation?.createCreditNoteItem({
    variables: {
      id: null,
      fields: {
        arCreditNote: { id },
      },
    },
    onCompleted: ({ creditNote }) => {
      const { success, response, message: messageText } = creditNote
      if (success) {
        dispatch({ type: 'add-item', payload: response })
        message.success(messageText)
      }
    },
  })
}

interface SelectInvoiceTypeI {
  invoiceType: InvoiceTypeT
  state: StateI
  mutation?: CnMutation
  dispatch: CnDispatch
}

export const onSelectInvoiceType = (props: SelectInvoiceTypeI) => {
  const { invoiceType, state, mutation, dispatch } = props
  mutation?.createCreditNote({
    variables: {
      id: state?.id,
      fields: {
        invoiceType,
      },
    },
    onCompleted: ({ creditNote }) => {
      const { success, response, message: messageText } = creditNote
      if (success) {
        dispatch({ type: 'set-invoiceType', payload: invoiceType })
      }
    },
  })
}

export const onCNHandlePreview = (id?: string) => {
  window.open(apiUrlPrefix + '/arreports/arcreditnote?id=' + id, 'creditnote')
}
