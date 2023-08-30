import React from 'react'
import asyncComponent from '@/utility/asyncComponent'

const AccountingPeriod = asyncComponent(
  () => import('@/routes/accounting/accounting-setup/accounting-period')
)

const AccountingPeriodPage = () => {
  return <AccountingPeriod />
}

export default AccountingPeriodPage
