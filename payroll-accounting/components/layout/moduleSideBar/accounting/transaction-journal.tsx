import { MenuOutlined } from '@ant-design/icons'

const AccountingSetupMenu = {
  route: {
    path: '/',
    routes: [
      {
        path: '/accounting/transaction-journal',
        name: 'Accounting Setup',
        routes: [
          {
            path: '/accounting/transaction-journal/all',
            name: 'All',
          },
          {
            path: '/accounting/transaction-journal/general',
            name: 'General',
          },
          {
            path: '/accounting/transaction-journal/sales',
            name: 'Sales',
          },
          {
            path: '/accounting/transaction-journal/disbursement',
            name: 'Disbursement',
          },
          {
            path: '/accounting/transaction-journal/purchases',
            name: 'Purchase Payable',
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