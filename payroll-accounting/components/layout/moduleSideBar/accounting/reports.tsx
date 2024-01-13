import { MenuOutlined } from '@ant-design/icons'

const AccountingSetupMenu = {
  route: {
    path: '/',
    routes: [
      {
        path: '/accounting/reports/essential',
        name: 'Essential Financial Documentation',
        routes: [
          {
            path: '/accounting/reports/essential/general-ledger',
            name: 'General Ledger',
          },
          {
            path: '/accounting/reports/essential/trial-balance',
            name: 'Trial Balance',
          },
        ],
      },
      {
        path: '/accounting/reports/financial',
        name: 'Financial Reports',
        routes: [
          {
            path: '/accounting/reports/financial-reports/profit-and-loss',
            name: 'Profit & Loss',
          },
          {
            path: '/accounting/reports/financial-reports/balance-sheet',
            name: 'Balance Sheet',
          },
          {
            path: '/accounting/reports/financial-reports/cash-position',
            name: 'Cash Flow',
          },
        ],
      },
    ],
  },
  location: {
    pathname: '/',
  },
}

export default AccountingSetupMenu
