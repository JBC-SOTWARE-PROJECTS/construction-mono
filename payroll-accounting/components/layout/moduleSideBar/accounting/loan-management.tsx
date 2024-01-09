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
        ],
      },
    ],
  },
  location: {
    pathname: '/',
  },
}

export default LoanManagementMenu
