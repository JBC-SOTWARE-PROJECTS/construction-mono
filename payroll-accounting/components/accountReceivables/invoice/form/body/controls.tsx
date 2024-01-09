import CustomerClaims from '@/components/accountReceivables/customers/claims'
import { ArInvoiceItems } from '@/graphql/gql/graphql'
import { useDialog } from '@/hooks'
import { PlusCircleOutlined } from '@ant-design/icons'
import { Button, Space, message } from 'antd'
import { Action, StateI } from '..'
import dayjs from 'dayjs'

interface BodyControlsI {
  invoiceType: string
  editable: boolean
  state: StateI
  dispatch: (value: Action) => void
  onUpdateItem: (value: {
    variables: any
    onCompleted: (value: any) => void
  }) => void
}
export default function BodyControls(props: BodyControlsI) {
  const { invoiceType, editable, state, dispatch, onUpdateItem } = props

  const claimsDialog = useDialog(CustomerClaims)

  const onHandleAddClaimsItems = () => {
    const { id, customerId } = state
    claimsDialog({ id, customerId }, (newItems: ArInvoiceItems[]) => {
      if (newItems) dispatch({ type: 'add-items', payload: newItems })
    })
  }

  const handleAdd = () => {
    const { id } = state
    onUpdateItem({
      variables: {
        id: null,
        fields: {
          arInvoice: { id },
          transactionDate: dayjs().format('YYYY-MM-DD'),
        },
      },
      onCompleted: ({ addInvoiceItem }) => {
        const { success, response, message: messageText } = addInvoiceItem
        if (success) {
          dispatch({ type: 'add-item', payload: response })
          message.success(messageText)
        }
      },
    })
  }

  return (
    <Space size='middle'>
      {invoiceType == 'PROJECT' && editable && (
        <Button
          size='middle'
          icon={<PlusCircleOutlined />}
          onClick={() => onHandleAddClaimsItems()}
          // style={{ color: '#0078c8', fontWeight: 'bold' }}
          type='primary'
        >
          Add Bill of Quantities
        </Button>
      )}
      {/* {invoiceType == 'PROJECT' && editable && (
        <Button
          size='middle'
          icon={<PlusCircleOutlined />}
          // onClick={() => onHandleManualClaims()}
          // style={{ color: '#0078c8', fontWeight: 'bold' }}
          type='primary'
        >
          Add Manual Project
        </Button>
      )} */}

      {invoiceType == 'REGULAR' && editable && (
        <Button
          size='middle'
          icon={<PlusCircleOutlined />}
          onClick={() => handleAdd()}
          style={{ color: '#0078c8', fontWeight: 'bold' }}
        >
          Add Record
        </Button>
      )}
    </Space>
  )
}
