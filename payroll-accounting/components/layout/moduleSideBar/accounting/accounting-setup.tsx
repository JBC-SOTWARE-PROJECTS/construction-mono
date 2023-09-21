import { MenuOutlined } from '@ant-design/icons'

const AccountingSetupMenu = {
  route: {
    path: '/',
    routes: [
      {
        path: '/accounting/accounting-setup',
        name: 'Accounting Setup',
        routes: [
          {
            path: '/accounting/accounting-setup/accounting-period',
            name: 'Accounting Period',
          },
          {
            path: '/accounting/accounting-setup/parent-account',
            name: 'Parent Account',
          },
          {
            path: '/accounting/accounting-setup/sub-account',
            name: 'Sub-account',
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
