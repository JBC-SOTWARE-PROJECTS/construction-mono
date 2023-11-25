import { Button, Popconfirm } from 'antd'
import { ReceivePayCreateContextProps } from '.'
import numeral from 'numeral'
import ConfirmationPasswordHook from '@/hooks/promptPassword'
import { useMutation } from '@apollo/client'
import { SUBMIT_PAYMENT } from './gql'
import dayjs from 'dayjs'
import { ModalStyle } from '../../common/styles'

export default function ReceivePayFooter(props: ReceivePayCreateContextProps) {
  const [showPasswordConfirmation] = ConfirmationPasswordHook()

  const [mutateSubmit, { loading }] = useMutation(SUBMIT_PAYMENT)

  const onConfirmApprove = () => {
    if (!props.state.customerId)
      return props.messageApi?.error(
        'No customer selected. Please choose a customer before processing payment.'
      )

    if (props.totalPayment != props.totalTransactions) {
      return props.messageApi?.error(
        'Total payment amount does not match total transaction amount.'
      )
    }

    if ((props?.totalPayment ?? 0) <= 0)
      return props.messageApi?.error('Payment amount cannot be zero.')

    showPasswordConfirmation(() => {
      props?.messageApi?.open({
        type: 'loading',
        content: 'Please wait..',
        duration: 0,
      })

      const { transactions } = props.state
      const { shiftId } = props?.cashierData ?? { shiftId: null }
      const { customerId, orNumber } = props?.form?.getFieldsValue()

      let paymentMethod = ''
      const tendered = props.state.paymentMethod.map((pay) => {
        paymentMethod = `${pay.type} ${
          paymentMethod ? `${paymentMethod}, ` : ''
        } `
        if (pay?.type !== 'CASH' && pay?.type !== 'EWALLET' && pay?.checkdate)
          pay.checkdate = dayjs(pay.checkdate)
            .startOf('day')
            .add(8, 'hours')
            .format('YYYY-MM-DD')

        return pay
      })

      mutateSubmit({
        variables: {
          customerId,
          tendered,
          shiftId,
          orNumber: orNumber,
          transactionType: props.transactionType,
          paymentMethod,
          transactions,
        },
        onCompleted: ({
          addReceivablePayment: { success, message: messageText },
        }) => {
          props?.messageApi?.destroy()

          if (success) props?.messageApi?.success(messageText)
          else props?.messageApi?.error(messageText)

          props.hide(false)
        },
        onError: () => {
          props?.messageApi?.destroy()
        },
      })
    })
  }
  return (
    <ModalStyle>
      <div className='footer'>
        <Button
          type='primary'
          size='large'
          style={{ background: '#db2828', float: 'left' }}
          onClick={() => props.hide(false)}
          loading={loading}
        >
          Close
        </Button>
        <Popconfirm
          title='Submit Payment'
          description={`Are you sure you want to proceed with the payment of ${numeral(
            props.totalPayment
          ).format('0,0.00')}?`}
          onConfirm={onConfirmApprove}
          okText='Yes'
          cancelText='No'
          okButtonProps={{ loading: false }}
        >
          <Button type='primary' size='large' loading={loading}>
            Receive Payment
          </Button>
        </Popconfirm>
      </div>
    </ModalStyle>
  )
}
