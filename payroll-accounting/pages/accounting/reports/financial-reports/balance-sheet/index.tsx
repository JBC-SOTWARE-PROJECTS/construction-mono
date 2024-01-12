import React from 'react'
import asyncComponent from '@/utility/asyncComponent'

const BalanceSheet = asyncComponent(
  () => import('@/routes/accounting/reports/financial-reports/report-generator')
)

const BalanceSheetPage = () => {
  return <BalanceSheet reportType='BALANCE_SHEET' />
}

export default BalanceSheetPage
