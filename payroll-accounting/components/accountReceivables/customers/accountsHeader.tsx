import { FIND_ONE_CUSTOMER } from '@/graphql/accountReceivables/customers'
import { getInitials, getRandomColor } from '@/hooks/accountReceivables/commons'
import {
  ContactsOutlined,
  EnvironmentOutlined,
  FieldNumberOutlined,
  RiseOutlined,
  TeamOutlined,
  ToolOutlined,
} from '@ant-design/icons'
import { PageContainer } from '@ant-design/pro-components'
import { useQuery } from '@apollo/client'
import {
  Avatar,
  Col,
  Divider,
  Menu,
  MenuProps,
  Row,
  Space,
  Typography,
} from 'antd'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'

interface AccountsProfileHeaderI {
  id: string
  children: ReactNode
  activeMenu: string
}

interface DetailsAndIconI {
  label: string
  icon?: ReactNode
}

const DetailsAndIcon = ({ label, icon }: DetailsAndIconI) => {
  return (
    <Typography.Link>
      <Space>
        {icon}
        {label}
      </Space>
    </Typography.Link>
  )
}

export default function AccountsProfileHeader(props: AccountsProfileHeaderI) {
  const { push } = useRouter()
  const { id } = props

  const { data, loading, refetch } = useQuery(FIND_ONE_CUSTOMER, {
    variables: {
      id,
    },
    onCompleted: ({ customer }) => {
      const { customerType, referenceId, patientId } = customer
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
      }}
      content={
        <Row gutter={[8, 8]}>
          <Col span={24}>
            <Space split={<Divider type='vertical' />}>
              <DetailsAndIcon label={customerType} icon={<TeamOutlined />} />
              <DetailsAndIcon
                label={accountNo}
                icon={<FieldNumberOutlined />}
              />
              <DetailsAndIcon label={address} icon={<EnvironmentOutlined />} />
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
