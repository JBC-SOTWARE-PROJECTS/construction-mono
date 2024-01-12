import React from 'react'
import asyncComponent from '@/utility/asyncComponent'

const ProfitAndLossLayout = asyncComponent(
  () =>
    import(
      '@/routes/accounting/reports/financial-reports/report-generator/layout'
    )
)

const ProfitAndLossLayoutPage = (props: any) => {
  return <ProfitAndLossLayout />
}

export default ProfitAndLossLayoutPage
