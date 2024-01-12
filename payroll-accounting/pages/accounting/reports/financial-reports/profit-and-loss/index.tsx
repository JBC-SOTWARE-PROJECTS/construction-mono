import React from 'react'
import asyncComponent from '@/utility/asyncComponent'

const ProfitAndLoss = asyncComponent(
  () => import('@/routes/accounting/reports/financial-reports/report-generator')
)

const ProfitAndLossPage = () => {
  return <ProfitAndLoss reportType='PROFIT_AND_LOSS' />
}

export default ProfitAndLossPage
