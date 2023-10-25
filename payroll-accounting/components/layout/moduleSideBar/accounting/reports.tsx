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
    ],
  },
  location: {
    pathname: '/',
  },
}

export default AccountingSetupMenu
