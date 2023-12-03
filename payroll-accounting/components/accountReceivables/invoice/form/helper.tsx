import { ArInvoice, ArInvoiceItems } from '@/graphql/gql/graphql'
import { SolutionOutlined, TagsOutlined } from '@ant-design/icons'
import { FormInstance } from 'antd'
import dayjs from 'dayjs'
import { ReactNode } from 'react'

export const assignFormValues = (
  values: ArInvoice,
  form: FormInstance<any>,
  dispatch: any
) => {
  const defaultFormValue = { ...values }
  defaultFormValue.dueDate = dayjs(values?.dueDate ?? dayjs().add(1, 'month'))
  defaultFormValue.invoiceDate = dayjs(values?.invoiceDate ?? dayjs())
  form.setFieldsValue({
    ...defaultFormValue,
    customerId: values?.arCustomer?.id ?? null,
  })

  const { isCWT, isVatable, id, arCustomer, status } = values

  if (!values?.billingAddress) {
    form.setFieldValue('billingAddress', arCustomer?.address)
  }

  if (isCWT) dispatch({ type: 'set-CWT', payload: isCWT })
  if (isVatable) dispatch({ type: 'set-Vat', payload: isVatable })
  dispatch({ type: 'invoice-id', payload: id })
  dispatch({ type: 'status', payload: status })
}

export const textStatus = (value: {
  editing: boolean
  onNew: string | ReactNode
  onEdit: string | ReactNode
}) => {
  const { editing, onNew, onEdit } = value

  return editing ? onEdit : onNew
}

export const invoiceTypeDetails = {
  CLAIMS: { icon: <SolutionOutlined />, label: 'Claims', color: 'purple' },
  REGULAR: { icon: <TagsOutlined />, label: 'Regular', color: 'magenta' },
}
