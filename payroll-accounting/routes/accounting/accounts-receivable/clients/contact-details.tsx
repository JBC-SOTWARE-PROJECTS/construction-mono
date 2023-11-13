import { FormInput, FormInputNumber } from '@/components/common'
import { addressType } from '@/constant/accountReceivables'
import {
  CREATE_CUSTOMER,
  FIND_ONE_CUSTOMER_SETTINGS,
} from '@/graphql/accountReceivables/customers'
import asyncComponent from '@/utility/asyncComponent'
import {
  CloseOutlined,
  MinusCircleOutlined,
  PlusOutlined,
} from '@ant-design/icons'
import { ProCard } from '@ant-design/pro-components'
import { useMutation, useQuery } from '@apollo/client'
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Row,
  Select,
  Space,
  message,
} from 'antd'
import { useState } from 'react'

const AccountsProfileHeader = asyncComponent(
  () => import('@/components/accountReceivables/customers/accountsHeader')
)

interface AccountsContactDetailsI {
  id: any
}

const formItemLayout = {
  labelCol: { span: 6 },
  wrapperCol: { span: 18 },
}

export default function ARAccountsContactDetails(
  props: AccountsContactDetailsI
) {
  const { id } = props
  const [form] = Form.useForm()

  const { data, loading, refetch } = useQuery(FIND_ONE_CUSTOMER_SETTINGS, {
    variables: {
      id,
    },
    onCompleted: ({ customer }) => {
      const contacts = customer?.otherDetails?.contacts ?? []

      if (contacts) {
        form.setFieldValue(['arCustomer', 'otherDetails'], {
          contacts,
        })
      }
    },
  })

  const [onCreate, { loading: createLoading }] = useMutation(CREATE_CUSTOMER, {
    onCompleted: ({ create }) => {
      const { success, message: text } = create
      success ? message.success(text) : message.error('Error.')
    },
  })

  const onHandleFormSubmit = ({ arCustomer }: any) => {
    const contacts = arCustomer?.otherDetails?.contacts
    let otherDetails = {
      ...data?.customer?.otherDetails,
      contacts: arCustomer?.otherDetails?.contacts ?? [],
    }
    const billingContact = contacts.filter(
      (location: any) => location.type == 'BILLING'
    )
    if (billingContact)
      otherDetails = { ...otherDetails, billingContact: billingContact[0] }
    onCreate({
      variables: {
        id,
        fields: { otherDetails },
      },
    })
  }

  return (
    <AccountsProfileHeader {...{ id, activeMenu: 'contact-details' }}>
      <ProCard
        headerBordered
        title='Contact Details'
        style={{ marginTop: 20, marginBottom: 20 }}
        extra={[
          <Button key={1} type='primary' onClick={() => form.submit()}>
            Save
          </Button>,
        ]}
      >
        <div style={{ maxWidth: 600 }}>
          <Form
            form={form}
            layout='vertical'
            autoComplete='off'
            onFinish={onHandleFormSubmit}
          >
            <Form.List name={['arCustomer', 'otherDetails', 'contacts']}>
              {(fields, { add, remove }) => (
                <Space direction='vertical' style={{ width: '100%' }}>
                  {fields.map(({ key, name, ...restField }, index) => (
                    <Row key={key} wrap={false}>
                      <Col flex='0 1 20px'>{`${index + 1}.)`}</Col>
                      <Col flex='auto'>
                        <Row gutter={[8, 8]}>
                          <Col flex={3}>
                            <FormInput
                              {...restField}
                              label='Street'
                              name={[name, 'street']}
                              rules={[{ required: true }]}
                              style={{ marginBottom: 5 }}
                              propsinput={{ size: 'large' }}
                            />
                          </Col>
                          <Col flex={1}>
                            <FormInput
                              {...restField}
                              name={[name, 'barangay']}
                              label='Barangay'
                              rules={[{ required: true }]}
                              style={{ marginBottom: 5 }}
                              propsinput={{ size: 'large' }}
                            />
                          </Col>
                          <Col flex={1}>
                            <FormInput
                              {...restField}
                              name={[name, 'city']}
                              label='City'
                              rules={[{ required: true }]}
                              style={{ marginBottom: 5 }}
                              propsinput={{ size: 'large' }}
                            />
                          </Col>
                        </Row>
                        <Row gutter={[8, 8]}>
                          <Col flex={1}>
                            <FormInput
                              {...restField}
                              name={[name, 'province']}
                              label='Province'
                              rules={[{ required: true }]}
                              style={{ marginBottom: 5 }}
                              propsinput={{ size: 'large' }}
                            />
                          </Col>
                          <Col flex={1}>
                            <FormInput
                              {...restField}
                              name={[name, 'country']}
                              label='Country'
                              rules={[{ required: true }]}
                              style={{ marginBottom: 5 }}
                              propsinput={{ size: 'large' }}
                            />
                          </Col>
                          <Col flex={1}>
                            <FormInputNumber
                              {...restField}
                              name={[name, 'zipcode']}
                              label='Zip Code'
                              rules={[{ required: true }]}
                              propsinputnumber={{
                                size: 'large',
                                style: { width: '100%' },
                              }}
                            />
                          </Col>
                        </Row>
                        <Row gutter={[8, 8]}>
                          <Col flex={1}>
                            <FormInput
                              {...restField}
                              name={[name, 'phoneNo']}
                              label='Phone Number'
                              rules={[{ required: true }]}
                              style={{ marginBottom: 5 }}
                              propsinput={{ size: 'large' }}
                            />
                          </Col>
                          <Col flex={1}>
                            <FormInput
                              {...restField}
                              name={[name, 'email']}
                              label='Email Address'
                              rules={[
                                {
                                  required: true,
                                  type: 'email',
                                },
                              ]}
                              style={{ marginBottom: 5 }}
                              propsinput={{ size: 'large' }}
                            />
                          </Col>
                          <Col flex={'300px'}>
                            <Form.Item
                              {...restField}
                              name={[name, 'type']}
                              label='Contact type'
                              rules={[
                                {
                                  required: true,
                                },
                                ({ getFieldValue }) => ({
                                  validator(_, value) {
                                    const others = getFieldValue([
                                      'arCustomer',
                                      'otherDetails',
                                      'contacts',
                                    ]).filter(
                                      ({ type }: any, i: number) => i != name
                                    )

                                    const existing = (others ?? []).map(
                                      ({ type }: any) => type
                                    )

                                    if (existing.includes(value)) {
                                      return Promise.reject(
                                        new Error('Address already exist!')
                                      )
                                    }

                                    return Promise.resolve()
                                  },
                                }),
                              ]}
                            >
                              <Select size='large' options={addressType} />
                            </Form.Item>
                          </Col>
                        </Row>
                      </Col>
                      <Col flex='0 1 50px'>
                        <Button
                          type='dashed'
                          onClick={() => remove(name)}
                          style={{ marginLeft: 25 }}
                          icon={<CloseOutlined />}
                          size='small'
                          danger
                        />
                      </Col>

                      {/* </Space> */}
                    </Row>
                  ))}
                  <Form.Item>
                    <Button
                      onClick={() => {
                        add()
                      }}
                      block
                      icon={<PlusOutlined />}
                    >
                      Add Address
                    </Button>
                  </Form.Item>
                </Space>
              )}
            </Form.List>
          </Form>
        </div>
      </ProCard>
    </AccountsProfileHeader>
  )
}
