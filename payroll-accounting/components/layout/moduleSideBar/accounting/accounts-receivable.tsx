import { MenuOutlined } from '@ant-design/icons'

const AccountingSetupMenu = {
  route: {
    path: '/',
    routes: [
      {
        path: '/accounting/accounts-receivable',
        name: 'Account Receivable',
        routes: [
          {
            path: '/accounting/accounts-receivable/invoice',
            name: 'Invoice',
          },
          {
            path: '/accounting/accounting-setup/mother-account',
            name: 'Credit Note',
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
