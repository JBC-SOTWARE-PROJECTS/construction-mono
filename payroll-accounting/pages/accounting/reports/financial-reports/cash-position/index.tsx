import React from 'react'
import asyncComponent from '@/utility/asyncComponent'

const CashPosition = asyncComponent(
  () => import('@/routes/accounting/reports/financial-reports/report-generator')
)

const CashPositionPage = () => {
  return <CashPosition reportType='CASH_POSITION' />
}

export default CashPositionPage
