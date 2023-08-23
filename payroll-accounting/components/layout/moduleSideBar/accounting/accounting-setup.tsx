import { MenuOutlined } from '@ant-design/icons'

const AccountingSetupMenu = {
  route: {
    path: '/',
    routes: [
      {
        path: '/accounting/accounting-setup/accounting-period',
        name: 'Accounting Period',
      },
      {
        path: '/accounting/accounting-setup/mother-account',
        name: 'Mother Account',
      },
    ],
  },
  location: {
    pathname: '/',
  },
}

export default AccountingSetupMenu
