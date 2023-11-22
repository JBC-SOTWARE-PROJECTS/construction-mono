import React from 'react'
import asyncComponent from '@/utility/asyncComponent'

const ARCreditNote = asyncComponent(
  () => import('@/routes/accounting/accounts-receivable/credit-note')
)

const ARCreditNotePAge = () => {
  return <ARCreditNote />
}

export default ARCreditNotePAge
