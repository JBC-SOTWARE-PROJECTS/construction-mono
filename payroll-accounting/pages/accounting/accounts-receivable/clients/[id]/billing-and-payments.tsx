import React from 'react'
import asyncComponent from '@/utility/asyncComponent'
import { useRouter } from 'next/router'

const ARAccountsSettings = asyncComponent(
  () =>
    import(
      '@/routes/accounting/accounts-receivable/clients/billing-and-payments'
    )
)

const ARAccountsSettingsPage = () => {
  const { query } = useRouter()
  const { id } = query

  return <ARAccountsSettings {...{ id: id as string }} />
}

export default ARAccountsSettingsPage
