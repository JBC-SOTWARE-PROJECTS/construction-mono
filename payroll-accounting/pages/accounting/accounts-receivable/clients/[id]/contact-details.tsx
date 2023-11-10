import React from 'react'
import asyncComponent from '@/utility/asyncComponent'
import { useRouter } from 'next/router'

const ARAccountsContactDetails = asyncComponent(
  () =>
    import('@/routes/accounting/accounts-receivable/clients/contact-details')
)

const ARAccountsContactDetailsPage = () => {
  const { query } = useRouter()
  const { id } = query

  return <ARAccountsContactDetails {...{ id: id as string }} />
}

export default ARAccountsContactDetailsPage
