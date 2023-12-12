import React from 'react'
import asyncComponent from '@/utility/asyncComponent'

const ARClients = asyncComponent(
  () => import('@/routes/accounting/accounts-receivable/clients')
)

const ARClientsPAge = () => {
  return <ARClients />
}

export default ARClientsPAge
