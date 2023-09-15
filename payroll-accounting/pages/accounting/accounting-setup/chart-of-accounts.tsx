import React from 'react'
import asyncComponent from '@/utility/asyncComponent'

const ChartOfAccounts = asyncComponent(
  () => import('@/routes/accounting/accounting-setup/chart-of-accounts')
)

const ChartOfAccountsPage = () => {
  return <ChartOfAccounts />
}

export default ChartOfAccountsPage
