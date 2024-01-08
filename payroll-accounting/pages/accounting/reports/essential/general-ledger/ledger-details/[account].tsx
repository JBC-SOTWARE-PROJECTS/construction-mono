import React from 'react'
import asyncComponent from '@/utility/asyncComponent'

const GeneralLedgerDetails = asyncComponent(
  () =>
    import(
      '@/routes/accounting/reports/essential/general-ledger/ledger-details'
    )
)

const GeneralLedgerDetailsPage = (props: any) => {
  return <GeneralLedgerDetails />
}

export default GeneralLedgerDetailsPage
