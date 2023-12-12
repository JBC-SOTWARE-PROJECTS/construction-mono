import { InvoiceTypeOption } from '@/constant/accountReceivables'
import { useDialog } from '@/hooks'
import type { CollapseProps } from 'antd'
import { Button, Collapse, Select, Space } from 'antd'
import { v4 as uuidv4 } from 'uuid'
import { ReceivePayCreateContextProps } from '..'
import InvoiceOutstandingRecords from '../../dialog/invoiceOutstandingRecords'
import PaymentMethodForm from '../../dialog/payment-method-form'
import { handleAddPendingTransactions } from '../functions/body'
import { PaymentMethodFields } from '../types'
import PaymentMethod from './payment-method'
import PendingTransactions from './pending-transactions'

export default function ReceivePayBody(props: ReceivePayCreateContextProps) {
  const paymentMethodDialog = useDialog(PaymentMethodForm)
  const invoiceRecordsDialog = useDialog(InvoiceOutstandingRecords)

  const onClickAddPendingTransaction = () => {
    handleAddPendingTransactions({
      transactionType: props.transactionType,
      state: props.state,
      dispatch: props.dispatch,
      pnDialog: () => {},
      invDialog: invoiceRecordsDialog,
    })
  }

  const handleClickPaymentMethod = () => {
    paymentMethodDialog({}, (returned: PaymentMethodFields) => {
      if (returned) {
        returned.id = uuidv4()
        props.dispatch({
          type: 'set-paymentMethod',
          payload: [...props.state.paymentMethod, returned],
        })
      }
    })
  }

  const items: CollapseProps['items'] = [
    {
      key: '1',
      label: 'Payment Method',
      collapsible: 'header',
      extra: [
        <Button
          key={1}
          type='dashed'
          danger
          onClick={handleClickPaymentMethod}
          style={{ width: 165 }}
        >
          Add Payment Method
        </Button>,
      ],
      children: <PaymentMethod />,
    },
    {
      key: '2',
      label: 'Pending Transactions',
      collapsible: 'header',
      extra: [
        <Space key={1}>
          {/* {props.transactionType !== 'PROMISSORY_NOTE' && (
            <Select
              options={InvoiceTypeOption}
              value={props.state.invoiceType}
              onChange={(e) =>
                props.dispatch({ type: 'set-invoiceType', payload: e })
              }
            />
          )} */}
          <Button
            type='primary'
            onClick={onClickAddPendingTransaction}
            style={{ width: 165 }}
          >
            Add Transactions
          </Button>
        </Space>,
      ],
      children: <PendingTransactions />,
    },
  ]

  return <Collapse items={items} bordered={false} defaultActiveKey={['1']} />
}
