import { FIND_ALL_CUSTOMERS } from '@/graphql/accountReceivables/customers'
import { ArCustomers } from '@/graphql/gql/graphql'
import { useFindCustomers } from '@/hooks/accountReceivables'
import { getInitials, getRandomColor } from '@/hooks/accountReceivables/commons'
import { UserOutlined } from '@ant-design/icons'
import { gql, useLazyQuery, useQuery } from '@apollo/client'
import { Avatar, Form, FormInstance, Input, Select, Space, Spin } from 'antd'
import { OptionProps } from 'antd/es/select'
import React from 'react'

const GET_CUSTOMER_OPT = gql`
  query ($search: String, $page: Int, $size: Int, $type: [String]) {
    option: findAllCustomers(
      search: $search
      page: $page
      size: $size
      type: $type
    ) {
      content {
        id
        customerName
        otherDetails {
          color
        }
      }
    }
  }
`

const { Option } = Select
interface CustomerSelectorI {
  onSelect?: (props: string) => void
  disabled?: boolean
  restProps?: any
  loading?: boolean
  customerType: string[] | []
  label?: string
  name?: string
}

const Selector = (props: CustomerSelectorI) => {
  const { customerType, onSelect, disabled, restProps } = props

  const [onFindCustomer, { data, loading, refetch, fetchMore }] =
    useLazyQuery(GET_CUSTOMER_OPT)

  const onHandleSearchCustomer = (value: any) => {
    refetch({ search: value })
  }

  const onHandleFocus = () => {
    onFindCustomer({
      variables: {
        search: '',
        page: 0,
        size: 10,
        type: customerType,
      },
    })
  }

  const onHandleSelect = (e: string) => {
    if (onSelect) onSelect(e)
  }

  return (
    <Form.Item
      {...{
        label: props?.label ?? 'To Client',
        name: props?.name ?? 'customerId',
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
          children: (data?.option?.content || []).map(
            (opt: ArCustomers, index: number) => (
              <Option
                key={opt?.id ?? `key-${index}`}
                value={opt.id}
                label={opt.customerName}
              >
                <Space>
                  <Avatar
                    shape='square'
                    style={{
                      backgroundColor:
                        opt?.otherDetails?.color ?? getRandomColor(),
                    }}
                  >
                    {getInitials(opt?.customerName ?? '')}
                  </Avatar>
                  {opt?.customerName}
                </Space>
              </Option>
            )
          ),
          notFoundContent: loading ? <Spin size='small' /> : null,
          showSearch: true,
          suffixIcon: <UserOutlined style={{ fontSize: '20px' }} />,
          onSearch: (e) => onHandleSearchCustomer(e),
          onSelect: (e) => onHandleSelect(e),
          onFocus: () => onHandleFocus(),
          loading: loading,
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

export default React.memo(Selector)
