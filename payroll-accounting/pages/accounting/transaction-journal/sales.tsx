import React from 'react'
import asyncComponent from '@/utility/asyncComponent'

const TJSales = asyncComponent(
  () => import('@/routes/accounting/transaction-journal/sales')
)

const TJSalesPAge = (props: any) => {
  return (
    <TJSales journalType={'SALES'} roles={props?.account?.user?.roles ?? []} />
  )
}

export default TJSalesPAge
