import { UserOutlined } from '@ant-design/icons'
import { Layout, Menu, MenuProps } from 'antd'
import { useRouter } from 'next/router'
import { ReactNode } from 'react'
const { Sider, Content } = Layout

const accountingSetupMenuItems: MenuProps['items'] = [
  {
    key: '/accounting/accounting-setup/accounting-period',
    icon: <UserOutlined />,
    label: 'Accounting Period',
  },
]

interface AccountingSetupSideBarI {
  children: ReactNode
}

export default function AccountingSetupSideBar({
  children,
}: AccountingSetupSideBarI) {
  return (
    <Layout>
      <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
        {children}
      </Content>
    </Layout>
  )
}
