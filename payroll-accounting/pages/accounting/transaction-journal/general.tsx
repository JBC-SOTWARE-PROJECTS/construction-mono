import React from 'react'
import asyncComponent from '@/utility/asyncComponent'

const TJGeneral = asyncComponent(
  () => import('@/routes/accounting/transaction-journal/general')
)

const TJGeneralPAge = (props: any) => {
  return (
    <TJGeneral
      journalType={'GENERAL'}
      roles={props?.account?.user?.roles ?? []}
    />
  )
}

export default TJGeneralPAge
