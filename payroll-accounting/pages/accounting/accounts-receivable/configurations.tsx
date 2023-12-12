import React from 'react'
import asyncComponent from '@/utility/asyncComponent'

const ARConfiguration = asyncComponent(
  () => import('@/routes/accounting/accounts-receivable/configurations')
)

const ARConfigurationPAge = () => {
  return <ARConfiguration />
}

export default ARConfigurationPAge
