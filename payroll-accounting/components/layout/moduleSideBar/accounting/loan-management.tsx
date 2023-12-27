import { MenuOutlined } from '@ant-design/icons'

const LoanManagementMenu = {
  route: {
    path: '/',
    routes: [
      {
        path: '/accounting/loan-management',
        name: 'Loan Management',
        routes: [
          {
            path: '/accounting/loan-management/loans',
            name: 'Loans',
          },
          {
            path: '/accounting/loan-management/bank-accounts',
            name: 'Bank Accounts',
          },
        ],
      },
    ],
  },
  location: {
    pathname: '/',
  },
}

export default LoanManagementMenu
