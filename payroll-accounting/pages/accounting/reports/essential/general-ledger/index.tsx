import React from 'react'
import asyncComponent from '@/utility/asyncComponent'

const GeneralLedger = asyncComponent(
  () => import('@/routes/accounting/reports/essential/general-ledger')
)

const GeneralLedgerPage = (props: any) => {
  return <GeneralLedger />
}

export default GeneralLedgerPage
