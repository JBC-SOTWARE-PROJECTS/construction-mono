import { FormDatePicker, FormInput } from '@/components/common'
import { Col, Form, Row, Statistic } from 'antd'
import dayjs from 'dayjs'
import numeral from 'numeral'
import { ReceivePayCreateContextProps } from '.'
import { onSelectCustomer } from './functions/header'
import CustomerSelector from '../../common/customer-selector'
import { dateFormat } from '../../common/enum'

export default function ReceivePayHeader(props: ReceivePayCreateContextProps) {
  const { cashierData, type, dispatch } = props

  const handleSelectCustomer = (customerId: string) => {
    onSelectCustomer({ customerId, dispatch })
  }

  return (
    <Form
      form={props?.form}
      layout='vertical'
      style={{ marginTop: 30, padding: '20px 24px' }}
      initialValues={{
        transactionDate: dayjs(),
        paymentMethod: 'CASH',
        orNumber: type == 'OR' ? cashierData?.nextOR : cashierData?.nextAR,
      }}
    >
      <Row>
        <Col flex='400px'>
          <CustomerSelector
            customerType={
              props.transactionType == 'PROMISSORY_NOTE'
                ? ['PROMISSORY_NOTE']
                : []
            }
            onSelect={(e: string) => handleSelectCustomer(e)}
          />
        </Col>
        <Col flex='auto'>
          <Statistic
            title='AMOUNT TO RECEIVE'
            value={numeral(props.totalPayment).format('0,0.00')}
            prefix={<>&#8369;</>}
            style={{ textAlign: 'end' }}
            valueStyle={{
              fontWeight: 'bold',
              width: '100%',
              textAlign: 'end',
            }}
          />
        </Col>
      </Row>
      <Row style={{ marginTop: 40 }} gutter={[8, 8]}>
        <Col flex='300px'>
          <FormDatePicker
            label='Payment Date'
            name='transactionDate'
            required
            tooltip='This is a required field'
            style={{ fontWeight: 'bold' }}
            propsdatepicker={{
              style: { minWidth: 300 },
              size: 'large',
              format: dateFormat,
              allowClear: false,
            }}
          />
        </Col>
        <Col flex='300px'>
          <FormInput
            label={`${type} #`}
            name='orNumber'
            required
            tooltip='This is a required field'
            style={{ fontWeight: 'bold' }}
            propsinput={{
              style: { minWidth: 300 },
              size: 'large',
            }}
          />
        </Col>
      </Row>
      <Row style={{ marginTop: 10 }} gutter={[8, 8]}>
        <Col flex='300px'>
          <FormInput
            label='Reference'
            name='referenceNo'
            style={{ fontWeight: 'bold' }}
            propsinput={{
              size: 'large',
            }}
          />
        </Col>
        <Col flex='auto'></Col>
        {/* <Col flex='300px'>
          <FormInputNumber
            label='Amount Received'
            name='amount'
            style={{ fontWeight: 'bold' }}
            propsinputnumber={{
              size: 'large',
              onChange: (e) =>
                dispatch({ type: 'set-amountToApply', payload: e as number }),
            }}
          />
        </Col> */}
      </Row>
    </Form>
  )
}
