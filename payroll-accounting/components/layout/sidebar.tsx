import {
  AppstoreAddOutlined,
  CrownFilled,
  DashboardOutlined,
  DollarOutlined,
  MoneyCollectOutlined,
  ReconciliationOutlined,
  ScheduleOutlined,
  TeamOutlined,
  SettingOutlined,
  ReadOutlined,
  FundProjectionScreenOutlined,
  BankOutlined,
  TagOutlined,
  SnippetsOutlined,
} from '@ant-design/icons'

const sideBarProps = {
  route: {
    path: '/',
    routes: [
      {
        path: '/',
        name: 'Dashboard',
        icon: <DashboardOutlined />,
        component: './Welcome',
      },
      {
        path: '/receivables-collections',
        name: 'Receivables and Collections',
        routes: [
          {
            path: '/receivables-collections/accounts-receivable',
            name: 'Accounts Receivable',
            icon: <BankOutlined />,
            routes: [
              {
                path: 'accounts',
                name: 'Accounts',
              },
              {
                path: 'invoice',
                name: 'Invoices',
              },
              {
                path: 'credit-note',
                name: 'Credit Notes',
              },
              {
                path: 'payment-posting',
                name: 'Payment Posting',
              },
            ],
          },
        ],
      },
    ],
  },
  location: {
    pathname: '/',
  },
  appList: [
    {
      icon: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
      title: 'HIS HISMK2',
      desc: 'Hospital Information System',
      url: 'https://hismk2.ace-mc-bohol.com',
    },
    {
      icon: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
      title: 'HISD3 Material Management',
      desc: 'Inventory Mangemnent System',
      url: 'https://inventory.ace-mc-bohol.com',
    },
    {
      icon: 'https://gw.alipayobjects.com/zos/rmsportal/KDpgvguMpGfqaHPjicRK.svg',
      title: 'HISD3 HR Payroll',
      desc: 'Human Resource and Payroll System',
      url: 'https://hr.ace-mc-bohol.com',
    },
  ],
}

export default sideBarProps
