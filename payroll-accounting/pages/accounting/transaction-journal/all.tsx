import React from 'react'
import asyncComponent from '@/utility/asyncComponent'

const TJGeneral = asyncComponent(
  () => import('@/routes/accounting/transaction-journal/all')
)

const TJGeneralPAge = (props: any) => {
  return (
    <TJGeneral journalType={'ALL'} roles={props?.account?.user?.roles ?? []} />
  )
}

export default TJGeneralPAge
