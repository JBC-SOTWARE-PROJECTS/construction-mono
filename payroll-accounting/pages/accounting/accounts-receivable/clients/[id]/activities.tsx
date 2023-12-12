import React from 'react'
import asyncComponent from '@/utility/asyncComponent'
import { useRouter } from 'next/router'

const ARAccountsActivities = asyncComponent(
  () => import('@/routes/accounting/accounts-receivable/clients/activities')
)

const ARAccountsActivitiesPage = () => {
  const { query } = useRouter()
  const { id } = query

  return <ARAccountsActivities {...{ id: id as string }} />
}

export default ARAccountsActivitiesPage
