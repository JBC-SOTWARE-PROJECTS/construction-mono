import { Modal, message } from 'antd'
import { useReducer } from 'react'
import { useForm } from 'antd/lib/form/Form'
import { CustomModalTitle } from '../../common/modalPageHeader'
import { ReceivePayReducer } from '../payment/props'
import { PaymentTransactionType, ReceiptType } from '../payment/types'
import Terminal, {
  CashierDataPropsI,
} from '@/components/accounting/cashier/terminal'
import Payment from '../payment'
import { TerminalDialogModalProps } from '@/components/accounting/cashier/terminal/props'
import { gql, useQuery } from '@apollo/client'

interface PaymentTerminal {
  hide: (value?: any) => void
  type: ReceiptType
  transactionType: PaymentTransactionType
}

const ACTIVESHIFT = gql`
  {
    activeShift {
      id
      terminal {
        id
        terminal_no
      }
      shiftNo
    }
  }
`

export default function PaymentTerminal(props: PaymentTerminal) {
  const { transactionType, ...paymentProps } = props

  const { loading, data, refetch } = useQuery(ACTIVESHIFT, {
    fetchPolicy: 'network-only',
  })

  console.log(props, 'props')
  const [form] = useForm()
  const [state, dispatch] = useReducer(ReceivePayReducer, {
    invoiceType: 'REGULAR',
    customerId: null,
    amountToApply: 0,
    paymentMethod: [],
    transactions: [],
    selectedRowKeys: [],
  })

  return (
    <Modal
      title={
        <CustomModalTitle
          editing={false}
          title={{
            onNew: 'Receive Payment',
            onEdit: 'Receive Payment',
          }}
          subTitle={{
            onNew: 'Add a contact to start saving the payment.',
            onEdit: 'Changes have been saved in the draft',
          }}
          style={{ padding: '20px 24px' }}
        />
      }
      footer={<></>}
      closeIcon={false}
      {...TerminalDialogModalProps}
      open
      // onCancel={() => hide(props?.willRefetch)}
    >
      <Payment
        {...{
          cashierData: {
            shiftId: data?.activeShift?.id,
          },
          state,
          dispatch,
          form,
          transactionType,
          ...paymentProps,
        }}
      >
        <Payment.Header />
        <Payment.Body />
        <Payment.Summary />
        <Payment.Footer />
      </Payment>
    </Modal>
  )
}
