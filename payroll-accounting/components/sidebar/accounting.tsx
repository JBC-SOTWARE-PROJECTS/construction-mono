import { TDiverseTradeMenu } from '@/utility/interfaces'
import {
  AppstoreAddOutlined,
  ControlOutlined,
  HomeOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons'

const accountingMenu: TDiverseTradeMenu[] = [
  {
    title: 'Billing',
    subtitle: 'Seamlessly manage and configure your list of offices.',
    icon: <HomeOutlined className='diverse-trade-icon' />,
    path: '/accounting/billing',
  },
  {
    title: 'Cashiering',
    subtitle: 'Optimize your position list for coherent job designations.',
    icon: <ControlOutlined className='diverse-trade-icon' />,
    path: '/accounting/positions',
  },
  {
    title: 'Accounts Receivable',
    subtitle: 'Effortlessly manage and maintain your list of employees.',
    icon: <UsergroupAddOutlined className='diverse-trade-icon' />,
    path: '/accounting/employees',
  },
  {
    title: 'Accounts Payable',
    subtitle: 'Effortlessly manage and maintain your list of employees.',
    icon: <UsergroupAddOutlined className='diverse-trade-icon' />,
    path: '/accounting/employees',
  },
  {
    title: 'Loan Management',
    subtitle: 'Effortlessly manage and maintain your list of employees.',
    icon: <UsergroupAddOutlined className='diverse-trade-icon' />,
    path: '/accounting/employees',
  },
  {
    title: 'Fixed Asset',
    subtitle: 'Effortlessly manage and maintain your list of employees.',
    icon: <UsergroupAddOutlined className='diverse-trade-icon' />,
    path: '/accounting/employees',
  },
  {
    title: 'Cash Advance',
    subtitle: 'Effortlessly manage and maintain your list of employees.',
    icon: <UsergroupAddOutlined className='diverse-trade-icon' />,
    path: '/accounting/employees',
  },
  {
    title: 'Accounting Setup',
    subtitle: 'Streamline and manage your list of companies effortlessly.',
    icon: <AppstoreAddOutlined className='diverse-trade-icon' />,
    path: '/accounting/accounting-setup/accounting-period',
  },
  {
    title: 'Financial Reports',
    subtitle: 'Effortlessly manage and maintain your list of employees.',
    icon: <UsergroupAddOutlined className='diverse-trade-icon' />,
    path: '/accounting/employees',
  },
]

export default accountingMenu
