import {
  FormDatePicker,
  FormInput,
  FormInputNumber,
  FormSelect,
} from '@/components/common'
import { Card, Col, Form, Modal, Row, Space } from 'antd'
import { useForm } from 'antd/lib/form/Form'
import { useState } from 'react'
import { MiscCardType, MiscEWalletType } from '@/constant/accountReceivables'
import { gql, useQuery } from '@apollo/client'
import { Bank } from '@/graphql/gql/graphql'
import { PaymentMethodFields, PaymentMethodType } from '../payment/types'
import { paymentMethodTypeOptions } from '../payment/props'

interface PaymentMethodI {
  records?: PaymentMethodFields
  hide: (props?: { amount?: number }) => void
}

const GET_BANKS = gql`
  query ($filter: String, $page: Int, $size: Int) {
    banks: banks(filter: $filter, size: $size, page: $page) {
      content {
        id
        bankname
        acquiringBank
      }
      totalPages
      size
      number
    }
  }
`

function Cards() {
  const [otherType, setOtherType] = useState(false)

  const { data, loading } = useQuery(GET_BANKS, {
    variables: {
      filter: '',
      page: 0,
      size: 100,
    },
  })

  const onSelectCardType = (e: string) => {
    setOtherType(e === 'OTHERS')
  }

  return (
    <>
      <Row gutter={[16, 16]}>
        <Col flex='50%'>
          <FormInput
            name={['reference']}
            label='Card #'
            rules={[
              {
                required: true,
                message: 'Enter Card #',
              },
            ]}
            propsinput={{
              size: 'large',
            }}
          />
        </Col>
        <Col flex='50%'>
          <FormInput
            name={['nameOfCard']}
            label='Name of Card'
            rules={[
              {
                required: true,
                message: 'Enter Bank of Card',
              },
            ]}
            propsinput={{
              size: 'large',
            }}
          />
        </Col>
        <Col flex='2'>
          <FormInput
            name={['bank']}
            label='Bank of Card'
            rules={[
              {
                required: true,
                message: 'Enter Bank of Card',
              },
            ]}
            propsinput={{
              size: 'large',
            }}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col flex='50%'>
          <FormDatePicker
            name={['checkdate']}
            label='Expiry Date'
            rules={[
              {
                required: true,
                message: 'Enter Expiry Date',
              },
            ]}
            propsdatepicker={{
              size: 'large',
            }}
          />
        </Col>
        <Col flex='50%'>
          <FormInput
            name={['approvalCode']}
            label='Approval Code'
            rules={[
              {
                required: true,
                message: 'Enter  Approval Code',
              },
            ]}
            propsinput={{
              size: 'large',
            }}
          />
        </Col>
        <Col flex='100%'>
          <FormInput
            name={['posTerminalId']}
            label='POS Terminal Id'
            rules={[
              {
                required: true,
                message: 'Enter POS Terminal Id',
              },
            ]}
            propsinput={{
              size: 'large',
            }}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col flex='100%'>
          <FormSelect
            name={['acquiringBank']}
            label='Acquiring Bank'
            rules={[
              {
                required: true,
                message: 'Select Acquiring Bank',
              },
            ]}
            propsselect={{
              size: 'large',
              options: (data?.banks?.content || [])
                .filter((item: Bank) => item.acquiringBank)
                .map((item: Bank) => {
                  return {
                    label: item.bankname,
                    value: item.id,
                  }
                }),
            }}
          />
        </Col>
        <Col flex='50%'>
          <FormSelect
            name={['cardType']}
            label='Card Type'
            rules={[
              {
                required: true,
                message: 'Select Card Type',
              },
            ]}
            propsselect={{
              size: 'large',
              options: MiscCardType,
              onSelect: onSelectCardType,
            }}
          />
        </Col>
        {otherType ? (
          <Col flex='50%'>
            <FormInput
              name={['otherType']}
              label='Other Card Type'
              propsinput={{
                size: 'large',
              }}
              rules={[
                {
                  required: true,
                  message: 'Enter Card Type',
                },
              ]}
            />
          </Col>
        ) : (
          <Col flex='50%'></Col>
        )}
        <Col flex='100%'>
          <FormInputNumber
            label='Amount'
            name={['amount']}
            rules={[
              {
                required: true,
              },
            ]}
            propsinputnumber={{ size: 'large' }}
          />
        </Col>
      </Row>
    </>
  )
}

function Check() {
  return (
    <Row gutter={[16, 16]}>
      <Col flex='100%'>
        <FormInput
          name={['reference']}
          label='Check #'
          rules={[
            {
              required: true,
              message: 'Enter Check #',
            },
          ]}
          propsinput={{
            size: 'large',
          }}
        />
      </Col>
      <Col flex='100%'>
        <FormDatePicker
          name={['checkdate']}
          label='Check Date'
          rules={[
            {
              required: true,
              message: 'Enter Check Date',
            },
          ]}
          propsdatepicker={{
            size: 'large',
          }}
        />
      </Col>
      <Col flex='100%'>
        <FormInput
          name={['bank']}
          label='Bank'
          rules={[
            {
              required: true,
              message: 'Enter Bank',
            },
          ]}
          propsinput={{
            size: 'large',
          }}
        />
      </Col>
      <Col flex='100%'>
        <FormInputNumber
          label='Amount'
          name={['amount']}
          rules={[
            {
              required: true,
            },
          ]}
          propsinputnumber={{ size: 'large' }}
        />
      </Col>
    </Row>
  )
}

function BankDeposit() {
  const { data, loading } = useQuery(GET_BANKS, {
    variables: {
      filter: '',
      page: 0,
      size: 100,
    },
  })
  return (
    <>
      <Row gutter={[16, 16]}>
        <Col flex='100%'>
          <FormSelect
            name={['bankEntity']}
            label='Bank'
            rules={[
              {
                required: true,
                message: 'Select Bank',
              },
            ]}
            propsselect={{
              size: 'large',
              options: (data?.banks?.content || []).map((item: Bank) => {
                return {
                  label: item.bankname,
                  value: item.id,
                }
              }),
            }}
          />
        </Col>
        <Col flex='100%'>
          <FormInput
            name={['reference']}
            label='Remarks/Reference'
            rules={[
              {
                required: true,
                message: 'Enter Remarks/Reference',
              },
            ]}
            propsinput={{
              size: 'large',
            }}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col flex='300px'>
          <FormDatePicker
            name={['checkdate']}
            label='Clearing Date'
            rules={[
              {
                required: true,
                message: 'Enter Expiry Date',
              },
            ]}
            propsdatepicker={{
              size: 'large',
            }}
          />
        </Col>
        <Col flex='100%'>
          <FormInputNumber
            label='Amount'
            name={['amount']}
            rules={[
              {
                required: true,
              },
            ]}
            propsinputnumber={{ size: 'large' }}
          />
        </Col>
      </Row>
    </>
  )
}

function EWallet() {
  const [otherType, setOtherType] = useState(false)

  const { data, loading } = useQuery(GET_BANKS, {
    variables: {
      filter: '',
      page: 0,
      size: 100,
    },
  })

  const onSelectCardType = (e: string) => {
    setOtherType(e === 'OTHERS')
  }

  return (
    <Card title='E-Wallet' bordered={false}>
      <Row gutter={[16, 16]}>
        <Col flex='100%'>
          <FormInput
            name={['terminalId']}
            label='Terminal Id'
            rules={[
              {
                required: true,
                message: 'Enter Terminal Id',
              },
            ]}
            propsinput={{
              size: 'large',
            }}
          />
        </Col>
        <Col flex='100%'>
          <FormInput
            name={['invoiceNo']}
            label='Invoice No'
            rules={[
              {
                required: true,
                message: 'Enter Invoice No',
              },
            ]}
            propsinput={{
              size: 'large',
            }}
          />
        </Col>
        <Col flex='100%'>
          <FormInput
            name={['traceNo']}
            label='Trace No'
            rules={[
              {
                required: true,
                message: 'Enter Trace No',
              },
            ]}
            propsinput={{
              size: 'large',
            }}
          />
        </Col>
        <Col flex='100%'>
          <FormInput
            name={['reference']}
            label='Card No'
            rules={[
              {
                required: true,
                message: 'Enter Card No',
              },
            ]}
            propsinput={{
              size: 'large',
            }}
          />
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col flex='100%'>
          <FormSelect
            name={['acquiringBank']}
            label='Acquiring Bank'
            rules={[
              {
                required: true,
                message: 'Select Acquiring Bank',
              },
            ]}
            propsselect={{
              size: 'large',
              options: (data?.banks?.content || [])
                .filter((item: Bank) => item.acquiringBank)
                .map((item: Bank) => {
                  return {
                    label: item.bankname,
                    value: item.id,
                  }
                }),
            }}
          />
        </Col>
        <Col flex='100%'>
          <FormInput
            name={['approvalCode']}
            label='Approval Code'
            rules={[
              {
                required: true,
                message: 'Enter Approval Code',
              },
            ]}
            propsinput={{
              size: 'large',
            }}
          />
        </Col>
        <Col flex='100%'>
          <FormSelect
            name={['eWalletType']}
            label='E-wallet Type'
            rules={[
              {
                required: true,
                message: 'Select Acquiring Bank',
              },
            ]}
            propsselect={{
              size: 'large',
              options: MiscEWalletType,
              onSelect: onSelectCardType,
            }}
          />
        </Col>
        {otherType ? (
          <Col flex='100%'>
            <FormInput
              name={['otherType']}
              label='Other Card Type'
              propsinput={{
                size: 'large',
              }}
              rules={[
                {
                  required: true,
                  message: 'Enter Card Type',
                },
              ]}
            />
          </Col>
        ) : (
          <Col flex='100%'></Col>
        )}
        <Col flex='100%'>
          <FormInputNumber
            label='Amount'
            name={['amount']}
            rules={[
              {
                required: true,
              },
            ]}
            propsinputnumber={{ size: 'large' }}
          />
        </Col>
      </Row>
    </Card>
  )
}

function Cash() {
  return (
    <FormInputNumber
      name='amount'
      label='Amount'
      rules={[
        {
          required: true,
          message: 'Enter Card Type',
        },
      ]}
      propsinputnumber={{ size: 'large' }}
    />
  )
}

function getMethodType(type: PaymentMethodType) {
  switch (type) {
    case 'CARD':
      return <Cards />
    case 'CHECK':
      return <Check />
    case 'BANKDEPOSIT':
      return <BankDeposit />
    case 'EWALLET':
      return <EWallet />
    default:
      return <Cash />
  }
}

export default function PaymentMethodForm(props: PaymentMethodI) {
  const [form] = useForm()
  const [methodType, setMethodType] = useState<PaymentMethodType>('CASH')

  return (
    <Modal
      open
      title='Payment Method'
      okText='Add'
      onOk={() => form.submit()}
      onCancel={() => props.hide()}
    >
      <Form
        form={form}
        initialValues={{ type: methodType }}
        layout='vertical'
        onFinish={(e) => props.hide(e)}
      >
        <Row gutter={[8, 8]}>
          <Col flex='auto'>
            <FormSelect
              name='type'
              label='Type'
              rules={[
                {
                  required: true,
                  message: 'Select Type',
                },
              ]}
              propsselect={{
                size: 'large',
                options: paymentMethodTypeOptions,
                onSelect: (e) => setMethodType(e),
              }}
            />
          </Col>
        </Row>
        {getMethodType(methodType)}
      </Form>
    </Modal>
  )
}
