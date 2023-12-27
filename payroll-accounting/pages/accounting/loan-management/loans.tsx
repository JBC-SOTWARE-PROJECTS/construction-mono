import React from 'react'
import asyncComponent from '@/utility/asyncComponent'

const Loans = asyncComponent(
  () => import('@/routes/accounting/loan-management/loans')
)

const LoansPage = () => {
  return <Loans />
}

export default LoansPage
