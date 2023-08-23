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
  const { route, push } = useRouter()

  const onClick: MenuProps['onClick'] = (e) => {
    push(e.key)
  }

  return (
    <Layout>
      {/* <Sider
        style={{
          marginTop: '56px',
          height: '100vh',
          position: 'fixed',
          left: 0,
          top: 0,
          bottom: 0,
        }}
        breakpoint='lg'
        collapsedWidth='0'
        onBreakpoint={(broken) => {
          console.log(broken)
        }}
        onCollapse={(collapsed, type) => {
          console.log(collapsed, type)
        }}
      >
        <Menu
          mode='inline'
          onClick={onClick}
          defaultSelectedKeys={[route]}
          defaultOpenKeys={['sub1']}
          style={{ height: '100%', borderRight: 0 }}
          items={accountingSetupMenuItems}
        />
      </Sider> */}
      {/* <Layout className='site-layout' style={{ marginLeft: 200 }}> */}
      <Content style={{ margin: '24px 16px 0', overflow: 'initial' }}>
        {children}
      </Content>
      {/* </Layout> */}
    </Layout>
  )
}
