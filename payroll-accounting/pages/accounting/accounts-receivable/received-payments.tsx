import React from 'react'
import asyncComponent from '@/utility/asyncComponent'

const ARReceivedPayments = asyncComponent(
  () => import('@/routes/accounting/accounts-receivable/received-payments')
)

const ARReceivedPaymentsPAge = () => {
  return <ARReceivedPayments />
}

export default ARReceivedPaymentsPAge
