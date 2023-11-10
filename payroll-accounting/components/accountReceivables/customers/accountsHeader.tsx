import { FIND_ONE_CUSTOMER } from '@/graphql/accountReceivables/customers'
import { useFindOneReference } from '@/hooks/accountReceivables'
import { getInitials, getRandomColor } from '@/hooks/accountReceivables/commons'
import {
  ContactsOutlined,
  EditOutlined,
  MoreOutlined,
  RiseOutlined,
  ToolOutlined,
} from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import { useQuery } from '@apollo/client'
import {
  Avatar,
  Button,
  Card,
  Col,
  Divider,
  Dropdown,
  Menu,
  MenuProps,
  Row,
  Space,
  Typography,
} from 'antd'
import { useRouter } from 'next/router'
import { ReactNode, useState } from 'react'

interface AccountsProfileHeaderI {
  id: string
  children: ReactNode
  activeMenu: string
}

export default function AccountsProfileHeader(props: AccountsProfileHeaderI) {
  const { push } = useRouter()
  const { id } = props

  const [findReference, { loading: referenceLoading, data: referenceData }] =
    useFindOneReference()

  const { data, loading, refetch } = useQuery(FIND_ONE_CUSTOMER, {
    variables: {
      id,
    },
    onCompleted: ({ customer }) => {
      const { customerType, referenceId, patientId } = customer
      findReference({
        id: referenceId,
        type: customerType,
      })
    },
  })

  const { customerName, customerType, address, accountNo, otherDetails } =
    data?.customer || {
      customerName: '',
      address: '',
      accountNo: '',
      otherDetails: {},
    }

  const onClick: MenuProps['onClick'] = (e) => {
    push(`/accounting/accounts-receivable/clients/${id}/${e.key}`)
  }

  const items: MenuProps['items'] = [
    {
      label: 'Activities',
      key: 'activities',
      icon: <RiseOutlined />,
    },
    {
      label: 'Contact Details',
      key: 'contact-details',
      icon: <ContactsOutlined />,
    },
    {
      label: 'Billing & Payments',
      key: 'billing-and-payments',
      icon: <ToolOutlined />,
    },
  ]

  return (
    <PageContainer
      fixedHeader
      header={{
        title: (
          <Space>
            <Avatar
              shape='square'
              style={{
                backgroundColor: otherDetails?.color ?? getRandomColor(),
              }}
            >
              {getInitials(customerName)}
            </Avatar>
            {customerName}
          </Space>
        ),
        // extra: [
        //   <Button key='1' type='primary' icon={<EditOutlined />}>
        //     Edit
        //   </Button>,
        //   <Dropdown
        //     key='dropdown'
        //     trigger={['click']}
        //     menu={{
        //       items: [
        //         {
        //           label: 'Create Invoice',
        //           key: '1',
        //         },
        //         {
        //           label: 'Create Credit Note',
        //           key: '2',
        //         },
        //         {
        //           label: 'Create Payments',
        //           key: '3',
        //         },
        //       ],
        //     }}
        //   >
        //     <Button key='4' style={{ padding: '0 8px' }}>
        //       <MoreOutlined />
        //     </Button>
        //   </Dropdown>,
        // ],
      }}
      content={
        <Row>
          <Col span={24}>
            <Space>
              <p>{customerType}</p>
              <p>{address}</p>
            </Space>
          </Col>
          <Col span={24}>
            <Menu
              activeKey={props?.activeMenu ?? ''}
              onClick={onClick}
              mode='horizontal'
              items={items}
            />
          </Col>
        </Row>
      }
    >
      {props.children}
    </PageContainer>
  )
}
