import React from 'react'
import asyncComponent from '@/utility/asyncComponent'

const TerminalSetupComponent = asyncComponent(
  () => import('@/routes/accounting/cashier/terminals')
)

const TerminalSetup = () => {
  return <TerminalSetupComponent />
}

export default TerminalSetup
