import { MenuOutlined } from '@ant-design/icons'

const AccountingSetupMenu = {
  route: {
    path: '/',
    routes: [
      {
        path: '/accounting/accounts-receivable',
        name: 'Accounts Receivable',
        routes: [
          {
            path: '/accounting/accounts-receivable/clients',
            name: 'Clients',
          },
          {
            path: '/accounting/accounts-receivable/invoice',
            name: 'Invoice',
          },
          {
            path: '/accounting/accounts-receivable/configurations',
            name: 'Configurations',
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
