import React from 'react'
import asyncComponent from '@/utility/asyncComponent'

const ParentAccount = asyncComponent(
  () => import('@/routes/accounting/accounting-setup/accounting-period')
)

const ParentAccountPage = () => {
  return <ParentAccount />
}

export default ParentAccountPage
