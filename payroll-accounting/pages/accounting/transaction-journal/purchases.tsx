import React from 'react'
import asyncComponent from '@/utility/asyncComponent'

const TJPurchasesPayable = asyncComponent(
  () => import('@/routes/accounting/transaction-journal/purchasesAndPayables')
)

const TJPurchasesPayablePAge = (props: any) => {
  return (
    <TJPurchasesPayable
      journalType={'PURCHASES_PAYABLES'}
      roles={props?.account?.user?.roles ?? []}
    />
  )
}

export default TJPurchasesPayablePAge
