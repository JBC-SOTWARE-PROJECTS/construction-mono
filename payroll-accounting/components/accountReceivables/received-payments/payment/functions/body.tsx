import { Form, FormInstance, InputNumber, InputRef } from 'antd'
import {
  BankDepositDesc,
  CardDesc,
  CheckDesc,
  EWalletDesc,
} from '../Body/payment-method-desc'
import {
  ClientTransactionI,
  DispatchI,
  EditableCellProps,
  EditableRowProps,
  PaymentMethodFields,
  PaymentTransactionType,
  StateI,
} from '../types'
import React, { useState, useRef, useContext } from 'react'

export function getPaymentMethodDesc(params: PaymentMethodFields) {
  switch (params.type) {
    case 'CARD':
      return <CardDesc {...params} />
    case 'CHECK':
      return <CheckDesc {...params} />
    case 'BANKDEPOSIT':
      return <BankDepositDesc {...params} />
    case 'EWALLET':
      return <EWalletDesc {...params} />
    default:
      return null
  }
}

interface handleDeletePaymentMethodI {
  id: string
  state: StateI
  dispatch: DispatchI
}

export const handleDeletePaymentMethod = (
  params: handleDeletePaymentMethodI
) => {
  const { id, state, dispatch } = params
  const payload = state.paymentMethod.filter((item) => item.id !== id)
  dispatch({ type: 'set-paymentMethod', payload })
}

// PENDING TRANSACTIONS
interface handleAddPendingTransactionsI {
  transactionType: PaymentTransactionType
  state: StateI
  dispatch: DispatchI
  pnDialog: any
  invDialog: any
}

export const handleAddPendingTransactions = (
  params: handleAddPendingTransactionsI
) => {
  const { transactionType } = params
  const { customerId, transactions, invoiceType } = params.state

  if (transactionType == 'PROMISSORY_NOTE')
    params.pnDialog(
      { customerId, transactionType },
      (records: ClientTransactionI[]) => {
        params.dispatch({ type: 'set-transactions', payload: records })
      }
    )
  else {
    const selected = transactions.map((trans) => trans?.id)
    params.invDialog(
      {
        customerId,
        invoiceType: invoiceType,
        transactionType,
        transactions: transactions,
        selected,
      },
      (records: ClientTransactionI[]) => {
        params.dispatch({ type: 'set-transactions', payload: records })
      }
    )
  }
}

export const EditableContext = React.createContext<FormInstance<any> | null>(
  null
)

export const EditableRow: React.FC<EditableRowProps> = ({
  index,
  ...props
}) => {
  const [form] = Form.useForm()
  return (
    <Form form={form} component={false}>
      <EditableContext.Provider value={form}>
        <tr {...props} />
      </EditableContext.Provider>
    </Form>
  )
}

export const EditableCell: React.FC<EditableCellProps> = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  ...restProps
}) => {
  const [editing, setEditing] = useState(false)
  const form = useContext(EditableContext)!

  const toggleEdit = () => {
    setEditing(!editing)
    form.setFieldsValue({ [dataIndex]: record[dataIndex] })
  }

  const save = async () => {
    try {
      const values = await form.validateFields()

      toggleEdit()
      handleSave({ ...record, ...values })
    } catch (errInfo) {
      console.log('Save failed:', errInfo)
    }
  }

  let childNode = children

  if (editable) {
    childNode = editing ? (
      <Form.Item
        style={{ margin: 0 }}
        name={dataIndex}
        rules={[
          {
            required: true,
          },
        ]}
      >
        <InputNumber
          autoFocus={true}
          onPressEnter={save}
          onBlur={save}
          style={{ width: '100%' }}
        />
      </Form.Item>
    ) : (
      <div
        className='editable-cell-value-wrap'
        style={{ paddingRight: 0 }}
        onClick={toggleEdit}
      >
        {children}
      </div>
    )
  }

  return <td {...restProps}>{childNode}</td>
}
