import { TDiverseTradeMenu } from '@/utility/interfaces'
import {
  AppstoreAddOutlined,
  ControlOutlined,
  DiffOutlined,
  FieldTimeOutlined,
  PayCircleOutlined,
  UsergroupAddOutlined,
} from '@ant-design/icons'

const accountingMenu: TDiverseTradeMenu[] = [
  {
    title: 'Billing Portfolio Control Center',
    subtitle: 'Effortlessly manage and oversee your list of billing records.',
    icon: <DiffOutlined className='diverse-trade-icon' />,
    path: '/accounting/billing',
  },
  {
    title: 'Over the Counter (OTC) Transactions',
    subtitle: 'Effortlessly manage and oversee your list of OTC records.',
    icon: <FieldTimeOutlined className='diverse-trade-icon' />,
    path: '/accounting/otc',
  },
  {
    title: 'Financial Point of Service (Cashier)',
    subtitle: 'Provide a reliable point of service for monetary interactions.',
    icon: <ControlOutlined className='diverse-trade-icon' />,
    path: '/accounting/cashier/accounts',
  },
  {
    title: 'Accounts Receivable',
    subtitle: 'Effortlessly manage and maintain your list of employees.',
    icon: <UsergroupAddOutlined className='diverse-trade-icon' />,
    path: '/accounting/accounts-receivable/invoice',
  },
  {
    title: 'Accounts Payable',
    subtitle: 'Monitor and control payment processes and transactions.',
    icon: <PayCircleOutlined className='diverse-trade-icon' />,
    path: '/accounting/accounts-payable/payables',
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
    title: 'Transaction Journal',
    subtitle:
      'Record of all financial activities in a business, documenting each entry before it goes into the general ledger.',
    icon: <UsergroupAddOutlined className='diverse-trade-icon' />,
    path: '/accounting/transaction-journal/all',
  },
  {
    title: 'Financial Reports',
    subtitle: 'Effortlessly manage and maintain your list of employees.',
    icon: <UsergroupAddOutlined className='diverse-trade-icon' />,
    path: '/accounting/employees',
  },
]

export default accountingMenu
