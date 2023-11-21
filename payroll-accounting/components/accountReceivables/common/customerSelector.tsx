import { useFindCustomers } from '@/hooks/accountReceivables'
import { getInitials, getRandomColor } from '@/hooks/accountReceivables/commons'
import { UserOutlined } from '@ant-design/icons'
import { Avatar, Form, FormInstance, Input, Select, Space, Spin } from 'antd'
import React from 'react'

const { Option } = Select
interface CustomerSelectorI {
  form?: FormInstance<any>
  id?: string
  onSelect?: (props: string) => void
  onCancel?: (props?: any) => void
  disabled?: boolean
  restProps?: any
  loading?: boolean
  readonly?: boolean
  defaultValue: string
  customerType: string[] | []
}

const CustomerSelector = (props: CustomerSelectorI) => {
  const {
    id,
    defaultValue,
    customerType,
    onSelect,
    onCancel,
    disabled,
    restProps,
  } = props
  const {
    content: customerOpt,
    loading: customerLoading,
    refetch: refetchCustomer,
  } = useFindCustomers({
    search: '',
    page: 0,
    size: 10,
    type: customerType ?? [],
  })

  const onHandleSearchCustomer = (value: any) => {
    refetchCustomer({
      search: value,
    })
  }

  const onHandleSelect = (e: string) => {
    if (onSelect) onSelect(e)
  }

  return props?.readonly ? (
    <>
      <label>To Account</label>
      <Input
        style={{ marginTop: '5px' }}
        value={defaultValue ?? ''}
        size='large'
        readOnly
      />
    </>
  ) : (
    <Form.Item
      {...{
        label: 'To Client',
        name: 'customerId',
        required: true,
        tooltip:
          'Please search their name here; this is also a required field.',
      }}
      style={{ marginBottom: '6px', fontWeight: 'bolder' }}
    >
      <Select
        {...{
          size: 'large',
          optionLabelProp: 'label',
          children: (customerOpt || []).map((customer, index) => (
            <Option
              key={customer?.id ?? `key-${index}`}
              value={customer?.id}
              label={customer?.customerName}
            >
              <Space>
                <Avatar
                  shape='square'
                  style={{
                    backgroundColor:
                      customer?.otherDetails?.color ?? getRandomColor(),
                  }}
                >
                  {getInitials(customer?.customerName ?? '')}
                </Avatar>
                {customer?.customerName}
              </Space>
            </Option>
          )),
          notFoundContent: customerLoading ? <Spin size='small' /> : null,
          showSearch: true,
          suffixIcon: <UserOutlined style={{ fontSize: '20px' }} />,
          onSearch: (e) => onHandleSearchCustomer(e),
          onSelect: (e) => onHandleSelect(e),
          loading: customerLoading,
          filterOption: false,
          style: { minWidth: 300 },
          disabled,
          virtual: true,
          ...restProps,
        }}
      />
    </Form.Item>
  )
}

export default React.memo(CustomerSelector)
