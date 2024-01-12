import React from 'react'
import asyncComponent from '@/utility/asyncComponent'

const BalanceSheetLayout = asyncComponent(
  () =>
    import(
      '@/routes/accounting/reports/financial-reports/report-generator/layout'
    )
)

const BalanceSheetLayoutPage = (props: any) => {
  return <BalanceSheetLayout />
}

export default BalanceSheetLayoutPage
