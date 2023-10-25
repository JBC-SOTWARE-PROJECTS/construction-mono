import React from 'react'
import asyncComponent from '@/utility/asyncComponent'

const TJReceipts = asyncComponent(
  () => import('@/routes/accounting/transaction-journal/receipts')
)

const TJReceiptsPAge = (props: any) => {
  return (
    <TJReceipts
      journalType={'RECEIPTS'}
      roles={props?.account?.user?.roles ?? []}
    />
  )
}

export default TJReceiptsPAge
