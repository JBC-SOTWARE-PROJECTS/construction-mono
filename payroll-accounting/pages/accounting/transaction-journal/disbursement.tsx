import React from 'react'
import asyncComponent from '@/utility/asyncComponent'

const TJDisbursement = asyncComponent(
  () => import('@/routes/accounting/transaction-journal/disbursement')
)

const TJDisbursementPAge = (props: any) => {
  return (
    <TJDisbursement
      journalType={'DISBURSEMENT'}
      roles={props?.account?.user?.roles ?? []}
    />
  )
}

export default TJDisbursementPAge
