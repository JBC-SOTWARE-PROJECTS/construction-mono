import React from 'react'
import asyncComponent from '@/utility/asyncComponent'

const BankAccounts = asyncComponent(
  () => import('@/routes/accounting/accounting-setup/bank-accounts')
)

const BankAccountsPage = () => {
  return <BankAccounts />
}

export default BankAccountsPage
