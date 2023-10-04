import React from 'react'
import asyncComponent from '@/utility/asyncComponent'

const Integrations = asyncComponent(
  () => import('@/routes/accounting/accounting-setup/integrations')
)

const IntegrationsPage = () => {
  return <Integrations />
}

export default IntegrationsPage
