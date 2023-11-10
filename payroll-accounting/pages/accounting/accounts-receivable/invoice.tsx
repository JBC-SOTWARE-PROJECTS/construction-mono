import React from 'react'
import asyncComponent from '@/utility/asyncComponent'

const ARInvoice = asyncComponent(
  () => import('@/routes/accounting/accounts-receivable/invoice')
)

const ARInvoicePAge = () => {
  return <ARInvoice />
}

export default ARInvoicePAge
